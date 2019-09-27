import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  constructor() {}

  scenarios = () => ({
    default: defaultElements.concat(),
    'some failures': someFailuresElements.concat(),
  });
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

const node = (id: string, options: NodeOptions) => {
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
    data: { id, label, ...podOptions, ...options },
  };
};

const connect = (
  source: string,
  target: string,
  connectionType = 'explicit'
) => {
  const id = `${source}-${target}`;
  return {
    data: { id, source, target, connectionType },
  };
};

const defaultElements = [
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
