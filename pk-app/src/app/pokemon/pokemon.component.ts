import { Component, AfterViewInit  } from '@angular/core';

declare var $ :any;

@Component({
	selector: 'app-pokemon',
	templateUrl: './pokemon.component.html',
	styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent {

	constructor() { }
	
	title:string = 'Pokemon GO Pokemon';
	loadingMessage:string = 'Loading Pokemon please wait...';
	message:string = this.loadingMessage;
	currentlyLoading:boolean = true;
	
	common:Array<object> = [];
	uncommon:Array<object> = [];
	rare:Array<object> = [];
	veryRare:Array<object> = [];
	ultraRare:Array<object> = [];
	unknown:Array<object> = [];

	filteredRarity:string = 'ultra rare';
	
	pokemons = [];
	pokemonsShown:Array<object> = [];

	startTime:number = new Date().getTime()-10000000;

	async ngAfterViewInit() {
		$(".button-collapse").sideNav();

		this.pokemonRefresh();
	}

	resetFilteredData() {
		return new Promise( resolve => {
			this.common = [];
			this.uncommon = [];
			this.rare = [];
			this.veryRare = [];
			this.ultraRare = [];
			this.unknown = [];
			resolve()
		});
	}


	async pokemonRefresh() {

		this.currentlyLoading = true;
		this.message = this.loadingMessage;
		await this.refreshPokemonList();
		const myCoords = await this.getCoordinates();
		await this.calcPokemonData(myCoords);
		await this.sortByNameAndDistance();
		await this.resetFilteredData();
		await this.filterIntoRarityArrays();
		await this.showByRarity();
		this.doneLoading();
	}

	changeRarity(rarity:string){
		this.filteredRarity = rarity;
		this.showByRarity();
		$('.button-collapse').sideNav('hide');
	}


	getCoordinates() {
		return new Promise( resolve => {
			navigator.geolocation.getCurrentPosition( data => {
				resolve({lat:data.coords.latitude, long:data.coords.longitude});
			});
		});	
	}


	doneLoading() {
		this.currentlyLoading = false;
		this.message = 'No Pokemon Found.'
	}


	refreshPokemonList() {
		this.startTime += 1;
    	const currentTime:number = new Date().getTime();

    	return $.getJSON(`api/pokemon/${this.startTime}/${currentTime}/`).then( data => {
			this.pokemons = data.pokemons;
		})
		.fail( () => {
	      this.message = 'Failed to load pokemon data.'
	      this.currentlyLoading = false;
	    });
	}


	compare(a,b){
		if(a>b) return 1;
		if(b>a) return -1;
		return 0;
	}


	calcPokemonData(myCoords) {
		return new Promise( resolve => {
			this.pokemons = this.pokemons.map( pokemon => {
				// calc distance
				pokemon.distance = this.distanceInMiBetweenEarthCoordinates(myCoords.lat, myCoords.long, pokemon.latitude, pokemon.longitude)

				// calc IV
				if(pokemon.individual_attack){
					pokemon.iv = (pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina)/45 * 100;
				}

				return pokemon;
			});

			resolve();
		});
	}

	sortByNameAndDistance() {
		return new Promise( resolve => {
			// sort by name then distance
			this.pokemons = this.pokemons.sort( (a, b):number => {
				return this.compare(a.pokemon_name, b.pokemon_name) || this.compare(a.distance,b.distance)
			});

			resolve();
		});
	}

	filterIntoRarityArrays(){

		const commonRegExp = /^common/i;
		const uncommonRegExp = /^uncommon/i;
		const rareRegExp = /^rare/i;
		const veryRareRegExp = /^very/i;
		const ultraRareRegExp = /^ultra/i;


		return new Promise( resolve => {
			const current_epoch = (new Date()).getTime();


			this.pokemons = this.pokemons.map( pokemon => {

				// filter out old pokemon data
				if(current_epoch > pokemon.disappear_time) return;

			 	if( commonRegExp.test(pokemon.pokemon_rarity) ){
					this.common.push(pokemon);

				} else if( uncommonRegExp.test(pokemon.pokemon_rarity) ){
					this.uncommon.push(pokemon);

				} else if( rareRegExp.test(pokemon.pokemon_rarity) ){
					this.rare.push(pokemon);

				} else if( veryRareRegExp.test(pokemon.pokemon_rarity) ){
					this.veryRare.push(pokemon);

				} else if( ultraRareRegExp.test(pokemon.pokemon_rarity) ){
					this.ultraRare.push(pokemon);

				} else {
					this.unknown.push(pokemon);
				}

				return pokemon;
			});

			resolve();
		});
	}


	showByRarity() {
		const rarity = this.filteredRarity;

		if( rarity.match(/$common/) ){
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
			this.pokemonsShown = this.pokemons.slice();

		} else {
			this.pokemonsShown = [];
		}

		return Promise.resolve();
	}


	degreesToRadians(degrees:number):number {
		return degrees * Math.PI / 180;
	}


	distanceInMiBetweenEarthCoordinates(lat1, lon1, lat2, lon2):number {
		const earthRadiusMi:number = 3958.754641;

		const dLat:number = this.degreesToRadians(lat2-lat1);
		const dLon:number = this.degreesToRadians(lon2-lon1);

		lat1 = this.degreesToRadians(lat1);
		lat2 = this.degreesToRadians(lat2);

		const a:number = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		const c:number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		return earthRadiusMi * c;
	}


	trackPokemon(index, pokemon) {
		return pokemon ? pokemon.spawnpoint_id : undefined;
	}

}
