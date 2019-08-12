import { Guid } from 'guid-typescript';

export class GatewayStatusDetails {
    GATEWAY_ID: string;
    ON_OFF_STATUS: string;
    TYPE: string;
    TRUCK_DETAILS:string;
    CREATED_ON?: Date;
    MODIFIED_ON?: Date;
    IP:string;
}
// tb.GATEWAY_ID,
// tb.CREATED_ON,
// tb.CREATED_BY,
// tb.MODIFIED_ON,
// tb.MODIFIED_BY,
// tb.ON_OFF_STATUS,
// tb.ISACTIVE,
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
    VEHICLE_NO: string;
}
//          public Guid UserID { get; set; }
// public string CUSTOMER { get; set; }
// public string CONTAINER { get; set; }
// public DateTime FROMDATE { get; set; }
// public DateTime TODATE { get; set; }


    // public int ITEM_ID { get; set; }
    // public int TRANS_ID { get; set; }
    // public string BLE_ID { get; set; }
    // public string CUSTOMER_NO { get; set; }
    // public string TRANSPORTER { get; set; }
    // public string PLANT { get; set; }
    // public string CONTAINER_NO { get; set; }
    // public string CONTAINER_SIZE { get; set; }
    // public string DESIGN { get; set; }
    // public string TYPE { get; set; }
    // public string COLOR { get; set; }
    // public string IS_DAMAGE { get; set; }
    // public string CLEAN_TYPE { get; set; }
    // public string SEAL_NUMBER { get; set; }
    // public string LOCATION_ID { get; set; }
    // public string RELEASE_ORDER_NUMBER { get; set; }
    // public DateTime? ENTRY_TIME { get; set; }
    // public DateTime? EXIT_TIME { get; set; }
    // public string CUR_STATUS { get; set; }
    // public string FLAG { get; set; }
    // public bool ISACTIVE { get; set; }
    // public string DRIVER_NAME { get; set; }
    // public string DRIVER_DOB { get; set; }
    // public string LICENSE_NUMBER { get; set; }
    // public string LICENSE_EXPIRY { get; set; }
    // public string HELPER_NAME { get; set; }
    // public string HELPER_DOB { get; set; }
    // public string HELPER_ID_EXPIRY { get; set; }
    // public string TRANSPORT_VENDOR { get; set; }
    // public string RETURNABLE_GOODS { get; set; }
    // public string GATE_NUMBER { get; set; }
    // public string TRANSACTION_TYPE { get; set; }
