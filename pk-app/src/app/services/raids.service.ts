import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GymsService } from './gyms.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RaidsService extends GymsService {

	/*
	*
	*
	*
	* 
	 */
	constructor(http:Http) {
		super(http, 'api/gyms');
	}

	/*
	*
	*
	*
	* 
	 */
	async getFormattedRaids(callback: (data) => void) {
		this.getGyms( gyms => {
			const raids = this.getRaidsFromGyms(gyms);
			const sorted = this.sortByLevelAndName(raids);
			callback(sorted);
		});
	}

	/*
	*
	*
	*
	* 
	 */
	getGyms(callback: (data) => void){
		return super.getAll()
		.map(response => response.gyms)
		.subscribe( gyms  => callback(gyms) );
	}

	/*
	*
	*
	*
	* 
	 */
	getRaidsFromGyms(gyms) {
		const currentEpoch = (new Date()).getTime();

		const raids = Object.keys(gyms)
		.filter( gym => gyms[gym].raid.level > 0 && currentEpoch < gyms[gym].raid.end )
		.map( gym => gyms[gym] );

		return raids;
	}

	/*
	*
	*
	*
	* 
	 */
	sortByLevelAndName(raids) {
		
		return raids.sort( function compare(a, b):number {

			// see if same level
			const sameLevel:boolean = a.raid.level === b.raid.level;

			// if same level then sort by name
			if(sameLevel) {
				if(a.raid.pokemon_name > b.raid.pokemon_name) return 1;
				if(a.raid.pokemon_name < b.raid.pokemon_name) return -1;
				return 0;

			} else {
				// esle sort by level
				if(a.raid.level < b.raid.level) return 1;
				if(a.raid.level > b.raid.level) return -1;
				return 0;
			}
		});
	}

}