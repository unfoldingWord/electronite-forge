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
};
