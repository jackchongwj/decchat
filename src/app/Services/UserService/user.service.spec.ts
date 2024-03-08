import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request for search', () => {
    const searchValue = 'leow';
    
    // mock data
    const mockUser = { profilename: "leow" , id: 1}

    service.getSearch(searchValue).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${service['UserUrl']}Search?profileName=${searchValue}`);
    expect(req.request.method).toBe('GET');

    // Provide a mock response
    req.flush(mockUser);
  });


  it('should send a GET request for friend request', () => {
    const userId = 1;
    const friendRequest = [
      {
        RequestId: 1,
        SenderId:2,
        ReceiverId:1,
        Status: 1
      },
      {
        RequestId: 2,
        SenderId:3,
        ReceiverId:1,
        Status: 1
      },
    ];

    service.getFriendRequest().subscribe(response => {
      expect(response).toEqual(friendRequest);
    });

    const req = httpTestingController.expectOne(`${service['UserUrl']}FriendRequest?userId=${userId}`);
    expect(req.request.method).toBe('GET');

    // Provide a mock response if needed
    req.flush(friendRequest);
  });

  
  // it('should check if username exists', () => {
  //   const username = 'testUser';
  //   const mockResponse = true;

  //   service.doesUsernameExist(username).subscribe((response) => {
  //     expect(response).toBe(mockResponse);
  //   });

  //   const req = httpTestingController.expectOne(`${service['UserUrl']}DoesUsernameExist?username=${encodeURIComponent(username)}`);

  //   expect(req.request.method).toBe('GET');

  //   req.flush(mockResponse);
  // });

  
  it('should get user by userId', () => {
    const mockUser = { 
      UserId: 1,
      ProfileName: 'leow'
    };

    service.getUserById().subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${service['UserUrl']}UserDetails`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUser);
  });

  it('should update the profile name', () => {
    const userId = 1;
    const newProfileName = 'NewProfileName';

    service.updateProfileName(userId, newProfileName).subscribe(response => {
      expect(response).toBeDefined();
    });
  
    const req = httpTestingController.expectOne(`${service['UserUrl']}UpdateProfileName`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id: userId, newProfileName });

    req.flush(1);
  });

  it('should update the profile picture', () => {
    const userId = 1;
    const file = new File(['abcd'], 'test.jpg');

    service.updateProfilePicture(userId, file).subscribe();
    const req = httpTestingController.expectOne(`${service['UserUrl']}UpdateProfilePicture`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Content-Type')).toBeFalsy(); 

    req.flush(1);
  });

  it('should delete a user', () => {
    const userId = 1; 

    service.deleteUser(userId).subscribe();

    const req = httpTestingController.expectOne(`${service['UserUrl']}UserDeletion?id=${userId}`);
    expect(req.request.method).toEqual('POST');

    req.flush(1); 
  });

});
