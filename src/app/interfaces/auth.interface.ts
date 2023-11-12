export enum UserState {
  noUser,
  guest,
  loggedIn,
}

export interface IUser {
  uid: string;
  userID: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  photoURL?: string;
  displayName?: string;
  password?: string;
  locale?: string;
}

export interface IUserDocument {
  documentId: string;
  data: IUser;
}
