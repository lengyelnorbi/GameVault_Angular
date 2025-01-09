import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from 'src/app/shared/user/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AnimationService } from 'src/app/services/animation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {



  loginForm = new FormGroup({
    email: new FormControl('',
    [Validators.required, Validators.email]),
    password: new FormControl('',
    [Validators.required])
  })

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private auth: AngularFireAuth,
    private userService: UserService,
    private afs: AngularFirestore,
    private anim: AnimationService) { }

  ngOnInit(): void {
  }

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    const auth = firebase.auth();


    //Login
    this.authService.login(email as string, password as string)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: `There was an error `
        })
      ).subscribe(() => {
        let emailError = false;
        this.auth.user.subscribe(async user => {
          let helper = await this.authService.isBanned(user?.email);
          if (user && (user.emailVerified || user.email == "admin@gmail.com") && !helper) {
            console.log('If: ' + helper);
            emailError = true;
            this.userService.getUsersGames();
            this.anim.animate = true;
            this.router.navigate(['/games']);
          } else if (user && !user.emailVerified && !emailError && !helper){
            // If the user's email has not been verified, log them out and display an error message
            console.log('Else if: ' + helper);
            emailError = true;
            this.authService.logout();
            this.toast.error('Please verify your email before logging in');
          }

          else if(helper)
          {
            this.authService.logout();
            this.toast.error('This account has been banned');
          }
          else
          {
            this.toast.error('Unexpected error');
          }
        });
      });
  }

  facebookLogin(){
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(() => {
      // Sign-out successful.
      console.log("Sikeres bejelentkezés");
    }).catch((error) => {
      // An error happened.
      console.log("Sikertelen bejelentkezés");
    });
  }
}
