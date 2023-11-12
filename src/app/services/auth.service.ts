import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IUser } from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;
  auth = getAuth();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.afs.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  signUp(user: IUser) {
    createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password as string
    )
      .then((userCredential: any) => {
        // Signed in
        user = {
          ...userCredential.user,
          uid: userCredential.user.uid,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.firstName + ' ' + user.lastName,
          email: user.email,
          photoURL: userCredential.user.photoURL ?? '',
        };
        this.createUserData(user)
          .then(() => {
            this.router.navigate(['/']);
          })
          .catch((error: any) => {
            console.log('Error:', error);
          });
      })
      .catch((error: any) => {
        console.log('Error:', error);
      });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: any) => {
        this.updateUserData(result.user)
          .then((result) => {
            this.router.navigate(['/']);
          })
          .catch((error: any) => {
            console.log('Error:', error);
          });
      })
      .catch((error: any) => {
        console.log('Error:', error);
      });
  }

  private createUserData(user: IUser) {
    const userRef: AngularFirestoreDocument<IUser> = this.afs
      .collection('users')
      .doc(user.uid);

    const data: IUser = {
      uid: user.uid,
      userID: user.uid,
      lastName: user.firstName,
      firstName: user.lastName,
      email: user.email,
      displayName: user.displayName as string,
      photoURL: user.photoURL as string,
    };

    return userRef.set(data, { merge: true });
  }

  private updateUserData(user: IUser) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<IUser> = this.afs
      .collection('users')
      .doc(user.uid);
    let fullName: string[] = [];

    if (user.displayName) fullName = user.displayName.split(' ');
    const data: IUser = {
      uid: user.uid,
      userID: user.uid,
      lastName: user.firstName ?? fullName.pop(),
      firstName: user.lastName ?? fullName.join(' '),
      email: user.email,
      displayName: user.displayName ?? user.firstName + ' ' + user.lastName,
      photoURL: user.photoURL as string,
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
