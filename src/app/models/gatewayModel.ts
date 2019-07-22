export class ConfigurationObj {
    // TRUCKID: number;
    // LAT: string;
    // LON: string;
    // ISACTIVE: boolean;
    // CREATED_ON: Date;
    ID: number;
    TYPE: string; 
    STATION: string;
    ENTRY_ID: string;
    EXIT_ID: string;
    CREATED_BY: string;
    CREATED_ON: Date;
    PLANT: string;
}
export class QApproveObj {
    // TRUCKID: number;
    // LAT: string;
    // LON: string;
    // ISACTIVE: boolean;
    // CREATED_ON: Date;
    REQUEST_ID: number;
    USER: string;
    REQUEST_TYPE: string;
    SELECTED_ITEM: string;
    REQUEST_COMMENT: string;
    APPROVE_COMMENT: string;
    CREATED_ON: Date;
    STATUS: string;
    
}
export class GPSTrackingObj {
    TRUCK_ID: number;
    LAT: string;
    LON: string;
    ISACTIVE: boolean;
    CREATED_ON: Date;
}
export class QRequestObj {
    REQUEST_ID: number;
    USER: string;
    REQUEST_TYPE: string;
    SELECTED_ITEM: string;
    REQUEST_COMMENT: string;
}

export class StationConfigurationDetails {
    ID: number;
    TYPE: string; 
    STATION: string;
    STATION_DESCRIPTION: string;
    PLANT: string;
    CREATED_BY: string;
    CREATED_ON: Date;
    ISACTIVE: boolean;
}

