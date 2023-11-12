import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ITimeTrackerDocument, IUserHour } from '../interfaces/app.interface';
import { IUser, IUserDocument } from '../interfaces/auth.interface';
import { FirestoreService } from '../services/firestore.service';
import { LanguageService } from '../services/language.service';
import { ParserService } from '../services/parser.service';

@Component({
  selector: 'app-user-hours-list',
  templateUrl: './user-hours-list.component.html',
  styleUrls: ['./user-hours-list.component.scss'],
})
export class UserHoursListComponent implements OnChanges, OnDestroy {
  @Input() user!: IUser;
  @Input() role!: string;
  userHours: IUserHour[];
  currentPage = 1;
  totalPages = 100;
  itemsPerPage = 5;
  dateRange: Date[];
  range = 7;
  hourReq = '45';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private firestoreService: FirestoreService,
    public parserService: ParserService,
    public lang: LanguageService
  ) {
    if (this.user?.locale) this.lang.setLocale(this.user.locale);
    this.userHours = [];
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - this.range);
    this.dateRange = [fromDate, toDate];
  }

  ngOnChanges() {
    if (this.user && this.role && this.role == 'admin') {
      this.getLogsFromRange();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleDateChange(dateRange?: (Date | undefined)[] | undefined) {
    if (dateRange && dateRange.length == 2) {
      this.dateRange = dateRange as Date[];
      this.getLogsFromRange();
    }
  }

  setTotalPage() {
    this.totalPages = Math.ceil(this.userHours.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getLogsFromRange() {
    this.firestoreService
      .getUsersWithMinimumHours(this.dateRange, this.hourReq)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: {
          data: ITimeTrackerDocument[];
          userDocuments: Observable<IUserDocument[]>;
        }) => {
          let filteredDocuments = response.data;
          response.userDocuments.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (userDocuments: IUserDocument[]) => {
              this.userHours = this.parserService.combineData(
                userDocuments,
                filteredDocuments
              );
              this.setTotalPage();
            },
            error: (error: any) => {
              console.log('Error:', error);
            },
          });
        },
        error: (error: any) => {
          console.log('Error:', error);
        },
      });
  }
}
