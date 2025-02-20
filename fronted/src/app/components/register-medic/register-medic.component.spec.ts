import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMedicComponent } from './register-medic.component';

describe('RegisterMedicComponent', () => {
  let component: RegisterMedicComponent;
  let fixture: ComponentFixture<RegisterMedicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMedicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMedicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
