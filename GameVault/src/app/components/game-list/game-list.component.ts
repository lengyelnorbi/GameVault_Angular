import { NumberInput } from '@angular/cdk/coercion';
import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription, async } from 'rxjs';
import { Game } from 'src/app/shared/game/game.module';
import { GameService } from 'src/app/shared/game/game.service';
import { SearchFilterPipe } from 'src/app/shared/pipes/search-filter.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import { GameProfilePageComponent } from '../game-profile-page/game-profile-page.component';
import { UserService } from 'src/app/shared/user/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../shared/user/user.module';
import { CountUpModule } from 'ngx-countup';
import { AchievementService } from 'src/app/shared/achievement/achievement.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  providers: [ SearchFilterPipe ]
})
export class GameListComponent implements OnInit, OnDestroy{

  gameList: Game[] = [];
  pageSlice?: Game[] = [];
  subscription?: Subscription;
  subscription1?: Subscription;
  subscription2?: Subscription;
  user$ = this.authService.currentUser$;

  /** Variables for pagination */
  pSize: NumberInput = 18;
  pageLength: NumberInput;

  /** Variables for search and filtering */
  searchText: string = "";
  searchPlatforms: string[] = [];
  searchPlatformsHistory: string[] = [];
  searchCategories: string[] = [];
  searchCategoriesHistory: string[] = [];
  platformNumbers: Number[] = [];
  selectedNumberPlat: Number = 0;
  categoriesNumbers: Number[] = [];
  selectedNumberCat: Number = 0;
  selectedSort: string = "";
  selectedOrder: string = "default";

  userCount: Number;
  gamesCount: Number;

  constructor(private gameService: GameService, private filter: SearchFilterPipe, private toast: HotToastService, private userService: UserService, private afs: AngularFirestore, public authService: AuthenticationService, private achService: AchievementService)
  {
  }

  ngOnInit(): void {
    this.getGamesInList();
    this.userService.getUsersGames();
    this.userService.getUsersGamesWanted();
    this.userService.getUserfavList();
  }

  onSearchTextChange(){
    this.updatePageSliceData();
  }

  onPlatformSelected(selectedPlatform: any){
    this.platformNumbers = Array.from(Array(selectedPlatform.length).keys()).map(x => x + 1);
    let newSelect: string = "";
    for(let p of selectedPlatform){
      if(!this.searchPlatformsHistory.includes(p)){
        newSelect = p;
      }
    }
    if(newSelect == "All"){
      this.searchPlatforms = ['All', 'PC', 'PlayStation', 'PS5', 'XBOX', 'Nintendo', 'VR', 
      'Android', 'iOS'];
      this.platformNumbers = Array.from(Array(this.searchPlatforms.length - 1).keys()).map(x => x + 1);
    }
    if(newSelect === "" && this.searchPlatforms.includes("All")){
      this.platformNumbers = Array.from(Array(this.searchPlatforms.length - 1).keys()).map(x => x + 1);
    }
    if(newSelect === "" && this.searchPlatforms.includes("Favourites")){
      this.platformNumbers = Array.from(Array(this.searchPlatforms.length - 1).keys()).map(x => x + 1);
    }
    if(selectedPlatform.includes("Clear")){
      this.searchPlatforms = [];
      this.platformNumbers = [];
    }
    if(selectedPlatform.length == 0 || selectedPlatform.includes("Clear")){
      this.selectedNumberPlat = 0;
    }
    else{
      this.selectedNumberPlat = 1;
    }
    this.searchPlatformsHistory = this.searchPlatforms;
    this.updatePageSliceData()
  }

  onPlatformNumberSelected(number: any){
    this.selectedNumberPlat = number;
    this.updatePageSliceData()
  }

  async onCategorySelected(selectedCategory: any){
    this.categoriesNumbers = Array.from(Array(selectedCategory.length).keys()).map(x => x + 1);
    let newSelect: string = "";
    for(let p of selectedCategory){
      if(!this.searchCategoriesHistory.includes(p)){
        newSelect = p;
      }
    }
    if(newSelect == "All"){
      this.searchCategories = ['All',     
      'Fantasy', 
      'Action', 
      'Survival', 
      'Adventure', 
      'RPG',
      'MMORPG',
      'JRPG', 
      'Sports', 
      'Simulation', 
      'Strategy', 
      'Battle Royale',
      'Open-World',
      'Sandbox',
      'Casual', 
      'Fighting', 
      'Music', 
      'Arcade', 
      'Horror', 
      'Puzzle', 
      'Racing', 
      'Visual Novel', 
      'FPS', 
      'Western', 
      'Soulslike',
      'Rougelike'];
      this.categoriesNumbers = Array.from(Array(this.searchCategories.length - 1).keys()).map(x => x + 1);
    }
    if(newSelect == "Favourites"){
      this.searchCategories = await this.getUserFavCategories();
      this.searchCategories.push("Favourites");
    }
    if(this.searchCategories.includes("All") || this.searchCategories.includes("Favourites")){
      this.categoriesNumbers = Array.from(Array(this.searchCategories.length - 1).keys()).map(x => x + 1);
    }
    if(selectedCategory.includes("Clear")){
      this.searchCategories = [];
      this.categoriesNumbers = [];
    }
    if(selectedCategory.length == 0 || selectedCategory.includes("Clear")){
      this.selectedNumberCat = 0;
    }
    else{
      if(newSelect == "Favourites"){
        this.selectedNumberCat = this.searchCategories.length - 1;
      }
      else{
        this.selectedNumberCat = 1;
      }
    }
    this.searchCategoriesHistory = this.searchCategories;
    this.updatePageSliceData()
  }

  onCategoryNumberSelected(number: any){
    this.selectedNumberCat = number;
    this.updatePageSliceData();
  }

  onSortSelected(sort: any){
    this.selectedSort = sort;
    this.updatePageSliceData();
  }

  onOrderSelected(order: any){
    this.selectedOrder = order;
    this.updatePageSliceData();
  }

  genresList: string[] = [    
  'Fantasy', 
  'Action', 
  'Survival', 
  'Adventure', 
  'RPG',
  'MMORPG',
  'JRPG', 
  'Sports', 
  'Simulation', 
  'Strategy', 
  'Battle Royale',
  'Open-World',
  'Sandbox',
  'Casual', 
  'Fighting', 
  'Music', 
  'Arcade', 
  'Horror', 
  'Puzzle', 
  'Racing', 
  'Visual Novel', 
  'FPS', 
  'Western', 
  'Soulslike',
  'Rougelike'
  ];

  platformsList: string[] = ['PC', 'PlayStation', 'PS5', 'XBOX', 'Nintendo', 'VR', 
  'Android', 'iOS'];

  sortingList: string[] = ['Name', 'Liked Quantity', 'Dislike Quantity', 'Release Date', 'Studio'];

  updatePageSliceData(startIndex: Number = 0, endIndex: NumberInput = this.pSize): void {
    this.pageSlice = this.filter.transform(this.gameList, this.searchText, this.searchPlatforms, this.selectedNumberPlat, this.searchCategories, this.selectedNumberCat);
    
    if(this.selectedOrder === "ascending"){
      switch(this.selectedSort) { 
        case "Name": {
           this.pageSlice?.sort((a, b) => a.name.localeCompare(b.name));
           break; 
        } 
        case "Liked Quantity": { 
          this.pageSlice?.sort((a, b) => a.likeCount - b.likeCount);
           break; 
        }
        case "Studio": { 
          this.pageSlice?.sort((a, b) => a.studio.localeCompare(b.studio));
          break; 
        } 
        case "Dislike Quantity": { 
          this.pageSlice?.sort((a, b) => a.dislikeCount - b.dislikeCount);
          break; 
        }
        case "Release Date": { 
          this.pageSlice?.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
          break; 
        }
        default: { 
          this.pageSlice?.sort((a, b) => a.likeCount - b.likeCount);
          break; 
        } 
      }
    }
    else if(this.selectedOrder === "descending"){
      switch(this.selectedSort) { 
        case "Name": {
           this.pageSlice?.sort((a, b) => b.name.localeCompare(a.name));
           break; 
        } 
        case "Liked Quantity": { 
          this.pageSlice?.sort((a, b) => b.likeCount - a.likeCount);
           break; 
        }
        case "Studio": { 
          this.pageSlice?.sort((a, b) => b.studio.localeCompare(a.studio));
          break; 
        } 
        case "Dislike Quantity": { 
          this.pageSlice?.sort((a, b) => b.dislikeCount - a.dislikeCount);
          break; 
        }
        case "Release Date": { 
          this.pageSlice?.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
          break; 
        }
        default: { 
          this.pageSlice?.sort((a, b) => b.likeCount - a.likeCount);
          break; 
        } 
      }
    }
    else if(this.selectedOrder === "default"){
      switch(this.selectedSort) { 
        case "Name": {
           this.pageSlice?.sort((a, b) => a.name.localeCompare(b.name));
           break; 
        } 
        case "Liked Quantity": { 
          this.pageSlice?.sort((a, b) => b.likeCount - a.likeCount);
           break; 
        }
        case "Studio": { 
          this.pageSlice?.sort((a, b) => a.studio.localeCompare(b.studio));
          break; 
        } 
        case "Dislike Quantity": { 
          this.pageSlice?.sort((a, b) => b.dislikeCount - a.dislikeCount);
          break; 
        }
        case "Release Date": { 
          this.pageSlice?.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
          break; 
        }
        default: { 
          this.pageSlice?.sort((a, b) => b.likeCount - a.likeCount);
          break; 
        } 
      }
    }
    this.pageSlice = this.pageSlice?.slice(Number(startIndex), Number(endIndex))
    this.pageLength = this.filter.transform(this.gameList, this.searchText, this.searchPlatforms, this.selectedNumberPlat, this.searchCategories, this.selectedNumberCat).length;
  }
    

  getGamesInList(): void
  {
    this.subscription = this.gameService.getGames("likeCount", "desc").subscribe({
      next:(game: DocumentChangeAction<unknown>[]) =>  
      {
        //this.gameList = game.map(g => new Game({...g.payload.doc.data() as Game}));
        this.gameList = game.map(g=>new Game({...g.payload.doc.data() as Game, id: g.payload.doc.id}));
        console.log(this.gameList);
        this.pageSlice = this.gameList.slice(0, 18);
        this.pageLength = this.gameList.length;
      }
    })   
  }

  OnPageChange(event: PageEvent){
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.gameList.length){
      endIndex = this.gameList.length;
    }
    this.pSize = event.pageSize;
    this.updatePageSliceData(startIndex, endIndex);
  }

  filterReset(){
    this.searchText = "";
    this.searchPlatforms = [];
    this.searchPlatformsHistory = [];
    this.searchCategories = [];
    this.searchCategoriesHistory = [];
    this.platformNumbers = [];
    this.selectedNumberPlat = 0;
    this.categoriesNumbers = [];
    this.selectedNumberCat = 0;
    this.selectedSort = "";
    this.selectedOrder = "default";
    this.updatePageSliceData(0, this.pSize);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription1?.unsubscribe();
    this.subscription2?.unsubscribe();
  }

  showButtonFlag: { [id: string]: boolean } = {};

  showButton(game: Game) {
    this.showButtonFlag[game.id] = true;
  }

  hideButton(game: Game) {
    this.showButtonFlag[game.id] = false;
  }

  async wantButton(game: Game, event: MouseEvent){
    event.stopPropagation()
    console.log('Want play button clicked: ', game.id);
    await this.userService.addGameToWantPlay(game.id);    
    this.achService.userPlanGameAchs();
  }

  checkIfWantedPlay(game: Game): boolean{
    if (this.userService.usersWantPlay.includes(game.id)) {
      return true;
    }
    return false;
  }

  async buttonClicked(game: Game, event: MouseEvent) {
    event.stopPropagation()
    console.log('Button clicked for image with ID:', game.id);
    //this.toast.info("Click the 'Add To Completed' button below to use this feature");
    await this.userService.addGameToPlayed(game.id);
    this.achService.gameCompletionAchs();
  }
  
  checkIfCompletedGame(game: Game): boolean
  {
    if(this.userService.usersGames.includes(game.id))
    {
      return true;
    }
    return false;
  }

  getGamePercent(game: Game): number{
    return Math.floor((game.likeCount / (game.likeCount + game.dislikeCount)) * 100);
    
  }
  getGameLike(game: Game): number{
    return game.likeCount;
  }
  getGameDisLike(game: Game): number{
    return game.dislikeCount;
  }

  getColor(percent: number): string {
    let red: number, green: number, blue: number;
  
    if (percent >= 0 && percent <= 25) {
      // Red color
      red = 209;
      green = 16;
      blue = 26;
    } else if (percent > 25 && percent <= 45) {
      // Slightly darker red color
      red =213;
      green =113;
      blue = 13;
    } else if (percent > 45 && percent <= 55) {
      // Yellow color
      red = 236;
      green = 207;
      blue = 4;
    } else if (percent > 55 && percent <= 75) {
      // Green color
      red = 199;
      green = 232;
      blue = 13;
    } else {
      // Bright green color
      red = 48;
      green = 215;
      blue = 30;
    }
    return `rgb(${red}, ${green}, ${blue})`;
  }

  async getUserFavCategories(): Promise<string[]>
  {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const userFavCategoriesList = userDoc?.get('favoriteCategory') as string[];
    return userFavCategoriesList;
  }

    isFavorite(id: string) {
    return  this.userService.usersFavList.includes(id);
  }

  async toggleFavorite(id: string, event: MouseEvent) {
    event.stopPropagation();
  
    const isFav = await this.userService.addOrRemoveFavGame(id);
    if (isFav !== undefined) {
      this.userService.usersFavList.push(id);
    } else {
      const index = this.userService.usersFavList.indexOf(id);
      if (index !== -1) {
        this.userService.usersFavList.splice(index, 1);
      }
    }
  }

  
  
}
