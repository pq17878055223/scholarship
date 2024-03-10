import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/pages-student/student.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.less']
})
export class SetPasswordComponent implements OnInit {
  listOfData = [];
  editId: string | null = null;
  user: any;

  constructor(
    private insuranceSrv: StudentService,
    private msgSrv: NzMessageService
  ) { }
  startEdit(id: any): void {
    this.editId = id;
    /*
    this.insuranceSrv.setPassword({
      userId: localStorage.getItem('userId'),
      Password: password
    }).subscribe(res => {
      if (res.status === 1) {
        this.msgSrv.success(res.message);
    }
  })*/}
  stopEdit(password): void {
    this.editId = null;
    this.insuranceSrv.setPassword({
      userId: localStorage.getItem('userId'),
      Password: password
    }).subscribe(res => {
      if (res.status === 1) {
        this.msgSrv.success(res.message);
      }
    })
  }

  ngOnInit(): void {
    this.insuranceSrv.getUser({userId: localStorage.getItem('userId')})
      .subscribe(res =>{
        if(res.status ===1){
          this.listOfData.push(res);
          this.user = res;
        }
      });
  }

}
