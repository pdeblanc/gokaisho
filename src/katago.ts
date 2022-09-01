import { ipcRenderer } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { JaCoord, KataGoMove, KataGoQuery } from "./types";
import { BaseSituation } from "./go";
import { jaCoordToGtpCoord } from "./conversion";
import {v4 as uuidv4} from 'uuid';
const StreamSplitter = require("stream-splitter");


export function query(situation: BaseSituation): KataGoQuery {
  const initialStones: Array<KataGoMove> = [];
  for (const jaCoord of situation.blackStones()) {
    initialStones.push(["B", jaCoordToGtpCoord(situation.size, jaCoord)]);
  }
  for (const jaCoord of situation.whiteStones()) {
    initialStones.push(["W", jaCoordToGtpCoord(situation.size, jaCoord)]);
  }
  const moves: Array<KataGoMove> = [];
  const rules = "tromp-taylor";
  const komi = 7;
  const boardXSize = situation.size.w;
  const boardYSize = situation.size.h;
  const includePolicy = true;
  const includeOwnership = true;
  return {
    id: uuidv4(),
    initialPlayer: situation.turn === "black" ? "B" : "W",
    initialStones,
    moves,
    rules,
    komi,
    boardXSize,
    boardYSize,
    includeOwnership,
    includePolicy,
  };
}


export abstract class KataGo {
  abstract processQuery(query: KataGoQuery): Promise<any>;
}


export class KataGoIpcClient {
  async processQuery(query: KataGoQuery): Promise<any> {
    return ipcRenderer.invoke("process-katago-query", query);
  }
}


export class KataGoProcess extends KataGo {
  process: ChildProcessWithoutNullStreams;
  ready: Promise<null>;
  resolveReady: (value: PromiseLike<null>) => void;
  queryResolvers: {[key: string]: (value: PromiseLike<any>) => void};

  constructor() {
    super();
    const katago = "/opt/homebrew/bin/katago";
    const model = "/Users/peter/.katrain/kata1-b40c256-s11101799168-d2715431527.bin.gz";
    const config = "/Users/peter/repos/gokaisho/analysis_config.cfg";
    this.queryResolvers = {};
    this.ready = new Promise(
      (resolve, reject) => this.resolveReady = resolve
    )
    this.process = spawn(
      katago, ["analysis", "-model", model, "-config", config]
    );
    this.process.stderr.on("data", data => this.onStdErr(data));
    const splitter = this.process.stdout.pipe(StreamSplitter("\n"));
    splitter.encoding = "utf8";
    splitter.on("token", (token: string) => this.onStdOut(token));
    this.awaitReady();
  }

  async processQuery(query: KataGoQuery): Promise<any> {
    await this.ready;
    const pending = new Promise(
      (resolve, reject) => this.queryResolvers[query.id] = resolve
    )
    console.log("WRITING QUERY", query);
    this.process.stdin.write(JSON.stringify(query) + "\n");
    console.log("AWAITING RESPONSE");
    const response = await pending;
    console.log("RESPONSE", response);
    return response;
  }

  async awaitReady() {
    console.log("111111111111111111111111111111 waiting for KataGo");
    await this.ready;
    console.log("222222222222222222222222222222 KataGo is ready");
  }

  onStdErr(data: Buffer) {
    const dataString = data.toString();
    console.log("KATAGO STDERR:", dataString);
    if (dataString.indexOf("Started, ready to begin handling requests") > -1) {
      this.resolveReady(null);
    }
  }

  onStdOut(line: string) {
    const data = JSON.parse(line);
    this.queryResolvers[data.id](data);
  }
}
