import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { InsuranceService } from '../insurance.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.less']
})
export class ExcelImportComponent implements OnInit {
  importUserList = [];
  importUserHeader: any;
  fileList = [];
  ListOfData = [];
  validateForm!: FormGroup;

  constructor(
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService
  ) {}
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
          this.insuranceSrv.addScore(i)
            .subscribe(res => {
              if(res.status === 1) {
                this.msgSrv.success(res.message);
              } else {
                this.msgSrv.error(res.message);
              }
            });
          this.getAllScore();
            //this.ListOfData.push(i);
        }
      };
      reader.readAsBinaryString( file );
      return false;
    }
  }
  getAllScore() {
    this.insuranceSrv.getAllScore().subscribe(res => {
      if(res.status === 1) {
        this.ListOfData = res.data;
      }
    });
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

  ngOnInit(): void {
    this.getAllScore();
  }

}
