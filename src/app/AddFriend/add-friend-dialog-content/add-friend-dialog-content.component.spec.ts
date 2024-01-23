import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendDialogContentComponent } from './add-friend-dialog-content.component';

describe('AddFriendDialogContentComponent', () => {
  let component: AddFriendDialogContentComponent;
  let fixture: ComponentFixture<AddFriendDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFriendDialogContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFriendDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
