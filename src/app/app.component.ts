import { Component, OnInit } from '@angular/core';
import { ScenariosService, ScenarioStep } from './services/scenarios.service';
import { ChangeContext, Options } from 'ng5-slider';

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
  currentStepName: string;
  scenarioPlaying: boolean;

  private scenarios: {};
  private playID: number;
  private currentScenario: any;

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
    this.currentScenario = this.scenarios[name];

    this.playScenario(-1);
  }

  private playScenario(endStep: number, ignoreDuration = false) {
    const play = (steps: ScenarioStep[], index: number, playUntil = -1) => {
      if (steps.length === 0) {
        this.scenarioPlaying = false;
        return;
      }

      this.scenarioPlaying = true;

      const step = steps.shift();
      const timeout = ignoreDuration
        ? 0 // ignore supplied duration due to request
        : steps.length === 0
        ? 0 // ignore supplied duration because this is the last step
        : step.duration; // use supplied duration

      this.currentStepName = step.name;
      this.elements = JSON.parse(JSON.stringify(step.elements));

      if (!ignoreDuration) {
        this.scenarioStep = index;
      }

      if (playUntil === index) {
        this.scenarioPlaying = false;
        this.scenarioStep = index;
      } else {
        this.playID = setTimeout(() => {
          play(steps, index + 1, playUntil);
        }, timeout);
      }
    };

    clearTimeout(this.playID);

    this.scenarioSliderOptions = undefined;

    const scenario = this.currentScenario;

    if (scenario.steps.length > 1) {
      this.scenarioSliderOptions = {
        floor: 0,
        ceil: scenario.steps.length - 1,
        showTicks: true,
        translate: (value: number): string => {
          return `${value + 1}`;
        },
      };
    }
    play(scenario.steps.concat(), 0, endStep);
  }

  scenarioStepChanged(changeContext: ChangeContext) {
    if (!this.scenarioPlaying) {
      this.playScenario(changeContext.value, true);
    }
  }
}
