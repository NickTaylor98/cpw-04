const net = require('net');
const fs = require('fs');
const port = 8124;
const string = 'FILES'; //QA
const bad = 'DEC';
const good = 'ACK';

const client = new net.Socket();
client.setEncoding('utf8');

let dirs = [];
client.connect({port: port, host: '127.0.0.1'}, () => {
    let paths = process.argv;
    for (let i = 2; i < paths.length; ++i)
        dirs.push(__dirname + paths[i]);
    client.write(string);
});

client.on('data', (data, err) => {
    if (err)
        console.error(err);
    else if (data === bad)
        client.destroy();
    else if (data === good) {
        sendFilesToServer();
    }
});

client.on('close', function () {
    console.log('Connection closed');
});

function sendFilesToServer() {
    let arrayOfFiles = [];
    for (let i = 0; i < dirs.length; ++i)
    {
        arrayOfFiles = fs.readdirSync(dirs[i]);
        for (let j = 0; j < arrayOfFiles.length; ++j) {
            console.log(dirs[i]+ '\\' + arrayOfFiles[j]);
            let buffer = fs.readFileSync(dirs[i]+ '\\' + arrayOfFiles[j]);
            client.write(buffer);
        }
    }
    client.destroy();
}

/*function sendQuestion() {
    if (currentIndex < questions.length - 1) {
        let qst = questions[++currentIndex].quest;
        client.write(qst);
    }
    else
        client.destroy();
}
*/
/*function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}*/