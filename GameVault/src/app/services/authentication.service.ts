import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
  UserInfo,
  UserCredential,
  getAuth,
  sendEmailVerification,
} from '@angular/fire/auth';
import { concatMap, first, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  currentUser$ = authState(this.auth);

  constructor(private auth: Auth,private authFirebase: AngularFireAuth, private afs : AngularFirestore) { }

  login(username: string, password: string){
    return from(
      signInWithEmailAndPassword(this.auth, username, password));
  }


  isAdmin(): Observable<boolean> {
    return this.authFirebase.user.pipe(map(user => {
      return user?.email == "admin@gmail.com";
    }));
  }

  isUser(): Observable<boolean> {
    return this.authFirebase.user.pipe(map(user => {
      return user?.email == this.auth.currentUser?.email;
    }));
  }

  async isBanned(emailGiven: string | any): Promise<boolean> {
    const userBannedThing = await this.afs.collection('user', ref => ref.where('email', '==', emailGiven))
      .valueChanges()
      .pipe(
        first()
      )
      .toPromise() as { isBanned: boolean }[];

      console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA' + userBannedThing[0].isBanned);
      return userBannedThing.length > 0 && userBannedThing[0].isBanned;
  }

  signUp(name: string, email: string, password: string){
    return from(
      createUserWithEmailAndPassword(this.auth, email, password))
    .pipe(switchMap(({ user }) => updateProfile(user, { displayName: name })));
  }

  logout(){

    return from(this.auth.signOut());
  }

  getUser(){
    return this.currentUser$;
  }

  sendEmail(){
    const auth = getAuth();

    // Listen for changes to the user authentication state
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, store the user object in a variable
        const currentUser = user;
        sendEmailVerification(currentUser)
          .then(() => {
            // Email verification sent!
          })
          .catch((error) => {
            // Handle error
            console.log(error);
          });
      }
    });
  }
}
