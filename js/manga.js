const ITEMS_PER_PAGE = 20;
let currentPage = 1;
let allMangas = [];
let searchTerm = '';
let filterStatus = '';

const tabela = document.querySelector('table > tbody');

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
    return allMangas.filter(manga => {
        const matchSearch = !searchTerm
            || manga.Nome_jp.toLowerCase().includes(searchTerm)
            || (manga.Nome_eng || '').toLowerCase().includes(searchTerm);
        const matchFilter = !filterStatus
            || manga.Status.toLowerCase() === filterStatus;
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
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'Nenhum mangá encontrado';
        tr.appendChild(td);
        tabela.appendChild(tr);
    } else {
        const fragment = document.createDocumentFragment();
        for (const manga of pageData) {
            const tr = document.createElement('tr');
            const tdNome = document.createElement('td');
            const a = document.createElement('a');
            a.href = `./detalhe.html?id=${manga.Id}&tipo=manga`;
            a.textContent = manga.Nome_jp;
            if (manga.Image) a.dataset.image = manga.Image;
            tdNome.appendChild(a);
            const tdStatus = document.createElement('td');
            tdStatus.textContent = manga.Status;
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

fetch('./dados/mangas.json')
    .then(r => r.json())
    .then(data => {
        allMangas = data.mangas;
        renderTable(1);
    })
    .catch(err => console.error('Erro ao carregar mangás:', err));

document.querySelector('#bara_de_pesquisa').addEventListener('keyup', function () {
    searchTerm = this.value.toLowerCase().trim();
    renderTable(1);
});

const filtroEl = document.getElementById('filtro');
if (filtroEl) {
    filtroEl.addEventListener('change', function () {
        filterStatus = this.value;
        renderTable(1);
    });
}
