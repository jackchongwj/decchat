import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchbarComponent } from './Searchbar/searchbar.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ms_MY } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ms from '@angular/common/locales/ms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './Sidebar/sidebar.component';
import { MessageboxComponent } from './MessageBox/messagebox/messagebox.component';
import { ChatmessageComponent } from './ChatMessage/chatmessage/chatmessage.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImportNgZorroAntdModule } from './ng-zorro-antd.module';
import { AddfriendComponent } from './AddFriend/addfriend/addfriend.component';
// import { AddFriendDialogContentComponent } from './AddFriend/add-friend-dialog-content/add-friend-dialog-content.component';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { LogoutComponent } from './Logout/logout.component';
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { CreategroupComponent } from './CreateGroup/creategroup.component';
import { UserLoginPageComponent } from './Layout/UserLoginPage/user-login-page/user-login-page.component';
import { ChatHeaderComponent } from './ChatHeader/chat-header/chat-header.component';
import { ChatRoomMessageComponent } from './ChatRoomMessage/chat-room-message/chat-room-message.component';

registerLocaleData(ms);

@NgModule({
  declarations: [
    AppComponent,
    SearchbarComponent,
    SidebarComponent,
    MessageboxComponent,
    ChatmessageComponent,
    HomepageComponent,
    AddfriendComponent,
    ChatlistComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    CreategroupComponent,
    UserLoginPageComponent,
    ChatHeaderComponent,
    ChatRoomMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ImportNgZorroAntdModule,
  ],
  
  providers: [
    provideClientHydration(),
    { provide: NZ_I18N, useValue: ms_MY },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }