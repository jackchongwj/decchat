import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatroomService } from './chatroom.service';

describe('ChatroomService', () => {
  let service: ChatroomService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatroomService]
    });

    service = TestBed.inject(ChatroomService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update group name', () => {
    const chatroomId = 1; 
    const newGroupName = 'Group 1';

    service.updateGroupName(chatroomId, newGroupName).subscribe();

    const req = httpTestingController.expectOne(`${service['GroupUrl']}UpdateGroupName`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ chatroomId, newGroupName });

    req.flush(1);
  });

  
  it('should update group picture', () => {
    const chatroomId = 1; 
    const file = new File(['abcd'], 'test-file.txt'); 

    service.updateGroupPicture(chatroomId, file).subscribe();

    const req = httpTestingController.expectOne(`${service['GroupUrl']}UpdateGroupPicture`);
    expect(req.request.method).toEqual('POST');
 
    req.flush(1); 
  });
});
