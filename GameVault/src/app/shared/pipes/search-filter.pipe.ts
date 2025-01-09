import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(values: any, filterText: string, filterPlatforms: string[], filterPlatNumber: Number, filterCategories: string[], filterCatNumber: Number){
    let games: Object[] = [];
    let platListExceptAllSel: string[] = [];
    let catListExceptAllSel: string[] = [];
    for(let p of filterPlatforms){
      if(p !== "All"){
        platListExceptAllSel.push(p);
      }
    }
    for(let p of filterCategories){
      if(p !== "All" && p !== "Favourites"){
        catListExceptAllSel.push(p);
      }
    }
    if(filterText === ''){
      if(filterPlatforms.length === 0 && filterCategories.length === 0){
        return values
      }
      else{
        if(filterPlatforms.length !== 0 && filterCategories.length === 0){
          let number = 0;
          for(let game of values){
            for(let platform of platListExceptAllSel){
              if(game.platforms.includes(platform)){
                number++;
                if(!games.includes(game) && number >= Number(filterPlatNumber)){
                  games.push(game);
                }
              }
            }
            number = 0;
          }
        }
        else if(filterPlatforms.length === 0 && filterCategories.length !== 0){
          let number = 0;
          for(let game of values){
            for(let cat of catListExceptAllSel){
              if(game.category.includes(cat)){
                number++;
                if(!games.includes(game) && number >= Number(filterCatNumber)){
                  games.push(game);
                }
              }
            }
            number = 0;
          }
        }
        else{
          let numberPlat = 0;
          let numberCat = 0;
          for(let game of values){
            for(let platform of platListExceptAllSel){
              if(game.platforms.includes(platform)){
                numberPlat++;
              }
            }
            for(let cat of catListExceptAllSel){
              if(game.category.includes(cat)){
                numberCat++;
              }
            }
            if(!games.includes(game) && numberCat >= Number(filterCatNumber) && numberPlat >= Number(filterPlatNumber)){
              games.push(game);
            }
            numberPlat = 0;
            numberCat = 0;
          }
        }
      }
    }
    else{
      filterText = filterText.toLowerCase();
      if(filterPlatforms.length === 0 && filterCategories.length === 0){
        for(let game of values){
          if(game.name.toLowerCase().search(filterText) !== -1){
            games.push(game);
          }
        }
      }
      else{
        if(filterPlatforms.length !== 0 && filterCategories.length === 0){
          let number = 0;
          for(let game of values){
            for(let platform of filterPlatforms){
              if(game.platforms.includes(platform)){
                number++;
                if(!games.includes(game) && number >= Number(filterPlatNumber) && game.name.toLowerCase().search(filterText) !== -1){
                  games.push(game);
                }
              }
            }
            number = 0;
          }
        }
        else if(filterPlatforms.length === 0 && filterCategories.length !== 0){
          let number = 0;
          for(let game of values){
            for(let cat of filterCategories){
              if(game.category.includes(cat)){
                number++;
                if(!games.includes(game) && number >= Number(filterCatNumber) && game.name.toLowerCase().search(filterText) !== -1){
                  games.push(game);
                }
              }
            }
            number = 0;
          }
        }
        else{
          let numberPlat = 0;
          let numberCat = 0;
          for(let game of values){
            for(let platform of filterPlatforms){
              if(game.platforms.includes(platform)){
                numberPlat++;
              }
            }
            for(let cat of filterCategories){
              if(game.category.includes(cat)){
                numberCat++;
              }
            }
            if(!games.includes(game) && numberCat >= Number(filterCatNumber) && numberPlat >= Number(filterPlatNumber) && game.name.toLowerCase().search(filterText) !== -1){
              games.push(game);
            }
            numberPlat = 0;
            numberCat = 0;
          }
        }
      }
    }
    return games;
  }
}
