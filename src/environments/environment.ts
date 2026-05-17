// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  servicio: [
    {
      url: 'http://localhost:8080/api/v1/',
      key: 'encrypt!135790',
      logo: './../../../assets/logo/logoanchoNegro-2.png',
      logosmall: './../../../assets/logo/logoanchoNegro-small.png',
      logoHeader: 'assets/logo/logoMyllistys.png',
      logoHeaderInscription: 'assets/logo/logoMyllistys.png',
      urlfiles: 'http://localhost:8080/files/',
      urlimages: 'http://localhost:8080/images/',
      appUrl: 'http://localhost:8080',
      termsUrl: '/terminos',
      recaptchaSiteKey: '6Le9OpAsAAAAAEBabC1joHvAxIJQL5XV96qM-tyV',
      recaptchaEnabled: false,
      defaultAvatar: 'assets/logo/perfil02.png',
      appName: 'mylistys',
      googleClientId: '',
    },
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
