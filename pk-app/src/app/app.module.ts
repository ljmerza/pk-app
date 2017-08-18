import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { RaidsComponent } from './raids/raids.component';
import { ObjtoarrPipe } from './objtoarr.pipe';
import { PokemonComponent } from './pokemon/pokemon.component';


@NgModule({
  declarations: [
    AppComponent,
    RaidsComponent,
    ObjtoarrPipe,
    PokemonComponent
  ],
  imports: [
    BrowserModule,
    MomentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
