import { ForgeArch, ForgePlatform } from '@electronite-forge/shared-types';

// TODO: convert to an import statement when this is a public API
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { allOfficialArchsForPlatformAndVersion } = require('electronite-packager/src/targets');

export default function parseArchs(platform: ForgePlatform | string, declaredArch: ForgeArch | 'all' | string, electronVersion: string): ForgeArch[] {
  if (declaredArch === 'all') {
    return allOfficialArchsForPlatformAndVersion(platform, electronVersion) || ['x64'];
  }

  return declaredArch.split(',') as ForgeArch[];
}
