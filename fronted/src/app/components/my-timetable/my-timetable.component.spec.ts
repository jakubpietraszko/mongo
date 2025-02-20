import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTimetableComponent } from './my-timetable.component';

describe('MyTimetableComponent', () => {
  let component: MyTimetableComponent;
  let fixture: ComponentFixture<MyTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
