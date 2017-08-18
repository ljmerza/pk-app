import { Component, AfterViewInit } from '@angular/core';

declare var $ :any;

@Component({
  selector: 'app-raids',
  templateUrl: './raids.component.html',
  styleUrls: ['./raids.component.css']
})
export class RaidsComponent {

  constructor() { }

  title:string = 'Pokemon GO Raids';
  message:string = 'Loading Pokemon GO Raids list...';
  level:number = 5;
  shownLevel:string = 'Level 5';
  currentlyLoading:boolean = true;

  gyms = [];
  raids = [];
  filteredRaids = []

  startTime:number = new Date().getTime()-10000000;

  ngAfterViewInit() {
  	$(".button-collapse").sideNav();
    this.refreshGyms();
  }

  async refreshGyms(){
    this.currentlyLoading = true;
    await this.refreshGymList();
    await this.getRaidsFromGyms();
    await this.sortRaids();
    await this.showByLevel(this.level);
    this.doneLoading();
  }

  refreshGymList() {
    this.startTime += 1;
    const currentTime:number = new Date().getTime();

    return $.getJSON(`api/gyms/${this.startTime}/${currentTime}/`).then( data => {
      this.gyms = data.gyms;
    })
    .fail( () => {
      this.message = 'Failed to load raid data.'
      this.currentlyLoading = false;
    });
  }

  doneLoading() {
    this.currentlyLoading = false;
    this.message = 'No Raids Found.'
  }


  getRaidsFromGyms() {

    const currentEpoch = (new Date()).getTime();

    return new Promise( resolve => {
      // reset raids array
      this.raids = [];

      // for each gym object get selected raid level
      for(let key in this.gyms){

        // if enmd time passed then skip raid
        // if(currentEpoch > this.gyms[key].raid.end) break;

        if(this.gyms[key].raid.level > 0){
          this.raids.push(this.gyms[key]);
        }
      }
      resolve();
    });
  }


  sortRaids() {
    return new Promise( resolve => {
       this.raids.sort( function compare(a, b):number {
        if(a.raid.level < b.raid.level) return 1;
        else if(a.raid.level > b.raid.level) return -1;
        else return 0
      });

      this.message = 'No raids available.';
     resolve();
   });
  }



  showByLevel(newLevel:number=0) {
    return new Promise( resolve => {

      // set current level
      this.level = newLevel;

      // set header
      if(newLevel == 0) this.shownLevel = 'All'
      else this.shownLevel = `Level ${newLevel}`;

      // if level 0 then show all pokemon
      if(!newLevel){
        this.filteredRaids = this.raids;
      } else {
        // else filter by currently selected raid level
        this.filteredRaids = this.raids.filter( gym => {
          return gym.raid.level == newLevel;
        });    
      }

      // close nav menu
      $('.button-collapse').sideNav('hide');

      resolve();
    });
  }


}
