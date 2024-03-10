import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { OrderAddComponent } from '../order-add/order-add.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  providers: [DatePipe]
})
export class SalesComponent implements OnInit {
  listOfData: any[] = [];
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService,
    private modal: NzModalService,
    private datePipe: DatePipe) {

  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.insuranceSrv.getOrders(Object.assign(this.validateForm.value, 
      { date: this.validateForm.value.date ? this.datePipe.transform(this.validateForm.value.date, 'yyyy-MM-dd') : '' }))
    .subscribe(res => {
      if (res.status === 1) {
        this.listOfData = res.data;
      } else {
        this.msgSrv.error(res.message);
        this.listOfData = [];
      }
    });
  }

  add() {
    const modal = this.modal.create({
      nzTitle: '创建订单',
      nzWidth: 550,
      nzContent: OrderAddComponent,
      nzFooter: null
    });
    modal.afterClose.subscribe(result => {
      this.submitForm();  
    });
  }

  deleteOrder(orderId) {
    this.insuranceSrv.deleteOrder({orderId})
    .subscribe(res => {
      if (res.status === 1) {
        this.msgSrv.success(res.message);
        this.submitForm();  
      } else {
        this.msgSrv.error(res.message);
      }
    })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      orderId: [''],
      area: [''],
      date: ['']
    });
  }
}
