import { Component } from '@angular/core';
import { Stylesheet } from 'cytoscape';

const colors = {
  ok: '#DFF0D0',
  okBorder: '#62A420',
  warning: '#FEF3B5',
  warningBorder: '#EDB200',
  error: '#F5DBD9',
  errorBorder: '#e12200',

  edge: '#c1cdd4',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'octant-resource-viewer';

  elements = {
    nodes: [
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
    ],
    edges: [
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
    ],
  };

  layout = {
    name: 'klay',
    klay: {
      edgeSpacingFactor: 1,
      spacing: 100,
      direction: 'LEFT',
    },
    // name: 'breadthfirst',
    // grid: true,
    // spacingFactor: 0.6,
    // maximal: true,
  };

  style = [
    {
      selector: 'node[kind != "Pod"]',
      style: {
        shape: 'rectangle',
      },
    },
    {
      selector: 'node',
      style: {
        'font-family': 'Metropolis',
        'font-size': 10,
        label: 'data(name)',
        'border-style': 'solid',
        'border-width': 1,
        padding: 9,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
      },
    },
    {
      selector: 'node[status = "ok"]',
      style: {
        'background-color': colors.ok,
        'border-color': colors.okBorder,
      },
    },
    {
      selector: 'node[status = "warning"]',
      style: {
        'background-color': colors.warning,
        'border-color': colors.warningBorder,
      },
    },
    {
      selector: 'node[status = "error"]',
      style: {
        'background-color': colors.error,
        'border-color': colors.errorBorder,
        'border-style': 'dashed',
        'border-dash-offset': 5,
      },
    },
    {
      selector: 'edge',
      style: {
        'font-family': 'Metropolis',
        width: '2px',
        'curve-style': 'bezier',
        'arrow-scale': 1,
        'target-distance-from-node': '8px',
        'source-distance-from-node': '8px',
      },
    },
    {
      selector: 'edge[connectionType = "explicit"]',
      style: {
        'source-arrow-shape': 'triangle',
        'line-color': colors.edge,
        'source-arrow-color': colors.edge,
      },
    },
    {
      selector: 'edge[connectionType = "implicit"]',
      style: {
        'line-color': colors.edge,
        'line-style': 'dashed',
        'line-dash-pattern': [6, 3],
      },
    },
    {
      selector: 'edge[connectionType = "field"]',
      style: {
        'font-size': 10,
        'text-margin-y': -20,
        label: 'data(label)',
        'source-arrow-shape': 'tee',
        'line-color': colors.edge,
        'source-arrow-color': colors.edge,
        'text-rotation': 'autorotate',
        'line-style': 'dashed',
      },
    },
    {
      selector: 'node[kind = "Pod"][apiVersion = "v1"]',
      style: {
        'background-color': 'white',
        'border-color': el => {
          const data = el.data();
          if (data.podErrorPercentage > 0) {
            return colors.errorBorder;
          } else if (data.podWarningPercentage > 0) {
            return colors.warningBorder;
          }
          return colors.okBorder;
        },
        'border-width': 1,
        content: 'data(name)',
        'pie-size': '150%',
        'pie-1-background-color': colors.ok,
        'pie-1-background-size': 'data(podOKPercentage)',
        'pie-2-background-color': colors.warning,
        'pie-2-background-size': 'data(podWarningPercentage)',
        'pie-3-background-color': colors.error,
        'pie-3-background-size': 'data(podErrorPercentage)',
      },
    },
  ];

  zoom = {
    min: 0.5,
    max: 1.5,
  };
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
  return {
    data: { source, target, connectionType },
  };
};
