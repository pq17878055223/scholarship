import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { InformAddComponent } from '../inform-add/inform-add.component';


@Component({
  selector: 'app-inform-manager',
  templateUrl: './inform-manager.component.html',
  styleUrls: ['./inform-manager.component.less']
})
export class InformManagerComponent implements OnInit {
  isLoading = false;
  listOfData: any[] = [];
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private insuranceSrv: InsuranceService,
              private msgSrv: NzMessageService,
              private modal: NzModalService) {
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.insuranceSrv.getAllInform().subscribe(res => {
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
      nzTitle: '新增公告',
      nzWidth: 700,
      nzContent: InformAddComponent,
      nzFooter: null
    });
    modal.afterClose.subscribe(result => {
      this.getAllInform();
    });
  }
  deleteInform(informId) {
    this.insuranceSrv.deleteInform({informId})
      .subscribe(res => {
        if (res.status === 1) {
          this.msgSrv.success(res.message);
          this.getAllInform();
        } else {
          this.msgSrv.error(res.message);
        }
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
    this.validateForm = this.fb.group({
      theme: [null, [Validators.required]]
    });
    this.getAllInform();
  }

}
