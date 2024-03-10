import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/pages-student/student.service';

@Component({
  selector: 'app-score-student',
  templateUrl: './score-student.component.html',
  styleUrls: ['./score-student.component.less']
})
export class ScoreStudentComponent implements OnInit {
  listOfData = [];

  constructor(
    private insuranceSrv: StudentService
  ) { }

  ngOnInit(): void {
    this.insuranceSrv.getStudentScore({userId: localStorage.getItem('userId')})
      .subscribe(res =>{
        if(res.status ===1){
          this.listOfData = res.data;
        }
      });
  }

}
