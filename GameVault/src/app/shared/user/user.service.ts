import { Injectable, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { increment } from 'firebase/firestore';
import { User } from './user.module';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  formData: User;
  currentUsersEmail: string;
  currUserId: string;
  
  @Input() usersGames: Array<string> = [];
  @Input() usersWantPlay: Array<string> = [];
  @Input() usersFollowedList: Array<string> = [];
  @Input() usersFavList: Array<string> = [];

  constructor(
    private afs : AngularFirestore,
    public auth : AngularFireAuth,
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute) { 
    this.auth.authState.subscribe(async (user) => {
      if (user) {
        await this.getUserfavList();
        await this.getUsersGames();
        await this.getUsersGamesWanted();
        await this.getUsersFollowedList();
        await this.getCurrUserEmail();
      }
    });
  }
  
  getItems(order: string, direction: "asc" | "desc")
  {
    return this.afs.collection('user', ref => ref.orderBy(order, direction).limit(63)).snapshotChanges();
  }

  deleteItem(data : User)
  {
    return new Promise<any>((resolve, reject) =>
    {
      this.afs.collection("user").doc(data.id).delete().then(res => {resolve(res)}, err => reject(err));
    });
  }

  updateItem(data : User)
  {
    return new Promise<any>((resolve, reject) =>
    {
      this.afs.collection("user").doc(data.id).update(data).then(res => {resolve(res)}, err => reject(err));
    });
  }

  banUser(data: User)
  {
    return new Promise<any>((resolve, reject) =>{
      this.afs.collection("user").doc(data.id).update({isBanned: true});
    })
  }

  unbanUser(data: User)
  {
    return new Promise<any>((resolve, reject) =>{
      this.afs.collection("user").doc(data.id).update({isBanned: false});
    })
  }

  getCurrUserEmailString()
  {
    this.getCurrUserEmail();
    return this.currentUsersEmail;
  }

  async getCurrUserEmail()
  {
    const user = await this.auth.currentUser;
    if(user)
    {
      const userRef = this.afs.collection('user').doc(await this.getUserId())
      const userDoc = await userRef.get().toPromise();
      const currentEmail = userDoc?.get('email') as string;
      this.currentUsersEmail = currentEmail;
    }
  }

  async getUsersFollowedList()
  {
    this.usersFollowedList = [];
    const user = await this.auth.currentUser;
    if(user)
    {
      const userRef = this.afs.collection('user').doc(await this.getUserId())
      const userDoc = await userRef.get().toPromise();
      const currentFollowedList = userDoc?.get('followedList') as string[];
  
      this.usersFollowedList = currentFollowedList;
    }
  }

  async getUserfavList()
  {
    this.usersFavList = [];
    const user = await this.auth.currentUser;
    if(user)
    {
      const userRef = this.afs.collection('user').doc(await this.getUserId())
      const userDoc = await userRef.get().toPromise();
      const currentFavList = userDoc?.get('favoriteList') as string[];
  
      this.usersFavList = currentFavList;
    }
  }

  async addOrRemoveFavGame(gameId: string) {
    const userDocRef = this.afs.collection("user").doc(await this.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const favGames = userDoc?.get('favoriteList') as string[];
    if (!favGames.includes(gameId)) {
      if (favGames.length >= 3) {
        this.toast.error("You have already 3 favorite games");
        return undefined
      }
      else {
        favGames.push(gameId);
        userDocRef.update({ favoriteList: favGames });
        this.usersFavList = favGames
        this.toast.success("Added to favorite list");
        return gameId
      }
    }
    else {
      const removedFavGameList = favGames.filter(id => id !== gameId);
      await userDocRef.update({favoriteList: removedFavGameList});
      this.usersFavList = removedFavGameList;
      this.toast.success("Removed from favorite list");
      return undefined
    }
  }
  

  async followedPerson(userID: string) {
    this.usersFollowedList = [];
    await this.getUsersFollowedList();
    const user = await this.auth.currentUser;
    if(user)
    {
      const userRef = this.afs.collection('user').doc(await this.getUserId())
      const userDoc = await userRef.get().toPromise();
      const currentFollowedList = userDoc?.get('followedList') as string[];
  
      this.usersFollowedList = currentFollowedList;

      if(!currentFollowedList.includes(userID))
      {
        const newFollowedList = [...currentFollowedList, userID];
        await userRef.update({followedList: newFollowedList});
        this.usersFollowedList = newFollowedList;
        this.toast.success("Followed this user");
      }
      else
      {
        const newFollowedList = currentFollowedList.filter(title => title !== userID);
        await userRef.update({followedList: newFollowedList});
        this.usersFollowedList = newFollowedList;
        this.toast.success("Unfollowed this user");
      }

      const userCurr = await this.getUserId();
      const userRef2 = this.afs.collection('user').doc(this.currUserId);
      const userDoc2 = await userRef2.get().toPromise();
      const currentFollowerList = userDoc2?.get('followerList') as string[];

      if(!currentFollowerList.includes(userCurr as string)){
        const newFollowerList = [...currentFollowerList, userCurr as string];
        await userRef2.update({followerList: newFollowerList});
      }
    }
  }

  
  async addGameToWantPlay(gameID: string){
    const userDocRef = this.afs.collection("user").doc(await this.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const currentWantedPlayList = userDoc?.get('planList') as string[];
    if (!currentWantedPlayList.includes(gameID)) 
    {
      const newWantPlayList = [...currentWantedPlayList, gameID];
      await userDocRef.update({planList: newWantPlayList});
      this.usersWantPlay = newWantPlayList;
      this.toast.success("Added to planed list");
    }
    else
    {
      const newWantPlayList = currentWantedPlayList.filter(title => title !== gameID);
      await userDocRef.update({planList: newWantPlayList});
      this.usersWantPlay = newWantPlayList;
      this.toast.success("Removed from planed list");
    }
  }

  async addGameToPlayed(gameID: string)
  { 
    const userDocRef = this.afs.collection("user").doc(await this.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const currentCompletedList = userDoc?.get('completedList') as string[];
    if(!currentCompletedList.includes(gameID))
    {
      const newCompletedList = [...currentCompletedList, gameID];
      await userDocRef.update({completedList: newCompletedList});
      this.usersGames = newCompletedList;
      this.toast.success("Added to completed list");
    }
    else
    {
      const newCompletedList = currentCompletedList.filter(title => title !== gameID);
      await userDocRef.update({completedList: newCompletedList});
      this.usersGames = newCompletedList
      this.toast.success("Removed from completed list");
    }
  }

  // Like a game
  async likeGame(gameID: string)
  {
    const userDocRef = this.afs.collection("user").doc(await this.getUserId());
    const gameDocRef = this.afs.collection("game").doc(gameID);
    const userDoc = await userDocRef.get().toPromise();
    const currentLikedList = userDoc?.get('likedList') as string[];
    const currentDislikedList = userDoc?.get('dislikedList') as string[];
    if(!currentLikedList.includes(gameID))
    {
      const newLikedList = [...currentLikedList, gameID];
      await userDocRef.update({likedList: newLikedList});
      await gameDocRef.update({
    
        likeCount: increment(1)
      });

      if(currentDislikedList.includes(gameID))
      {
        const newDislikedList = currentDislikedList.filter(title => title !== gameID);
        await userDocRef.update({dislikedList: newDislikedList});
        await gameDocRef.update({
          dislikeCount: increment(-1)
        });
      }
      this.toast.success("Added to liked list");
    }
    else
    {
      const newLikedList = currentLikedList.filter(title => title !== gameID);
      await userDocRef.update({likedList: newLikedList});
            await gameDocRef.update({

        likeCount: increment(-1)
      });
      this.toast.success("Removed from liked list");
    }
  }

  // Dislike a game
  async dislikeGame(gameID: string)
  {
    const userDocRef = this.afs.collection("user").doc(await this.getUserId());
    const gameDocRef = this.afs.collection("game").doc(gameID);
    const userDoc = await userDocRef.get().toPromise();
    const currentDislikedList = userDoc?.get('dislikedList') as string[];
    const currentLikedList = userDoc?.get('likedList') as string[];
    if(!currentDislikedList.includes(gameID))
    {
      const newDislikedList = [...currentDislikedList, gameID];
      await userDocRef.update({dislikedList: newDislikedList});
      await gameDocRef.update({
        dislikeCount: increment(1)
      });

      if(currentLikedList.includes(gameID))
      {
        const newLikedList = currentLikedList.filter(title => title !== gameID);
        await userDocRef.update({likedList: newLikedList});
        await gameDocRef.update({
          likeCount: increment(-1)
        });
      }
      
      this.toast.success("Added to disliked list");
    }
    else
    {
      const newDislikedList = currentDislikedList.filter(title => title !== gameID);
      await userDocRef.update({dislikedList: newDislikedList});
      await gameDocRef.update({
        dislikeCount: increment(-1)
      });
      this.toast.success("Removed from disliked list");
    }
  }

  async getUsersGames()
  {
    this.usersGames = [];
    const user = await this.auth.currentUser;
    if(user)
    {
      const userDocRef = this.afs.collection("user").doc(await this.getUserId());
      const userDoc = await userDocRef.get().toPromise();
      const currentCompletedList = userDoc?.get('completedList') as string[];
      this.usersGames = currentCompletedList;
    }
  }

  async getUsersGamesWanted()
  {
    this.usersWantPlay = [];
    const user = await this.auth.currentUser;
    if(user)
    {
      const userDocRef = this.afs.collection("user").doc(await this.getUserId());
      const userDoc = await userDocRef.get().toPromise();
      const currentPlannedList = userDoc?.get('planList') as string[];
      this.usersWantPlay = currentPlannedList;
    }
  }

  async getCurrentUserId(): Promise<string | undefined> {
    const user = await this.auth.currentUser;
    if (user) {
      const userDocs = await this.afs.collection('user', ref => ref.where('email', '==', user.email)).get().toPromise();
      const userDoc = userDocs?.docs[0];
      return userDoc?.id;
    } else {
      this.toast.error("Sign-in to use this feature.");
      this.router.navigate(['/auth']);
      throw new Error('No currently logged in user');
    }
  }

  async getUserId() {
    try {
      const userId = await this.getCurrentUserId();
      return userId;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

}
