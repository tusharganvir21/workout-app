// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutProgressComponent } from './workout-progress/workout-progress.component';

const routes: Routes = [
  { path: 'workout-list', component: WorkoutListComponent },
  { path: 'workout-progress/:id/:name', component: WorkoutProgressComponent },
  { path: '', redirectTo: '/workout-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
