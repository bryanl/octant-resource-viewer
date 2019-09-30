import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Scenario, ScenarioStep } from '../../services/scenarios.service';
import { ChangeContext, Options } from 'ng5-slider';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.scss'],
})
export class ScenariosComponent implements OnChanges {
  @Input() scenario: Scenario;
  @Output() elements: EventEmitter<any> = new EventEmitter<any>();

  scenarioPlaying: boolean;
  currentStepName: string;
  scenarioStep: number;
  scenarioSliderOptions: Options;

  private playID: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.playScenario(0);
  }

  private playScenario(endStep: number, ignoreDuration = false) {
    const play = (steps: ScenarioStep[], index: number, playUntil = -1) => {
      if (steps.length === 0) {
        this.scenarioPlaying = false;
        return;
      }

      this.scenarioPlaying = false;

      const step = steps.shift();
      const timeout = ignoreDuration
        ? 0 // ignore supplied duration due to request
        : steps.length === 0
        ? 0 // ignore supplied duration because this is the last step
        : step.duration; // use supplied duration

      this.currentStepName = step.name;
      this.elements.emit(JSON.parse(JSON.stringify(step.elements)));

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

    const scenario = this.scenario;

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
