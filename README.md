# Ani-Mangalist

A minha lista pessoal de animes que já vi e mangás que já li, desenhada como um catálogo de convenção (Comiket): capas em grelha, códigos por secção e marcas de caneta vermelha para o que estou a ver agora.

Ver ao vivo: https://edivaldolluisb.github.io/animeData/

- **Anime**: a tua lista pública do [MyAnimeList](https://myanimelist.net), sincronizada todos os dias por um GitHub Action. O MAL é a única fonte dos animes.
- **Mangá**: importado do export do teu leitor/tracker de mangás (lista com links do MAL, AniList e MangaUpdates); capas e total de capítulos vêm do AniList.
- **Detalhe**: capa, status, progresso, nota e links para MAL / AniList / MangaUpdates.
- Funciona como PWA (dá para instalar no telemóvel).

Não há build, framework nem dependências: é HTML, CSS e JavaScript estáticos.

---

## Criar a tua própria lista (fork)

### 1. Fazer fork

Carrega em **Fork** no topo de https://github.com/edivaldolluisb/animeData. O teu site vai ficar em `https://<o-teu-utilizador>.github.io/<nome-do-repo>/`.

### 2. Ligar o GitHub Pages

No teu fork: **Settings → Pages → Build and deployment**

- Source: **Deploy from a branch**
- Branch: **main**, pasta **/ (root)** → Save

Ao fim de 1–2 minutos o site fica no ar no endereço acima.

### 3. Pôr os teus dados

Os ficheiros em `dados/` têm a minha lista. Substitui pelos teus:

- `dados/mal.json` — os teus animes, gerado automaticamente a partir do MAL (passo 4); não edites à mão
- `dados/mangas.json` — os teus mangás, gerado pelo `scripts/import-mangas.mjs` (passo 6); se não quiseres mangás, deixa `{ "total": 0, "mangas": [] }`

Para adicionar ou mudar animes, faz isso no próprio MyAnimeList.

### 4. Sincronizar com o teu MyAnimeList

O workflow `.github/workflows/mal.yml` corre todos os dias às 06:00 UTC, descarrega a tua lista e faz commit de `dados/mal.json` se algo mudou.

1. **A tua lista do MAL tem de ser pública.** No MAL: *Settings → List → Anime List* visível para todos. Confirma abrindo `https://myanimelist.net/animelist/<o-teu-utilizador>` numa janela anónima.
2. **Diz ao workflow qual é o teu utilizador.** No fork: **Settings → Secrets and variables → Actions → aba Variables → New repository variable**
   - Name: `MAL_USER`
   - Value: o teu nome de utilizador do MAL (ex.: `Edicastro`)

   Sem esta variável, o script usa `Edicastro` e vais ver a minha lista.
3. **Dar permissão de escrita ao workflow.** **Settings → Actions → General → Workflow permissions → Read and write permissions** → Save.
4. **Ativar os workflows no fork.** O GitHub desliga os Actions em forks. Abre a aba **Actions** e carrega em **I understand my workflows, go ahead and enable them**. Os agendados (cron) também precisam de ser ativados lá.
5. **Primeira execução.** Aba **Actions → Sincronizar MyAnimeList → Run workflow**. Ao fim de ~30 s deve aparecer um commit `DATA: sync MyAnimeList list` e a página Anime passa a mostrar a tua lista.

Notas:

- O GitHub suspende workflows agendados em repositórios sem atividade há 60 dias; basta voltar a ativar na aba Actions.
- O MAL pode bloquear pedidos vindos dos servidores do GitHub (erro `HTTP 403` no log). Nesse caso o site continua a mostrar os dados do último commit, e podes atualizar à mão no teu computador (passo seguinte).

### 5. Atualizar à mão (opcional)

Precisas de [Node.js](https://nodejs.org) 18 ou mais recente:

```bash
node scripts/fetch-mal.mjs <o-teu-utilizador-mal>
git add dados/mal.json
git commit -m "DATA: sync MyAnimeList list"
git push
```

Como o workflow também faz commits, faz `git pull --rebase` antes de trabalhares localmente (ou corre uma vez `git config pull.rebase true`).

### 6. Importar os mangás

O script lê um export em texto com este formato (é o que apps como o Kotatsu/Mihon e alguns trackers exportam):

```
### Reading
# Solo Leveling
https://myanimelist.net/manga/121496/
https://anilist.co/manga/105398/
https://mangaupdates.com/series/6z1uqw7/
### Completed
# ...
### Plan to Read
# ...
```

Secções reconhecidas: `Reading` → Lendo, `Completed` → Completo, `Plan to Read` → Pretendo Ler, `Dropped` → Dropado, `On Hold` → Em Pausa. Os links são opcionais.

```bash
node scripts/import-mangas.mjs caminho/para/o-export.txt
```

O script:

- busca capa, título alternativo e total de capítulos no **AniList** (ou no **MangaUpdates** quando não há link do AniList);
- **mantém** o que já estava em `dados/mangas.json`: o capítulo lido (`cap`) e as entradas que não aparecem no export;
- usa o status do export (é o mais recente) e reescreve `dados/mangas.json`.

Sempre que exportares de novo, corre o script outra vez e faz commit de `dados/mangas.json`. O ficheiro exportado não precisa de ficar no repositório. Para atualizar o capítulo onde vais, edita o campo `cap` em `dados/mangas.json`.

### 7. Personalizar

- Textos dos títulos: `index.html` (animes) e `manga.html`.
- Cores e tipografia: tokens no topo de `anime.css`; o sistema visual está descrito em `DESIGN.md`.
- Ícones e nome da PWA: `manifest.json` e `icones/`.
- Os links para o GitHub (ícone no menu e botão no rodapé) apontam para este repositório; troca pelo teu fork se quiseres.

---

## Formato dos dados

### Animes (`dados/mal.json`)

Gerado por `scripts/fetch-mal.mjs`; não precisas de o editar. Cada entrada:

| Campo | Descrição |
|---|---|
| `Id` | id do anime no MAL (usado no link "Ver no MyAnimeList") |
| `Nome_jp` / `Nome_eng` | título romanizado / inglês |
| `Status` | convertido do MAL: Watching → Assistindo, Completed → Completo, On-Hold → Em Pausa, Dropped → Dropado, Plan to Watch → Pretendo Assistir |
| `Image` | capa |
| `ep` / `eps` | episódios vistos / total |
| `score` | a tua nota (0 = sem nota) |

A lista vem ordenada pela última atualização no MAL.

### Mangás (`dados/mangas.json`)

Gerado por `scripts/import-mangas.mjs`. Cada entrada:

```json
{ "Id": 181, "Nome_jp": "Black Clover", "Nome_eng": "", "Status": "Lendo", "Image": "https://s4.anilist.co/...",
  "cap": 368, "caps": 392, "mal": 86337, "anilist": 86123, "mangaupdates": "w8nq9bw" }
```

| Campo | Descrição |
|---|---|
| `Id` | número sequencial; o primeiro do ficheiro tem o maior |
| `Nome_jp` | nome como aparece no teu export (aparece na grelha) |
| `Nome_eng` | título alternativo do AniList (inglês ou romanizado) |
| `Status` | `Lendo`, `Completo`, `Pretendo Ler`, `Dropado`, `Em Pausa` |
| `Image` | capa (AniList / MangaUpdates); se faltar aparece um bloco vazio |
| `cap` | último capítulo lido (editas tu; o script preserva-o) |
| `caps` | total de capítulos, quando o AniList sabe |
| `mal` / `anilist` / `mangaupdates` | ids para os links da página de detalhe |

### Status e secções

A grelha agrupa os títulos em secções ("halls") pelo status:

| Hall | Status |
|---|---|
| A — a ver / ler agora | `Assistindo`, `Lendo` |
| B — na fila | `Pretendo Assistir`, `Pretendo Ler` |
| C — completos | `Completo` |
| D — em pausa e dropados | `Em Pausa`, `Dropado` e qualquer outro |

Os filtros de status no topo da página são gerados a partir dos status que existem nos dados.

---

## Correr localmente

Abre a pasta com qualquer servidor estático (abrir o `index.html` diretamente não funciona porque o `fetch` dos JSON precisa de HTTP):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Estrutura

```
index.html, manga.html            listas (ambas usam js/index.js; <body data-tipo> escolhe o JSON)
detalhe.html                       página de detalhe (?id=X&tipo=anime|manga)
anime.css, detalhe.css             estilos
dados/                             dados das listas
scripts/fetch-mal.mjs              descarrega a lista pública de animes do MAL
scripts/import-mangas.mjs          importa o export de mangás para dados/mangas.json
.github/workflows/mal.yml          sincronização diária
sw.js, manifest.json               PWA
```

## PWA e cache

O service worker guarda as páginas e estilos em cache. Os dados (`dados/*.json`) vêm sempre da rede primeiro. Se mudares HTML, CSS ou JS e a app instalada continuar a mostrar a versão antiga, aumenta o número em `cacheName` no `sw.js` (ex.: `Ani-Manga.list-v5` → `v6`).

## Licença

[MIT](LICENSE)
