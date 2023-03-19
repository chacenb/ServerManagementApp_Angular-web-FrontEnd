import { Pipe, PipeTransform } from '@angular/core';
import * as models from '../../../core/models/models';

@Pipe({ name: 'filterByStatus' })
export class FilterByStatusPipe implements PipeTransform {

  transform(list: models.ServerData[], filterStatus: models.Status = models.Status.ALL, ...args: unknown[]): unknown {
    return (!filterStatus || (filterStatus === models.Status.ALL)) ? list : list.filter((item) => item.status === filterStatus);
  }

}
