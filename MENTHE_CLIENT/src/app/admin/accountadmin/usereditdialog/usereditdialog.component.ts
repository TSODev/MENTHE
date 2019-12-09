import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/_models';


@Component({
  selector: 'app-usereditdialog',
  templateUrl: './usereditdialog.component.html',
  styleUrls: ['./usereditdialog.component.css']
})
export class UsereditdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UsereditdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {

  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOKClick(user): void {
    this.dialogRef.close(this.data);
  }

}
