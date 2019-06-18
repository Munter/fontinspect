const config = {
  env: {
    node: true
  },
  plugins: ['prettier', 'node'],
  extends: ['pretty-standard'],
  rules: {
    'prettier/prettier': 'error'
  }
};

module.exports = config;
