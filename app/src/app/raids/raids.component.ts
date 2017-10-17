import { Component, AfterViewInit } from '@angular/core'
import { RaidsService } from './../services/raids.service'
import { ActivatedRoute } from '@angular/router'


declare var $ :any

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
	constructor(private service:RaidsService,  private route: ActivatedRoute) { }


	loadingMessage:string = 'Loading Pokemon GO raids...'
	notFoundMessage:string = 'No raids found.'
	currentMessage:string = this.loadingMessage

	currentLevel:number = 5
	title:string


	raids = []
	shownRaids = []

	disposableObj


	/*
	*
	*
	*
	* 
	*/
	ngOnInit() {

		// if we are notifed of a manual refresh then pass that down
		this.disposableObj = this.service.notifyChildObservable.subscribe( () => {
        	this.refreshRaids(true);
      	})  		

		// on route change set current raid level and refresh raid list
		this.route.paramMap
  		.subscribe( params => {

  			// get current level filtered and edit if needed
  			this.title = params.get('level')

  			if( this.title === 'all' ) { 
  				this.currentLevel = 0
  				this.title = 'all raids' 

  			} else {
  				// else add raw param to title and convert title
  				this.currentLevel = parseInt(this.title)
  				this.title = `level ${this.title}`
  			}

  			// filter shown by level selected and refresh raids
  			this.showByLevel()
  			this.refreshRaids()
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
  	refreshRaids(isRefresh:boolean=false){
    	// set laoding var
    	this.currentMessage = this.loadingMessage

    	// notify parent that we are loading
    	this.service.notifyParentComponent({isLoading: true, title: this.title})

    	// get raids
    	this.service.getFormattedRaids(isRefresh, raids => {

    		// notify parent that we are done loading
    		this.service.notifyParentComponent({isLoading: false, title: this.title})

    		// save all raids
    		this.raids = raids

	      	// show raids by currently selected level
	      	this.showByLevel()

	      	// reset loading vars
	      	this.currentMessage = this.notFoundMessage
	    })
  	}

  /*
  *
  *
  *
  * 
   */
  	showByLevel() {

		// if level null then show all pokemon
		if(!this.currentLevel){
			this.shownRaids = this.raids

		} else {
			// else filter by currently selected raid level
			this.shownRaids = this.raids.filter( raid => {
				return raid.level == this.currentLevel
			})    
		}
  	}


}
