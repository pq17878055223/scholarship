import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { ProductAddComponent } from '../product-add/product-add.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  editId: string | null = null;
  listOfData: any[] = [];
  constructor(private insuranceSrv: InsuranceService,
              private msgSrv: NzMessageService) {
  }
  changeActivityStatus(data: any, status: number) {
    this.insuranceSrv.changeActivityStatus({
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
  getAllActivity() {
    this.insuranceSrv.getAllActivity().subscribe(res => {
      if(res.status === 1) {
        this.listOfData = res.data.map((item: any) => Object.assign(item, {href: this.insuranceSrv.getAvatarUrl(item.fileId)}));
      }
    });
  }
  startEdit(id: any): void {
    this.editId = id;
    }
  stopEdit(description): void {
    this.editId = null;
    this.insuranceSrv.setDescription({
      userId: localStorage.getItem('userId'),
      Description: description
    }).subscribe(res => {
      if (res.status === 1) {
        this.msgSrv.success(res.message);
      }
    });
  }

  ngOnInit(): void {
    this.getAllActivity();
  }
}
