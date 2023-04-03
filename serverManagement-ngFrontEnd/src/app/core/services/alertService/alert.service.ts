import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private triggerAlert_ = new BehaviorSubject<Alert>({});
  triggerAlert$ = this.triggerAlert_.asObservable();

  constructor() { }

  // trigger = (alertData: Alert) => { this.triggerAlert_.next(alertData); }
  // trigger2 = (type: string, message: string) => { this.triggerAlert_.next({ type, message }); }

  success = (message: string) => { this.triggerAlert_.next({ type: 'success', message }); }
  danger = (message: string) => { this.triggerAlert_.next({ type: 'danger', message }); }
  warning = (message: string) => { this.triggerAlert_.next({ type: 'warning', message }); }

}
