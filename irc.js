/*
 * /=======================================================\
 * | IRC Server                                            |
 * | Copyright (c) P7COMunications LLC                     |
 * | Author(s): Francisco Medina [pancho7532@p7com.net]    |
 * | Date: 06/Feb/2023                                     |
 * \=======================================================/
 */
const dns = require("dns");
const fs = require("fs");
const net = require("net");
const configurationFile = require("./config.irc.json");
const server = net.createServer();
const motdContent = fs.existsSync("./motd.txt") ? fs.readFileSync("./motd.txt").toString().replace(/\r\n/g, "\n").split("\n") : false;
const clientPool = [];
const channelPool = [];
const nicknamePool = [];
server.listen(configurationFile.listenPort, configurationFile.listenHost, () => {
    console.log(`[INFO] Listening at ${configurationFile.listenHost} in port ${configurationFile.listenPort}`);
});
setInterval(() => {
    //console.log(JSON.stringify(nicknamePool, null, "    "));
    //console.log(clientPool);
}, 1000);
function connectionCleanup(socket = new net.Socket) {
    // This function runs when a socket closes/ends.
    // I've done it this way so I don't copy and paste the exact same code snippet in both events
    // Might leave this function permanent, idk
    const currentNickname = nicknamePool.filter((obj) => obj.nickName == socket.ircData.nickName)[0];
    currentNickname.isBeingUsed = false;
    clientPool.splice(clientPool.indexOf(socket), 1);
    return;
}
server.on("connection", async(socket) => {
    console.log(`[INFO] Connection from ${socket.remoteAddress} at port ${socket.remotePort}`);
    const ircDataTemplate = {
        realName: null,
        nickName: null,
        userName: null,
        password: null,
        remoteAddress: socket.remoteAddress, // this should be ok... probably, who knows.
        reverseAddress: null,
        isIRCOp: false,
        registered: false, // it is necessary? check later.
        subscribedChannels: []
    };
    dns.reverse(socket.remoteAddress, (err, res) => { res.length != 0 ? socket.ircData.reverseAddress = res[0] : null });
    socket.ircData = ircDataTemplate;
    clientPool.push(socket);
    socket.on("data", (data) => {
        console.log(data.toString());
        const clientCommands = data.toString().split("\r\n");
        for(let c = 0; c < clientCommands.length - 1; c++) {
            // for some reason there are some clients that send huge packets with chunks of commands separated by \r\n instead of sending them chunked.
            // so we attempt to read them anyways, clientCommands length is -1 because split() adds an additional empty that we don't want to parse as command.
            const command = clientCommands[c].split(" ");
            switch(command[0].toUpperCase()) { // this is usually the command
                case "NICK":
                    if(!command[1]) {
                        socket.write(`:${configurationFile.serverHostname} 461 guest NICK :Not enough parameters.\r\n`);
                        break;
                    }
                    const nicknameQuery = nicknamePool.filter((obj) => obj.nickName == command[1])[0];
                    if(socket.ircData.registered) {
                        // we completed the registration process with NICK and USER combinations before
                        // and we want to change our current nickname
                        
                    }
                    if(nicknameQuery && nicknameQuery.isBeingUsed) {
                        // if exists on our nickname list and it's being used by someone
                        socket.write(`:${configurationFile.serverHostname} 433 guest NICK :Nickname already in use.\r\n`);
                        break;
                    }
                    if(nicknameQuery && !nicknameQuery.isBeingUsed) {
                        // if exists on our nickname list and it's not being used by someone
                        nicknameQuery.isBeingUsed = true;
                        nicknameQuery.lastUsedBy.push(socket.ircData);

                    }
                    if(!nicknameQuery) {
                        // if doesn't exists on our nickname list
                        nicknamePool.push({
                            nickName: command[1],
                            isBeingUsed: true,
                            lastUsedBy: [ socket.ircData ]
                        });
                    }
                    socket.ircData.nickName = command[1];
                    break;
                case "USER":
                    if(!command[1] || !command[2] || !command[3] || !command[4]) {
                        socket.write(`:${configurationFile.serverHostname} 461 ${socket.ircData.nickName ? socket.ircData.nickName : "unknown"} USER :Not enough parameters.\r\n`);
                        break;
                    }
                    const usernameQuery = clientPool.filter((obj) => obj.ircData.userName == command[1])[0];
                    if(!!usernameQuery) {
                        socket.write(`:${configurationFile.serverHostname} 462 ${socket.ircData.nickName ? socket.ircData.nickName : "unknown"} USER :You may not reregister\r\n`);
                        break;
                    }
                    socket.ircData.userName = command[1];
                    socket.ircData.realName = command[4].substring(1);
                    socket.ircData.registered = true; // it's necessary? check later.
                    socket.write(`:${configurationFile.serverHostname} 001 ${socket.ircData.nickName} :Welcome to the P7COMunications IRC Network ${socket.ircData.nickName}!${socket.ircData.userName}@${!!socket.ircData.reverseAddress ? socket.ircData.reverseAddress : socket.remoteAddress}\r\n`);
                    socket.write(`:${configurationFile.serverHostname} 002 ${socket.ircData.nickName} :Your host is ${configurationFile.serverHostname}, running version 0.0.1\r\n`);
                    socket.write(`:${configurationFile.serverHostname} 003 ${socket.ircData.nickName} :This server was created ${new Date().toUTCString()}\r\n`);
                    socket.write(`:${configurationFile.serverHostname} 004 ${socket.ircData.nickName} :${configurationFile.serverHostname} 0.0.1 w w\r\n`);
                    //should i? socket.write(`:${configurationFile.serverHostname} MODE ${socket.ircData.nickname} +swo\r\n`);
                    if(motdContent) {
                        socket.write(`:${configurationFile.serverHostname} 375 ${socket.ircData.nickName} :- ${configurationFile.serverHostname} Message of the day - \r\n`);
                        for(let c = 0; c < motdContent.length; c++) {
                            socket.write(`:${configurationFile.serverHostname} 372 ${socket.ircData.nickName} :- ${motdContent[c]}\r\n`);
                        }
                        socket.write(`:${configurationFile.serverHostname} 376 ${socket.ircData.nickName} :End of /MOTD command\r\n`);
                    }
                    break;
                case "MOTD":
                    if(motdContent) {
                        socket.write(`:${configurationFile.serverHostname} 375 ${socket.ircData.nickName} :- ${configurationFile.serverHostname} Message of the day - \r\n`);
                        for(let c = 0; c < motdContent.length; c++) {
                            socket.write(`:${configurationFile.serverHostname} 372 ${socket.ircData.nickName} :- ${motdContent[c]}\r\n`);
                        }
                        socket.write(`:${configurationFile.serverHostname} 376 ${socket.ircData.nickName} :End of /MOTD command\r\n`);
                        break;
                    } else {
                        socket.write(`:${configurationFile.serverHostname} 375 ${socket.ircData.nickName} :- ${configurationFile.serverHostname} Message of the day - \r\n`);
                        socket.write(`:${configurationFile.serverHostname} 376 ${socket.ircData.nickName} :End of /MOTD command\r\n`);
                        break;
                    }
                case "PING":
                    socket.write(`:${configurationFile.serverHostname} PONG ${configurationFile.serverHostname} :${command[1]}\r\n`);
                    break;
                default:
                    // whatever command that we haven't implement here... yet.
                    socket.write(`:${configurationFile.serverHostname} 421 ${!!socket.ircData && !!socket.ircData.nickName ? socket.ircData.nickName : "guest"} ${command[0].toUpperCase()} :Unknown command.\r\n`);
                    break;
            }
        }
    });
    socket.on("error", (err) => {
        console.log(`[INFO] Error with socket ${socket.remoteAddress}! ${err}`);
    });
    socket.on("end", () => {
        console.log(`[INFO] Connection with ${socket.remoteAddress} was terminated.`);
        connectionCleanup(socket);
    });
    socket.on("close", (hadError) => {
        console.log(`[INFO] Connection with ${socket.remoteAddress} was closed ${hadError ? "with error." : "without error."}`);
        connectionCleanup(socket);
    });
});
server.on("error", (err) => { console.log(`[SERVER-ERR] ${err}`); });