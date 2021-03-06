var static = require('node-static');

var fileServer = new static.Server(__dirname);

function route(handle, pathname, response, request){
  if(typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    handle.loadStaticFile(response, request);
  }
}

exports.route = route
