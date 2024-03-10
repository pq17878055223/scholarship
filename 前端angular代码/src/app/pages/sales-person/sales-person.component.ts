import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { SalesPersonAddComponent } from '../sales-person-add/sales-person-add.component';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html'
})
export class SalesPersonComponent implements OnInit {
  listOfData: any[] = [];
  listOfData1: any[] = [];
  validateForm!: FormGroup;
  isLoading = false;
  excelData: any[] = [];
  constructor(private fb: FormBuilder,
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService,
    private modal: NzModalService) {

  }
  //查询成绩用的
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.insuranceSrv.getSalesPersons(this.validateForm.value)
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
      nzTitle: '新增成绩',
      nzWidth: 500,
      nzContent: SalesPersonAddComponent,
      nzFooter: null
    });
    modal.afterClose.subscribe(result => {
      this.getAllScore();
    });
  }

  deleteSalesPerson(salesPersonId) {
    this.insuranceSrv.deleteSalesPerson({salesPersonId})
    .subscribe(res => {
      if (res.status === 1) {
        this.msgSrv.success(res.message);
        this.submitForm();
      } else {
        this.msgSrv.error(res.message);
      }
    })
  }
  deleteScore(id) {
    this.insuranceSrv.deleteScore({id})
      .subscribe(res => {
        if (res.status === 1) {
          this.msgSrv.success(res.message);
          this.getAllScore();
        } else {
          this.msgSrv.error(res.message);
        }
      });
  }
  getAllScore() {
    this.isLoading = true;
    this.insuranceSrv.getAllScore().subscribe(res => {
      this.isLoading = false;
      if(res.status === 1) {
        this.listOfData = res.data;
      }
    });
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [''],
      area: ['']
    });
    this.getAllScore();
  }
}
