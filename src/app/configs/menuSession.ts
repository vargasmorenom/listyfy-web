export type MenuVisibility = 'public' | 'auth' | 'guest';

export const menuactivo = [
  {
    name: 'home',
    url: '/',
    icon: 'home-outline',
    visibility: 'public', // 👈 siempre visible
  },
  {
    name: 'buscar',
    url: '/searcher',
    icon: 'search-outline',
    visibility: 'auth',
  },
  {
    name: 'listan',
    url: '/newlist',
    icon: 'add-circle',
    visibility: 'auth',
  },
  {
    name: 'tendencia',
    url: '/tendencies',
    icon: 'analytics-outline',
    visibility: 'auth',
  },
  {
    name: 'perfil',
    url: '/perfil',
    icon: 'person-circle-outline',
    visibility: 'auth',
  },
  {
    name: 'inscripcion',
    url: '/register',
    icon: 'person-add-outline',
    visibility: 'guest',
  },
  {
    name: 'ingreso',
    url: '/login',
    icon: 'log-in-outline',
    visibility: 'guest',
  },
];
