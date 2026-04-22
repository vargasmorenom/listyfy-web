import { accessUserGuard } from './middleware/access-user.guard';
import { Routes } from '@angular/router';
import { profileGuardGuard } from './middleware/profile-guard.guard';
import { MainLayotPage } from './layout/main-layot/main-layot.page';

export const routes: Routes = [
  // Página pública de enlace compartido (sin layout ni auth)
  {
    path: 'shared/:token',
    loadComponent: () => import('./pages/shared/shared.page').then((m) => m.SharedPage),
  },
  // Páginas SIN layout (sin menú inferior)
  {
    path: 'no-connection',
    loadComponent: () => import('./pages/no-connection/no-connection.page').then((m) => m.NoConnectionPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/inscriptions/inscriptions.page').then((m) => m.InscriptionsPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'recuperaracceso',
    loadComponent: () => import('./pages/recuperaracceso/recuperaracceso.page').then((m) => m.RecuperaraccesoPage),
  },
  {
    path: 'nuevopassword',
    canActivate: [accessUserGuard],
    loadComponent: () => import('./pages/nuevopassword/nuevopassword.page').then((m) => m.NuevopasswordPage),
  },
  {
    path: 'verificar',
    loadComponent: () => import('./pages/activacion/activacion.page').then((m) => m.ActivacionPage),
  },
  {
    path: 'verificacion',
    loadComponent: () => import('./pages/verificacion/verificacion.page').then((m) => m.VerificacionPage),
  },
  {
    path: 'error',
    loadComponent: () => import('./pages/error/error.page').then((m) => m.ErrorPage),
  },
  // Páginas CON layout (con menú inferior)
  {
    path: '',
    component: MainLayotPage,
    children: [
      {
        path: '',
        canActivate: [accessUserGuard],
        data: { reuse: true },
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'home',
        canActivate: [accessUserGuard],
        data: { reuse: true },
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'newlist',
        canActivate: [accessUserGuard],
        loadComponent: () => import('./pages/adminposted/adminposted.page').then((m) => m.AdminpostedPage),
      },
      {
        path: 'perfil',
        canActivate: [profileGuardGuard],
        loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: 'content',
        loadComponent: () => import('./pages/content/content.page').then((m) => m.ContentPage),
      },
      {
        path: 'adminlist',
        loadComponent: () => import('./pages/adminlist/adminlist.page').then((m) => m.AdminlistPage),
      },
      {
        path: 'listprofile',
        loadComponent: () => import('./pages/listprofile/listprofile.page').then((m) => m.ListprofilePage),
      },
      {
        path: 'searcher',
        canActivate: [accessUserGuard],
        loadComponent: () => import('./pages/searcher/searcher.page').then((m) => m.SearcherPage),
      },
      {
        path: 'tendencies',
        canActivate: [accessUserGuard],
        loadComponent: () => import('./pages/tendencies/tendencies.page').then((m) => m.TendenciesPage),
      },
      {
        path: 'viewtrends',
        canActivate: [accessUserGuard],
        loadComponent: () => import('./pages/viewtrends/viewtrends.page').then((m) => m.ViewtrendsPage),
      },
        {
        path: 'config',
        canActivate: [accessUserGuard],
        loadComponent: () => import('./pages/config/config.page').then( m => m.ConfigPage)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/error?type=404',
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/config/config.page').then( m => m.ConfigPage)
  },
];
