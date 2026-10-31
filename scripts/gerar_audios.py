"""Gera, com voz neural, um MP3 para cada texto que a leitura por áudio pode ler nas páginas do site.

Os arquivos ficam em assets/audio/leitura/<hash>.mp3 e a lista em assets/audio/leitura/indice.json.
O js/leitura-hover.js calcula o mesmo hash do texto sob o mouse e toca o MP3 correspondente; se não
houver um (texto que muda na hora, como os resultados dos simuladores), usa a voz do navegador.
Os títulos de dados/noticias.json também ganham áudio.

Roda pelo GitHub Actions (.github/workflows/audios.yml) sempre que uma página ou as notícias mudam. Só gera os textos
novos e apaga os que não aparecem mais. Usa o edge-tts (gratuito, sem chave).

Uso local:  pip install edge-tts && python3 scripts/gerar_audios.py
"""
import asyncio
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

import edge_tts

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "assets" / "audio" / "leitura"
INDICE = PASTA / "indice.json"

VOZ = "pt-BR-FranciscaNeural"
VELOCIDADE = "+5%"
MAXIMO_CARACTERES = 1500
SIMULTANEOS = 4

# Mesmos elementos do SELETOR_LEITURA em js/leitura-hover.js (input/select/textarea ficam com a voz
# do navegador, porque o texto deles depende do <label>).
LIDOS = {"a", "button", "label", "summary", "h1", "h2", "h3", "h4", "h5", "h6", "p", "li",
         "dt", "dd", "th", "td", "figcaption", "blockquote"}
BLOCOS = LIDOS | {"div", "section", "article", "header", "footer", "nav", "main", "aside", "ul",
                  "ol", "dl", "table", "tr", "thead", "tbody", "figure", "form", "fieldset", "br",
                  "hr", "details"}
IGNORADOS = {"script", "style", "template", "noscript", "svg"}
VAZIOS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source",
          "track", "wbr"}


def normalizar(texto):
    return re.sub(r"\s+", " ", texto).strip()


def hash_texto(texto):
    """FNV-1a de 32 bits sobre os bytes UTF-8 — igual ao hashTexto() do js/leitura-hover.js."""
    h = 0x811C9DC5
    for byte in texto.encode("utf-8"):
        h ^= byte
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


class Coletor(HTMLParser):
    """Junta o texto de cada elemento lido, aproximando o innerText do navegador."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha = []  # [tag, partes, rótulo]
        self.ignorando = 0
        self.textos = set()

    def _escrever(self, texto):
        for item in self.pilha:
            item[1].append(texto)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if self.ignorando or tag in IGNORADOS or "hidden" in attrs or attrs.get("aria-hidden") == "true":
            if tag not in VAZIOS:
                self.ignorando += 1
            return
        if tag == "img":
            if attrs.get("alt"):
                self.textos.add(normalizar(attrs["alt"]))
            return
        if tag in BLOCOS:
            self._escrever(" ")
        if attrs.get("aria-label"):
            self.textos.add(normalizar(attrs["aria-label"]))
        if tag not in VAZIOS:
            self.pilha.append([tag, [], attrs.get("aria-label")])

    def handle_endtag(self, tag):
        if self.ignorando:
            if tag not in VAZIOS:
                self.ignorando -= 1
            return
        if tag in VAZIOS:
            return
        while self.pilha:
            atual, partes, rotulo = self.pilha.pop()
            if atual in LIDOS and not rotulo:
                self.textos.add(normalizar("".join(partes)))
            if atual == tag:
                break
        if tag in BLOCOS:
            self._escrever(" ")

    def handle_data(self, data):
        if not self.ignorando:
            self._escrever(data)


def coletar_textos():
    textos = set()
    for pagina in sorted(RAIZ.glob("*.html")):
        coletor = Coletor()
        coletor.feed(pagina.read_text(encoding="utf-8"))
        textos |= coletor.textos
    noticias = RAIZ / "dados" / "noticias.json"
    if noticias.exists():
        dados = json.loads(noticias.read_text(encoding="utf-8"))
        textos |= {normalizar(item["titulo"]) for item in dados.get("noticias", [])}
    return {t for t in textos if re.search(r"[A-Za-zÀ-ÿ0-9]", t) and len(t) <= MAXIMO_CARACTERES}


async def gerar(texto, destino, limite):
    async with limite:
        temporario = destino.with_suffix(".tmp")
        for tentativa in range(3):
            try:
                await edge_tts.Communicate(texto, VOZ, rate=VELOCIDADE).save(str(temporario))
                temporario.replace(destino)
                return
            except Exception as erro:  # rede instável: tenta de novo
                if tentativa == 2:
                    print(f"Falhou: {texto[:60]!r} ({erro})", file=sys.stderr)
                await asyncio.sleep(2)


async def main():
    PASTA.mkdir(parents=True, exist_ok=True)
    por_hash = {hash_texto(t): t for t in coletar_textos()}

    faltando = {h: t for h, t in por_hash.items() if not (PASTA / f"{h}.mp3").exists()}
    limite = asyncio.Semaphore(SIMULTANEOS)
    await asyncio.gather(*(gerar(t, PASTA / f"{h}.mp3", limite) for h, t in faltando.items()))

    removidos = 0
    for arquivo in PASTA.glob("*.mp3"):
        if arquivo.stem not in por_hash:
            arquivo.unlink()
            removidos += 1

    prontos = sorted(h for h in por_hash if (PASTA / f"{h}.mp3").exists())
    INDICE.write_text(json.dumps({"voz": VOZ, "audios": prontos}, ensure_ascii=False) + "\n",
                      encoding="utf-8")
    print(f"{len(prontos)} áudios ({len(faltando)} novos, {removidos} removidos).")


if __name__ == "__main__":
    asyncio.run(main())
