import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

if (process.platform !== "win32") {
  console.log("stop-workspace-node is only needed for this Windows local workflow.");
  process.exit(0);
}

const cwd = process.cwd().replace(/\\/g, "\\\\");
const command = [
  "$workspace = '" + cwd + "';",
  "Get-CimInstance Win32_Process |",
  "Where-Object {",
  "$_.Name -eq 'node.exe' -and",
  "$_.ExecutablePath -like \"$workspace*\" -and",
  "($_.CommandLine -like '*next*')",
  "} |",
  "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
].join(" ");

await execFileAsync("powershell.exe", ["-NoProfile", "-Command", command]);
console.log("Stopped Next.js Node processes running from this workspace.");
