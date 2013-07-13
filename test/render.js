var should    = require('should')
var polymer   = require('../')

describe("render()", function(){

  describe("underscore paths", function(){
    var root = __dirname + "/fixtures/render/underscores"

    it("should ignore file beginning with underscore", function(done){
      polymer.root(root).render("_beep.jade", function(error, body){
        should.not.exist(error)
        should.not.exist(body)
        done()
      })
    })


    it("should ignore file if in dir beginning with underscore", function(done){
      polymer.root(root).render("_foo/bar.jade", function(error, body){
        should.not.exist(error)
        should.not.exist(body)
        done()
      })
    })
  })

  describe('missing paths', function(){
    it("should return (null, null) if file not present.", function(done){
      polymer.root(__dirname + "/fixtures/data").render("missing.jade", function(error, body){
        should.not.exist(error)
        should.not.exist(body)
        done()
      })
    })

    it("should handle missing stylesheet file.", function(done){
      polymer.root(__dirname + "/fixtures/data").render("missing.less", function(error, body){
        should.not.exist(error)
        should.not.exist(body)
        done()
      })
    })
  })

  describe("layouts", function(){

    it("should use implicit layout if it exists", function(done){
      var root = __dirname + "/fixtures/render/layouts/implicit"
      polymer.root(root).render("index.jade", function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.include("<h1>Implicit Layout</h1>")
        body.should.include("<h2>Home</h2>")
        done()
      })
    })

    it("should not need to use any layout", function(done){
      var root = __dirname + "/fixtures/render/layouts/absent"
      polymer.root(root).render("index.jade", function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.not.include("Layout")
        body.should.include("<h2>Home</h2>")
        done()
      })
    })

    it("should use explicit layout if passed in", function(done){
      var root = __dirname + "/fixtures/render/layouts/explicit"
      var poly = polymer.root(root)
      poly.render("index.jade", { layout: "custom_layout.jade" }, function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.not.include('Default Layout')
        body.should.include("<h2>Home</h2>")
        body.should.include("<h1>Explicit Layout</h1>")
        done()
      })
    })

    it("should use explicit layout if present in data.json file", function(done){
      var root = __dirname + "/fixtures/render/layouts/explicit"
      var poly = polymer.root(root)
      poly.render("about.jade", function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.not.include('Default Layout')
        body.should.include("<h2>About</h2>")
        body.should.include("<h1>Explicit Layout</h1>")
        done()
      })
    })

  })

  describe("partials", function(){
    var root = __dirname + "/fixtures/render/partials"
    var poly = polymer.root(root)

    it("should have mixes partials with locals", function(done){
      poly.render("index.jade", function(error, body){
        should.not.exist(error)
        should.exist(body)
        body.should.include("<h1>Hello</h1>")
        body.should.include("<h2>Hello World</h2>")
        body.should.include("<h2>Hello Brazil</h2>")
        body.should.include("<h2>Hello Canada</h2>")
        body.should.include("<h2>Hello Gastown</h2>")
        done()
      })
    })

    it("should not render file with underscore", function(done){
      poly.render("_places/brazil.jade", function(error, body){
        should.not.exist(error)
        should.not.exist(body)
        done()
      })
    })
  })

})