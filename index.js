/* imports required modules
creates an HTTP server */
const http = require("http");
// parses the requested URL
const url = require("url");
// enables file system operations
const fs = require("fs");

// starts an HTTP server
http
  /* callback has: req, the request object containing the requested URL and
  res, the response object used to send back HTML content */
  .createServer(function (req, res) {
    // automatically parses the requested URL into a structured object
    let q = url.parse(req.url, true);
    // q.pathname contains the path requested
    /* removes the trailing slash / from the URL except for root 
    || "/" emsires that if the pathname is empty, it defaults to / */
    let pathname = q.pathname.replace(/\/$/, "") || "/";

    // prepends "." to make it a relative file path
    let filename = "." + pathname;

    /* defines list of valid URL that can be served 
    any other URL will return 404.html */
    const allowedPaths = ["/", "/about", "/contact-me"];

    if (allowedPaths.includes(pathname)) {
      /* if pathname is valid (/, /about, /contact-me), proceed to serve the 
      corresponding .html file */
      // handles rooth path - converts ./ to ./index.html
      if (pathname === "" || pathname === "/") {
        filename += "index.html";
        // handles other allowed paths - appends .html to non-root valid paths
      } else {
        filename += ".html";
      }
      // if requested URL is not allowed, serve 404.html
    } else {
      filename = "./404.html";
    }
    // attemps to read the filename, if filename is undefined fall back to ./404.html
    fs.readFile(filename || "/404.html", function (err, data) {
      if (err) {
        // if the file does not exist, attend to read ./404.html
        fs.readFile("./404.html", function (error, notFoundPage) {
          res.writeHead(404, { "Content-Type": "text/html" });
          // no fallback text response - simply display a default error page
          return res.end(notFoundPage);
        });
      } else {
        // if the file exists, send a 200 OK response
        res.writeHead(200, { "Content-Type": "text/html" });
        // serves the requested HTML content
        res.write(data);
      }
    });
  })
  // server listens on port 8080
  .listen(8080);
