var keymaster = require('./lib/keymaster.js')
var inherits = require('inherits')
var events = require('events')
var elementClass = require('element-class')

var keyTable = require('./lib/keytable.js')

module.exports = function(opts) {
  return new HUD(opts)
}

function HUD(opts) {
  if (!(this instanceof HUD)) return new HUD(opts)
  var self = this
  if (!opts) opts = {}
  if (opts instanceof HTMLElement) opts = {el: opts}
  this.opts = opts
  this.el = opts.el || 'nav'
  if (typeof this.el !== 'object') this.el = document.querySelector(this.el)
  this.toolbarKeys = opts.toolbarKeys || ['1','2','3','4','5','6','7','8','9','0']
  this.bindEvents()
}

inherits(HUD, events.EventEmitter)

HUD.prototype.onKeyDown = function() {
  var self = this
  keymaster.getPressedKeyCodes().map(function(keyCode) {
    var pressed = keyTable[keyCode]
    if (self.toolbarKeys.indexOf(pressed) > -1) return self.switchToolbar(pressed)
  })
}

HUD.prototype.bindEvents = function() {
  var self = this
  if (!this.opts.noKeydown) window.addEventListener('keydown', this.onKeyDown.bind(this))
  var list = this.el.querySelectorAll('li')
  list = Array.prototype.slice.call(list);
  list.map(function(li) { 
    li.addEventListener('click', self.onItemClick.bind(self))
  })
}

HUD.prototype.onItemClick = function(ev) {
  ev.preventDefault()
  var idx = this.toolbarIndexOf(ev.currentTarget)
  if (idx > -1) this.switchToolbar(idx)
}

HUD.prototype.addClass = function(el, className) {
  if (!el) return
  return elementClass(el).add(className)
}

HUD.prototype.removeClass = function(el, className) {
  if (!el) return
  return elementClass(el).remove(className)
}

HUD.prototype.toolbarIndexOf = function(li) {
  var list = this.el.querySelectorAll('.tab-item') 
  list = Array.prototype.slice.call(list)
  var idx = list.indexOf(li)
  if (idx > -1) ++idx
  return idx
}

HUD.prototype.switchToolbar = function(num) {
  this.removeClass(this.el.querySelector('.active'), 'active')
  var selected = this.el.querySelectorAll('.tab-item')[+num-1]
  this.addClass(selected, 'active')
  var active = this.el.querySelector('.active .tab-label')
  if (!active) return
  var dataID = active.getAttribute('data-id')
  this.emit('select', dataID ? dataID : active.innerText)
}