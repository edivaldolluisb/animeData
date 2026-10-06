// Baixa a lista pública de mangás do AniList e grava em dados/mangas.json.
// Junta no fim as entradas de dados/mangas-extra.json (mangás que não existem no AniList, mantidos à mão).
// Uso: node scripts/fetch-anilist-mangas.mjs [usuario]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const user = process.argv[2] || 'edica';
const STATUS = {
    CURRENT: 'Lendo', REPEATING: 'Lendo', COMPLETED: 'Completo',
    PLANNING: 'Pretendo Ler', PAUSED: 'Em Pausa', DROPPED: 'Dropado',
};

const query = `query ($user: String) {
    MediaListCollection(userName: $user, type: MANGA) {
        lists { entries {
            status progress updatedAt score(format: POINT_10)
            media { id idMal title { romaji english } coverImage { extraLarge large } chapters }
        } }
    }
}`;

const r = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { user } }),
});
const json = await r.json();
if (!r.ok || json.errors) throw new Error(`AniList: ${JSON.stringify(json.errors || r.status)}`);

const mangas = json.data.MediaListCollection.lists
    .flatMap(l => l.entries)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(({ status, progress, score, media: m }) => {
        const nome = m.title.english || m.title.romaji;
        const item = {
            Id: m.id,
            Nome_jp: nome,
            Nome_eng: m.title.romaji && m.title.romaji.toLowerCase() !== nome.toLowerCase() ? m.title.romaji : '',
            Status: STATUS[status] || 'Lendo',
            Image: m.coverImage.extraLarge || m.coverImage.large || '',
        };
        if (progress) item.cap = progress;
        if (m.chapters) item.caps = m.chapters;
        if (score) item.score = score;
        item.mal = m.idMal || null;
        item.anilist = m.id;
        return item;
    });

const EXTRA = 'dados/mangas-extra.json';
const extra = existsSync(EXTRA) ? JSON.parse(readFileSync(EXTRA, 'utf8')) : [];
mangas.push(...extra);

writeFileSync('dados/mangas.json', JSON.stringify({ total: mangas.length, mangas }, null, 4) + '\n');
console.log(`${mangas.length} mangás gravados em dados/mangas.json (${extra.length} de ${EXTRA})`);
