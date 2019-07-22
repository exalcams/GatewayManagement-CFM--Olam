import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { GPSTrackingObj } from 'app/models/GatewayModel';

@Component({
  selector: 'app-gpstracking-left-bar',
  templateUrl: './gpstracking-left-bar.component.html',
  styleUrls: ['./gpstracking-left-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class GPSTrackingLeftBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllRoles: GPSTrackingObj[] = [];
  @Output() RoleSelectionChanged: EventEmitter<GPSTrackingObj> = new EventEmitter<GPSTrackingObj>();
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllRoles.length > 0) {
      this.selectID = this.AllRoles[0].TRUCK_ID;
      this.loadSelectedRole(this.AllRoles[0]);
    }
  }

  loadSelectedRole(SelectedRole: GPSTrackingObj): void {
    this.selectID = SelectedRole.TRUCK_ID;
    this.RoleSelectionChanged.emit(SelectedRole);
    // console.log(SelectedMenuApp);
  }

  clearGPSTracking(): void {
    this.selectID = null;
    this.RoleSelectionChanged.emit(null);
  }

}
