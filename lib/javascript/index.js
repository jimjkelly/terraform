var path       = require("path")
var fs         = require("fs")
var helpers    = require('../helpers')
var minify  = require('harp-minify')
var browserify = require('browserify')
var through    = require('through')
var TerraformError = require("../error").TerraformError


var extensions = []
helpers.processors["js"].forEach(function(sourceType){
  extensions.push('.' + sourceType)
})

module.exports = function(root, filePath, callback){

  var srcPath = path.resolve(root, filePath)
  var ext     = path.extname(srcPath).replace(/^\./, '')
  var minifyOpts = {
    compress: false,
    mangle: false
  }

  fs.readFile(srcPath, function(err, data){

    /**
     * File not Found
     */

    if(err && err.code === 'ENOENT') return callback(null, null)

    /**
     * Read File Error
     */

    if(err) return callback(err)

    var post = '', success = true

    var exceptionHandler = function(err) {
      success = false
      console.log(err.message)
      const error = new TerraformError({
        source: ext,
        dest: "JavaScript",
        name: "Browserify Error",
        message: err.message,
        filename: err.filename,
        stack: err.annotated,
        lineno: err.line
      })
      callback(error)
    }

    process.once('uncaughtException', exceptionHandler)

    /**
     * Pass all JS through browserify -> coffeeify -> babelify
     */

    browserify(srcPath, {extensions: extensions})
    .transform('coffeeify', {bare: false, header: true})
    .on('error', exceptionHandler)
    .transform('babelify')
    .bundle()
    .on('data', function(buf) {
      if (success) {
        post += buf
      }
    }).on('end', function() {
      if (success) {
        process.removeListener('uncaughtException', exceptionHandler)

        /**
         * Consistently minify
         */
        callback(null, minify.js(post, minifyOpts))
      }
    })

  })

}
