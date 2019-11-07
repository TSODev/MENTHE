import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.component.html',
  styleUrls: ['./main-dash.component.css']
})
export class MainDashComponent {

  articles = [
    {
      title: 'Test',
      content: 'Test'
    },
    {
      title: 'Test2',
      content: 'Test2'
    }
    ];
}
