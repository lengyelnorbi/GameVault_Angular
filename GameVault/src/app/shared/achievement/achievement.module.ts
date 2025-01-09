export class Achievement {
  icon: string;
  name: string;
  description: string;
  point: Number;

  constructor(achievement: Achievement){
    this.icon = achievement.icon;
    this.name = achievement.name;
    this.description = achievement.description;
    this.point = achievement.point;
  }
 }

 export class AchievementID {
  id: string;
  icon: string;
  name: string;
  description: string;
  point: Number;

  constructor(achievement: AchievementID){
    this.id = achievement.id;
    this.icon = achievement.icon;
    this.name = achievement.name;
    this.description = achievement.description;
    this.point = achievement.point;
  }
 }
