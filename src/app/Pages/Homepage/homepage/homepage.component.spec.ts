import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let mockSignalRService = jasmine.createSpyObj('SignalRService', ['startConnection']);
  let mockDataShareService = { IsSignalRConnection: new BehaviorSubject<boolean>(false) };
  let mockLocalstorageService = jasmine.createSpyObj('LocalstorageService', ['getItem']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent ],
      providers: [
        { provide: SignalRService, useValue: mockSignalRService },
        { provide: DataShareService, useValue: mockDataShareService },
        { provide: LocalstorageService, useValue: mockLocalstorageService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
  });
});
