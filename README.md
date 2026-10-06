# Ani-Mangalist

A minha lista pessoal de animes que já vi e mangás que já li, desenhada como um catálogo de convenção (Comiket): capas em grelha, códigos por secção e marcas de caneta vermelha para o que estou a ver agora.

Ver ao vivo: https://edivaldolluisb.github.io/animeData/

- **Anime**: a tua lista pública do [MyAnimeList](https://myanimelist.net), sincronizada todos os dias por um GitHub Action. O MAL é a única fonte dos animes.
- **Mangá**: a tua lista pública do [AniList](https://anilist.co), sincronizada todos os dias pelo mesmo GitHub Action. Se lês no MangaFire (ou outro leitor), liga-o ao AniList e o progresso chega sozinho ao site.
- **Detalhe**: capa, status, progresso, nota e links para o MyAnimeList / AniList.
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
- `dados/mangas.json` — os teus mangás, gerado automaticamente a partir do AniList (passo 4); não edites à mão

Para adicionar ou mudar animes, faz isso no MyAnimeList; para mangás, no AniList.

### 4. Sincronizar com o MyAnimeList e o AniList

O workflow `.github/workflows/mal.yml` corre todos os dias às 06:00 UTC: descarrega os teus animes do MyAnimeList e os teus mangás do AniList, e faz commit de `dados/mal.json` e `dados/mangas.json` se algo mudou. Se um dos sites falhar, o outro ficheiro é atualizado na mesma.

1. **As tuas listas têm de ser públicas.**
   - MAL: *Settings → List → Anime List* visível para todos. Confirma em `https://myanimelist.net/animelist/<utilizador>` numa janela anónima.
   - AniList: *Settings → Lists* sem "Private". Confirma em `https://anilist.co/user/<utilizador>/mangalist` numa janela anónima.
2. **Diz ao workflow quem és.** No fork: **Settings → Secrets and variables → Actions → aba Variables → New repository variable**
   - `MAL_USER` = o teu utilizador do MAL (ex.: `Edicastro`)
   - `ANILIST_USER` = o teu utilizador do AniList (ex.: `edica`)

   Sem estas variáveis, os scripts usam os meus utilizadores e vais ver as minhas listas.
3. **Dar permissão de escrita ao workflow.** **Settings → Actions → General → Workflow permissions → Read and write permissions** → Save.
4. **Ativar os workflows no fork.** O GitHub desliga os Actions em forks. Abre a aba **Actions** e carrega em **I understand my workflows, go ahead and enable them**. Os agendados (cron) também precisam de ser ativados lá.
5. **Primeira execução.** Aba **Actions → Sincronizar listas (MAL + AniList) → Run workflow**. Ao fim de ~30 s deve aparecer um commit `DATA: sync MyAnimeList and AniList lists`.

Notas:

- O GitHub suspende workflows agendados em repositórios sem atividade há 60 dias; basta voltar a ativar na aba Actions.
- O MAL pode bloquear pedidos vindos dos servidores do GitHub (erro `HTTP 403` no log). Nesse caso o site continua a mostrar os dados do último commit, e podes atualizar à mão no teu computador (passo seguinte).
- Não queres mangás? Deixa `dados/mangas.json` como `{ "total": 0, "mangas": [] }` e apaga o passo "Mangás (AniList)" do workflow.

### 5. Atualizar à mão (opcional)

Precisas de [Node.js](https://nodejs.org) 18 ou mais recente:

```bash
node scripts/fetch-mal.mjs <o-teu-utilizador-mal>
node scripts/fetch-anilist-mangas.mjs <o-teu-utilizador-anilist>
git add dados/mal.json dados/mangas.json
git commit -m "DATA: sync MyAnimeList and AniList lists"
git push
```

Como o workflow também faz commits, faz `git pull --rebase` antes de trabalhares localmente (ou corre uma vez `git config pull.rebase true`).

### 6. Personalizar

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

Gerado por `scripts/fetch-anilist-mangas.mjs`; não precisas de o editar. Cada entrada:

| Campo | Descrição |
|---|---|
| `Id` / `anilist` | id do mangá no AniList |
| `mal` | id no MyAnimeList, quando o AniList o conhece |
| `Nome_jp` / `Nome_eng` | título em inglês (ou romanizado) / romanizado |
| `Status` | convertido do AniList: Reading → Lendo, Completed → Completo, Planning → Pretendo Ler, Paused → Em Pausa, Dropped → Dropado |
| `Image` | capa |
| `cap` / `caps` | capítulos lidos / total (quando o AniList sabe) |
| `score` | a tua nota, de 0 a 10 |

A lista vem ordenada pela última atualização no AniList.

**Mangás que não existem no AniList** vão em `dados/mangas-extra.json` (um array com entradas no mesmo formato) e são acrescentados no fim a cada sincronização. Esse ficheiro é mantido à mão: atualiza lá o `cap` e o `Status`. Usa um `Id` em texto (ex.: `"the-beginning-after-the-end"`) para não colidir com os ids do AniList; `mangaupdates` (o código do link do MangaUpdates) é opcional e mostra o link na página de detalhe.

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
scripts/fetch-anilist-mangas.mjs   descarrega a lista pública de mangás do AniList
.github/workflows/mal.yml          sincronização diária (MAL + AniList)
dados/mangas-extra.json            mangás que não existem no AniList (mantidos à mão)
sw.js, manifest.json               PWA
```

## PWA e cache

O service worker guarda as páginas e estilos em cache. Os dados (`dados/*.json`) vêm sempre da rede primeiro. Se mudares HTML, CSS ou JS e a app instalada continuar a mostrar a versão antiga, aumenta o número em `cacheName` no `sw.js` (ex.: `Ani-Manga.list-v5` → `v6`).

## Licença

[MIT](LICENSE)
