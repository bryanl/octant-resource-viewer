import { Injectable } from '@angular/core';
import { connect, defaultElements, Element, node, Node } from './elements';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  constructor() {}

  scenarios = (): Scenario[] => {
    return [
      scenarioFactory('Default', []),
      scenarioFactory('Pods', [
        {
          name: 'Pods fail',
          duration: 5000,
          action: setPodDetails,
          options: {
            id: 'pods-1',
            podDetails: {
              podOK: 3,
              podWarning: 1,
              podError: 1,
            },
          },
        },
      ]),
      scenarioFactory('Ingress fails', [
        {
          name: 'Ingress fails',
          action: multiAction,
          options: {
            actions: [
              { action: removeEdge, options: { id: 'ingress-service' } },
              {
                action: setNodeStatus,
                options: { id: 'ingress', status: 'error' },
              },
            ],
          },
          duration: 5000,
        },
        {
          name: 'Ingress recovers',
          action: multiAction,
          options: {
            actions: [
              {
                action: addEdge,
                options: {
                  source: 'ingress',
                  target: 'service',
                  connectionType: 'implicit',
                },
              },
              {
                action: setNodeStatus,
                options: { id: 'ingress', status: 'error' },
              },
              {
                action: setNodeStatus,
                options: { id: 'ingress', status: 'ok' },
              },
            ],
          },
          duration: 5000,
        },
      ]),
    ];
  };
}

export interface Scenario {
  name: string;
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  name: string;
  duration: number;
  elements: Element[];
}

type MutationAction = (
  elements: any,
  name: string,
  options: { [key: string]: any },
  duration: number
) => ScenarioStep;

interface MutationOption {
  [key: string]: any;
}

interface Mutation {
  name: string;
  action: MutationAction;
  duration: number;
  options: MutationOption;
}

const scenarioFactory = (name: string, mutations: Mutation[]): Scenario => {
  const scenario = {
    name,
    steps: [
      {
        name: 'Initial',
        duration: 2000,
        elements: defaultElements,
      },
    ],
  };

  mutations.forEach(mutation => {
    const elements = JSON.parse(
      JSON.stringify(scenario.steps[scenario.steps.length - 1].elements)
    );
    const step = mutation.action(
      elements,
      mutation.name,
      mutation.options,
      mutation.duration
    );
    scenario.steps.push(step);
  });

  return scenario;
};

const removeEdge: MutationAction = (
  elements: Element[],
  name: string,
  options: { [key: string]: any },
  duration: number
): ScenarioStep => {
  const filtered = elements.filter(element => {
    if (element.type === 'edge') {
      return element.data.id !== options.id;
    }
    return true;
  });

  return {
    name,
    duration,
    elements: filtered,
  };
};

const addEdge: MutationAction = (
  elements: Element[],
  name: string,
  options: { [key: string]: any },
  duration: number
): ScenarioStep => {
  elements.push(
    connect(
      options.source,
      options.target,
      options.connectionType
    )
  );

  return {
    name,
    duration,
    elements,
  };
};

const setPodDetails: MutationAction = (
  elements: Element[],
  name: string,
  options: MutationOption,
  duration: number
): ScenarioStep => {
  const newElements = elements.map(element => {
    if (element.type !== 'node') {
      return element;
    } else if (element.data.id === options.id) {
      const el = element as Node;
      el.data.podDetails = options.podDetails;
      const n = node(el.data.id, el.data);
      return n;
    } else {
      return element;
    }
  });

  return {
    name,
    duration,
    elements: newElements,
  };
};

const setNodeStatus: MutationAction = (
  elements: Element[],
  name: string,
  options: MutationOption,
  duration: number
): ScenarioStep => {
  const newElements = elements.map(element => {
    if (element.type !== 'node') {
      return element;
    } else if (element.data.id === options.id) {
      const el = element as Node;
      el.data.status = options.status;
      return el;
    } else {
      return element;
    }
  });

  return {
    name,
    duration,
    elements: newElements,
  };
};

const multiAction: MutationAction = (
  elements: Element[],
  name: string,
  options: MutationOption,
  duration: number
): ScenarioStep => {
  const actions = options.actions as {
    action: MutationAction;
    options: MutationOption;
  }[];

  const newElements = actions.reduce((prev, cur) => {
    const step = cur.action(prev, 'temp', cur.options, 0);
    return step.elements;
  }, elements);

  return {
    name,
    duration,
    elements: newElements,
  };
};
