import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalstorageService } from '../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';
import { of } from 'rxjs';
import { HomepageComponent } from './homepage.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock services
class MockLocalStorageService {
  getItem(key: string): string | null {
    if (key === 'userId') {
      return '123'; // Mock User Id
    }
    return null;
  }
}

class MockDataShareService {
  IsSignalRConnection = of(true); // Mock SignalR connection status as true
}

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let mockLocalStorageService: LocalstorageService;
  let mockDataShareService: DataShareService;
  let mockSignalRService: SignalRService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageComponent],
      schemas:[CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LocalstorageService, useClass: MockLocalStorageService },
        { provide: DataShareService, useClass: MockDataShareService },
        { provide: SignalRService, useValue: jasmine.createSpyObj('SignalRService', ['startConnection']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;

    // Access the injected services
    mockLocalStorageService = TestBed.inject(LocalstorageService);
    mockDataShareService = TestBed.inject(DataShareService);
    mockSignalRService = TestBed.inject(SignalRService);
  });

  it('should identify initial connection is false', () => {
  expect(component.isSignalRConnection).toBeFalse();
  });


  // Test start connection for valid user Id
  it('should start SignalR connection if userId is valid', () => {
    component.ngOnInit();
    expect(mockSignalRService.startConnection).toHaveBeenCalledWith(123);
  });

  it('should update isSignalRConnection based on DataShareService, case: true', () => {
    mockDataShareService.IsSignalRConnection = of(true);
    fixture.detectChanges();
    expect(component.isSignalRConnection).toBeTrue();
  });

  it('should update isSignalRConnection based on DataShareService, case: false', () => {
    mockDataShareService.IsSignalRConnection = of(false);
    component.ngOnInit();
    expect(component.isSignalRConnection).toBeFalse();
  });

});

