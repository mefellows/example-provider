// Utility function to run Drift verifier with specified test files and configuration
const { spawn } = require('child_process');

const runQuilt = (variant = 'default') => {
  const testFilePath = variant === 'postgres' 
    ? './quilt-postgres/quilt.yaml'
    : './quilt/quilt.yaml';

  return new Promise((resolve, reject) => {
    const child = spawn(
      'quilt',
      [
        'verifier',
        '--test-files',
        testFilePath,
        '--server-url',
        'http://localhost:8080/',
        '--log-level',
        'trace',
        '--output-dir',
        'output'
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

module.exports = { runQuilt };

