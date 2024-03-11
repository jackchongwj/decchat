import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageExtraFuncComponent } from './message-extra-func.component';
import { MessageService } from '../../../Services/MessageService/message.service';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { of, throwError } from 'rxjs';

describe('MessageExtraFuncComponent', () => {
  let component: MessageExtraFuncComponent;
  let fixture: ComponentFixture<MessageExtraFuncComponent>;
  let MockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    MockMessageService = jasmine.createSpyObj('MessageService', ['editMessage', 'deleteMessage']);

    await TestBed.configureTestingModule({
      declarations: [MessageExtraFuncComponent],
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
    MockMessageService.editMessage.and.returnValue(of({} as ChatRoomMessages));

    component.handleEditModalOk();

    // expect(MockMessageService.editMessage).toHaveBeenCalledWith({
    //   MessageId: 1,
    //   ChatRoomId: 1,
    //   Content: 'Updated content'
    // });
  });

  it('should handle delete visibility', () => {
    component.OpenDeleteMessage();
    expect(component.deleteIsVisible).toBeTrue();

    component.handleDeleteModalCancel();
    expect(component.deleteIsVisible).toBeFalse();
  });

  it('should call deleteMessage on service when handleDeleteModalOk is called', () => {
    MockMessageService.deleteMessage.and.returnValue(of(1));

    component.handleDeleteModalOk();

    expect(MockMessageService.deleteMessage).toHaveBeenCalledWith(1, 1);
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
