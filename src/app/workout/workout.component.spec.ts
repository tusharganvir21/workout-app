import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { WorkoutComponent } from './workout.component';

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let fixture: ComponentFixture<WorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when required fields are empty', () => {
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    expect(form.checkValidity()).toBeFalse();
  });

  it('should display error messages when required fields are empty and form is submitted', () => {
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const userNameError = fixture.debugElement.query(By.css('#userName + div'));
    const workoutTypeError = fixture.debugElement.query(By.css('#workoutType + div'));
    const workoutMinutesError = fixture.debugElement.query(By.css('#workoutMinutes + div'));

    expect(userNameError.nativeElement.textContent).toContain('User Name is required');
    expect(workoutTypeError.nativeElement.textContent).toContain('Workout Type is required');
    expect(workoutMinutesError.nativeElement.textContent).toContain('Workout Minutes is required');
  });

  it('should have a valid form when all required fields are filled', () => {
    component.workout.userName = 'John Doe';
    component.workout.workoutType = 'Cardio';
    component.workout.workoutMinutes = 30;
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    expect(form.checkValidity()).toBeTrue();
  });

  it('should call onSubmit method when the form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should not call onSubmit method when the form is invalid', () => {
    spyOn(component, 'onSubmit');
    component.workout.userName = '';
    component.workout.workoutType = '';
    component.workout.workoutMinutes = 0;
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.onSubmit).not.toHaveBeenCalled();
  });
});
