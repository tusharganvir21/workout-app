import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutProgressComponent } from './workout-progress/workout-progress.component';

@NgModule({
  imports: [
    AppComponent,
    WorkoutListComponent,
    WorkoutProgressComponent,
    BrowserModule,
    FormsModule,
    NgxPaginationModule,
    CommonModule
  ],
  providers: []
})
export class AppModule {}
