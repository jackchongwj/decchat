// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MessageboxComponent } from './messagebox.component';
// import { MessageService } from '../../../Services/MessageService/message.service';
// import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
// import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
// import { DataShareService } from '../../../Services/ShareDate/data-share.service';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { FormsModule } from '@angular/forms';
// import { of } from 'rxjs';
// import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';

// const mockLocalStorageService = jasmine.createSpyObj('LocalstorageService', ['getUserId']);

// describe('MessageboxComponent', () => {
//   let component: MessageboxComponent;
//   let fixture: ComponentFixture<MessageboxComponent>;
//   let mockNzMessageService: jasmine.SpyObj<NzMessageService>;
//   let mockMessageService: jasmine.SpyObj<MessageService>;
//   let mockSignalRService: jasmine.SpyObj<SignalRService>;

//   beforeEach(async () => {
//       mockNzMessageService = jasmine.createSpyObj('NzMessageService', ['error']);
//       mockMessageService = jasmine.createSpyObj('MessageService', ['sendMessage']);
//       mockSignalRService = jasmine.createSpyObj('SignalRService', ['invalidFormatUpload','updateMessageListener']);
//       mockSignalRService.updateMessageListener.and.returnValue(of({} as ChatRoomMessages));
//       mockSignalRService.invalidFormatUpload.and.returnValue(of(1));

//       await TestBed.configureTestingModule({
//           declarations: [MessageboxComponent],
//           imports: [HttpClientTestingModule, FormsModule],
//           providers: [
//               { provide: MessageService, useValue: mockMessageService },
//               { provide: SignalRService, useValue: mockSignalRService },
//               { provide: LocalstorageService, useValue: mockLocalStorageService },
//               { provide: NzMessageService, useValue: mockNzMessageService }
//           ]
//       }).compileComponents();

//       fixture = TestBed.createComponent(MessageboxComponent);
//       component = fixture.componentInstance;
//       fixture.detectChanges();
//   });

//   it('should create', () => {
//       expect(component).toBeTruthy();
//   });

//   it('should handle invalid file upload format notification', () => {
//     const userId = component.userId;
//     mockSignalRService.invalidFormatUpload.and.returnValue(of(userId));

//     fixture.detectChanges();

//     expect(component.isSending).toBeFalse();
//     expect(mockNzMessageService.error).toHaveBeenCalledWith("Invalid File Format Uploaded");
//   });

//   it('should initialize state variables correctly ', () => {

//     expect(component.userId).toBe(1);
//     expect(component.currentUserChatRoomId).toBe(0);
//     expect(component.currentChatRoom).toBe(0);
//     expect(component.currentUserPN).toBe("");
//     expect(component.sendCooldownOn).toBeFalse();
//     expect(component.previewVisible).toBeFalse();
//     expect(component.isSending).toBeFalse();
//     expect(component.uploadedFiles).toBeNull();
//     expect(component.previewFile).toBe('');
//     expect(component.messageText).toBe('');
//     expect(component.isRecording).toBeFalse();
//     expect(component.chunks.length).toBe(0);
//     expect(component.mediaRecorder).toBeNull();

//     fixture.detectChanges();
//     expect(mockSignalRService.updateMessageListener).toHaveBeenCalled();
//     expect(component.isSending).toBeFalse();
//   });

//   // Empty text field && No file uploaded
//   it('should not send a message when message text is empty', () => {
//     component.messageText = '';
//     component.uploadedFiles = null;

//     component.onSendMessage();
//     expect(mockNzMessageService.error).toHaveBeenCalledWith("Please enter a message");
//     expect(component.messageText).toBe('');
//     expect(mockMessageService.sendMessage).not.toHaveBeenCalled();
//   });







// });
