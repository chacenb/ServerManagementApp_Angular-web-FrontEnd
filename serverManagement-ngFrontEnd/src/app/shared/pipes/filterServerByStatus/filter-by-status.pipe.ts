import { Pipe, PipeTransform } from '@angular/core';
import * as mod from '../../../core/models/models';

@Pipe({ name: 'filterByStatus' })
export class FilterByStatusPipe implements PipeTransform {

  transform(list: mod.ServerData[], filterStatus: mod.Status = mod.Status.ALL, ...args: unknown[]): mod.ServerData[] {
    return (!filterStatus || (filterStatus === mod.Status.ALL)) ? list : list.filter((server) => server.status === filterStatus);
  }

}
