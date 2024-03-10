import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeModule } from './pages/welcome/welcome.module';
import { StudentInfoModule } from './pages-student/student-info/student-info.module';
import { AppService } from './app.service';
import { PassportComponent } from './passport/passport.component';
//import { StudentInfoComponent } from './pages-student/student-info/student-info.component';
//import { HomeComponent } from './pages/home/home.component';
//import { InformStudentComponent } from './pages/inform-student/inform-student.component';
//import { ScoreStudentComponent } from './pages/score-student/score-student.component';
//import { DemocracyComponent } from './pages/democracy/democracy.component';
//import { SocietyManagerComponent } from './pages/society-manager/society-manager.component';
//import { SocietyStudentComponent } from './pages/society-student/society-student.component';
//import { StudyComponent } from './pages/study/study.component';
//import { CompetitionComponent } from './pages/competition/competition.component';
//import { UpgradeComponent } from './pages/upgrade/upgrade.component';
//import { InformManagerComponent } from './pages/inform-manager/inform-manager.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    PassportComponent,
    LoginComponent,
    RegisterComponent,
    //StudentInfoComponent,
    //HomeComponent,
    //InformStudentComponent,
    //ScoreStudentComponent,
    //DemocracyComponent,
    //SocietyManagerComponent,
    //SocietyStudentComponent,
    //StudyComponent,
    //CompetitionComponent,
    //UpgradeComponent,
    //InformManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzUploadModule,
    NzMessageModule,
    NzSelectModule,
    NzGridModule,
    NzAlertModule,
    ReactiveFormsModule,
    WelcomeModule,
    StudentInfoModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
