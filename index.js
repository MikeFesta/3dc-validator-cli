import chalk from 'chalk'; // For colored output
import { Validator } from '@mikefesta/khronos-3d-commerce-validator';

// Extract the current working path
const getPathFromCommandLineArgs = () => {
  const path = process.argv[1];
  return path.substring(0, path.lastIndexOf('/') + 1);
};

// Extract the full path of the provided schema (1st argument after index.js)
const getSchemaPathFromCommandLineArgs = () => {
  if (process.argv.length < 3) {
    throw new Error('A schema and 3D model need to be provided as arguments')
  }
  const path = getPathFromCommandLineArgs();
  const schema = process.argv[2];
  return path + schema;
};

// Extract the full path of the provided 3d model (2nd argument after index.js)
const getModelPathFromCommandLineArgs = () => {
  if (process.argv.length < 4) {
    throw new Error('A 3D model needs to be provided as the second argument')
  }
  const path = getPathFromCommandLineArgs();
  const glb = process.argv[3];
  return path + glb;
};

// Print a message at the start of the program
const printWelcomeMessage = () => {
  console.log(
    chalk.green(
      '-- 3D COMMERCE ASSET VALIDATOR --'
    )
  );
};

// START
try {
  const validator = new Validator();
  printWelcomeMessage();

  // 1. Load Schema
  const schemaFullPath = getSchemaPathFromCommandLineArgs();
  await validator.schema.loadFromFileSystem(schemaFullPath);

  // 2. Load GLB
  const glbFullPath = getModelPathFromCommandLineArgs();
  await validator.model.loadFromFileSystem(glbFullPath);

  // 3. Run Validation
  validator.generateReport();

  // Helpful to print the whole JSON object for testing during development
  console.log(validator);

  // 4. Show Report
  console.log(chalk.magenta('=== Validation Report ==='));
  // Loop through all available items in the report and print their status
  validator.report.getItems().forEach(item => {
    console.log(
      item.name + ': ' +
      (item.tested ?
        (item.pass ? chalk.green('PASS') : chalk.red('FAIL'))
        :
        chalk.gray('NOT TESTED')
      )
    );
  });
  console.log(chalk.magenta('========================='));
} catch (err) {
  console.log(chalk.red('ERROR: ' + err.message));
}

