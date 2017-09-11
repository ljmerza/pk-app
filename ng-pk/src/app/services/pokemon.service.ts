import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { DataService } from './data.service'

import { Subject } from 'rxjs/Subject'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class PokemonService extends DataService {

	/*
	*
	*
	*
	* 
	*/
	constructor(http:Http) {
		super(http, 'api/pokemon')
	}

	maxPokemon:number = 5
	foundPokemonData:boolean = false
	pokemonData = {}

	/*
	*
	*
	*
	* 
	*/
	private notifyChild = new Subject<any>()
	notifyChildObservable = this.notifyChild.asObservable()
	public notifyChildComponent() {
		this.notifyChild.next()
	}


	/*
	*
	*
	*
	* 
	*/
	private notifyParent = new Subject<any>()
	notifyParentObservable = this.notifyParent.asObservable()
	public notifyParentComponent(data) {
		this.notifyParent.next(data)
	}

	/*
	*
	*
	*
	* 
	*/
	async getFormattedPokemon(isRefresh=false, callback: (data) => void){
		// if we arent looking for a refresh and data already exists then just return that
		if(!isRefresh && this.foundPokemonData){
			return callback(this.pokemonData)
		}

		// wait for curent coordinates
		const myCoords = await this.getCoordinates()
		
		// get pokemon data
		this.getPokemon(pokemons => {
			// add calculated pokemon data and sort by name and distance
			const pokemonAddedData = this.calcPokemonData(myCoords, pokemons)
			const pokemonSorted = this.sortByNameAndDistance(pokemonAddedData)
			// group into objet by pokemon name key
			const pokemonGrouped = this.groupByName(pokemonSorted)
			// save the formatted pokemon data and save that we have data now
			this.pokemonData = pokemonGrouped
			this.foundPokemonData = true
			// callback the data
			callback(pokemonGrouped)
		})
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
		.subscribe( pokemons	=> callback(pokemons) )
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
				pokemon.iv = (pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina)/45 * 100
			}
			return pokemon
		})
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
		})
	}

	/*
	*
	*
	*
	* 
	*/
	compare(a,b){
		if(a>b) return 1
		if(b>a) return -1
		return 0
	}

	/*
	*
	*
	*
	* 
	*/
	groupByName(pokemons) {
		const map = {}

		pokemons.forEach( pokemon => {

			// get list of current pokemon if exist
				const key = pokemon.pokemon_name
				const collection = map[key]

				// if list doesnt exist then create else add to list
				if (!collection) {
						map[key] = [pokemon]
				} else if(collection.length < this.maxPokemon){
						collection.push(pokemon)
				}
		})

		return map
	}

}