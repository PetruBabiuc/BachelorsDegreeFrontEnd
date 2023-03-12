import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './component/login/login.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OwnSongsComponent } from './component/own-songs/own-songs.component';
import { HttpErrorInterceptor, JwtInterceptor } from './service/interceptor';
import { OrderListModule } from 'primeng/orderlist';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { AddSongComponent } from './component/add-song/add-song.component';
import { FileUploadModule } from 'primeng/fileupload';
import { StartCrawlingComponent } from './component/start-crawling/start-crawling.component';
import { CrawlerStateComponent } from './component/crawler-state/crawler-state.component';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterComponent } from './component/register/register.component';
import { UserFormComponent } from './component/user-form/user-form.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageComponent } from './component/message/message.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SongEditComponent } from './component/song-edit/song-edit.component';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    OwnSongsComponent,
    AddSongComponent,
    StartCrawlingComponent,
    CrawlerStateComponent,
    RegisterComponent,
    UserFormComponent,
    MessageComponent,
    SongEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MenubarModule,
    ButtonModule,
    PanelModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    HttpClientModule,
    OrderListModule,
    DataViewModule,
    DropdownModule,
    FileUploadModule,
    CheckboxModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    DialogModule,
    ChartModule,
    CardModule,
    DividerModule,
    TooltipModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
