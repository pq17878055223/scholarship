import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AreaStatsComponent } from './pages/area-stats/area-stats.component';
import { ProductComponent } from './pages/product/product.component';
import { SalesPersonComponent } from './pages/sales-person/sales-person.component';
import { SalesComponent } from './pages/sales/sales.component';
import { StaffStatsComponent } from './pages/staff-stats/staff-stats.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PassportComponent } from './passport/passport.component';
import { RegisterComponent } from './register/register.component';
import { InformManagerComponent } from './pages/inform-manager/inform-manager.component';
import { DemocracyComponent } from './pages/democracy/democracy.component';
import { SocietyManagerComponent } from './pages/society-manager/society-manager.component';
import { StudyComponent } from './pages-student/study/study.component';
import { UpgradeComponent } from './pages-student/upgrade/upgrade.component';
import { InformStudentComponent } from './pages-student/inform-student/inform-student.component';
import { ScoreStudentComponent } from './pages-student/score-student/score-student.component';
import { StudentInfoComponent } from './pages-student/student-info/student-info.component';
import { ExcelImportComponent } from './pages/excel-import/excel-import.component';
import { UserManageComponent } from './pages/user-manage/user-manage.component';
import { SetPasswordComponent } from './pages-student/set-password/set-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'passport', pathMatch: 'full' },
  { path: 'passport', component: PassportComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }, { path: 'welcome', component: WelcomeComponent,
    children: [
      { path: '', redirectTo: 'user-manage', pathMatch: 'full' },
      { path: 'user-manage', component: UserManageComponent },
      { path: 'excel-import', component: ExcelImportComponent },
      { path: 'inform-manager', component: InformManagerComponent },
      { path: 'democracy', component: DemocracyComponent },
      { path: 'society-manager', component: SocietyManagerComponent },
      { path: 'study', component: StudyComponent },
      { path: 'upgrade', component: UpgradeComponent },
      { path: 'inform-student', component: InformStudentComponent },
      { path: 'score-student', component: ScoreStudentComponent },
      { path: 'user-info', component: UserInfoComponent },
      { path: 'sales-person', component: SalesPersonComponent },
      { path: 'product', component: ProductComponent },
      { path: 'staff-stats', component: StaffStatsComponent },
      { path: 'area-stats', component: AreaStatsComponent },
      { path: 'sales', component: SalesComponent }
    ]
  }, {path: 'student-info', component: StudentInfoComponent,
    children: [
      { path: '', redirectTo: 'set-password', pathMatch: 'full' },
      { path: 'set-password', component: SetPasswordComponent },
      { path: 'study', component: StudyComponent },
      { path: 'upgrade', component: UpgradeComponent },
      { path: 'inform-student', component: InformStudentComponent },
      { path: 'score-student', component: ScoreStudentComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
