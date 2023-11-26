const pokemonContainer = document.querySelector('.pokemon-container');
const teamNameInput = document.getElementById('teamName');

// Função para exibir os pokémons em ordem crescente pelo ID
async function fetchPokemons() {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      const pokemons = response.data.results;
  
      const sortedPokemons = await Promise.all(pokemons.map(async (pokemon) => {
        const pokemonData = await axios.get(pokemon.url);
        return pokemonData.data;
      })).then(pokemons => pokemons.sort((a, b) => a.id - b.id));
  
      sortedPokemons.forEach(pokemon => {
        createPokemonCard(pokemon);
      });
    } catch (error) {
      console.error('Erro ao obter a lista de pokémons', error);
    }
  }
  

// Função para criar um card de Pokémon
function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = pokemon.sprites.front_default;
  img.alt = pokemon.name;

  const name = document.createElement('h3');
  name.textContent = pokemon.name;

  const id = document.createElement('p');
  id.textContent = `ID: ${pokemon.id}`;

  const types = document.createElement('p');
  types.textContent = `Type(s): ${pokemon.types.map(type => type.type.name).join(', ')}`;

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(id);
  card.appendChild(types);

  card.addEventListener('click', () => addToTeam(pokemon));

  pokemonContainer.appendChild(card);
}

// Função para adicionar Pokémon ao time
let team = [];
function addToTeam(pokemon) {
  if (team.length < 6) {
    team.push(pokemon);
    alert(`Pokemon ${pokemon.name} adicionado ao time!`);
  } else {
    alert('Você já possui 6 pokémons no time!');
  }
}

// Função para salvar o time
function saveTeam() {
  const teamName = teamNameInput.value.trim();
  if (team.length > 0 && teamName !== '') {
    const queryParams = new URLSearchParams();
    queryParams.set('teamName', teamName);
    team.forEach((pokemon, index) => {
      queryParams.append(`pokemon${index + 1}`, pokemon.name);
    });
    window.location.href = `teams.html?${queryParams.toString()}`;
  } else {
    alert('Insira um nome para o time e adicione pelo menos um Pokémon!');
  }
}

// Carregar os pokémons ao carregar a página
fetchPokemons();
