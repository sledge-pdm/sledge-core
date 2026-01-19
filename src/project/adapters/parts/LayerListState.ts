export type LayerListState = {
  baseLayer: {
    colorMode: 'transparent' | 'white' | 'black' | 'custom';
    customColor?: string;
  };
  activeLayerId: string;
  selectionEnabled: boolean;
  selected: Set<string>;
};
