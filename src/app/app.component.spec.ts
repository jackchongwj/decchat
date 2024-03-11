import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'DEChat'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('DEChat');
  });

  it('should only contain <router-outlet> tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const appElement: HTMLElement = fixture.nativeElement;
    const childElements = appElement.children;

    expect(childElements.length).toEqual(1);
    expect(childElements[0].tagName.toLowerCase()).toEqual('router-outlet');
  });

});
