const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = 8124;

const remoteString = 'REMOTE';
const copyString = 'COPY';
const encodeString = 'ENCODE';
const decodeString = 'DECODE';
const cryptoString = 'aes-128-cbc';
const good = 'ACK';
const bad = 'DEC';

const logger = fs.createWriteStream('client_id.log');

const server = net.createServer((client) => {
    console.log('Client connected');
    client.setEncoding('utf8');

    client.on('data', (data, err) => {
        if (err) console.error(err);
        else if (data === remoteString)
            client.write(good)
        else {
            const strings = data.split(' ');
            let file = fs.createReadStream(strings[1]);
            let secondFile = fs.createWriteStream(strings[2]);
            if (strings[0] === copyString) {
                file.pipe(secondFile);
            }
            else if (strings[0] === encodeString) {
                let cryptoStream = crypto.createCipher(cryptoString, strings[3]);
                file.pipe(cryptoStream).pipe(secondFile);
            }
            else if (strings[0] === decodeString) {
                let cryptoStream = crypto.createDecipher(cryptoString, strings[3]);
                file.pipe(cryptoStream).pipe(secondFile);
            }
        }
    });
    client.on('end', () => {
        logger.write('Client #' + client.id + ' disconnected');
        console.log('Client disconnected');
    });
});

/*function createNewDirectory(pathname) {
    if (!fs.existsSync(pathname))
        fs.mkdirSync(pathname);
}
*/
function writeLog(data) {
    logger.write(data);
}

server.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on localhost: ${port}`);
});
