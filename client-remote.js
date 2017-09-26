const net = require('net');
const port = 8124;
const string = 'REMOTE'; //QA
const good = 'ACK';
const bad = 'DEC';
const client = new net.Socket();
client.setEncoding('utf8');

client.connect({port: port, host: '127.0.0.1'}, () => {
    client.write(string);
});
client.on('data', (data, err) => {
    if (data === good)
        sendCopy();
    else if (data === bad)
        client.destroy();
});
client.on('close', () => {
    console.log('Client disconnected');
});
function sendCopy()
{
    client.write('COPY e:\\SpecForLabs\\1.txt e:\\SpecForLabs');
}