function readfromtxt(params) {
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
        /*let anime_json = {
          nome_jp: 
        }*/
        //dados.animes.push(anime_json)


      }
      console.log(dados)

    })
    .catch(error => console.log("Erro na requisição: " + error));
}

//readfromtxt()





//read json file
function readfromJson(anime) {
  //write to a json file
  fetch("./dados/animes.json")
    .then(response => response.json())
    .then(data => {
      // arquivo JSON foi convertido em um objeto JavaScript
      console.log(data);

      addAnimeToTable(data);

    

    }).catch(error => console.log("Erro ao tentar ler o ficheiro: " + error));

}
readfromJson()

//list data
function addAnimeToTable(array) {
  console.log(array)
  var tabela = document.querySelector('table > tbody');
  tabela.innerHTML = '';


  for (const anime of array.animes) {
    //console.log(anime)
    tabela.innerHTML += `<tr><td><a href="./detalhe.html?id=${anime.Id}&tipo=anime">${anime.Nome_jp}</a></td><td>${anime.Status}</td></tr>`
  }
}


