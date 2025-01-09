import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameProfilePageComponent } from './game-profile-page.component';

describe('GameProfilePageComponent', () => {
  let component: GameProfilePageComponent;
  let fixture: ComponentFixture<GameProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameProfilePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
