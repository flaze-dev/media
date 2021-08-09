import { execSync } from "child_process";
import fs from "fs/promises";
import prompts from "prompts";

(async () => {
  // Config
  const deleteSetup = true;
  const packageJson = "package.json";

  // Read package.json as JSON
  const file = await fs.readFile(packageJson);
  const fileAsString = file.toString();
  const fileAsJson = JSON.parse(fileAsString);

  // Version
  fileAsJson.version = "0.0.0";

  // Name
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Project name',
  });

  fileAsJson.name = `@flaze/${name}`;

  // Repository
  fileAsJson.repository = `https://github.com/flaze-web/${name}.git`;

  // Remove script
  delete fileAsJson.scripts.setup;

  // Update package.json
  const updatedAsString = JSON.stringify(fileAsJson, null, 2);
  await fs.writeFile(packageJson, updatedAsString);

  // Upgrade to latest
  console.log(`Preparing '@flaze/${name}'`);
  const dependencies = Object.entries(fileAsJson.dependencies).map(([dep, v]: any) => dep);
  const devDependencies = Object.entries(fileAsJson.devDependencies).map(([dep, v]: any) => dep);;

  const deps = [...dependencies, ...devDependencies];
  const latestDeps = deps.map((dep: string) => `${dep}@latest`);

  execSync(`yarn upgrade ${latestDeps.join(' ')}`);

  // Remove this
  if (deleteSetup) {
    // Uninstall packages
    // yarn add -D prompts @types/prompts ts-node 
    execSync("yarn remove prompts @types/prompts ts-node");

    // Remove cli directory
    await fs.rm("cli", { recursive: true, force: true });
    await fs.rm("tsconfig.cli.json", { force: true });
    await fs.rm("yarn.lock", { force: true });

    // Install
    execSync("yarn install");
  }
})();

