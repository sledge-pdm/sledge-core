export type BaseLayerColorMode = 'transparent' | 'white' | 'black' | 'custom';
export type BaseLayer = {
  colorMode: BaseLayerColorMode;
  customColor?: string;
};

export type LayerListState = {
  baseLayer: BaseLayer;
  activeLayerId: string;
  selectionEnabled: boolean;
  selected: Set<string>;
};
