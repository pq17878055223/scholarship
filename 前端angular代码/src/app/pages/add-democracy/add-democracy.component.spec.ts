import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemocracyComponent } from './add-democracy.component';

describe('AddDemocracyComponent', () => {
  let component: AddDemocracyComponent;
  let fixture: ComponentFixture<AddDemocracyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDemocracyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDemocracyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
