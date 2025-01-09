import { Component, OnDestroy } from '@angular/core';
import * as XLSX from 'xlsx';
import { HotToastService } from '@ngneat/hot-toast';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameService } from 'src/app/shared/game/game.service';
import { Router } from '@angular/router';
import { Game } from 'src/app/shared/game/game.module';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-import-from-file',
  templateUrl: './import-from-file.component.html',
  styleUrls: ['./import-from-file.component.scss']
})
export class ImportFromFileComponent implements OnDestroy {
  private selectedFile: File;
   lista: any;
   gamek: any;
  subscription: Subscription;
  constructor(private toast: HotToastService,private gameService: GameService, private router: Router) { }

  onFileSelected(event: any) { 
    const saveImport = document.getElementById('saveimport');
    if (saveImport !== null) {
            saveImport.style.display = "none";
          }
    this.lista = []
    this.selectedFile = event.target.files[0];
    const fileType: any = this.selectedFile.name.split('.').pop()?.toUpperCase();
    
    const acceptedTypes = ['XLS', 'XLSX'];
    if (!acceptedTypes.includes(fileType)) {
      this.toast.error("Incorrect file type!", { duration: 3000 });
      const input = document.getElementById('importfiles') as HTMLInputElement;
      input.value = '';
    }
    else {
      let hiba = false
      const reader = new FileReader();
      reader.readAsBinaryString(this.selectedFile);
      reader.onload = (event) => {
        const data = event.target?.result as string;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const importedData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
        let games = [];
    
        for (let i = 1; i < importedData.length; i++) {
          if (importedData[i].length > 0) {

          const row: any = importedData[i];
    
          const genreValues = (row[5] || '').split(',').map((v: string) => v.trim());
          const platformValues = (row[6] || '').split(',').map((v: string) => v.trim());
    
          const game = {
            'studio': row[0],
            'name': row[1],
            'imageUrl': row[2],
            'description': row[3],
            'likeCount': 0,
            'dislikeCount': 0,
            'releaseDate': row[4],
            'category': genreValues,
            'platforms': platformValues,
          };
    
          if (!game['name'] || !game['studio'] || !game['imageUrl'] || !game['releaseDate']) {
            this.toast.error(`Mandatory data is missing in line ${i + 1}`, { duration: 3000 });
            hiba = this.hiba()
            return
          }
    
          for (const genre of game['category']) {
            if (genre && ![    
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
            'Rougelike'].includes(genre)) {
              this.toast.error(`Invalid genre in line ${i + 1}.`, { duration: 3000 });
              hiba = this.hiba()
              return
            }
          }
    
          for (const platform of game['platforms']) {
            if (platform && !['PC', 'PlayStation', 'PS5', 'XBOX', 'Nintendo', 'VR', 'Android', 'iOS'].includes(platform)) {
              this.toast.error(`Invalid platform in line ${i + 1}.`, { duration: 3000 });
              hiba = this.hiba()
              return
            }
          }
    
          const regexDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
          if (!regexDate.test(game['releaseDate'])) {
            this.toast.error(`Invalid Date in line ${i + 1}.`, { duration: 3000 });
            hiba = this.hiba()
            return
          }
          else {
            if (game['releaseDate'] !== null) {
              game['releaseDate'] = game['releaseDate'].trim()
            }
            
          }

          const regexUrl = /(https?:\/\/.*\.(?:png|jpg))/;
          if (!regexUrl.test(game['imageUrl'])) {
            this.toast.error(`Invalid URL in line ${i + 1}.`, { duration: 3000 });
            hiba = this.hiba()
            return
          }

          if(hiba == false) {
            games.push(game);
          }
          else {
            games = []
          }
        }
        }

        this.lista = games.filter((game) => {
          return !this.gamek.some((oldGame: any) => {
            return (
              game.name === oldGame.name &&
              game.studio === oldGame.studio &&
              game.releaseDate === oldGame.releasedate.trim()
            );
          });
        });

        if (this.lista.length > 0) {
          const saveImport = document.getElementById('saveimport');
          if (saveImport !== null) {
            saveImport.style.display = "flex";
          }
        }
        else  {
          this.toast.error(`It is empty or only contains data that is in the database`, { duration: 3000 });
          const input = document.getElementById('importfiles') as HTMLInputElement;
          input.value = '';
        }
      };
    }
    
  }

  onUpload() {

    for (let i = 0; i < this.lista.length; i++) {
      if (this.lista[i].description === null || this.lista[i].description === undefined) {
        this.lista[i].description = ""
      }
    }

    this.lista.forEach((i: any) =>  {
      this.gameService.uploadGame(i)
    });

    const saveImport = document.getElementById('saveimport');
    if (saveImport !== null) {
            saveImport.style.display = "none";
          }
    this.lista = []
    const input = document.getElementById('importfiles') as HTMLInputElement;
    input.value = '';
  }


  ngOnInit(): void {

    this.subscription = this.gameService.getGames("name", "asc").subscribe(actionArray => {
      this.gamek = actionArray.map(i =>{
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
        } as unknown as Game;
      })
    });
  }

  hiba(): boolean {
    const input = document.getElementById('importfiles') as HTMLInputElement;
    input.value = '';
    return true
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file: any = event.dataTransfer?.files[0];
  
    const inputElement = document.getElementById('importfiles') as HTMLInputElement;
    const fileList = new DataTransfer();
    fileList.items.add(file);
    inputElement.files = fileList.files;

    const changeEvent = new Event('change');
  inputElement.dispatchEvent(changeEvent);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}