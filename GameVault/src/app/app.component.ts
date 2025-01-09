import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AnimationService } from './services/animation.service';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  template: `
    <div class="palceholder-screen" *ngIf="loading"></div>
    <div class="loading-screen" *ngIf="loading"></div>
        <div class="vault-door-outer" *ngIf="loading">
        <div class="vault-door-inner">
          <div class="vault-door-lock-shadow"></div>
          <div class="vault-door-lock-wrapper">
            <div class="vault-door-lock vault-door-circle"></div>
            <div class="vault-door-lock vault-door-pistons">
              <div class="piston piston1"></div>
              <div class="piston piston2"></div>
              <div class="piston piston3"></div>
              <div class="piston piston4"></div>
            </div>
          </div>
          <div class="vault-door-handle-shadow"></div>
          <div class="vault-door-handle-long-shadow"></div>
          <div class="vault-door-handle">
            <div class="handle-bar bar1"></div>
            <div class="handle-bar bar2"></div>
          </div>
        </div>
      </div>
    <div class="loading-screen2" *ngIf="loading"></div>
    <div class="loading-screen3" *ngIf="loading"></div>
    <router-outlet></router-outlet>
    
  `
})
export class AppComponent implements OnInit {
  title='GameVault';
  loading = false;
  constructor(private router: Router, private anim: AnimationService) {
    //console.log("Navigation kivul: "+this.anim.animate);
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
         // console.log("Navigation belül: "+this.anim.animate);
          if(this.anim.animate){
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 2000); // ide írd be, hogy mennyi idő után tűnjön el a loading screen
          }
          this.anim.animate=false;
        }
      });
  }
  ngOnInit() {
    
    
    
    
  }

}
