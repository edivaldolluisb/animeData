const TIPO = document.body.dataset.tipo || 'anime';
const DADOS_URL = { anime: './dados/animes.json', manga: './dados/mangas.json', mal: './dados/mal.json' }[TIPO];
const UNIDADE = TIPO === 'manga' ? 'cap' : 'ep';

// Cada status vive num "hall" do catálogo; a letra + posição dão o código (A-001).
const HALLS = [
    { letra: 'A', nome: TIPO === 'manga' ? 'A ler agora' : 'A ver agora', status: ['assistindo', 'lendo'] },
    { letra: 'B', nome: 'Na fila', status: ['pretendo assistir', 'pretendo ler'] },
    { letra: 'C', nome: 'Completos', status: ['completo'] },
    { letra: 'D', nome: 'Em pausa e dropados', status: [] }, // resto
];
const hallDe = status => HALLS.find(h => h.status.includes(status)) || HALLS[3];

const SVG_NS = 'http://www.w3.org/2000/svg';
// circulo: à volta do código (viewBox 100x40); risco: sobre a capa (100x180)
const TRACOS = {
    circulo: { box: '0 0 100 40', d: 'M54 3 C82 2 98 10 97 21 C96 33 74 38 47 37 C19 36 3 30 4 19 C5 9 25 3 62 5' },
    risco: { box: '0 0 100 180', d: 'M10 14 L90 116 M88 12 L12 114' },
};

let itens = [];
let busca = '';
let filtro = '';

const catalogo = document.getElementById('catalogo');
const total = document.getElementById('total_resultados');
const filtroEl = document.getElementById('filtro');

renderSkeleton();

function renderSkeleton() {
    const ol = document.createElement('ol');
    ol.className = 'grid';
    ol.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 12; i++) {
        const li = document.createElement('li');
        li.className = 'cell skel';
        ol.appendChild(li);
    }
    catalogo.replaceChildren(ol);
}

function marcaCaneta(tipo, i) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', `marca-caneta ${tipo}`);
    svg.setAttribute('viewBox', TRACOS[tipo].box);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.setProperty('--i', i);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', TRACOS[tipo].d);
    path.setAttribute('pathLength', '1');
    svg.appendChild(path);
    return svg;
}

function celulaVazia() {
    const vazio = document.createElement('span');
    vazio.className = 'vazio';
    return vazio;
}

function progresso(item) {
    const feito = item[UNIDADE];
    if (!feito) return '';
    return item.eps ? `${UNIDADE} ${feito}/${item.eps}` : `${UNIDADE} ${feito}`;
}

function criarCelula(item, i) {
    const li = document.createElement('li');
    li.className = 'cell';
    li.dataset.s = item.s;

    const a = document.createElement('a');
    a.href = `./detalhe.html?id=${item.Id}&tipo=${TIPO}`;

    if (item.Image) {
        const img = document.createElement('img');
        img.src = item.Image;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = () => img.replaceWith(celulaVazia());
        a.appendChild(img);
    } else {
        a.appendChild(celulaVazia());
    }

    const code = document.createElement('span');
    code.className = 'code';
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = item.code;
    // "a ver agora": código circulado a caneta, como num catálogo de convenção
    if (item.hall.letra === 'A') num.appendChild(marcaCaneta('circulo', i));
    code.appendChild(num);
    const nota = item.hall.letra === 'A' ? progresso(item) : item.s === 'em pausa' ? 'pausa' : '';
    if (nota) {
        const pen = document.createElement('span');
        pen.className = 'pen';
        pen.textContent = nota;
        code.appendChild(pen);
    }

    const nome = document.createElement('span');
    nome.className = 'nome';
    nome.textContent = item.Nome_jp;

    const sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = `, ${item.Status}`;

    a.append(code, nome, sr);
    li.appendChild(a);

    if (item.s === 'dropado') li.appendChild(marcaCaneta('risco', i));
    return li;
}

function render() {
    const termo = busca.toLowerCase();
    const visiveis = itens.filter(item =>
        (!filtro || item.s === filtro) &&
        (!termo || item.Nome_jp.toLowerCase().includes(termo) || (item.Nome_eng || '').toLowerCase().includes(termo)));

    total.textContent = visiveis.length === itens.length
        ? `${itens.length} títulos`
        : `${visiveis.length} de ${itens.length} títulos`;

    if (visiveis.length === 0) {
        const p = document.createElement('p');
        p.className = 'aviso';
        p.textContent = busca ? `Nada com "${busca}" por aqui.` : 'Nenhum título neste status.';
        catalogo.replaceChildren(p);
        return;
    }

    const fragment = document.createDocumentFragment();
    let n = 0;
    for (const hall of HALLS) {
        const doHall = visiveis.filter(item => item.hall === hall);
        if (doHall.length === 0) continue;

        const section = document.createElement('section');
        section.className = 'hall';
        section.dataset.letra = hall.letra;
        const h2 = document.createElement('h2');
        const letra = document.createElement('span');
        letra.className = 'letra';
        letra.textContent = hall.letra;
        const contagem = document.createElement('span');
        contagem.className = 'n';
        contagem.textContent = doHall.length;
        h2.append(letra, hall.nome, contagem);

        const ol = document.createElement('ol');
        ol.className = 'grid';
        for (const item of doHall) ol.appendChild(criarCelula(item, n++ % 12));
        section.append(h2, ol);
        fragment.appendChild(section);
    }
    catalogo.replaceChildren(fragment);
}

function renderFiltros() {
    const contagem = {};
    for (const item of itens) contagem[item.Status] = (contagem[item.Status] || 0) + 1;
    const opcoes = [['', 'Todos', itens.length], ...Object.entries(contagem).map(([st, c]) => [st.toLowerCase(), st, c])];

    filtroEl.replaceChildren(...opcoes.map(([valor, label, c]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.dataset.valor = valor;
        b.setAttribute('aria-pressed', String(valor === filtro));
        const num = document.createElement('b');
        num.textContent = c;
        b.append(label, num);
        b.addEventListener('click', () => {
            filtro = valor;
            filtroEl.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            render();
        });
        return b;
    }));
}

fetch(DADOS_URL)
    .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    })
    .then(data => {
        const lista = data.animes || data.mangas;
        const porHall = {};
        itens = lista.map(item => {
            const s = item.Status.toLowerCase();
            const hall = hallDe(s);
            porHall[hall.letra] = (porHall[hall.letra] || 0) + 1;
            return { ...item, s, hall, code: `${hall.letra}-${String(porHall[hall.letra]).padStart(3, '0')}` };
        });
        renderFiltros();
        render();
    })
    .catch(err => {
        console.error('Erro ao carregar lista:', err);
        const p = document.createElement('p');
        p.className = 'aviso';
        p.textContent = 'Não foi possível carregar a lista. Verifique a conexão e recarregue a página.';
        catalogo.replaceChildren(p);
        total.textContent = 'Erro ao carregar';
    });

document.getElementById('bara_de_pesquisa').addEventListener('input', function () {
    busca = this.value.trim();
    render();
});
