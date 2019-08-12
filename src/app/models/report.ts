import { Guid } from 'guid-typescript';

export class TransactionReportDetails {
    TRANS_ID: number;
    TRUCK_ID: string;
    VEHICLE_NO: string;
    TYPE: string;
    GENTRY_TIME?: Date;
    GEXIT_TIME?: Date;
    PENTRY_TIME?: Date;
    PEXIT_TIME?: Date;
    LENTRY_TIME?: Date;
    TIME_OF_ENTRY?:Date;
    TIME_OF_EXIT?:Date;
    LEXIT_TIME?: Date;
    ULENTRY_TIME?: Date;
    ULEXIT_TIME?: Date;
    PRE_STATUS: string;
    CUR_STATUS: string;
    BAY: string;
    VENDOR: string;
    DRIVER_DETAILS: string;
    EXCEPTION_MESSAGE: string;
    CUSTOMER_ID: string;
    ISEXCEPTION: Boolean;
    ISACTIVE: Boolean;
}
export class StageWiseReportDetails {

    AVG_GATE_TIME: string;
    AVG_PARKING_TIME: string;
    AVG_LOADING_TIME: string;
    AVG_UNLOADING_TIME: string;
    AVG_WEIGHMENT1_TIME: string;
    AVG_WEIGHMENT2_TIME: string;

}
export class ReportFilters
{
    UserID: Guid;
    FROMDATE?: string;
    TODATE?: string;
    ON_OR_OFF: string;
    PLANT: string;
    VEHICLE_NO: string; 
}