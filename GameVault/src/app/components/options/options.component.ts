import { Component, Input, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { DocumentReference, getDoc } from "firebase/firestore";
import { UserService } from 'src/app/shared/user/user.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  username: string;
  bio: string;
  currId: string;
  pfpUrl: string;
  backgroundUrl: string;
  steamId: string;
  twitterId: string;
  discordId: string;

  @ViewChild('selectGenres') selectGenres: MatSelect;
  @Input() genre: string[];
  @ViewChild('selectStudios') selectStudios: MatSelect;
  @Input() studio: string[];

  constructor(
    private afs: AngularFirestore,
    private fbs: AngularFirestore,
    private userService: UserService
  ){  }

  genresPreview: string[] = [];
  genres = new FormControl('');
  docRef : DocumentReference;
  favorite: string[];
  studioPreview: string[] = [];
  studios = new FormControl('');
  favstudio: string[];

  ngOnInit(): void{
    this.getUserFavCategories();
    this.getUserFavStudios();
    this.getUsername();
    this.getBio();
    this.getPfp();
    this.getSteamId();
    this.getTwitterId();
    this.getDiscordId();
    
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

  studioList: string[] = [
    'Valve Corporation',
    'Focus Entertainment',
    'FromSoftware Inc.',
    'Paradox Interactive',
    'Ubisoft',
    'Supergiant Games',
    'Bethesda',
    'Beat Games',
    'CD Project Red',
    'Deep Silver Dambuster Studios',
    'Gameloft',
    'Bandai Namco',
    'Game Science',
    'Rockstar Games',
    'Warner Bros. Games',
    'Epic Games',
    'Electonic Arts',
    'Pearl Abyss',
    'Krafton',
    'Polyphony Digital',
    'Microsoft',
    'Blizzard Entertainment',
    'Capcom',
    'Nintendo',
    'Newnight',
    'Tango Gameworks'
  ];
    

async submit() {
  const selectedGenres = this.selectGenres.value as string[];
  const selectedStudios = this.selectStudios.value as string[];

  console.log(selectedGenres);
  console.log(selectedStudios);
  
  this.favstudio = selectedStudios;
  this.favorite = selectedGenres;
  
  const user = this.userService.getCurrentUserId();
  if (!user) {
    console.error('User not logged in');
    return;
  }

  const userId = await this.userService.getUserId();
  const userDocRef = this.fbs.collection('user').doc(userId).ref;

  //update username
  const newUsername = (document.getElementById('usernameInput') as HTMLInputElement).value;
  if (newUsername !== this.username) {
    this.username = newUsername;
    userDocRef.update({ username: newUsername })
      .then(() => console.log('Username updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating username:', error));
  }

  //update bio
  const newBio = (document.getElementById('bioInput') as HTMLInputElement).value;
  if (newBio !== this.bio) {
    this.bio = newBio;
    userDocRef.update({ bio: newBio })
      .then(() => console.log('Bio updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating bio:', error));
  }

  //update pfpUrl
  const newPfp = (document.getElementById('pfpInput') as HTMLInputElement).value;
  if (newPfp !== this.pfpUrl) {
    this.pfpUrl = newPfp;
    userDocRef.update({ pfpUrl: newPfp })
      .then(() => console.log('pfpUrl updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating pfpUrl:', error));
  }

  //update backgroundUrl
  const newBackground = (document.getElementById('backgroundInput') as HTMLInputElement).value;
  if (newBackground !== this.backgroundUrl) {
    this.backgroundUrl = newBackground;
    userDocRef.update({ backgroundUrl: newBackground })
      .then(() => console.log('backgroundUrl updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating backgroundUrl:', error));
  }

  // update steamId
  const newSteamId = (document.getElementById('steamIdInput') as HTMLInputElement).value;
  if (newSteamId !== this.steamId) {
    userDocRef.update({ steamId: newSteamId })
      .then(() => console.log('steamId updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating steamId:', error));
  }

  // update twitterId
  const newTwitterId = (document.getElementById('twitterIdInput') as HTMLInputElement).value;
  if (newTwitterId !== this.twitterId) {
    userDocRef.update({ twitterId: newTwitterId })
      .then(() => console.log('twitterId updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating twitterId:', error));
  }

  // update discordId
  const newDiscordId = (document.getElementById('discordIdInput') as HTMLInputElement).value;
  if (newDiscordId !== this.discordId) {
    userDocRef.update({ discordId: newDiscordId })
      .then(() => console.log('discordId updated successfully')) //TODO: Toaster
      .catch((error) => console.error('Error updating discordId:', error));
  }



  userDocRef.update({ favoriteCategory: selectedGenres })
    .then(() => console.log('Genres updated successfully'))
    .catch((error) => console.error('Error updating genres:', error));

  userDocRef.update({ favoriteStudio: selectedStudios})
    .then(() => console.log('Studios updated successfully'))
    .catch((error) => console.log('Error updating studios: ', error))
}

    
  async getGenresForm(){
    const docSnap = await getDoc(this.docRef);
    this.genres = new FormControl(docSnap.get('favoriteCategory'));
    
  }

  async getUserFavCategories()
  {
    const userDocRef = this.fbs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const userFavCategoriesList = userDoc?.get('favoriteCategory') as string[];
    this.favorite = userFavCategoriesList;
  }

  async getUserFavStudios(){
    const userDocRef = this.fbs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    const userFavStudiosList = userDoc?.get('favoriteStudio') as string [];
    this.studio = userFavStudiosList;
  } 

  parseList(input: string[]): string {
    if (input && Array.isArray(input)) {
      const colonedList = input.join(", ");
      return colonedList;
    }
    return '';
  }

  async getUsername() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.username = userDoc?.get('username');
  }

  async getBio() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.bio = userDoc?.get('bio');
  }

  async getPfp() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.pfpUrl = userDoc?.get('pfpUrl');
  }

  async getBackground() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.backgroundUrl = userDoc?.get('backgroundUrl');
  }

  async getSteamId() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.steamId = userDoc?.get('steamId') ?? '';
  }

  async getTwitterId() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.twitterId = userDoc?.get('twitterId') ?? '';
  }

  async getDiscordId() {
    const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
    const userDoc = await userDocRef.get().toPromise();
    this.discordId = userDoc?.get('discordId') ?? '';
  }

}
