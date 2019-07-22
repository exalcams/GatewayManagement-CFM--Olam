import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
// import { LoginService } from 'app/services/login.service';
// import { UserDetails } from 'app/models/user-details';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { FuseNavigation } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { MenuUpdataionService } from 'app/services/menu-update.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  navigation: FuseNavigation[] = [];
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  children: FuseNavigation[] = [];
  subChildren: FuseNavigation[] = [];
  subChildren1: FuseNavigation[] = [];
  private _unsubscribeAll: Subject<any>;
  message = 'Snack Bar opened.';
  actionButtonLabel = 'Retry';
  action = true;
  setAutoHide = true;
  autoHide = 2000;

  addExtraClass: false;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;

  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _menuUpdationService: MenuUpdataionService,
    // private _loginService: LoginService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };

    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  LoginClicked(): void {
    if (this.loginForm.valid) {
      this.IsProgressBarVisibile = true;
      this._authService.login(this.loginForm.get('userName').value, this.loginForm.get('password').value).subscribe(
        (data) => {
          this.IsProgressBarVisibile = false;
          localStorage.setItem('authorizationData', JSON.stringify(data));
          this.UpdateMenu();
          this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
          this._router.navigate(['dashboard']);
        },
        (err) => {
          this.IsProgressBarVisibile = false;
          console.error(err);
          // console.log(err instanceof Object);
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
      // this._router.navigate(['dashboard']);
      // this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const abstractControl = this.loginForm.get(key);
        abstractControl.markAsDirty();
      });
    }

  }

  UpdateMenu(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      // console.log(this.MenuItems);
    } else {
    }
    if (this.MenuItems.indexOf('Dashboard') >= 0) {
      this.children.push(
        {
          id: 'dashboard',
          title: 'Dashboard',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: 'dashboard',
          url: '/dashboard',
        }
      );
    }
    if (this.MenuItems.indexOf('Transaction') >= 0) {
      this.children.push(
        {
          id: 'transaction',
          title: 'Hovering Vehicles',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: ' local_shipping ',
          url: '/transaction',

        }
      );
    }
    if (this.MenuItems.indexOf('Configuration') >= 0) {
      this.children.push(
        {
          id: 'configuration',
          title: 'Configuration',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: 'settings',
          url: '/configuration',
        }
      );
    }
    if (this.MenuItems.indexOf('QRequest') >= 0) {
      this.children.push(
        {
          id: 'qrequest',
          title: 'Q-Request',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: 'playlist_add',
          url: '/qrequest',

        }
      );
    }
    if (this.MenuItems.indexOf('QApprove') >= 0) {
      this.children.push(
        {
          id: 'qapprove',
          title: 'Q-Approve',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: 'playlist_add_check',
          url: '/qapprove',

        }
      );
    }
    if (this.MenuItems.indexOf('QVisualization') >= 0) {
      this.children.push(
        {
          id: 'qvisualization',
          title: 'Q-Visualization',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: 'playlist_play',
          url: '/qvisualization',

        }
      );
    }
    if (this.MenuItems.indexOf('App') >= 0) {
      this.subChildren.push(
        {
          id: 'menuapp',
          title: 'App',
          type: 'item',
          url: '/master/menuApp'
        },
      );
    }
    if (this.MenuItems.indexOf('Role') >= 0) {
      this.subChildren.push(
        {
          id: 'role',
          title: 'Role',
          type: 'item',
          url: '/master/role'
        },
      );
    }
    if (this.MenuItems.indexOf('User') >= 0) {
      this.subChildren.push(
        {
          id: 'user',
          title: 'User',
          type: 'item',
          url: '/master/user'
        }
      );
    }
    if (this.MenuItems.indexOf('App') >= 0 || this.MenuItems.indexOf('Role') >= 0 || this.MenuItems.indexOf('User') >= 0) {
      this.children.push({
        id: 'master',
        title: 'Master',
        // translate: 'NAV.DASHBOARDS',
        type: 'collapsable',
        icon: 'view_list',
        children: this.subChildren
      }
      );
    }

    if (this.MenuItems.indexOf('StageWiseReport') >= 0) {
      this.subChildren1.push(
        {
          id: 'stageWiseReport',
          title: 'StageWise Report',
          type: 'item',
          url: '/report/stageWiseReport'
        },
      );
    }
    if (this.MenuItems.indexOf('TransactionReport') >= 0) {
      this.subChildren1.push(
        {
          id: 'transactionReport',
          title: 'Transaction Report',
          type: 'item',
          url: '/report/transactionReport'
        }
      );
    }

    if (this.MenuItems.indexOf('StageWiseReport') >= 0 || this.MenuItems.indexOf('TransactionReport') >= 0) {
      this.children.push({
        id: 'report',
        title: 'Report',
        // translate: 'NAV.DASHBOARDS',
        type: 'collapsable',
        icon: 'description',
        children: this.subChildren1
      }
      );
    }
    if (this.MenuItems.indexOf('GatewayStatus') >= 0) {
      this.children.push(
        {
          id: 'gatewayStatus',
          title: 'Gateway Status',
          translate: 'NAV.SAMPLE.TITLE',
          type: 'item',
          icon: 'build',
          url: '/gatewayStatus',
        }
      );
    }
    this.navigation.push({
      id: 'applications',
      title: 'Applications',
      translate: 'NAV.APPLICATIONS',
      type: 'group',
      children: this.children
    });
    // Saving local Storage
    localStorage.setItem('menuItemsData', JSON.stringify(this.navigation));
    // Update the service in order to update menu
    this._menuUpdationService.PushNewMenus(this.navigation);
  }
}


