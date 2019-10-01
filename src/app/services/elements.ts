export interface ViewerNodeData {
  apiVersion: string;
  kind: string;
  name: string;
  podDetails?: { podOK?: number; podWarning?: number; podError?: number };
  id: string;
  label: string;
  status?: string;
}

export interface ViewerNode {
  type: string;
  data: ViewerNodeData;
  selected?: boolean;
}

export interface ViewerEdge {
  type: string;
  data: { id: string; source: string; connectionType: string; target: string };
  selected: false;
}

export type ViewerElement = ViewerNode | ViewerEdge;

export interface PodDetails {
  podOK?: number;
  podWarning?: number;
  podError?: number;
}

export interface ViewerNodeOptions {
  name: string;
  status?: string;
  apiVersion: string;
  kind: string;

  podDetails?: PodDetails;
}

enum PodStatus {
  OK = 'podOK',
  Warning = 'podWarning',
  Error = 'podError',
}
const podStatusTypes: PodStatus[] = [
  PodStatus.OK,
  PodStatus.Warning,
  PodStatus.Error,
];

function calculatePodPercentages(options: ViewerNodeOptions) {
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
    podOptions = { ...podOptions, ...podStatus };
  }
  return podOptions;
}

export const node = (id: string, options: ViewerNodeOptions): ViewerNode => {
  const label = `${options.name}\n${options.apiVersion} ${options.kind}`;

  return {
    type: 'node',
    data: { id, label, ...options, ...calculatePodPercentages(options) },
  };
};

export const connect = (
  source: string,
  target: string,
  connectionType = 'explicit'
): ViewerEdge => {
  const id = `${source}-${target}`;
  return {
    type: 'edge',
    data: { id, source, target, connectionType },
    selected: false,
  };
};

export const defaultElements: ViewerElement[] = [
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
  node('cm4', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm4',
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
