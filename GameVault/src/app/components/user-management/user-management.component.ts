import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { User } from '../../shared/user/user.module';
import { UserService } from '../../shared/user/user.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(public service : UserService) { }

  lista: User[];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers():void
  {
    this.subscription = this.service.getItems("email", "asc").subscribe(actionArray => {
      this.lista = actionArray.map(i =>{
        const data = i.payload.doc.data() as User
        return {
          id: i.payload.doc.id,
          email: data.email,
          bio: data.bio,
          completedList: data.completedList,
          dislikedList: data.dislikedList,
          isBanned: data.isBanned,
          likedList: data.likedList,
          planList: data.planList,
          username: data.username,
        } as unknown as User;
      })
    });
  }

  onBan(i: User)
  {
    if(confirm("Are you sure you want to ban this user?"))
    {
      this.service.banUser(i);
    }
  }
  onUnban(i: User)
  {
    if(confirm("Are you sure you want to unban this user?"))
    {
      this.service.unbanUser(i);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
