import { Component, AfterViewInit } from '@angular/core';

declare var $ :any;

@Component({
  selector: 'app-raids',
  templateUrl: './raids.component.html',
  styleUrls: ['./raids.component.css']
})
export class RaidsComponent {

  constructor() { }

  title = 'Pokemon GO Raids';

  pokemon_data = [];
  filtered_raid_data = []

  ngAfterViewInit() {
  	$(".button-collapse").sideNav();
  	this.refreshGymList();
    this.getLevelX();
  }


   /* refreshGymList
    *  resfreshes the gym list from the server and
    *  stores it in an array
    *
    *  @param {None}
    *  @return {None}
    */
  refreshGymList() {
    $.getJSON('localhost:3000/api/gyms').then( data => {

      // get keys of gyms
      let gyms: any[] = Object.keys(data.gyms), dataArr = [];

      // loop through the object,
      // pushing values to the return array
      gyms.forEach((gym: any) => {
        if(data.gyms[gym].raid.level > 0){
          this.pokemon_data.push(data.gyms[gym]);
        }
      });

      this.sortGyms();
    });
  }


  sortGyms() {
    this.filtered_raid_data.sort( function compare(a, b){
      if(a.raid.level < b.raid.level) return 1;
      else if(a.raid.level > b.raid.level) return -1;
      else return 0
    });
  }

  getLevelX(level=0) {
    this.filtered_raid_data = [];

    if(!level){
      this.filtered_raid_data = this.pokemon_data;
    } else {
      this.pokemon_data.forEach( gym => {
        if(gym.raid.level == level){
          this.filtered_raid_data.push(gym);
        }
      });    
    }
    $('.button-collapse').sideNav('hide');
  }

}
