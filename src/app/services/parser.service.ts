import { Injectable } from '@angular/core';
import {
  INameValue,
  ITimeTracker,
  ITimeTrackerDocument,
  IUserHour,
} from '../interfaces/app.interface';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { IUser, IUserDocument } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  extractTags(timeTrackers: ITimeTracker[]): string[] {
    return timeTrackers
      .map((tracker) => tracker.tag ?? '')
      .filter((tag, index, self) => self.indexOf(tag) === index);
  }

  extractActivities(timeTrackers: ITimeTracker[]): string[] {
    return timeTrackers
      .map((tracker) => tracker.activity ?? '')
      .filter((activity, index, self) => self.indexOf(activity) === index);
  }
  parseChartData(documents: ITimeTrackerDocument[]): INameValue[] {
    const tagMap = new Map<string, number>();
    let chartData: INameValue[];

    // Calculate totalHours for each unique tag
    documents.forEach((document) => {
      const tag = document.data.tag;
      const totalHours = parseFloat(document.data.totalHours);

      if (!isNaN(totalHours)) {
        if (tagMap.has(tag)) {
          tagMap.set(tag, tagMap.get(tag)! + totalHours);
        } else {
          tagMap.set(tag, totalHours);
        }
      }
    });

    // Convert the map to an array of objects
    chartData = Array.from(tagMap.entries()).map(([tag, totalHours]) => ({
      name: tag,
      value: totalHours.toFixed(1),
    }));

    return chartData;
  }

  formatCreatedDate(log: ITimeTrackerDocument) {
    const createdDate = log.data.createdDate.toDate();
    const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
    const day = createdDate.getDate().toString().padStart(2, '0');
    const year = createdDate.getFullYear();

    return `${month}/${day}/${year}`;
  }

  formatTimeUnit(log: ITimeTrackerDocument): string {
    return parseFloat(log.data.totalHours) > 1.0 ? 'hrs' : 'hr';
  }

  formatStringTimeUnit(time: string): string {
    return parseFloat(time) > 1.0 ? 'hrs' : 'hr';
  }

  formDocument(actions: DocumentChangeAction<unknown>[]) {
    let document: ITimeTrackerDocument;
    return actions.map((a) => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      document = {
        documentId: id,
        data: data as ITimeTracker,
      };
      return document;
    });
  }

  formUserDocument(actions: DocumentChangeAction<unknown>[]) {
    let document: IUserDocument;
    return actions.map((a) => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      document = {
        documentId: id,
        data: data as IUser,
      };
      return document;
    });
  }

  filterUsersByTotalHours(
    data: ITimeTrackerDocument[],
    minimumHours: string
  ): ITimeTrackerDocument[] {
    const userMap = new Map<string, ITimeTrackerDocument>();
    data.forEach((item) => {
      const { userID, totalHours } = item.data;
      const parsedTotalHours = parseFloat(totalHours);

      if (userMap.has(userID)) {
        const existingUser = userMap.get(userID)!;
        existingUser.data.totalHours = (
          parseInt(existingUser.data.totalHours) + parsedTotalHours
        ).toString();
      } else {
        userMap.set(userID, item);
      }
    });

    const filteredUsers = [...userMap.values()].filter(
      (user) => parseInt(user.data.totalHours) >= parseInt(minimumHours)
    );

    return filteredUsers;
  }

  combineData(
    userDocuments: IUserDocument[],
    timeTrackerDocuments: ITimeTrackerDocument[]
  ): IUserHour[] {
    let response = userDocuments
      .map((userDoc) => {
        const timeTrackerDoc = timeTrackerDocuments.find(
          (timeTracker) => timeTracker.data.userID === userDoc.data.userID
        );

        if (timeTrackerDoc) {
          return {
            displayName: userDoc.data.displayName,
            firstName: userDoc.data.firstName,
            lastName: userDoc.data.lastName,
            totalHours: timeTrackerDoc.data.totalHours,
            userID: userDoc.data.userID,
          };
        } else {
          return null; // Handle the case when there is no corresponding timeTrackerDocument
        }
      })
      .filter((item) => item !== null);

    return response as IUserHour[];
  }

  addUserInfoToTimeTrackers(
    timeTrackers: ITimeTrackerDocument[],
    users: IUserDocument[]
  ): ITimeTrackerDocument[] {
    // Create a mapping of user IDs to user data for faster lookup
    const userMap = new Map<string, IUser>();
    users.forEach((user) => {
      userMap.set(user.data.userID, user.data);
    });

    // Iterate through the time trackers and add user info when available
    const timeTrackersWithUserInfo = timeTrackers.map((timeTracker) => {
      const userData = userMap.get(timeTracker.data.userID);
      if (userData) {
        // If user data is found, add the displayName, firstName, and lastName
        return {
          ...timeTracker,
          displayName: userData.displayName,
          firstName: userData.firstName,
          lastName: userData.lastName,
        };
      } else {
        // If user data is not found, return the original timeTracker
        return timeTracker;
      }
    });

    return timeTrackersWithUserInfo;
  }
}
