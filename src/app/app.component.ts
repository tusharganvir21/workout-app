import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WorkoutComponent } from './workout/workout.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutProgressComponent } from './workout-progress/workout-progress.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WorkoutComponent, WorkoutListComponent, WorkoutProgressComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'workout-app';
  
  selectedUser: { userId: number; userName: string } | null = null;

  onProgressRequested(event: { userId: number; userName: string }) {
    this.selectedUser = event;
  }

  onUserDeleted(user: { id: number; name: string; workouts: string[]; totalMinutes: number }) {
    this.selectedUser = null;
  }
}
