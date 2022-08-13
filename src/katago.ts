import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";

export class KataGo {
  process: ChildProcessWithoutNullStreams;

  constructor() {
    const katago = "katago";
    const model = "/Users/peter/.katrain/kata1-b40c256-s11101799168-d2715431527.bin.gz";
    const config = "analysis_config.cfg";
    this.process = spawn(
      katago, ["analysis", "-model", model, "-config", config]
    );
    this.process.stderr.on("data", data => console.log("KATAGO STDERR:", data.toString()));
    this.process.stdout.on("data", data => console.log("KATAGO STDOUT:", data.toString()));
  }
}
