import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { ServerService } from '../core/services/apiService/server.service';
import * as mod from '../core/models/models';

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

    /* building the application state Observable to be used */
    this.appState$ = this.serverService.get_all_servers$.pipe(
      map((response) => {
        /* build an object of type AppState<CustomResponse> to return*/
        const tempAppState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.LOADED_STATE, appData: response };
        return tempAppState;
      }),

      /* set initial value while waiting for the http request to complete and provide us w/ the response */
      startWith({ dataState: mod.DataState.LOADING_STATE }),

      catchError((error: string) => {
        /* build an object of type AppState<CustomResponse> */
        const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error };
        return of(tempErrState);
      }),

    )
  }

}
