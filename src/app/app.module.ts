import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { AudioPlayerDialog } from './dialogs';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, MaterialModule],
  declarations: [AppComponent, AudioPlayerDialog],
  bootstrap: [AppComponent],
  entryComponents: [AudioPlayerDialog]
})
export class AppModule {}
