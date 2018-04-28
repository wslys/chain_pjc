var web3 = require('web3');
var net  = require('net');

var config = function () {

    this.logFormat = "combined";
    this.ipcPath   = process.env["HOME"] + "/.local/share/io.parity.ethereum/jsonrpc.ipc";
    this.provider  = new web3.providers.IpcProvider(this.ipcPath, net);

    this.bootstrapUrl = "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css";

    this.names = {
        "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0": "EOS"
    }

};

module.exports = config;
