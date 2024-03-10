import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',

  styleUrls: ['./order-add.component.less'],
  providers: [DatePipe]
})
export class OrderAddComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.insuranceSrv.addOrder(Object.assign(this.validateForm.value, 
      { date: this.datePipe.transform(this.validateForm.value.date, 'yyyy-MM-dd') }))
    .subscribe(res => {
      if(res.status === 1) {
        this.modal.close(this.validateForm.value);
      } else {
        this.msgSrv.error(res.message);  
      }
    });
  }

  constructor(private fb: FormBuilder,
    private modal: NzModalRef,
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService,
    private datePipe: DatePipe) {}

  close() {
    this.modal.destroy();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      orderId: [null, [Validators.required]],
      productId: [null, [Validators.required]],
      salesPersonId: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      address: [null, [Validators.required]],
      contact: [null, [Validators.required]],
      date: [null, [Validators.required]],
      salesAmount: [null, [Validators.required]]
    })
  }
}
