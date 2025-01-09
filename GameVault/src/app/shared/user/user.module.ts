export class User {
  id: string;
  bio: string;
  completedList: Array<string>;
  dislikedList: Array<string>;
  email: string;
  isBanned: boolean;
  likedList: Array<string>;
  planList: Array<string>;
  followedList: Array<string>;
  followerList: Array<string>;
  favoriteList: Array<string>;
  username: string;
  pfpUrl: string;
  backgroundUrl: string;
  title: string;
  achievements: Array<string>;

  constructor(User: User)
  {
    this.id = User.id;
    this.bio = User.bio;
    this.completedList = User.completedList;
    this.dislikedList = User.dislikedList;
    this.email = User.email;
    this.isBanned = User.isBanned;
    this.likedList = User.likedList;
    this.planList = User.planList;
    this.followedList = User.followedList;
    this.followerList = User.followerList;
    this.favoriteList = User.favoriteList;
    this.username = User.username;
    this.pfpUrl = User.pfpUrl;
    this.backgroundUrl = User.backgroundUrl;
    this.title = User.title;
    this.achievements = User.achievements;
  }
}
