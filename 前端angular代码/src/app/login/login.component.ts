import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  errorText = '';

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    //this.appSrv.login(this.validateForm.value).subscribe(res => {
      //if (res.status === 1) {
        //localStorage.setItem('userId', this.validateForm.value.userId);
        //this.router.navigateByUrl('/welcome');
      //}else {
        //this.errorText = res.message;
      //}
    //});
    this.appSrv.login(this.validateForm.value).subscribe(res => {
    if (res.role === '学生') {
    localStorage.setItem('userId', this.validateForm.value.userId);
    this.router.navigateByUrl('/student-info');
    }else {
      localStorage.setItem('userId', this.validateForm.value.userId);
      this.router.navigateByUrl('/welcome');
    }
    });
  }

  constructor(private fb: FormBuilder,
    private appSrv: AppService,
    private msgSrv: NzMessageService,
    private router: Router) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userId: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
