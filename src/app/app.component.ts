import { Component, OnInit } from '@angular/core';
import {
  Scenario,
  ScenariosService,
  ScenarioStep,
} from './services/scenarios.service';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  scenarioNames: string[];
  elements: any;

  scenarioStep: number;
  scenarioSliderOptions: Options;

  private scenarios: {};
  private playID: number;

  constructor(private scenariosService: ScenariosService) {}

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
    console.log(`set scenario to ${name}`, now());
    const scenario = this.scenarios[name];

    const play = (steps: ScenarioStep[], index = 0) => {
      if (steps.length === 0) {
        return;
      }

      const step = steps.shift();
      console.log(`running step`, step.name, index, now());
      this.elements = JSON.parse(JSON.stringify(step.elements));
      this.scenarioStep = index;
      this.playID = setTimeout(() => {
        console.log(`ding`, now());
        play(steps, index + 1);
      });
    };

    clearTimeout(this.playID);

    this.scenarioSliderOptions = undefined;
    this.scenarioStep = 0;
    if (scenario.steps.length > 1) {
      this.scenarioSliderOptions = {
        floor: 0,
        ceil: scenario.steps.length - 1,
      };
    }
    play(scenario.steps);
  }
}

const now = (): string => new Date().toISOString();
