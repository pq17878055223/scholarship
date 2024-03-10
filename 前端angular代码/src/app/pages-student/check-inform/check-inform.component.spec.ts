import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInformComponent } from './check-inform.component';

describe('CheckInformComponent', () => {
  let component: CheckInformComponent;
  let fixture: ComponentFixture<CheckInformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
