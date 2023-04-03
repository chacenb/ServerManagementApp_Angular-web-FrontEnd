import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { Alert } from 'src/app/core/models/models';
import { AlertService } from 'src/app/core/services/alertService/alert.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class AlertComponent implements OnInit { /* , OnChanges */

  // alertData: Alert = {}
  triggerAlert$: Observable<Alert>;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.triggerAlert$ = this.alertService.triggerAlert$.pipe(
      map((response) => {
        this.setVisible_startCountdown();
        return response
      }),
      startWith({})
    )
  }


  visibleTimeoutId = null;
  private display = new BehaviorSubject<boolean>(false);
  display$ = this.display.asObservable();

  setVisible_startCountdown = () => {
    this.display.next(true);
    if (this.visibleTimeoutId) clearTimeout(this.visibleTimeoutId);
    this.visibleTimeoutId = setTimeout(() => { this.display.next(false); }, 3000)
  };


}
