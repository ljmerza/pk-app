import { Component, AfterViewInit  } from '@angular/core';

import { PokemonService } from './../services/pokemon.service';

declare var $ :any;

@Component({
	selector: 'app-pokemon',
	templateUrl: './pokemon.component.html',
	styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent {

	constructor(private service:PokemonService) { }
	
	title:string = 'Pokemon GO Pokemon';
	
	// loading vars
	loadingMessage:string = 'Loading Pokemon please wait...';
	message:string = this.loadingMessage;
	currentlyLoading:boolean = true;
	
	// arrays of pokemon by rarity
	common:Array<object> = [];
	uncommon:Array<object> = [];
	rare:Array<object> = [];
	veryRare:Array<object> = [];
	ultraRare:Array<object> = [];
	unknown:Array<object> = [];
	all:Array<object> = [];

	// regex to filter pokemon by rarity
	commonRegExp = /^common/i;
	uncommonRegExp = /^uncommon/i;
	rareRegExp = /^rare/i;
	veryRareRegExp = /^very/i;
	ultraRareRegExp = /^ultra/i;

	filteredRarity:string = 'rare'; // the current filter
	
	pokemons; // all pokemon gotten from server
	pokemonsShown:Array<object> = []; // which pokemon are shown

	/*
  	*
  	*
  	*
  	* 
  	 */
	async ngAfterViewInit() {
		$(".button-collapse").sideNav();
		this.pokemonRefresh();
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	resetFilteredData() {
		this.common = [];
		this.uncommon = [];
		this.rare = [];
		this.veryRare = [];
		this.ultraRare = [];
		this.unknown = [];
		this.all = [];
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	pokemonRefresh() {
		// set loading vars
		this.currentlyLoading = true;
		this.message = this.loadingMessage;

		// get formatted pokemon data
		this.service.getFormattedPokemon(pokemons => {
			this.pokemons = pokemons;

			// filter/show pokemon by rarity
			this.resetFilteredData();
			this.filterIntoRarityArrays();
			this.showByRarity();

			// say we are done now
			this.doneLoading();
		});	
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	changeRarity(rarity:string){
		// set current rarity and update currently shown pokemon
		this.filteredRarity = rarity;
		this.showByRarity();

		// hide menu and scroll to top
		$('.button-collapse').sideNav('hide');
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	doneLoading() {
		// reset loading vars
		this.currentlyLoading = false;
		this.message = 'No Pokemon Found.'

		// make dropdowns collapsible
    	$('.collapsible').collapsible();
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	filterIntoRarityArrays(){
	
		for(let name in this.pokemons){
			const pokemon = this.pokemons[name][0];
	
		 	if( this.commonRegExp.test(pokemon.pokemon_rarity) ){
				this.common.push(this.pokemons[name]);

			} else if( this.uncommonRegExp.test(pokemon.pokemon_rarity) ){
				this.uncommon.push(this.pokemons[name])

			} else if( this.rareRegExp.test(pokemon.pokemon_rarity) ){
				this.rare.push(this.pokemons[name])

			} else if( this.veryRareRegExp.test(pokemon.pokemon_rarity) ){
				this.veryRare.push(this.pokemons[name])

			} else if( this.ultraRareRegExp.test(pokemon.pokemon_rarity) ){
				this.ultraRare.push(this.pokemons[name])

			} else {
				this.unknown.push(this.pokemons[name])
			}

			this.all.push(this.pokemons[name]);
		}
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	showByRarity() {
		const rarity = this.filteredRarity;

		if( rarity.match(/^common/) ){
			this.pokemonsShown = this.common.slice();

		} else if( rarity.match(/^uncommon/) ){
			this.pokemonsShown = this.uncommon.slice();

		} else if( rarity.match(/^rare/) ){
			this.pokemonsShown = this.rare.slice();

		} else if( rarity.match(/^very/) ){
			this.pokemonsShown = this.veryRare.slice();

		} else if( rarity.match(/^ultra/) ){
			this.pokemonsShown = this.ultraRare.slice();

		} else if( rarity.match(/^unknown/) ){
			this.pokemonsShown = this.unknown.slice();

		} else if( rarity.match(/^all/) ){
			this.pokemonsShown = this.all.slice();

		} else {
			this.pokemonsShown = [];
		}
	}

}
