import { gzipDeflate } from '../../buffer/gzip';
import { toUint8Array } from '../../buffer/RawPixelData';
import { decodeWebp } from '../../buffer/webp';
import { Selection } from '../project_types';
import { CanvasInfo } from '../project_types/Canvas';
import { HistoryStacks } from '../project_types/History';
import type { ImagePoolEntry, ImagePoolImage, ImagePoolState } from '../project_types/ImagePool';
import { Layer } from '../project_types/Layer';
import { LayerListState } from '../project_types/LayerListState';
import { ProjectInfo } from '../project_types/Project';
import { ProjectSnapshot, SnapshotsPart } from '../project_types/Snapshots';
import { ProjectV1 } from '../types/ProjectV1';
import { ProjectAdapter } from './base';

export class V1Adapter extends ProjectAdapter<ProjectV1> {
  ADAPTER_PROJECT_VERSION = 1;

  getCanvasInfo(): CanvasInfo {
    return {
      size: this.project.canvas.store.canvas,
    };
  }

  getLayers(): Layer[] {
    return this.project.layers.store.layers.map((layer) => {
      return {
        id: layer.id,
        name: layer.name,
        type: layer.type,
        opacity: layer.opacity,
        mode: layer.mode,
        enabled: layer.enabled,
        cutFreeze: layer.cutFreeze ?? false,
      };
    });
  }

  async getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined> {
    const buffer = this.project.layers.buffers.get(layerId);
    if (!buffer) return undefined;

    const canvasSize = this.project.canvas.store.canvas;
    if (!canvasSize) return undefined;

    return await decodeWebp(buffer.webpBuffer, canvasSize.width, canvasSize.height);
  }

  getLayerListState(): LayerListState {
    const layerStore = this.project.layers.store;
    return {
      baseLayer: {
        colorMode: layerStore.baseLayer?.colorMode ?? 'transparent',
        customColor: layerStore.baseLayer?.customColor ?? undefined,
      },
      activeLayerId: layerStore.activeLayerId ?? '',
      selectionEnabled: layerStore.selectionEnabled ?? false,
      selected: layerStore.selected ?? new Set<string>(),
    };
  }

  getSelection(): Selection {
    return {
      mask: undefined,
    };
  }

  getProjectInfo(): ProjectInfo {
    const projectStore = this.project.project.store;
    return {
      thumbnailPath: projectStore.thumbnailPath ?? undefined,
      lastSavedPath: projectStore.lastSavedPath ?? undefined,
      lastSavedAt: projectStore.lastSavedAt ?? undefined,
      autoSnapshotEnabled: projectStore.autoSnapshotEnabled ?? false,
      autoSnapshotInterval: projectStore.autoSnapshotInterval ?? 60,
    };
  }

  getImagePoolEntries(): ImagePoolEntry[] {
    const entries = this.project.imagePool?.store?.entries;
    return Array.isArray(entries) ? entries : [];
  }

  getImagePoolImageOf(entryId: string): ImagePoolImage | undefined {
    const entries = this.project.imagePool?.store?.entries;
    if (!entries) return undefined;
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return undefined;
    return {
      deflatedBuffer: gzipDeflate(entry.webpBuffer),
      mimeType: 'image/webp',
    };
  }

  getImagePoolState(): ImagePoolState {
    const imagePoolStore = this.project.imagePool.store;
    return {
      selectedEntryId: imagePoolStore.selectedEntryId ?? undefined,
      preserveAspectRatio: imagePoolStore.preserveAspectRatio ?? true,
    };
  }

  getHistory(): HistoryStacks {
    return {
      undoStack: this.project.history.undoStack,
      redoStack: this.project.history.redoStack,
    };
  }

  async getSnapshots(): Promise<SnapshotsPart> {
    return Promise.all(
      this.project.snapshots.store.snapshots.map(async (v1Snap) => {
        const oldSnapshot = v1Snap.snapshot;
        if (v1Snap.thumbnail) {
          const { webpBuffer, width, height } = v1Snap.thumbnail;
          const rawThumbnailBuffer = await decodeWebp(webpBuffer, width, height);
          const deflated = toUint8Array(gzipDeflate(rawThumbnailBuffer));
          return {
            id: v1Snap.id,
            name: v1Snap.name,
            description: v1Snap.description,
            createdAt: v1Snap.createdAt,
            project: oldSnapshot,
            snapshot: undefined,
            projectVersion: undefined,
            canvasSize: undefined,
            thumbnail: {
              packedBuffer: deflated,
              width,
              height,
            },
          } as ProjectSnapshot;
        } else {
          return {
            id: v1Snap.id,
            name: v1Snap.name,
            description: v1Snap.description,
            createdAt: v1Snap.createdAt,
            project: oldSnapshot,
            snapshot: undefined,
            projectVersion: undefined,
            canvasSize: undefined,
            thumbnail: undefined,
          };
        }
      })
    );
  }
}
