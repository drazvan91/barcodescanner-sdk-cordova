import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

const bootstrap = () => { platformBrowserDynamic().bootstrapModule(AppModule); };

/**
 * Need to wait for the deviceready event to fire before bootstrapping, otherwise the Cordova plugins are not properly
 * loaded yet, e.g. the Scandit namespace is not available yet at the time of dependency injection.
 * See https://github.com/driftyco/ionic2-app-base/issues/114 for more info.
 */
if ((window as any).cordova) {
  console.info('Waiting with bootstrapping...');
  document.addEventListener('deviceready', () => {
    console.info('Bootstrapping now...');
    bootstrap();
  });
} else {
  bootstrap();
}
