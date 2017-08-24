import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RaidsComponent } from './raids/raids.component';
import { ObjtoarrPipe } from './objtoarr.pipe';
import { PokemonComponent } from './pokemon/pokemon.component';

import { PokemonService } from './services/pokemon.service';


@NgModule({
  declarations: [
    AppComponent,
    RaidsComponent,
    ObjtoarrPipe,
    PokemonComponent
  ],
  imports: [
    BrowserModule,
    MomentModule,
    HttpModule
  ],
  providers: [PokemonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
