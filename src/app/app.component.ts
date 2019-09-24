import { Component } from '@angular/core';

const colors = {
  ok: '#DFF0D0',
  okBorder: '#62A420',
  warning: '#FEF3B5',
  warningBorder: '#EDB200',
  error: '#F5DBD9',
  errorBorder: '#e12200',
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
      node('replica-set', { name: 'deployment-12345', status: 'error' }),
      node('service'),
      node('pods', {
        name: 'deployment-12345 pods',
        kind: 'Pod',
        apiVersion: 'v1',
        podOK: 50,
      }),
      node('service'),
      node('ingress'),
      node('service-account'),
      node('node1'),
      node('node3'),
      node('node2'),
    ],
    edges: [
      connect(
        'replica-set',
        'deployment'
      ),
      connect(
        'pods',
        'replica-set'
      ),
      connect(
        'service',
        'pods'
      ),
      connect(
        'ingress',
        'service'
      ),
      connect(
        'pods',
        'service-account'
      ),
    ],
  };

  layout = {
    name: 'breadthfirst',
    grid: true,
    spacingFactor: 0.75,
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
        label: 'data(name)',
        'border-style': 'solid',
        'border-width': '2px',
        padding: '9px',
        'text-valign': 'top',
        'text-halign': 'center',
        'text-margin-y': '-6px',
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
      },
    },
    {
      selector: 'edge',
      style: {
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#C1CDD4',
        'line-color': '#C1CDD4',
        width: '2px',
        'curve-style': 'bezier',
        'arrow-scale': 1,
        'target-distance-from-node': '8px',
        'source-distance-from-node': '8px',
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
        'border-width': '2px',
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

const connect = (source: string, target: string) => {
  return {
    data: { source, target },
  };
};
