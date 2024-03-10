import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-check-inform',
  templateUrl: './check-inform.component.html',
  styleUrls: ['./check-inform.component.less']
})
export class CheckInformComponent implements OnInit{
  @Input() informInfo: any;

  constructor() { }

  ngOnInit(): void {
  }

}
