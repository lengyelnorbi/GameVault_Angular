import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromFileComponent } from './import-from-file.component';

describe('ImportFromFileComponent', () => {
  let component: ImportFromFileComponent;
  let fixture: ComponentFixture<ImportFromFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFromFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFromFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
