import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchbarComponent } from './Searchbar/searchbar.component';
import { ChatlistComponent } from './chatlist/chatlist.component';

import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ms_MY } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ms from '@angular/common/locales/ms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SidebarComponent } from './Sidebar/sidebar.component';
import { MessageboxComponent } from './MessageBox/messagebox/messagebox.component';
import { ChatmessageComponent } from './ChatMessage/chatmessage/chatmessage.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddfriendComponent } from './AddFriend/addfriend/addfriend.component';
import { AddFriendDialogContentComponent } from './AddFriend/add-friend-dialog-content/add-friend-dialog-content.component';
import { CreategroupComponent } from './CreateGroup/creategroup.component';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import the NzSelectModule
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    CreategroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzIconModule,
    NzInputModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule, 
    NzSelectModule, 
    NzModalModule,
    NzButtonModule
  ],
  
  providers: [
    provideClientHydration(),
    { provide: NZ_I18N, useValue: ms_MY }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }