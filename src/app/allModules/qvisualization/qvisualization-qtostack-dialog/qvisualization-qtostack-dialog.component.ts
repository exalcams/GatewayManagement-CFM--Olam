import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-qvisualization-qtostack-dialog',
  templateUrl: './qvisualization-qtostack-dialog.component.html',
  styleUrls: ['./qvisualization-qtostack-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QvisualizationQtostackDialogComponent implements OnInit {

  qToStackMainFormGroup: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<QvisualizationQtostackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder, ) {
    this.qToStackMainFormGroup = this._formBuilder.group({
      Reason: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  SaveClicked(): void {
    if (this.qToStackMainFormGroup.valid) {
      var reason = this.qToStackMainFormGroup.get('Reason').value;
      this.matDialogRef.close(reason);
    } else {
      Object.keys(this.qToStackMainFormGroup.controls).forEach(key => {
        this.qToStackMainFormGroup.get(key).markAsTouched();
        this.qToStackMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ResetControl(): void {
    this.qToStackMainFormGroup.reset();
    Object.keys(this.qToStackMainFormGroup.controls).forEach(key => {
      this.qToStackMainFormGroup.get(key).markAsUntouched();
    });

  }

}
