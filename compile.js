const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// module.exports = solc.compile(source, 1); //1 is number of different contracts we are attempting to compile
module.exports = solc.compile(source, 1).contracts[':Inbox']; //changed the course to only use required data
//The colon before Inbox is for specifying filename if there were multiple contracts. At the moment we used source directly because there is only one file.