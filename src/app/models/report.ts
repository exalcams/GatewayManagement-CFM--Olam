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
    FG_DESCRIPTION: string;

    BAY: string;
    VENDOR: string;
    DRIVER_DETAILS: string;
    DRIVER_NO: string;
    EXCEPTION_MESSAGE: string;
    CUSTOMER_ID: string;
    ISEXCEPTION: Boolean;
    ISACTIVE: Boolean;
    TRANSPORTER_NAME: string;
    CUSTOMER_NAME: string;
    MATERIAL: string;
    TRANSACTION_ID: string;

    REFERENCE: string;
    TOTAL_GATE_DURATION: string;
    TOTAL_PARKING_DURATION: string;
    ATL_ASSIGN_DURATION: string;
    BAY_ASSIGN_DURATION: string;
    TOTAL_LOADING_DURATION: string;
    TOTAL_UNLOADING_DURATION: string;
    TOTAL_WEIGHMENT1_DURATION: string;
    TOTAL_WEIGHMENT2_DURATION: string;
    WEIGHMENT2_GEXIT_DURATION: string;
    REMARKS: string;

    GENTRY_DATE?: Date;
    GEXIT_DATE?: Date;
    PENTRY_DATE?: Date;
    PEXIT_DATE?: Date;
    LENTRY_DATE?: Date;
    LEXIT_DATE?: Date;
    ULENTRY_DATE?: Date;
    ULEXIT_DATE?: Date;
    W1ENTRY_DATE?: Date;
    W1EXIT_DATE?: Date;
    W2ENTRY_DATE?: Date;
    W2EXIT_DATE?: Date;

    ATL_ASSIGN_TIME?: Date;
    BAY_ASSIGN_TIME?: Date;
    ATL_ASSIGN_DATE?: Date;
    BAY_ASSIGN_DATE?: Date;

    GENTRY_TIME_ONLY: String;
    GEXIT_TIME_ONLY: String;
    GENTRY_DATE_ONLY: String;
    GEXIT_DATE_ONLY: String;

    ATL_ASSIGN_DATE_ONLY: String;
    ATL_ASSIGN_TIME_ONLY: String;
    BAY_ASSIGN_DATE_ONLY: String;
    BAY_ASSIGN_TIME_ONLY: String;

    PENTRY_TIME_ONLY: String;
    PEXIT_TIME_ONLY: String;
    PENTRY_DATE_ONLY: String;
    PEXIT_DATE_ONLY: String;

    W1ENTRY_TIME_ONLY: String;
    W1EXIT_TIME_ONLY: String;
    W1ENTRY_DATE_ONLY: String;
    W1EXIT_DATE_ONLY: String;

    LENTRY_TIME_ONLY: String;
    LEXIT_TIME_ONLY: String;
    LENTRY_DATE_ONLY: String;
    LEXIT_DATE_ONLY: String;

    W2ENTRY_TIME_ONLY: String;
    W2EXIT_TIME_ONLY: String;
    W2ENTRY_DATE_ONLY: String;
    W2EXIT_DATE_ONLY: String;

    ULENTRY_TIME_ONLY: String;
    ULEXIT_TIME_ONLY: String;
    ULENTRY_DATE_ONLY: String;
    ULEXIT_DATE_ONLY: String;

    TOTAL_PARKING_TIME_HMS: string;
    TOTAL_WEIGHMENT1_TIME_HMS: string;
    TOTAL_LOADING_TIME_HMS: string;
    TOTAL_UNLOADING_TIME_HMS: string;
    TOTAL_WEIGHMENT2_TIME_HMS: string;
    TOTAL_WEIGHMENT2GEXIT_TIME_HMS: string;
    TOTAL_GATE_TIME_HMS: string;
    TOTAL_GENTRY_ATLASSIGN_TIME_HMS: string;
    TOTAL_ATL_BAYASSIGN_TIME_HMS: string;
}

export class StageWiseReportDetails {

    AVG_GATE_TIME: string;
    AVG_PARKING_TIME: string;
    AVG_LOADING_TIME: string;
    AVG_UNLOADING_TIME: string;
    AVG_WEIGHMENT1_TIME: string;
    AVG_WEIGHMENT2_TIME: string;

}

export class ReportFilters {
    UserID: Guid;
    FROMDATE?: string;
    TODATE?: string;
    ON_OR_OFF: string;
    PLANT: string;
    VEHICLE_NO: string;
}