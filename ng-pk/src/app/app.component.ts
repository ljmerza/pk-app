import { Component, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'

import { PokemonService } from './services/pokemon.service'
import { RaidsService } from './services/raids.service'

declare var $ :any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {	

	/*
	*
	*
	*
	* 
	*/
	constructor(private pokemonService:PokemonService, private raidsService:RaidsService, private router:Router) {

	}


	// store gym and pokemon data
	pokemonData
	raidData
	gymData

	isLoading: boolean = false
	title: string = ''

	/*
	*
	*
	*
	* 
	*/
	ngAfterViewInit() {

		// be notified when child done loading and title change
		this.pokemonService.notifyParentObservable.subscribe( (data) => {
        	this.isLoading = data.isLoading
        	this.title = data.title
      	})

      	this.raidsService.notifyParentObservable.subscribe( (data) => {
        	this.isLoading = data.isLoading
        	this.title = data.title
      	})


		$('.button-collapse').sideNav({
			menuWidth: 300, // Default is 300
			edge: 'left', // Choose the horizontal origin
			closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
			draggable: true, // Choose whether you can drag to open on touch screens,
			onOpen: function(el) {	}, // A function to be called when sideNav is opened
			onClose: function(el) { }, // A function to be called when sideNav is closed
		})
	}

	/*
	*
	*
	*
	* 
	*/
	closeNav(title:string) {
		$('.button-collapse').sideNav('hide')
	}

	/*
	*
	*
	*
	* 
	*/
	refreshData() {
		// notify child we want a refresh
		if( /raids/.test(this.router.url) ) 			this.raidsService.notifyChildComponent()
		else if( /pokemon/.test(this.router.url) ) 		this.pokemonService.notifyChildComponent()
	}

		
}


