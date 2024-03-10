import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-area-stats',
  templateUrl: './area-stats.component.html',
  providers: [DatePipe]
})
export class AreaStatsComponent implements OnInit {
  listOfData: any[] = [];

  constructor(private fb: FormBuilder,
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService,
    private datePipe: DatePipe) {

  }

  changeUpgradeStatus(data: any, status: number) {
    this.insuranceSrv.changeUpgradeStatus({
      userId: data.userId,
      status,
      id: data.id
    }).subscribe(res => {
      if (res.status === 1) {
        this.msgSrv.success(res.message);
        Object.assign(data, { status });
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }
  getAllUpgrade() {
    this.insuranceSrv.getAllUpgrade().subscribe(res => {
      if(res.status === 1) {
        this.listOfData = res.data.map((item: any) => Object.assign(item, {href: this.insuranceSrv.getAvatarUrl(item.fileId)}));
      }
    });
  }

  ngOnInit() {
    this.getAllUpgrade();
  }
}
