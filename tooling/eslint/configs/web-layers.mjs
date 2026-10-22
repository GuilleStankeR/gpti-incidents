const WEB_SOURCE = './apps/web/src';
const FEATURES = `${WEB_SOURCE}/features`;

const FEATURE_ISOLATION_MESSAGE = 'Features cannot import from other features (except auth).';

const featureIsolationZones = (featureNames) =>
  featureNames.map((featureName) => ({
    target: `${FEATURES}/${featureName}`,
    from: featureNames
      .filter((otherFeatureName) => otherFeatureName !== featureName)
      .map((otherFeatureName) => `${FEATURES}/${otherFeatureName}`),
    message: FEATURE_ISOLATION_MESSAGE,
  }));

export const WEB_LAYER_ZONES = [
  {
    target: `${WEB_SOURCE}/shared`,
    from: [FEATURES, `${WEB_SOURCE}/app`],
    message: 'Shared code cannot depend on features or on the app shell.',
  },
  {
    target: FEATURES,
    from: `${WEB_SOURCE}/app`,
    message: 'Features cannot depend on the app shell.',
  },
  {
    target: `${FEATURES}/auth`,
    from: [`${FEATURES}/incidents`, `${FEATURES}/metrics`],
    message: FEATURE_ISOLATION_MESSAGE,
  },
  ...featureIsolationZones(['incidents', 'metrics']),
  {
    target: `${FEATURES}/*/components`,
    from: `${FEATURES}/*/api`,
    message: 'Components must access remote data through hooks, not API modules.',
  },
];
