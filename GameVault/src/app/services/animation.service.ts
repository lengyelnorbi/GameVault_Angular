import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  animate =false;
  constructor(private router: Router) { }



}
