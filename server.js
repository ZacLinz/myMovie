let http = require('http'),
  fs = require('fs'),
  url = require('url');

http.createServer((request, response)=>{
  var addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

  if (q.pathname.include('documentation')){
    filePath = (__dirname + '/documentation.html');
  } else {
      filePath = 'index.html';
  }

  fs.appendFile('log.txt', 'URL: ' + address + '\nTimestamp: ' + timeStamp + '\n\n', function(err){
    if (err) {
      console.log(err);
    }
    else {
      console.log('Added to log.');
    }
  });


  response.writeHead(200, {'content-type': 'text/plaing'});
  response.end('Hello Node!\n');
}).listen(8080);
