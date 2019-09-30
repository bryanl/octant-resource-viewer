import { Component, Input, OnInit } from '@angular/core';
import { ViewerNode } from '../../services/elements';

@Component({
  selector: 'app-object-status',
  templateUrl: './object-status.component.html',
  styleUrls: ['./object-status.component.scss'],
})
export class ObjectStatusComponent implements OnInit {
  @Input() node: ViewerNode;

  constructor() {}

  ngOnInit() {}
}
