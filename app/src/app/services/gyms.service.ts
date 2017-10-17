import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';

import { Subject }    from 'rxjs/Subject'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class GymsService extends DataService {

  /*
  	*
  	*
  	*
  	* 
  	 */
  	constructor(http:Http, url?:string) {
      super(http, url || 'gyms');
  	}


  	gymData = {}
	foundGymData:boolean = false

	/*
	*
	*
	*
	* 
	*/
	private notifyChildGym = new Subject<any>()
	notifyChildObservableGym = this.notifyChildGym.asObservable()
	public notifyChildComponentGym() {
      	this.notifyChildGym.next()
  	}

	/*
	*
	*
	*
	* 
	*/
	private notifyParentGym = new Subject<any>()
	notifyParentObservableGym = this.notifyParentGym.asObservable()
	public notifyParentComponentGym(data) {
		this.notifyParentGym.next(data)
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
		.subscribe( gyms  => callback(gyms) )
	}


}