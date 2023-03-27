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

  alertData: Alert = {}
  triggerAlert$: Observable<Alert>;

  private displayAlert_ = new BehaviorSubject<boolean>(false);
  displayAlert$ = this.displayAlert_.asObservable();

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.triggerAlert$ = this.alertService.displayAlert$.pipe(
      map((response) => {
        this.setVisible_startCountdown();
        return response
      }),
      startWith({})
    )

    // this.displayAlert_.next(this.triggerAlert);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes', changes);
  //   this.startCountdown();
  // }

  visibleTimeoutId = null;
  setVisible_startCountdown = () => {
    this.displayAlert_.next(true);
    if (this.visibleTimeoutId) clearTimeout(this.visibleTimeoutId);
    this.visibleTimeoutId = setTimeout(() => { this.displayAlert_.next(false); }, 3000)
  };


}
