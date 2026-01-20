import { ProjectV0 } from '../types/ProjectV0';
import { ProjectAdapter } from './base';
import { Canvas } from './parts/Canvas';
import { HistoryStacks } from './parts/History';
import { ImagePoolEntry, ImagePoolImage, ImagePoolState } from './parts/ImagePool';
import { Layer } from './parts/Layer';
import { LayerListState } from './parts/LayerListState';
import { ProjectPart } from './parts/Project';
import { SnapshotsPart } from './parts/Snapshots';

export class V0Adapter extends ProjectAdapter<ProjectV0> {
  ADAPTER_PROJECT_VERSION = 0;

  // override getVersions because V0 project doesn't have versions signature
  getVersions(): {
    sledge?: string;
    project?: number;
  } {
    return {
      // pretend 0.0.12 (known latest V0 version)
      sledge: '0.0.12',
      project: 0,
    };
  }

  getCanvasInfo(): Canvas {
    return {
      size: this.project.canvasStore.canvas,
    };
  }

  getLayers(): Layer[] {
    return this.project.layerListStore.layers.map((l) => {
      return {
        ...l,
        cutFreeze: false,
      } as Layer;
    });
  }

  async getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined> {
    return this.project.layerBuffers.get(layerId);
  }

  getLayerListState(): LayerListState {
    return {
      ...this.project.layerListStore,
      selectionEnabled: false,
      selected: new Set(),
    };
  }

  getProjectInfo(): ProjectPart {
    return {
      ...this.project.projectStore,
      lastSavedPath: undefined,
    };
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool;
    if (!Array.isArray(entries)) return [];
    return entries.map((entry) => {
      return {
        ...entry,
        descriptionName: undefined,
        webpBuffer: new Uint8Array(0),
        transform: {
          ...entry.transform,
          rotation: 0,
          flipX: false,
          flipY: false,
        },
        opacity: entry.opacity,
        visible: entry.visible,
      };
    });
  }

  // V0 handles image resource with raw path so just dispose it
  getImagePoolImageOf(_entryId: string): ImagePoolImage | undefined {
    return undefined;
  }

  getImagePoolState(): ImagePoolState {
    return {
      ...this.project.imagePoolStore,
    };
  }

  getHistory(): HistoryStacks {
    return {
      undoStack: [],
      redoStack: [],
    };
  }

  async getSnapshots(): Promise<SnapshotsPart> {
    return [];
  }
}
