import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { BrowserModule } from '@angular/platform-browser';

import { UIRouterUpgradeModule, NgHybridStateDeclaration } from '@uirouter/angular-hybrid';
import { sampleAppModuleAngularJS } from './angularJSModule';

import { PrefsModule } from './prefs/prefs.module';
import {UIRouter} from "@uirouter/core";
import {AngularBootstrapComponent} from "./angular-bootstrap.component";

// Create a "future state" (a placeholder) for the Contacts
// Angular module which will be lazy loaded by UI-Router
export const contactsFutureState: NgHybridStateDeclaration = {
  name: 'contacts.**',
  url: '/contacts',
  loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule),
};

export function getDialogService($injector) {
  return $injector.get('DialogService');
}

export function getContactsService($injector) {
  return $injector.get('Contacts');
}

// The main NgModule for the Angular portion of the hybrid app
@NgModule({
  declarations: [AngularBootstrapComponent],
  entryComponents: [AngularBootstrapComponent],
  imports: [
    BrowserModule,
    // Provides the @uirouter/angular directives and registers
    // the future state for the lazy loaded contacts module
    UIRouterUpgradeModule.forRoot({ states: [contactsFutureState] }),
    // The preferences feature module
    PrefsModule,
  ],
  providers: [
    // Register some AngularJS services as Angular providers
    { provide: 'DialogService', deps: ['$injector'], useFactory: getDialogService },
    { provide: 'Contacts', deps: ['$injector'], useFactory: getContactsService },
  ]
})
export class SampleAppModuleAngular {
  constructor(private router: UIRouter) { }

  ngDoBootstrap() {
  }
}
