import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objtoarr'
})
export class ObjtoarrPipe implements PipeTransform {

  transform(value: any, args?: any): any[] {
		// create instance vars to store keys and final output
        let keyArr: any[] = Object.keys(value), dataArr = [];

        // loop through the object,
        // pushing values to the return array
        keyArr.forEach((key: any) => {
            dataArr.push(value[key]);
        });

        // sort by raid level
        dataArr.sort( function compare(a, b){
        	if(a.raid.level < b.raid.level) return 1;
        	else if(a.raid.level > b.raid.level) return -1;
        	else return 0
        })

        // return the resulting array
        return dataArr;
  }

}
