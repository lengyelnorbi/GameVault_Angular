import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/shared/user/user.module';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  private usersCollection: AngularFirestoreCollection<User>;
  users$: Observable<User[]>;
  firstTenUsers: Observable<User[]>;
  numbers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    
    
    this.usersCollection = this.afs.collection<User>('user');
    this.users$ = this.usersCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as User;
          const uid = a.payload.doc.id;
          if(!data.pfpUrl){
            data.pfpUrl = "https://cdn.discordapp.com/attachments/884468391014969424/1092011707737591931/image.png";
          }
          return { uid, ...data };
        })
      ),
      map((users) =>
        users.sort((a, b) => b.completedList.length - a.completedList.length).slice(0, 10)
      )
    );
  }

  getTableRowClass(index: number): string {
    switch (index) {
      case 0:
        return 'first-row';
      case 1:
        return 'second-row';
      case 2:
        return 'third-row';
      default:
        return '';
    }
  }
}
