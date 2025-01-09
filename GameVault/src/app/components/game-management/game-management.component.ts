import { Component, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { Game } from 'src/app/shared/game/game.module';
import { GameService } from 'src/app/shared/game/game.service';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-management',
  templateUrl: './game-management.component.html',
  styleUrls: ['./game-management.component.scss']
})
export class GameManagementComponent implements OnDestroy {
  @ViewChild('selectGenres') selectGenres: MatSelect;
  @ViewChild('selectPlatforms') selectPlatforms: MatSelect;
  modify : boolean;
  docRef : DocumentReference;

  subscription?: Subscription;

  constructor(
    private gameService: GameService,
    private fbs: AngularFirestore,
    private router: Router,
  ) {}

    lastGame: Game

    genresPreview: string[] = [];
    platformsPreview: string[] = [];
    genres = new FormControl('');
    platforms = new FormControl('');
    newGameForm = new FormGroup({
      studio: new FormControl('',
      [Validators.required]),
      name: new FormControl('',
      [Validators.required]),
      imageUrl: new FormControl('',
      [Validators.required]),
      releasedate: new FormControl('',
      [Validators.required]),
      description: new FormControl('',
      [Validators.required]),
      trailer: new FormControl(''),
    })

  ngOnInit(): void {

    this.subscription = this.gameService.getGames("name", "asc").subscribe(actionArray => {
      this.lista = actionArray.map(i =>{
        const data = i.payload.doc.data() as Game;
        return {
          id: i.payload.doc.id,
          name: data.name,
          category: data.category,
          platforms: data.platforms,
          likeCount: data.likeCount,
          dislikeCount: data.dislikeCount,
          studio: data.studio,
          releasedate: data.releaseDate,
          trailer: data.trailer,
        } as unknown as Game;
      })
    });
  }

  parseList(input: string[]): string {
    const colonedList = input.join(", ")
    return colonedList
  }

  showAddPopUp() {
    const popUpWindow = document.querySelector(".pop-up-holder");
    popUpWindow?.classList.remove("hidden-pop")
  }

  hideAddPopUp() {
    const popUpWindow = document.querySelector(".pop-up-holder");
    popUpWindow?.classList.add("hidden-pop")
    const addPopTitle = document.querySelector('.add-pop-title');
    if (addPopTitle) { // Make sure the element was found before trying to modify it
      addPopTitle.textContent = 'Add a new game!';
    }
    const deleteBtn = document.querySelector(".delete-btn");
    if (deleteBtn) { // Make sure the element was found before trying to modify it
      deleteBtn.classList.add("hidden-pop");
    }
    const highlightedRow = document.querySelector(".recently-clicked-tr");
    highlightedRow?.classList.remove("recently-clicked-tr")
  }

  showEditPopUp() {
    const addPopTitle = document.querySelector('.add-pop-title');
    if (addPopTitle) { // Make sure the element was found before trying to modify it
      addPopTitle.textContent = 'Edit game!';
    }

    const deleteBtn = document.querySelector(".delete-btn");
    if (deleteBtn) { // Make sure the element was found before trying to modify it
      deleteBtn.classList.remove("hidden-pop");
    }

    // Select the table element
    const table = document.querySelector('table');

    // Add a click event listener to the table
    if (table) { // Make sure the element was found before adding the listener
      table.addEventListener('click', (event) => {
        // Get the clicked element
        const clickedElement = event.target;

        // Check if the clicked element is a table row
        if (clickedElement instanceof HTMLTableRowElement) {
          // Add the recently-clicked-tr class to the clicked row
          clickedElement.classList.add('recently-clicked-tr');

          // Do something with the clicked row
          console.log('Clicked row:', clickedElement);
        }
      });
    }

    this.showAddPopUp();
  }

  lista: Game[];


    get studio(){
      return this.newGameForm.get('studio');
    }

    get name(){
      return this.newGameForm.get('name');
    }

    get imageUrl(){
      return this.newGameForm.get('imageUrl');
    }

    get releasedate(){
      return this.newGameForm.get('releasedate');
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
    'Rougelike'];

    platformsList: string[] = ['PC', 'PlayStation', 'PS5', 'XBOX', 'Nintendo', 'VR', 
    'Android', 'iOS'];
    submit(){
      // Empty forms won't be uploaded
      if (!this.newGameForm.valid) {
        alert("NOT VALID")
        return;
      }

      console.log(this.newGameForm.value);
      console.log(this.genres.value)
      console.log(this.platforms.value)

      let data = {
        'name': this.newGameForm.value.name as string,
        'category': this.selectGenres.value,
        'platforms': this.selectPlatforms.value,
        'imageUrl': this.newGameForm.value.imageUrl as string,
        'likeCount': 0,
        'dislikeCount': 0,
        'studio': this.newGameForm.value.studio as string,
        'releaseDate': format(new Date(this.newGameForm.value.releasedate as string), 'yyyy-MM-dd') as string,
        'description': this.newGameForm.value.description as string,
        'trailer': this.newGameForm.value.trailer as string
      };

      console.log("DATEEEEEEEE: " + data.releaseDate + " " + format(new Date(data.releaseDate), 'yyyy-MM-dd'))

      if(!this.modify){
        this.gameService.uploadGame(data);
        this.hideAddPopUp();
      }
      else{
        this.gameService.updateGame(this.docRef, data);
        this.modify = false;
        this.hideAddPopUp();
        //this.router.navigate(['/home']);
      }
    }

    recentlyClickedRow: any;
    async getGame(game: Game){
      this.modify = true;

      this.docRef = doc(this.fbs.firestore, "game", game.id);
      const docSnap = await getDoc(this.docRef);
      this.lastGame = game

      this.genres = new FormControl(docSnap.get('category'));
      this.platforms = new FormControl(docSnap.get('platforms'));
      this.newGameForm = new FormGroup({
      studio: new FormControl(docSnap.get('studio'),
      [Validators.required]),
      name: new FormControl(docSnap.get('name'),
      [Validators.required]),
      imageUrl: new FormControl(docSnap.get('imageUrl'),
      [Validators.required]),
      releasedate: new FormControl(new Date(docSnap.get('releaseDate')) as unknown as string,
      [Validators.required]),
      description: new FormControl(docSnap.get('description'),
      [Validators.required]),
      trailer: new FormControl(docSnap.get('trailer'))
    })
      console.log(docSnap.get('releaseDate'));

      this.recentlyClickedRow = game;
      this.showEditPopUp();
    }

    async deleteGameById(id: string){
      this.gameService.deleteGameById(id);
    }

    async deleteGame(game: Game){
      this.gameService.deleteGame(game);
      this.hideAddPopUp();
    }

    reset(){
      this.modify = false;
      this.genres = new FormControl('');
      this.platforms = new FormControl('');
      this.newGameForm = new FormGroup({
      studio: new FormControl('',
      [Validators.required]),
      name: new FormControl('',
      [Validators.required]),
      imageUrl: new FormControl('',
      [Validators.required]),
      releasedate: new FormControl('',
      [Validators.required]),
      description: new FormControl('',
      [Validators.required]),
      trailer: new FormControl(''),
    })
    this.hideAddPopUp();
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }
}
