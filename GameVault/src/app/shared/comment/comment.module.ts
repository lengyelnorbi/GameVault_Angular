import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../user/user.module';

export class Comment {
  commentID: String;
  content: String;
  date: String;
  gameID: String;
  userID: String;
  readonly userName?: string;
  readonly pfpUrl?: string;

  constructor(comment: Comment, user?: User)
  {
    this.commentID = comment.commentID;
    this.content = comment.content;
    this.date = comment.date;
    this.gameID = comment.gameID;
    this.userID = comment.userID;
    this.userName = user?.username;
    this.pfpUrl = user?.pfpUrl;
 ;
  }
}