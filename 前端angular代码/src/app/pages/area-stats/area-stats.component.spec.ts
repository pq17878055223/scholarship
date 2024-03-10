import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaStatsComponent } from './area-stats.component';

describe('AreaStatsComponent', () => {
  let component: AreaStatsComponent;
  let fixture: ComponentFixture<AreaStatsComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
