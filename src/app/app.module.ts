import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { TagTypeaheadComponent } from './tag-typeahead/tag-typeahead.component';
import { ActivityTypeaheadComponent } from './activity-typeahead/activity-typeahead.component';
import { TimeLogComponent } from './time-log/time-log.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './portal/login/login.component';
import { SignupComponent } from './portal/signup/signup.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopTagsChartComponent } from './tags-chart/tags-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserHoursListComponent } from './user-hours-list/user-hours-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeTrackerComponent,
    TagTypeaheadComponent,
    ActivityTypeaheadComponent,
    TimeLogComponent,
    DashboardComponent,
    NavigationComponent,
    LoginComponent,
    SignupComponent,
    TopTagsChartComponent,
    AdminDashboardComponent,
    UserHoursListComponent,
  ],
  imports: [
    BrowserModule,
    NgbTypeaheadModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    NgbModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    NgxChartsModule,
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
