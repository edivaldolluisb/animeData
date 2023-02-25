/*function readfromtxt(params) {
  fetch('./dados/anime.txt')
	.then(response => response.text())
	.then(texto => {
	  // Define um objeto com os dados que serão escritos no arquivo
	  let dados = {
		total: 0,
		animes: []
	  };
	  let lista_Animes = []

	  let linhas = texto.split('\n'); // divide o texto em um array de linhas
	  for (const element of linhas) {
		let anime = element.split('\t')
		console.log(anime)
		lista_Animes.push(anime)

		//function to get both jp and eng name
		function getNames(name) {
		  let nomejp = name.split("//")[0]

		  const nome_eng = name.includes('//') ? name.split("//")[1] : ''

		  return [nomejp, nome_eng]
		}

		//if the anime doesn't have an image
		let anime_json = {
		  Nome_jp: getNames(anime[0])[0],
		  Nome_eng: getNames(anime[0])[1],
		  Status: anime[1],
		  Image: ""
		}
		//if anime has 
		if (anime.length == 3) {
		  anime_json = {
			Nome_jp: getNames(anime[0])[0],
			Nome_eng: getNames(anime[0])[1],
			Status: anime[1],
			Image: anime[2]
		  }

		}
		//console.log(anime_json)
		console.log(dados)
		dados.animes.push(anime_json)
		//console.log(getNames(anime[0]))
		//console.log(linhas[i]); // exibe cada linha no console
		//let anime_json = {
		//  nome_jp: 
		//}
		//dados.animes.push(anime_json)


	  }
	  console.log(dados)

	})
	.catch(error => console.log("Erro na requisição: " + error));
}*/

//readfromtxt()

let totalAnimesRegistados //total de mangas regitados

const perPage = 2; // quantidade de itens por página
let currentPage = 1; // página atual
let totalItems = 0; // total de itens a serem exibidos
let totalPages = 1; // total de páginas

var tabela = document.querySelector('table > tbody');


//read json file
function readfromJson(anime, page = 1, perPage = 5) {
	//write to a json file
	fetch("./dados/animes.json")
		.then(response => response.json())
		.then(data => {
			// arquivo JSON foi convertido em um objeto JavaScript
			//console.log(data);
			totalAnimesRegistados = data.animes.length

			searchAnime(data.animes)
			filter(data.animes)

			//dados para paginação
			const start = (page - 1) * perPage;
			const end = start + perPage;
			const animes = data.animes.slice(start, end);
			//console.log(animes)

			addAnimeToTable(animes);
			addPagination(data, page, perPage);


		}).catch(error => console.log("Erro ao tentar ler o ficheiro: " + error));

}
readfromJson()

//list animes
function addAnimeToTable(array) {
	//console.log(array)

	tabela.innerHTML = '';
	let total = 0

	for (const anime of array) {
		tabela.innerHTML += `<tr><td><a href="./detalhe.html?id=${anime.Id}&tipo=anime">${anime.Nome_jp}</a></td><td>${anime.Status}</td></tr>`
		total++;
	}

	//if the array is empty
	if (array.length == 0) {
		tabela.innerHTML += `<tr><td colspan="2">Nenhum anime encontrado</td></tr>`
	}

	document.getElementById('total_resultados').innerText = `listados ${total} de ${totalAnimesRegistados}`

	totalItems = array.length;
	totalPages = Math.ceil(totalItems / perPage);

}

//pagination funtionality
function addPagination(data, currentPage, perPage) {
	const totalItems = data.animes.length;
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
			if (i === currentPage) {
				paginationElement.innerHTML += `<a class="active" href="#">${i}</a>`;
			} else {
				paginationElement.innerHTML += `<a href="#" data-page="${i}">${i}</a>`;
			}
		}

		paginationElement.innerHTML += nextPageElement;

		const pageButtons = paginationElement.querySelectorAll("a[data-page]");
		pageButtons.forEach(button => {
			button.addEventListener("click", event => {
				event.preventDefault();
				const newPage = parseInt(button.dataset.page);
				readfromJson(data.animes, newPage, perPage);
			});
		});
	}
}

//search anime
function searchAnime(array) {
	var searchbar = document.querySelector('#bara_de_pesquisa')
	searchbar.addEventListener('keyup', function () {
		const value = this.value
		const data = searchTable(value, array)

		addAnimeToTable(data)
	})
}

//função de filtrar por nome
function searchTable(value, data) {
	let filteredData = []

	for (const anime of data) {
		value = value.toLowerCase()
		let name = anime.Nome_jp.toLowerCase()

		if (name.includes(value)) {
			filteredData.push(anime)
		}
	}

	return filteredData
}

//filtrar por status
function filter(array) {
	let filterfield = document.getElementById('filtro')
	filterfield.addEventListener('change', function () {
		console.log(array)
		let value = filterfield.value;
		let filteredData = []

		for (const element of array) {
			const status = element.Status.toLowerCase()

			if (status == value) {
				filteredData.push(element)
			}
		}

		addAnimeToTable(filteredData)

	})

}





