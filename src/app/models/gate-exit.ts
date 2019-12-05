import { Guid } from "guid-typescript";

export class GateExitDetails {
    M_GEXIT_LOG_ID: number;
    VEHICLE_NO: string;
    TRUCK_ID: string;
    USER_ID: Guid;
    //STATUS: string;
    REASON_GEXIT: string;
}