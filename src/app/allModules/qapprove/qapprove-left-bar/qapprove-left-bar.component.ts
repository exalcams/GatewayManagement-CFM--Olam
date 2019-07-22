import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { QApproveObj } from 'app/models/GatewayModel';

@Component({
  selector: 'app-qapprove-left-bar',
  templateUrl: './qapprove-left-bar.component.html',
  styleUrls: ['./qapprove-left-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class QApproveLeftBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllQApproves: QApproveObj[] = [];
  @Output() QApproveSelectionChanged: EventEmitter<QApproveObj> = new EventEmitter<QApproveObj>();
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllQApproves.length > 0) {
      this.selectID = this.AllQApproves[0].REQUEST_ID;
      this.loadSelectedQApprove(this.AllQApproves[0]);
    }
  }

  loadSelectedQApprove(SelectedRole: QApproveObj): void {
    this.selectID = SelectedRole.REQUEST_ID;
    this.QApproveSelectionChanged.emit(SelectedRole);
    // console.log(SelectedMenuApp);
  }

  clearQApproves(): void {
    this.selectID = null;
    this.QApproveSelectionChanged.emit(null);
  }

}
