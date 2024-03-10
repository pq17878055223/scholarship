import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesPersonComponent } from './sales-person.component';

describe('SalesPersonComponent', () => {
  let component: SalesPersonComponent;
  let fixture: ComponentFixture<SalesPersonComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPersonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
