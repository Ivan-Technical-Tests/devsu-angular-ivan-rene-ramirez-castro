import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './ui/pages/not-found/not-found.component';

export const routes: Routes = [
    // HomeComponent
    { path: '', component: AppComponent },

    // NotFoundComponent
    { path: '**', component: NotFoundComponent },
];
