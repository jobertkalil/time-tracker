import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { IUser } from '../interfaces/auth.interface';
import { FirestoreService } from '../services/firestore.service';
import { INameValue, ITimeTrackerDocument } from '../interfaces/app.interface';
import { ParserService } from '../services/parser.service';
import { LanguageService } from '../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tags-chart',
  templateUrl: './tags-chart.component.html',
  styleUrls: ['./tags-chart.component.scss'],
})
export class TopTagsChartComponent implements OnChanges, OnDestroy {
  @Input() user!: IUser;
  @Input() role!: string;
  searchDate: string = '';
  dataLoaded: boolean = false;
  dateRange: Date[];
  range = 30;

  private ngUnsubscribe = new Subject<void>();

  chartData: INameValue[] = [];
  view: [number, number] = [300, 200]; // Chart dimensions
  pieChartOptions: any = {
    showLegend: true,
    animations: true,
    legendPosition: 'below',
  };

  constructor(
    private firestoreService: FirestoreService,
    private parserService: ParserService,
    public lang: LanguageService
  ) {
    if (this.user?.locale) this.lang.setLocale(this.user.locale);
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - this.range);
    this.dateRange = [fromDate, toDate];
  }

  ngOnChanges() {
    if (this.user) {
      this.evaluateUser();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleDateChange(dateRange?: (Date | undefined)[] | undefined) {
    if (dateRange && dateRange.length == 2) {
      this.dateRange = dateRange as Date[];
      this.evaluateUser();
    }
  }

  getLogsFromRange() {
    this.dataLoaded = false;
    this.firestoreService
      .getLogsFromRangeWithUser(this.dateRange, this.user.userID)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (documents: ITimeTrackerDocument[]) => {
          if (documents) {
            if (documents.length) {
              this.chartData = [
                ...this.parserService.parseChartData(documents),
              ];
              this.dataLoaded = true;
            }
          }
        },
        error: (error: any) => {
          console.log('Error:', error);
        },
      });
  }

  getLogsFromRangeAdmin() {
    this.dataLoaded = false;
    this.firestoreService
      .getLogsFromRangeWithAdmin(this.dateRange, this.user)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (documents: ITimeTrackerDocument[]) => {
          if (documents) {
            if (documents.length) {
              this.chartData = [
                ...this.parserService.parseChartData(documents),
              ];
              this.dataLoaded = true;
            }
          }
        },
        error: (error: any) => {
          console.log('Error:', error);
        },
      });
  }

  evaluateUser() {
    if (this.role && this.role == 'admin') this.getLogsFromRangeAdmin();
    else this.getLogsFromRange();
  }
}
