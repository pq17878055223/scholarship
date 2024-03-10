import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemocracyComponent } from './democracy.component';

describe('DemocracyComponent', () => {
  let component: DemocracyComponent;
  let fixture: ComponentFixture<DemocracyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemocracyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemocracyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
