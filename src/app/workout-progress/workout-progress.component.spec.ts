import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutProgressComponent } from './workout-progress.component';
import { WorkoutService } from '../workout.service';
import { of } from 'rxjs';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Workout } from '../workout.model'; // Import your Workout model

describe('WorkoutProgressComponent', () => {
  let component: WorkoutProgressComponent;
  let fixture: ComponentFixture<WorkoutProgressComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getWorkouts']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, BaseChartDirective],
      declarations: [WorkoutProgressComponent],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy }
      ]
    })
    .compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;

    fixture = TestBed.createComponent(WorkoutProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chart on ngOnInit', () => {
    spyOn(component, 'initializeChart').and.callThrough();
    component.ngOnInit();
    expect(component.initializeChart).toHaveBeenCalled();
  });

  it('should update chart data', () => {
    component.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Other'],
        datasets: [{ label: 'Minutes', data: [] }]
      },
      options: {}
    });

    const minutesByType = {
      'Running': 30,
      'Cycling': 45,
      'Swimming': 20,
      'Yoga': 10,
      'Weightlifting': 60,
      'Other': 15
    };

    component.updateChartData(minutesByType);
    expect(component.chart?.data.datasets[0].data).toEqual(Object.values(minutesByType));
  });

  it('should clear chart data', () => {
    component.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting', 'Other'],
        datasets: [{ label: 'Minutes', data: [10, 20, 30, 40, 50, 60] }]
      },
      options: {}
    });

    component.clearChartData();
    expect(component.chart?.data.datasets[0].data).toEqual([]);
  });

  it('should load user workouts and update chart', () => {
    const mockWorkouts: Workout[] = [
      { id: 1, userId: 1, workoutType: 'Running', workoutMinutes: 30, userName: 'User1' },
      { id: 2, userId: 1, workoutType: 'Cycling', workoutMinutes: 45, userName: 'User1' },
      { id: 3, userId: 2, workoutType: 'Swimming', workoutMinutes: 20, userName: 'User2' }
    ];
    workoutService.getWorkouts.and.returnValue(of(mockWorkouts));
    
    spyOn(component, 'updateChartData').and.callThrough();
    component.userId = 1;
    component.loadUserWorkouts(1);
    fixture.detectChanges();

    const expectedMinutesByType = {
      'Running': 30,
      'Cycling': 45,
      'Swimming': 0,
      'Yoga': 0,
      'Weightlifting': 0,
      'Other': 0
    };
    
    expect(component.updateChartData).toHaveBeenCalledWith(expectedMinutesByType);
  });

  it('should handle changes in userId', () => {
    spyOn(component, 'loadUserWorkouts').and.callThrough();
    component.userId = 2;
    component.ngOnChanges({
      userId: {
        currentValue: 2,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.loadUserWorkouts).toHaveBeenCalledWith(2);
  });
});
