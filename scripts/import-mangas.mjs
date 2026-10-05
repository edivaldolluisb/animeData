// Importa o export de mangás (formato "### Secção" / "# Título" / links) para dados/mangas.json.
// Completa capa, títulos e total de capítulos pela API do AniList (ou MangaUpdates quando não há AniList)
// e mantém o que já estava em mangas.json: capítulo lido (cap), status, e entradas que não estão no export.
// Uso: node scripts/import-mangas.mjs <ficheiro-exportado.txt>
import { readFileSync, writeFileSync } from 'node:fs';

const ficheiro = process.argv[2];
if (!ficheiro) {
    console.error('Uso: node scripts/import-mangas.mjs <ficheiro-exportado.txt>');
    process.exit(1);
}

const STATUS = {
    'Reading': 'Lendo', 'Completed': 'Completo', 'Plan to Read': 'Pretendo Ler',
    'Dropped': 'Dropado', 'On Hold': 'Em Pausa', 'Paused': 'Em Pausa', 'Re-reading': 'Lendo',
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const numId = (texto, re) => Number((re.exec(texto) || [])[1]) || null;

// ── 1. Export ──
const exportados = [];
let secao = null;
for (const linha of readFileSync(ficheiro, 'utf8').split(/\r?\n/)) {
    if (linha.startsWith('### ')) secao = linha.slice(4).trim();
    else if (linha.startsWith('# ')) exportados.push({ nome: linha.slice(2).trim(), secao, links: [] });
    else if (linha.startsWith('http') && exportados.length) exportados.at(-1).links.push(linha.trim());
}
for (const e of exportados) {
    const links = e.links.join(' ');
    e.mal = numId(links, /myanimelist\.net\/manga\/(\d+)/);
    e.anilist = numId(links, /anilist\.co\/manga\/(\d+)/);
    e.mangaupdates = (/mangaupdates\.com\/series\/([a-z0-9]+)/.exec(links) || [])[1] || null;
}

// ── 2. AniList (50 por pedido) ──
const anilist = new Map();
const ids = exportados.map(e => e.anilist).filter(Boolean);
for (let i = 0; i < ids.length; i += 50) {
    const r = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            query: `query ($ids: [Int]) { Page(perPage: 50) { media(id_in: $ids, type: MANGA) {
                id idMal title { romaji english } synonyms coverImage { extraLarge large } chapters } } }`,
            variables: { ids: ids.slice(i, i + 50) },
        }),
    });
    if (!r.ok) throw new Error(`AniList HTTP ${r.status}`);
    for (const m of (await r.json()).data.Page.media) anilist.set(m.id, m);
    await sleep(2500);
}

// ── 3. MangaUpdates para quem não tem AniList ──
const mangaupdates = new Map();
for (const e of exportados.filter(e => !e.anilist && e.mangaupdates)) {
    const r = await fetch(`https://api.mangaupdates.com/v1/series/${parseInt(e.mangaupdates, 36)}`);
    if (r.ok) mangaupdates.set(e.mangaupdates, await r.json());
    await sleep(1000);
}

// ── 4. Juntar com o mangas.json atual ──
const atual = JSON.parse(readFileSync('dados/mangas.json', 'utf8')).mangas;
const nomesDe = m => [m.Nome_jp, ...String(m.Nome_eng || '').split(';')].map(norm).filter(Boolean);
const usados = new Set();

function encontrarAtual(e, chaves) {
    // primeiro por ids guardados (imports anteriores), depois por qualquer título conhecido
    return atual.find(m => !usados.has(m) && (
        (e.anilist && m.anilist === e.anilist) || (e.mal && m.mal === e.mal) ||
        nomesDe(m).some(n => chaves.has(n))));
}

const mangas = exportados.map(e => {
    const a = anilist.get(e.anilist);
    const mu = mangaupdates.get(e.mangaupdates);
    const chaves = new Set([e.nome, a?.title.romaji, a?.title.english, ...(a?.synonyms || []), mu?.title,
        ...(mu?.associated || []).map(x => x.title)].map(norm).filter(Boolean));
    const antigo = encontrarAtual(e, chaves);
    if (antigo) usados.add(antigo);

    const alternativo = [a?.title.english, a?.title.romaji].find(t => t && norm(t) !== norm(e.nome)) || '';
    const item = {
        Nome_jp: e.nome,
        Nome_eng: alternativo,
        Status: STATUS[e.secao] || e.secao || antigo?.Status || 'Lendo',
        Image: a?.coverImage.extraLarge || a?.coverImage.large || mu?.image?.url?.original || antigo?.Image || '',
    };
    if (antigo?.cap) item.cap = antigo.cap;
    if (a?.chapters) item.caps = a.chapters;
    item.mal = e.mal || a?.idMal || null;
    item.anilist = e.anilist;
    item.mangaupdates = e.mangaupdates;
    return item;
});

// entradas que só existiam no mangas.json ficam, com os dados que já tinham
const soNoJson = atual.filter(m => !usados.has(m));
for (const m of soNoJson) {
    const { Id, ...resto } = m;
    mangas.push(resto);
}

const comId = mangas.map((m, i) => ({ Id: mangas.length - i, ...m }));
writeFileSync('dados/mangas.json', JSON.stringify({ total: comId.length, mangas: comId }, null, 4) + '\n');

console.log(`${comId.length} mangás gravados em dados/mangas.json`);
console.log(`  do export: ${exportados.length} (capa do AniList: ${exportados.filter(e => anilist.has(e.anilist)).length}, MangaUpdates: ${mangaupdates.size})`);
console.log(`  progresso (cap) recuperado: ${mangas.filter(m => m.cap).length}`);
console.log(`  só no mangas.json antigo (mantidos): ${soNoJson.length}`);
for (const m of soNoJson) console.log(`    - ${m.Nome_jp} [${m.Status}]`);
const semCapa = comId.filter(m => !m.Image);
if (semCapa.length) console.log(`  sem capa: ${semCapa.map(m => m.Nome_jp).join('; ')}`);
