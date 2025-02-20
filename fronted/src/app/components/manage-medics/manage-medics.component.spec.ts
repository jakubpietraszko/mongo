import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMedicsComponent } from './manage-medics.component';

describe('ManageMedicsComponent', () => {
  let component: ManageMedicsComponent;
  let fixture: ComponentFixture<ManageMedicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMedicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMedicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
