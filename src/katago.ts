import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";

export class KataGo {
  process: ChildProcessWithoutNullStreams;
  ready: Promise<null>;
  resolveReady: (value: PromiseLike<null>) => void;

  constructor() {
    const katago = "katago";
    const model = "/Users/peter/.katrain/kata1-b40c256-s11101799168-d2715431527.bin.gz";
    const config = "analysis_config.cfg";
    this.ready = new Promise(
      (resolve, reject) => this.resolveReady = resolve
    )
    this.process = spawn(
      katago, ["analysis", "-model", model, "-config", config]
    );
    this.process.stderr.on("data", data => this.onStdErr(data));
    this.process.stdout.on("data", data => this.onStdOut(data));
    this.awaitReady();
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

  onStdOut(data: Buffer) {
    const dataString = data.toString();
    console.log("KATAGO STDERR:", dataString);
  }
}
