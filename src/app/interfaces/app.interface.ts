import { Timestamp } from '@angular/fire/firestore';

export interface ITimeTracker {
  activity: string;
  dateModified?: Timestamp;
  isArchived?: boolean;
  modifiedBy?: string;
  createdDate: Timestamp;
  createdBy: string;
  tag: string;
  userID: string;
  totalHours: string;
}

export interface ITimeTrackerDocument {
  documentId: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  data: ITimeTracker;
}

export interface IGenericObject {
  [key: string]: any;
}

export interface INameValue {
  name: any;
  value: any;
}

export interface IUserHour {
  displayName?: string;
  firstName: string;
  lastName: string;
  totalHours: string;
  userID: string;
}
