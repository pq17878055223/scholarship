import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceService } from '../insurance.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;
  user:any;
  constructor(private router: Router,
              private insuranceSrv: InsuranceService
  ) { }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/passport');
  }

  ngOnInit() {
    if (!localStorage.getItem('userId')) {
      this.router.navigateByUrl('/passport');
    }
    this.insuranceSrv.getUser({userId:localStorage.getItem('userId')})
      .subscribe(res =>{
        this.user = res;
      });
  }

}
