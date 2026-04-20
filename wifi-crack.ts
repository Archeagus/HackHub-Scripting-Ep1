async function Main() {
    println("Getting list of adapters ...");
    const interfaces = await Networking.Wifi.GetInterfaces();

    println("Finding active adapter ...");
    const actAdapter = interfaces.find(i => i.monitor);
    if(!actAdapter) throw "No active adapter found.";

    println(`Getting list of networks on ${actAdapter.name}`);
    const networks = await Networking.Wifi.Scan(actAdapter.name);
    const curNetwork = await FileSystem.ReadFile("selectedNetwork.txt");

    const target = networks.find(n => (n.signal > 1 && n.ssid != curNetwork));
    if(!target) throw "No qualified network found.";
    println(`Found network: ${target.ssid}`);
    await FileSystem.WriteFile("selectedNetwork.txt", target.ssid);

    println("Perform deauthentication attack on network ...");
    await Networking.Wifi.Deauth(actAdapter.name, target.bssid);
    println("Collecting handshake information ...");
    const pcap = await Networking.Wifi.CaptureHandshake(actAdapter.name, target.bssid);
    if(!pcap) throw "No password intercepted.";

    const password = await Crypto.Hashcat.Decrypt(pcap);
    println(`Network:  ${target.ssid}`);
    println(`Password: ${password}`);
}

Main()
