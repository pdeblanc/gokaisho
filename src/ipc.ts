import * as electron from "electron";

type AsyncFn = (...args: any) => Promise<any>;

type IpcMapping = {
  name: string;
  f: AsyncFn;
}

export const ipcMappings: IpcMapping[] = [];

export function ipcFunction<T extends AsyncFn>(name: string, f: T): T {
  ipcMappings.push({name, f: f});
  function newF(...args: any): Promise<any> {
    const isRenderer = process && process.type === "renderer";
    if (isRenderer) {
      return electron.ipcRenderer.invoke(name, ...args);
    }
    return f(...args);
  }
  return newF as any as T;
}
