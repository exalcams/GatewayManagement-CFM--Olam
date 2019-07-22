import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { ConfigurationObj } from 'app/models/GatewayModel';

@Component({
  selector: 'app-configuration-left-bar',
  templateUrl: './configuration-left-bar.component.html',
  styleUrls: ['./configuration-left-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ConfigurationLeftBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllConfigurations: ConfigurationObj[] = [];
  @Output() ConfigurationSelectionChanged: EventEmitter<ConfigurationObj> = new EventEmitter<ConfigurationObj>();
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllConfigurations.length > 0) {
      this.selectID = this.AllConfigurations[0].ID;
      this.loadSelectedConfiguration(this.AllConfigurations[0]);
    }
  }

  loadSelectedConfiguration(SelectedRole: ConfigurationObj): void {
    this.selectID = SelectedRole.ID;
    this.ConfigurationSelectionChanged.emit(SelectedRole);
    // console.log(SelectedMenuApp);
  }

  clearConfigurations(): void {
    this.selectID = null;
    this.ConfigurationSelectionChanged.emit(null);
  }

}
