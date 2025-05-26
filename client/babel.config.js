module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      ["react-native-worklets-core/plugin"],
      "react-native-reanimated/plugin",
    ],
  };
};
