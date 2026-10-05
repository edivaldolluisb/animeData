// Baixa a lista pública do MyAnimeList e grava em dados/mal.json.
// Uso: node scripts/fetch-mal.mjs [usuario]
import { writeFileSync } from 'node:fs';

const user = process.argv[2] || 'Edicastro';
const STATUS = { 1: 'Assistindo', 2: 'Completo', 3: 'Em Pausa', 4: 'Dropado', 6: 'Pretendo Assistir' };

const items = [];
for (let offset = 0; ; offset += 300) {
    const url = `https://myanimelist.net/animelist/${user}/load.json?status=7&offset=${offset}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
    const page = await r.json();
    items.push(...page);
    if (page.length < 300) break;
}

const animes = items
    .sort((a, b) => b.updated_at - a.updated_at)
    .map(a => ({
        Id: a.anime_id,
        Nome_jp: String(a.anime_title),
        Nome_eng: a.anime_title_eng ? String(a.anime_title_eng) : '',
        Status: STATUS[a.status] || 'Desconhecido',
        Image: a.anime_image_path.replace(/\/r\/\d+x\d+/, '').replace(/\?.*$/, ''),
        ep: a.num_watched_episodes,
        eps: a.anime_num_episodes,
        score: a.score,
    }));

writeFileSync('dados/mal.json', JSON.stringify({ total: animes.length, animes }, null, 4) + '\n');
console.log(`${animes.length} animes gravados em dados/mal.json`);
