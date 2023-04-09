import { HttpErrorResponse } from "@angular/common/http"

export interface Alert {
    type?: string,
    message?: string
}



/* ******************* ENUMS *********************** */
export enum DataState {
    LOADING_STATE = "LOADING_STATE",
    LOADED_STATE = "LOADED_STATE",
    ERROR_STATE = "ERROR_STATE",
}

export enum Status {
    ALL = "ALL",
    SERVER_UP = "SERVER_UP",
    SERVER_DOWN = "SERVER_DOWN",
}

/* ******************* INTERFACES *********************** */

/* represent the entire application data state at any given moment */
export interface AppState<T> {
    dataState: DataState,
    appData?: T,
    error?: HttpErrorResponse
}

export interface CustomResponse {
    timeStamp: Date,
    statusCode: number,
    status: string,
    reason?: string,
    message: string
    developperMessage: string,
    data: { servers?: ServerData[], server?: ServerData } // we can have either xx or xxx in 'data' Property
}

// export interface ServerListWsResult extends ServerResponse { data: Server[] }
// export interface ServerWsResult extends ServerResponse { data: Server }

export interface ServerData {
    id?: number,
    imageUrl?: string,
    ipAddress: string,
    memory: string,
    name: string,
    status: Status
    type: string,
}

