import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from './pipes/filterServerByStatus/filter-by-status.pipe';
import { AlertComponent } from './components/alert/alert.component';



@NgModule({
  declarations: [
    FilterByStatusPipe,
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterByStatusPipe,
    AlertComponent

  ],
})
export class SharedModule { }
