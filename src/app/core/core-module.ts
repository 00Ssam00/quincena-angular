import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { LOCALE_ID, NgModule, Optional, SkipSelf } from '@angular/core';

registerLocaleData(localeEsCO);

// CoreModule se importa UNA sola vez, en AppModule. Los servicios singleton
// (QuincenaService, MovimientosService, ThemeService, ToastService) usan providedIn: 'root'.
@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() moduloPadre?: CoreModule) {
    if (moduloPadre) {
      throw new Error('CoreModule ya fue cargado. Impórtalo solo en AppModule.');
    }
  }
}
