export interface View {
  metadata: {
    type: string;
  };
  config: any;
}

export interface PodView extends View {
  config: {
    pods: PodStatus[];
  };
}

export interface PodStatus {
  name: string;
  status: string;
  node: string;
}
