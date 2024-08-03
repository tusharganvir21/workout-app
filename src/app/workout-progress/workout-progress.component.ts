import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WorkoutService } from '../workout.service';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-workout-progress',
  templateUrl: './workout-progress.component.html',
  styleUrls: ['./workout-progress.component.css'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
})
export class WorkoutProgressComponent implements OnInit, OnChanges {
  @Input() userId: number | null = null;
  @Input() userName: string = '';
  public chart: any;
  workouts: { type: string; minutes: number }[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.initializeChart();
    if (this.userId !== null) {
      this.loadUserWorkouts(this.userId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {
      if (this.userId === null) {
        this.clearChartData();
        this.userName = ''; // Clear userName when userId is null
      } else {
        this.loadUserWorkouts(this.userId);
      }
    }
  }

  initializeChart() {
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Other'],
        datasets: [
          {
            label: "Minutes",
            data: [],
            backgroundColor: 'rgba(255, 106, 0, 0.6)', 
            borderColor: 'rgba(255, 165, 0, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw + ' minutes';
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            titleColor: 'rgba(255, 165, 0, 1)', 
            bodyColor: 'rgba(255, 255, 255, 0.9)' 
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: 'rgba(255, 255, 255, 0.7)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)' 
            }
          }
        }
      }
    });
  }

  updateChartData(minutesByType: { [key: string]: number }) {
    this.chart.data.datasets[0].data = Object.values(minutesByType);
    this.chart.update();
  }

  clearChartData() {
    this.chart.data.datasets[0].data = [];
    this.chart.update();
  }

  loadUserWorkouts(userId: number) {
    this.workoutService.getWorkouts().subscribe(workouts => {
      const userWorkouts = workouts.filter(workout => workout.userId === userId);
      const minutesByType: { [key: string]: number } = {
        'Running': 0,
        'Cycling': 0,
        'Swimming': 0,
        'Yoga': 0,
        'Weightlifting': 0,
        'Other': 0
      };

      userWorkouts.forEach(workout => {
        minutesByType[workout.workoutType] = (minutesByType[workout.workoutType] || 0) + workout.workoutMinutes;
      });

      this.updateChartData(minutesByType);
    });
  }
}
