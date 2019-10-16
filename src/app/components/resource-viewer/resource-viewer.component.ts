import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ViewerElement } from '../../services/elements';
import { colors } from '../../colors';

const selectedBorderWidth = 2;

const dagreLayout = {
  name: 'dagre',
  rankDir: 'RL',
  ranker: 'network-tree',
  spacingFactor: 1.1,
};

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.scss'],
})
export class ResourceViewerComponent implements OnChanges {
  constructor() {}

  @Input() elements: ViewerElement[] = [];
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  currentElements: ViewerElement[] = [];

  layout = dagreLayout;

  style = [
    {
      selector: 'node[kind != "Pod"]',
      style: {
        shape: 'ellipse',
      },
    },
    {
      selector: 'node',
      style: {
        'font-family': 'Metropolis',
        'font-size': 10,
        label: 'data(label)',
        'text-wrap': 'wrap',
        'border-style': 'solid',
        'border-width': 1,
        padding: 7,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
      },
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': selectedBorderWidth,
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
          if (data.errorPercentage > 0) {
            return colors.errorBorder;
          } else if (data.warningPercentage > 0) {
            return colors.warningBorder;
          }
          return colors.okBorder;
        },
        'border-width': 1,
        content: 'data(label)',
        'text-wrap': 'wrap',
        'pie-size': '150%',
        'pie-1-background-color': colors.ok,
        'pie-1-background-size': 'data(okPercentage)',
        'pie-2-background-color': colors.warning,
        'pie-2-background-size': 'data(warningPercentage)',
        'pie-3-background-color': colors.error,
        'pie-3-background-size': 'data(errorPercentage)',
      },
    },
    {
      selector: 'node[kind = "Pod"][apiVersion = "v1"]:selected',
      style: {
        'border-width': selectedBorderWidth,
      },
    },
  ];

  zoom = {
    min: 0.5,
    max: 1.5,
  };

  nodeSelected = event => {
    this.selected.emit(event);
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.elements.currentValue) {
      const cur = changes.elements.currentValue as ViewerElement[];

      if (cur.length > 0 && cur.filter(e => e.selected).length < 1) {
        // select an element if non are selected
        cur[0].selected = true;
      }
      this.currentElements = cur;
    }
  }
}
