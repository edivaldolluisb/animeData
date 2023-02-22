function readfromtxt(params) {
  fetch('./dados/anime.txt')
    .then(response => response.text())
    .then(texto => {
      // Define um objeto com os dados que serão escritos no arquivo
      let dados = {
        total: 0,
        animes: []
      };

      let linhas = texto.split('\n'); // divide o texto em um array de linhas
      for (const element of linhas) {
        let anime = element.split('\t')
        console.log(anime)

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
        console.log(anime_json)
        dados.animes.push(anime_json)
        console.log(getNames(anime[0]))
        //console.log(linhas[i]); // exibe cada linha no console
        /*let anime_json = {
          nome_jp: 
        }*/
        //dados.animes.push(anime_json)
        console.log(dados)


      }
      /*
            // Converte o objeto em uma string JSON
            let dadosJson = JSON.stringify(dados);
      
            // Cria um novo arquivo ou sobrescreve um arquivo existente
            let file = new File([dadosJson], "dados.json", { type: "application/json" });
      
            // Cria um objeto FileWriter para escrever no arquivo
            let writer = new FileWriter();
      
            // Escreve a string JSON no arquivo
            writer.write(file);*/
    })
    .catch(error => console.log("Erro na requisição: " + error));
}

readfromtxt()




