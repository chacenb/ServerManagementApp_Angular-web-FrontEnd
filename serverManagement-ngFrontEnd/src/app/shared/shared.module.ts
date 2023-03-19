import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from './pipes/filterServerByStatus/filter-by-status.pipe';



@NgModule({
  declarations: [
    FilterByStatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterByStatusPipe
  ],
})
export class SharedModule { }
