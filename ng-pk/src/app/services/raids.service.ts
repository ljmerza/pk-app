import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { GymsService } from './gyms.service'

import { Subject }    from 'rxjs/Subject'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class RaidsService extends GymsService {

	/*
	*
	*
	*
	* 
	 */
	constructor(http:Http) {
		super(http)
	}


	raidData = {}
	foundRaidData:boolean = false

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
	async getFormattedRaids(isRefresh=false, callback: (data) => void) {

		// if we arent looking for a refresh and data already exists then just return that
		if(!isRefresh && this.foundRaidData){
			return callback(this.raidData)
		}


		this.getGyms( gyms => {
			const raids = this.getRaidsFromGyms(gyms)
			const sortedRaids = this.sortByLevelAndName(raids)
			console.log('sorted raids', sortedRaids)
			const filteredData = this.filterData(sortedRaids)
			console.log('sorted raids', filteredData)
			this.raidData = filteredData
			this.foundRaidData = true

			callback(filteredData)
		})
	}

	/*
	*
	*
	*
	* 
	 */
	getRaidsFromGyms(gyms) {
		const currentEpoch = (new Date()).getTime()

		const raids = Object.keys(gyms)
		.filter( gym => {
			return (gyms[gym].raid 
				&& gyms[gym].raid.level > 0 
				&& currentEpoch < gyms[gym].raid.end 
				&& gyms[gym].raid.pokemon_name)
		})
		.map( gym => gyms[gym] )

		return raids
	}

	/*
	*
	*
	*
	* 
	*/
	filterData(raidData) {
		return raidData.map( raid => {
			return {
				'location_name': raid.name,
				'cp': raid.raid.cp,
				'level': raid.raid.level,
				'pokemon_name': raid.raid.pokemon_name,
				'color': raid.raid.pokemon_types ? raid.raid.pokemon_types[0].color : '#333333',
				'latitude': raid.latitude,
				'longitude': raid.longitude,
				'end': raid.raid.end,
				'team': raid.team_id == 1 ? 'Mystic' : raid.team_id == 2 ? 'Valor' : 'Instinct'
			}
		})
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
			const sameLevel:boolean = a.raid.level === b.raid.level

			// if same level then sort by name
			if(sameLevel) {
				if(a.raid.pokemon_name > b.raid.pokemon_name) return 1
				if(a.raid.pokemon_name < b.raid.pokemon_name) return -1
				return 0

			} else {
				// esle sort by level
				if(a.raid.level < b.raid.level) return 1
				if(a.raid.level > b.raid.level) return -1
				return 0
			}
		})
	}

}