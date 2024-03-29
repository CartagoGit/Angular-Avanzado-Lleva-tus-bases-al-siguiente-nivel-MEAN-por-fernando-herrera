import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaintenanceGuard } from './shared/guards/maintenance.guard';
import { paths } from './shared/constants/paths.constant';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { DashboardGuard } from './shared/guards/dashboard.guard';

const routes: Routes = [
	//* Mantenimiento
	{
		path: paths.getPath('maintenance')?.name,
		loadChildren: () =>
			import('./core/pages/maintenance/maintenance.module').then(
				(m) => m.MaintenanceModule
			),
		canMatch: [MaintenanceGuard],
	},
	//* Publicas
	{
		path: paths.getPath('no-page-found')?.name!,
		loadChildren: () =>
			import('./core/pages/nopagefound/nopagefound.module').then(
				(m) => m.NopagefoundModule
			),
	},
	// * Solo cuando no estamos logueados
	{
		path: paths.getPath('auth')?.name!,
		loadChildren: () =>
			import('./core/pages/auth/auth.module').then((m) => m.AuthModule),
		canMatch: [AuthorizationGuard],
	},
	//* Hay que estar logueado
	{
		path: '',
		loadChildren: () =>
			import('./pages/pages.module').then((m) => m.PagesModule),
		canMatch: [DashboardGuard],
	},
	//* Redireccionar
	{
		path: '**',
		redirectTo: paths.getPath('no-page-found')?.name!,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {
	constructor() {}
}
