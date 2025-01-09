import { Component, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Game } from 'src/app/shared/game/game.module';
import { GameService } from 'src/app/shared/game/game.service';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AnimationService } from 'src/app/services/animation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  /** Based on the screen size, switch from standard to one column per row */
  subscription?: Subscription;


  constructor(private breakpointObserver: BreakpointObserver, private gameService: GameService, private anim: AnimationService) {

  }

  gameList: Game[] = [];
  counter: number;
  userCount: number;
  gamesCount: number;

  ngOnInit(): void{
    this.getGamesInSlide();
    this.counter = 7;
    this.gameService.getUsersCount().subscribe(count => {
      this.userCount = count;
    });
    this.gameService.getGamesCount().subscribe(count => {
      this.gamesCount = count;
    });
    console.log(this.gamesCount);
    console.log(this.userCount);
}
  animate()
  {
    this.anim.animate=true;
    console.log(this.anim.animate);
  }
  getGamesInSlide(): void {
    this.subscription = this.gameService.getGamesIntoSlide("name", "asc").subscribe({
      next:(game: DocumentChangeAction<unknown>[]) =>  
      {
        this.gameList = game.map(g=>new Game({...g.payload.doc.data() as Game, id: g.payload.doc.id}));
      }
    })   
  }

  getCounter(): number {
    return this.counter;
  }

  changeCounter(num : number) {
    if((this.counter + num) < 7 ){
      return;
    }
    
    this.counter += num;
    console.log(this.counter);
  }

  prepEnd() : void {
    const lastSeven = this.gameList.slice(-1);
    this.gameList.splice(-1);
    this.gameList.unshift(...lastSeven);
  }

  appEnd() : void {
    const firstSeven = this.gameList.slice(1);
    this.gameList.splice(1);
    this.gameList.unshift(...firstSeven);
  }

  isOnLeft = false;
  moveDiv() {
    var container = document.querySelector(".move-me");
    var movingText = document.getElementById("text-to-change");
    var movingBtn = document.querySelector(".move-button");
    
    var loginContent = document.querySelector(".login-content");
    var registerContent = document.querySelector(".register-content");
    
    container?.classList.remove("highlight-rest");
    loginContent?.classList.remove("form-left");
    registerContent?.classList.remove("form-right");
    if (this.isOnLeft && movingText && movingBtn) {
      document.getElementById("login-text-1")!.innerHTML = "SIGN";
      document.getElementById("login-text-2")!.innerHTML = "IN";

      
      movingBtn.textContent = "SIGN UP ►";
      movingText.textContent = "Are you new here?";
      container?.classList.remove("highlight-left");
      container?.classList.add("highlight-right");
      loginContent?.classList.add("form-left");
      this.isOnLeft = false;
    } else if(movingText && movingBtn) {
      document.getElementById("login-text-1")!.innerHTML = "SIGN";
      document.getElementById("login-text-2")!.innerHTML = "UP";


      movingBtn.textContent = "◄ SIGN IN";
      movingText.textContent = "Already have an account?";
      container?.classList.remove("highlight-right");
      container?.classList.add("highlight-left");
      registerContent?.classList.add("form-right");
      this.isOnLeft = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
