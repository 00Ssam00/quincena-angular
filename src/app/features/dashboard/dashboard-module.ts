import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { BalanceCardComponent } from './balance-card/balance-card.component';
import { FixedPaymentsCardComponent } from './fixed-payments-card/fixed-payments-card.component';
import { DailyChartCardComponent } from './daily-chart-card/daily-chart-card.component';
import { RecentMovementsCardComponent } from './recent-movements-card/recent-movements-card.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    BalanceCardComponent,
    FixedPaymentsCardComponent,
    DailyChartCardComponent,
    RecentMovementsCardComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
