# Quincena

Aplicación de presupuesto personal organizada por quincenas. Muestra el saldo disponible del periodo (ingreso + sobrante o − déficit de la quincena anterior), el ritmo de gasto diario sugerido, los pagos fijos pendientes y el historial de movimientos.

Proyecto de la materia **Herramientas de Programación III** (Ingeniería de Software, Pascual Bravo). En esta entrega no hay backend: los datos son simulados con servicios que devuelven `Observable`.

## Funcionalidades
- **Resumen:** saldo disponible con arrastre, progreso de los 15 días, gráfico de gasto diario con presupuesto y días excedidos, próximos pagos fijos y últimos movimientos. Navegación a quincenas anteriores (solo lectura).
- **Movimientos:** lista agrupada por día con búsqueda (sin distinguir tildes) y filtro por categoría, estados de carga, vacío y error. Permite **crear, editar y eliminar** (con confirmación) en una sola pantalla.
- **Categorías:** lista con el número de movimientos y el total de cada una, y creación de categorías nuevas (validación de nombre repetido). Las categorías nuevas aparecen al instante en el formulario de movimientos y en los filtros.
- **Registrar / editar gasto:** formulario reactivo con validaciones visibles, vista previa del saldo y aviso de confirmación con opción de deshacer.
- **Modo claro / oscuro** persistente y diseño responsive (menú lateral tipo cajón en pantallas angostas).

## Tecnologías
- Angular 22 con arquitectura de módulos (`NgModule`, `standalone: false`)
- Angular Router con módulos de carga diferida (lazy loading)
- Reactive Forms
- RxJS (servicios con datos simulados: `of(...).pipe(delay(...))`)
- Signals y control flow (`@if`, `@for`) para el estado de las vistas
- SCSS propio con design tokens (sin librería de UI)
- Fuente Instrument Sans (Google Fonts, SIL OFL 1.1)

## Instalación y ejecución
Requisitos: Node.js y npm. El CLI de Angular se instala con `npm install -g @angular/cli` (o se usa `npx ng ...`).

```bash
git clone https://github.com/00Ssam00/quincena-angular.git
cd quincena-angular
npm install
ng serve
```
Abrir http://localhost:4200

Otros comandos:
```bash
ng build   # compila el proyecto en dist/
ng test    # ejecuta las pruebas unitarias
```

## Estructura
```
src/app/
  core/        servicios singleton (Quincena, Movimientos, Categoría, Tema, Toast),
               modelos (interfaces con los campos del esquema), utilidades y datos simulados
  shared/      componentes de presentación, pipes (cop, diaHora) y directiva reutilizables
  layout/      shell con sidebar y header
  features/
    dashboard/   módulo Resumen
    movimientos/ módulo Movimientos
    categorias/  módulo Categorías
```

## Datos simulados
Los datos están en `src/app/core/data/quincena.mock.ts` y se exponen mediante servicios con forma REST (`getAll`, `getById`, `create`, `update`, `delete`) que devuelven `Observable` con latencia artificial para imitar una API. Los campos de las interfaces siguen el esquema de la base de datos (`fecha`, `monto`, `categoria_id`...), de modo que en la siguiente entrega solo cambia el cuerpo de cada método por una llamada con `HttpClient`.

## Probar escenarios
- `/resumen?escenario=deficit` muestra la quincena con arrastre de déficit.
- `/movimientos?error=1` muestra el estado de error con el botón Reintentar.
