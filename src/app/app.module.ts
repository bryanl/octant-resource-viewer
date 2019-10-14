import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CytoscapeComponent } from './components/cytoscape/cytoscape.component';
import { FormsModule } from '@angular/forms';
import { ResourceViewerComponent } from './components/resource-viewer/resource-viewer.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ScenariosComponent } from './components/scenarios/scenarios.component';
import { ObjectStatusComponent } from './components/object-status/object-status.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PodViewComponent } from './components/pod-view/pod-view.component';
import { DynamicContentComponent } from './components/dynamic-content/dynamic-content.component';
import { UnknownDynamicComponent } from './components/unknown-dynamic/unknown-dynamic.component';

@NgModule({
  declarations: [
    AppComponent,
    CytoscapeComponent,
    ResourceViewerComponent,
    ScenariosComponent,
    ObjectStatusComponent,
    PodViewComponent,
    DynamicContentComponent,
    UnknownDynamicComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    Ng5SliderModule,
    NgxChartsModule,
  ],
  entryComponents: [PodViewComponent, UnknownDynamicComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
