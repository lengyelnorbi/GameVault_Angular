import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AchievementService } from 'src/app/shared/achievement/achievement.service';
import { Game } from 'src/app/shared/game/game.module';
import { GameService } from 'src/app/shared/game/game.service';
import { User } from 'src/app/shared/user/user.module';
import { UserService } from 'src/app/shared/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnDestroy {
  likedGames: Game[] = [];
  dislikedGames: Game[] = [];
  playedGames: Game[] = [];
  favoriteCategs: string[];
  favoriteGames: string[];
  favoriteStudios: string[];
  planList:  Game[] = [];
  followerList: string[];
  followedList: string[];
  users: User[] = [];
  showUsernames = false;
  showFollowedUsernames = false;
  showFollowerUsernames = false;
  chartShowBool = false;
  
  currId: string;
  username: string;
  bio: string;

  onWhosePage: string;
  currCheckHelper: string;
  currCheck: boolean = false;
  currUserEmail: string;
  shouldShowFollowButton: boolean = true;

  subscription1?: Subscription;
  subscription2?: Subscription;
  subscription3?: Subscription;
  subscription4?: Subscription;

  constructor( private afs: AngularFirestore, 
    private userService: UserService, 
    private gameService: GameService,
    private route: ActivatedRoute,
    private auth: AngularFireAuth,
    private achService: AchievementService) {
      this.auth.authState.subscribe(async (user) => {
        if (user) {
          this.likedGames = [];
          this.dislikedGames = [];
          this.playedGames = [];
          this.favoriteCategs = [];
          this.favoriteStudios = [];
          this.planList = [];
          this.favoriteGames = [];
          this.currUserEmail = this.userService.getCurrUserEmailString();
          console.log(this.currUserEmail);
        }
      });
    }
    

  ngOnInit() {      
    this.subscription1 = this.route.paramMap.subscribe(params => {
      this.currId = params.get('id') as string;
      if(!this.currId){
        this.userService.getCurrentUserId().then((result: string | undefined) => {
          const myString: string = result || '';
          this.currId = myString;
          console.log(this.currId);
          
          this.currUserEmail = this.userService.getCurrUserEmailString();
          console.log(this.currUserEmail);

          const currRoute = this.route.snapshot.url.join('/profile');
          console.log('route: ' + currRoute);
          if(currRoute === 'profile'){ this.shouldShowFollowButton = false; }

          this.chartShowBool = false;
          this.getUsernames();
          this.getFollowedUsernames();
          this.getUserFavCategories();
          this.getUserFavStudios();
          this.getUsername();
          this.getPfp();
          this.getBackground();
          this.getLikedGames();
          this.getDislikedGames();
          this.getPlayedGames();
          this.getBio();
          this.getPlanList();
          this.getFollow();
          this.favoriteGamesName();
          this.toggleUsernames();
          this.toggleFollowedUsernames();
          this.toggleFollowerUsernames();
        });
      } else {
        console.log(this.currId);
        
        this.currUserEmail = this.userService.getCurrUserEmailString();
        console.log(this.currUserEmail);

        const currRoute = this.route.snapshot.url.join('/profile');
        if(currRoute === 'profile'){ this.shouldShowFollowButton = false; }

        this.chartShowBool = false;
        this.getUsernames();
        this.getFollowedUsernames();
        this.getUserFavCategories();
        this.getUserFavStudios();
        this.getUsername();
        this.getPfp();
        this.getBackground();
        this.getLikedGames();
        this.getDislikedGames();
        this.getPlayedGames();
        this.getBio();
        this.getPlanList();
        this.getFollow();
        this.toggleUsernames();
        this.toggleFollowedUsernames();
        this.toggleFollowerUsernames();
      }
    });
  }

  changeChartBool() {
    this.chartShowBool = !this.chartShowBool;
  }

  unfollowText: string = "Followed";
  unfollowTextChange(newText: string){
    this.unfollowText = newText;
  }
  
  showFollowFlag: {[id: string]: boolean} = {};

  showFollow(user: User){
    this.showFollowFlag[user.id] = true;
  }

  hideFollow(user: User){
    this.showFollowFlag[user.id] = false;
  }

  async favoriteGamesName() {
    await this.userService.getUserfavList();
    this.userService.usersFavList.forEach(id => this.gameService.getGameById(id).subscribe(doc => {
      const game = doc.data() as Game;
        game.id = id;
        this.favoriteGames.push(game.name);
    }))
  }

  followedPersonCheck(): boolean
  {
    this.onWhosePage = '';
    this.subscription2 = this.route.paramMap.subscribe(params => {
      this.onWhosePage = params.get('id') as string;})
    this.userService.currUserId = this.onWhosePage;
    return this.userService.usersFollowedList.includes(this.onWhosePage);
  }

  async addToFollowed(event: MouseEvent)
  {
    event.stopPropagation();
    console.log("Button clicked for this userID: " + this.onWhosePage);
    await this.userService.followedPerson(this.onWhosePage);
    this.achService.userFollowedUserAchs();
  }

  reloadscript()
  {
    location.reload();
  }

  toggleUsernames() {
    this.showUsernames = true;
    if (this.showUsernames) {
      this.getUsernames();
    }
  }

  toggleFollowedUsernames(){
    this.showFollowedUsernames = true;
    if(this.showFollowedUsernames) {
      this.getFollowedUsernames();
    }
  }

  toggleFollowerUsernames(){
    this.showFollowerUsernames = true;
    if(this.showFollowerUsernames) {
      this.getFollowerUsernames();
    }
  }

  getUsernames() {   
    this.subscription3 = this.userService.getItems("email", "asc").subscribe(actionArray => {
      
      this.users = actionArray.map(i =>{
        const data = i.payload.doc.data() as User
        return {
          id: i.payload.doc.id,
          email: data.email,
          bio: data.bio,
          completedList: data.completedList,
          dislikedList: data.dislikedList,
          isBanned: data.isBanned,
          likedList: data.likedList,
          planList: data.planList,
          followerList: data.followerList,
          followedList: data.followedList,
          username: data.username,
          pfpUrl: data.pfpUrl,
          backgroundUrl: data.backgroundUrl,
        } as unknown as User;
      })
    
    });
  }

  getFollowedUsernames() {   
    this.subscription3 = this.userService.getItems("email", "asc").subscribe(actionArray => {
      
      this.users = actionArray.map(i =>{
        const data = i.payload.doc.data() as User
        return {
          id: i.payload.doc.id,
          email: data.email,
          bio: data.bio,
          completedList: data.completedList,
          dislikedList: data.dislikedList,
          isBanned: data.isBanned,
          likedList: data.likedList,
          planList: data.planList,
          followerList: data.followerList,
          followedList: data.followedList,
          username: data.username,
          pfpUrl: data.pfpUrl,
          backgroundUrl: data.backgroundUrl,
        } as unknown as User;
      })
    
    });
  }

  getFollowerUsernames() {   
    this.subscription3 = this.userService.getItems("email", "asc").subscribe(actionArray => {
      
      this.users = actionArray.map(i =>{
        const data = i.payload.doc.data() as User
        return {
          id: i.payload.doc.id,
          email: data.email,
          bio: data.bio,
          completedList: data.completedList,
          dislikedList: data.dislikedList,
          isBanned: data.isBanned,
          likedList: data.likedList,
          planList: data.planList,
          followerList: data.followerList,
          followedList: data.followedList,
          username: data.username,
          pfpUrl: data.pfpUrl,
          backgroundUrl: data.backgroundUrl,
        } as unknown as User;
      })
    
    });
  }

  async getFollow(){
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    this.followerList = userDoc?.get('followerList');
    this.followedList = userDoc?.get('followedList');
  }

  async getUsername() {
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    this.username = userDoc?.get('username');
  }

  async getBio() {
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    this.bio = userDoc?.get('bio');
  }

  async getPfp() {
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const pfpUrl = userDoc?.get('pfpUrl');
    const profilePic = document.getElementById("profile-pic") as HTMLImageElement;
    profilePic.src = pfpUrl ? pfpUrl : "https://cdn.discordapp.com/attachments/884468391014969424/1092011707737591931/image.png";
  }

  async getBackground() {
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const backgroundUrl = userDoc?.get('backgroundUrl');
    const headerSection = document.querySelector('.header-section') as HTMLElement;
  
    if (backgroundUrl) {
      headerSection.style.backgroundImage = `url(${backgroundUrl})`;
    } else {
      headerSection.style.backgroundImage = 'url(https://mangadigest.files.wordpress.com/2018/10/wp-1540653647844-462018501.jpeg)';
    }
  }
  
  async getLikedGames() {
    this.likedGames = [];
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const currentLikedList = await userDoc?.get('likedList') as string[];
    
    currentLikedList.map(id => {
      this.gameService.getGameById(id).subscribe(doc => {
        const game = doc.data() as Game;
        game.id = id;
        this.likedGames.push(game);
      })
    });
  }

  async getDislikedGames() {
    this.dislikedGames = [];
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const currentDislikedList = await userDoc?.get('dislikedList') as string[];
    
    currentDislikedList.map(id => {
      this.gameService.getGameById(id).subscribe(doc => {
        const game = doc.data() as Game;
        game.id = id;
        this.dislikedGames.push(game);
      })
    });
  }

  async getPlayedGames() {
    this.playedGames = [];
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const currentLikedList = await userDoc?.get('completedList') as string[];
    
    currentLikedList.map(id => {
      this.gameService.getGameById(id).subscribe(doc => {
        const game = doc.data() as Game;
        game.id = id;
        this.playedGames.push(game);
      })
    });
  }

  async getUserFavCategories()
  {
    this.favoriteCategs = [];
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const userFavCategoriesList = userDoc?.get('favoriteCategory') as string[];
    this.favoriteCategs = userFavCategoriesList;
  }

  async getUserFavStudios(){
    this.favoriteStudios = [];
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const userFavStudiosList = userDoc?.get('favoriteStudio') as string[];
    this.favoriteStudios = userFavStudiosList;
  }

  async getPlanList(){
    this.planList = [];
    const userDocRef = this.afs.collection("user").doc(this.currId);
    const userDoc = await userDocRef.get().toPromise();
    const currentPlanList = await userDoc?.get('planList') as string[];

    currentPlanList.map(id => {
      this.gameService.getGameById(id).subscribe(doc => {
        const game = doc.data() as Game;
        game.id = id;
        this.planList.push(game);
      })
    });
  }


  parseList(input: string[]): string {
    if (input && Array.isArray(input)) {
      const colonedList = input.join(", ");
      return colonedList;
    }
    return '';
  }

  isOverviewShown: boolean = true;
  isListShown: boolean = false;
  isSocialShown: boolean = false;
  selectedButton: string = 'overview';
  
  showOverview() {
    this.isOverviewShown = true;
    this.isListShown = false;
    this.isSocialShown = false;
    this.selectedButton = 'overview';
  }
  
  showList() {
    this.isOverviewShown = false;
    this.isListShown = true;
    this.isSocialShown = false;
    this.selectedButton = 'list';
  }
  
  showSocial() {
    this.isOverviewShown = false;
    this.isListShown = false;
    this.isSocialShown = true;
    this.selectedButton = 'social';
  }
  
  showLiked: boolean = false;
  showDisliked: boolean = false;
  showCompleted: boolean = true;
  showPlan: boolean = false;
  
  showLikedGames() {
    this.showLiked = true;
    this.showDisliked = false;
    this.showCompleted = false;
    this.showPlan = false;
  }
  
  showDislikedGames() {
    this.showLiked = false;
    this.showDisliked = true;
    this.showCompleted = false;
    this.showPlan = false;
  }
  
  showCompletedGames() {
    this.showLiked = false;
    this.showDisliked = false;
    this.showCompleted = true;
    this.showPlan = false;
  }
  
  showPlanToPlayGames() {
    this.showLiked = false;
    this.showDisliked = false;
    this.showCompleted = false;
    this.showPlan = true;
  }

  
  onImageError(event: Event) {
    const image = event.target as HTMLImageElement;
    image.setAttribute('src', 'https://cdn.discordapp.com/attachments/884468391014969424/1092011707737591931/image.png');
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
    this.subscription2?.unsubscribe();
    this.subscription3?.unsubscribe();
  }

  makeLikeDislikeStats() {
    const likes = this.likedGames.length;
    const dislikes = this.dislikedGames.length;

    return [
      {
        name: 'Liked',
        value: likes as number
      },
      {
        name: 'Disliked',
        value: dislikes as number
      }
    ];
  }

  makeStatusStats() {
    const played = this.playedGames.length;
    const planned = this.planList.length;

    return [
      {
        name: 'Played',
        value: played as number
      },
      {
        name: 'Planned',
        value: planned as number
      }
    ];
  }

  makeCategoriesStats() {
    let data = new Map<string, number>();
  
    this.playedGames.forEach(game => {
      game.category.forEach(categ => {
        if (data.has(categ)) {
          data.set(categ, data.get(categ)! + 1);
        } else {
          data.set(categ, 1);
        }
      });
    });

    console.log("DATA: ")
    console.log(data);

    let arr = Array.from(data.entries()).map(([name, value]) => ({ name, value }));
    console.log("ARR: ")
    console.log(arr);
  
    return arr;

    return [
      {
        name: 'asd',
        value: 3 as number
      },
      {
        name: 'fgh',
        value: 6 as number
      }
    ];
  }
}
