import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageExtraFuncComponent } from './message-extra-func.component';

describe('MessageExtraFuncComponent', () => {
  let component: MessageExtraFuncComponent;
  let fixture: ComponentFixture<MessageExtraFuncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageExtraFuncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageExtraFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
