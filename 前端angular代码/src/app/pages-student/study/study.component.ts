import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStatusType } from 'ng-zorro-antd/steps';
import { NzShowUploadList, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { StudentService } from 'src/app/pages-student/student.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.less']
})
export class StudyComponent implements OnInit {

  validateForm!: FormGroup;
  user: any;
  uploadUrl = environment.uploadURL;
  fileId = '';
  fileName = '';
  study = '';
  competition = '';
  society = '';
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
              private msgSrv: NzMessageService) { }

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
    this.insuranceSrv.addActivity({
      study: this.validateForm.value.study,
      competition: this.validateForm.value.competition,
      society: this.validateForm.value.society,
      fileId: this.fileId,
      fileName: this.fileName,
      userId: localStorage.getItem('userId')
    }).subscribe(res => {
      this.isSpinning = false;
      if (res.status === 1) {
        this.msgSrv.success(res.message);
        this.study = this.validateForm.value.study,
          this.competition = this.validateForm.value.competition,
          this.society = this.validateForm.value.society,
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
    this.insuranceSrv.getActivity(userId ? userId : '').subscribe(res => {
      if (res.status === 1) {
        this.isSpinning = false;
        this.current = res.data.status;
        this.study = this.validateForm.value.study,
          this.competition = this.validateForm.value.competition,
          this.society = this.validateForm.value.society,
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
      study: [null, [Validators.required]],
      competition: [null, [Validators.required]],
      society: [null, [Validators.required]]
    });
    this.getApplication();
  }


}
