import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomDisplayComponent } from './chatroomdisplay.component';

describe('ChatmessageComponent', () => {
  let component: ChatRoomDisplayComponent;
  let fixture: ComponentFixture<ChatRoomDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRoomDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatRoomDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
