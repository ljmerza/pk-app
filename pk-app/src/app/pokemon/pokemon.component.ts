import { Component, AfterViewInit } from '@angular/core';

declare var $ :any;

@Component({
  	selector: 'app-pokemon',
  	templateUrl: './pokemon.component.html',
	styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent {

  	constructor() { }
	
  	title = 'Pokemon GO Pokemon';
	
  	common = [];
  	uncommon = [];
  	rare = [];
  	veryRare = [];
  	misc = [];
	
  	pokemon_data= [];
  	shown_pokemon = [];

  	ngAfterViewInit() {
		$(".button-collapse").sideNav();
		this.refreshPokemonList();
 		this.getPopularityX(4);
  	}


   /* refreshPokemonList
    *  refreshes the pokemon list from the server and
    *  stores it in an array
    *
    *  @param {None}
    *  @return {None}
    */
	refreshPokemonList() {
		$.getJSON('localhost:3000/api/pokemons').then( data => {
			this.pokemon_data = data.pokemons;
		});
	},


	sortPokemon() {
	    this.pokemon_data.forEach( pokemon => {
			if(pokemon.pokemon_rarity.match(/common/i)){
				this.common.push(pokemon);
			} else if(pokemon.pokemon_rarity.match(/uncommon/i)){
				this.uncommon.push(pokemon);
			}else if(pokemon.pokemon_rarity.match(/rare/i)){
				this.rare.push(pokemon);
			}else if(pokemon.pokemon_rarity.match(/very rare/i)){
				this.veryRare.push(pokemon);
			} else {
				this.misc.push(pokemon);
			}
		});
	},


	getPopularityX(popularity=0) {
		if(popularity = 1) {
			this.shown_pokemon = this.common
		} else if(popularity = 2) {
			this.shown_pokemon = this.uncommon
		} else if(popularity = 3) {
			this.shown_pokemon = this.rare
		} else if(popularity = 4) {
			this.shown_pokemon = this.veryRare
		} else if(popularity = 5) {
			this.shown_pokemon = this.misc
		} else {
			this.shown_pokemon = this.pokemon_data;
		}

		$('.button-collapse').sideNav('hide');
	}

}
