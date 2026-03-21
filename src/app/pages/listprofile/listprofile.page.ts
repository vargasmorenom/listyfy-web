import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { BackComponent } from 'src/app/shared/back/back.component';

@Component({
  selector: 'app-listprofile',
  templateUrl: './listprofile.page.html',
  styleUrls: ['./listprofile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, BackComponent],
})
export class ListprofilePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
