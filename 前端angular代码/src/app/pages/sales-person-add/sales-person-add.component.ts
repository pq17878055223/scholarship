import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-sales-person-add',
  templateUrl: './sales-person-add.component.html',

  styleUrls: ['./sales-person-add.component.less']
})
export class SalesPersonAddComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.insuranceSrv.addScore(this.validateForm.value)
    .subscribe(res => {
      if(res.status === 1) {
        this.msgSrv.success(res.message);
        this.modal.close(this.validateForm.value);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  constructor(private fb: FormBuilder,
    private modal: NzModalRef,
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService) {}

  close() {
    this.modal.destroy();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      course: [null, [Validators.required]],
      teacher: [null, [Validators.required]],
      credit: [null, [Validators.required]],
      student_number: [null, [Validators.required]],
      student_name: [null, [Validators.required]],
      score: [null, [Validators.required]]
    });
  }
}
