import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { InsuranceService } from '../insurance.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',

  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent implements OnInit {
  validateForm!: FormGroup;
  @Input() userInfo;
  loading = false;
  avatarUrl?: string;
  avatar = '';
  primaryId = '';

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.insuranceSrv.setUser(Object.assign(this.validateForm.value, { avatar: this.avatar, primaryId: this.primaryId })).subscribe(res => {
      if (res.status === 1) {
        this.msg.success(res.message);
        localStorage.setItem('userId', this.validateForm.value.userId);
        this.modal.close(this.validateForm.value);
      } else {
        this.msg.error(res.message);
      }
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(private fb: FormBuilder,
    private msg: NzMessageService,
    private router: Router,
    private modal: NzModalRef,
    private insuranceSrv: InsuranceService) {}

  close() {
    this.modal.destroy();
  }  
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    console.log(info);
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.avatar = info.file.response.fileName;
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      phoneNumber: [null, [Validators.required]],
      position: [null, [Validators.required]]
    });
    this.validateForm.get('userId').setValue(this.userInfo ? this.userInfo.userId : null);
    this.validateForm.get('name').setValue(this.userInfo ? this.userInfo.name : null);
    this.validateForm.get('sex').setValue(this.userInfo ? this.userInfo.sex : null);
    this.validateForm.get('password').setValue(this.userInfo ? this.userInfo.password : null);
    this.validateForm.get('checkPassword').setValue(this.userInfo ? this.userInfo.password : null);
    this.validateForm.get('phoneNumber').setValue(this.userInfo ? this.userInfo.phoneNumber : null);
    this.validateForm.get('position').setValue(this.userInfo ? this.userInfo.position : null);
    
    this.avatar = this.userInfo.avatar;
    this.avatarUrl = this.insuranceSrv.getAvatarUrl(this.userInfo.avatar);
    this.primaryId = this.userInfo.userId;
  }
}
