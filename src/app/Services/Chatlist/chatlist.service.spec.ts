import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatlistService } from './chatlist.service';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';

describe('ChatlistService', () => {
  let service: ChatlistService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatlistService]
    });
    service = TestBed.inject(ChatlistService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get chat list by user ID', () => {
    const userId = 1; 
    const expectedData: ChatListVM = {
      ChatRoomId: 1,
      UserChatRoomId: 1,
      UserId: 1, 
      ProfileName: 'xiaodi',
      ProfilePicture: '',
      ChatRoomName: 'group 1',
      RoomType: true,
      SelectedUsers: [],
      InitiatedBy: 1,
      InitiatorProfileName: 'xiaodi',
      IsOnline: true
    };

    service.RetrieveChatListByUser().subscribe();

    const req = httpTestingController.expectOne(`${service['url']}RetrieveChatListByUser?userId=${userId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedData); 
  });

});
