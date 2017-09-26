const net = require('net');
const fs = require('fs');
const path = require ('path');
const port = 8124;
const remoteString = 'REMOTE';
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
        else
        {
            let strings = data.split(' ');
            let file = fs.createReadStream(strings[1]);
            const fileName = strings[2]+'\\copy' + path.basename(strings[1]);
            console.log(fileName);
            let copyFile = fs.createWriteStream(fileName);
            file.pipe(copyFile)
            client.write(bad);
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
