import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule]
})
export class WorkoutListComponent implements OnInit {
  @Output() progressRequested = new EventEmitter<{ userId: number; userName: string }>();
  @Output() userDeleted = new EventEmitter<{ id: number; name: string; workouts: string[]; totalMinutes: number }>();

  searchTerm: string = '';
  filterType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Other'];
  users: { id: number; name: string; workouts: string[]; totalMinutes: number }[] = [];

  constructor(private workoutService: WorkoutService, private router: Router) {}

  loadWorkouts() {
    this.workoutService.getWorkouts().subscribe((workouts: Workout[]) => {
      this.users = this.aggregateWorkouts(workouts);
      this.updatePagination();
    });
  }

  ngOnInit() {
    // Initialize data
    this.loadWorkouts();
  }

  addWorkout(workout: { userName: string; workoutType: string; workoutMinutes: number }) {
    this.workoutService.addWorkout(workout).subscribe(() => {
      this.loadWorkouts(); // Refresh the list
    });
  }

  deleteUser(user: { id: number; name: string; workouts: string[]; totalMinutes: number }) {
    this.workoutService.deleteUser(user.id).subscribe(() => {
      this.loadWorkouts(); // Refresh the list after deletion

      // Emit the deletion event
      this.userDeleted.emit(user);
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  aggregateWorkouts(workouts: Workout[]): { id: number; name: string; workouts: string[]; totalMinutes: number }[] {
    const userMap = new Map<number, { id: number; name: string; workouts: string[]; totalMinutes: number }>();

    workouts.forEach(workout => {
      const userId = workout.userId;
      const userName = workout.userName;

      if (!userMap.has(userId)) {
        userMap.set(userId, { 
          id: userId,
          name: userName, 
          workouts: [], 
          totalMinutes: 0 
        });
      }

      const user = userMap.get(userId);
      if (user) {
        user.workouts.push(workout.workoutType);
        user.totalMinutes += workout.workoutMinutes;
      }
    });

    return Array.from(userMap.values());
  }

  get filteredUsers() {
    return this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.filterType === '' || user.workouts.includes(this.filterType))
    );
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  showProgress(user: { id: number; name: string; workouts: string[]; totalMinutes: number }) {
    this.progressRequested.emit({ userId: user.id, userName: user.name });
  }
}
