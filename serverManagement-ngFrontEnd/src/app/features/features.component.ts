import { Component, OnInit } from '@angular/core';
import { catchError, delay, map, Observable, of, startWith } from 'rxjs';
import { ServerService } from '../core/services/apiService/server.service';
import * as mod from '../core/models/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  appState$: Observable<mod.AppState<mod.CustomResponse>>;

  constructor(
    private serverService: ServerService
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
      delay(2000),

      /* set initial value while waiting for the http request to complete and provide us w/ the response */
      startWith({ dataState: mod.DataState.LOADING_STATE }),

      /* handle the error  */
      catchError((error: HttpErrorResponse) => {
        /* build an object of type AppState<CustomResponse> */
        const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error: `${error.name} : ${error.message}` };
        return of(tempErrState);
      }),

    )
  }

}
