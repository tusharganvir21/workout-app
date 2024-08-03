export interface Workout {
  id: number;
  userId: number;
  userName?: string;
  workoutType: string;
  workoutMinutes: number;
}
