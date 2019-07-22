import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDetailComponent {

  constructor(public matDialogRef: MatDialogRef<DashboardDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    }
}
