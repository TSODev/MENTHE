import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publishdialog',
  templateUrl: './publishdialog.component.html',
  styleUrls: ['./publishdialog.component.css']
})
export class PublishdialogComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<PublishdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }

  onOKClick(user): void {
    this.dialogRef.close('OK');
  }

}
