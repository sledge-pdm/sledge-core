export enum LayerType {
  Base,
  Dot,
  Image,
  Automate,
}

export enum BlendMode {
  normal = 'Normal',
  multiply = 'Multiply',
  screen = 'Screen',
  overlay = 'Overlay',
  softLight = 'Soft Light',
  hardLight = 'Hard Light',
  linearLight = 'Linear Light',
  vividLight = 'Vivid Light',
}

export type Layer = {
  id: string;
  name: string;
  type: LayerType;
  opacity: number;
  mode: BlendMode;
  enabled: boolean;
  cutFreeze: boolean;
};
