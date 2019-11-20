import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashfilter'
})
export class DashfilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter( it => {
//      console.log("Filter : ", it.title);
      return it.title.toLowerCase().includes(searchText);
    });
   }
  }
