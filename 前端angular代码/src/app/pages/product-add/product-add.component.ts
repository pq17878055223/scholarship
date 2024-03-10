import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',

  styleUrls: ['./product-add.component.less']
})
export class ProductAddComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.insuranceSrv.addProduct(this.validateForm.value)
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
    private msgSrv: NzMessageService) {}

  close() {
    this.modal.destroy();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      productId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      statement: [null, [Validators.required]],
      price: [null, [Validators.required]]
    });
  }
}
