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
    PRE_STATUS: string;
    CUR_STATUS: string;
    BAY: string;
    VENDOR: string;
    DRIVER_DETAILS: string;
    EXCEPTION_MESSAGE: string;
    ISEXCEPTION: Boolean;
    ISACTIVE: Boolean;
    // [Key]
    // public int TRANS_ID { get; set; }
    // [Required]
    // public string TRUCK_ID { get; set; }
    // [Required]
    // public string VEHICLE_NO { get; set; }
    // public string TYPE { get; set; }
    // public DateTime? GENTRY_TIME { get; set; }
    // public DateTime? GEXIT_TIME { get; set; }
    // public DateTime? LENTRY_TIME { get; set; }
    // public DateTime? LEXIT_TIME { get; set; }
    // public DateTime? ULENTRY_TIME { get; set; }
    // public DateTime? ULEXIT_TIME { get; set; }
    // public DateTime? PENTRY_TIME { get; set; }
    // public DateTime? PEXIT_TIME { get; set; }
    // public string PRE_STATUS { get; set; }
    // public string CUR_STATUS { get; set; }
    // public string BAY { get; set; }
    // public string VENDOR { get; set; }
    // public string DRIVER_DETAILS { get; set; }
    // public bool ISACTIVE { get; set; }
}

export class CommonFilters
{
    UserID: Guid;
    FROMDATE?: string;
    TODATE?: string;
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
    ISACTIVE: Boolean;
    TRANSPORTER_NAME: string;
    LINE_NUMBER: string;
    CUSTOMER_NAME: string;
    TRANSACTION_ID: string;
    FG_DESCRIPTION: string;
    // [Key]
    // public int TRANS_ID { get; set; }
    // [Required]
    // public string TRUCK_ID { get; set; }
    // [Required]
    // public string VEHICLE_NO { get; set; }
    // public string TYPE { get; set; }
    // public DateTime? GENTRY_TIME { get; set; }
    // public DateTime? GEXIT_TIME { get; set; }
    // public DateTime? LENTRY_TIME { get; set; }
    // public DateTime? LEXIT_TIME { get; set; }
    // public DateTime? ULENTRY_TIME { get; set; }
    // public DateTime? ULEXIT_TIME { get; set; }
    // public DateTime? PENTRY_TIME { get; set; }
    // public DateTime? PEXIT_TIME { get; set; }
    // public string PRE_STATUS { get; set; }
    // public string CUR_STATUS { get; set; }
    // public string BAY { get; set; }
    // public string VENDOR { get; set; }
    // public string DRIVER_DETAILS { get; set; }
    // public bool ISACTIVE { get; set; }
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
    ISACTIVE: Boolean;
    TRANSPORTER_NAME: string;
    LINE_NUMBER: string;
    CUSTOMER_NAME: string;
    TRANSACTION_ID: string;
    FG_DESCRIPTION: string;

    // [Key]
    // public int TRANS_ID { get; set; }
    // [Required]
    // public string TRUCK_ID { get; set; }
    // [Required]
    // public string VEHICLE_NO { get; set; }
    // public string TYPE { get; set; }
    // public DateTime? GENTRY_TIME { get; set; }
    // public DateTime? GEXIT_TIME { get; set; }
    // public DateTime? LENTRY_TIME { get; set; }
    // public DateTime? LEXIT_TIME { get; set; }
    // public DateTime? ULENTRY_TIME { get; set; }
    // public DateTime? ULEXIT_TIME { get; set; }
    // public DateTime? PENTRY_TIME { get; set; }
    // public DateTime? PEXIT_TIME { get; set; }
    // public string PRE_STATUS { get; set; }
    // public string CUR_STATUS { get; set; }
    // public string BAY { get; set; }
    // public string VENDOR { get; set; }
    // public string DRIVER_DETAILS { get; set; }
    // public bool ISACTIVE { get; set; }
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
