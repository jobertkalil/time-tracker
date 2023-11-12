import { Component, Input, OnChanges } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ITimeTrackerDocument } from '../interfaces/app.interface';
import { IUser } from '../interfaces/auth.interface';
import { FirestoreService } from '../services/firestore.service';
import { LanguageService } from '../services/language.service';
import { ParserService } from '../services/parser.service';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss'],
})
export class TimeTrackerComponent implements OnChanges {
  @Input() user!: IUser;
  document!: ITimeTrackerDocument;

  constructor(
    private firestoreService: FirestoreService,
    public parserService: ParserService,
    public lang: LanguageService
  ) {
    if (this.user?.locale) this.lang.setLocale(this.user.locale);
  }

  ngOnChanges() {
    if (this.user) this.reset();
  }

  submit() {
    //add new document in the tracker collection
    this.firestoreService
      .addTracker(this.document, this.user.userID)
      .then(() => {
        this.reset();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  private reset() {
    this.document = {
      documentId: '',
      data: {
        tag: '',
        activity: '',
        totalHours: '',
        createdDate: Timestamp.fromDate(new Date()),
        createdBy: this.user.userID,
        userID: this.user.userID,
        isArchived: false,
      },
    };
  }
}
