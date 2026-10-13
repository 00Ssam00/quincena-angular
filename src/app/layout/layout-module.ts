import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared-module';
import { ShellComponent } from './shell/shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [ShellComponent, SidebarComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [ShellComponent],
})
export class LayoutModule {}
