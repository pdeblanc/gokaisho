import path from "node:path";
import { access, constants, mkdir, readFile, writeFile } from "node:fs/promises";
import * as electron from "electron";
import { ipcFunction } from "./ipc";

const PACKAGE_ROOT = path.dirname(__dirname);

async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
};


async function ensurePath(path: string): Promise<string> {
  await mkdir(path, {recursive: true});
  return path;
}

export const getIsPackaged = ipcFunction(
  "get-is-packaged", async (): Promise<boolean> => electron.app.isPackaged
);

export const getUserDataPath = ipcFunction(
  "get-user-data-path",
  async (): Promise<string> => {
    const isPackaged = await getIsPackaged();
    // dev mode
    if (!isPackaged) {
      return ensurePath(path.join(PACKAGE_ROOT, "user_data"));
    }
    // prod mode
    return ensurePath(path.join(electron.app.getPath("userData"), "user_data"));
  }
);

export const promptForKataGoExecutablePath = ipcFunction(
  "prompt-for-katago-executable-path",
  async(defaultPath): Promise<string | null> => {
    const result = await electron.dialog.showOpenDialog(null, {
      defaultPath,
      properties: ['openFile', 'showHiddenFiles'],
      title: "Select the KataGo executable",
    });
    if (result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  }
)

export async function getAnalysisConfigPath(): Promise<string> {
  const userDataPath = await getUserDataPath();
  const configPath = path.join(userDataPath, "analysis_config.cfg");
  const alreadyExists = await exists(configPath);
  if (!alreadyExists) {
    const templatePath = path.join(PACKAGE_ROOT, "analysis_config.cfg");
    let data = await readFile(templatePath, "utf8");
    const logDir = path.join(userDataPath, "analysis_logs");
    data = data.replace("/path/to/analysis_logs", logDir);
    await writeFile(configPath, data, "utf8");
  }
  return configPath;
}
