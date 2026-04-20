// Get the URL to scan
const args = Shell.GetArgs();
const url = args[0];
println(`Performing scan of ${url}`);

// Perform NSLOOKUP on URL
await Shell.Process.exec(`nslookup ${url} > data.txt`);
const output = await FileSystem.ReadFile("data.txt");
if(!output) throw "Unknown Error";

// Get the URL IP
const ip = output.match(/Address:\s+(\d+\.\d+\.\d+\.\d+)/);
if(!ip) throw "No IP found.";
println(`IP Found: ${ip[1]}`);

// Ping IP
await Shell.Process.exec(`ping ${ip[1]}`);
