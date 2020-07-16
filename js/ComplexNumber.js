// This file was generated on Mon Jul 6, 2020 18:16 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: ComplexNumber.ebnf -javascript -tree

function ComplexNumber(string, parsingEventHandler)
{
  init(string, parsingEventHandler);

  var thisParser = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var begin = b;
    var end = e;
    var state = s;
    var offending = o;
    var expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};
    this.isAmbiguousInput = function() {return false;};

    this.getMessage = function()
    {
      return offending < 0
           ? "lexical analysis failed"
           : "syntax error";
    };
  };

  function init(source, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = source;
    size = source.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  this.getTokenOffset = function()
  {
    return b0;
  };

  this.getTokenEnd = function()
  {
    return e0;
  };

  function reset(l, b, e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    end = e;
    eventHandler.reset(input);
  }

  this.reset = function(l, b, e)
  {
    reset(l, b, e);
  };

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? ComplexNumber.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = ComplexNumber.getTokenSet(- e.getState());
    }
    else
    {
      expected = [ComplexNumber.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var message = e.getMessage();
    var found = this.getOffendingToken(e);
    var tokenSet = this.getExpectedTokenSet(e);
    var size = e.getEnd() - e.getBegin();
    message += (found == null ? "" : ", found " + found)
            + "\nwhile expecting "
            + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
            + "\n"
            + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ");
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    return message
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_number = function()
  {
    eventHandler.startNonterminal("number", e0);
    lookahead1W(2);                 // END | eof | real | imaginary | whitespace^token
    switch (l1)
    {
    case 2:                         // eof
      consume(2);                   // eof
      break;
    default:
      for (;;)
      {
        lookahead1W(1);             // END | real | imaginary | whitespace^token
        if (l1 == 1)                // END
        {
          break;
        }
        whitespace();
        parse_complex();
      }
    }
    eventHandler.endNonterminal("number", e0);
  };

  function parse_complex()
  {
    eventHandler.startNonterminal("complex", e0);
    if (l1 == 3)                    // real
    {
      consume(3);                   // real
    }
    lookahead1W(0);                 // imaginary | whitespace^token
    consume(4);                     // imaginary
    eventHandler.endNonterminal("complex", e0);
  }

  function consume(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(ComplexNumber.TOKEN[l1], b1, e1);
      b0 = b1; e0 = e1; l1 = 0;
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function whitespace()
  {
    if (e0 != b1)
    {
      eventHandler.whitespace(e0, b1);
      e0 = b1;
    }
  }

  function matchW(tokenSetId)
  {
    var code;
    for (;;)
    {
      code = match(tokenSetId);
      if (code != 5)                // whitespace^token
      {
        break;
      }
    }
    return code;
  }

  function lookahead1W(tokenSetId)
  {
    if (l1 == 0)
    {
      l1 = matchW(tokenSetId);
      b1 = begin;
      e1 = end;
    }
  }

  function error(b, e, s, l, t)
  {
    throw new thisParser.ParseException(b, e, s, l, t);
  }

  var     b0, e0;
  var l1, b1, e1;
  var eventHandler;

  var input;
  var size;

  var begin;
  var end;

  function match(tokenSetId)
  {
    begin = end;
    var current = end;
    var result = ComplexNumber.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 31; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = ComplexNumber.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 5;
        charclass = ComplexNumber.MAP1[(c0 & 31) + ComplexNumber.MAP1[(c1 & 31) + ComplexNumber.MAP1[c1 >> 5]]];
      }
      else
      {
        charclass = 0;
      }

      state = code;
      var i0 = (charclass << 5) + code - 1;
      code = ComplexNumber.TRANSITION[(i0 & 7) + ComplexNumber.TRANSITION[i0 >> 3]];

      if (code > 31)
      {
        result = code;
        code &= 31;
        end = current;
      }
    }

    result >>= 5;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    return (result & 7) - 1;
  }

}

ComplexNumber.XmlSerializer = function(log, indent)
{
  var input = null;
  var delayedTag = null;
  var hasChildElement = false;
  var depth = 0;

  this.reset = function(string)
  {
    log("<?xml version=\"1.0\" encoding=\"UTF-8\"?" + ">");
    input = string;
    delayedTag = null;
    hasChildElement = false;
    depth = 0;
  };

  this.startNonterminal = function(tag, begin)
  {
    if (delayedTag != null)
    {
      log("<");
      log(delayedTag);
      log(">");
    }
    delayedTag = tag;
    if (indent)
    {
      log("\n");
      for (var i = 0; i < depth; ++i)
      {
        log("  ");
      }
    }
    hasChildElement = false;
    ++depth;
  };

  this.endNonterminal = function(tag, end)
  {
    --depth;
    if (delayedTag != null)
    {
      delayedTag = null;
      log("<");
      log(tag);
      log("/>");
    }
    else
    {
      if (indent)
      {
        if (hasChildElement)
        {
          log("\n");
          for (var i = 0; i < depth; ++i)
          {
            log("  ");
          }
        }
      }
      log("</");
      log(tag);
      log(">");
    }
    hasChildElement = true;
  };

  this.terminal = function(tag, begin, end)
  {
    if (tag.charAt(0) == '\'') tag = "TOKEN";
    this.startNonterminal(tag, begin);
    characters(begin, end);
    this.endNonterminal(tag, end);
  };

  this.whitespace = function(begin, end)
  {
    characters(begin, end);
  };

  function characters(begin, end)
  {
    if (begin < end)
    {
      if (delayedTag != null)
      {
        log("<");
        log(delayedTag);
        log(">");
        delayedTag = null;
      }
      log(input.substring(begin, end)
               .replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;"));
    }
  }
};

ComplexNumber.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : ComplexNumber.INITIAL[tokenSetId] & 31;
  for (var i = 0; i < 6; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 24 + s - 1;
    var f = ComplexNumber.EXPECTED[(i0 & 1) + ComplexNumber.EXPECTED[i0 >> 1]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(ComplexNumber.TOKEN[j]);
      }
    }
  }
  return set;
};

ComplexNumber.TopDownTreeBuilder = function()
{
  var input = null;
  var stack = null;

  this.reset = function(i)
  {
    input = i;
    stack = [];
  };

  this.startNonterminal = function(name, begin)
  {
    var nonterminal = new ComplexNumber.Nonterminal(name, begin, begin, []);
    if (stack.length > 0) addChild(nonterminal);
    stack.push(nonterminal);
  };

  this.endNonterminal = function(name, end)
  {
    stack[stack.length - 1].end = end;
    if (stack.length > 1) stack.pop();
  };

  this.terminal = function(name, begin, end)
  {
    addChild(new ComplexNumber.Terminal(name, begin, end));
  };

  this.whitespace = function(begin, end)
  {
  };

  function addChild(s)
  {
    var current = stack[stack.length - 1];
    current.children.push(s);
  }

  this.serialize = function(e)
  {
    e.reset(input);
    stack[0].send(e);
  };
};

ComplexNumber.Terminal = function(name, begin, end)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.terminal(name, begin, end);
  };
};

ComplexNumber.Nonterminal = function(name, begin, end, children)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.startNonterminal(name, begin);
    var pos = begin;
    children.forEach
    (
      function(c)
      {
        if (pos < c.begin) e.whitespace(pos, c.begin);
        c.send(e);
        pos = c.end;
      }
    );
    if (pos < end) e.whitespace(pos, end);
    e.endNonterminal(name, end);
  };
};

ComplexNumber.MAP0 =
[
  /*   0 */ 10, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
  /*  36 */ 0, 0, 0, 0, 0, 0, 2, 3, 0, 4, 5, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /*  72 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0,
  /* 108 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

ComplexNumber.MAP1 =
[
  /*   0 */ 54, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
  /*  27 */ 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
  /*  54 */ 90, 159, 127, 117, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,
  /*  76 */ 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 10, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
  /* 102 */ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 138 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 4, 5,
  /* 174 */ 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0, 0, 0, 0, 0, 0
];

ComplexNumber.INITIAL =
[
  /* 0 */ 1, 66, 67
];

ComplexNumber.TRANSITION =
[
  /*   0 */ 161, 161, 161, 161, 44, 161, 161, 161, 59, 82, 88, 161, 56, 67, 163, 161, 75, 67, 163, 161, 174, 96, 161,
  /*  23 */ 161, 114, 127, 135, 161, 119, 143, 151, 161, 48, 103, 106, 161, 161, 159, 161, 161, 171, 161, 161, 161, 196,
  /*  45 */ 196, 196, 196, 0, 0, 0, 0, 0, 13, 0, 16, 5, 5, 5, 0, 0, 0, 0, 0, 10, 0, 10, 0, 0, 0, 18, 18, 0, 21, 21, 5,
  /*  76 */ 7, 7, 0, 9, 0, 9, 0, 0, 0, 10, 0, 0, 10, 0, 10, 10, 0, 10, 10, 10, 0, 0, 0, 11, 0, 0, 14, 0, 0, 0, 13, 0, 0,
  /* 109 */ 16, 0, 0, 13, 16, 6, 136, 136, 0, 6, 6, 136, 136, 0, 6, 12, 136, 143, 6, 0, 17, 6, 19, 148, 136, 150, 17,
  /* 136 */ 19, 19, 148, 150, 150, 17, 148, 6, 0, 17, 12, 19, 148, 143, 150, 23, 19, 19, 152, 150, 150, 23, 152, 0, 160,
  /* 161 */ 0, 0, 0, 0, 0, 0, 0, 0, 18, 21, 0, 0, 96, 0, 0, 0, 0, 0, 11, 0, 14
];

ComplexNumber.EXPECTED =
[
  /*  0 */ 12, 14, 16, 18, 16, 16, 17, 18, 16, 17, 18, 17, 48, 56, 60, 32, 16, 16, 24, 24
];

ComplexNumber.TOKEN =
[
  "(0)",
  "END",
  "eof",
  "real",
  "imaginary",
  "whitespace"
];

// End
