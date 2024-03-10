import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentService } from '../student.service';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentInfoComponent } from './student-info.component';
import { StudyComponent } from '../../pages-student/study/study.component';
import { UpgradeComponent } from '../../pages-student/upgrade/upgrade.component';
import { InformStudentComponent } from '../../pages-student/inform-student/inform-student.component';
import { ScoreStudentComponent } from '../../pages-student/score-student/score-student.component';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzStepsModule} from 'ng-zorro-antd/steps';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import { CheckInformComponent } from '../check-inform/check-inform.component';
import { SetPasswordComponent } from '../set-password/set-password.component';




@NgModule({
  providers: [StudentService],
  declarations: [StudentInfoComponent, StudyComponent, UpgradeComponent,
    InformStudentComponent, ScoreStudentComponent, CheckInformComponent, SetPasswordComponent],
    imports: [
        CommonModule, RouterModule, IconsProviderModule, NzLayoutModule, NzMenuModule, NzDescriptionsModule,
        NzTableModule, NzButtonModule, NzFormModule, NzDatePickerModule, NzInputNumberModule, NzInputModule,
        NzModalModule, NzSelectModule, NzUploadModule, ReactiveFormsModule, NzSpinModule, NzStepsModule,
        NzListModule, NzDividerModule, FormsModule],
  exports: [
    StudentInfoComponent
  ]
})
export class StudentInfoModule { }
