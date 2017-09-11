import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RaidsComponent } from './raids/raids.component';
import { ObjtoarrPipe } from './objtoarr.pipe';
import { PokemonComponent } from './pokemon/pokemon.component';

import { DataService } from './services/data.service';
import { PokemonService } from './services/pokemon.service';
import { GymsService } from './services/gyms.service';
import { RaidsService } from './services/raids.service';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
	declarations: [
		AppComponent,
		RaidsComponent,
		ObjtoarrPipe,
		PokemonComponent,
		HomeComponent,
		NotFoundComponent
	],
	imports: [
		BrowserModule,
		MomentModule,
		HttpModule,
		RouterModule.forRoot([
			{path: '', component: HomeComponent},
			{path:'raids/:level', component: RaidsComponent},
			{path:'pokemon/:rarity', component: PokemonComponent},
			{path:'**', component: NotFoundComponent}
		])
	],
	providers: [
		DataService,
		PokemonService,
		RaidsService,
		GymsService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
