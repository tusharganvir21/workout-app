import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WorkoutService } from '../workout.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {
  @Output() workoutAdded = new EventEmitter<void>();

  workout = {
    userName: '',
    workoutType: '',
    workoutMinutes: 0
  };

  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Other'];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log('Workout data:', this.workout);
    this.workoutService.addWorkout(this.workout).subscribe(() => {
      this.workoutAdded.emit();
      this.workout = { userName: '', workoutType: '', workoutMinutes: 0 }; // Reset form
      form.resetForm();
    });
  }
}
