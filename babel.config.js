module.exports = function (api) {
  api.cache(true);
  // NOTICE: 'react-native-reanimated/plugin' must be last in the list
  const plugins = ['react-native-reanimated/plugin'];

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
