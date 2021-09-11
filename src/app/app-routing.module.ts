import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SelectComponent } from './views/select/select.component';
import { PlayComponent } from './views/play/play.component';
import { BeatmapsComponent } from './views/beatmaps/beatmaps.component';

const routes: Routes = [
  {path: '', redirectTo: 'select', pathMatch: 'full'},
  {path: 'select', component: SelectComponent},
  {path: 'play/:id/:diff', component: PlayComponent},
  {path: 'beatmaps', component: BeatmapsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
