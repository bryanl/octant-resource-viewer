import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';

@Component({
  selector: 'app-unknown-dynamic',
  template: '<div>unknown view ({{view?.metadata.type}}</div>',
  styleUrls: ['./unknown-dynamic.component.scss'],
})
export class UnknownDynamicComponent extends DynamicComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
