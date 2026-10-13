import { TestBed } from '@angular/core/testing';
import { AppModule } from './app-module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppModule] }).compileComponents();
  });

  it('debe crearse y mostrar el shell con la barra lateral', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(el.querySelector('app-shell')).toBeTruthy();
    expect(el.querySelector('app-sidebar')).toBeTruthy();
  });
});
