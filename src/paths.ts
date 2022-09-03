import path from "node:path";
import { mkdir } from "node:fs/promises";
import * as electron from "electron";
import { ipcFunction } from "./ipc";

const PACKAGE_ROOT = path.dirname(__dirname);

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
