import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatHeaderComponent } from '../../../Components/ChatHeader/chat-header/chat-header.component';
import { ChatRoomMessageComponent } from '../../../Components/ChatRoomMessage/chat-room-message/chat-room-message.component';
import { MessageboxComponent } from '../../../Components/MessageBox/messagebox/messagebox.component';
import { ImportNgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { ChatRoomDisplayComponent } from './chatroomdisplay.component';

describe('ChatRoomDisplay', () => {
  let component: ChatRoomDisplayComponent;
  let fixture: ComponentFixture<ChatRoomDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
          ChatRoomDisplayComponent,
          ChatHeaderComponent,
          ChatRoomMessageComponent,
          MessageboxComponent
      ],
      imports: [
        HttpClientTestingModule,
        ImportNgZorroAntdModule,
        FormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatRoomDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create chat-room-display component', () => {
    expect(component).toBeTruthy();
  });

  it('should render child components', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-chat-header')).toBeTruthy();
    expect(compiled.querySelector('app-chat-room-message')).toBeTruthy();
    expect(compiled.querySelector('app-messagebox')).toBeTruthy();
  });

});
