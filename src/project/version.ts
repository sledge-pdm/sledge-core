import { ProjectAdapter } from './adapters/base';
import { V0Adapter } from './adapters/v0';
import { V1Adapter } from './adapters/v1';
import { V2Adapter } from './adapters/v2';
import { ProjectBase } from './types/base';
import { ProjectV0 } from './types/ProjectV0';
import { ProjectV1 } from './types/ProjectV1';
import { ProjectV2 } from './types/ProjectV2';

export function getProjectVersion(project: ProjectBase): number {
  const projectVersion: number | undefined = project?.projectVersion;

  if (projectVersion === undefined) {
    return 0;
  }

  return projectVersion;
}

export function getProjectAdapter(project: ProjectBase): ProjectAdapter<any> | undefined {
  const projectVersion = getProjectVersion(project);

  switch (projectVersion) {
    case 0:
      return new V0Adapter(project as ProjectV0);
    case 1:
      return new V1Adapter(project as ProjectV1);
    case 2:
      return new V2Adapter(project as ProjectV2);
  }

  return undefined;
}
