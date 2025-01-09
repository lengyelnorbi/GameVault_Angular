import { UserService } from './../../shared/user/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
//import { UserGuard } from '../../guards/user.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { AnimationService } from 'src/app/services/animation.service';

@Component({
  selector: 'app-navigation',
  template: `
  <mat-toolbar>
    <div class="nav-section">
      <!-- First nav section -->
    </div>
    <div class="nav-section-2">
      <!-- Second nav section -->
    </div>
    <div class="nav-section-3">
      <!-- Third nav section -->
    </div>
  </mat-toolbar>
`,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  user$ = this.authService.currentUser$;
  username: string;

  ngOnInit() {
    this.getUsername();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public authService: AuthenticationService,
    private router: Router,
    private authservice: AuthenticationService,
    private anim: AnimationService,
    private afs: AngularFirestore,
    private userService: UserService) {}

    
    async getUsername() {
      this.user$.subscribe(async (user) => {
        if (user) {
          const userDocRef = this.afs.collection("user").doc(await this.userService.getUserId());
          const userDoc = await userDocRef.get().toPromise();
          this.username = userDoc?.get('username');
        }
      });
    }
    
    animate()
    {
      this.anim.animate=true;
      console.log(this.anim.animate);
    }
    canUserActive() {
      console.log(this.user$);
      return true;
    }

    canAdminActive() {
      return false;
    }
    
    logout(){
      this.authService.logout().subscribe(() => {
        this.router.navigate(['']);
      });
    }


    

}
