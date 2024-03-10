import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentService } from 'src/app/pages-student/student.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import {CheckInformComponent} from '../check-inform/check-inform.component';

@Component({
  selector: 'app-inform-student',
  templateUrl: './inform-student.component.html',
  styleUrls: ['./inform-student.component.less']
})
export class InformStudentComponent implements OnInit {
  isLoading = false;
  listOfData = [];

  constructor(
    private insuranceSrv: StudentService,
    private modal: NzModalService
  ) { }
  check(inform){
    this.modal.create({
      nzWidth: 800,
      nzMaskClosable: false,
      nzContent: CheckInformComponent,
      nzComponentParams: {
        informInfo: inform
      },
      nzFooter: null
    });
  }
  getAllInform() {
    this.isLoading = true;
    this.insuranceSrv.getAllInform().subscribe(res => {
      this.isLoading = false;
      if(res.status === 1) {
        this.listOfData = res.data.map((item: any) => Object.assign(item, {href: this.insuranceSrv.getAvatarUrl(item.fileId)}));
      }
    });
  }

  ngOnInit(): void {
    this.getAllInform()
  }

}
