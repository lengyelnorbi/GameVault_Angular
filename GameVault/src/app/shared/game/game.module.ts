import { Timestamp } from "firebase/firestore";

export class Game {
  id: string;
  name: string;
  category: Array<string>;
  platforms: Array<string>;
  imageUrl: string;
  likeCount: number;
  dislikeCount: number;
  studio: string;
  releaseDate: string;
  description: string;
  trailer: string;

  constructor(Game: Game)
  {
    this.id = Game.id;
    this.name = Game.name;
    this.category = Game.category;
    this.platforms = Game.platforms;
    this.imageUrl = Game.imageUrl;
    this.likeCount = Game.likeCount;
    this.dislikeCount = Game.dislikeCount;
    this.studio = Game.studio;
    this.releaseDate = Game.releaseDate;
    this.description = Game.description;
    this.trailer = Game.trailer;
  }
}

// Only used when uploading games, as there is no ID yet
export class IDlessGame {
  name: string;
  category: Array<string>;
  platforms: Array<string>;
  imageUrl: string;
  likeCount: number;
  dislikeCount: number;
  studio: string;
  releaseDate: string;
  description: string;
  trailer: string;

  constructor(IDlessGame: IDlessGame)
  {
    this.name = IDlessGame.name;
    this.category = IDlessGame.category;
    this.platforms = IDlessGame.platforms;
    this.imageUrl = IDlessGame.imageUrl;
    this.likeCount = IDlessGame.likeCount;
    this.dislikeCount = IDlessGame.dislikeCount;
    this.studio = IDlessGame.studio;
    this.releaseDate = IDlessGame.releaseDate;
    this.description = IDlessGame.description;
    this.trailer = IDlessGame.trailer;
  }
}
