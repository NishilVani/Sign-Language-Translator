// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;

// ///Neww

// const { getDefaultConfig } = require("expo/metro-config");

// module.exports = (() => {
//     const config = getDefaultConfig(__dirname);

//     const { transformer, resolver } = config;

//     config.transformer = {
//         ...transformer,
//         babelTransformerPath: require.resolve("react-native-svg-transformer"),
//     };
//     config.resolver = {
//         ...resolver,
//         assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//         sourceExts: [...resolver.sourceExts, "svg"],
//     };

//     return config;
// })();
// const { getDefaultConfig } = require("metro-config");

// module.exports = (async () => {
//     const {
//         resolver: { sourceExts, assetExts },
//     } = await getDefaultConfig();

//     return {
//         transformer: {
//             babelTransformerPath: require.resolve("react-native-svg-transformer"),
//             getTransformOptions: async () => ({
//                 transform: {
//                     experimentalImportSupport: false,
//                     inlineRequires: true,
//                 },
//             }),
//         },
//         resolver: {
//             assetExts: assetExts.filter((ext) => ext !== "svg"),
//             sourceExts: [...sourceExts, "svg"],
//         },
//     };
// })();
