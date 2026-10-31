"""Coleta notícias de finanças pessoais em feeds RSS e grava dados/noticias.json.

Roda todo dia pelo GitHub Actions (.github/workflows/noticias.yml). Usa só a biblioteca padrão.
Guarda apenas título, fonte, data e link — o texto das matérias fica no site de cada veículo.

Uso local:  python3 scripts/atualizar_noticias.py
"""
import json
import re
import sys
import time
import unicodedata
import urllib.request
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from xml.etree import ElementTree

RAIZ = Path(__file__).resolve().parent.parent
ARQUIVO = RAIZ / "dados" / "noticias.json"

DIAS_GUARDADOS = 14
MAXIMO = 80

FEEDS = [
    ("Agência Brasil", "https://agenciabrasil.ebc.com.br/rss/economia/feed.xml"),
    ("g1", "https://g1.globo.com/rss/g1/economia/"),
    ("InfoMoney", "https://www.infomoney.com.br/feed/"),
    # Busca do Google Notícias: a fonte real vem na tag <source> de cada item
    (None, "https://news.google.com/rss/search?q=%22educa%C3%A7%C3%A3o+financeira%22+OR+endividamento"
           "+OR+inadimpl%C3%AAncia+OR+%22golpe+do+pix%22+OR+%22juros+do+cart%C3%A3o%22+when:2d"
           "&hl=pt-BR&gl=BR&ceid=BR:pt-419"),
]

# Tema -> palavras-chave (sem acento, minúsculas). A notícia precisa casar com algum tema.
TEMAS = {
    "Dívidas e crédito": ["divida", "endivid", "inadimpl", "juros", "cartao de credito", "rotativo",
                          "credito", "desenrola", "serasa", "nome sujo", "emprestimo", "consignado"],
    "Golpes e apostas": ["golpe", "fraude", " bets ", " bet ", "apostas online", "casas de apostas", "apostador", "estelionato"],
    "Guardar e investir": ["poupanca", "tesouro direto", "tesouro selic", "cdb", "reserva de emergencia",
                           "educacao financeira", "investir", "investimento"],
    "Renda e benefícios": ["salario minimo", "bolsa familia", "beneficio", "inss", "auxilio", "fgts",
                           "13o salario", "decimo terceiro", "imposto de renda", "pe de meia"],
    "Preços e consumo": ["inflacao", "ipca", "cesta basica", "conta de luz", "tarifa", "gasolina",
                         "consumidor", "procon", "preco dos alimentos"],
}


# Manchetes de macroeconomia, empresas ou exterior não ajudam quem cuida do orçamento da casa
BLOQUEIO = ["divida publica", "fiscal", "contas publicas", "deficit", "pib", "credores", "debenture",
            "titulos de divida", " clo ", "ibovespa", "dolar", " eua ", "estados unidos", "china",
            "recuperacao judicial", "balanco", "lucro", "acionista", "rating", "bolsa de valores", "trimestre",
            "acoes da", "acoes do", "petrobras", "microsoft", " fed ", "mega sena", "loteria", "halloween"]

# Veículos aceitos vindos da busca do Google Notícias (mesmo critério da página Dados e fontes)
VEICULOS = {"agencia brasil", "g1", "valor economico", "uol", "folha de s paulo", "folha", "estadao",
            "o globo", "cnn brasil", "infomoney", "exame", "poder360", "correio braziliense", "metropoles",
            "veja", "bbc", "bbc news brasil", "gazeta do povo", "cartacapital", "agencia senado", "agencia camara",
            "agencia gov", "gov br", "banco central do brasil", "serasa", "estado de minas", "terra", "band",
            "sbt news", "r7", "seu dinheiro", "times brasil", "mercado consumo", "canaltech", "tecnoblog",
            "istoe dinheiro", "o povo", "jornal do commercio", "zero hora", "gzh", "nexo jornal", "agencia estado"}


def normalizar(texto):
    """Minúsculas, sem acento e pontuação virando espaço: "Mega-Sena!" -> " mega sena "."""
    sem_acento = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return " " + " ".join(re.sub(r"[^a-z0-9]+", " ", sem_acento.lower()).split()) + " "


def classificar(titulo):
    t = normalizar(titulo)
    if any(b in t for b in BLOQUEIO):
        return None
    for tema, palavras in TEMAS.items():
        if any(p in t for p in palavras):
            return tema
    return None


def baixar(url, tentativas=3):
    pedido = urllib.request.Request(url, headers={"User-Agent": "CadaReal/1.0 (+https://yagoxavier10.github.io/cada-real/)",
                                                  "Accept-Encoding": "identity"})
    for tentativa in range(tentativas):
        try:
            with urllib.request.urlopen(pedido, timeout=30) as resposta:
                corpo = resposta.read()
            if corpo.lstrip().startswith(b"<"):
                return corpo
        except OSError:
            if tentativa == tentativas - 1:
                raise
        time.sleep(3)
    raise ValueError("resposta não é XML")


def ler_feed(fonte_padrao, url):
    raiz = ElementTree.fromstring(baixar(url))
    for item in raiz.iter("item"):
        titulo = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        data_texto = item.findtext("pubDate")
        if not titulo or not link.startswith("http") or not data_texto:
            continue
        fonte = fonte_padrao or (item.findtext("source") or "").strip()
        if not fonte or (fonte_padrao is None and normalizar(fonte).strip() not in VEICULOS):
            continue
        if fonte.lower() == "g1":
            fonte = "g1"
        # Títulos do Google Notícias terminam com " - Nome do veículo"
        if fonte_padrao is None:
            titulo = re.sub(rf"\s+-\s+({re.escape(fonte)}|G1)$", "", titulo).strip()
        try:
            data = parsedate_to_datetime(data_texto).astimezone(timezone.utc)
        except (TypeError, ValueError):
            continue
        yield {"titulo": re.sub(r"\s+", " ", titulo), "link": link, "fonte": fonte,
               "data": data.strftime("%Y-%m-%dT%H:%M:%SZ")}


def chave(noticia):
    # Evita a mesma manchete repetida por feeds diferentes
    return re.sub(r"[^a-z0-9]", "", normalizar(noticia["titulo"]))[:80]


def main():
    agora = datetime.now(timezone.utc)
    limite = (agora - timedelta(days=DIAS_GUARDADOS)).strftime("%Y-%m-%dT%H:%M:%SZ")

    existentes = []
    if ARQUIVO.exists():
        existentes = json.loads(ARQUIVO.read_text(encoding="utf-8")).get("noticias", [])

    novas, falhas = [], 0
    for fonte, url in FEEDS:
        try:
            for noticia in ler_feed(fonte, url):
                tema = classificar(noticia["titulo"])
                if tema:
                    noticia["tema"] = tema
                    novas.append(noticia)
        except Exception as erro:  # um feed fora do ar não derruba os outros
            falhas += 1
            print(f"Aviso: falha ao ler {fonte or 'Google Notícias'}: {erro}", file=sys.stderr)

    if falhas == len(FEEDS):
        sys.exit("Nenhum feed pôde ser lido.")

    unicas = {}
    for noticia in existentes + novas:
        if noticia["data"] < limite or noticia["data"] > agora.strftime("%Y-%m-%dT%H:%M:%SZ"):
            continue
        k = chave(noticia)
        # Mesma manchete com um trecho a mais ("Conta de luz: Aneel mantém..." x "Aneel mantém...")
        if any(k in outra or outra in k for outra in unicas):
            continue
        unicas[k] = noticia

    lista = sorted(unicas.values(), key=lambda n: n["data"], reverse=True)[:MAXIMO]
    links_antigos = {n["link"] for n in existentes}
    adicionadas = sum(1 for n in lista if n["link"] not in links_antigos)

    # Só reescreve o arquivo (e muda a data) quando entra notícia nova ou alguma sai
    if adicionadas == 0 and len(lista) == len(existentes):
        print("Nenhuma notícia nova.")
        return

    ARQUIVO.parent.mkdir(exist_ok=True)
    ARQUIVO.write_text(json.dumps({"atualizado": agora.strftime("%Y-%m-%dT%H:%M:%SZ"), "noticias": lista},
                                  ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(lista)} notícias no arquivo, {adicionadas} novas.")


if __name__ == "__main__":
    main()
