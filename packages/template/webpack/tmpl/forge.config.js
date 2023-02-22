module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electronite-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electronite-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electronite-forge/maker-deb',
      config: {},
    },
    {
      name: '@electronite-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electronite-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};
