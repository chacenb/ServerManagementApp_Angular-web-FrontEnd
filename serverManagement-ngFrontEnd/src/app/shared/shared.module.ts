import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from './pipes/filterServerByStatus/filter-by-status.pipe';
import { AlertComponent } from './components/alert/alert.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FilterByStatusPipe,
    AlertComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    FilterByStatusPipe,
    FormsModule,
    AlertComponent

  ],
})
export class SharedModule { }
