import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',

  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  validateForm!: FormGroup;

  loading = false;
  avatarUrl?: string;
  avatar = '';

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.appSrv.register(Object.assign({ avatar: this.avatar }, this.validateForm.value)).subscribe(res => {
      if (res.status === 1) {
        this.msg.success(res.message);
        this.router.navigateByUrl('/passport')
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
    private appSrv: AppService) {}


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
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      role: [null, [Validators.required]],
      class_name: [[Validators.required]],
      major: [[Validators.required]],
      master: [[Validators.required]],
      scholarship: [[Validators.required]],
    });
  }
}
