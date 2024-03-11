import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportNgZorroAntdModule } from '../../ng-zorro-antd.module';
import { SpinComponent } from './spin.component';

describe('SpinComponent', () => {
  let component: SpinComponent;
  let fixture: ComponentFixture<SpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinComponent ],
      imports: [ ImportNgZorroAntdModule ] // Import the NzSpinModule for the nz-spin component
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
