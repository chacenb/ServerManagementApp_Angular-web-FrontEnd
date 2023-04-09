import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { stat } from 'fs';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import * as mod from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl: string = 'http://localhost:8080/api/v2/server';

  constructor(
    private http: HttpClient,
  ) { }

  get_all_servers$ = () => this.http.get<mod.CustomResponse>(`${this.apiUrl}/list`).pipe(
    retry(3),
    tap((data) => { console.log('[API] > get_all_servers > tap :', data); }),
    catchError(this.handleError)
  );

  get_server_by_id$ = (id: number) => this.http.get<mod.CustomResponse>(`${this.apiUrl}/get/${id}`).pipe(
    retry(3),
    tap((data) => { console.log('[API] > get_server_by_id > tap :', data); }),
    catchError(this.handleError)
  );

  get_server_image$ = (imgName: string) => this.http.get<any>(`${this.apiUrl}/image/${imgName}`).pipe(
    retry(3),
    tap((data) => { console.log('[API] > get_server_image > tap :', data); }),
    catchError(this.handleError)
  );

  ping_server$ = (ipAddress: string) => this.http.get<mod.CustomResponse>(`${this.apiUrl}/ping/${ipAddress}`).pipe(
    retry(3),
    tap((data) => { console.log('[API] > ping_server > tap :', data); }),
    catchError(this.handleError)
  );

  save_server$ = (server: mod.ServerData) => this.http.post<mod.CustomResponse>(`${this.apiUrl}/save`, server).pipe(
    tap((data) => { console.log('[API] > save_server > tap :', data); }),
    catchError(this.handleError)
  );

  delete_server$ = (serverId: number) => this.http.delete<mod.CustomResponse>(`${this.apiUrl}/delete/${serverId}`).pipe(
    tap((data) => { console.log('[API] > delete_server > tap :', data); }),
    catchError(this.handleError)
  );

  /**
   * method to filter servers and return an Observ. of the filtered servers
   * @param status status by whixh the user wants to filter the servers
   * @param response Data to filter
   * @returns an observable of filtered servers
  */
  filter_by_status$ = (status: mod.Status, response: mod.CustomResponse) => new Observable<mod.CustomResponse>(

    /*  Observables should define a subscriber function that is executed when a consumer calls the subscribe() method. 
     * The subscriber function defines how to obtain/generate values to be published to the consumer.*/
    (subscriber) => {

      // in this case, this Observable synchronously delivers filtered servers, then complete
      subscriber.next(
        status === mod.Status.ALL ?
          { ...response, message: `servers filtered by ${status} status` } :
          {
            ...response,
            message: response?.data?.servers.filter(server => (server?.status === status))?.length < 0 ?
              `No server of status ${status === mod.Status.SERVER_DOWN ? 'SERVER DOWN' : 'SERVER UP'} found` :
              `servers filtered by ${status === mod.Status.SERVER_DOWN ? 'SERVER DOWN' : 'SERVER UP'} status`,
            data: { servers: response?.data?.servers.filter(server => server.status === status), }
          }
      );

      /* if errors during execution of subscriber function : NO subscriber.error() cause we control the result of the subscription manually*/
      // subscriber.error('Error occured when filtering data');

      /* complete the execution */
      subscriber.complete();

      /* return is called when unsubscribe the observable
       function doesn't need to do anything in this case, cause values are delivered synchronously */
      return { unsubscribe() { } };
    }
  ).pipe(
    tap((data) => { console.log('[API] > filter_by_status > tap :', data); }),
    catchError(this.handleError)
  );

  /* the error handler func just rethrows the error to get caller  */
  private handleError(err: HttpErrorResponse): Observable<never> {
    console.error(`[API] > error`, err);
    return throwError(() => err);
  }
}




