import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support.routing';
import { UsersComponent } from './users/users.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [UsersComponent, HospitalsComponent, DoctorsComponent],
	imports: [CommonModule, SupportRoutingModule, SharedModule, FormsModule],
})
export class SupportModule {}
