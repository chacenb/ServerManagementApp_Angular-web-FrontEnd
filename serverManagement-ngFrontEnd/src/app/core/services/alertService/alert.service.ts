import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private displayAlert_ = new BehaviorSubject<Alert>({});
  displayAlert$ = this.displayAlert_.asObservable();

  constructor() { }

  trigger = (alertData: Alert) => {
    this.displayAlert_.next(alertData);
  }

  trigger2 = (type: string, message: string) => {
    // let alertData: Alert = { type, message }
    this.displayAlert_.next({ type, message });
  }

  success = (message: string) => {
    // let alertData: Alert = { type, message }
    this.displayAlert_.next({ type:'success', message });
  }

  danger = (message: string) => {
    // let alertData: Alert = { type, message }
    this.displayAlert_.next({ type:'danger', message });
  }




  //   let temp: mod.Alert = { type, message }
  // this.alertS.trigger(temp);

}
