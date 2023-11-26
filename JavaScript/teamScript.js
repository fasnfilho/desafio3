const teamContainer = document.querySelector('.team-container');

// Função para obter os parâmetros da URL
function getParams() {
  const params = new URLSearchParams(window.location.search);
  const teamName = params.get('teamName');
  const pokemonNames = [];

  params.forEach((value, key) => {
    if (key.includes('pokemon')) {
      pokemonNames.push(value);
    }
  });

  return { teamName, pokemonNames };
}

// Função para exibir os Pokémon do time
async function displayTeam() {
  const { teamName, pokemonNames } = getParams();

  if (teamName && pokemonNames.length > 0) {
    const pokemons = await Promise.all(pokemonNames.map(async (name) => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao obter dados do Pokémon ${name}`, error);
      }
    }));

    pokemons.forEach(pokemon => {
      createPokemonCard(pokemon);
    });
  } else {
    teamContainer.innerHTML = '<p>Nenhum Pokémon no time.</p>';
  }
}

// Função para criar um card de Pokémon (semelhante à função usada na página inicial)
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

  teamContainer.appendChild(card);
}

// Exibir os Pokémon do time ao carregar a página
displayTeam();
