import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ScenariosService } from './services/scenarios.service';
import { ViewerNode, ViewerNodeData } from './services/elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  scenarioNames: string[];
  elements: any = [];
  selected: ViewerNodeData;

  private scenarios: {};
  private currentScenario: any;

  constructor(
    private scenariosService: ScenariosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.scenarios = this.scenariosService
      .scenarios()
      .reduce((accum, scenario) => {
        accum[scenario.name] = scenario;
        return accum;
      }, {});

    this.scenarioNames = Object.keys(this.scenarios);

    if (this.scenarioNames.length > 0) {
      this.setScenario(this.scenarioNames[0]);
    }
  }

  setScenario(name: string) {
    this.currentScenario = this.scenarios[name];
  }

  setElements(elements) {
    this.elements = elements;
    this.cd.detectChanges();
  }

  nodeSelected = (data: ViewerNodeData) => {
    this.selected = data;
  };
}
