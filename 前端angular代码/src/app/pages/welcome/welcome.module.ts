import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UserInfoComponent } from '../user-info/user-info.component';
import { SalesPersonComponent } from '../sales-person/sales-person.component';
import { SalesComponent } from '../sales/sales.component';
import { ProductComponent } from '../product/product.component';
import { CommonModule } from '@angular/common';
import { InsuranceService } from '../insurance.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductAddComponent } from '../product-add/product-add.component';
import { StaffStatsComponent } from '../staff-stats/staff-stats.component';
import { AreaStatsComponent } from '../area-stats/area-stats.component';
import { OrderAddComponent } from '../order-add/order-add.component';
import { SalesPersonAddComponent } from '../sales-person-add/sales-person-add.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { InformManagerComponent } from '../inform-manager/inform-manager.component';
import { DemocracyComponent } from '../democracy/democracy.component';
import { SocietyManagerComponent } from '../society-manager/society-manager.component';
import { InformAddComponent } from '../inform-add/inform-add.component';
import { AddDemocracyComponent } from '../add-democracy/add-democracy.component';
import { ExcelImportComponent } from '../excel-import/excel-import.component';
import { UserManageComponent } from '../user-manage/user-manage.component';
//import { SocietyStudentComponent } from '../../pages-student/society-student/society-student.component';
//import { StudyComponent } from '../../pages-student/study/study.component';
//import { CompetitionComponent } from '../../pages-student/competition/competition.component';
//import { UpgradeComponent } from '../../pages-student/upgrade/upgrade.component';
//import { InformStudentComponent } from '../../pages-student/inform-student/inform-student.component';
//import { ScoreStudentComponent } from '../../pages-student/score-student/score-student.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    IconsProviderModule,
    NzLayoutModule,
    NzDescriptionsModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzUploadModule,
    ReactiveFormsModule],
  providers: [InsuranceService],
  declarations: [WelcomeComponent, UserInfoComponent, SalesPersonComponent, ProductComponent, SalesComponent, ProductComponent,
    ProductAddComponent, StaffStatsComponent, AreaStatsComponent,
    OrderAddComponent, SalesPersonAddComponent, UserEditComponent, InformManagerComponent, DemocracyComponent,
    SocietyManagerComponent,
    InformAddComponent,
    AddDemocracyComponent,
    ExcelImportComponent,
    UserManageComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
