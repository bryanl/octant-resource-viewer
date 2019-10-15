import { Injectable } from '@angular/core';
import {
  connect,
  defaultElements,
  node,
  ViewerElement,
  ViewerNode,
} from './elements';

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
              pods: [
                { name: 'pod-1', status: 'ok', node: 'node-1' },
                { name: 'pod-2', status: 'ok', node: 'node-1' },
                { name: 'pod-3', status: 'warning', node: 'node-2' },
                { name: 'pod-4', status: 'warning', node: 'node-2' },
                { name: 'pod-5', status: 'error', node: 'node-3' },
              ],
            },
            views: [
              {
                metadata: {
                  type: 'pod-view',
                },
                config: {
                  pods: [
                    { name: 'pod-1', status: 'ok', node: 'node-1' },
                    { name: 'pod-2', status: 'ok', node: 'node-1' },
                    { name: 'pod-3', status: 'warning', node: 'node-2' },
                    { name: 'pod-4', status: 'warning', node: 'node-2' },
                    { name: 'pod-5', status: 'error', node: 'node-3' },
                  ],
                },
              },
            ],
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
                action: setNodeOptions,
                options: {
                  id: 'ingress',
                  nodeOptions: {
                    apiVersion: 'extensions/v1beta1',
                    kind: 'Ingress',
                    name: 'ingress',
                    status: 'error',
                    issues: [{ content: 'ingress broke', status: 'error' }],
                  },
                },
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
                action: setNodeOptions,
                options: {
                  id: 'ingress',
                  nodeOptions: {
                    apiVersion: 'extensions/v1beta1',
                    kind: 'Ingress',
                    name: 'ingress',
                    status: 'ok',
                    issues: [],
                  },
                },
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
  elements: ViewerElement[];
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
  elements: ViewerElement[],
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
  elements: ViewerElement[],
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
  elements: ViewerElement[],
  name: string,
  options: MutationOption,
  duration: number
): ScenarioStep => {
  const newElements = elements.map(element => {
    if (element.type !== 'node' || element.data.id !== options.id) {
      return element;
    }

    const el = element as ViewerNode;
    if (!options.podDetails) {
      return element;
    }

    el.data.podDetails = options.podDetails;
    el.data.views = options.views;
    el.data.issues = options.issues;
    return node(el.data.id, el.data);
  });

  return {
    name,
    duration,
    elements: newElements,
  };
};

const setNodeOptions: MutationAction = (
  elements: ViewerElement[],
  name: string,
  options: MutationOption,
  duration: number
): ScenarioStep => {
  const newElements = elements.map(element => {
    if (element.type !== 'node' || element.data.id !== options.id) {
      return element;
    }

    return node(element.data.id, options.nodeOptions);
  });

  return {
    name,
    duration,
    elements: newElements,
  };
};

const multiAction: MutationAction = (
  elements: ViewerElement[],
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
