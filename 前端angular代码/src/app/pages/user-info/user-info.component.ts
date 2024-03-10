import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {
  user: any;
  avatarUrl?: string;
  constructor(private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService,
    private modal: NzModalService) {}


  edit() {
    const modal = this.modal.create({
      nzTitle: '修改我的信息',
      nzWidth: 600,
      nzContent: UserEditComponent,
      nzComponentParams: {
        userInfo: this.user
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(result => {
      if(result && result.userId) {
        this.user = result;   
        this.avatarUrl = this.insuranceSrv.getAvatarUrl(result.avatar);
      }
    });
  }
  ngOnInit() {
    this.insuranceSrv.getUser({ userId: localStorage.getItem('userId') })
    .subscribe(res => {
      if (res.status === 1) {
        this.user = res;
        this.avatarUrl = this.insuranceSrv.getAvatarUrl(res.avatar);
      }
    });
  }
}
