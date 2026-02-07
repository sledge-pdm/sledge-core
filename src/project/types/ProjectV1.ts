import { Size2D } from '../../types/Size';
import { HistoryStacks } from '../project_types';
import { ProjectBase } from './base';
import { ProjectV0 } from './ProjectV0';

// ProjectV1 Structure
// refer commit 888680a for more info

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
  dotMagnification: number;
  cutFreeze: boolean;
}

type ImagePoolEntry = {
  id: string;
  originalPath?: string; // original image file path (deprecated)
  descriptionName?: string;

  webpBuffer: Uint8Array; // webp-compressed image buffer
  base: { width: number; height: number };

  transform: { x: number; y: number; scaleX: number; scaleY: number; rotation: number; flipX: boolean; flipY: boolean };

  opacity: number;
  visible: boolean;
};

/**
 *  @deprecated ProjectV1 was used in sledge <= 0.1.5.
 *  !!!DO NOT MODIFY THIS INTERFACE FOR USERS COMPATIBILITY!!!
 */
export interface ProjectV1 extends ProjectBase {
  canvas: {
    store: {
      canvas: Size2D;
    };
  };
  layers: {
    store: {
      layers: Layer[];
      baseLayer: {
        colorMode: 'transparent' | 'white' | 'black' | 'custom';
        customColor?: string; // カスタムカラーモード用のHEX色
      };
      activeLayerId: string;
      selectionEnabled: boolean;
      selected: Set<string>;
      isImagePoolActive: boolean;
    };
    buffers: Map<
      string, // layer id
      {
        webpBuffer: Uint8Array; // webp packed buffer
      }
    >;
  };
  project: {
    store: {
      loadProjectVersion?: {
        sledge: string; // semver
        project: number; // VX
      };

      thumbnailPath: string | undefined;
      isProjectChangedAfterSave: boolean;
      lastSavedPath: string | undefined;
      lastSavedAt: Date | undefined;

      autoSnapshotEnabled?: boolean;
      autoSnapshotInterval?: number; // in seconds
    };
  };
  imagePool: {
    store: {
      entries: ImagePoolEntry[];
      selectedEntryId: string | undefined;
      preserveAspectRatio: boolean;
    };
  };
  history: {
    undoStack: HistoryStacks['undoStack'];
    redoStack: HistoryStacks['redoStack'];
  };
  snapshots: {
    store: {
      snapshots: {
        id: string;
        name: string;
        description?: string;
        createdAt: number;
        snapshot: ProjectV0 | ProjectV1;
        thumbnail?: {
          webpBuffer: Uint8Array;
          width: number;
          height: number;
        };
      }[];
    };
  };
}
