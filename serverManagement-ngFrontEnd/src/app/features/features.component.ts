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

  private localDataSubj = new BehaviorSubject<mod.CustomResponse>(null); // same as new ReplaySubject<boolean>(1);
  private pingingSubj = new BehaviorSubject<string>('-1'); // same as new ReplaySubject<boolean>(1);
  pinging$ = this.pingingSubj.asObservable();

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
    this.appState$ = this.serverService.get_all_servers$().pipe(

      map((response) => {
        /* save the response locally for future updates */
        this.localDataSubj.next(response);

        /* build an object of type AppState<CustomResponse> to return*/
        const tempAppState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.LOADED_STATE, appData: response };
        return tempAppState;
      }),

      /* set initial value while waiting for the http request to complete and provide us w/ the response */
      startWith({ dataState: mod.DataState.LOADING_STATE }),

      /* handle the error  */
      catchError((error: HttpErrorResponse) => {
        /* build an object of type AppState<CustomResponse> */
        const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error };
        // const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error: `${error.name} : ${error.message}` };
        return of(tempErrState);
      }),

    );
  }


  pingServer(ipAddress: string) {
    /* start spinner using behaviour subject */
    this.start_PingSpinner(ipAddress);

    this.appState$ = this.serverService.ping_server$(ipAddress).pipe(
      map((response) => {

        /* from our local data previously saved, find the index of the server we are pinging ...*/
        const indexOfCurrServer = this.localDataSubj.value.data.servers.findIndex(server => server.id == response.data.server.id);

        /* replace that server in the local array (localDataSubj) w/ the server returned by backend ping method */
        this.localDataSubj.value.data.servers[indexOfCurrServer] = response.data.server

        /* stop the spinner */
        this.stop_PingSpinner();

        /* return the updated localDataSubj */
        return { dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value };
      }),

      /* set initial value while waiting for the http request to complete and provide us w/ the response */
      startWith({ dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value }),

      /* handle the error  */
      catchError((error: HttpErrorResponse) => {
        this.stop_PingSpinner();
        return of({ dataState: mod.DataState.ERROR_STATE, error });
      }),

    );



  }

  filterStatus: mod.Status = mod.Status.ALL;

  /* filtering using filter Observable : 100% WORKING */
  /** this func calls the filter Observable and passes 
   * the filter by which we want to filter and the data to be filtered 
   * @param status the status by which data will be filtered
   */
  filterServers(status: mod.Status) {
    console.log("filterServers(status: mod.Status) ", status);

    this.appState$ = this.serverService.filter_by_status$(status, this.localDataSubj.value).pipe(
      map((response) => {
        return { dataState: mod.DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value }),
      catchError((error: HttpErrorResponse) => {
        return of({ dataState: mod.DataState.ERROR_STATE, error });
      }),
    );
  }

  start_PingSpinner = (ipAddress: string) => this.pingingSubj.next(ipAddress);
  stop_PingSpinner = () => this.pingingSubj.next('-1');


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
