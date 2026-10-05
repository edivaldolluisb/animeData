const ITEMS_PER_PAGE = 20;
const TIPO = document.body.dataset.tipo || 'anime';
const DADOS_URL = TIPO === 'mal' ? './dados/mal.json' : './dados/animes.json';
let currentPage = 1;
let allAnimes = [];
let searchTerm = '';
let filterStatus = '';

const tabela = document.querySelector('table > tbody');

renderSkeleton();

function renderSkeleton() {
    tabela.replaceChildren();
    for (let i = 0; i < 6; i++) {
        const tr = document.createElement('tr');
        const tdNome = document.createElement('td');
        const tdStatus = document.createElement('td');
        const barNome = document.createElement('span');
        barNome.className = 'skel';
        barNome.style.width = `${55 + (i % 3) * 12}%`;
        const barStatus = document.createElement('span');
        barStatus.className = 'skel';
        barStatus.style.width = '70%';
        barStatus.style.margin = '0 auto';
        tdNome.appendChild(barNome);
        tdStatus.appendChild(barStatus);
        tr.append(tdNome, tdStatus);
        tabela.appendChild(tr);
    }
}

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    setupPreview();
}

function setupPreview() {
    const card = document.createElement('div');
    card.id = 'preview-card';
    const img = document.createElement('img');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    card.appendChild(img);
    document.body.appendChild(card);

    let timer;

    tabela.addEventListener('mouseover', e => {
        const a = e.target.closest('a[data-image]');
        clearTimeout(timer);
        if (!a || !a.dataset.image) {
            timer = setTimeout(() => card.classList.remove('visible'), 80);
            return;
        }
        timer = setTimeout(() => {
            img.src = a.dataset.image;
            card.classList.add('visible');
        }, 120);
    });

    tabela.addEventListener('mousemove', e => {
        const m = 18, w = 158, h = 220;
        let left = e.clientX + m;
        let top = e.clientY - h / 2;
        if (left + w > window.innerWidth - m) left = e.clientX - w - m;
        top = Math.max(m, Math.min(top, window.innerHeight - h - m));
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
    });

    tabela.addEventListener('mouseleave', () => {
        clearTimeout(timer);
        card.classList.remove('visible');
    });

    img.onerror = () => card.classList.remove('visible');
}

function getFiltered() {
    return allAnimes.filter(anime => {
        const matchSearch = !searchTerm
            || anime.Nome_jp.toLowerCase().includes(searchTerm)
            || anime.Nome_eng.toLowerCase().includes(searchTerm);
        const matchFilter = !filterStatus
            || anime.Status.toLowerCase() === filterStatus;
        return matchSearch && matchFilter;
    });
}

function renderTable(page = 1) {
    currentPage = page;
    const filtered = getFiltered();
    const start = (page - 1) * ITEMS_PER_PAGE;
    const pageData = filtered.slice(start, start + ITEMS_PER_PAGE);

    tabela.replaceChildren();

    if (pageData.length === 0) {
        const tr = document.createElement('tr');
        tr.className = 'linha-aviso';
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'Nenhum anime encontrado';
        tr.appendChild(td);
        tabela.appendChild(tr);
    } else {
        const fragment = document.createDocumentFragment();
        for (const anime of pageData) {
            const tr = document.createElement('tr');
            const tdNome = document.createElement('td');
            const a = document.createElement('a');
            a.href = `./detalhe.html?id=${anime.Id}&tipo=${TIPO}`;
            if (anime.Image) {
                const thumb = document.createElement('img');
                thumb.className = 'thumb';
                thumb.src = anime.Image;
                thumb.alt = '';
                thumb.loading = 'lazy';
                a.appendChild(thumb);
                a.dataset.image = anime.Image;
            } else {
                const thumb = document.createElement('span');
                thumb.className = 'thumb';
                a.appendChild(thumb);
            }
            const nome = document.createElement('span');
            nome.textContent = anime.Nome_jp;
            a.appendChild(nome);
            tdNome.appendChild(a);
            const tdStatus = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'status-badge';
            badge.dataset.status = anime.Status.toLowerCase();
            badge.textContent = anime.Status;
            tdStatus.appendChild(badge);
            tr.appendChild(tdNome);
            tr.appendChild(tdStatus);
            fragment.appendChild(tr);
        }
        tabela.appendChild(fragment);
    }

    document.getElementById('total_resultados').textContent =
        `listados ${pageData.length} de ${filtered.length}`;
    renderPagination(filtered.length, page);
}

function createPageLink(pageNum, label, ariaLabel, isActive) {
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.page = pageNum;
    a.textContent = label;
    if (ariaLabel) a.setAttribute('aria-label', ariaLabel);
    if (isActive) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'true');
    }
    a.addEventListener('click', e => {
        e.preventDefault();
        renderTable(parseInt(a.dataset.page));
    });
    return a;
}

function renderPagination(totalItems, page) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const el = document.querySelector('.pagination');
    el.replaceChildren();
    if (totalPages <= 1) return;

    const fragment = document.createDocumentFragment();
    if (page > 1) {
        fragment.appendChild(createPageLink(page - 1, '«', 'Página anterior', false));
    }
    for (let i = 1; i <= totalPages; i++) {
        if (i >= page - 1 && i <= page + 1) {
            fragment.appendChild(createPageLink(i, String(i), null, i === page));
        }
    }
    if (page < totalPages) {
        fragment.appendChild(createPageLink(page + 1, '»', 'Próxima página', false));
    }
    el.appendChild(fragment);
}

fetch(DADOS_URL)
    .then(r => r.json())
    .then(data => {
        allAnimes = data.animes;
        renderTable(1);
    })
    .catch(err => {
        console.error('Erro ao carregar animes:', err);
        tabela.replaceChildren();
        const tr = document.createElement('tr');
        tr.className = 'linha-aviso';
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'Não foi possível carregar a lista. Verifique a conexão e recarregue a página.';
        tr.appendChild(td);
        tabela.appendChild(tr);
        document.getElementById('total_resultados').textContent = 'Erro ao carregar a lista';
    });

document.querySelector('#bara_de_pesquisa').addEventListener('keyup', function () {
    searchTerm = this.value.toLowerCase().trim();
    renderTable(1);
});

document.getElementById('filtro').addEventListener('change', function () {
    filterStatus = this.value;
    renderTable(1);
});
