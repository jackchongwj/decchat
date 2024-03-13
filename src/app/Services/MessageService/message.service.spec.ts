import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';

import { environment } from '../../../environments/environment';
import { ChatRoomMessages } from '../../Models/DTO/ChatRoomMessages/chatroommessages';
import { EditMessage } from '../../Models/DTO/EditMessage/edit-message';

describe('MessageService', () => {
    let service: MessageService;
    let httpMock: HttpTestingController;
    const apiBaseUrl = environment.apiBaseUrl + 'Messages/';
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [MessageService]
      });
  
      service = TestBed.inject(MessageService);
      httpMock = TestBed.inject(HttpTestingController);
    });
  
    afterEach(() => {
      httpMock.verify(); // Ensure that no requests are outstanding.
    });

    it('SendMessage should send message', () => {
        const mockResponse = null; 
        const formData = new FormData();
      
        service.sendMessage(formData).subscribe(response => {
          expect(response).toBeNull();
        });
      
        const req = httpMock.expectOne(`${apiBaseUrl}AddMessage`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('GetMessages should first load message data', () => {
        let sampleMessages: ChatRoomMessages[] = [
            new ChatRoomMessages(
                1,
                "Hello, this is the first message",
                101, 
                "2024-03-12T10:00:00", 
                "http://example.com/resource1", 
                false, 
                1,
                10,
                "John Doe",
                "http://example.com/profile1.jpg" 
            ),
            new ChatRoomMessages(
                2, 
                "This is the second message",
                102,
                "2024-03-12T10:05:00",
                "http://example.com/resource2",
                false,
                1,
                11,
                "Jane Doe",
                "http://example.com/profile2.jpg"
            ),
            new ChatRoomMessages(
                3,
                "Another message in the room",
                103,
                "2024-03-12T10:10:00",
                "",
                false,
                1,
                12,
                "Sam Smith",
                ""
            )
        ];

        const ChatRoomId = 1;
        const MessageId = 0;
      
        service.getMessage(ChatRoomId, MessageId).subscribe(response => {
          expect(response).toEqual(sampleMessages);
        });
      
        const req = httpMock.expectOne(`${apiBaseUrl}GetMessage?ChatRoomId=${ChatRoomId}&MessageId=${MessageId}`);
        expect(req.request.method).toBe('GET');
        req.flush(sampleMessages);
    });

    it('GetMessage should continue load data with offset', () => {
        let sampleMessages: ChatRoomMessages[] = [
            new ChatRoomMessages(
                31,
                "Hello, this is the first message",
                101, 
                "2024-03-12T10:00:00", // TimeStamp
                "http://example.com/resource1", 
                false, 
                1,
                10,
                "John Doe",
                "http://example.com/profile1.jpg" 
            ),
            new ChatRoomMessages(
                32, 
                "This is the second message",
                102,
                "2024-03-12T10:05:00",
                "http://example.com/resource2",
                false,
                1,
                11,
                "Jane Doe",
                "http://example.com/profile2.jpg"
            ),
            new ChatRoomMessages(
                33,
                "Another message in the room",
                103,
                "2024-03-12T10:10:00",
                "",
                false,
                1,
                12,
                "Sam Smith",
                ""
            )
        ];
        const ChatRoomId = 1;
        const MessageId = 30;
      
        service.getMessage(ChatRoomId, MessageId).subscribe(response => {
          expect(response).toEqual(sampleMessages);
          expect(response.every((msg:ChatRoomMessages) => msg.MessageId != null && msg.MessageId > 30)).toBe(true);
        });
      
        const req = httpMock.expectOne(`${apiBaseUrl}GetMessage?ChatRoomId=${ChatRoomId}&MessageId=${MessageId}`);
        expect(req.request.method).toBe('GET');
        req.flush(sampleMessages);
    });

    it('EditMessage should post edited message', () => {
        let editMessageInstance = new EditMessage(
            1,
            "This is the edited content of the message.", // Content of the message
            1
        );

        service.editMessage(editMessageInstance).subscribe(response => {
          expect(response).toBeNull();
        });
      
        const req = httpMock.expectOne(`${apiBaseUrl}EditMessage`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(editMessageInstance);
        req.flush(null);
    });

    it('deleteMessage should send delete request with correct parameters', () => {
        const MessageId = 1;
        const ChatRoomId = 2;
        const mockResponse = 1;
      
        service.deleteMessage(MessageId, ChatRoomId).subscribe(response => {
          expect(response).toBe(mockResponse);
        });
      
        const req = httpMock.expectOne(`${apiBaseUrl}DeleteMessage?MessageId=${MessageId}&ChatRoomId=${ChatRoomId}`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('getSearch should get data based on the search parameters', () => {
        const ChatRoomId = 1;
        const searchValue = '1';
        const mockResponse = 33;
      
        service.getSearch(ChatRoomId, searchValue).subscribe(response => {
          expect(response).toEqual(mockResponse);
        });
      
        const req = httpMock.expectOne(`${apiBaseUrl}GetTotalSearchMessage?ChatRoomId=${ChatRoomId}&searchValue=${searchValue}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });



});