import { Component, Input } from '@angular/core';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { ITimeTrackerDocument } from '../interfaces/app.interface';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tag-typeahead',
  templateUrl: './tag-typeahead.component.html',
  styleUrls: ['./tag-typeahead.component.scss'],
})
export class TagTypeaheadComponent {
  @Input() document!: ITimeTrackerDocument;
  @Input() placeholder!: string;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200), // Delay to avoid excessive requests
      distinctUntilChanged(), // Only send if the text has changed
      switchMap((term) => this.firestoreService.getTags(term))
    );

  constructor(public firestoreService: FirestoreService) {}
}
