import { Guid } from 'guid-typescript';
export class UserWithRole {
    UserID: Guid;
    RoleID: Guid;
    UserName: string;
    Email: string;
    Password: string;
    ContactNumber: string;
    InActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
