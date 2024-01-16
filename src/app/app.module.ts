import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DeveloperComponent } from './developer/developer.component';

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

registerLocaleData(ms);

@NgModule({
  declarations: [
    AppComponent,
    DeveloperComponent
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
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(),
    { provide: NZ_I18N, useValue: ms_MY }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }