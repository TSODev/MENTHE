import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-svgimage',
  templateUrl: './svgimage.component.html',
  styleUrls: ['./svgimage.component.css']
})
export class SvgimageComponent implements OnInit {

  @Input()
  imagesvg: string;

  constructor() { }

  ngOnInit() {

  }

}
