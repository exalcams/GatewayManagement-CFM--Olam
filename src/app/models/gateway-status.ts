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

