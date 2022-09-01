import path from "node:path";
import * as electron from "electron";

const PACKAGE_ROOT = path.dirname(__dirname);

export async function getIsPackaged(): Promise<boolean> {
  const isRenderer = process && process.type === "renderer";
  if (isRenderer) {
    return electron.ipcRenderer.invoke("get-is-packaged");
  }
  return electron.app.isPackaged;
}

export async function getUserDataPath(): Promise<string> {
  // dev mode
  const isPackaged = await getIsPackaged();
  if (!isPackaged) {
    return path.join(PACKAGE_ROOT, "user_data");
  }
  // prod mode
  const isRenderer = process && process.type === "renderer";
  if (isRenderer) {
    return electron.ipcRenderer.invoke("get-user-data-path");
  }
  return path.join(electron.app.getPath("userData"), "user_data");
}
