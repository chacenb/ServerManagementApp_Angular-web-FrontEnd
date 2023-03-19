import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import * as models from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl: string = 'http://localhost:8080/api/v2/server';

  constructor(
    private http: HttpClient,
  ) { }

  get_all_servers$ = this.http.get<models.CustomResponse>(`${this.apiUrl}/list`).pipe(
    tap((data) => { console.log('[API]> get_all_servers > tap :', data); }),
    catchError(this.handleError)
  );

  get_server_by_id$ = (id: number) => this.http.get<models.CustomResponse>(`${this.apiUrl}/get/${id}`).pipe(
    tap((data) => { console.log('[API]> get_server_by_id > tap :', data); }),
    catchError(this.handleError)
  );

  get_server_image$ = (imgName: string) => this.http.get<any>(`${this.apiUrl}/image/${imgName}`).pipe(
    tap((data) => { console.log('[API]> get_server_image > tap :', data); }),
    catchError(this.handleError)
  );

  ping_server$ = (ipAddress: string) => this.http.get<models.CustomResponse>(`${this.apiUrl}/ping/${ipAddress}`).pipe(
    tap((data) => { console.log('[API]> ping_server > tap :'); }),
    catchError(this.handleError)
  );

  save_server$ = (server: models.ServerData) => this.http.post<models.CustomResponse>(`${this.apiUrl}/save`, server).pipe(
    tap((data) => { console.log('[API]> save_server > tap :', data); }),
    catchError(this.handleError)
  );

  delete_server$ = (id: number) => this.http.delete<models.CustomResponse>(`${this.apiUrl}/delete/${id}`).pipe(
    tap((data) => { console.log('[API]> delete_server > tap :'); }),
    catchError(this.handleError)
  );

  







  private handleError(err: HttpErrorResponse): Observable<never> {
    console.log(err);
    return throwError(() => new Error(`An err occured ${err.status}`));
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