import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageExtraFuncComponent } from './message-extra-func.component';
import { MessageService } from '../../../Services/MessageService/message.service';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { of, throwError } from 'rxjs';
import { ImportNgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { EditMessage } from '../../../Models/DTO/EditMessage/edit-message';

describe('MessageExtraFuncComponent', () => {
  let component: MessageExtraFuncComponent;
  let fixture: ComponentFixture<MessageExtraFuncComponent>;
  let MockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    MockMessageService = jasmine.createSpyObj('MessageService', ['editMessage', 'deleteMessage']);

    await TestBed.configureTestingModule({
      declarations: [MessageExtraFuncComponent],
      imports:[ImportNgZorroAntdModule],
      providers:[
        {provide: MessageService, useValue:MockMessageService}
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageExtraFuncComponent);
    component = fixture.componentInstance;

    // Original Message Data
    component.messageData = {
      MessageId : 1,
      Content :'Hello, world!',
      UserChatRoomId : 1,
      TimeStamp : null, 
      ResourceUrl : '',
      IsDeleted : false,
      ChatRoomId : 2,
      UserId : 3,
      ProfileName : '',
      ProfilePicture : ''
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy content to newMessageContent on init', () => {
    component.ngOnInit();
    expect(component.newMessageContent).toBe('Hello, world!');
  });

  it('should handle edit visibility, case: visible', () => {
    component.OpenEditMessage();
    expect(component.editIsVisible).toBeTrue();
  });

  it('should handle edit visibility, case: invisible', () => {
    component.handleEditModalCancel();
    expect(component.editIsVisible).toBeFalse();
  });

  it('should call editMessage on service when handleEditModalOk is called with changed content', () => {
    component.newMessageContent = 'Updated content';

    const editMessage: EditMessage = {
      ChatRoomId: component.messageData.ChatRoomId,
      Content: component.newMessageContent,
      MessageId: component.messageData.MessageId
    };
    
    MockMessageService.editMessage.and.returnValue(of(editMessage));
    component.handleEditModalOk();

    expect(MockMessageService.editMessage).toHaveBeenCalledWith(editMessage);

  });

  it('should not call editMessage if content is unchanged', () => {
    component.newMessageContent = component.messageData.Content; // No change in content

    component.handleEditModalOk();

    expect(MockMessageService.editMessage).not.toHaveBeenCalled();
  });

  it('should handle delete visibility, case: true', () => {
    component.OpenDeleteMessage();
    expect(component.deleteIsVisible).toBeTrue();
  });

  it('should handle delete visibility, case: false', () => {
    component.handleDeleteModalCancel();
    expect(component.deleteIsVisible).toBeFalse();
  });

  it('should call deleteMessage on service when handleDeleteModalOk is called', () => {
    const messageId = component.messageData.MessageId;
    const chatRoomId = component.messageData.ChatRoomId;
    MockMessageService.deleteMessage.and.returnValue(of(1)); 

    component.handleDeleteModalOk();

    expect(MockMessageService.deleteMessage).toHaveBeenCalledWith(messageId!, chatRoomId);
  });

  // Error handling scenarios
  it('should log error if edit message service call fails', () => {
    spyOn(console, 'error');
    const error = new Error('Service error');
    MockMessageService.editMessage.and.returnValue(throwError(() => error));

    component.newMessageContent = 'Updated content';
    component.handleEditModalOk();

    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should log error if delete message service call fails', () => {
    spyOn(console, 'error');
    const error = new Error('Service error');
    MockMessageService.deleteMessage.and.returnValue(throwError(() => error));

    component.handleDeleteModalOk();

    expect(console.error).toHaveBeenCalledWith(error);
  });


});
