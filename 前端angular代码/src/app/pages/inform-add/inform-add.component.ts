import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { InsuranceService } from '../insurance.service';
import { NzShowUploadList, NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inform-add',
  templateUrl: './inform-add.component.html',
  styleUrls: ['./inform-add.component.less']
})
export class InformAddComponent implements OnInit {
  isLoading = false;
  listOfData = [];
  validateForm!: FormGroup;
  uploadUrl = environment.uploadURL;
  fileId = '';
  fileName = '';
  theme = '';
  description = '';
  icons: NzShowUploadList = {
    showDownloadIcon: false,
    showPreviewIcon: false,
    showRemoveIcon: false
  };
  isSpinning = false;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
    if (this.fileId === '') {
      this.msgSrv.warning('请上传文件.');
      return;
    }
    this.isSpinning = true;
    this.insuranceSrv.addInform({
      description: this.validateForm.value.description,
      theme: this.validateForm.value.theme,
      fileId: this.fileId,
      fileName: this.fileName
    }).subscribe(res => {
      this.isSpinning = false;
      if (res.status === 1) {
        this.msgSrv.success(res.message);
        this.description = this.validateForm.value.description;
        this.theme = this.validateForm.value.theme;
        this.modal.close(this.validateForm.value);
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

  constructor(private fb: FormBuilder,
              private modal: NzModalRef,
              private insuranceSrv: InsuranceService,
              private msgSrv: NzMessageService) {
  }

  close() {
    this.modal.destroy();
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
      description: [null, [Validators.required]],
      theme: [null, [Validators.required]]
    });
    this.getAllInform();
  }
}
