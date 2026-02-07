import { Size2D } from '../../types/Size';
import { ProjectBase } from '../types';

export interface ProjectSnapshot {
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

export type SnapshotsPart = ProjectSnapshot[];
