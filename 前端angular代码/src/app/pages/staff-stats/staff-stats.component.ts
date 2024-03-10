import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InsuranceService } from '../insurance.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-staff-stats',
  templateUrl: './staff-stats.component.html',
  providers: [DatePipe]
})
export class StaffStatsComponent implements OnInit {
  listOfData: any[] = [];

  constructor(
    private insuranceSrv: InsuranceService,
    private msgSrv: NzMessageService) {

  }
  export_data() {
    const exportItem = this.listOfData;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportItem);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, '总成绩信息');
  }
  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + '.xlsx');
  }
  ngOnInit() {
    this.insuranceSrv.setScholarship30().subscribe(res => {
      if (res.status === 1) {
      }
    });
    this.insuranceSrv.setScholarship10().subscribe(res => {
      if (res.status === 1) {
      }
    });
    this.insuranceSrv.getManagerScores().subscribe(res => {
      if (res.status === 1) {
        this.listOfData = res.data;
      }
    });
  }
}
