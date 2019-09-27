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
  apiVersion?: string;
  kind?: string;

  podOK?: number;
  podWarning?: number;
  podError?: number;
}

const podStatusTypes = ['podOK', 'podWarning', 'podError'];

const node = (id: string, options?: NodeOptions) => {
  options = options || { name: id };
  options.status = options.status || 'ok';
  options.name = options.name || id;

  let podCount = 0;
  podStatusTypes.forEach(label => {
    if (options[label]) {
      podCount += options[label];
    }
  });

  const podStatus = podStatusTypes.reduce((previousValue, currentValue) => {
    previousValue[`${currentValue}Percentage`] =
      (options[currentValue] / podCount) * 100 || 0;
    return previousValue;
  }, {});

  return {
    data: { id, ...podStatus, ...options },
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
    name: 'deployment',
    apiVersion: 'apps/v1',
    kind: 'Deployment',
  }),
  node('replica-set-1', { name: 'deployment-1a', status: 'ok' }),
  node('service'),
  node('pods-1', {
    name: 'deployment-1a pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podOK: 5,
  }),
  node('ingress'),
  node('service-account'),
  node('node1'),
  node('node3'),
  node('node2'),
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
  node('replica-set-1', { name: 'deployment-1a', status: 'ok' }),
  node('replica-set-2', { name: 'deployment-1b', status: 'ok' }),
  node('service'),
  node('pods-1', {
    name: 'deployment-1a pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podOK: 5,
    podWarning: 2,
    podError: 1,
  }),
  node('pods-2', {
    name: 'deployment-1b pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podOK: 5,
    podWarning: 2,
    podError: 1,
  }),
  node('ingress', { name: 'ingress', status: 'error' }),
  node('service-account'),
  node('node1'),
  node('node3'),
  node('node2'),
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
