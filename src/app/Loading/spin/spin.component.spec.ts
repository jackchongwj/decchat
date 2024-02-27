import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinComponent } from './spin.component';

describe('SpinComponent', () => {
  let component: SpinComponent;
  let fixture: ComponentFixture<SpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
