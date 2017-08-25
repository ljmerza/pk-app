import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';

@Injectable()
export class GymsService extends DataService {

  /*
  	*
  	*
  	*
  	* 
  	 */
  	constructor(http:Http, url:string) {
      super(http, url || 'api/pokemon');
  	}


}