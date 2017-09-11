import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { PokemonService } from './../services/pokemon.service'

declare var $ :any

@Component({
	selector: 'app-pokemon',
	templateUrl: './pokemon.component.html',
	styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit, OnDestroy {

	constructor(private service:PokemonService, private route: ActivatedRoute) {

	}
	
	// loading vars
	loadingMessage:string = 'Loading Pokemon please wait...'
	message:string = this.loadingMessage
	currentlyLoading:boolean = true
	
	// arrays of pokemon by rarity
	common:Array<object> = []
	uncommon:Array<object> = []
	rare:Array<object> = []
	veryRare:Array<object> = []
	ultraRare:Array<object> = []
	unknown:Array<object> = []
	all:Array<object> = []

	// regex to filter pokemon by rarity
	commonRegExp = /^common/i
	uncommonRegExp = /^uncommon/i
	rareRegExp = /^rare/i
	veryRareRegExp = /^very/i
	ultraRareRegExp = /^ultra/i

	filteredRarity:string = 'very rare' // the current filter
	
	pokemons // all pokemon gotten from server
	pokemonsShown:Array<object> = [] // which pokemon are shown
	disposableObj

	/*
  	*
  	*
  	*
  	* 
  	 */
	ngOnInit() {

		// get notified of a refresh
		this.disposableObj = this.service.notifyChildObservable.subscribe( () => {
        	this.pokemonRefresh(true)
      	})

		// always set new rarity when refeshing route
		this.route.paramMap
  		.subscribe( params => {

  			// get title and edit it if needed
  			const title = params.get('rarity');
  			if( this.veryRareRegExp.test(title) ) this.filteredRarity = 'very rare'
			else if( this.ultraRareRegExp.test(title) ) this.filteredRarity = 'ultra rare'
			else this.filteredRarity = title

			// try to refrsh pokemon list and show up rarity
  			this.pokemonRefresh()
  			this.showByRarity()
  		})


	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	ngOnDestroy() {
		this.disposableObj.unsubscribe()
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	resetFilteredData() {
		this.common = []
		this.uncommon = []
		this.rare = []
		this.veryRare = []
		this.ultraRare = []
		this.unknown = []
		this.all = []
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	pokemonRefresh(isRefresh:boolean=false) {

		// set loading vars and motify parent
		this.message = this.loadingMessage
		this.service.notifyParentComponent({isLoading:true, title:this.filteredRarity})

		// get formatted pokemon data
		this.service.getFormattedPokemon(isRefresh, pokemons => {
			this.pokemons = pokemons

			// filter/show pokemon by rarity
			this.resetFilteredData()
			this.filterIntoRarityArrays()
			this.showByRarity()

			// say we are done now and notify parent we are done
			this.doneLoading()
		})	
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	doneLoading() {

		this.service.notifyParentComponent({isLoading:false, title:this.filteredRarity})
		this.message = 'No Pokemon Found.'

		// make dropdowns collapsible
		setTimeout(() => {
			$('.collapsible').collapsible()
		},1000)
    	
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	filterIntoRarityArrays(){
	
		for(let name in this.pokemons){
			const pokemon = this.pokemons[name][0]
	
		 	if( this.commonRegExp.test(pokemon.pokemon_rarity) ){
				this.common.push(this.pokemons[name])

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

			this.all.push(this.pokemons[name])
		}
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	showByRarity() {
		const rarity = this.filteredRarity

		if( rarity.match(/^common/) ){
			this.pokemonsShown = this.common.slice()

		} else if( rarity.match(/^uncommon/) ){
			this.pokemonsShown = this.uncommon.slice()

		} else if( rarity.match(/^rare/) ){
			this.pokemonsShown = this.rare.slice()

		} else if( rarity.match(/^very/) ){
			this.pokemonsShown = this.veryRare.slice()

		} else if( rarity.match(/^ultra/) ){
			this.pokemonsShown = this.ultraRare.slice()

		} else if( rarity.match(/^unknown/) ){
			this.pokemonsShown = this.unknown.slice()

		} else if( rarity.match(/^all/) ){
			this.pokemonsShown = this.all.slice()

		} else {
			this.pokemonsShown = []
		}
	}

}
