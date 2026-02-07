export type HistoryContext = {
  icon: string;
  description: string;
};

export type SerializedHistoryCommand = {
  type: string;
  props: unknown;
};

export type SerializedCommandLine = {
  command: SerializedHistoryCommand;
  undoOrder?: number;
  redoOrder?: number;
};

export type SerializedCommandsHistoryEntry = {
  entryType: 'commands';
  commands: SerializedCommandLine[];
  context?: HistoryContext;
};

export type SerializedHistoryEntry = SerializedCommandsHistoryEntry;

type DeflatedHistorySnapshot = {
  bounds: { x: number; y: number; width: number; height: number };
  size: { width: number; height: number };
  deflated: Uint8Array;
  fullLayer?: boolean;
};

export type HistoryStacks = {
  undoStack: SerializedHistoryEntry[];
  redoStack: SerializedHistoryEntry[];
  layerHistories?: Record<string, { undoStack: DeflatedHistorySnapshot[]; redoStack: DeflatedHistorySnapshot[] }>;
};
