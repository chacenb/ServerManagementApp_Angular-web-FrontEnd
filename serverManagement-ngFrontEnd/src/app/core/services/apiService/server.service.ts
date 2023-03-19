import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { catchError, Observable, tap, throwError } from 'rxjs';
import * as mod from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl: string = 'http://localhost:8080/api/v2/server';

  constructor(
    private http: HttpClient,
  ) { }

  get_all_servers$ = this.http.get<mod.CustomResponse>(`${this.apiUrl}/list`).pipe(
    tap((data) => { console.log('[API] > get_all_servers > tap :', data); }),
    catchError(this.handleError)
  );

  get_server_by_id$ = (id: number) => this.http.get<mod.CustomResponse>(`${this.apiUrl}/get/${id}`).pipe(
    tap((data) => { console.log('[API] > get_server_by_id > tap :', data); }),
    catchError(this.handleError)
  );

  get_server_image$ = (imgName: string) => this.http.get<any>(`${this.apiUrl}/image/${imgName}`).pipe(
    tap((data) => { console.log('[API] > get_server_image > tap :', data); }),
    catchError(this.handleError)
  );

  ping_server$ = (ipAddress: string) => this.http.get<mod.CustomResponse>(`${this.apiUrl}/ping/${ipAddress}`).pipe(
    tap((data) => { console.log('[API] > ping_server > tap :'); }),
    catchError(this.handleError)
  );

  save_server$ = (server: mod.ServerData) => this.http.post<mod.CustomResponse>(`${this.apiUrl}/save`, server).pipe(
    tap((data) => { console.log('[API] > save_server > tap :', data); }),
    catchError(this.handleError)
  );

  delete_server$ = (id: number) => this.http.delete<mod.CustomResponse>(`${this.apiUrl}/delete/${id}`).pipe(
    tap((data) => { console.log('[API] > delete_server > tap :'); }),
    catchError(this.handleError)
  );

  filter_by_status$ = (status: mod.Status, response: mod.CustomResponse) => new Observable<mod.CustomResponse>(
    subscriber => {
      console.log('[API] > filter_by_status$ > response :', response);
      subscriber.next(
        /* Obj1 = {a: "A1", b: "B1"} >> spread & override properties >> Obj2 = {...Obj1, a: "A2"}; */
        status === mod.Status.ALL ?
          { ...response, message: `servers filtered by ${status} status` } :
          {
            ...response,
            message: response.data.servers.filter(server => (server.status === status)).length < 0 ?
              `No server of status ${status === mod.Status.SERVER_DOWN ? 'SERVER DOWN' : 'SERVER UP'} found` :
              `servers filtered by ${status === mod.Status.SERVER_DOWN ? 'SERVER DOWN' : 'SERVER UP'} status`,
            data: { servers: response.data.servers.filter(server => server.status === status), }
          }
      );
      subscriber.complete();
    }
  ).pipe(
    tap((data) => { console.log('[API] > filter_by_status > tap :'); }),
    catchError(this.handleError)
  );

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.log(err);
    return throwError(() => new Error(`[API] > ERROR : ${err.status}`));
  }



  // get_business_all_department_workflowSteps(idBusiness: number): Observable<BusinessWorkflowStepsSearchWsResult> {
  //   let url = `${URL_BUSINESSES}/${idBusiness}/workflow-steps`;
  //   return this.http.get<BusinessWorkflowStepsSearchWsResult>(url).pipe(
  //     tap((data) => { console.log('[API]> get_business_all_department_workflowSteps > tap :', data); })
  //   );
  // }

  // public save_company_department(companyId: number, Obj: any): Observable<DepartmentDTO> {
  //   let url = `${URL_COMPANY}/${companyId}/departments`;
  //   return this.http.post<DepartmentDTO>(url, JSON.stringify(Obj)).pipe(
  //     tap((data) => {
  //       console.log('[API]> save_company_department > tap :', data);
  //       this._refreshrequired.next(); // implementing the auto refresh after save
  //     })
  //   );
  // }

  // public delete_company_department_by_id(companyId: number, departId: number): Observable<DeleteWsResult> {
  //   let url = `${URL_COMPANY}/${companyId}/departments/${departId}`;
  //   return this.http.delete<DeleteWsResult>(url).pipe(
  //     tap((data) => {
  //       console.log('[API]> delete_company_department_by_id > tap :', data);
  //       this._refreshrequired.next(); // implementing the auto refresh after delete
  //     })
  //   );
  // }


}
