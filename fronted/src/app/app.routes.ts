import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { RegisterMedicComponent } from './components/register-medic/register-medic.component';
import { RegisterPatientComponent } from './components/register-patient/register-patient.component';
import { CartComponent } from './components/cart/cart.component';
import { ManageTimetableComponent } from './components/manage-timetable/manage-timetable.component';
import { MyTimetableComponent } from './components/my-timetable/my-timetable.component';
import { PersistenceComponent } from './components/persistence/persistence.component';
import { TimetablesComponent } from './components/timetables/timetables.component';
import { ManageDbComponent } from './components/manage-db/manage-db.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register-admin', component: RegisterAdminComponent },
  { path: 'register-medic', component: RegisterMedicComponent },
  { path: 'register-patient', component: RegisterPatientComponent },

  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
    data: { roles: ['patient'] },
  },
  {
    path: 'manage-timetable',
    component: ManageTimetableComponent,
    canActivate: [authGuard],
    data: { roles: ['medic'] },
  },
  {
    path: 'my-timetable',
    component: MyTimetableComponent,
    canActivate: [authGuard],
    data: { roles: ['medic'] },
  },
  {
    path: 'persistence',
    component: PersistenceComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'timetables',
    component: TimetablesComponent,
    canActivate: [authGuard],
    data: { roles: ['patient'] },
  },

  {
    path: 'manage-db',
    component: ManageDbComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  { path: '**', redirectTo: '' },
];
