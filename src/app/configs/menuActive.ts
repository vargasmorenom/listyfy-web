export const menuActive = (variable: any) => {
  [
    {
      header: 'Acciones disponibles',
      buttons: [
        {
          text: 'Home',
          icon: 'home',
          handler: () => {
            variable.router.navigate(['/']);
          },
        },
        {
          text: 'inscripciones',
          icon: 'create',
          handler: () => {
            variable.router.navigate(['/register']);
          },
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            variable.router.navigate(['/login']);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    },
  ];
};
