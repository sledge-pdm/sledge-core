import { ProjectInfo, Selection } from '../project_types';
import { CanvasInfo } from '../project_types/Canvas';
import { HistoryStacks } from '../project_types/History';
import type { ImagePoolEntry, ImagePoolImage, ImagePoolState } from '../project_types/ImagePool';
import { Layer } from '../project_types/Layer';
import { LayerListState } from '../project_types/LayerListState';
import { SnapshotsPart } from '../project_types/Snapshots';
import { ProjectV0 } from '../types/ProjectV0';
import { ProjectAdapter } from './base';

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

  getCanvasInfo(): CanvasInfo {
    return {
      size: this.project.canvasStore.canvas,
    };
  }

  getLayers(): Layer[] {
    return this.project.layerListStore.layers.map((l) => {
      return {
        id: l.id,
        name: l.name,
        type: l.type,
        opacity: l.opacity,
        mode: l.mode,
        enabled: l.enabled,
        cutFreeze: false,
      };
    });
  }

  getSelection(): Selection {
    return {
      mask: undefined,
    };
  }

  async getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined> {
    return this.project.layerBuffers.get(layerId);
  }

  getLayerListState(): LayerListState {
    return {
      activeLayerId: this.project.layerListStore.activeLayerId ?? '',
      baseLayer: {
        colorMode: this.project.layerListStore.baseLayer?.colorMode ?? 'transparent',
        customColor: this.project.layerListStore.baseLayer?.customColor ?? undefined,
      },
      selectionEnabled: false,
      selected: new Set(),
    };
  }

  getProjectInfo(): ProjectInfo {
    return {
      thumbnailPath: this.project.projectStore.thumbnailPath ?? undefined,
      lastSavedPath: undefined,
      lastSavedAt: this.project.projectStore.lastSavedAt ?? undefined,
      autoSnapshotEnabled: this.project.projectStore.autoSaveEnabled ?? false,
      autoSnapshotInterval: this.project.projectStore.autoSaveInterval ?? 60,
    };
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool;
    if (!Array.isArray(entries)) return [];
    return entries.map((entry) => {
      return {
        id: entry.id,
        base: {
          width: entry.base?.width ?? 0,
          height: entry.base?.height ?? 0,
        },
        descriptionName: undefined,
        webpBuffer: new Uint8Array(0),
        transform: {
          x: entry.transform?.x ?? 0,
          y: entry.transform?.y ?? 0,
          scaleX: entry.transform?.scaleX ?? 1,
          scaleY: entry.transform?.scaleY ?? 1,
          rotation: 0,
          flipX: false,
          flipY: false,
        },
        opacity: entry.opacity ?? 1,
        visible: entry.visible ?? true,
      };
    });
  }

  // V0 handles image resource with raw path so just dispose it
  getImagePoolImageOf(_entryId: string): ImagePoolImage | undefined {
    return undefined;
  }

  getImagePoolState(): ImagePoolState {
    return {
      selectedEntryId: this.project.imagePoolStore?.selectedEntryId ?? undefined,
      preserveAspectRatio: this.project.imagePoolStore?.preserveAspectRatio ?? true,
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
