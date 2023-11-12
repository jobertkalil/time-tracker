import { Component, Input } from '@angular/core';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { ITimeTrackerDocument } from '../interfaces/app.interface';

@Component({
  selector: 'app-activity-typeahead',
  templateUrl: './activity-typeahead.component.html',
  styleUrls: ['./activity-typeahead.component.scss'],
})
export class ActivityTypeaheadComponent {
  @Input() document!: ITimeTrackerDocument;
  @Input() placeholder!: string;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200), // Delay to avoid excessive requests
      distinctUntilChanged(), // Only send if the text has changed
      switchMap((term) => this.firestoreService.getActivities(term))
    );

  constructor(public firestoreService: FirestoreService) {}
}
