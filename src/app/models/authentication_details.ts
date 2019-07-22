import { Guid } from 'guid-typescript';

export class AuthenticationDetails {
    isAuth: boolean;
    userID: Guid;
    userName: string;
    displayName: string;
    emailAddress: string;
    userRole: string;
    menuItemNames: string;
    profile: string;
    refreahToken: string;
    expires: string;
    issued: string;
    expiresin: string;
}
