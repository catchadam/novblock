// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.events.KeyEventTest');
goog.setTestOnly('goog.events.KeyEventTest');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.testing.events');
goog.require('goog.testing.jsunit');
goog.require('goog.userAgent');

function setUp() {
  // Have this based on a fictitious DOCUMENT_MODE constant.
  goog.userAgent.isDocumentMode = function(mode) {
    return mode <= goog.userAgent.DOCUMENT_MODE;
  };
}


/**
 * Tests the key handler for the IE 8 and lower behavior.
 */
function testIe8StyleKeyHandling() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = true;
  goog.userAgent.GECKO = false;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = false;
  goog.userAgent.WINDOWS = true;
  goog.userAgent.LINUX = false;
  goog.userAgent.VERSION = 8;
  goog.userAgent.DOCUMENT_MODE = 8;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;

  assertIe8StyleKeyHandling();
}


/**
 * Tests the key handler for the IE 8 and lower behavior.
 */
function testIe8StyleKeyHandlingInIe9DocumentMode() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = true;
  goog.userAgent.GECKO = false;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = false;
  goog.userAgent.WINDOWS = true;
  goog.userAgent.LINUX = false;
  goog.userAgent.VERSION = 9;  // Try IE9 in IE8 document mode.
  goog.userAgent.DOCUMENT_MODE = 8;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;

  assertIe8StyleKeyHandling();
}

function assertIe8StyleKeyHandling() {
  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(keyHandler, goog.events.KeyCodes.ENTER);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ENTER);
  assertEquals(
      'Enter should fire a key event with the keycode 13',
      goog.events.KeyCodes.ENTER, keyEvent.keyCode);
  assertEquals(
      'Enter should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.ESC);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ESC);
  assertEquals(
      'Esc should fire a key event with the keycode 27',
      goog.events.KeyCodes.ESC, keyEvent.keyCode);
  assertEquals(
      'Esc should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.UP);
  assertEquals(
      'Up should fire a key event with the keycode 38', goog.events.KeyCodes.UP,
      keyEvent.keyCode);
  assertEquals(
      'Up should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(
      keyHandler, goog.events.KeyCodes.SEVEN, undefined, undefined, undefined,
      undefined, true);
  fireKeyPress(
      keyHandler, 38, undefined, undefined, undefined, undefined, true);
  assertEquals(
      'Shift+7 should fire a key event with the keycode 55',
      goog.events.KeyCodes.SEVEN, keyEvent.keyCode);
  assertEquals(
      'Shift+7 should fire a key event with the charcode 38', 38,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, 97);
  assertEquals(
      'Lower case a should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Lower case a should fire a key event with the charcode 97', 97,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, 65);
  assertEquals(
      'Upper case A should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Upper case A should fire a key event with the charcode 65', 65,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.DELETE);
  assertEquals(
      'Delete should fire a key event with the keycode 46',
      goog.events.KeyCodes.DELETE, keyEvent.keyCode);
  assertEquals(
      'Delete should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.PERIOD);
  fireKeyPress(keyHandler, 46);
  assertEquals(
      'Period should fire a key event with the keycode 190',
      goog.events.KeyCodes.PERIOD, keyEvent.keyCode);
  assertEquals(
      'Period should fire a key event with the charcode 46', 46,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.CTRL);
  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  assertEquals(
      'A with control down should fire a key event', goog.events.KeyCodes.A,
      keyEvent.keyCode);

  // On IE, when Ctrl+<key> is held down, there is a KEYDOWN, a KEYPRESS, and
  // then a series of KEYDOWN events for each repeat.
  fireKeyDown(keyHandler, goog.events.KeyCodes.B, undefined, undefined, true);
  fireKeyPress(keyHandler, goog.events.KeyCodes.B, undefined, undefined, true);
  assertEquals(
      'B with control down should fire a key event', goog.events.KeyCodes.B,
      keyEvent.keyCode);
  assertTrue('Ctrl should be down.', keyEvent.ctrlKey);
  assertFalse(
      'Should not have repeat=true on the first key press.', keyEvent.repeat);
  // Fire one repeated keydown event.
  fireKeyDown(keyHandler, goog.events.KeyCodes.B, undefined, undefined, true);
  assertEquals(
      'A with control down should fire a key event', goog.events.KeyCodes.B,
      keyEvent.keyCode);
  assertTrue('Should have repeat=true on key repeat.', keyEvent.repeat);
  assertTrue('Ctrl should be down.', keyEvent.ctrlKey);
}


/**
 * Tests special cases for IE9.
 */
function testIe9StyleKeyHandling() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = true;
  goog.userAgent.GECKO = false;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = false;
  goog.userAgent.WINDOWS = true;
  goog.userAgent.LINUX = false;
  goog.userAgent.VERSION = 9;
  goog.userAgent.DOCUMENT_MODE = 9;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(keyHandler, goog.events.KeyCodes.ENTER);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ENTER);
  assertEquals(
      'Enter should fire a key event with the keycode 13',
      goog.events.KeyCodes.ENTER, keyEvent.keyCode);
  assertEquals(
      'Enter should fire a key event with the charcode 0', 0,
      keyEvent.charCode);
}


/**
 * Tests the key handler for the Gecko behavior.
 */
function testGeckoStyleKeyHandling() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = false;
  goog.userAgent.GECKO = true;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = false;
  goog.userAgent.WINDOWS = true;
  goog.userAgent.LINUX = false;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(keyHandler, goog.events.KeyCodes.ENTER);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ENTER);
  assertEquals(
      'Enter should fire a key event with the keycode 13',
      goog.events.KeyCodes.ENTER, keyEvent.keyCode);
  assertEquals(
      'Enter should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.ESC);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ESC);
  assertEquals(
      'Esc should fire a key event with the keycode 27',
      goog.events.KeyCodes.ESC, keyEvent.keyCode);
  assertEquals(
      'Esc should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.UP);
  fireKeyPress(keyHandler, goog.events.KeyCodes.UP);
  assertEquals(
      'Up should fire a key event with the keycode 38', goog.events.KeyCodes.UP,
      keyEvent.keyCode);
  assertEquals(
      'Up should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(
      keyHandler, goog.events.KeyCodes.SEVEN, undefined, undefined, undefined,
      undefined, true);
  fireKeyPress(
      keyHandler, undefined, 38, undefined, undefined, undefined, true);
  assertEquals(
      'Shift+7 should fire a key event with the keycode 55',
      goog.events.KeyCodes.SEVEN, keyEvent.keyCode);
  assertEquals(
      'Shift+7 should fire a key event with the charcode 38', 38,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, undefined, 97);
  assertEquals(
      'Lower case a should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Lower case a should fire a key event with the charcode 97', 97,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, undefined, 65);
  assertEquals(
      'Upper case A should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Upper case A should fire a key event with the charcode 65', 65,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.DELETE);
  fireKeyPress(keyHandler, goog.events.KeyCodes.DELETE);
  assertEquals(
      'Delete should fire a key event with the keycode 46',
      goog.events.KeyCodes.DELETE, keyEvent.keyCode);
  assertEquals(
      'Delete should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.PERIOD);
  fireKeyPress(keyHandler, undefined, 46);
  assertEquals(
      'Period should fire a key event with the keycode 190',
      goog.events.KeyCodes.PERIOD, keyEvent.keyCode);
  assertEquals(
      'Period should fire a key event with the charcode 46', 46,
      keyEvent.charCode);
}


/**
 * Tests the key handler for the Safari 3 behavior.
 */
function testSafari3StyleKeyHandling() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = false;
  goog.userAgent.GECKO = false;
  goog.userAgent.WEBKIT = true;
  goog.userAgent.MAC = true;
  goog.userAgent.WINDOWS = false;
  goog.userAgent.LINUX = false;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;
  goog.userAgent.VERSION = 525.3;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  // Make sure all events are caught while testing
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(keyHandler, goog.events.KeyCodes.ENTER);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ENTER);
  assertEquals(
      'Enter should fire a key event with the keycode 13',
      goog.events.KeyCodes.ENTER, keyEvent.keyCode);
  assertEquals(
      'Enter should fire a key event with the charcode 0', 0,
      keyEvent.charCode);
  fireKeyUp(keyHandler, goog.events.KeyCodes.ENTER);

  // Add a listener to ensure that an extra ENTER event is not dispatched
  // by a subsequent keypress.
  var enterCheck = goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY, function(e) {
        assertNotEquals(
            'Unexpected ENTER keypress dispatched', e.keyCode,
            goog.events.KeyCodes.ENTER);
      });

  fireKeyDown(keyHandler, goog.events.KeyCodes.ESC);
  assertEquals(
      'Esc should fire a key event with the keycode 27',
      goog.events.KeyCodes.ESC, keyEvent.keyCode);
  assertEquals(
      'Esc should fire a key event with the charcode 0', 0, keyEvent.charCode);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ESC);
  goog.events.unlistenByKey(enterCheck);

  fireKeyDown(keyHandler, goog.events.KeyCodes.UP);
  assertEquals(
      'Up should fire a key event with the keycode 38', goog.events.KeyCodes.UP,
      keyEvent.keyCode);
  assertEquals(
      'Up should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(
      keyHandler, goog.events.KeyCodes.SEVEN, undefined, undefined, undefined,
      undefined, true);
  fireKeyPress(keyHandler, 38, 38, undefined, undefined, undefined, true);
  assertEquals(
      'Shift+7 should fire a key event with the keycode 55',
      goog.events.KeyCodes.SEVEN, keyEvent.keyCode);
  assertEquals(
      'Shift+7 should fire a key event with the charcode 38', 38,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, 97, 97);
  assertEquals(
      'Lower case a should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Lower case a should fire a key event with the charcode 97', 97,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, 65, 65);
  assertEquals(
      'Upper case A should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Upper case A should fire a key event with the charcode 65', 65,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.CTRL);
  fireKeyDown(keyHandler, goog.events.KeyCodes.A, null, null, true /*ctrl*/);
  assertEquals(
      'A with control down should fire a key event', goog.events.KeyCodes.A,
      keyEvent.keyCode);

  // Test that Alt-Tab outside the window doesn't break things.
  fireKeyDown(keyHandler, goog.events.KeyCodes.ALT);
  keyEvent.keyCode = -1;  // Reset the event.
  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  assertEquals('Should not have dispatched an Alt-A', -1, keyEvent.keyCode);
  fireKeyPress(keyHandler, 65, 65);
  assertEquals(
      'Alt should be ignored since it isn\'t currently depressed',
      goog.events.KeyCodes.A, keyEvent.keyCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.DELETE);
  assertEquals(
      'Delete should fire a key event with the keycode 46',
      goog.events.KeyCodes.DELETE, keyEvent.keyCode);
  assertEquals(
      'Delete should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.PERIOD);
  fireKeyPress(keyHandler, 46, 46);
  assertEquals(
      'Period should fire a key event with the keycode 190',
      goog.events.KeyCodes.PERIOD, keyEvent.keyCode);
  assertEquals(
      'Period should fire a key event with the charcode 46', 46,
      keyEvent.charCode);

  // Safari sends zero key code for non-latin characters.
  fireKeyDown(keyHandler, 0, 0);
  fireKeyPress(keyHandler, 1092, 1092);
  assertEquals(
      'Cyrillic small letter "Ef" should fire a key event with ' +
          'the keycode 0',
      0, keyEvent.keyCode);
  assertEquals(
      'Cyrillic small letter "Ef" should fire a key event with ' +
          'the charcode 1092',
      1092, keyEvent.charCode);
}


/**
 * Tests the key handler for the Opera behavior.
 */
function testOperaStyleKeyHandling() {
  goog.userAgent.OPERA = true;
  goog.userAgent.IE = false;
  goog.userAgent.GECKO = false;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = false;
  goog.userAgent.WINDOWS = true;
  goog.userAgent.LINUX = false;
  goog.events.KeyHandler.USES_KEYDOWN_ = false;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(keyHandler, goog.events.KeyCodes.ENTER);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ENTER);
  assertEquals(
      'Enter should fire a key event with the keycode 13',
      goog.events.KeyCodes.ENTER, keyEvent.keyCode);
  assertEquals(
      'Enter should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.ESC);
  fireKeyPress(keyHandler, goog.events.KeyCodes.ESC);
  assertEquals(
      'Esc should fire a key event with the keycode 27',
      goog.events.KeyCodes.ESC, keyEvent.keyCode);
  assertEquals(
      'Esc should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.UP);
  fireKeyPress(keyHandler, goog.events.KeyCodes.UP);
  assertEquals(
      'Up should fire a key event with the keycode 38', goog.events.KeyCodes.UP,
      keyEvent.keyCode);
  assertEquals(
      'Up should fire a key event with the charcode 0', 0, keyEvent.charCode);

  fireKeyDown(
      keyHandler, goog.events.KeyCodes.SEVEN, undefined, undefined, undefined,
      undefined, true);
  fireKeyPress(
      keyHandler, 38, undefined, undefined, undefined, undefined, true);
  assertEquals(
      'Shift+7 should fire a key event with the keycode 55',
      goog.events.KeyCodes.SEVEN, keyEvent.keyCode);
  assertEquals(
      'Shift+7 should fire a key event with the charcode 38', 38,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, 97);
  assertEquals(
      'Lower case a should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Lower case a should fire a key event with the charcode 97', 97,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.A);
  fireKeyPress(keyHandler, 65);
  assertEquals(
      'Upper case A should fire a key event with the keycode 65',
      goog.events.KeyCodes.A, keyEvent.keyCode);
  assertEquals(
      'Upper case A should fire a key event with the charcode 65', 65,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.DELETE);
  fireKeyPress(keyHandler, goog.events.KeyCodes.DELETE);
  assertEquals(
      'Delete should fire a key event with the keycode 46',
      goog.events.KeyCodes.DELETE, keyEvent.keyCode);
  assertEquals(
      'Delete should fire a key event with the charcode 0', 0,
      keyEvent.charCode);

  fireKeyDown(keyHandler, goog.events.KeyCodes.PERIOD);
  fireKeyPress(keyHandler, 46);
  assertEquals(
      'Period should fire a key event with the keycode 190',
      goog.events.KeyCodes.PERIOD, keyEvent.keyCode);
  assertEquals(
      'Period should fire a key event with the charcode 46', 46,
      keyEvent.charCode);
}

function testGeckoOnMacAltHandling() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = false;
  goog.userAgent.GECKO = true;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = true;
  goog.userAgent.WINDOWS = false;
  goog.userAgent.LINUX = false;
  goog.userAgent.EDGE = false;
  goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = true;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(
      keyHandler, goog.events.KeyCodes.COMMA, 0, null, false, true, false);
  fireKeyPress(keyHandler, 0, 8804, null, false, false, false);
  assertEquals(
      'should fire a key event with COMMA', goog.events.KeyCodes.COMMA,
      keyEvent.keyCode);
  assertEquals(
      'should fire a key event with alt key set', true, keyEvent.altKey);

  // Scenario: alt down, a down, a press, a up (should say alt is true),
  // alt up.
  keyEvent = undefined;
  fireKeyDown(keyHandler, 18, 0, null, false, true, false);
  fireKeyDown(keyHandler, goog.events.KeyCodes.A, 0, null, false, true, false);
  fireKeyPress(keyHandler, 0, 229, null, false, false, false);
  assertEquals(
      'should fire a key event with alt key set', true, keyEvent.altKey);
  fireKeyUp(keyHandler, 0, 229, null, false, true, false);
  assertEquals('alt key should still be set', true, keyEvent.altKey);
  fireKeyUp(keyHandler, 18, 0, null, false, false, false);
}

function testGeckoEqualSign() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = false;
  goog.userAgent.GECKO = true;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = false;
  goog.userAgent.WINDOWS = true;
  goog.userAgent.LINUX = false;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  fireKeyDown(keyHandler, 61, 0);
  fireKeyPress(keyHandler, 0, 61);
  assertEquals(
      '= should fire should fire a key event with the keyCode 187',
      goog.events.KeyCodes.EQUALS, keyEvent.keyCode);
  assertEquals(
      '= should fire a key event with the charCode 61',
      goog.events.KeyCodes.FF_EQUALS, keyEvent.charCode);
}

function testMacGeckoSlash() {
  goog.userAgent.OPERA = false;
  goog.userAgent.IE = false;
  goog.userAgent.GECKO = true;
  goog.userAgent.WEBKIT = false;
  goog.userAgent.MAC = true;
  goog.userAgent.WINDOWS = false;
  goog.userAgent.LINUX = false;
  goog.events.KeyHandler.USES_KEYDOWN_ = true;

  var keyEvent, keyHandler = new goog.events.KeyHandler();
  goog.events.listen(
      keyHandler, goog.events.KeyHandler.EventType.KEY,
      function(e) { keyEvent = e; });

  // On OS X Gecko, the following events are fired when pressing Shift+/
  // 1. keydown with keyCode=191 (/), charCode=0, shiftKey
  // 2. keypress with keyCode=0, charCode=63 (?), shiftKey
  fireKeyDown(keyHandler, 191, 0, null, false, false, true);
  fireKeyPress(keyHandler, 0, 63, null, false, false, true);
  assertEquals(
      '/ should fire a key event with the keyCode 191',
      goog.events.KeyCodes.SLASH, keyEvent.keyCode);
  assertEquals(
      '? should fire a key event with the charCode 63',
      goog.events.KeyCodes.QUESTION_MARK, keyEvent.charCode);
}

function testGetElement() {
  var target = goog.dom.createDom(goog.dom.TagName.DIV);
  var target2 = goog.dom.createDom(goog.dom.TagName.DIV);
  var keyHandler = new goog.events.KeyHandler();
  assertNull(keyHandler.getElement());

  keyHandler.attach(target);
  assertEquals(target, keyHandler.getElement());

  keyHandler.attach(target2);
  assertNotEquals(target, keyHandler.getElement());
  assertEquals(target2, keyHandler.getElement());

  var doc = goog.dom.getDocument();
  keyHandler.attach(doc);
  assertEquals(doc, keyHandler.getElement());

  keyHandler = new goog.events.KeyHandler(doc);
  assertEquals(doc, keyHandler.getElement());

  keyHandler = new goog.events.KeyHandler(target);
  assertEquals(target, keyHandler.getElement());
}

function testDetach() {
  var target = goog.dom.createDom(goog.dom.TagName.DIV);
  var keyHandler = new goog.events.KeyHandler(target);
  assertEquals(target, keyHandler.getElement());

  fireKeyDown(keyHandler, 0, 63, null, false, false, true);
  fireKeyPress(keyHandler, 0, 63, null, false, false, true);
  keyHandler.detach();

  assertNull(keyHandler.getElement());
  // All listeners should be cleared.
  assertNull(keyHandler.keyDownKey_);
  assertNull(keyHandler.keyPressKey_);
  assertNull(keyHandler.keyUpKey_);
  // All key related state should be cleared.
  assertEquals('Last key should be -1', -1, keyHandler.lastKey_);
  assertEquals('keycode should be -1', -1, keyHandler.keyCode_);
}

function testCapturePhase() {
  var gotInCapturePhase;
  var gotInBubblePhase;

  var target = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.events.listen(
      new goog.events.KeyHandler(target, false /* bubble */),
      goog.events.KeyHandler.EventType.KEY, function() {
        gotInBubblePhase = true;
        assertTrue(gotInCapturePhase);
      });
  goog.events.listen(
      new goog.events.KeyHandler(target, true /* capture */),
      goog.events.KeyHandler.EventType.KEY,
      function() { gotInCapturePhase = true; });

  goog.testing.events.fireKeySequence(target, goog.events.KeyCodes.ESC);
  assertTrue(gotInBubblePhase);
}

function fireKeyDown(
    keyHandler, keyCode, opt_charCode, opt_keyIdentifier, opt_ctrlKey,
    opt_altKey, opt_shiftKey) {
  var fakeEvent = createFakeKeyEvent(
      goog.events.EventType.KEYDOWN, keyCode, opt_charCode, opt_keyIdentifier,
      opt_ctrlKey, opt_altKey, opt_shiftKey);
  keyHandler.handleKeyDown_(fakeEvent);
  return fakeEvent.returnValue_;
}

function fireKeyPress(
    keyHandler, keyCode, opt_charCode, opt_keyIdentifier, opt_ctrlKey,
    opt_altKey, opt_shiftKey) {
  var fakeEvent = createFakeKeyEvent(
      goog.events.EventType.KEYPRESS, keyCode, opt_charCode, opt_keyIdentifier,
      opt_ctrlKey, opt_altKey, opt_shiftKey);
  keyHandler.handleEvent(fakeEvent);
  return fakeEvent.returnValue_;
}

function fireKeyUp(
    keyHandler, keyCode, opt_charCode, opt_keyIdentifier, opt_ctrlKey,
    opt_altKey, opt_shiftKey) {
  var fakeEvent = createFakeKeyEvent(
      goog.events.EventType.KEYUP, keyCode, opt_charCode, opt_keyIdentifier,
      opt_ctrlKey, opt_altKey, opt_shiftKey);
  keyHandler.handleKeyup_(fakeEvent);
  return fakeEvent.returnValue_;
}

function createFakeKeyEvent(
    type, keyCode, opt_charCode, opt_keyIdentifier, opt_ctrlKey, opt_altKey,
    opt_shiftKey) {
  var event = {
    type: type,
    keyCode: keyCode,
    charCode: opt_charCode || undefined,
    keyIdentifier: opt_keyIdentifier || undefined,
    ctrlKey: opt_ctrlKey || false,
    altKey: opt_altKey || false,
    shiftKey: opt_shiftKey || false,
    timeStamp: goog.now()
  };
  return new goog.events.BrowserEvent(event);
}
