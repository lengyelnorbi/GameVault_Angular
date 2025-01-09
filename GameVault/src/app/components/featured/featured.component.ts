import { Component, OnDestroy } from '@angular/core';
import { Game } from 'src/app/shared/game/game.module';
import { GameService } from 'src/app/shared/game/game.service';
import { DocumentChangeAction, AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from 'src/app/shared/user/user.service';
import { Subscription } from 'rxjs';


import { ChangeDetectorRef, NgZone, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required components
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper';
import { BehaviorSubject } from "rxjs";
import Swiper from "swiper/types/swiper-class";

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnDestroy {

  @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

  show: boolean;
  thumbs: any;
  slides$ = new BehaviorSubject<string[]>(['']);

  gameList: Game[] = [];

  gameUpcomingList: Game[] = [];
  gameRecentlyReleasedList: Game[] = [];
  currentDate = new Date();
  recommendedList: Game[] = [];

  user$ = this.authService.currentUser$;

  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;

  constructor(private ngZone: NgZone,private gameService: GameService, public authService: AuthenticationService, private userService: UserService, private afs : AngularFirestore ){}

  ngOnInit() : void {
    this.getTopRatedGames();  
    this.getUpcomingGames();
    this.getRecentlyReleased();
    this.getRecommendedGames();
  }


//------
  getTopRatedGames() : void{
    this.subscription1 = this.gameService.getTopRatedGames("likeCount", "desc").subscribe({
      next:(game: DocumentChangeAction<unknown>[]) =>  
      {
        this.gameList = game.map(g=>new Game({...g.payload.doc.data() as Game, id: g.payload.doc.id}));
      }
    })
  }

  getUpcomingGames(): void {
    this.subscription2 = this.gameService.getUpcomingGames().subscribe({
      next:(game: DocumentChangeAction<unknown>[]) =>  
      {
        this.gameUpcomingList = game.map(g=>new Game({...g.payload.doc.data() as Game, id: g.payload.doc.id}));
      }
    })
  }

  getRecentlyReleased(): void {
    this.subscription3 = this.gameService.getRecentlyReleased("releaseDate", "desc").subscribe({
      next:(game: DocumentChangeAction<unknown>[]) =>  
      {
        this.gameRecentlyReleasedList = game.map(g=>new Game({...g.payload.doc.data() as Game, id: g.payload.doc.id}));
      }
    })
  }

  async getRecommendedGames(): Promise<void> {
    this.subscription4 = this.gameService.getGames("name", "desc").subscribe({
      next: async (games: DocumentChangeAction<unknown>[] = []) => {
        let userFavCateg: String[] = await this.getUserFavCategories();
        const userLiked = await this.getLikedGames();
        const userPlayed = await this.getPlayedGames();
        const userDisliked = await this.getDislikedGames();
        const considereg = await this.consideredGames(userPlayed, userFavCateg);
        var j = Math.ceil(considereg.size / 2);
        var i = 0
        for (let [key, value] of considereg.entries()) {
          if (i === j) {
            break;
          } else {
            userFavCateg.push(key);
            i++;
          }
        }    

        const tmp: Game[] = games.map(g=>new Game({...g.payload.doc.data() as Game, id: g.payload.doc.id}));
        this.recommendedList = tmp.filter(game => {
          const foundInLiked = userLiked.some(liked => liked.id === game.id);
          const foundInPlayed = userPlayed.some(played => played.id === game.id);
          const foundInDisliked = userDisliked.some(disliked => disliked.id === game.id);
          const numCategoriesToMatch = 2;
          const foundInFavCategandconsdigereg = game.category.filter(cat => userFavCateg.includes(cat)).length >= numCategoriesToMatch;
          if (userFavCateg.length == 0) {
            return !foundInLiked && !foundInPlayed && !foundInDisliked
          }
          

          return !foundInLiked && !foundInPlayed && !foundInDisliked && foundInFavCategandconsdigereg;
        });
      },
      error: (error) => {
        console.error('Error fetching games', error);
      }
    });
  }
  

  async consideredGames(userplayed:  Game[], userFavCateg: String[]) {
   let likedCategory = new Map();
   for (let index = 0; index < userplayed.length; index++) {
    for (let jndex = 0; jndex < userplayed[index].category.length; jndex++) {
      if (likedCategory.has(userplayed[index].category[jndex])) {
        likedCategory.set(userplayed[index].category[jndex], likedCategory.get(userplayed[index].category[jndex]) + 1)
      } else {
        likedCategory.set(userplayed[index].category[jndex], 1)
      }
   }
  }
  const sorted = new Map([...likedCategory].sort((a, b) => b[1] - a[1]))
   
  if(userFavCateg.length !== 0) {
    userFavCateg.forEach(element => {
      if (sorted.has(element)) {
        sorted.delete(element)
      }
    });
    }
    return sorted;
  }
  
  async getDislikedGames() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const currentDislikedList = await userDoc?.get('dislikedList') as string[];
    const DislikedGames: Game[] = [];
  
    const promises = currentDislikedList.map(id =>
      new Promise<Game>((resolve) => {
        this.gameService.getGameById(id).subscribe(doc => {
          const game = doc?.data() as Game;
          if (game) {
            game.id = id;
            resolve(game);
          }
        })
      })
    );
  
    return Promise.all(promises);
  }
  
  
 
  
  calculate(data: string){
    let date = new Date(data);
    let days = Math.ceil((date.getTime() - this.currentDate.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }

  async getUserFavCategories()
  {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const userFavCategoriesList = userDoc?.get('favoriteCategory') as string[];
    return userFavCategoriesList || [];
  }

  async getLikedGames() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const currentLikedList = await userDoc?.get('likedList') as string[];
    const LikedGames: Game[] = [];

    currentLikedList.map(id => {
      this.gameService.getGameById(id).subscribe(doc => {
        if (doc.exists) {
          const game = doc.data() as Game;
          game.id = id;
          LikedGames.push(game);
        }
      })
    });
    return LikedGames
  }

  async getPlayedGames() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const currentLikedList = await userDoc?.get('completedList') as string[];
    const PlayedGames: Game[] = [];
    currentLikedList.map(id => {
      this.gameService.getGameById(id).subscribe(doc => {
        if (doc.exists) {
        const game = doc.data() as Game;
        game.id = id;
        PlayedGames.push(game);
        }
      })
    });
    return PlayedGames
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
}
