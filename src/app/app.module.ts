import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SearchbarComponent } from './Searchbar/searchbar.component';
import { ChatlistComponent } from './Chatlist/chatlist.component';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { ms_MY } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ms from '@angular/common/locales/ms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './Sidebar/sidebar.component';
import { ChatRoomDisplayComponent } from './Layout/ChatRoomDisplay/chatroomdisplay/chatroomdisplay.component';
import { HomepageComponent } from './Pages/Homepage/homepage.component';
import { ImportNgZorroAntdModule } from './ng-zorro-antd.module';
import { AddfriendComponent } from './AddFriend/addfriend/addfriend.component';
import { LoginComponent } from './Pages/Auth/Login/login.component';
import { RegisterComponent } from './Pages/Auth/Register/register.component';
import { LogoutComponent } from './Logout/logout.component';
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { CreategroupComponent } from './CreateGroup/creategroup.component';
import { UserLoginPageComponent } from './Layout/UserLoginPage/user-login-page/user-login-page.component';
import { ChatHeaderComponent } from './Components/ChatHeader/chat-header/chat-header.component';
import { ChatRoomMessageComponent } from './Components/ChatRoomMessage/chat-room-message/chat-room-message.component';
import { MessageboxComponent } from './Components/MessageBox/messagebox/messagebox.component';
import { UserProfileComponent } from './UserProfile/user-profile.component';
import { ChangePasswordComponent } from './ChangePassword/change-password.component';
import { MessageExtraFuncComponent } from './Components/Message-Additional/message-extra-func/message-extra-func.component';
import { SpinComponent } from './Loading/spin/spin.component';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { MenuFoldOutline, MenuUnfoldOutline, LockOutline, UserOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [ MenuFoldOutline, MenuUnfoldOutline ];

registerLocaleData(ms);

@NgModule({
  declarations: [
    AppComponent,
    SearchbarComponent,
    SidebarComponent,
    MessageboxComponent,
    ChatRoomDisplayComponent,
    HomepageComponent,
    AddfriendComponent,
    ChatlistComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    CreategroupComponent,
    UserLoginPageComponent,
    ChatHeaderComponent,
    ChatRoomMessageComponent,
    UserLoginPageComponent,
    ChatHeaderComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    ChatRoomMessageComponent,
    MessageExtraFuncComponent,
    SpinComponent
  ],
    imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ImportNgZorroAntdModule,
    ReactiveFormsModule,
    NzIconModule
  ],
  
  
  providers: [
    provideClientHydration(),
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NZ_ICONS, useValue: [LockOutline, UserOutline] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }