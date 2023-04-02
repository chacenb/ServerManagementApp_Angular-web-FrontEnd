import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from './pipes/filterServerByStatus/filter-by-status.pipe';
import { AlertComponent } from './components/alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FilterByStatusPipe,
    AlertComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    FilterByStatusPipe,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent

  ],
})
export class SharedModule { }
