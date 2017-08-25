import { Component, AfterViewInit } from '@angular/core';
import { RaidsService } from './../services/raids.service';


declare var $ :any;

@Component({
	selector: 'app-raids',
	templateUrl: './raids.component.html',
	styleUrls: ['./raids.component.css']
})
export class RaidsComponent {

	/*
	*
	*
	*
	* 
	*/
	constructor(private service:RaidsService) { }


	title:string = 'Pokemon GO Raids'

	loadingMessage:string = 'Loading Pokemon GO raids...'
	notFoundMessage:string = 'No raids found.'
	currentMessage:string = this.loadingMessage
	currentlyLoading:boolean = true

	currentLevel:number = 5
	shownLevel:string = 'Level 5'

	raids = []
	shownRaids = []


	/*
	*
	*
	*
	* 
	*/
	ngAfterViewInit() {
		$(".button-collapse").sideNav();
		this.refreshRaids();
	}

	/*
	*
	*
	*
	* 
	*/
  	refreshRaids(){
    	// set laoding vars
    	this.currentMessage = this.loadingMessage;
    	this.currentlyLoading = true;

    	// get raids
    	this.service.getFormattedRaids(raids => {

    		// save all raids
    		this.raids = raids;

	      	// show raids by currently selected level
	      	this.showByLevel(this.currentLevel);

	      	// reset loading vars
	      	this.currentMessage = this.notFoundMessage;
	      	this.currentlyLoading = false;
	    });
  	}

  /*
  *
  *
  *
  * 
   */
  	showByLevel(newLevel:number) {
		// set current level
		this.currentLevel = newLevel;

		// set header for HTML
		if(newLevel == 0) this.shownLevel = 'All'
		else this.shownLevel = `Level ${newLevel}`;

		// if level null then show all pokemon
		if(!newLevel){
			this.shownRaids = this.raids;

		} else {
			// else filter by currently selected raid level
			this.shownRaids = this.raids.filter( gym => {
				return gym.raid.level == newLevel;
			});    
		}

		// close nav menu
		$('.button-collapse').sideNav('hide');
  	}


}
