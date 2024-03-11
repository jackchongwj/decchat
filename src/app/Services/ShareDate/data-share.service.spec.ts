import { TestBed } from '@angular/core/testing';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';

import { DataShareService } from './data-share.service';

describe('DataShareService', () => {
  let service: DataShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        DataShareService
      ]
    });
    service = TestBed.inject(DataShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update chat list data', () => {
    const testData: ChatListVM[] = [
      new ChatListVM(1, 'Room1', 'User1', 'user1.jpg', true, [2, 3], 101, 1, 1, 'Initiator1', true),
      new ChatListVM(2, 'Room2', 'User2', 'user2.jpg', false, [3, 4], 102, 2, 2, 'Initiator2', false),
    ];
    service.updateChatListData(testData);
    
    service.chatListData.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should update selected chat room data', () => {
    const testData: ChatListVM = new ChatListVM(1, 'Room1', 'User1', 'user1.jpg', true, [2, 3], 101, 1, 1, 'Initiator1', true);
    service.updateSelectedChatRoom(testData);
    
    service.selectedChatRoomData.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should update login user profile name', () => {
    const testData: string = 'Xiao Di';
    service.updateLoginUserPN(testData);
    
    service.LoginUserProfileName.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should update user id', () => {
    const testData: number = 1;
    service.updateUserId(testData);
    
    service.checkLogin.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should clear selected chat room', () => {
    service.clearSelectedChatRoom(false);

    service.IsSelectedData.subscribe(data => {
      expect(data).toEqual(false);
    });
  });

  
  it('should update the search value', () => {
    const testData = 'hello';

    service.updateSearchValue(testData);

    service.SearchMessageValue.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should update the total search message result', () => {
    const testData = 10; 

    service.updateTotalSearchMessageResult(testData);

    service.totalSearchMessageResult.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should update the current message result', () => {
    const testData = 8; 

    service.updateCurrentMessageResult(testData);

    service.currentSearchMessageResult.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

  it('should update the SignalR connection status', () => {
    const testData = true;

    service.updateSignalRConnectionStatus(testData);

    service.IsSignalRConnection.subscribe(data => {
      expect(data).toEqual(testData);
    });
  });

});
