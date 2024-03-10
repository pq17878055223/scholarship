import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformManagerComponent } from './inform-manager.component';

describe('InformManagerComponent', () => {
  let component: InformManagerComponent;
  let fixture: ComponentFixture<InformManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
