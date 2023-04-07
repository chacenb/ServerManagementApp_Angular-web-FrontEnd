import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, startWith } from 'rxjs';
import { ServerService } from '../core/services/apiService/server.service';
import * as mod from '../core/models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../core/services/alertService/alert.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// declare let jsPDF;
import jsPDF from 'jspdf';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  @ViewChild('addNewServerBtn') addNewServerBtn: ElementRef;


  appState$: Observable<mod.AppState<mod.CustomResponse>>;
  readonly dataStates = mod.DataState;
  readonly Statuses = mod.Status;
  StatusesArray = Object.keys(this.Statuses).filter(status => status !== 'ALL');

  private localDataSubj = new BehaviorSubject<mod.CustomResponse>(null); // same as new ReplaySubject<boolean>(1);
  private pingingSubj = new BehaviorSubject<string>('-1'); // same as new ReplaySubject<boolean>(1);
  pinging$ = this.pingingSubj.asObservable();

  pinging: boolean = false;
  pingedServer: number = -1

  whatIsImplementedInThisProject = {
    id: 'functionnalitiesId',
    functionnalities: [
      { title: 'API calls with a reactive approach', description: 'subscribing in the UI using the async pipe', },
      { title: 'Using Observables to filter data', description: '', },
      { title: 'Using custom pipe to filter data', description: '', },
      { title: 'Reactive form IP.address Validators.pattern(xxxxx)', description: 'check if the user has entered a valid IP@ by using a validation pattern ', },
      { title: 'Reactive form control set disabled = true in form declaration', description: '', },
      { title: 'Print table data into PDF : JSPDF library ', description: '', },
      { title: 'auto closable Alert on user actions  ', description: 'alert service + alert component autoclosable', },



    ],
  }

  // alert:AlertService = new AlertService();

  constructor(
    private serverService: ServerService,
    private formBuilder: FormBuilder,
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
        this.alert('Servers retrieved succesfully');
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
        this.alert('Error when fetching the data', 'danger');

        /* build an object of type AppState<CustomResponse> */
        const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error };
        // const tempErrState: mod.AppState<mod.CustomResponse> = { dataState: mod.DataState.ERROR_STATE, error: `${error.name} : ${error.message}` };
        return of(tempErrState);
      }),

    );

    this.initserverForm();
  }


  serverForm: FormGroup = new FormGroup({});

  initserverForm() {
    this.serverForm = this.formBuilder.group({
      ipAddress: [null, [Validators.required, Validators.pattern('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]],
      name: [null, [Validators.required]],
      memory: [null, [Validators.required]],
      type: [null, [Validators.required]],
      status: [mod.Status.SERVER_DOWN],
      // status: [{ value: mod.Status.SERVER_DOWN, disabled: true }],
    });
  }

  get ipAddress() { return this.serverForm.get('ipAddress'); }
  get name() { return this.serverForm.get('name'); }
  get memory() { return this.serverForm.get('memory'); }
  get type() { return this.serverForm.get('type'); }
  get status() { return this.serverForm.get('status'); }


  pingServer(ipAddress: string) {
    /* start spinner using behaviour subject */
    this.start_PingSpinner(ipAddress);

    this.appState$ = this.serverService.ping_server$(ipAddress).pipe(
      map((response) => {
        const alert = (response.data.server.status === this.Statuses.SERVER_UP) ? this.alert('Server is up') : this.alert('Server is down', 'warning');

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
        this.alert('Error when pinging the server', 'danger');
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
    this.appState$ = this.serverService.filter_by_status$(status, this.localDataSubj.value).pipe(
      map((response) => {
        this.alert(`Server filtered by ${status} status`);
        return { dataState: mod.DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value }),
      catchError((error: HttpErrorResponse) => {
        this.alert('Error when filtering servers', 'danger');
        return of({ dataState: mod.DataState.ERROR_STATE, error });
      }),
    );
  }

  start_PingSpinner = (ipAddress: string) => this.pingingSubj.next(ipAddress);
  stop_PingSpinner = () => this.pingingSubj.next('-1');

  private savingServerSubj = new BehaviorSubject<boolean>(false); // same as new ReplaySubject<boolean>(1);
  savingServer$ = this.savingServerSubj.asObservable();

  /* getting the close modal button of the UI via viewChild */
  @ViewChild('closeModalButton') private UI_closeModalButton: ElementRef;

  addNewServer() {
    this.savingServerSubj.next(true);
    this.appState$ = this.serverService.save_server$(this.serverForm.value).pipe(
      map((response) => {
        this.alert(`Server added successfully`);
        /* when new server is added we just update manually the local dataState with the newly created value got from the response */
        let newlyCreatedServer = response.data.server
        const updated_localData = { ...response, data: { servers: [newlyCreatedServer, ...this.localDataSubj.value.data.servers] } };
        this.localDataSubj.next(updated_localData);

        this.savingServerSubj.next(false);
        this.UI_closeModalButton.nativeElement.click();
        this.initserverForm();

        return { dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value };
        // return { dataState: mod.DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value }),
      catchError((error: HttpErrorResponse) => {
        this.alert('Error when saving server', 'danger');
        this.savingServerSubj.next(false);
        return of({ dataState: mod.DataState.ERROR_STATE, error });
      }),
    );
  }


  deleteServer(server: mod.ServerData) {
    this.appState$ = this.serverService.delete_server$(server.id).pipe(
      map((response) => {
        this.alert(`Server deleted successfully`,'warning');
        this.localDataSubj.next(
          /* spread Obj and override a specific property w/ new value */
          { ...response, data: { servers: this.localDataSubj.value.data.servers.filter(s => s.id !== server.id) } }
        );
        return { dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value };
      }),
      startWith({ dataState: mod.DataState.LOADED_STATE, appData: this.localDataSubj.value }),
      catchError((error: HttpErrorResponse) => {
        this.alert('Error when deleting server', 'danger');
        return of({ dataState: mod.DataState.ERROR_STATE, error });
      }),
    );
  }


  @ViewChild('liveAlertPlaceholder') liveAlertPlaceholder;

  // getBase64Image(img) {
  //   var canvas = document.createElement("canvas");
  //   console.log("image");
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   var dataURL = canvas.toDataURL("image/png");
  //   return dataURL;
  // }


  /* getting the close modal button of the UI via viewChild */
  @ViewChild('serversDataTable') private UI_serversDataTable: ElementRef;
  downloadServers() {
    // console.log("UI_serversDataTable", this.UI_serversDataTable.nativeElement.);

    // let doc = new jsPDF();
    // doc.autoTable({ html: this.UI_serversDataTable.nativeElement });
    // doc.output('datauri', 'test.pdf');
  }


  @ViewChild('content', { static: false }) el!: ElementRef;

  makePdf() {
    // window.print();
    let pdf = new jsPDF('l', "pt");
    pdf.html(this.UI_serversDataTable.nativeElement, {
      callback: (pdf) => {
        pdf.save("sample.pdf")
      }
    })
  }

  alert = (message: string = 'default alert message', type?: string) => {
    switch (type) {
      case 'danger': this.alertS.danger(message); break;
      case 'warning': this.alertS.warning(message); break;
      default: this.alertS.success(message); break;
    }
  }

}
