import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userfilter'
})
export class UserfilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.lastname.toLowerCase().includes(searchText) ||
              it.firstname.toLowerCase().includes(searchText) ||
              it.company.toLowerCase().includes(searchText) ||
              it.domain.toLowerCase().includes(searchText);
    });
   }
  }
