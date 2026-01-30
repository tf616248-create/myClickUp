import { ComponentFixture, TestBed } from '@angular/core/testing';

import { projectsList } from './projects-list';

describe('ProjectsList', () => {
  let component: projectsList;
  let fixture: ComponentFixture<projectsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [projectsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(projectsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
