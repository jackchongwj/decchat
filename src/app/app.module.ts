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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './Sidebar/sidebar.component';
import { MessageboxComponent } from './MessageBox/messagebox/messagebox.component';
import { ChatmessageComponent } from './ChatMessage/chatmessage/chatmessage.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImportNgZorroAntdModule } from './ng-zorro-antd.module';
import { AddfriendComponent } from './AddFriend/addfriend/addfriend.component';
import { AddFriendDialogContentComponent } from './AddFriend/add-friend-dialog-content/add-friend-dialog-content.component';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { LogoutComponent } from './logout/logout.component';

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
    AddFriendDialogContentComponent,
    ChatlistComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
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
    { provide: NZ_I18N, useValue: ms_MY }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }