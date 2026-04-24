import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokemonDetailPage } from './Pokemon-detail.page';

const routes: Routes = [
    { path: '', component: PokemonDetailPage }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PokemonDetailPageRoutingModule {}