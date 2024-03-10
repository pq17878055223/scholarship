import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../student.service';


@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.less']
})
export class StudentInfoComponent implements OnInit {

  isCollapsed = false;
  user:any;
  constructor(private router: Router,
              private studentSrv: StudentService
  ) { }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/passport');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('userId')) {
      this.router.navigateByUrl('/passport');
    }
    this.studentSrv.getUser({userId:localStorage.getItem('userId')})
      .subscribe(res =>{
        this.user = res;
      });
  }

}
