/** * This file is the main entry point for the entire app.
 *
 * If the application is being bundled, this is where the bundling process
 * starts.  If the application is being loaded by an es6 module loader, this
 * is the entry point.
 *
 * Point Webpack or SystemJS to this file.
 *
 * This module imports all the different parts of the application and registers them with angular.
 * - Submodules
 *   - States
 *   - Components
 *   - Directives
 *   - Services
 *   - Filters
 *   - Run and Config blocks
 *     - Transition Hooks
 * - 3rd party Libraries and angular1 module
 *
 * Then this module creates the ng-upgrade adapter
 * and bootstraps the hybrid application
 */

// Google analytics
import './util/ga';
import 'zone.js';
import {NgZone, PlatformRef, StaticProvider} from '@angular/core';

////////////// HYBRID BOOTSTRAP ///////////////
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { UIRouter, UrlService } from '@uirouter/core';
import { visualizer } from '@uirouter/visualizer';

import { SampleAppModuleAngular } from './angularModule';
import { sampleAppModuleAngularJS } from "./angularJSModule";
import {downgradeComponent, downgradeModule} from "@angular/upgrade/static";

import * as angular from 'angular';
import {AngularBootstrapComponent} from "./angular-bootstrap.component";
(window as any).angular = angular;

const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef: PlatformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(SampleAppModuleAngular);
}


sampleAppModuleAngularJS.config(['$urlServiceProvider', ($urlService: UrlService) => $urlService.deferIntercept()]);
sampleAppModuleAngularJS.directive('bootstrapAngular', downgradeComponent({component: AngularBootstrapComponent}) as angular.IDirectiveFactory)


angular.bootstrap(document.body, [
  sampleAppModuleAngularJS.name,
  downgradeModule(bootstrapFn)
]) ;

const injector: angular.auto.IInjectorService = angular.element(document.body).injector();

const urlService: UrlService = injector.get('$urlService');

setTimeout(() => {
  // setTimeout needed to allow angular routes to initialize after refresh
  urlService.listen();
  urlService.sync();
  // Show ui-router-visualizer
  sampleAppModuleAngularJS.run(['$uiRouter', ($uiRouter) => visualizer($uiRouter) ]);

});

