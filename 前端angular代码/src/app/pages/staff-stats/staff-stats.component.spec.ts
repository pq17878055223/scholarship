import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffStatsComponent } from './staff-stats.component';

describe('StaffStatsComponent', () => {
  let component: StaffStatsComponent;
  let fixture: ComponentFixture<StaffStatsComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
