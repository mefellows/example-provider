// Utility function to run Drift verifier with specified test files and configuration
const { spawn } = require('child_process');

const runDrift = (variant = 'default') => {
  const testFilePath = variant === 'postgres' 
    ? './drift-postgres/drift.yaml'
    : './drift/drift.yaml';

  return new Promise((resolve, reject) => {
    const child = spawn(
      'drift',
      [
        'verifier',
        '--test-files',
        testFilePath,
        '--server-url',
        'http://localhost:8080/',
        '--log-level',
        'error',
        '--output-dir',
        'output',
        '--generate-result'
      ],
      {
        stdio: 'inherit',
        shell: true
      }
    );

    child.on('error', (err) => reject(err));
    child.on('close', (code) => resolve(code ?? 1));
  });
};

module.exports = { runDrift: runDrift };

