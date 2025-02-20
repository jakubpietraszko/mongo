import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRatingsComponent } from './manage-ratings.component';

describe('ManageRatingsComponent', () => {
  let component: ManageRatingsComponent;
  let fixture: ComponentFixture<ManageRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRatingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
