import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformAddComponent } from './inform-add.component';

describe('InformAddComponent', () => {
  let component: InformAddComponent;
  let fixture: ComponentFixture<InformAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
