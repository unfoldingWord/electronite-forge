import type { ForgeConfig } from '@electronite-forge/shared-types';
import { MakerSquirrel } from '@electronite-forge/maker-squirrel';
import { MakerZIP } from '@electronite-forge/maker-zip';
import { MakerDeb } from '@electronite-forge/maker-deb';
import { MakerRpm } from '@electronite-forge/maker-rpm';
import { WebpackPlugin } from '@electronite-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
