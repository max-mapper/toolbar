var keymaster = require('./lib/keymaster.js')
var inherits = require('inherits')
var events = require('events')
var elementClass = require('element-class')

var keyTable =
  {   8 : 'backspace'
  ,   9 : 'tab'
  ,  13 : 'enter'
  ,  16 : 'shift'
  ,  17 : 'ctrl'
  ,  18 : 'alt'
  ,  19 : 'pausebreak'
  ,  20 : 'capslock'
  ,  27 : 'esc'
  ,  32 : 'spacebar'
  ,  33 : 'pageup'
  ,  34 : 'pagedown'
  ,  35 : 'end'
  ,  36 : 'home'
  ,  37 : 'left'
  ,  38 : 'up'
  ,  39 : 'right'
  ,  40 : 'down'
  ,  45 : 'ins'
  ,  46 : 'del'
  ,  48 : '0'
  ,  49 : '1'
  ,  50 : '2'
  ,  51 : '3'
  ,  52 : '4'
  ,  53 : '5'
  ,  54 : '6'
  ,  55 : '7'
  ,  56 : '8'
  ,  57 : '9'
  ,  65 : 'a'
  ,  66 : 'b'
  ,  67 : 'c'
  ,  68 : 'd'
  ,  69 : 'e'
  ,  70 : 'f'
  ,  71 : 'g'
  ,  72 : 'h'
  ,  73 : 'i'
  ,  74 : 'j'
  ,  75 : 'k'
  ,  76 : 'l'
  ,  77 : 'm'
  ,  78 : 'n'
  ,  79 : 'o'
  ,  80 : 'p'
  ,  81 : 'q'
  ,  82 : 'r'
  ,  83 : 's'
  ,  84 : 't'
  ,  85 : 'u'
  ,  86 : 'v'
  ,  87 : 'w'
  ,  88 : 'x'
  ,  89 : 'y'
  ,  90 : 'z'
  ,  93 : 'select'
  ,  96 : 'num_0'
  ,  97 : 'num_1'
  ,  98 : 'num_2'
  ,  99 : 'num_3'
  , 100 : 'num_4'
  , 101 : 'num_5'
  , 102 : 'num_6'
  , 103 : 'num_7'
  , 104 : 'num_8'
  , 105 : 'num_9'
  , 106 : 'multiply'
  , 107 : 'add'
  , 109 : 'subtract'
  , 110 : 'decimalpoint'
  , 111 : 'divide'
  , 112 : 'f1'
  , 113 : 'f2'
  , 114 : 'f3'
  , 115 : 'f4'
  , 116 : 'f5'
  , 117 : 'f6'
  , 118 : 'f7'
  , 119 : 'f8'
  , 120 : 'f9'
  , 121 : 'f10'
  , 122 : 'f11'
  , 123 : 'f12'
  , 144 : 'numlock'
  , 145 : 'scrolllock'
  , 186 : 'semicolon'
  , 187 : 'equalsign'
  , 188 : 'comma'
  , 189 : 'dash'
  , 190 : 'period'
  , 191 : 'forwardslash'
  , 192 : 'graveaccent'
  , 219 : 'openbracket'
  , 220 : 'backslash'
  , 221 : 'closebraket'
  , 222 : 'singlequote'
}

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
  // setup toolbar if provided only a container
  if (this.el.getElementsByClassName('tab-inner').length===0) this.createTabInner()
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

HUD.prototype.emptyContent = function() {
  this.el.removeChild(this.el.getElementsByClassName('tab-inner')[0])
  this.createTabInner()
}

HUD.prototype.createTabInner = function() {
  var tabInner = document.createElement('ul')
  tabInner.className = 'tab-inner'
  this.el.appendChild(tabInner)
}

HUD.prototype.setContent = function(content) {
  var self = this
  // remove any previous content
  this.emptyContent()
  // add new content
  return content.map(function(item){
    return self.addContent(item)
  }) 
}

HUD.prototype.addContent = function(item) {
  var self = this
  // create new tab
  var tabItem = document.createElement('li')
  tabItem.className = 'tab-item'
  // create the icon, if provided
  if (item.icon) {
    var tabIcon = document.createElement('img')
    tabIcon.className = 'tab-icon'
    tabIcon.src = item.icon
    tabItem.appendChild(tabIcon)
  }
  // create the label
  var tabLabel = document.createElement('div')
  tabLabel.className = 'tab-label'
  if (item.label) tabLabel.innerText = item.label
  if (item.id !== undefined) tabLabel.setAttribute('data-id',item.id)
  tabItem.appendChild(tabLabel)
  // add item to toolbar
  this.el.getElementsByClassName('tab-inner')[0].appendChild(tabItem)
  // bind click event for new item
  tabItem.addEventListener('click', self.onItemClick.bind(self))
  return tabItem
}