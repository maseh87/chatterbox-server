/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
// var qs = require('querystring');
var obj = {};
obj.results = [];

  module.exports = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url );//JSON.stringify(request));
  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  var msg = '';
  if(request.method === 'POST'){
    var newStatusCode = 201;
    response.writeHead(newStatusCode, headers);

    if (request.url.match(/^\/classes\//)){
      request.on('data', function(chunk) {
        msg += chunk;
        msg = JSON.parse(msg);
      });
      request.on('end', function() {
        msg.createdAt = new Date();
        obj.results.push(msg);
      });
    }
  }
  if (request.method === 'GET'){
    if (!request.url.match(/^\/classes\//)){
      var newStatusCode = 404;
      response.writeHead(newStatusCode, headers);
      response.end('');
    }
    else{
      console.log(statusCode)
      response.writeHead(statusCode, headers);
      // response.end(JSON.stringify(obj));
    }
  }
  response.end(JSON.stringify(obj));
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

