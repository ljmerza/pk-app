import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { AppError } from './../errors/app-error';
import { NotFoundError } from './../errors/not-found-error';


@Injectable()
export class DataService {

	/*
  	*
  	*
  	*
  	* 
  	 */
  	constructor(private http:Http, private url:string) { }
  	

  	/*
  	*
  	*
  	*
  	* 
  	 */
  	private handleError(error:Response){
  		if(error.status === 404)
 			  return Observable.throw(new NotFoundError(error));
  	 	else
 			  return Observable.throw(new AppError(error));
  	}

  	/*
  	*
  	*
  	*
  	* 
  	 */
  	getAll() {

  		return this.http.get(`api/pogo/${this.url}`)
  		.map(response => response.json())
  		.retry(3)
  		.catch(this.handleError);
  	}

  	/*
  	*
  	*
  	*
  	* 
  	 */
  	getCoordinates() {
		return new Promise( resolve => {
			navigator.geolocation.getCurrentPosition( data => {
				resolve({lat:data.coords.latitude, long:data.coords.longitude});
			});
		});	
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	distanceInMiBetweenEarthCoordinates(lat1, lon1, lat2, lon2):number {
		const earthRadiusMi:number = 3958.754641;

		const dLat:number = this.degreesToRadians(lat2-lat1);
		const dLon:number = this.degreesToRadians(lon2-lon1);

		lat1 = this.degreesToRadians(lat1);
		lat2 = this.degreesToRadians(lat2);

		const a:number = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		const c:number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		return earthRadiusMi * c;
	}

	/*
  	*
  	*
  	*
  	* 
  	 */
	degreesToRadians(degrees:number):number {
		return degrees * Math.PI / 180;
	}

}
