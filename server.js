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
            let strings = data.split(' ');
            if (strings[0] === copyString) {
                let file = fs.createReadStream(strings[1]);
                let copyFile = fs.createWriteStream(strings[2]);
                file.pipe(copyFile)
                //client.write(bad);
            }
            else if (strings[0] === encodeString) {
                let file = fs.createReadStream(strings[1]);
                let encryptFile = fs.createWriteStream(strings[2]);
                let cryptoStream = crypto.createCipher(cryptoString, strings[3]);
                file.pipe(cryptoStream).pipe(encryptFile);
            }
            else if (strings[0] === decodeString) {
                let file = fs.createReadStream(strings[1]);
                let decryptFile = fs.createWriteStream(strings[2]);
                let cryptoStream = crypto.createDecipher(cryptoString, strings[3]);
                file.pipe(cryptoStream).pipe(decryptFile);
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
