import { spawn } from 'child_process';
function testRunner(numberOfThreads: number, retryCount: number, tags: string) {

  console.log ("Test Executions Started")
  const command: string = `cucumber-js --parallel ${numberOfThreads} --retry ${retryCount} --tags "${tags}" test`;

  const testProcess = spawn(command, { shell: true });

  testProcess.stdout.on('data', (data: Buffer) => {
    console.log(data.toString());
  });

  testProcess.stderr.on('data', (data: Buffer) => {
    console.log(data.toString());
  });

  testProcess.on('error', (err) => {
    console.log(`Error executing tests: ${err.message}`);
  });
}

const numberOfThreads: number = 1; // Set desired parallel count
const retryCount: number = 0;    // Set desired retry failed test count
const tags: string = '@smoke';   // Set desired Cucumber tags (e.g., '@smoke')

testRunner(numberOfThreads, retryCount, tags);