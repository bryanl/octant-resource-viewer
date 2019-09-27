import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  constructor() {}

  scenarios = (): Scenario[] => {
    return [
      scenarioFactory('Default', []),
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

interface NodeOptions {
  name: string;
  status?: string;
  apiVersion: string;
  kind: string;

  podDetails?: {
    podOK?: number;
    podWarning?: number;
    podError?: number;
  };
}

const podStatusTypes = ['podOK', 'podWarning', 'podError'];

const node = (id: string, options: NodeOptions): Node => {
  let podOptions = {};
  if (options.podDetails) {
    let podCount = 0;
    podStatusTypes.forEach(statusType => {
      if (options.podDetails[statusType]) {
        podCount += options.podDetails[statusType];
      }
    });

    const podStatus = podStatusTypes.reduce((previousValue, currentValue) => {
      previousValue[`${currentValue}Percentage`] =
        (options.podDetails[currentValue] / podCount) * 100 || 0;
      return previousValue;
    }, {});
    podOptions = { ...podStatus };
  }

  const label = `${options.name}\n${options.apiVersion} ${options.kind}`;

  return {
    type: 'node',
    data: { id, label, ...podOptions, ...options },
  };
};

const connect = (
  source: string,
  target: string,
  connectionType = 'explicit'
): Edge => {
  const id = `${source}-${target}`;
  return {
    type: 'edge',
    data: { id, source, target, connectionType },
  };
};

interface Node {
  type: string;
  data: {
    apiVersion: string;
    kind: string;
    name: string;
    podDetails?: { podOK?: number; podWarning?: number; podError?: number };
    id: string;
    label: string;
    status?: string;
  };
}

interface Edge {
  type: string;
  data: { id: string; source: string; connectionType: string; target: string };
}

type Element = Node | Edge;

const defaultElements: Element[] = [
  node('deployment', {
    status: 'ok',
    name: 'deployment',
    apiVersion: 'apps/v1',
    kind: 'Deployment',
  }),
  node('replica-set-1', {
    apiVersion: 'apps/v1',
    kind: 'ReplicaSet',
    name: 'deployment-1a',
    status: 'ok',
  }),
  node('service', {
    apiVersion: 'v1',
    kind: 'Service',
    name: 'service',
    status: 'ok',
  }),
  node('pods-1', {
    status: 'ok',
    name: 'deployment-1a pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podDetails: {
      podOK: 5,
    },
  }),
  node('ingress', {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    name: 'ingress',
    status: 'ok',
  }),
  node('service-account', {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    name: 'service-account',
    status: 'ok',
  }),
  node('cm1', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm1',
    status: 'ok',
  }),
  node('cm2', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm2',
    status: 'ok',
  }),
  node('cm3', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm3',
    status: 'ok',
  }),
  connect(
    'replica-set-1',
    'deployment'
  ),
  connect(
    'pods-1',
    'replica-set-1'
  ),
  connect(
    'service',
    'pods-1',
    'implicit'
  ),
  connect(
    'ingress',
    'service',
    'implicit'
  ),
  connect(
    'pods-1',
    'service-account',
    'field'
  ),
];

const someFailuresElements = [
  node('deployment', {
    name: 'deployment',
    status: 'warning',
    apiVersion: 'apps/v1',
    kind: 'Deployment',
  }),
  node('replica-set-1', {
    apiVersion: 'apps/v1',
    kind: 'ReplicaSet',
    name: 'deployment-1a',
    status: 'ok',
  }),
  node('replica-set-2', {
    apiVersion: 'apps/v1',
    kind: 'ReplicaSet',
    name: 'deployment-1b',
    status: 'ok',
  }),
  node('service', {
    apiVersion: 'v1',
    kind: 'Service',
    name: 'service',
    status: 'ok',
  }),
  node('pods-1', {
    name: 'deployment-1a pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podDetails: {
      podOK: 5,
      podWarning: 2,
      podError: 1,
    },
  }),
  node('pods-2', {
    name: 'deployment-1b pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podDetails: {
      podWarning: 2,
    },
  }),
  node('ingress', {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    name: 'ingress',
    status: 'ok',
  }),
  node('service-account', {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    name: 'service-account',
    status: 'ok',
  }),
  node('cm1', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm1',
    status: 'ok',
  }),
  node('cm2', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm2',
    status: 'ok',
  }),
  node('cm3', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm3',
    status: 'ok',
  }),
  connect(
    'replica-set-1',
    'deployment'
  ),
  connect(
    'replica-set-2',
    'deployment'
  ),
  connect(
    'pods-1',
    'replica-set-1'
  ),
  connect(
    'pods-2',
    'replica-set-2'
  ),
  connect(
    'service',
    'pods-1',
    'implicit'
  ),
  connect(
    'ingress',
    'service',
    'implicit'
  ),
  connect(
    'pods-1',
    'service-account',
    'field'
  ),
  connect(
    'pods-2',
    'service-account',
    'field'
  ),
];

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
    const elements = scenario.steps[scenario.steps.length - 1].elements;
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
      return element.data.id === options.id;
    }
    return false;
  });

  return {
    name,
    duration,
    elements: filtered,
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
