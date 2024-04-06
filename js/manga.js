
let totalMangasRegistados //total de mangas regitados

const perPage = 2; // quantidade de itens por página
let currentPage = 1; // página atual
let totalItems = 0; // total de itens a serem exibidos
let totalPages = 1; // total de páginas

var tabela = document.querySelector('table > tbody');


//read json file
function readfromJson(manga, page = 1, perPage = 5) {
	//write to a json file
	fetch("./dados/mangas.json")
		.then(response => response.json())
		.then(data => {
			// arquivo JSON foi convertido em um objeto JavaScript
			//console.log(data);

			totalMangasRegistados = data.mangas.length

			searchManga(data.mangas)

			//dados para paginação
			const start = (page - 1) * perPage;
			const end = start + perPage;
			const mangas = data.mangas.slice(start, end);
			//console.log(mangas)

			addMangaToTable(mangas);
			addPagination(data, page, perPage);


		}).catch(error => console.log("Erro ao tentar ler o ficheiro: " + error));

}
readfromJson()

//list mangas
function addMangaToTable(array) {
	//console.log(array)

	tabela.innerHTML = '';
	let total = 0

	for (const anime of array) {
		tabela.innerHTML += `<tr><td><a href="./detalhe.html?id=${anime.Id}&tipo=manga">${anime.Nome_jp}</a></td><td>${anime.Status}</td></tr>`
		total++;
	}

	//if the array is empty
	if (array.length == 0) {
		tabela.innerHTML += `<tr><td colspan="2">Nenhum mangá encontrado</td></tr>`
	}
		document.getElementById('total_resultados').innerText=`listados ${total} de ${totalMangasRegistados}`

	totalItems = array.length;
	totalPages = Math.ceil(totalItems / perPage);

}

//pagination funtionality
function addPagination(data, currentPage, perPage) {
	const totalItems = data.mangas.length;
	const totalPages = Math.ceil(totalItems / perPage);

	const paginationElement = document.querySelector(".pagination");
	paginationElement.innerHTML = "";

	if (totalPages > 1) {
		const isFirstPage = currentPage === 1;
		const isLastPage = currentPage === totalPages;

		const previousPage = currentPage - 1;
		const nextPage = currentPage + 1;

		const previousPageElement = isFirstPage ? "" : `<a href="#" data-page="${previousPage}">&laquo;</a>`;
		const nextPageElement = isLastPage ? "" : `<a href="#" data-page="${nextPage}">&raquo;</a>`;

		paginationElement.innerHTML += previousPageElement;

		for (let i = 1; i <= totalPages; i++) {
			// ir colocar apenas a pagina atual a anterior e a seguinte
			if (i === currentPage - 1 || i === currentPage || i === currentPage + 1) {
				const active = i === currentPage ? "active" : "";
				paginationElement.innerHTML += `<a href="#" data-page="${i}" class="${active}">${i}</a>`;
			}
		}

		paginationElement.innerHTML += nextPageElement;

		const pageButtons = paginationElement.querySelectorAll("a[data-page]");
		pageButtons.forEach(button => {
			button.addEventListener("click", event => {
				event.preventDefault();
				const newPage = parseInt(button.dataset.page);
				readfromJson(data.mangas, newPage, perPage);
			});
		});
	}
}

//search anime
function searchManga(array) {
	var searchbar = document.querySelector('#bara_de_pesquisa')
	searchbar.addEventListener('keyup', function () {
		const value = this.value
		const data = searchTable(value, array)
		//console.log('Value:', value)
		//console.log(array)
		//console.log(data)
		//console.log('filtered:', data)
		addMangaToTable(data)
	})
}

//função de filtro
function searchTable(value, data) {
	var filteredData = []

	for (const anime of data) {
		value = value.toLowerCase()
		var name = anime.Nome_jp.toLowerCase()

		if (name.includes(value)) {
			filteredData.push(anime)
		}
	}

	return filteredData
}


