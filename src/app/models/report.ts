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
    LEXIT_TIME?: Date;
    ULENTRY_TIME?: Date;
    ULEXIT_TIME?: Date;
    W1ENTRY_TIME?: Date;
    W1EXIT_TIME?: Date;
    W2ENTRY_TIME?: Date;
    W2EXIT_TIME?: Date;
    PRE_STATUS: string;
    CUR_STATUS: string;

    REFERENCE:string;
    TOTAL_GATE_DURATION: string;
    TOTAL_PARKING_DURATION: string;
    ATL_ASSIGN_DURATION: string;
    BAY_ASSIGN_DURATION: string;
    TOTAL_LOADING_DURATION: string;
    TOTAL_UNLOADING_DURATION: string;
    TOTAL_WEIGHMENT1_DURATION: string;
    TOTAL_WEIGHMENT2_DURATION: string;
    WEIGHMENT2_GEXIT_DURATION: string;

    GENTRY_DATE?:Date;
    GEXIT_DATE?:Date;
    PENTRY_DATE?:Date;
    PEXIT_DATE?:Date;
    LENTRY_DATE?:Date;
    LEXIT_DATE?:Date;
    ULENTRY_DATE?:Date;
    ULEXIT_DATE?:Date;
    W1ENTRY_DATE?:Date;
    W1EXIT_DATE?:Date;
    W2ENTRY_DATE?:Date;
    W2EXIT_DATE?:Date;

    ATL_ASSIGN_TIME?:Date;
    BAY_ASSIGN_TIME?:Date;
    ATL_ASSIGN_DATE?:Date;
    BAY_ASSIGN_DATE?:Date;

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