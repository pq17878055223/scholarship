import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformStudentComponent } from './inform-student.component';

describe('InformStudentComponent', () => {
  let component: InformStudentComponent;
  let fixture: ComponentFixture<InformStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
