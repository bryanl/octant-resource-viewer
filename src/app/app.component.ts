import { Component, OnInit } from '@angular/core';
import { ScenariosService } from './services/scenarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'octant-resource-viewer';

  scenarios: string[];
  currentScenario: string;
  elements: any;

  constructor(private scenariosService: ScenariosService) {}

  ngOnInit(): void {
    this.scenarios = Object.keys(this.scenariosService.scenarios());
    if (this.scenarios.length > 0) {
      this.setScenario(this.scenarios[0]);
    }
  }

  setScenario(name: string) {
    this.currentScenario = name;
    this.elements = this.scenariosService.scenarios()[this.currentScenario];
  }
}
