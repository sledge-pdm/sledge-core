import { Size2D } from '../../types/Size';
import { ProjectBase } from './base';

enum LayerType {
  Base,
  Dot,
  Image,
  Automate,
}

enum BlendMode {
  normal = 'Normal',
  multiply = 'Multiply',
  screen = 'Screen',
  overlay = 'Overlay',
  softLight = 'Soft Light',
  hardLight = 'Hard Light',
  linearLight = 'Linear Light',
  vividLight = 'Vivid Light',
}

interface Layer {
  id: string;
  name: string;
  type: LayerType;
  typeDescription: string;
  opacity: number;
  mode: BlendMode;
  enabled: boolean;
  cutFreeze: boolean;
}

// BaseLayer types
type BaseLayerColorMode = 'transparent' | 'white' | 'black' | 'custom';

type BaseLayer = {
  colorMode: BaseLayerColorMode;
  customColor?: string; // カスタムカラーモード用のHEX色
};

type HistoryActionTypes =
  | 'canvas_size'
  | 'color'
  | 'convert_selection'
  | 'image_pool'
  | 'layer_buffer'
  | 'layer_list'
  | 'layer_list_reorder'
  | 'layer_list_cut_paste'
  | 'layer_merge'
  | 'layer_props'
  | 'unknown';

interface BaseHistoryActionProps {
  context?: any;
  label?: string;

  version?: number;
}

interface SerializedHistoryAction {
  type: HistoryActionTypes;
  props: BaseHistoryActionProps;
}

type DeflatedHistorySnapshot = {
  bounds: { x: number; y: number; width: number; height: number };
  size: { width: number; height: number };
  deflated: Uint8Array;
  fullLayer?: boolean;
};

type ImagePoolEntry = {
  id: string;
  base: { width: number; height: number };
  transform: { x: number; y: number; scaleX: number; scaleY: number; rotation: number; flipX: boolean; flipY: boolean };
  opacity: number;
  visible: boolean;
};

type ImagePoolImage = { mimeType: 'image/png' | 'image/jpeg' | 'image/webp'; deflatedBuffer: Uint8Array };

interface ProjectSnapshot {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  project: ProjectBase;
  snapshot?: ProjectBase; // legacy V2
  projectVersion?: number;
  canvasSize?: Size2D;
  thumbnail?: {
    packedBuffer: Uint8Array;
    width: number;
    height: number;
  };
}

/**
 *  Present project format.
 */
export interface ProjectV2 extends ProjectBase {
  canvas: {
    size: Size2D;
  };
  layers: {
    layers: Layer[];
    buffers: Map<
      string, // layer id
      {
        deflatedBuffer: Uint8Array; // deflate compressed buffer
      }
    >;
    state: {
      baseLayer: BaseLayer;
      activeLayerId: string;
      selectionEnabled: boolean;
      selected: Set<string>;
    };
  };
  project: {
    thumbnailPath: string | undefined;
    lastSavedPath: string | undefined;
    lastSavedAt: Date | undefined;

    autoSnapshotEnabled?: boolean;
    autoSnapshotInterval?: number; // in seconds
  };
  imagePool: {
    entries: ImagePoolEntry[];
    images: Map<string, ImagePoolImage>;
    state: {
      selectedEntryId: string | undefined;
      preserveAspectRatio: boolean;
    };
  };
  history: {
    undoStack: SerializedHistoryAction[];
    redoStack: SerializedHistoryAction[];
    layerHistories?: Record<
      string,
      {
        undoStack: DeflatedHistorySnapshot[];
        redoStack: DeflatedHistorySnapshot[];
      }
    >;
  };
  snapshots: ProjectSnapshot[];
}
