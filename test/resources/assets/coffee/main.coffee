Foo  = require './foo'
Bar  = require './bar'
Tpl  = require './view.tpl'

foo = new Foo el: '#foo'
bar = new Bar tpl: Tpl
