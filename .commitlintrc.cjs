module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    name: '@commitlint/parse',
    parserOpts: {
      headerPattern: /^(?:(?<type>[\w-]+)(?:\((?<scope>.*)\))?!?:\s)?(?<subject>.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-empty': [0],
    'type-case': [0],
    'type-enum': [0],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
  },
};
