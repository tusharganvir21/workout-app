import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Workout } from './workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workouts: Workout[] = [];
  private nextId = 1;
  private workoutsSubject = new BehaviorSubject<Workout[]>(this.workouts);

  getWorkouts(): Observable<Workout[]> {
    return this.workoutsSubject.asObservable();
  }

  addWorkout(workout: { userName: string; workoutType: string; workoutMinutes: number }): Observable<void> {
    const newWorkout: Workout = {
      id: this.nextId++,
      userId: this.getUserId(workout.userName),
      ...workout
    };
    this.workouts.push(newWorkout);
    this.workoutsSubject.next(this.workouts);
    return of(undefined);
  }

  deleteUser(userId: number): Observable<void> {
    this.workouts = this.workouts.filter(workout => workout.userId !== userId);
    this.workoutsSubject.next(this.workouts);
    return of(undefined);
  }

  private getUserId(userName: string): number {
    const existingUser = this.workouts.find(workout => workout.userName === userName);
    if (existingUser) {
      return existingUser.userId;
    }
    return this.nextId++; // Assign a new userId
  }
}
