import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionComponent } from 'src/app/shared/session/session.component';
import { SideMenuComponent } from 'src/app/shared/side-menu/side-menu.component';

@Component({
  selector: 'app-main-layot',
  templateUrl: './main-layot.page.html',
  styleUrls: ['./main-layot.page.scss'],
  standalone: true,
  imports: [RouterOutlet, SessionComponent, SideMenuComponent],
})
export class MainLayotPage {}
