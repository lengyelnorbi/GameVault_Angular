import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { HotToastService } from '@ngneat/hot-toast';
import { DocumentReference, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Game, IDlessGame } from './game.module';
import { Query } from '@firebase/firestore-types';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private afs : AngularFirestore,
    private toast: HotToastService
  ) {}

  getGames(order: string, direction: "asc" | "desc"): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('game', ref => ref.orderBy(order, direction).limit(63)).snapshotChanges();
  }

  getGamesIntoSlide(order: string, direction: "asc" | "desc"): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('game', ref => ref.orderBy(order, direction)).snapshotChanges();
  }

  getGameById(id: string) {
    return this.afs.collection('game').doc(id).get()
  }
  getTopRatedGames(order: string, direction: "asc" | "desc"): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('game', ref => ref.orderBy(order, direction).limit(9)).snapshotChanges();
  }

  getRecentlyReleased(order: string, direction: "asc" | "desc"): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('game', ref => ref.where('releaseDate', '<=', new Date().toISOString().slice(0,10)).orderBy(order, direction)
    .limit(10)).snapshotChanges();
  }

  uploadGame(data: IDlessGame) {
    this.afs.collection('game').add(data)
    .then(
      () => this.toast.success("Game uploaded successfully!")
    )
    .catch(
      err => this.toast.error("Upload falied!\n" + err)
    );
  }

  updateGame(docRef: DocumentReference, data: IDlessGame) {
    setDoc(docRef, data).then(
      () => this.toast.success("Game updated successfully!")
    )
    .catch(
      err => this.toast.error("Update falied!\n" + err)
    );
  }

  deleteGame(game: Game) {
    console.log("TO BE DELETED: " + game.id)
    this.afs.collection('game').doc(game.id).delete().then(
      () => this.toast.success("Game deleted successfully!")
    )
    .catch(
      err => this.toast.error("Delete falied!\n" + err)
    );
  }

  deleteGameById(id: string) {
    console.log("TO BE DELETED: " + id)
    this.afs.collection('game').doc(id).delete().then(
      () => this.toast.success("Game deleted successfully!")
    )
    .catch(
      err => this.toast.error("Delete falied!\n" + err)
    );
  }

  getUpcomingGames(): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('game', ref => ref.where('releaseDate', '>=', new Date().toISOString().slice(0,10)).orderBy('releaseDate', 'asc')
    .limit(6)).snapshotChanges();
  }
  
  getGamesCount(): Observable<number> {
    return this.afs.collection('game').get().pipe(
      map(game => game.size)
    );
  }

  getUsersCount(): Observable<number> {
    return this.afs.collection('user').get().pipe(
      map(user => user.size)
    );
  }
  
}
