# Quincena

Aplicación de presupuesto personal organizada por quincenas. Muestra el saldo disponible del periodo (ingreso + sobrante o − déficit de la quincena anterior), el ritmo de gasto diario sugerido, los pagos fijos pendientes y el historial de movimientos.

## Funcionalidades
- **Resumen:** saldo disponible con arrastre, progreso de los 15 días, gráfico de gasto diario con presupuesto y días excedidos, próximos pagos fijos y últimos movimientos. Navegación a quincenas anteriores (solo lectura).
- **Movimientos:** lista agrupada por día con búsqueda (sin distinguir tildes) y filtro por categoría, estados de carga, vacío y error.
- **Registrar gasto:** formulario reactivo con validaciones visibles, vista previa del saldo y aviso de confirmación con opción de deshacer.
- **Modo claro / oscuro** persistente y diseño responsive (sidebar colapsable en pantallas angostas).

## Tecnologías
- Angular (arquitectura con `NgModule`, `standalone: false`)
- Angular Router con módulos de carga diferida
- Reactive Forms
- RxJS (servicios con datos simulados: `of(...).pipe(delay(...))`)
- SCSS propio con design tokens (sin librería de UI)
- Fuente Instrument Sans (Google Fonts, SIL OFL 1.1)

## Instalación y ejecución
```bash
git clone https://github.com/00Ssam00/quincena-angular.git
cd quincena-angular
npm install
ng serve
```
Abrir http://localhost:4200

## Estructura
```
src/app/
  core/        servicios singleton (Quincena, Movimientos, Tema)
  shared/      componentes y pipes reutilizables
  layout/      shell con sidebar y header
  features/
    dashboard/   módulo Resumen
    movimientos/ módulo Movimientos
```

## Datos
Los datos son simulados (inventados) en `src/app/core/data/quincena.mock.ts` y se exponen mediante servicios que devuelven `Observable` con latencia artificial para imitar una API.

## Pruebas
```bash
ng test
```

## Atajos para probar escenarios
- `/resumen?escenario=deficit` muestra la quincena con arrastre de déficit.
- `/movimientos?error=1` muestra el estado de error con el botón Reintentar.
