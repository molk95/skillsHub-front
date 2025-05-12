// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const BASE_URL = "http://127.0.0.1:3000";

export const environment = {
  production: false,
  BASE_URL_API : BASE_URL + '/api/',
  stripePublishableKey: 'pk_test_51RFLpqGhFIRJflIh6ssFa5KVDZdOWA2KZyZzO9RlJ2yk5SXiE6gT9y0UZP9pJl8RXDYgQdWRiVpZ00PRkgtkIjOB00d8La2yK4',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.