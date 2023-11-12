import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Observable, map, of } from 'rxjs';
import {
  ITimeTracker,
  ITimeTrackerDocument,
} from '../interfaces/app.interface';
import { IUser } from '../interfaces/auth.interface';
import { ParserService } from './parser.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private firestore: AngularFirestore,
    private parserService: ParserService
  ) {}

  getLogs(userId: string): Observable<ITimeTrackerDocument[]> {
    let document: ITimeTrackerDocument;
    return this.firestore
      .collection('tracker', (ref) =>
        ref
          .where('userID', '==', userId)
          .where('isArchived', '==', false)
          .orderBy('createdDate', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            document = {
              documentId: id,
              data: data as ITimeTracker,
            };
            return document;
          });
        })
      );
  }

  getLogsAdmin(user: IUser): Observable<ITimeTrackerDocument[]> {
    if (!user.role || user.role != 'admin') return of([]);

    let document: ITimeTrackerDocument;
    return this.firestore
      .collection('tracker', (ref) =>
        ref.where('isArchived', '==', false).orderBy('createdDate', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            document = {
              documentId: id,
              data: data as ITimeTracker,
            };
            return document;
          });
        })
      );
  }

  getLogsFromRangeWithUser(dateRange: Date[], userId: string) {
    let document: ITimeTrackerDocument;
    return this.firestore
      .collection('tracker', (ref) =>
        ref
          .where('userID', '==', userId)
          .where('isArchived', '==', false)
          .where('createdDate', '>=', dateRange[0])
          .where('createdDate', '<=', dateRange[1])
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            document = {
              documentId: id,
              data: data as ITimeTracker,
            };
            return document;
          });
        })
      );
  }

  getLogsFromRangeWithAdmin(dateRange: Date[], user: IUser) {
    if (!user.role || user.role != 'admin') return of([]);

    let document: ITimeTrackerDocument;
    return this.firestore
      .collection('tracker', (ref) =>
        ref
          .where('isArchived', '==', false)
          .where('createdDate', '>=', dateRange[0])
          .where('createdDate', '<=', dateRange[1])
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            document = {
              documentId: id,
              data: data as ITimeTracker,
            };
            return document;
          });
        })
      );
  }

  getUsersWithMinimumHours(dateRange: Date[], hourReq: string) {
    let filteredDocuments: ITimeTrackerDocument[];
    return this.firestore
      .collection('tracker', (ref) =>
        ref
          .where('isArchived', '==', false)
          .where('createdDate', '>=', dateRange[0])
          .where('createdDate', '<=', dateRange[1])
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return this.parserService.formDocument(actions);
        }),
        map((documents: ITimeTrackerDocument[]) => {
          filteredDocuments = this.parserService.filterUsersByTotalHours(
            documents,
            hourReq
          );
          return this.getUsers();
        }),
        map((userDocuments: any) => {
          return {
            data: filteredDocuments,
            userDocuments: userDocuments,
          };
        })
      );
  }

  getUsers() {
    return this.firestore
      .collection('users')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return this.parserService.formUserDocument(actions);
        })
      );
  }

  getTags(search = ''): Observable<string[]> {
    return this.firestore
      .collection('tracker', (ref) =>
        ref
          .orderBy('tag')
          .startAt(search)
          .endAt(search + '~')
          .limit(50)
      )
      .valueChanges()
      .pipe(
        map((response: unknown) => {
          return this.parserService.extractTags(response as ITimeTracker[]);
        })
      );
  }

  getActivities(search = ''): Observable<string[]> {
    return this.firestore
      .collection('tracker', (ref) =>
        ref
          .orderBy('activity')
          .startAt(search)
          .endAt(search + '~')
          .limit(50)
      )
      .valueChanges()
      .pipe(
        map((response: unknown) => {
          return this.parserService.extractActivities(
            response as ITimeTracker[]
          );
        })
      );
  }

  /**
   * Tracker methods
   */
  addTracker(document: ITimeTrackerDocument, userId: string) {
    const data = {
      ...document?.data,
      userID: userId,
      totalHours: this.formatToDecimal(document.data.totalHours),
      dateModified: Timestamp.fromDate(new Date()),
      createdDate: Timestamp.fromDate(new Date()),
      createdBy: userId,
      modifiedBy: userId,
    };

    return this.firestore.collection('tracker').doc().set(data);
  }

  archiveTracker(document: ITimeTrackerDocument, userId: string) {
    const data = {
      ...document?.data,
      dateModified: Timestamp.fromDate(new Date()),
      isArchived: true,
      modifiedBy: userId,
    };

    return this.firestore
      .collection('tracker')
      .doc(document.documentId)
      .set(data, { merge: true });
  }

  private formatToDecimal(input: string): string {
    const number = parseFloat(input);
    if (!isNaN(number)) {
      return number.toFixed(1);
    }
    return input; // Return the original string if it cannot be parsed as a number
  }
}
