export class ConfigurationDetails {
    ID: number;
    TYPE: string;
    STATION: string;
    ENTRY_ID: string;
    EXIT_ID: string;
    CREATED_BY: string;
    CREATED_ON: Date;
    PLANT: string;
}

export class QApproveDetails {
    REQUEST_ID: number;
    USER: string;
    REQUEST_TYPE: string;
    SELECTED_ITEM: string;
    REQUEST_COMMENT: string;
    APPROVE_COMMENT: string;
    CREATED_ON: Date;
    STATUS: string;
}

export class QRequestDetails {
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

export class BayQueueConfigDetails {
    ID: number;
    BAY_GROUP: string;
    BAY_NAME: string;
    BAY_TYPE: string;
    PLANT: string;
    NO_OF_TRUCKS: string;
    CREATED_BY: string;
    STATUS: string;
    CREATED_ON: Date;
    ISACTIVE: boolean;
}
