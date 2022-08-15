import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { JaCoord, KataGoMove, KataGoQuery } from "./types";
import { BaseSituation } from "./go";
import { jaCoordToGtpCoord } from "./conversion";
const StreamSplitter = require("stream-splitter");


export function query(situation: BaseSituation): KataGoQuery {
  const initialStones: Array<KataGoMove> = [];
  for (const jaCoord of situation.blackStones()) {
    initialStones.push(["B", jaCoordToGtpCoord(jaCoord)]);
  }
  for (const jaCoord of situation.whiteStones()) {
    initialStones.push(["W", jaCoordToGtpCoord(jaCoord)]);
  }
  const moves: Array<KataGoMove> = [];
  const rules = "tromp-taylor";
  const komi = 7;
  const boardXSize = situation.size.w;
  const boardYSize = situation.size.h;
  const includePolicy = true;
  const includeOwnership = true;
  return {
    id: "foo",
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


export class KataGo {
  process: ChildProcessWithoutNullStreams;
  ready: Promise<null>;
  resolveReady: (value: PromiseLike<null>) => void;
  queryResolvers: {[key: string]: (value: PromiseLike<any>) => void};

  constructor() {
    const katago = "katago";
    const model = "/Users/peter/.katrain/kata1-b40c256-s11101799168-d2715431527.bin.gz";
    const config = "analysis_config.cfg";
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
    splitter.on("token", (token: String) => this.onStdOut(token));
    this.awaitReady();
  }

  async processQuery(query: KataGoQuery) {
    await this.ready;
    const pending = new Promise(
      (resolve, reject) => this.queryResolvers[query.id] = resolve
    )
    console.log("WRITING QUERY", query);
    this.process.stdin.write(JSON.stringify(query) + "\n");
    console.log("AWAITING RESPONSE");
    const response = await pending;
    console.log("RESPONSE", response);
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

  onStdOut(line: String) {
    console.log("KATAGO STDOUT:", line);
  }
}
