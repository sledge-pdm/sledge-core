import { ProjectBase } from '../types';
import { Canvas } from './parts/Canvas';
import { HistoryStacks } from './parts/History';
import { ImagePoolEntry, ImagePoolImage, ImagePoolState } from './parts/ImagePool';
import { Layer } from './parts/Layer';
import { LayerListState } from './parts/LayerListState';
import { ProjectPart } from './parts/Project';
import { SnapshotsPart } from './parts/Snapshots';

export abstract class ProjectAdapter<P extends ProjectBase> {
  protected project: P;

  constructor(project: P) {
    this.project = project;
  }

  abstract ADAPTER_PROJECT_VERSION: number;

  getVersions(): {
    sledge?: string;
    project?: number;
  } {
    return {
      sledge: this.project?.version ?? undefined,
      project: this.project?.projectVersion ?? undefined,
    };
  }

  abstract getCanvasInfo(): Canvas;
  abstract getLayers(): Layer[];
  abstract getLayerListState(): LayerListState;
  abstract getRawBufferOf(layerId: string): Promise<Uint8ClampedArray | undefined>;
  abstract getProjectInfo(): ProjectPart;
  abstract getImagePoolEntries(): ImagePoolEntry[];
  abstract getImagePoolImageOf(entryId: string): ImagePoolImage | undefined;
  abstract getImagePoolState(): ImagePoolState;
  abstract getHistory(): HistoryStacks;
  abstract getSnapshots(): Promise<SnapshotsPart>;
}
