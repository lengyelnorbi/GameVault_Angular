import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {

    // Toggle
    isGameShown = true;
    isUserShown = false;

    gamesTabClicked() {
      if (this.isUserShown) {
        this.isGameShown = !this.isGameShown
        this.isUserShown = !this.isUserShown
        var gamesButton = document.querySelector(".games-button");
        var usersButton = document.querySelector(".users-button");
        usersButton?.classList.remove("selected-background");
        gamesButton?.classList.add("selected-background");
      }
    }

    usersTabClicked() {
      if (this.isGameShown) {
        this.isGameShown = !this.isGameShown
        this.isUserShown = !this.isUserShown
        var gamesButton = document.querySelector(".games-button");
        var usersButton = document.querySelector(".users-button");
        gamesButton?.classList.remove("selected-background");
        usersButton?.classList.add("selected-background");
      }
    }
    
}
