import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenubajoComponent } from 'src/app/shared/menubajo/menubajo.component';
import { SessionComponent } from 'src/app/shared/session/session.component';
import { MenuStateService } from 'src/app/services/menu-state.service';

@Component({
  selector: 'app-main-layot',
  templateUrl: './main-layot.page.html',
  styleUrls: ['./main-layot.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubajoComponent, SessionComponent]
})
export class MainLayotPage implements OnInit {
  isMenuHidden = false;

  constructor(private menuState: MenuStateService) {}

  ngOnInit() {
    this.menuState.menuHidden$.subscribe(hidden => {
      this.isMenuHidden = hidden;
    });
  }
}
