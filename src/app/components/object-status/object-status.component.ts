import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  NodeIssue,
  ViewerElement,
  ViewerNode,
  ViewerNodeData,
} from '../../services/elements';

@Component({
  selector: 'app-object-status',
  templateUrl: './object-status.component.html',
  styleUrls: ['./object-status.component.scss'],
})
export class ObjectStatusComponent implements OnChanges {
  @Input() nodeData: ViewerNodeData;
  @Input() elements: ViewerElement[] = [];

  issues: NodeIssue[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.elements.forEach(element => element.type === 'node');
  }
}
