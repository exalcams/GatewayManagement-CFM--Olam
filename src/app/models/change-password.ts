import { Guid } from 'guid-typescript';

export class ChangePassword {
    UserID: Guid;
    UserName: string;
    CurrentPassword: string;
    NewPassword: string;
}
