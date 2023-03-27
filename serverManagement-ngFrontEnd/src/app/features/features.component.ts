import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, startWith } from 'rxjs';
import { ServerService } from '../core/services/apiService/server.service';
import * as mod from '../core/models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../core/services/alertService/alert.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  appState$: Observable<mod.AppState<mod.CustomResponse>>;
  readonly dataStates = mod.DataState;
  readonly Statuses = mod.Status;

  private pinging_ = new BehaviorSubject<number>(-1); // same as new ReplaySubject<boolean>(1);
  pinging$ = this.pinging_.asObservable();

  pinging: boolean = false;
  pingedServer: number = -1

  // alert:AlertService = new AlertService();

  constructor(
    private serverService: ServerService,
    public alertS: AlertService
  ) { }

  ngOnInit(): void {

    /*  REACTIVE APPROCH 
    - building data Observable in the .ts file
    - subscribing inside the UI file using the async pipe
    ------------------------------------
    NOTE : return Objs of each pipe operator SHOULD BE OF SAME TYPE AS appState$
    */
    this.appState$ = this.serverService.get_all_servers$.pipe(

      map((response) => {
        /* build an object of type AppState<CustomResponse> to return*/
        const tempAppState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.LOADED_STATE, appData: response };
        return tempAppState;
      }),

      /* delay the return of the response */
      // delay(2000),

      /* set initial value while waiting for the http request to complete and provide us w/ the response */
      startWith({ dataState: mod.DataState.LOADING_STATE }),

      /* handle the error  */
      catchError((error: HttpErrorResponse) => {
        /* build an object of type AppState<CustomResponse> */
        const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error: `${error.name} : ${error.message}` };
        return of(tempErrState);
      }),

    );
  }


  pingServer(id: number) {
    this.pinging_.next(id);
    setTimeout(() => { this.pinging_.next(-1); }, 2000);
  }

  addNewServer() {
    console.log('ADDING new server');

  }

  @ViewChild('liveAlertPlaceholder') liveAlertPlaceholder;

  // const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

  // const alert = (message, type) => {
  //   const wrapper = document.createElement('div')
  //   wrapper.innerHTML = [
  //     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
  //     `   <div>${message}</div>`,
  //     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
  //     '</div>'
  //   ].join('')

  //   alertPlaceholder.append(wrapper)
  // }

  // const alertTrigger = document.getElementById('liveAlertBtn')
  // if(alertTrigger) {
  //   alertTrigger.addEventListener('click', () => {
  //     alert('Nice, you triggered this alert message!', 'success')
  //   })
  // }


  triggerAlert = (type: string, message: string) => {
    let temp: mod.Alert = { type, message }
    this.alertS.trigger(temp);
  }

}
