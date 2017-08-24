import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PokemonService extends DataService {

	/*
  	*
  	*
  	*
  	* 
  	 */
  	constructor(http:Http) {
  		super(http, 'api/pokemon/');
  	}
  	maxPokemon:number = 5;

  	/*
  	*
  	*
  	*
  	* 
  	 */
  	async getFormattedPokemon(callback: (data) => void){
  		const myCoords = await this.getCoordinates();

  		this.getPokemon(pokemons => {
	  		const pokemonsAddedData = this.calcPokemonData(myCoords, pokemons);
			const pokemonsSorted = this.sortByNameAndDistance(pokemonsAddedData);
			const pokemonsGrouped = this.groupByName(pokemonsSorted);
			callback(pokemonsGrouped);
  		});
  	}

  	/*
  	*
  	*
  	*
  	* 
  	 */
  	getPokemon(callback: (data) => void){
  		return super.getAll()
  		.map(response => response.pokemons)
  		.subscribe( pokemons  => callback(pokemons) );
  	}

  	/*
  	*
  	*
  	*
  	* 
  	 */
  	calcPokemonData(myCoords, pokemons) {
		return pokemons.map( pokemon => {
			// calc distance
			pokemon.distance = this.distanceInMiBetweenEarthCoordinates(myCoords.lat, myCoords.long, pokemon.latitude, pokemon.longitude)

			// calc IV
			if(pokemon.individual_attack){
				pokemon.iv = (pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina)/45 * 100;
			}

			return pokemon;
		});

	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	sortByNameAndDistance(pokemons) {
		return pokemons.sort( (a, b):number => {
			return this.compare(a.pokemon_name, b.pokemon_name) || this.compare(a.distance,b.distance)
		});
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	compare(a,b){
		if(a>b) return 1;
		if(b>a) return -1;
		return 0;
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	groupByName(pokemons) {
	    const map = {};

	    pokemons.forEach( pokemon => {

	    	// get list of current pokemon if exist
	        const key = pokemon.pokemon_name;
	        const collection = map[key];

	        // if list doesnt exist then create else add to list
	        if (!collection) {
	            map[key] = [pokemon];
	        } else if(collection.length < this.maxPokemon){
	            collection.push(pokemon);
	        }
	    });

	    return map;
	}

}