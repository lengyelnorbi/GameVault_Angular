import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/shared/game/game.module';
import { GameService } from 'src/app/shared/game/game.service';
import { UserService } from 'src/app/shared/user/user.service';
import { format } from 'date-fns';
import { CommentService } from 'src/app/shared/comment/comment.service';
import { Comment } from 'src/app/shared/comment/comment.module';
import { User } from 'src/app/shared/user/user.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { AchievementService } from 'src/app/shared/achievement/achievement.service';
import { Subscription, map } from 'rxjs';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-game-profile-page',
  templateUrl: './game-profile-page.component.html',
  styleUrls: ['./game-profile-page.component.scss']
})
export class GameProfilePageComponent implements OnInit, OnDestroy {
  
  gameData: Game = {} as Game;
  percent: any;
  gameID: String;
  comments: Array<Comment>;
  lista: User[];
  currentUserPfp : string;
  trailerUrl: any;

  completedListSum: number = 0;
  plannedListSum: number = 0;
  likedListSum: number = 0;
  dislikedListSum: number = 0;
  usersSum: number = 0;
  below = LegendPosition.Below;

  subscription1?: Subscription;
  subscription2?: Subscription;
  subscription3?: Subscription;
  subscription4?: Subscription;
  subscription5?: Subscription;
  subscription6?: Subscription;

  selectedSort: string = "";
  selectedOrder: string = "default";

  sortingList: string[] = ['Liked Quantity', 'Dislike Quantity', 'Release Date'];

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    public userService : UserService,
    public commentService: CommentService,
    public auth : AngularFireAuth,
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer,
    private achService: AchievementService) {}

  ngOnInit() {
    
    this.auth.authState.subscribe(async (user) => {
      if (user) {
        await this.getUserPfp();
        await this.getUsers();
        await this.getChartForGame();
      }
    }); 
  }

  getCommentsLength(): number {
    return this.comments ? this.comments.length : 0;
  }

  getChartForGame(){
    this.completedListSum = 0;
    this.plannedListSum = 0;
    this.likedListSum = 0;
    this.dislikedListSum = 0;
    this.usersSum = 0;
    
    const gettingID = this.route.paramMap.subscribe(params => {
      const currID = params.get('id') as string;
      this.gameID = currID;
    });
    console.log("Ez a game ID-ja: " + this.gameID);
    
    this.subscription6 =  this.gameService.getGameById(this.gameData.id).subscribe(doc => {
      const game = doc.data() as Game;
      if (doc.exists && game) {
        this.likedListSum = game.likeCount;
        this.dislikedListSum = game.dislikeCount;
      }
    })

    this.afs.collection('user').get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const completedList = doc.get('completedList');
        if(completedList && completedList.includes(this.gameID)){
          this.completedListSum++;
        }
      });
      console.log("Number of users who have completed this game: " + this.completedListSum);
    });

    this.afs.collection('user').get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const plannedList = doc.get('planList');
        if(plannedList && plannedList.includes(this.gameID)){
          this.plannedListSum++;
        }
      });
      console.log("Number of users who have planned this game: " + this.plannedListSum);
    });

    this.subscription1 = this.route.paramMap.subscribe(params => {
      const id = params.get('id') as string;
      this.gameService.getGameById(id).subscribe(doc => {
        const game = doc.data() as Game;
        if(doc.exists && game){
          this.likedListSum = game.likeCount;
          this.dislikedListSum = game.dislikeCount;
        }
        console.log("Number of users who have liked this game: " + this.likedListSum);
        console.log("Number of users who have disliked this game: " + this.dislikedListSum);
      });
    })

    this.afs.collection('user').get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const users = doc.get('username');
        if(users){
          this.usersSum++;
        }
      });
      console.log("Number of users on the site: " + this.usersSum);
    });
  }

  makeChartForGame()
  {
    const c = this.completedListSum;
    const p = this.plannedListSum;
    const u = this.usersSum;
    
    return [
      {
        name: 'Completed',
        value: c as number,
      },
      {
        name: 'Planned',
        value: p as number
      },
      {
        name: 'Neither',
        value: (u - c - p) as number
      }
    ];
  }

  makeChartForGame2()
  {
    const l = this.likedListSum;
    const d = this.dislikedListSum;

    return [
      {
        name: 'Likes',
        value: l as number
      },
      {
        name: 'Dislikes',
        value: d as number
      }
    ];
  }
  
  getUserPfp() {
    this.subscription5 = this.auth.authState.subscribe(async (user) => {
      if (user) {
        const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
        const userDoc = await userDocRef.get().toPromise();
        this.currentUserPfp = userDoc?.get('pfpUrl');
      }
    });
  }
  private getComments(){
    this.commentService.getCommentsByGameID(this.gameID)
    .toPromise()
    .then(
      comments => {
        console.log(comments);
        if (comments) {
          this.comments = comments.map((comment) => new Comment(comment,this.lista.find((user: User)=>user.id == comment.userID)));
          console.log(this.comments);
        }},
      error => console.error(error)
    );
    
    this.sortingComments();
  }
  private getUsers()
  {

    this.subscription1 = this.route.paramMap.subscribe(params => {
      const id = params.get('id') as string;
      this.gameID = id;
      console.log(id);
      this.gameService.getGameById(id).subscribe(doc => {
        const game = doc.data() as Game;
        if (doc.exists && game) {
          this.gameData.name = game.name;
          this.gameData.category = game.category;
          this.gameData.description = game.description;
          this.gameData.imageUrl = game.imageUrl;
          this.gameData.studio = game.studio;
          this.gameData.releaseDate = game.releaseDate;
          this.gameData.platforms = game.platforms;
          this.gameData.likeCount = game.likeCount;
          this.gameData.dislikeCount = game.dislikeCount;
          this.gameData.trailer = game.trailer;
          this.gameData.id = id;
          this.percent = Math.floor((this.gameData.likeCount / (this.gameData.likeCount + this.gameData.dislikeCount)) * 100);

          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${this.sanitizer.sanitize(SecurityContext.URL, this.gameData.trailer)}`);

          console.log(this.gameData)
          this.likedListSum = this.gameData.likeCount;
          this.dislikedListSum = this.gameData.dislikeCount;
        } else {
          console.log('No such game!');
        }
      });
    });

    this.subscription2 = this.userService.getItems("email", "asc").subscribe(actionArray => {
      
      this.lista = actionArray.map(i =>{
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
          username: data.username,
          pfpUrl: data.pfpUrl,
        } as unknown as User;
      })
      this.getComments();
    });
  }

  

  parseList(input: string[]): string {
    if (input && Array.isArray(input)) {
      const colonedList = input.join(", ");
      return colonedList;
    }
    return '';
  }

  checkIfCompletedGame(game: Game): boolean
  {
    if(this.userService.usersGames.includes(game.id))
    {
      return true;
    }
    return false;
  }

  async addNewGameToCompletedList()
  {
    await this.userService.addGameToPlayed(this.gameData.id);
    this.achService.gameCompletionAchs();
  }

  async likeGame(){
    await this.userService.likeGame(this.gameData.id);
    
    this.achService.userLikedAchs();

    this.subscription3 =  this.gameService.getGameById(this.gameData.id).subscribe(doc => {
      const game = doc.data() as Game;
      if (doc.exists && game) {
        this.gameData.likeCount = game.likeCount;
        this.gameData.dislikeCount = game.dislikeCount;

        const likeBtn = document.querySelector('.like-btn');
        const dislikeBtn = document.querySelector('.dislike-btn');
        if (likeBtn && dislikeBtn) {
          likeBtn.classList.add('yellow');
          dislikeBtn.classList.remove('yellow')
        }

        this.percent = Math.floor((this.gameData.likeCount / (this.gameData.likeCount + this.gameData.dislikeCount)) * 100);
      } else {
        console.log('No such game!');
      }
    })
    
  }

  async dislikeGame(){
    await this.userService.dislikeGame(this.gameData.id);

    this.achService.userDislikedAchs();

    this.subscription4 = this.gameService.getGameById(this.gameData.id).subscribe(doc => {
      const game = doc.data() as Game;
      if (doc.exists && game) {
        this.gameData.likeCount = game.likeCount;
        this.gameData.dislikeCount = game.dislikeCount;

        const likeBtn = document.querySelector('.like-btn');
        const dislikeBtn = document.querySelector('.dislike-btn');
        if (likeBtn && dislikeBtn) {
          likeBtn.classList.remove('yellow');
          dislikeBtn.classList.add('yellow')
        }

        this.percent = Math.floor((this.gameData.likeCount / (this.gameData.likeCount + this.gameData.dislikeCount)) * 100);
      } else {
        console.log('No such game!');
      }
    }
    )
  }

  newCommentForm = new FormGroup({
    content: new FormControl('',
    [Validators.required])
  })

  async postNewComment() {
    await this.userService.getUserId().then(uid => {

      let data = {
        'commentID': "commentID" as String,
        'content': this.newCommentForm.value.content as String,
        'date': format(new Date(), 'yyyy-MM-dd') as String,
        'gameID': this.gameID as String,
        'userID': uid as String
      };
  
      console.log(data);
      this.commentService.uploadComment(data);
        
    }).then(e => {

      this.commentService.getCommentsByGameID(this.gameID)
      .toPromise()
      .then(
        comments => {
          console.log(comments);
          if (comments) {
            this.comments = comments;
            this.ngOnInit();
          }},
        error => console.error(error)
      );

    })
    this.achService.firstCommentAch();
  }

  onSortSelected(sort: any){
    this.selectedSort = sort;
    this.sortingComments();
  }

  onOrderSelected(order: any){
    this.selectedOrder = order;
    this.sortingComments();
  }

  sortingComments(){
    if(this.selectedOrder === "ascending"){
      switch(this.selectedSort) { 
        case "Release Date": {
          console.log("Date Asc");
          this.comments?.sort((a, b) => a.date.localeCompare(b.date.toString()));
           break; 
        } 
        case "Liked Quantity": { 
          console.log("Liked Asc");
          // this.comments?.sort((a, b) => a.likeCount - b.likeCount);
           break; 
        }
        case "Dislike Quantity": {
          console.log("Dislike Asc"); 
          // this.comments?.sort((a, b) => a.dislikeCount - b.dislikeCount);
          break; 
        }
        default: { 
          console.log("Date Asc");
          this.comments?.sort((a, b) => a.date.localeCompare(b.date.toString()));
          break; 
        } 
      }
    }
    else if(this.selectedOrder === "descending"){
      switch(this.selectedSort) { 
        case "Liked Quantity": { 
          console.log("Liked Desc");
          // this.comments?.sort((a, b) => b.likeCount - a.likeCount);
           break; 
        }
        case "Dislike Quantity": {
          console.log("Dislike Desc"); 
          // this.comments?.sort((a, b) => b.dislikeCount - a.dislikeCount);
          break; 
        }
        case "Release Date": { 
          console.log("Date Desc");
          this.comments?.sort((a, b) => b.date.localeCompare(a.date.toString()));
          break; 
        }
        default: { 
          console.log("Date Desc");
          this.comments?.sort((a, b) => b.date.localeCompare(a.date.toString()));
          break; 
        } 
      }
    }
    else if(this.selectedOrder === "default"){
      switch(this.selectedSort) { 
        case "Liked Quantity": { 
          console.log("Liked Desc");
          // this.comments?.sort((a, b) => b.likeCount - a.likeCount);
           break; 
        }
        case "Dislike Quantity": {
          console.log("Dislike Desc"); 
          // this.comments?.sort((a, b) => b.dislikeCount - a.dislikeCount);
          break; 
        }
        case "Release Date": { 
          console.log("Date Desc");
          this.comments?.sort((a, b) => b.date.localeCompare(a.date.toString()));
          break; 
        }
        default: { 
          console.log("Date Desc");
          this.comments?.sort((a, b) => b.date.localeCompare(a.date.toString()));
          break; 
        } 
      }
    }
  }

  sanitizeHtml(id: string): SafeResourceUrl  {
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube-nocookie.com/embed/" + id);
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
    this.subscription2?.unsubscribe();
    this.subscription3?.unsubscribe();
    this.subscription4?.unsubscribe();
    this.subscription5?.unsubscribe();
  }

  isOverviewShown: boolean = true;
  isStatsShown: boolean = false;
  selectedButton: string = 'overview';
  
  showOverview() {
    this.isOverviewShown = true;
    this.isStatsShown = false;
    this.selectedButton = 'overview';
  }
  
  showStats() {
    this.isOverviewShown = false;
    this.isStatsShown = true;
    this.selectedButton = 'stats';
  }

}