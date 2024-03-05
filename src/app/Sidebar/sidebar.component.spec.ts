import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SidebarComponent } from './sidebar.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let selectedChatRoomData: BehaviorSubject<ChatListVM>;
  let isSelectedData: BehaviorSubject<boolean>;

  beforeEach(async () => {

    selectedChatRoomData = new BehaviorSubject<ChatListVM>(
    { ChatRoomId: 1,
      ChatRoomName: 'Test Room',
      ProfileName : 'Meghan',
      ProfilePicture: 'path/picture.webp',
      RoomType:  false,
      SelectedUsers: [],
      UserChatRoomId: 234,
      UserId:33, 
      InitiatedBy:34,
      InitiatorProfileName: 'Lolz',
      IsOnline:false
    });
  
    isSelectedData = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        {
          provide: DataShareService,
          useValue: {
            selectedChatRoomData: selectedChatRoomData.asObservable(),
            IsSelectedData: isSelectedData.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should update IsSelected to true when isSelectedData emits true', () => {
    isSelectedData.next(true);
    fixture.detectChanges();
    expect(component.IsSelected).toBeTrue();
  });
  
  it('should update IsSelected to false when isSelectedData emits false', () => {
    isSelectedData.next(false);
    fixture.detectChanges();
    expect(component.IsSelected).toBeFalse();
  });

  it('should update IsSelected to true when ChatRoom Name and Id Not NULL', () => {
    expect(component.IsSelected).toBeTrue();
  });
  
  it('should update IsSelected to false when ChatRoom Name and Id NULL', () => {
    selectedChatRoomData.next(
    { ChatRoomId: 0,
      ChatRoomName: '',
      ProfileName : 'Meghan',
      ProfilePicture: 'path/picture.webp',
      RoomType:  false,
      SelectedUsers: [],
      UserChatRoomId: 234,
      UserId:33, 
      InitiatedBy:34,
      InitiatorProfileName: 'Lolz',
      IsOnline:false
    });
    fixture.detectChanges();
    expect(component.IsSelected).toBeFalse();
  });


});