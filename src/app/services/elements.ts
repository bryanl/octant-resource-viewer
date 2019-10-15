import { View } from '../view';

export interface ViewerNodeData {
  apiVersion: string;
  kind: string;
  name: string;
  podDetails?: PodDetails;
  id: string;
  label: string;
  status: string;
  issues: NodeIssue[];
  views?: View[];
}

export interface ViewerNodeOptions {
  name: string;
  status: string;
  apiVersion: string;
  kind: string;

  podDetails?: PodDetails;
  issues: NodeIssue[];

  views?: View[];
}

export interface NodeIssue {
  content: string;
  status: string;
}

export interface PodDetails {
  pods: PodData[];
}

export interface PodData {
  name: string;
  status: string;
  node: string;
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

enum PodStatus {
  OK = 'ok',
  Warning = 'warning',
  Error = 'error',
}

function calculatePodPercentages(options: ViewerNodeOptions) {
  let podOptions = {};
  if (options.podDetails) {
    const podDetails = options.podDetails as PodDetails;

    if (podDetails.pods) {
      let status = {
        [PodStatus.OK]: 0,
        [PodStatus.Warning]: 0,
        [PodStatus.Error]: 0,
      };
      status = podDetails.pods.reduce((accum, pod) => {
        accum[pod.status]++;
        return accum;
      }, status);

      const podCount = Object.values(status).reduce((prev, cur) => prev + cur);
      const summary = Object.entries(status).reduce((accum, [name, value]) => {
        accum[`${name}Percentage`] = (value / podCount) * 100;
        return accum;
      }, {});

      podOptions = { ...podOptions, ...summary };
    }
  }
  return podOptions;
}

/**
 * Create a node
 *
 * @param id id for the node
 * @param options options for the node
 */
export const node = (id: string, options: ViewerNodeOptions): ViewerNode => {
  const label = `${options.name}\n${options.apiVersion} ${options.kind}`;

  if (!options.issues) {
    options.issues = [];
  }

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
    issues: [],
  }),
  node('replica-set-1', {
    apiVersion: 'apps/v1',
    kind: 'ReplicaSet',
    name: 'deployment-1a',
    status: 'ok',
    issues: [],
  }),
  node('service', {
    apiVersion: 'v1',
    kind: 'Service',
    name: 'service',
    status: 'ok',
    issues: [],
  }),
  node('pods-1', {
    status: 'ok',
    name: 'deployment-1a pods',
    kind: 'Pod',
    apiVersion: 'v1',
    podDetails: {
      pods: [
        { name: 'pod-1', status: 'ok', node: 'node-1' },
        { name: 'pod-2', status: 'ok', node: 'node-1' },
        { name: 'pod-3', status: 'ok', node: 'node-2' },
        { name: 'pod-4', status: 'ok', node: 'node-2' },
        { name: 'pod-5', status: 'ok', node: 'node-3' },
      ],
    },
    issues: [],
    views: [
      {
        metadata: {
          type: 'pod-view',
        },
        config: {
          pods: [
            { name: 'pod-1', status: 'ok', node: 'node-1' },
            { name: 'pod-2', status: 'ok', node: 'node-1' },
            { name: 'pod-3', status: 'ok', node: 'node-2' },
            { name: 'pod-4', status: 'ok', node: 'node-2' },
            { name: 'pod-5', status: 'ok', node: 'node-3' },
          ],
        },
      },
    ],
  }),
  node('ingress', {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    name: 'ingress',
    status: 'ok',
    issues: [],
  }),
  node('service-account', {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    name: 'service-account',
    status: 'ok',
    issues: [],
  }),
  node('cm1', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm1',
    status: 'ok',
    issues: [],
  }),
  node('cm2', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm2',
    status: 'ok',
    issues: [],
  }),
  node('cm3', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm3',
    status: 'ok',
    issues: [],
  }),
  node('cm4', {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    name: 'cm4',
    status: 'ok',
    issues: [],
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
