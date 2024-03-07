import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FriendsService } from './friends.service';
import { Friend } from '../../Models/Friend/friend';
import { HttpClientModule } from '@angular/common/http';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';
import { DeleteFriendRequest } from '../../Models/DTO/DeleteFriend/delete-friend-request';


describe('FriendsService', () => {
  let service: FriendsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [FriendsService],
    });
    
    service = TestBed.inject(FriendsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to add friends', () => {
    const friendsData: Friend = {
      RequestId: 1,
      SenderId: 1,
      ReceiverId: 1, 
      Status: 0
    };

    service.addFriends(friendsData).subscribe(response => {
      expect(response).toEqual(1)
    });

    const req = httpTestingController.expectOne(`${service['url']}AddFriend`);
    expect(req.request.method).toBe('POST');

    req.flush(1);
  });

  it('should send a POST request to update friend request', () => {
    const friendRequestData: FriendRequest = {
      ReceiverId: 1, 
      SenderId: 1,
      Status: 0
    };

    service.UpdateFriendRequest(friendRequestData).subscribe(response => {
      expect(response).toEqual(1)
    });

    const req = httpTestingController.expectOne(`${service['url']}UpdateFriendRequest`);
    expect(req.request.method).toBe('POST');
    req.flush(1);
  });

  it('should send a POST request to delete friend', () => {
    const deleteFriendRequestData: DeleteFriendRequest = {
      ChatRoomId: 1,
      UserId1: 1,
      UserId2: 2
    };

    service.DeleteFriend(deleteFriendRequestData).subscribe(response => {
      expect(response).toEqual(1)
    });

    const req = httpTestingController.expectOne(`${service['url']}DeleteFriend`);
    expect(req.request.method).toBe('POST');
    req.flush(1);
  });
});
