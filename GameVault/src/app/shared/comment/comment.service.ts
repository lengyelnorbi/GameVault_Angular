import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { HotToastService } from '@ngneat/hot-toast';
import { Comment } from './comment.module';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private afs: AngularFirestore,
    private toast: HotToastService
  ) {}

  uploadComment(data: Comment) {
    this.afs.collection('comment').add(data)
    .then(
      () => this.toast.success("Comment posted successfully!")
    )
    .catch(
      err => this.toast.error("Posting comment failed!\n" + err)
    );
  }

  getCommentsByGameID(gameID: String): Observable<Comment[]> {
    return from(
      this.afs.collection<Comment>('comment').ref.where('gameID', '==', gameID).get()
      .then((querySnapshot) => {
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          const comment = doc.data() as Comment;
          comments.push(comment);
        });
        return comments;
      })
    );
  }
}