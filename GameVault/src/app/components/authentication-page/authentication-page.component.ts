import { Component } from '@angular/core';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.scss']
})
export class AuthenticationPageComponent {
  
  constructor() {}

  // CSS animation related code
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
}
