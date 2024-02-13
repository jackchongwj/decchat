import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomMessageComponent } from './chat-room-message.component';

describe('ChatRoomMessageComponent', () => {
  let component: ChatRoomMessageComponent;
  let fixture: ComponentFixture<ChatRoomMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRoomMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatRoomMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
