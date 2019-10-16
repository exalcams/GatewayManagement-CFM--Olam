import { Guid } from "guid-typescript";

export class TransactionDetails {
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
    REFERENCE: string;

    GENTRY_DATE?: Date;

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

    STATUS_DESCRIPTION: string;
    TAT_TIME: string;
}
export class CommonFilters {
    UserID: Guid;
    FROMDATE?: string;
    TODATE?: string;
    FILTER_NAME: string;
    ON_OR_OFF: string;
    PLANT: string;
    VEHICLE_NO: string;
}
export class QueueDetails {
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
    PRE_STATUS: string;
    CUR_STATUS: string;
    BAY: string;
    VENDOR: string;
    DRIVER_DETAILS: string;
    DRIVER_NO: string;
    ISACTIVE: Boolean;
    TRANSPORTER_NAME: string;
    LINE_NUMBER: string;
    CUSTOMER_NAME: string;
    TRANSACTION_ID: string;
    FG_DESCRIPTION: string;
    BAY_NAME: string;
    BAY_GROUP: string;
    CREATED_ON?: Date;
    STATUS_DESCRIPTION: string;
}
export class StackDetails {
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
    PRE_STATUS: string;
    CUR_STATUS: string;
    BAY: string;
    VENDOR: string;
    DRIVER_DETAILS: string;
    DRIVER_NO: string;
    ISACTIVE: Boolean;
    TRANSPORTER_NAME: string;
    LINE_NUMBER: string;
    CUSTOMER_NAME: string;
    TRANSACTION_ID: string;
    FG_DESCRIPTION: string;
    BAY_NAME: string;
    BAY_GROUP: string;
    CREATED_ON?: Date;
    STATUS_DESCRIPTION: string;
}
export class TransDetailsByID {
    TransactionDetails: TransactionDetails;
    DateDiffrence: string;
}
export class ExceptionDetails {
    ID: number;
    TRUCK_ID: string;
    VEHICLE_NO: string;
    PLANT: string;
    CREATED_ON?: Date;
    EXCEPTION_MESSAGE: string;
    ISACTIVE: Boolean;
}

export class DailyTATDetails {
    LESSER_FOUR_COUNT: number;
    GREATER_EIGHT_COUNT: number;
    BETWEEN_FOUR_EIGHT_COUNT: number;
    TOTAL_VEHICLES_COUNT: number;
    AVG_DAILY_TAT: string;
    MIN_DAILY_TAT: string;
    MAX_DAILY_TAT: string;
}
export class WeeklyTATDetails{
    LESSER_FOUR_COUNT: number;
    GREATER_EIGHT_COUNT: number;
    BETWEEN_FOUR_EIGHT_COUNT: number;
    TOTAL_VEHICLES_COUNT: number;
    AVG_WEEKLY_TAT: string;
    MIN_WEEKLY_TAT: string;
    MAX_WEEKLY_TAT: string;
}

export class MonthlyTATDetails{
    LESSER_FOUR_COUNT: number;
    GREATER_EIGHT_COUNT: number;
    BETWEEN_FOUR_EIGHT_COUNT: number;
    TOTAL_VEHICLES_COUNT: number;
    AVG_MONTHLY_TAT: string;
    MIN_MONTHLY_TAT: string;
    MAX_MONTHLY_TAT: string;
}

