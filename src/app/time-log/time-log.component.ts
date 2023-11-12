import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { setTheme } from 'ngx-bootstrap/utils';
import { Subject, takeUntil } from 'rxjs';
import {
  IGenericObject,
  ITimeTrackerDocument,
} from '../interfaces/app.interface';
import { IUser, IUserDocument } from '../interfaces/auth.interface';
import { FirestoreService } from '../services/firestore.service';
import { LanguageService } from '../services/language.service';
import { ParserService } from '../services/parser.service';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.scss'],
})
export class TimeLogComponent implements OnChanges, OnDestroy {
  @Input() user!: IUser;
  @Input() role!: string;
  logs: ITimeTrackerDocument[];
  originalLogs: ITimeTrackerDocument[];
  searchTag: string;
  searchActivity: string;
  searchDate: string;
  currentPage = 1;
  totalPages = 100;
  itemsPerPage = 10;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private firestoreService: FirestoreService,
    public parserService: ParserService,
    public lang: LanguageService
  ) {
    if (this.user?.locale) this.lang.setLocale(this.user.locale);
    setTheme('bs5');
    this.logs = [];
    this.originalLogs = [];
    this.searchTag = '';
    this.searchActivity = '';
    this.searchDate = '';
  }

  ngOnChanges() {
    if (this.user) this.evaluateUser();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setTotalPage() {
    this.totalPages = Math.ceil(this.logs.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  handleDateChange(event?: Date) {
    if (event) this.searchDate = event.toDateString();
    else this.searchDate = '';
    this.searchRecords();
  }

  searchRecords() {
    this.logs = [...this.originalLogs];

    if (this.searchTag != '')
      this.logs = this.searchLogs(this.logs, this.searchTag, 'tag');

    if (this.searchActivity != '')
      this.logs = this.searchLogs(this.logs, this.searchActivity, 'activity');

    if (this.searchDate) {
      const date = new Date(this.searchDate);
      this.logs = this.searchLogsForDate(this.logs, date, 'createdDate');
    }
  }

  searchLogs(
    logs: ITimeTrackerDocument[],
    search: string,
    key: string
  ): ITimeTrackerDocument[] {
    return logs.filter((log) =>
      (log.data as IGenericObject)[key].toLowerCase().includes(search)
    );
  }

  searchLogsForDate(
    logs: ITimeTrackerDocument[],
    date: Date,
    key: string
  ): ITimeTrackerDocument[] {
    return logs.filter((log) =>
      this.areDatesEqual(
        ((log.data as IGenericObject)[key] as Timestamp).toDate(),
        date
      )
    );
  }

  areDatesEqual(date1: Date, date2: Date) {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }

  start() {
    this.firestoreService
      .getLogs(this.user.userID)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (documents: ITimeTrackerDocument[]) => {
          if (documents) {
            if (documents.length) {
              this.logs = documents;
              this.originalLogs = documents;
              this.currentPage = 1;
              this.setTotalPage();
            } else {
              this.logs = [];
              this.originalLogs = [];
              this.currentPage = 1;
              this.totalPages = 0;
              this.itemsPerPage = 10;
            }
          }
        },
        error: (error: any) => {
          console.log('Error:', error);
        },
      });
  }

  startAdmin() {
    this.firestoreService
      .getLogsAdmin(this.user)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (documents: ITimeTrackerDocument[]) => {
          if (documents) {
            if (documents.length) {
              this.firestoreService
                .getUsers()
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                  next: (userDocuments: IUserDocument[]) => {
                    if (userDocuments.length) {
                      this.logs = this.parserService.addUserInfoToTimeTrackers(
                        documents,
                        userDocuments
                      );
                      this.originalLogs = [...this.logs];
                      this.currentPage = 1;
                      this.setTotalPage();
                    } else this.reset();
                  },
                  error: (error: any) => {
                    console.log('Error:', error);
                  },
                });
            } else this.reset();
          }
        },
        error: (error: any) => {
          console.log('Error:', error);
        },
      });
  }

  archiveLog(log: ITimeTrackerDocument) {
    this.firestoreService
      .archiveTracker(log, this.user.userID)
      .then((result) => {
        this.evaluateUser();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  evaluateUser() {
    if (this.role && this.role == 'admin') this.startAdmin();
    else this.start();
  }

  private reset() {
    this.logs = [];
    this.originalLogs = [];
    this.currentPage = 1;
    this.totalPages = 0;
    this.itemsPerPage = 10;
  }
}
