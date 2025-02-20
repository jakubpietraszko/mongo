import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTimetableComponent } from './manage-timetable.component';

describe('ManageTimetableComponent', () => {
  let component: ManageTimetableComponent;
  let fixture: ComponentFixture<ManageTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
