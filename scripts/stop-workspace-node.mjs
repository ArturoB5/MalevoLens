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
  "$portOwners = @(netstat -ano | Select-String '127.0.0.1:3000' |",
  "ForEach-Object { ($_ -split '\\s+')[-1] } |",
  "Where-Object { $_ -match '^\\d+$' -and $_ -ne '0' } |",
  "Select-Object -Unique);",
  "Get-CimInstance Win32_Process |",
  "Where-Object {",
  "$_.Name -eq 'node.exe' -and (",
  "($_.ExecutablePath -like \"$workspace*\" -and $_.CommandLine -like '*next*') -or",
  "($portOwners -contains ([string]$_.ProcessId))",
  ")",
  "} |",
  "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
].join(" ");

await execFileAsync("powershell.exe", ["-NoProfile", "-Command", command]);
console.log("Stopped Next.js Node processes and any Node owner of 127.0.0.1:3000.");
