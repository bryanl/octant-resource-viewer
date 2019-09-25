import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CytoscapeComponent } from './components/cytoscape/cytoscape.component';
import { FormsModule } from '@angular/forms';
import { ResourceViewerComponent } from './components/resource-viewer/resource-viewer.component';

@NgModule({
  declarations: [AppComponent, CytoscapeComponent, ResourceViewerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
