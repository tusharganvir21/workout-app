import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutListComponent ],
      imports: [ FormsModule, NgxPaginationModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default pagination and filters', () => {
    expect(component.itemsPerPage).toBe(5);
    expect(component.currentPage).toBe(1);
    expect(component.searchTerm).toBe('');
    expect(component.filterType).toBe('');
  });

  it('should filter users based on search term', () => {
    component.users = [
      { id: 1, name: 'John Doe', workouts: ['Running'], totalMinutes: 60 },
      { id: 2, name: 'Jane Smith', workouts: ['Cycling'], totalMinutes: 30 }
    ];
    component.searchTerm = 'John';
    component.updatePagination();

    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should filter users based on workout type', () => {
    component.users = [
      { id: 1, name: 'John Doe', workouts: ['Running'], totalMinutes: 60 },
      { id: 2, name: 'Jane Smith', workouts: ['Cycling'], totalMinutes: 30 }
    ];
    component.filterType = 'Cycling';
    component.updatePagination();

    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Jane Smith');
  });

  it('should delete a user and update the list', () => {
    spyOn(component, 'loadWorkouts');
    component.users = [
      { id: 1, name: 'John Doe', workouts: ['Running'], totalMinutes: 60 },
      { id: 2, name: 'Jane Smith', workouts: ['Cycling'], totalMinutes: 30 }
    ];
    component.deleteUser(component.users[0]);

    fixture.detectChanges();

    expect(component.loadWorkouts).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('Jane Smith');
  });

  it('should emit progressRequested event when showProgress is called', () => {
    spyOn(component.progressRequested, 'emit');
    const user = { id: 1, name: 'John Doe', workouts: ['Running'], totalMinutes: 60 };
    component.showProgress(user);

    expect(component.progressRequested.emit).toHaveBeenCalledWith();
  });

  it('should change page and update currentPage', () => {
    component.changePage(2);

    expect(component.currentPage).toBe(2);
  });
});
