import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { UserService } from '../user/user.service';
import { Achievement, AchievementID } from './achievement.module';
import { Observable, Subscription } from 'rxjs';
import { CommentService } from '../comment/comment.service';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class AchievementService implements OnDestroy {

  achievements: AchievementID[];
  collectionName: string = "achievement";
  subscription?: Subscription;
  userCommentCounter: number = 0;
  comments: Comment[];
  userCompletedListCounter: number = 0;
  userLikedGameCounter: number = 0;
  userDislikedGameCounter: number = 0;
  userFollowedListCounter: number = 0;
  userFollowerListCounter: number = 0;
  userPlanListCounter: number = 0;
  private subrscription1?: Subscription;
  private subrscription2?: Subscription;

  constructor(private afs: AngularFirestore, private userService: UserService, private commentService: CommentService, private toast: HotToastService) {
    //Achievements collection data
    this.subrscription1 = this.subscription = this.afs.collection(this.collectionName, ref => ref.orderBy("name")).snapshotChanges().subscribe({
      next:(achievement: DocumentChangeAction<unknown>[]) =>  
      {
        this.achievements = achievement.map(a=>new AchievementID({...a.payload.doc.data() as AchievementID, id: a.payload.doc.id}));
        console.log(this.achievements);
      }
    });
  }

  async firstCommentAch(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    let firstCommAchID = "";
    for(let a of this.achievements){
      if(a.name === "Welcome Aboard"){
        firstCommAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    console.log(currUserId);
    if(!currentUserAchievementList.includes(firstCommAchID))
    {
      this.subrscription2 = this.afs.collection("comment", ref => ref.where("userID", "==", currUserId)).snapshotChanges().subscribe({
        next:(comments: DocumentChangeAction<unknown>[]) =>  
        {
          this.userCommentCounter = comments.length;
          if(this.userCommentCounter != 0){
            const newAchievementList = [...currentUserAchievementList, firstCommAchID];
            userDocRef.update({achievements: newAchievementList});
            this.toast.success("Achievement unlocked: Welcome Aboard");
          }
        }
      });
    }
    else{
      console.log("The user has the achievement already!");
    }
  }

  async gameCompletionAchs(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    const currentUserCompletedList = userDoc?.get('completedList') as string[];
    this.userCompletedListCounter = currentUserCompletedList.length;
    //console.log(this.userCompletedListCounter);
    let fiveCompGameAchID = "";
    let tenCompGameAchID = "";
    let twentyCompGameAchID = "";
    for(let a of this.achievements){
      if(a.name === "Beginner Completionist"){
        fiveCompGameAchID = a.id;
      }
      if(a.name === "Intermediate Completionist"){
        tenCompGameAchID = a.id;
      }
      if(a.name === "Advanced Completionist"){
        twentyCompGameAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    // console.log(currUserId);
    // console.log(fiveCompGameAchID);
    // console.log(tenCompGameAchID);
    // console.log(twentyCompGameAchID);
    if(!currentUserAchievementList.includes(fiveCompGameAchID)){
        //Check and give five's ach
        if(this.userCompletedListCounter >= 5){
          const newAchievementList = [...currentUserAchievementList, fiveCompGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Beginner Completionist");
        }
    }
    else if(!currentUserAchievementList.includes(tenCompGameAchID)){
        //Check and give ten's ach
        if(this.userCompletedListCounter >= 10){
          const newAchievementList = [...currentUserAchievementList, tenCompGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Intermediate Completionist");
        }
    }
    else if(!currentUserAchievementList.includes(twentyCompGameAchID)){
      //Check and give twenty's ach
      if(this.userCompletedListCounter >= 20){
        const newAchievementList = [...currentUserAchievementList, twentyCompGameAchID];
        userDocRef.update({achievements: newAchievementList});
        this.toast.success("Achievement unlocked: Advanced Completionist");
      }
    }
    else{
      console.log("The user has all the achievements already!");
    }
  }

  async userLikedAchs(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    const currentUserLikedList = userDoc?.get('likedList') as string[];
    const currentUserDislikedList = userDoc?.get('dislikedList') as string[];
    this.userDislikedGameCounter = currentUserDislikedList.length;
    this.userLikedGameCounter = currentUserLikedList.length;
    console.log(this.userLikedGameCounter);
    let fiveLikedGameAchID = "";
    let fifteenLikedGameAchID = "";
    let tenLikedOrDisikedGameAchID = "";
    for(let a of this.achievements){
      if(a.name === "Avid Player"){
        fiveLikedGameAchID = a.id;
      }
      if(a.name === "Kind-hearted"){
        fifteenLikedGameAchID = a.id;
      }
      if(a.name === "Balanced Judgement"){
        tenLikedOrDisikedGameAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    console.log(currUserId);
    console.log(fiveLikedGameAchID);
    console.log(fifteenLikedGameAchID);
    if(!currentUserAchievementList.includes(fiveLikedGameAchID)){
        //Check and give five's ach
        if(this.userLikedGameCounter >= 5){
          const newAchievementList = [...currentUserAchievementList, fiveLikedGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Avid Player");
        }
    }
    else if(!currentUserAchievementList.includes(fifteenLikedGameAchID)){
        //Check and give ten's ach
        if(this.userLikedGameCounter >= 15){
          const newAchievementList = [...currentUserAchievementList, fifteenLikedGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Kind-hearted");
        }
    }
    else{
      console.log("The user has all the achievements already!");
    }
    if(!currentUserAchievementList.includes(tenLikedOrDisikedGameAchID)){
      //Check and give five's ach
      if(this.userLikedGameCounter + this.userDislikedGameCounter >= 10){
        const newAchievementList = [...currentUserAchievementList, tenLikedOrDisikedGameAchID];
        userDocRef.update({achievements: newAchievementList});
        this.toast.success("Achievement unlocked: Balanced Judgement");
      }
    }
  }

  async userDislikedAchs(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    const currentUserDislikedList = userDoc?.get('dislikedList') as string[];
    const currentUserLikedList = userDoc?.get('likedList') as string[];
    this.userLikedGameCounter = currentUserLikedList.length;
    this.userDislikedGameCounter = currentUserDislikedList.length;
    console.log(this.userLikedGameCounter);
    let fiveDislikedGameAchID = "";
    let fifteenDislikedGameAchID = "";
    let tenLikedOrDisikedGameAchID = "";
    for(let a of this.achievements){
      if(a.name === "Critical Eye"){
        fiveDislikedGameAchID = a.id;
      }
      if(a.name === "Tough Critic"){
        fifteenDislikedGameAchID = a.id;
      }
      if(a.name === "Balanced Judgement"){
        tenLikedOrDisikedGameAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    console.log(currUserId);
    console.log(fiveDislikedGameAchID);
    console.log(fifteenDislikedGameAchID);
    if(!currentUserAchievementList.includes(fiveDislikedGameAchID)){
        //Check and give five's ach
        if(this.userDislikedGameCounter >= 5){
          const newAchievementList = [...currentUserAchievementList, fiveDislikedGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Critical Eye");
        }
    }
    else if(!currentUserAchievementList.includes(fifteenDislikedGameAchID)){
        //Check and give ten's ach
        if(this.userDislikedGameCounter >= 15){
          const newAchievementList = [...currentUserAchievementList, fifteenDislikedGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Tough Critic");
        }
    }
    else{
      console.log("The user has all the achievements already!");
    }
    if(!currentUserAchievementList.includes(tenLikedOrDisikedGameAchID)){
      //Check and give five's ach
      if(this.userLikedGameCounter + this.userDislikedGameCounter >= 10){
        const newAchievementList = [...currentUserAchievementList, tenLikedOrDisikedGameAchID];
        userDocRef.update({achievements: newAchievementList});
        this.toast.success("Achievement unlocked: Balanced Judgement");
      }
    }
  }

  async userFollowedUserAchs(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    const currentUserFollowedList = userDoc?.get('followedList') as string[];
    this.userFollowedListCounter = currentUserFollowedList.length;
    console.log(this.userFollowedListCounter);
    let firstFollowedAchID = "";
    let fifteenFollowedAchID = "";
    for(let a of this.achievements){
      if(a.name === "First Follower"){
        firstFollowedAchID = a.id;
      }
      if(a.name === "Friendly Networker"){
        fifteenFollowedAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    console.log(currUserId);
    console.log(firstFollowedAchID);
    console.log(fifteenFollowedAchID);
    if(!currentUserAchievementList.includes(firstFollowedAchID)){
        //Check and give five's ach
        if(this.userFollowedListCounter != 0){
          const newAchievementList = [...currentUserAchievementList, firstFollowedAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: First Follower");
        }
    }
    else if(!currentUserAchievementList.includes(fifteenFollowedAchID)){
        //Check and give ten's ach
        if(this.userFollowedListCounter >= 15){
          const newAchievementList = [...currentUserAchievementList, fifteenFollowedAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Friendly Networker");
        }
    }
    else{
      console.log("The user has all the achievements already!");
    }
  }
  async userPlanGameAchs(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    const currentUserPlanList = userDoc?.get('planList') as string[];
    this.userPlanListCounter = currentUserPlanList.length;
    console.log(this.userPlanListCounter);
    let fivePlannedGameAchID = "";
    let tenPlannedGameAchID = "";
    for(let a of this.achievements){
      if(a.name === "Planner"){
        fivePlannedGameAchID = a.id;
      }
      if(a.name === "Strategist"){
        tenPlannedGameAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    console.log(currUserId);
    console.log(fivePlannedGameAchID);
    console.log(tenPlannedGameAchID);
    if(!currentUserAchievementList.includes(fivePlannedGameAchID)){
        //Check and give five's ach
        if(this.userPlanListCounter >= 5){
          const newAchievementList = [...currentUserAchievementList, fivePlannedGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Planner");
        }
    }
    else if(!currentUserAchievementList.includes(tenPlannedGameAchID)){
        //Check and give ten's ach
        if(this.userPlanListCounter >= 10){
          const newAchievementList = [...currentUserAchievementList, tenPlannedGameAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Strategist");
        }
    }
    else{
      console.log("The user has all the achievements already!");
    }
  }
  async userFollowerAchs(){
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    //User's achievements list
    const currentUserAchievementList = userDoc?.get('achievements') as string[];
    const currentUserFollowerList = userDoc?.get('followerList') as string[];
    this.userFollowerListCounter = currentUserFollowerList.length;
    console.log(this.userFollowerListCounter);
    let firstFollowerAchID = "";
    let tenFollowerAchID = "";
    for(let a of this.achievements){
      if(a.name === "Socialite"){
        firstFollowerAchID = a.id;
      }
      if(a.name === "Popular"){
        tenFollowerAchID = a.id;
      }
    }
    let currUserId = await this.userService.getUserId();
    console.log(currUserId);
    console.log(firstFollowerAchID);
    console.log(tenFollowerAchID);
    if(!currentUserAchievementList.includes(firstFollowerAchID)){
        //Check and give five's ach
        if(this.userFollowerListCounter != 0){
          const newAchievementList = [...currentUserAchievementList, firstFollowerAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Socialite");
        }
    }
    else if(!currentUserAchievementList.includes(tenFollowerAchID)){
        //Check and give ten's ach
        if(this.userFollowerListCounter >= 10){
          const newAchievementList = [...currentUserAchievementList, tenFollowerAchID];
          userDocRef.update({achievements: newAchievementList});
          this.toast.success("Achievement unlocked: Popular");
        }
    }
    else{
      console.log("The user has all the achievements already!");
    }
  }

  ngOnDestroy(): void {
    this.subrscription1?.unsubscribe();
    this.subrscription2?.unsubscribe();
  }
}
