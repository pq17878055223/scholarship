import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { AddDemocracyComponent } from '../add-democracy/add-democracy.component';
import {SalesPersonAddComponent} from '../sales-person-add/sales-person-add.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-democracy',
  templateUrl: './democracy.component.html',
  styleUrls: ['./democracy.component.less']
})
export class DemocracyComponent implements OnInit {

  listOfData: any[] = [];
  validateForm!: FormGroup;
  isLoading = false;
  importUserList = [];
  importUserHeader: any;
  fileList = [];

  constructor(private fb: FormBuilder,
              private insuranceSrv: InsuranceService,
              private msgSrv: NzMessageService,
              private modal: NzModalService) {

  }
  beforeUpload = (file): boolean => {
    if (file) {
      const fileName = file.name;//获取文件名
      const reader: FileReader = new FileReader();//FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件
      //当读取操作成功完成时调用FileReader.onload
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.importUserList = XLSX.utils.sheet_to_json(ws, { header: 2 });//解析出文件数据，可以进行后面操作
        this.importUserHeader =  this.importUserList[0];//获得表头字段
        this.fileList = this.fileList.concat(file);
        for (const i of this.importUserList) {
          this.insuranceSrv.addDemocracy(i)
            .subscribe(res => {
              if(res.status === 1) {
                this.msgSrv.success(res.message);
              } else {
                this.msgSrv.error(res.message);
              }
            });
          this.getAllDemocracy();
          //this.ListOfData.push(i);
        }
      };
      reader.readAsBinaryString( file );
      return false;
    }
  }
  deleteDemocracy(id) {
    this.insuranceSrv.deleteDemocracy({id})
      .subscribe(res => {
        if (res.status === 1) {
          this.msgSrv.success(res.message);
          this.getAllDemocracy();
        } else {
          this.msgSrv.error(res.message);
        }
      });
  }
  getAllDemocracy() {
    this.isLoading = true;
    this.insuranceSrv.getAllDemocracy().subscribe(res => {
      this.isLoading = false;
      if(res.status === 1) {
        this.listOfData = res.data;
      }
    });
  }

  ngOnInit(): void {
    this.getAllDemocracy();
  }
}
