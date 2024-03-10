import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStatusType } from 'ng-zorro-antd/steps';
import { NzShowUploadList, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { StudentService } from 'src/app/pages-student/student.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.less']
})
export class UpgradeComponent implements OnInit {
  validateForm!: FormGroup;
  user: any;
  uploadUrl = environment.uploadURL;
  fileId = '';
  fileName = '';
  current = 0;
  result = '审核完成';
  status: NzStatusType = 'process';
  icons: NzShowUploadList = {
    showDownloadIcon: false,
    showPreviewIcon: false,
    showRemoveIcon: false
  };
  isSpinning = false;

  constructor(private fb: FormBuilder,
              private insuranceSrv: StudentService,
              private msgSrv: NzMessageService) {
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    if (this.fileId === '') {
      this.msgSrv.warning('请上传文件.');
      return;
    }
    this.isSpinning = true;
    this.insuranceSrv.addUpgrade({
      fileId: this.fileId,
      fileName: this.fileName,
      userId: localStorage.getItem('userId')
    }).subscribe(res => {
      this.isSpinning = false;
      if (res.status === 1) {
        this.msgSrv.success(res.message);
          this.current = 1;
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        this.fileName = info.file.name;
        this.fileId = info.file.response.fileName;
        break;
      case 'error':
        this.msgSrv.error('Network error');
        break;
    }
  }
  getApplication() {
    const userId = localStorage.getItem('userId');
    this.isSpinning = true;
    this.insuranceSrv.getUpgrade(userId ? userId : '').subscribe(res => {
      if (res.status === 1) {
        this.isSpinning = false;
        this.current = res.data.status;
        this.fileId = res.data.fileId;
        this.fileName = res.data.fileName;
        if (res.data.status === 3) {
          this.current = 2;
          this.status = 'error';
          this.result = '审核不通过';
        } else if (res.data.status === 2) {
          this.result = '审核通过';
        }
      } else {
        this.insuranceSrv.getUser({ userId: localStorage.getItem('userId') })
          .subscribe(res => {
            this.isSpinning = false;
            this.user = res;
          });
      }
    });
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
    });
    this.getApplication();
  }

}
