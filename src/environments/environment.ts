// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const BASE_URL = "http://127.0.0.1:3000";

export const environment = {
  production: false,
  BASE_URL_API : BASE_URL + '/api/',
  stripePublishableKey: 'pk_test_51RAZhOPTsghyMozm3oMlw5ZEAUVs7qwd1gfsnyPCMnJsB3CXCF3MxpqcvYYeZGKQZiOCHNALMuqh7olFqsydUetB0085g1Udo0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.