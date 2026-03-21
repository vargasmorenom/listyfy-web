// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  servicio: [
    {
      url: 'http://localhost:3000/api/v1/',
      key: 'encrypt!135790',
      logo: './../../../assets/logo/logoanchoNegro-2.png',
      logosmall: './../../../assets/logo/logoanchoNegro-small.png',
      logoHeader: 'assets/logo/listyfy-trans-corte.png',
      logoHeaderInscription: 'assets/logo/listyfy-trans-inscription.png',
      urlfiles: 'http://localhost:3000/files/',
      appUrl: 'http://localhost:8100',
      termsUrl: 'http://terminosycondiciones',
      recaptchaSiteKey: '6Le9OpAsAAAAAEBabC1joHvAxIJQL5XV96qM-tyV',
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
