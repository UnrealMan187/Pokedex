let pokemonContainer = document.getElementById('pokemonContainer');
let loadMoreBtn = document.getElementById('loadMoreBtn');
let searchBar = document.getElementById('searchBar');
let pokemonModal = document.getElementById('pokemonModal');
let closeModalBtn = document.getElementById('closeModalBtn');
let modalPokemonDetails = document.getElementById('modalPokemonDetails');
let prevPokemonBtn = document.getElementById('prevPokemonBtn');
let nextPokemonBtn = document.getElementById('nextPokemonBtn');

let currentOffset = 0;
let limit = 50;
let allPokemon = [];


document.addEventListener('DOMContentLoaded', () => {
    loadPokemon();
});


loadMoreBtn.addEventListener('click', () => {
    loadPokemon();
});


searchBar.addEventListener('input', () => {
    filterPokemon(searchBar.value.toLowerCase());
});


closeModalBtn.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
});


prevPokemonBtn.addEventListener('click', () => {
    navigatePokemon(-1);
});


nextPokemonBtn.addEventListener('click', () => {
    navigatePokemon(1);
});


function loadPokemon() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`)
        .then(response => response.json())
        .then(data => {
            allPokemon = allPokemon.concat(data.results);
            currentOffset += limit;
            renderPokemon(data.results);
        });
}


function renderPokemon(pokemonList) {
    pokemonList.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
                let pokemonCard = document.createElement('div');
                pokemonCard.className = 'pokemon-card';
                pokemonCard.style.backgroundColor = getTypeColor(pokemonData.types[0].type.name);
                
                let abilitiesHTML = pokemonData.abilities.map(ability => {
                    let abilityName = ability.ability.name;
                    let abilityPercentage = Math.floor(Math.random() * 100); // Beispielhafte Prozentzahl, da diese Information nicht direkt verfügbar ist
                    return `
                        <div class="ability">
                            <span class="ability-name">${abilityName}</span>
                            <div class="ability-bar">
                                <div class="ability-bar-fill" style="width: ${abilityPercentage}%;"></div>
                            </div>
                        </div>
                    `;
                }).join('');

                pokemonCard.innerHTML = `
                    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                    <h3>${pokemonData.name}</h3>
                    <p># ${pokemonData.id}</p>
                    <p>Typ: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
                    ${abilitiesHTML}
                `;
                
                pokemonCard.addEventListener('click', () => showPokemonDetails(pokemonData));
                pokemonContainer.appendChild(pokemonCard);
            });
    });
}


function getTypeColor(type) {
    switch(type) {
        case 'fire': return '#f08030';
        case 'water': return '#6890f0';
        case 'grass': return '#78c850';
        case 'electric': return '#f8d030';
        case 'ice': return '#98d8d8';
        case 'fighting': return '#c03028';
        case 'poison': return '#a040a0';
        case 'ground': return '#e0c068';
        case 'flying': return '#a890f0';
        case 'psychic': return '#f85888';
        case 'bug': return '#a8b820';
        case 'rock': return '#b8a038';
        case 'ghost': return '#705898';
        case 'dragon': return '#7038f8';
        case 'dark': return '#705848';
        case 'steel': return '#b8b8d0';
        case 'fairy': return '#ee99ac';
        default: return '#68a090';
    }
}


function showPokemonDetails(pokemon) {
    let abilitiesHTML = pokemon.abilities.map(ability => {
        let abilityName = ability.ability.name;
        let abilityPercentage = Math.floor(Math.random() * 100); // Beispielhafte Prozentzahl
        return `
            <div class="ability">
                <span class="ability-name">${abilityName}</span>
                <div class="ability-bar">
                    <div class="ability-bar-fill" style="width: ${abilityPercentage}%;"></div>
                </div>
            </div>
        `;
    }).join('');
    
    modalPokemonDetails.innerHTML = `
        <div class="testDiv">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <h3>${pokemon.name}</h3>
        <p style="font-weight:bold;"># ${pokemon.id}</p>
        <p style="font-weight:bold;">Typ: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        ${abilitiesHTML}
    `;
    pokemonModal.style.display = 'block';
}


function filterPokemon(searchTerm) {
    pokemonContainer.innerHTML = '';
    let filteredPokemon = allPokemon.filter(pokemon => pokemon.name.includes(searchTerm));
    renderPokemon(filteredPokemon);
}


function navigatePokemon(direction) {
    let currentPokemon = allPokemon.find(pokemon => pokemon.name === modalPokemonDetails.querySelector('h3').textContent.toLowerCase());
    let currentIndex = allPokemon.indexOf(currentPokemon);
    let newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < allPokemon.length) {
        fetch(allPokemon[newIndex].url)
            .then(response => response.json())
            .then(pokemonData => showPokemonDetails(pokemonData));
    }
}
