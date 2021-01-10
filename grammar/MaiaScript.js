// This file was generated on Sat Jan 9, 2021 13:50 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -ll 3 -backtrack -javascript -tree

function MaiaScript(string, parsingEventHandler)
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
    l2 = 0; b2 = 0; e2 = 0;
    l3 = 0; b3 = 0; e3 = 0;
    end = e;
    ex = -1;
    memo = {};
    eventHandler.reset(input);
  }

  this.reset = function(l, b, e)
  {
    reset(l, b, e);
  };

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? MaiaScript.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = MaiaScript.getTokenSet(- e.getState());
    }
    else
    {
      expected = [MaiaScript.TOKEN[e.getExpected()]];
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

  this.parse_maiascript = function()
  {
    eventHandler.startNonterminal("maiascript", e0);
    lookahead1W(21);                // END | eof | identifier | null | true | false | string | complex | real |
                                    // comment | whitespace^token | '!' | '(' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
    switch (l1)
    {
    case 2:                         // eof
      consume(2);                   // eof
      break;
    default:
      for (;;)
      {
        lookahead1W(17);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 == 1)                // END
        {
          break;
        }
        whitespace();
        parse_expression();
      }
    }
    eventHandler.endNonterminal("maiascript", e0);
  };

  function parse_operation()
  {
    eventHandler.startNonterminal("operation", e0);
    parse_variableAssignment();
    eventHandler.endNonterminal("operation", e0);
  }

  function try_operation()
  {
    try_variableAssignment();
  }

  function parse_variableAssignment()
  {
    eventHandler.startNonterminal("variableAssignment", e0);
    parse_logicalORExpression();
    for (;;)
    {
      if (l1 != 26                  // ':='
       && l1 != 31                  // '='
       && l1 != 36)                 // '?='
      {
        break;
      }
      switch (l1)
      {
      case 31:                      // '='
        consume(31);                // '='
        break;
      case 26:                      // ':='
        consume(26);                // ':='
        break;
      default:
        consume(36);                // '?='
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_logicalORExpression();
    }
    eventHandler.endNonterminal("variableAssignment", e0);
  }

  function try_variableAssignment()
  {
    try_logicalORExpression();
    for (;;)
    {
      if (l1 != 26                  // ':='
       && l1 != 31                  // '='
       && l1 != 36)                 // '?='
      {
        break;
      }
      switch (l1)
      {
      case 31:                      // '='
        consumeT(31);               // '='
        break;
      case 26:                      // ':='
        consumeT(26);               // ':='
        break;
      default:
        consumeT(36);               // '?='
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_logicalORExpression();
    }
  }

  function parse_logicalORExpression()
  {
    eventHandler.startNonterminal("logicalORExpression", e0);
    parse_logicalXORExpression();
    for (;;)
    {
      if (l1 != 62)                 // '||'
      {
        break;
      }
      consume(62);                  // '||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_logicalXORExpression();
    }
    eventHandler.endNonterminal("logicalORExpression", e0);
  }

  function try_logicalORExpression()
  {
    try_logicalXORExpression();
    for (;;)
    {
      if (l1 != 62)                 // '||'
      {
        break;
      }
      consumeT(62);                 // '||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_logicalXORExpression();
    }
  }

  function parse_logicalXORExpression()
  {
    eventHandler.startNonterminal("logicalXORExpression", e0);
    parse_logicalANDExpression();
    for (;;)
    {
      if (l1 != 64)                 // '||||'
      {
        break;
      }
      consume(64);                  // '||||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_logicalANDExpression();
    }
    eventHandler.endNonterminal("logicalXORExpression", e0);
  }

  function try_logicalXORExpression()
  {
    try_logicalANDExpression();
    for (;;)
    {
      if (l1 != 64)                 // '||||'
      {
        break;
      }
      consumeT(64);                 // '||||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_logicalANDExpression();
    }
  }

  function parse_logicalANDExpression()
  {
    eventHandler.startNonterminal("logicalANDExpression", e0);
    parse_bitwiseORExpression();
    for (;;)
    {
      if (l1 != 16)                 // '&&'
      {
        break;
      }
      consume(16);                  // '&&'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_bitwiseORExpression();
    }
    eventHandler.endNonterminal("logicalANDExpression", e0);
  }

  function try_logicalANDExpression()
  {
    try_bitwiseORExpression();
    for (;;)
    {
      if (l1 != 16)                 // '&&'
      {
        break;
      }
      consumeT(16);                 // '&&'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_bitwiseORExpression();
    }
  }

  function parse_bitwiseORExpression()
  {
    eventHandler.startNonterminal("bitwiseORExpression", e0);
    parse_bitwiseXORExpression();
    for (;;)
    {
      if (l1 != 61)                 // '|'
      {
        break;
      }
      consume(61);                  // '|'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_bitwiseXORExpression();
    }
    eventHandler.endNonterminal("bitwiseORExpression", e0);
  }

  function try_bitwiseORExpression()
  {
    try_bitwiseXORExpression();
    for (;;)
    {
      if (l1 != 61)                 // '|'
      {
        break;
      }
      consumeT(61);                 // '|'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_bitwiseXORExpression();
    }
  }

  function parse_bitwiseXORExpression()
  {
    eventHandler.startNonterminal("bitwiseXORExpression", e0);
    parse_bitwiseANDExpression();
    for (;;)
    {
      if (l1 != 63)                 // '|||'
      {
        break;
      }
      consume(63);                  // '|||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_bitwiseANDExpression();
    }
    eventHandler.endNonterminal("bitwiseXORExpression", e0);
  }

  function try_bitwiseXORExpression()
  {
    try_bitwiseANDExpression();
    for (;;)
    {
      if (l1 != 63)                 // '|||'
      {
        break;
      }
      consumeT(63);                 // '|||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_bitwiseANDExpression();
    }
  }

  function parse_bitwiseANDExpression()
  {
    eventHandler.startNonterminal("bitwiseANDExpression", e0);
    parse_equalityExpression();
    for (;;)
    {
      if (l1 != 15)                 // '&'
      {
        break;
      }
      consume(15);                  // '&'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_equalityExpression();
    }
    eventHandler.endNonterminal("bitwiseANDExpression", e0);
  }

  function try_bitwiseANDExpression()
  {
    try_equalityExpression();
    for (;;)
    {
      if (l1 != 15)                 // '&'
      {
        break;
      }
      consumeT(15);                 // '&'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_equalityExpression();
    }
  }

  function parse_equalityExpression()
  {
    eventHandler.startNonterminal("equalityExpression", e0);
    parse_relationalExpression();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 32)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 32:                      // '=='
        consume(32);                // '=='
        break;
      default:
        consume(13);                // '!='
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_relationalExpression();
    }
    eventHandler.endNonterminal("equalityExpression", e0);
  }

  function try_equalityExpression()
  {
    try_relationalExpression();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 32)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 32:                      // '=='
        consumeT(32);               // '=='
        break;
      default:
        consumeT(13);               // '!='
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_relationalExpression();
    }
  }

  function parse_relationalExpression()
  {
    eventHandler.startNonterminal("relationalExpression", e0);
    parse_shiftExpression();
    for (;;)
    {
      if (l1 != 28                  // '<'
       && l1 != 30                  // '<='
       && l1 != 33                  // '>'
       && l1 != 34)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '<'
        consume(28);                // '<'
        break;
      case 33:                      // '>'
        consume(33);                // '>'
        break;
      case 30:                      // '<='
        consume(30);                // '<='
        break;
      default:
        consume(34);                // '>='
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_shiftExpression();
    }
    eventHandler.endNonterminal("relationalExpression", e0);
  }

  function try_relationalExpression()
  {
    try_shiftExpression();
    for (;;)
    {
      if (l1 != 28                  // '<'
       && l1 != 30                  // '<='
       && l1 != 33                  // '>'
       && l1 != 34)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '<'
        consumeT(28);               // '<'
        break;
      case 33:                      // '>'
        consumeT(33);               // '>'
        break;
      case 30:                      // '<='
        consumeT(30);               // '<='
        break;
      default:
        consumeT(34);               // '>='
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_shiftExpression();
    }
  }

  function parse_shiftExpression()
  {
    eventHandler.startNonterminal("shiftExpression", e0);
    parse_additiveExpression();
    for (;;)
    {
      if (l1 != 29                  // '<<'
       && l1 != 35)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 29:                      // '<<'
        consume(29);                // '<<'
        break;
      default:
        consume(35);                // '>>'
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_additiveExpression();
    }
    eventHandler.endNonterminal("shiftExpression", e0);
  }

  function try_shiftExpression()
  {
    try_additiveExpression();
    for (;;)
    {
      if (l1 != 29                  // '<<'
       && l1 != 35)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 29:                      // '<<'
        consumeT(29);               // '<<'
        break;
      default:
        consumeT(35);               // '>>'
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_additiveExpression();
    }
  }

  function parse_additiveExpression()
  {
    eventHandler.startNonterminal("additiveExpression", e0);
    parse_multiplicativeExpression();
    for (;;)
    {
      if (l1 != 20                  // '+'
       && l1 != 22)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 20:                      // '+'
        consume(20);                // '+'
        break;
      default:
        consume(22);                // '-'
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_multiplicativeExpression();
    }
    eventHandler.endNonterminal("additiveExpression", e0);
  }

  function try_additiveExpression()
  {
    try_multiplicativeExpression();
    for (;;)
    {
      if (l1 != 20                  // '+'
       && l1 != 22)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 20:                      // '+'
        consumeT(20);               // '+'
        break;
      default:
        consumeT(22);               // '-'
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_multiplicativeExpression();
    }
  }

  function parse_multiplicativeExpression()
  {
    eventHandler.startNonterminal("multiplicativeExpression", e0);
    parse_powerExpression();
    for (;;)
    {
      if (l1 != 14                  // '%'
       && l1 != 19                  // '*'
       && l1 != 24)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 19:                      // '*'
        consume(19);                // '*'
        break;
      case 24:                      // '/'
        consume(24);                // '/'
        break;
      default:
        consume(14);                // '%'
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_powerExpression();
    }
    eventHandler.endNonterminal("multiplicativeExpression", e0);
  }

  function try_multiplicativeExpression()
  {
    try_powerExpression();
    for (;;)
    {
      if (l1 != 14                  // '%'
       && l1 != 19                  // '*'
       && l1 != 24)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 19:                      // '*'
        consumeT(19);               // '*'
        break;
      case 24:                      // '/'
        consumeT(24);               // '/'
        break;
      default:
        consumeT(14);               // '%'
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_powerExpression();
    }
  }

  function parse_powerExpression()
  {
    eventHandler.startNonterminal("powerExpression", e0);
    parse_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
      if (l1 != 39)                 // '^'
      {
        break;
      }
      consume(39);                  // '^'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_unaryExpression();
    }
    eventHandler.endNonterminal("powerExpression", e0);
  }

  function try_powerExpression()
  {
    try_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
      if (l1 != 39)                 // '^'
      {
        break;
      }
      consumeT(39);                 // '^'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_unaryExpression();
    }
  }

  function parse_unaryExpression()
  {
    eventHandler.startNonterminal("unaryExpression", e0);
    switch (l1)
    {
    case 66:                        // '~'
      consume(66);                  // '~'
      lookahead1W(11);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
      whitespace();
      parse_primary();
      break;
    case 12:                        // '!'
      consume(12);                  // '!'
      lookahead1W(11);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
      whitespace();
      parse_primary();
      break;
    default:
      parse_primary();
    }
    eventHandler.endNonterminal("unaryExpression", e0);
  }

  function try_unaryExpression()
  {
    switch (l1)
    {
    case 66:                        // '~'
      consumeT(66);                 // '~'
      lookahead1W(11);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
      try_primary();
      break;
    case 12:                        // '!'
      consumeT(12);                 // '!'
      lookahead1W(11);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
      try_primary();
      break;
    default:
      try_primary();
    }
  }

  function parse_primary()
  {
    eventHandler.startNonterminal("primary", e0);
    switch (l1)
    {
    case 3:                         // identifier
      parse_member();
      break;
    case 17:                        // '('
      parse_parenthesizedExpression();
      break;
    default:
      parse_value();
    }
    eventHandler.endNonterminal("primary", e0);
  }

  function try_primary()
  {
    switch (l1)
    {
    case 3:                         // identifier
      try_member();
      break;
    case 17:                        // '('
      try_parenthesizedExpression();
      break;
    default:
      try_value();
    }
  }

  function parse_statement()
  {
    eventHandler.startNonterminal("statement", e0);
    switch (l1)
    {
    case 54:                        // 'namespace'
      parse_namespace();
      break;
    case 53:                        // 'local'
      parse_local();
      break;
    case 51:                        // 'if'
      parse_if();
      break;
    case 45:                        // 'do'
      parse_do();
      break;
    case 59:                        // 'while'
      parse_while();
      break;
    case 48:                        // 'for'
      parse_for();
      break;
    case 49:                        // 'foreach'
      parse_foreach();
      break;
    case 58:                        // 'try'
      parse_try();
      break;
    case 56:                        // 'test'
      parse_test();
      break;
    case 41:                        // 'break'
      parse_break();
      break;
    case 44:                        // 'continue'
      parse_continue();
      break;
    case 55:                        // 'return'
      parse_return();
      break;
    case 57:                        // 'throw'
      parse_throw();
      break;
    default:
      parse_function();
    }
    eventHandler.endNonterminal("statement", e0);
  }

  function try_statement()
  {
    switch (l1)
    {
    case 54:                        // 'namespace'
      try_namespace();
      break;
    case 53:                        // 'local'
      try_local();
      break;
    case 51:                        // 'if'
      try_if();
      break;
    case 45:                        // 'do'
      try_do();
      break;
    case 59:                        // 'while'
      try_while();
      break;
    case 48:                        // 'for'
      try_for();
      break;
    case 49:                        // 'foreach'
      try_foreach();
      break;
    case 58:                        // 'try'
      try_try();
      break;
    case 56:                        // 'test'
      try_test();
      break;
    case 41:                        // 'break'
      try_break();
      break;
    case 44:                        // 'continue'
      try_continue();
      break;
    case 55:                        // 'return'
      try_return();
      break;
    case 57:                        // 'throw'
      try_throw();
      break;
    default:
      try_function();
    }
  }

  function parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
    consume(54);                    // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    consumeT(54);                   // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_function()
  {
    eventHandler.startNonterminal("function", e0);
    switch (l1)
    {
    case 40:                        // 'async'
      consume(40);                  // 'async'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(60);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(65);                  // '}'
      break;
    case 43:                        // 'constructor'
      consume(43);                  // 'constructor'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(60);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(65);                  // '}'
      break;
    case 52:                        // 'kernel'
      consume(52);                  // 'kernel'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(60);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(65);                  // '}'
      break;
    default:
      consume(50);                  // 'function'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(60);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(65);                  // '}'
    }
    eventHandler.endNonterminal("function", e0);
  }

  function try_function()
  {
    switch (l1)
    {
    case 40:                        // 'async'
      consumeT(40);                 // 'async'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(60);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(65);                 // '}'
      break;
    case 43:                        // 'constructor'
      consumeT(43);                 // 'constructor'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(60);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(65);                 // '}'
      break;
    case 52:                        // 'kernel'
      consumeT(52);                 // 'kernel'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(60);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(65);                 // '}'
      break;
    default:
      consumeT(50);                 // 'function'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(60);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 65)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(65);                 // '}'
    }
  }

  function parse_local()
  {
    eventHandler.startNonterminal("local", e0);
    consume(53);                    // 'local'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    eventHandler.endNonterminal("local", e0);
  }

  function try_local()
  {
    consumeT(53);                   // 'local'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
  }

  function parse_if()
  {
    eventHandler.startNonterminal("if", e0);
    consume(51);                    // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'kernel' | 'local' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 != 47)                 // 'elseif'
      {
        break;
      }
      whitespace();
      parse_elseif();
    }
    if (l1 == 46)                   // 'else'
    {
      whitespace();
      parse_else();
    }
    eventHandler.endNonterminal("if", e0);
  }

  function try_if()
  {
    consumeT(51);                   // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'kernel' | 'local' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 != 47)                 // 'elseif'
      {
        break;
      }
      try_elseif();
    }
    if (l1 == 46)                   // 'else'
    {
      try_else();
    }
  }

  function parse_elseif()
  {
    eventHandler.startNonterminal("elseif", e0);
    consume(47);                    // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("elseif", e0);
  }

  function try_elseif()
  {
    consumeT(47);                   // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(46);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(46);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(45);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(59);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("do", e0);
  }

  function try_do()
  {
    consumeT(45);                   // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(59);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(59);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(59);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_for()
  {
    eventHandler.startNonterminal("for", e0);
    consume(48);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("for", e0);
  }

  function try_for()
  {
    consumeT(48);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
    consume(49);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("foreach", e0);
  }

  function try_foreach()
  {
    consumeT(49);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(58);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(58);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(56);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
    if (l1 != 18                    // ')'
     && l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(8);                 // whitespace^token | ')' | ';'
    if (l1 == 27)                   // ';'
    {
      consume(27);                  // ';'
      lookahead1W(22);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
      if (l1 != 18                  // ')'
       && l1 != 27)                 // ';'
      {
        whitespace();
        parse_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 27)                 // ';'
      {
        consume(27);                // ';'
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 != 18)               // ')'
        {
          whitespace();
          parse_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(56);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
    if (l1 != 18                    // ')'
     && l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(8);                 // whitespace^token | ')' | ';'
    if (l1 == 27)                   // ';'
    {
      consumeT(27);                 // ';'
      lookahead1W(22);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
      if (l1 != 18                  // ')'
       && l1 != 27)                 // ';'
      {
        try_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 27)                 // ';'
      {
        consumeT(27);               // ';'
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 != 18)               // ')'
        {
          try_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_catch()
  {
    eventHandler.startNonterminal("catch", e0);
    consume(42);                    // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(60);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("catch", e0);
  }

  function try_catch()
  {
    consumeT(42);                   // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(60);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 65)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(65);                   // '}'
  }

  function parse_break()
  {
    eventHandler.startNonterminal("break", e0);
    consume(41);                    // 'break'
    eventHandler.endNonterminal("break", e0);
  }

  function try_break()
  {
    consumeT(41);                   // 'break'
  }

  function parse_continue()
  {
    eventHandler.startNonterminal("continue", e0);
    consume(44);                    // 'continue'
    eventHandler.endNonterminal("continue", e0);
  }

  function try_continue()
  {
    consumeT(44);                   // 'continue'
  }

  function parse_return()
  {
    eventHandler.startNonterminal("return", e0);
    consume(55);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("return", e0);
  }

  function try_return()
  {
    consumeT(55);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_throw()
  {
    eventHandler.startNonterminal("throw", e0);
    consume(57);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("throw", e0);
  }

  function try_throw()
  {
    consumeT(57);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_expression()
  {
    eventHandler.startNonterminal("expression", e0);
    switch (l1)
    {
    case 3:                         // identifier
    case 4:                         // null
    case 5:                         // true
    case 6:                         // false
    case 7:                         // string
    case 8:                         // complex
    case 9:                         // real
    case 12:                        // '!'
    case 17:                        // '('
    case 37:                        // '['
    case 60:                        // '{'
    case 66:                        // '~'
      parse_operation();
      break;
    case 10:                        // comment
      consume(10);                  // comment
      break;
    default:
      parse_statement();
    }
    eventHandler.endNonterminal("expression", e0);
  }

  function try_expression()
  {
    switch (l1)
    {
    case 3:                         // identifier
    case 4:                         // null
    case 5:                         // true
    case 6:                         // false
    case 7:                         // string
    case 8:                         // complex
    case 9:                         // real
    case 12:                        // '!'
    case 17:                        // '('
    case 37:                        // '['
    case 60:                        // '{'
    case 66:                        // '~'
      try_operation();
      break;
    case 10:                        // comment
      consumeT(10);                 // comment
      break;
    default:
      try_statement();
    }
  }

  function parse_arguments()
  {
    eventHandler.startNonterminal("arguments", e0);
    parse_expression();
    for (;;)
    {
      lookahead1W(24);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_expression();
    }
    eventHandler.endNonterminal("arguments", e0);
  }

  function try_arguments()
  {
    try_expression();
    for (;;)
    {
      lookahead1W(24);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_expression();
    }
  }

  function parse_member()
  {
    eventHandler.startNonterminal("member", e0);
    switch (l1)
    {
    case 3:                         // identifier
      lookahead2W(28);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        break;
      case 2947:                    // identifier '.'
        lookahead3W(0);             // identifier | whitespace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 51331                 // identifier '(' identifier
     || lk == 52099                 // identifier '.' identifier
     || lk == 67715                 // identifier '(' null
     || lk == 84099                 // identifier '(' true
     || lk == 100483                // identifier '(' false
     || lk == 116867                // identifier '(' string
     || lk == 133251                // identifier '(' complex
     || lk == 149635                // identifier '(' real
     || lk == 166019                // identifier '(' comment
     || lk == 198787                // identifier '(' '!'
     || lk == 280707                // identifier '(' '('
     || lk == 608387                // identifier '(' '['
     || lk == 657539                // identifier '(' 'async'
     || lk == 673923                // identifier '(' 'break'
     || lk == 706691                // identifier '(' 'constructor'
     || lk == 723075                // identifier '(' 'continue'
     || lk == 739459                // identifier '(' 'do'
     || lk == 788611                // identifier '(' 'for'
     || lk == 804995                // identifier '(' 'foreach'
     || lk == 821379                // identifier '(' 'function'
     || lk == 837763                // identifier '(' 'if'
     || lk == 854147                // identifier '(' 'kernel'
     || lk == 870531                // identifier '(' 'local'
     || lk == 886915                // identifier '(' 'namespace'
     || lk == 903299                // identifier '(' 'return'
     || lk == 919683                // identifier '(' 'test'
     || lk == 936067                // identifier '(' 'throw'
     || lk == 952451                // identifier '(' 'try'
     || lk == 968835                // identifier '(' 'while'
     || lk == 985219                // identifier '(' '{'
     || lk == 1083523)              // identifier '(' '~'
    {
      lk = memoized(0, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          consumeT(3);              // identifier
          for (;;)
          {
            lookahead1W(7);         // whitespace^token | '(' | '.'
            if (l1 != 23)           // '.'
            {
              break;
            }
            consumeT(23);           // '.'
            lookahead1W(0);         // identifier | whitespace^token
            consumeT(3);            // identifier
          }
          consumeT(17);             // '('
          for (;;)
          {
            lookahead1W(18);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            if (l1 == 18)           // ')'
            {
              break;
            }
            try_arguments();
          }
          consumeT(18);             // ')'
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
        b3 = b3A; e3 = e3A; end = e3A; }}}
        memoize(0, e0, lk);
      }
    }
    switch (lk)
    {
    case -1:
    case 297091:                    // identifier '(' ')'
      consume(3);                   // identifier
      for (;;)
      {
        lookahead1W(7);             // whitespace^token | '(' | '.'
        if (l1 != 23)               // '.'
        {
          break;
        }
        consume(23);                // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consume(3);                 // identifier
      }
      consume(17);                  // '('
      for (;;)
      {
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 == 18)               // ')'
        {
          break;
        }
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      break;
    default:
      consume(3);                   // identifier
      for (;;)
      {
        lookahead1W(28);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
        if (l1 != 23)               // '.'
        {
          break;
        }
        consume(23);                // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consume(3);                 // identifier
      }
      for (;;)
      {
        lookahead1W(27);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
          switch (lk)
          {
          case 421:                 // '[' identifier
            lookahead3W(15);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' |
                                    // '[' | ']' | '^' | '|' | '||' | '|||' | '||||'
            break;
          case 4773:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8485:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7461:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6821:                // '[' 'local'
          case 7717:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 5157:                // '[' 'async'
          case 5541:                // '[' 'constructor'
          case 6437:                // '[' 'function'
          case 6693:                // '[' 'kernel'
          case 6949:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 549:                 // '[' null
          case 677:                 // '[' true
          case 805:                 // '[' false
          case 933:                 // '[' string
          case 1061:                // '[' complex
          case 1189:                // '[' real
            lookahead3W(14);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':=' |
                                    // ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' | ']' | '^' |
                                    // '|' | '||' | '|||' | '||||'
            break;
          case 6181:                // '[' 'for'
          case 6309:                // '[' 'foreach'
          case 6565:                // '[' 'if'
          case 7077:                // '[' 'return'
          case 7205:                // '[' 'test'
          case 7333:                // '[' 'throw'
          case 7589:                // '[' 'while'
            lookahead3W(1);         // whitespace^token | '('
            break;
          }
          break;
        default:
          lk = l1;
        }
        if (lk != 1                 // END
         && lk != 3                 // identifier
         && lk != 4                 // null
         && lk != 5                 // true
         && lk != 6                 // false
         && lk != 7                 // string
         && lk != 8                 // complex
         && lk != 9                 // real
         && lk != 10                // comment
         && lk != 12                // '!'
         && lk != 13                // '!='
         && lk != 14                // '%'
         && lk != 15                // '&'
         && lk != 16                // '&&'
         && lk != 17                // '('
         && lk != 18                // ')'
         && lk != 19                // '*'
         && lk != 20                // '+'
         && lk != 21                // ','
         && lk != 22                // '-'
         && lk != 24                // '/'
         && lk != 26                // ':='
         && lk != 27                // ';'
         && lk != 28                // '<'
         && lk != 29                // '<<'
         && lk != 30                // '<='
         && lk != 31                // '='
         && lk != 32                // '=='
         && lk != 33                // '>'
         && lk != 34                // '>='
         && lk != 35                // '>>'
         && lk != 36                // '?='
         && lk != 38                // ']'
         && lk != 39                // '^'
         && lk != 40                // 'async'
         && lk != 41                // 'break'
         && lk != 43                // 'constructor'
         && lk != 44                // 'continue'
         && lk != 45                // 'do'
         && lk != 48                // 'for'
         && lk != 49                // 'foreach'
         && lk != 50                // 'function'
         && lk != 51                // 'if'
         && lk != 52                // 'kernel'
         && lk != 53                // 'local'
         && lk != 54                // 'namespace'
         && lk != 55                // 'return'
         && lk != 56                // 'test'
         && lk != 57                // 'throw'
         && lk != 58                // 'try'
         && lk != 59                // 'while'
         && lk != 60                // '{'
         && lk != 61                // '|'
         && lk != 62                // '||'
         && lk != 63                // '|||'
         && lk != 64                // '||||'
         && lk != 65                // '}'
         && lk != 66                // '~'
         && lk != 3493              // '[' ';'
         && lk != 4901              // '[' ']'
         && lk != 442789            // '[' identifier ';'
         && lk != 442917            // '[' null ';'
         && lk != 443045            // '[' true ';'
         && lk != 443173            // '[' false ';'
         && lk != 443301            // '[' string ';'
         && lk != 443429            // '[' complex ';'
         && lk != 443557            // '[' real ';'
         && lk != 443685            // '[' comment ';'
         && lk != 447653            // '[' 'break' ';'
         && lk != 448037)           // '[' 'continue' ';'
        {
          lk = memoized(1, e0);
          if (lk == 0)
          {
            var b0B = b0; var e0B = e0; var l1B = l1;
            var b1B = b1; var e1B = e1; var l2B = l2;
            var b2B = b2; var e2B = e2; var l3B = l3;
            var b3B = b3; var e3B = e3;
            try
            {
              consumeT(37);         // '['
              lookahead1W(16);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
              try_arguments();
              consumeT(38);         // ']'
              lk = -1;
            }
            catch (p1B)
            {
              lk = -2;
            }
            b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
            b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
            b2 = b2B; e2 = e2B; l3 = l3B; if (l3 == 0) {end = e2B;} else {
            b3 = b3B; e3 = e3B; end = e3B; }}}
            memoize(1, e0, lk);
          }
        }
        if (lk != -1)
        {
          break;
        }
        consume(37);                // '['
        lookahead1W(16);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        whitespace();
        parse_arguments();
        consume(38);                // ']'
      }
    }
    eventHandler.endNonterminal("member", e0);
  }

  function try_member()
  {
    switch (l1)
    {
    case 3:                         // identifier
      lookahead2W(28);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        break;
      case 2947:                    // identifier '.'
        lookahead3W(0);             // identifier | whitespace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 51331                 // identifier '(' identifier
     || lk == 52099                 // identifier '.' identifier
     || lk == 67715                 // identifier '(' null
     || lk == 84099                 // identifier '(' true
     || lk == 100483                // identifier '(' false
     || lk == 116867                // identifier '(' string
     || lk == 133251                // identifier '(' complex
     || lk == 149635                // identifier '(' real
     || lk == 166019                // identifier '(' comment
     || lk == 198787                // identifier '(' '!'
     || lk == 280707                // identifier '(' '('
     || lk == 608387                // identifier '(' '['
     || lk == 657539                // identifier '(' 'async'
     || lk == 673923                // identifier '(' 'break'
     || lk == 706691                // identifier '(' 'constructor'
     || lk == 723075                // identifier '(' 'continue'
     || lk == 739459                // identifier '(' 'do'
     || lk == 788611                // identifier '(' 'for'
     || lk == 804995                // identifier '(' 'foreach'
     || lk == 821379                // identifier '(' 'function'
     || lk == 837763                // identifier '(' 'if'
     || lk == 854147                // identifier '(' 'kernel'
     || lk == 870531                // identifier '(' 'local'
     || lk == 886915                // identifier '(' 'namespace'
     || lk == 903299                // identifier '(' 'return'
     || lk == 919683                // identifier '(' 'test'
     || lk == 936067                // identifier '(' 'throw'
     || lk == 952451                // identifier '(' 'try'
     || lk == 968835                // identifier '(' 'while'
     || lk == 985219                // identifier '(' '{'
     || lk == 1083523)              // identifier '(' '~'
    {
      lk = memoized(0, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          consumeT(3);              // identifier
          for (;;)
          {
            lookahead1W(7);         // whitespace^token | '(' | '.'
            if (l1 != 23)           // '.'
            {
              break;
            }
            consumeT(23);           // '.'
            lookahead1W(0);         // identifier | whitespace^token
            consumeT(3);            // identifier
          }
          consumeT(17);             // '('
          for (;;)
          {
            lookahead1W(18);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            if (l1 == 18)           // ')'
            {
              break;
            }
            try_arguments();
          }
          consumeT(18);             // ')'
          memoize(0, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(0, e0A, -2);
        }
      }
    }
    switch (lk)
    {
    case -1:
    case 297091:                    // identifier '(' ')'
      consumeT(3);                  // identifier
      for (;;)
      {
        lookahead1W(7);             // whitespace^token | '(' | '.'
        if (l1 != 23)               // '.'
        {
          break;
        }
        consumeT(23);               // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consumeT(3);                // identifier
      }
      consumeT(17);                 // '('
      for (;;)
      {
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 == 18)               // ')'
        {
          break;
        }
        try_arguments();
      }
      consumeT(18);                 // ')'
      break;
    case -3:
      break;
    default:
      consumeT(3);                  // identifier
      for (;;)
      {
        lookahead1W(28);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
        if (l1 != 23)               // '.'
        {
          break;
        }
        consumeT(23);               // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consumeT(3);                // identifier
      }
      for (;;)
      {
        lookahead1W(27);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' |
                                    // '||||' | '}' | '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
          switch (lk)
          {
          case 421:                 // '[' identifier
            lookahead3W(15);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' |
                                    // '[' | ']' | '^' | '|' | '||' | '|||' | '||||'
            break;
          case 4773:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8485:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7461:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6821:                // '[' 'local'
          case 7717:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 5157:                // '[' 'async'
          case 5541:                // '[' 'constructor'
          case 6437:                // '[' 'function'
          case 6693:                // '[' 'kernel'
          case 6949:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 549:                 // '[' null
          case 677:                 // '[' true
          case 805:                 // '[' false
          case 933:                 // '[' string
          case 1061:                // '[' complex
          case 1189:                // '[' real
            lookahead3W(14);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':=' |
                                    // ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' | ']' | '^' |
                                    // '|' | '||' | '|||' | '||||'
            break;
          case 6181:                // '[' 'for'
          case 6309:                // '[' 'foreach'
          case 6565:                // '[' 'if'
          case 7077:                // '[' 'return'
          case 7205:                // '[' 'test'
          case 7333:                // '[' 'throw'
          case 7589:                // '[' 'while'
            lookahead3W(1);         // whitespace^token | '('
            break;
          }
          break;
        default:
          lk = l1;
        }
        if (lk != 1                 // END
         && lk != 3                 // identifier
         && lk != 4                 // null
         && lk != 5                 // true
         && lk != 6                 // false
         && lk != 7                 // string
         && lk != 8                 // complex
         && lk != 9                 // real
         && lk != 10                // comment
         && lk != 12                // '!'
         && lk != 13                // '!='
         && lk != 14                // '%'
         && lk != 15                // '&'
         && lk != 16                // '&&'
         && lk != 17                // '('
         && lk != 18                // ')'
         && lk != 19                // '*'
         && lk != 20                // '+'
         && lk != 21                // ','
         && lk != 22                // '-'
         && lk != 24                // '/'
         && lk != 26                // ':='
         && lk != 27                // ';'
         && lk != 28                // '<'
         && lk != 29                // '<<'
         && lk != 30                // '<='
         && lk != 31                // '='
         && lk != 32                // '=='
         && lk != 33                // '>'
         && lk != 34                // '>='
         && lk != 35                // '>>'
         && lk != 36                // '?='
         && lk != 38                // ']'
         && lk != 39                // '^'
         && lk != 40                // 'async'
         && lk != 41                // 'break'
         && lk != 43                // 'constructor'
         && lk != 44                // 'continue'
         && lk != 45                // 'do'
         && lk != 48                // 'for'
         && lk != 49                // 'foreach'
         && lk != 50                // 'function'
         && lk != 51                // 'if'
         && lk != 52                // 'kernel'
         && lk != 53                // 'local'
         && lk != 54                // 'namespace'
         && lk != 55                // 'return'
         && lk != 56                // 'test'
         && lk != 57                // 'throw'
         && lk != 58                // 'try'
         && lk != 59                // 'while'
         && lk != 60                // '{'
         && lk != 61                // '|'
         && lk != 62                // '||'
         && lk != 63                // '|||'
         && lk != 64                // '||||'
         && lk != 65                // '}'
         && lk != 66                // '~'
         && lk != 3493              // '[' ';'
         && lk != 4901              // '[' ']'
         && lk != 442789            // '[' identifier ';'
         && lk != 442917            // '[' null ';'
         && lk != 443045            // '[' true ';'
         && lk != 443173            // '[' false ';'
         && lk != 443301            // '[' string ';'
         && lk != 443429            // '[' complex ';'
         && lk != 443557            // '[' real ';'
         && lk != 443685            // '[' comment ';'
         && lk != 447653            // '[' 'break' ';'
         && lk != 448037)           // '[' 'continue' ';'
        {
          lk = memoized(1, e0);
          if (lk == 0)
          {
            var b0B = b0; var e0B = e0; var l1B = l1;
            var b1B = b1; var e1B = e1; var l2B = l2;
            var b2B = b2; var e2B = e2; var l3B = l3;
            var b3B = b3; var e3B = e3;
            try
            {
              consumeT(37);         // '['
              lookahead1W(16);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
              try_arguments();
              consumeT(38);         // ']'
              memoize(1, e0B, -1);
              continue;
            }
            catch (p1B)
            {
              b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
              b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
              b2 = b2B; e2 = e2B; l3 = l3B; if (l3 == 0) {end = e2B;} else {
              b3 = b3B; e3 = e3B; end = e3B; }}}
              memoize(1, e0B, -2);
              break;
            }
          }
        }
        if (lk != -1)
        {
          break;
        }
        consumeT(37);               // '['
        lookahead1W(16);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        try_arguments();
        consumeT(38);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(60);                    // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_element();
    for (;;)
    {
      lookahead1W(9);               // whitespace^token | ',' | '}'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_element();
    }
    consume(65);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(60);                   // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_element();
    for (;;)
    {
      lookahead1W(9);               // whitespace^token | ',' | '}'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_element();
    }
    consumeT(65);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(37);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
    if (l1 != 27                    // ';'
     && l1 != 38)                   // ']'
    {
      whitespace();
      parse_row();
    }
    for (;;)
    {
      if (l1 != 27)                 // ';'
      {
        break;
      }
      consume(27);                  // ';'
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_row();
    }
    consume(38);                    // ']'
    eventHandler.endNonterminal("matrix", e0);
  }

  function try_matrix()
  {
    consumeT(37);                   // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '~'
    if (l1 != 27                    // ';'
     && l1 != 38)                   // ']'
    {
      try_row();
    }
    for (;;)
    {
      if (l1 != 27)                 // ';'
      {
        break;
      }
      consumeT(27);                 // ';'
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_row();
    }
    consumeT(38);                   // ']'
  }

  function parse_element()
  {
    eventHandler.startNonterminal("element", e0);
    switch (l1)
    {
    case 7:                         // string
      lookahead2W(13);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // ':=' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' | '^' | '|' |
                                    // '||' | '|||' | '||||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 3207)                 // string ':'
    {
      parse_key();
      lookahead1W(3);               // whitespace^token | ':'
      consume(25);                  // ':'
    }
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    eventHandler.endNonterminal("element", e0);
  }

  function try_element()
  {
    switch (l1)
    {
    case 7:                         // string
      lookahead2W(13);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // ':=' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' | '^' | '|' |
                                    // '||' | '|||' | '||||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 3207)                 // string ':'
    {
      try_key();
      lookahead1W(3);               // whitespace^token | ':'
      consumeT(25);                 // ':'
    }
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
  }

  function parse_key()
  {
    eventHandler.startNonterminal("key", e0);
    consume(7);                     // string
    eventHandler.endNonterminal("key", e0);
  }

  function try_key()
  {
    consumeT(7);                    // string
  }

  function parse_row()
  {
    eventHandler.startNonterminal("row", e0);
    parse_column();
    for (;;)
    {
      lookahead1W(10);              // whitespace^token | ',' | ';' | ']'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_column();
    }
    eventHandler.endNonterminal("row", e0);
  }

  function try_row()
  {
    try_column();
    for (;;)
    {
      lookahead1W(10);              // whitespace^token | ',' | ';' | ']'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_column();
    }
  }

  function parse_column()
  {
    eventHandler.startNonterminal("column", e0);
    parse_expression();
    eventHandler.endNonterminal("column", e0);
  }

  function try_column()
  {
    try_expression();
  }

  function parse_parenthesizedExpression()
  {
    eventHandler.startNonterminal("parenthesizedExpression", e0);
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("parenthesizedExpression", e0);
  }

  function try_parenthesizedExpression()
  {
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_value()
  {
    eventHandler.startNonterminal("value", e0);
    switch (l1)
    {
    case 9:                         // real
      consume(9);                   // real
      break;
    case 8:                         // complex
      consume(8);                   // complex
      break;
    case 7:                         // string
      consume(7);                   // string
      break;
    case 60:                        // '{'
      parse_array();
      break;
    case 37:                        // '['
      parse_matrix();
      break;
    case 4:                         // null
      consume(4);                   // null
      break;
    case 5:                         // true
      consume(5);                   // true
      break;
    default:
      consume(6);                   // false
    }
    eventHandler.endNonterminal("value", e0);
  }

  function try_value()
  {
    switch (l1)
    {
    case 9:                         // real
      consumeT(9);                  // real
      break;
    case 8:                         // complex
      consumeT(8);                  // complex
      break;
    case 7:                         // string
      consumeT(7);                  // string
      break;
    case 60:                        // '{'
      try_array();
      break;
    case 37:                        // '['
      try_matrix();
      break;
    case 4:                         // null
      consumeT(4);                  // null
      break;
    case 5:                         // true
      consumeT(5);                  // true
      break;
    default:
      consumeT(6);                  // false
    }
  }

  function consume(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(MaiaScript.TOKEN[l1], b1, e1);
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function consumeT(t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
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
      if (code != 11)               // whitespace^token
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

  function lookahead2W(tokenSetId)
  {
    if (l2 == 0)
    {
      l2 = matchW(tokenSetId);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 7) | l1;
  }

  function lookahead3W(tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = matchW(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 14;
  }

  function error(b, e, s, l, t)
  {
    if (e >= ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    throw new thisParser.ParseException(bx, ex, sx, lx, tx);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var l2, b2, e2;
  var l3, b3, e3;
  var bx, ex, sx, lx, tx;
  var eventHandler;
  var memo;

  function memoize(i, e, v)
  {
    memo[(e << 1) + i] = v;
  }

  function memoized(i, e)
  {
    var v = memo[(e << 1) + i];
    return typeof v != "undefined" ? v : 0;
  }

  var input;
  var size;

  var begin;
  var end;

  function match(tokenSetId)
  {
    begin = end;
    var current = end;
    var result = MaiaScript.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 255; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = MaiaScript.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 5;
        charclass = MaiaScript.MAP1[(c0 & 31) + MaiaScript.MAP1[(c1 & 31) + MaiaScript.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
          }
        }

        var lo = 0, hi = 1;
        for (var m = 1; ; m = (hi + lo) >> 1)
        {
          if (MaiaScript.MAP2[m] > c0) hi = m - 1;
          else if (MaiaScript.MAP2[2 + m] < c0) lo = m + 1;
          else {charclass = MaiaScript.MAP2[4 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 8) + code - 1;
      code = MaiaScript.TRANSITION[(i0 & 7) + MaiaScript.TRANSITION[i0 >> 3]];

      if (code > 255)
      {
        result = code;
        code &= 255;
        end = current;
      }
    }

    result >>= 8;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    return (result & 127) - 1;
  }

}

MaiaScript.XmlSerializer = function(log, indent)
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

MaiaScript.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : MaiaScript.INITIAL[tokenSetId] & 255;
  for (var i = 0; i < 67; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 227 + s - 1;
    var i1 = i0 >> 2;
    var f = MaiaScript.EXPECTED[(i0 & 3) + MaiaScript.EXPECTED[(i1 & 3) + MaiaScript.EXPECTED[i1 >> 2]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(MaiaScript.TOKEN[j]);
      }
    }
  }
  return set;
};

MaiaScript.TopDownTreeBuilder = function()
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
    var nonterminal = new MaiaScript.Nonterminal(name, begin, begin, []);
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
    addChild(new MaiaScript.Terminal(name, begin, end));
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

MaiaScript.Terminal = function(name, begin, end)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.terminal(name, begin, end);
  };
};

MaiaScript.Nonterminal = function(name, begin, end, children)
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

MaiaScript.MAP0 =
[
  /*   0 */ 55, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
  /*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24,
  /*  64 */ 9, 6, 6, 6, 6, 25, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 26, 27, 28, 29, 6, 9, 30,
  /*  98 */ 31, 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 6, 44, 45, 46, 47, 6, 48, 6, 49, 6, 50, 51, 52,
  /* 126 */ 53, 9
];

MaiaScript.MAP1 =
[
  /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  54 */ 119, 151, 214, 183, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256,
  /*  75 */ 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 246, 256, 256, 256, 256, 256, 256, 256, 256, 256,
  /*  96 */ 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256,
  /* 117 */ 256, 256, 55, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 151 */ 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21,
  /* 180 */ 22, 23, 24, 9, 30, 31, 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 6, 44, 45, 46, 47, 6, 48, 6,
  /* 208 */ 49, 6, 50, 51, 52, 53, 9, 6, 6, 6, 6, 25, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 26,
  /* 242 */ 27, 28, 29, 6, 9, 9, 9, 9, 9, 9, 9, 9, 54, 54, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  /* 276 */ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
];

MaiaScript.MAP2 =
[
  /* 0 */ 57344, 65536, 65533, 1114111, 9, 9
];

MaiaScript.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 529, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
  /* 28 */ 540
];

MaiaScript.TRANSITION =
[
  /*    0 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*   18 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1792, 1792, 1792, 1795,
  /*   36 */ 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*   54 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1792, 1792, 1792, 1795, 2352, 1982, 2352, 2352,
  /*   72 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*   90 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1939, 1803, 1809, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352,
  /*  108 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  126 */ 2352, 2352, 2352, 2063, 1821, 1825, 2352, 1927, 2352, 3370, 2352, 2352, 2352, 1981, 2352, 2352, 2352, 2352,
  /*  144 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  162 */ 1837, 1841, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  180 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2351, 2058, 2786, 2781, 2786, 3404,
  /*  198 */ 3337, 3040, 2786, 2786, 2786, 3336, 2554, 2786, 2786, 2786, 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786,
  /*  216 */ 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 2352, 2205, 2352, 1853, 2352, 1982, 2352, 3370, 2352, 2352,
  /*  234 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  252 */ 2352, 2352, 2352, 2352, 2352, 2225, 2352, 1865, 2352, 1982, 1970, 3370, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  270 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  288 */ 2352, 2352, 2352, 2352, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  306 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1877, 1881, 1889, 1893,
  /*  324 */ 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  342 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1905, 1907, 1916, 1923, 2352, 1982, 2352, 3370,
  /*  360 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  378 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2245, 2352, 1935, 2352, 1813, 2352, 3370, 2352, 2352, 2352, 1908,
  /*  396 */ 2352, 2352, 2352, 2352, 2352, 1947, 2352, 2352, 2352, 1869, 1951, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  414 */ 2352, 2352, 2352, 2068, 1960, 1966, 2352, 3374, 2352, 3370, 2352, 2352, 2352, 2352, 1978, 2352, 2352, 2352,
  /*  432 */ 2352, 1990, 2352, 2352, 2352, 2353, 1994, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2003,
  /*  450 */ 1995, 2008, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  468 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 3476, 2020, 2026, 2352, 1845,
  /*  486 */ 2352, 3370, 2352, 2352, 2352, 2352, 1978, 2352, 2352, 2352, 2352, 1990, 2352, 2352, 2352, 2353, 1994, 2352,
  /*  504 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2039, 2039, 2352, 3471, 2352, 1829, 2352, 3370, 2352, 2352,
  /*  522 */ 2352, 1952, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1952, 2038, 2352, 2352, 2352, 2352, 2352,
  /*  540 */ 2352, 2352, 2352, 2352, 2352, 2859, 2047, 2053, 2352, 1982, 2352, 3308, 2352, 2352, 2352, 1981, 2352, 2352,
  /*  558 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  576 */ 2352, 2682, 2076, 2080, 2786, 2533, 3337, 3040, 2786, 2786, 2786, 3295, 2092, 2786, 2786, 2786, 2787, 2110,
  /*  594 */ 2785, 2786, 2786, 2620, 2114, 2786, 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 3429, 2970, 2352, 3069,
  /*  612 */ 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  630 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2012, 2129, 2123, 2135, 2352, 1982, 2352, 3370,
  /*  648 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  666 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 3004, 2352, 2154, 2352, 1982, 3440, 3370, 2352, 2352, 2352, 2352,
  /*  684 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  702 */ 2352, 2352, 2352, 3512, 2352, 2173, 2352, 1982, 2372, 2193, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  720 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 3055,
  /*  738 */ 2352, 2213, 2352, 1982, 2352, 2233, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  756 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2185, 2352, 3500, 2352, 1982,
  /*  774 */ 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  792 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2351, 2058, 2786, 2781, 2786, 2451, 3337, 3040, 2786, 2786,
  /*  810 */ 2786, 2501, 2554, 2786, 2786, 2786, 2787, 2456, 2785, 2786, 2786, 2409, 2253, 2786, 2786, 2786, 2786, 2786,
  /*  828 */ 3337, 2352, 2352, 2352, 2352, 3453, 2262, 2266, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  846 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  864 */ 2352, 2352, 2352, 2352, 2352, 1857, 2352, 3370, 2352, 2352, 2352, 1981, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  882 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2274, 3080, 2280,
  /*  900 */ 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  918 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 3114, 2352, 2297, 2352, 1982, 2352, 3370,
  /*  936 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /*  954 */ 2352, 2352, 2352, 2352, 2352, 2352, 3438, 3434, 2325, 2329, 2341, 3404, 2349, 3145, 2361, 2380, 2786, 3336,
  /*  972 */ 2554, 2786, 2382, 2707, 2787, 2552, 2390, 2786, 2810, 3337, 3044, 2786, 2786, 2786, 2398, 2786, 3337, 2352,
  /*  990 */ 2352, 2352, 3078, 3074, 2422, 2426, 2786, 3404, 3337, 3040, 2786, 2786, 2786, 3403, 2554, 2786, 2786, 2786,
  /* 1008 */ 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786, 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 2144, 2140,
  /* 1026 */ 2438, 2446, 2786, 3404, 3337, 3040, 2786, 2786, 3163, 3336, 2554, 2944, 2786, 2468, 2787, 2552, 2084, 3015,
  /* 1044 */ 2786, 3337, 2486, 2786, 2848, 2786, 2669, 2497, 3337, 2352, 2352, 2352, 2163, 2159, 2509, 2513, 2786, 3404,
  /* 1062 */ 3337, 3040, 2786, 2786, 2786, 3336, 2554, 2786, 2786, 2786, 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786,
  /* 1080 */ 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 2182, 2178, 2521, 2528, 3264, 2541, 2549, 3040, 3093, 2478,
  /* 1098 */ 2786, 2501, 2554, 2562, 2786, 2404, 2571, 2414, 2333, 2582, 2707, 2959, 2599, 2609, 2786, 2786, 2786, 2628,
  /* 1116 */ 3337, 2352, 2352, 2352, 2643, 2302, 2654, 2658, 2932, 3404, 3337, 3040, 2666, 2786, 2786, 3403, 2554, 2786,
  /* 1134 */ 2786, 2786, 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786, 2786, 3246, 2786, 2786, 3337, 2352, 2352, 2352,
  /* 1152 */ 2351, 2058, 2786, 2781, 2786, 2677, 2695, 3040, 2115, 2706, 2786, 3336, 2554, 2786, 2786, 2786, 2787, 2552,
  /* 1170 */ 2785, 2786, 2589, 3337, 2785, 2748, 2786, 2786, 3291, 2786, 3337, 2352, 2352, 2352, 2202, 2198, 2715, 2719,
  /* 1188 */ 2786, 3404, 3337, 3040, 2786, 2786, 2786, 3365, 2727, 2786, 3399, 2786, 2787, 2552, 2785, 2786, 2615, 3337,
  /* 1206 */ 2460, 2838, 2745, 2756, 2786, 2786, 3337, 2352, 2352, 2352, 2222, 2218, 2765, 2769, 2786, 3404, 3337, 3040,
  /* 1224 */ 2786, 2786, 2786, 3336, 2554, 2786, 2786, 2786, 2787, 2552, 2785, 2786, 2590, 3337, 2777, 2786, 2786, 2786,
  /* 1242 */ 2786, 2786, 3337, 2352, 2352, 2352, 2242, 2238, 2795, 2799, 3261, 3404, 3337, 3040, 2786, 2807, 2818, 3336,
  /* 1260 */ 2317, 2786, 2786, 2786, 2635, 2646, 2785, 3175, 2786, 3337, 2785, 2836, 2786, 2846, 2786, 2786, 3337, 2352,
  /* 1278 */ 2352, 2352, 2351, 2058, 2786, 2781, 2786, 3404, 3337, 3040, 2786, 2786, 2882, 3336, 2554, 3234, 2786, 2786,
  /* 1296 */ 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786, 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 2856, 2307,
  /* 1314 */ 2867, 2871, 2786, 3404, 3337, 3040, 2786, 3103, 2879, 3403, 2554, 2890, 3347, 2489, 2787, 2552, 2902, 2786,
  /* 1332 */ 2786, 3337, 2785, 2786, 2921, 2928, 2786, 2941, 3337, 2352, 2352, 2352, 2351, 2058, 2786, 2781, 2952, 3404,
  /* 1350 */ 2967, 3188, 2978, 2991, 2786, 3336, 2554, 2786, 2786, 2786, 3132, 2552, 2785, 2474, 2786, 3337, 2785, 2786,
  /* 1368 */ 2786, 2601, 2102, 2993, 3001, 2352, 2352, 2352, 2351, 2058, 2786, 2781, 2786, 3404, 3337, 3040, 2786, 2786,
  /* 1386 */ 2786, 3336, 2554, 2786, 2786, 2786, 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786, 3159, 3012, 2786, 2786,
  /* 1404 */ 3337, 2352, 2352, 2352, 3509, 3505, 3023, 3027, 2786, 3035, 3052, 3212, 2254, 2786, 2909, 3063, 2554, 3088,
  /* 1422 */ 3101, 2786, 2787, 2552, 2785, 2786, 2786, 3111, 2785, 3128, 3122, 2786, 2786, 2786, 2825, 2352, 2352, 2352,
  /* 1440 */ 2351, 2058, 2786, 2894, 2786, 3404, 3337, 3277, 2786, 2563, 2786, 3140, 2554, 2786, 3153, 3171, 2787, 2698,
  /* 1458 */ 2098, 2786, 2786, 3183, 2785, 3196, 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 3207, 2312, 3220, 3224,
  /* 1476 */ 2786, 3404, 3337, 3040, 2786, 2810, 2591, 3403, 2554, 2757, 2913, 3232, 2933, 2552, 2733, 3242, 3254, 3337,
  /* 1494 */ 2430, 2786, 2786, 2786, 2786, 2737, 3337, 2352, 2352, 2352, 2351, 2058, 2786, 2781, 2983, 3404, 3272, 3040,
  /* 1512 */ 3285, 2786, 2786, 3303, 2687, 2786, 3321, 2786, 3333, 2552, 2785, 3345, 2786, 3337, 2785, 2786, 2786, 3199,
  /* 1530 */ 3355, 2786, 3337, 2352, 2352, 2352, 2289, 2285, 3382, 3386, 2786, 3404, 3337, 3040, 2786, 2786, 2786, 3336,
  /* 1548 */ 2554, 2786, 2786, 2786, 2787, 2552, 2785, 2786, 2786, 2367, 2785, 3325, 2786, 2786, 2786, 2786, 3337, 2352,
  /* 1566 */ 2352, 2352, 2351, 2058, 2786, 2781, 2786, 3404, 3337, 3040, 2786, 3360, 2786, 2574, 3313, 2786, 3394, 2786,
  /* 1584 */ 2787, 2552, 2785, 2786, 2786, 3337, 2785, 2786, 2786, 2786, 2786, 2786, 3337, 2352, 2352, 2352, 2146, 3466,
  /* 1602 */ 3412, 3416, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /* 1620 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2828, 2352, 3424, 2352, 1982,
  /* 1638 */ 2352, 3448, 2352, 2352, 2352, 2352, 2165, 2352, 2352, 2352, 2352, 2352, 3461, 2352, 2352, 2352, 2352, 2352,
  /* 1656 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 3484, 3486, 3494, 2352, 1982, 2352, 3370, 2352, 2352,
  /* 1674 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /* 1692 */ 2352, 2352, 2352, 2352, 2352, 2030, 3520, 3524, 2352, 1982, 2352, 3370, 2352, 2352, 2352, 2352, 2352, 2352,
  /* 1710 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /* 1728 */ 2352, 2352, 2352, 2352, 2352, 1982, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /* 1746 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 1897, 2352,
  /* 1764 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352,
  /* 1782 */ 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 2352, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101,
  /* 1800 */ 0, 0, 0, 3328, 3328, 3328, 3328, 3328, 3328, 3328, 3328, 3380, 3380, 0, 0, 0, 0, 45, 0, 0, 97, 45, 45, 45,
  /* 1824 */ 45, 45, 45, 45, 45, 0, 0, 0, 0, 45, 0, 0, 98, 2876, 2876, 2876, 2876, 2876, 2876, 2876, 2876, 0, 0, 0, 0,
  /* 1849 */ 45, 95, 95, 46, 0, 0, 3840, 3840, 0, 0, 0, 0, 94, 0, 0, 0, 0, 0, 4149, 4149, 0, 0, 0, 0, 97, 0, 97, 97, 0,
  /* 1878 */ 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 0, 0, 0, 0,
  /* 1901 */ 768, 0, 0, 0, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 97, 0, 4864, 0, 0, 0, 4864, 0, 4864, 4864, 4864, 4864, 0, 0,
  /* 1929 */ 0, 0, 2048, 0, 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 3328, 52, 52, 52, 0, 0, 97, 0, 97, 0, 0, 0, 0, 0, 0, 0,
  /* 1959 */ 137, 46, 46, 46, 46, 46, 46, 46, 46, 5422, 5422, 0, 0, 0, 0, 4352, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 45,
  /* 1987 */ 0, 0, 0, 0, 174, 46, 0, 46, 0, 0, 0, 0, 0, 0, 0, 5632, 0, 5632, 5632, 0, 0, 5632, 5632, 5632, 5632, 0, 0,
  /* 2014 */ 0, 0, 7168, 0, 0, 0, 47, 47, 47, 47, 47, 47, 47, 47, 5935, 5935, 0, 0, 0, 0, 17152, 0, 0, 0, 137, 0, 0, 0,
  /* 2042 */ 0, 0, 0, 0, 6144, 61, 61, 61, 61, 61, 61, 61, 61, 6461, 6461, 0, 0, 0, 0, 1054, 1054, 0, 0, 0, 45, 45, 0,
  /* 2069 */ 0, 0, 46, 46, 5376, 5376, 5376, 2608, 2608, 2608, 2608, 2608, 2608, 2608, 2608, 0, 1054, 1054, 1054, 1054,
  /* 2089 */ 1208, 1054, 1054, 0, 2699, 2701, 1054, 1054, 1054, 0, 1054, 1054, 1205, 1054, 1054, 1054, 1054, 1243, 1054,
  /* 2108 */ 1054, 1054, 173, 175, 2736, 2701, 2737, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1138, 0, 0, 7168, 0, 0,
  /* 2128 */ 7168, 7168, 0, 7168, 0, 0, 0, 7168, 7168, 7168, 7168, 0, 0, 0, 0, 1057, 1057, 0, 0, 0, 0, 0, 0, 0, 15616,
  /* 2153 */ 0, 0, 0, 7479, 7479, 0, 0, 0, 0, 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 16529, 0, 0, 0, 8248, 8248, 0, 0, 0, 0,
  /* 2181 */ 1059, 1059, 0, 0, 0, 0, 0, 0, 0, 58, 58, 58, 8960, 9472, 0, 2876, 0, 0, 0, 0, 1061, 1061, 0, 0, 0, 0, 0, 0,
  /* 2209 */ 0, 3840, 3840, 3840, 0, 0, 8761, 8761, 0, 0, 0, 0, 1062, 1062, 0, 0, 0, 0, 0, 0, 0, 4149, 4149, 4149, 9216,
  /* 2234 */ 0, 0, 2876, 0, 0, 0, 0, 1063, 1063, 0, 0, 0, 0, 0, 0, 0, 5120, 5120, 5120, 138, 1054, 1054, 1054, 1054,
  /* 2258 */ 1054, 1054, 1054, 1139, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 0, 0, 0, 0, 0, 0, 9984, 0, 0, 0,
  /* 2280 */ 9984, 9984, 9984, 9984, 0, 0, 0, 0, 1067, 1067, 0, 0, 0, 0, 44, 0, 0, 0, 0, 10240, 10240, 0, 0, 0, 0, 1073,
  /* 2306 */ 1073, 0, 0, 0, 1074, 1074, 0, 0, 0, 1075, 1075, 0, 0, 0, 1166, 1167, 1054, 0, 1054, 1086, 1086, 1086, 1086,
  /* 2329 */ 1086, 1086, 1086, 1086, 0, 1054, 1054, 1054, 1207, 1054, 1054, 1054, 1102, 1054, 1054, 1105, 1054, 1054,
  /* 2347 */ 1054, 1110, 1124, 1110, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 46, 1054, 1124, 1054, 1054, 1054, 1135, 1054, 1054,
  /* 2369 */ 30, 0, 0, 0, 0, 0, 3584, 0, 6912, 7936, 8448, 1054, 1141, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1185,
  /* 2390 */ 0, 1054, 1204, 1054, 1054, 1054, 1054, 1210, 1240, 1054, 1054, 1054, 1054, 1244, 1054, 1054, 165, 1054,
  /* 2408 */ 1190, 1054, 1054, 1054, 0, 138, 0, 0, 99, 0, 0, 1054, 1054, 1566, 1087, 1087, 1087, 1087, 1087, 1087, 1087,
  /* 2429 */ 1087, 0, 1054, 1054, 1054, 1222, 1054, 1054, 1225, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 1098,
  /* 2447 */ 1088, 1088, 1088, 0, 1054, 1054, 1054, 0, 45, 0, 0, 99, 0, 0, 1054, 1054, 1054, 1054, 1223, 1054, 1054,
  /* 2468 */ 1186, 1054, 1054, 1054, 1054, 1191, 1054, 1054, 1054, 1213, 1054, 1054, 1054, 1054, 1144, 1054, 1054, 1054,
  /* 2486 */ 0, 1054, 10526, 1054, 1054, 1054, 1054, 1054, 1054, 1192, 1054, 1246, 1054, 1054, 1247, 1054, 1054, 1054,
  /* 2504 */ 1054, 0, 0, 0, 138, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054, 1059, 1059, 1059,
  /* 2524 */ 1059, 1059, 1059, 1059, 1059, 1099, 1059, 1059, 0, 1054, 1054, 1054, 0, 45, 96, 2608, 2608, 1112, 1113,
  /* 2543 */ 1054, 0, 45, 0, 0, 99, 1054, 1054, 1113, 0, 0, 0, 0, 0, 1054, 1054, 1054, 0, 1054, 1171, 1054, 1054, 1054,
  /* 2566 */ 1054, 1054, 1054, 1054, 1147, 1193, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 0, 0, 1211, 1054, 1054, 1054,
  /* 2586 */ 1054, 1054, 12224, 1054, 30, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1155, 138, 1822, 1054, 1054, 1054,
  /* 2604 */ 1054, 1054, 1054, 1054, 1221, 1226, 1054, 1054, 1054, 1054, 15390, 1054, 1054, 1054, 1218, 1061, 1054,
  /* 2621 */ 1054, 1054, 0, 173, 175, 175, 2736, 1054, 11550, 1054, 1054, 1054, 1054, 14110, 1054, 30, 1054, 1054, 1054,
  /* 2640 */ 1054, 1158, 172, 1060, 0, 0, 0, 0, 0, 0, 0, 1054, 1310, 1054, 1090, 1090, 1090, 1090, 1090, 1090, 1090,
  /* 2661 */ 1090, 0, 1054, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054, 1054, 1054, 1054, 1245, 1158, 1054, 1114,
  /* 2679 */ 1116, 93, 45, 0, 0, 0, 2608, 2608, 0, 0, 0, 1054, 1054, 1168, 0, 1054, 1054, 1054, 1114, 0, 0, 0, 0, 0,
  /* 2703 */ 1202, 1054, 1054, 1140, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1154, 1091, 1091, 1091, 1091, 1091, 1091,
  /* 2721 */ 1091, 1091, 0, 1054, 1054, 1054, 2304, 0, 0, 1054, 1054, 1054, 0, 1054, 1054, 1206, 1054, 1054, 1054, 1054,
  /* 2741 */ 1248, 1249, 1054, 1054, 1054, 1054, 1232, 1054, 1054, 1054, 1054, 1054, 1054, 11038, 1054, 1237, 1054,
  /* 2758 */ 1054, 1054, 1054, 1054, 1054, 1054, 1178, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 0, 1054, 1054,
  /* 2776 */ 1054, 0, 1054, 1054, 10782, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0,
  /* 2795 */ 1093, 1093, 1093, 1093, 1093, 1093, 1093, 1093, 0, 1054, 1054, 1054, 1054, 1054, 1142, 1054, 1054, 1054,
  /* 2813 */ 1054, 1054, 1145, 1054, 1054, 1148, 1054, 1054, 1054, 1054, 1054, 1154, 1054, 30, 11294, 0, 0, 0, 0, 0,
  /* 2833 */ 15931, 15931, 15931, 1054, 13854, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1229, 1054, 13598, 1054, 1054,
  /* 2850 */ 1054, 1054, 1054, 1054, 1054, 1236, 1064, 0, 0, 0, 0, 0, 0, 0, 6400, 6400, 6400, 1094, 1094, 1094, 1094,
  /* 2871 */ 1094, 1094, 1094, 1094, 0, 1054, 1054, 1054, 1054, 1054, 1150, 1054, 1054, 1054, 1054, 1054, 1153, 1054,
  /* 2889 */ 1054, 1054, 1172, 1054, 1174, 1054, 1054, 1054, 1054, 0, 1054, 1100, 1054, 0, 1203, 1054, 1054, 1054, 1054,
  /* 2908 */ 1209, 1054, 125, 1054, 1151, 1054, 1054, 1054, 1054, 1182, 1054, 1054, 1054, 1054, 1231, 1054, 1054, 30,
  /* 2926 */ 1054, 1235, 1054, 1054, 1054, 14366, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1054, 0, 1054, 1054, 13086,
  /* 2944 */ 1054, 1054, 1054, 1054, 1054, 1176, 1054, 1054, 1103, 30, 1054, 1106, 1054, 1054, 1109, 1054, 1054, 1054,
  /* 2962 */ 15360, 138, 0, 0, 99, 1106, 1054, 1054, 0, 0, 0, 0, 0, 6710, 54, 54, 11806, 1131, 1054, 1054, 1134, 1054,
  /* 2984 */ 1054, 1054, 1107, 1054, 1054, 1054, 1111, 1054, 1130, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1250, 1251,
  /* 3002 */ 1054, 1054, 0, 0, 0, 0, 0, 7479, 7479, 7479, 1054, 1054, 1238, 1054, 1054, 1054, 1054, 1054, 1215, 1054,
  /* 3022 */ 30, 1095, 1095, 1095, 1095, 1095, 1095, 1095, 1095, 0, 1054, 1054, 1101, 1054, 1115, 1054, 0, 45, 0, 0, 0,
  /* 3043 */ 2876, 0, 1054, 1054, 1054, 1054, 1054, 1224, 1054, 1054, 1054, 1126, 0, 0, 0, 0, 0, 8761, 8761, 8761, 1054,
  /* 3064 */ 1157, 1054, 1054, 0, 45, 0, 0, 54, 54, 0, 0, 0, 0, 1056, 1056, 0, 0, 0, 0, 0, 0, 0, 9984, 9984, 1054, 1054,
  /* 3090 */ 12693, 1054, 1175, 1054, 1054, 1054, 1133, 1054, 1054, 1136, 1137, 1054, 1180, 1054, 1054, 1054, 1054,
  /* 3107 */ 1054, 1054, 1146, 1054, 1054, 1221, 1054, 0, 0, 0, 0, 0, 10240, 10240, 10240, 1230, 1054, 1054, 1054, 1054,
  /* 3127 */ 1234, 1054, 1054, 1054, 1228, 1054, 1054, 1054, 1054, 1195, 1054, 1054, 0, 1156, 1054, 1054, 1054, 0, 0, 0,
  /* 3147 */ 0, 2876, 0, 1054, 1054, 1102, 1179, 1054, 1054, 1054, 1054, 1183, 1054, 1054, 1054, 1233, 1054, 1054, 1054,
  /* 3166 */ 1054, 1152, 1054, 1054, 1054, 1054, 1187, 1054, 1158, 1054, 1054, 1054, 1054, 1214, 1054, 1054, 1054, 1220,
  /* 3184 */ 1054, 1054, 0, 0, 0, 0, 0, 2876, 0, 1054, 1054, 1130, 1054, 1054, 1227, 1054, 1054, 1054, 1054, 1054, 1239,
  /* 3205 */ 1158, 1054, 1066, 0, 0, 0, 0, 0, 0, 0, 2876, 0, 1054, 1129, 1054, 1096, 1096, 1096, 1096, 1096, 1096, 1096,
  /* 3227 */ 1096, 0, 1054, 1054, 1054, 1054, 1188, 1054, 1054, 1054, 1054, 1054, 1054, 1177, 1054, 1054, 1054, 14622,
  /* 3245 */ 1054, 1054, 1054, 1054, 1054, 12318, 1054, 1054, 1054, 1054, 1054, 1217, 1054, 1054, 1054, 1219, 1054,
  /* 3262 */ 1054, 1104, 1054, 1054, 1054, 1054, 1054, 1108, 1054, 1054, 1107, 1125, 1054, 0, 0, 0, 0, 0, 2876, 0, 1128,
  /* 3283 */ 1054, 1054, 1054, 1132, 1054, 1054, 1054, 1125, 1054, 1054, 1054, 12830, 1054, 1054, 1054, 1054, 0, 0, 96,
  /* 3302 */ 96, 1054, 1054, 1158, 1054, 0, 0, 0, 0, 2876, 2876, 0, 0, 0, 1054, 1054, 30, 0, 1170, 1054, 1054, 1168,
  /* 3324 */ 1054, 1054, 1054, 1054, 1054, 14878, 1054, 1054, 1054, 1054, 1054, 1194, 1054, 1054, 1054, 1054, 0, 0, 0,
  /* 3343 */ 0, 0, 1054, 1212, 1054, 1054, 1054, 1054, 1054, 1054, 1184, 1054, 1054, 1241, 1242, 1054, 1054, 1054, 1054,
  /* 3362 */ 1054, 1143, 1054, 1054, 1054, 1054, 1159, 136, 0, 0, 0, 2876, 0, 0, 0, 0, 45, 0, 0, 46, 1097, 1097, 1097,
  /* 3385 */ 1097, 1097, 1097, 1097, 1097, 0, 1054, 1054, 1054, 1054, 1054, 15134, 1054, 1054, 1054, 1054, 1054, 1181,
  /* 3403 */ 1054, 1054, 1054, 1054, 0, 45, 0, 0, 0, 15616, 15616, 15616, 15616, 15616, 15616, 15616, 15616, 0, 0, 0, 0,
  /* 3424 */ 0, 0, 15931, 15931, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 1055, 1055, 0, 0, 0, 0, 0, 0, 0, 7680, 0, 0, 0, 16231,
  /* 3451 */ 2876, 0, 0, 0, 0, 9728, 9728, 0, 0, 9728, 16640, 0, 0, 0, 0, 0, 0, 0, 15616, 15616, 0, 0, 0, 6144, 0, 0, 0,
  /* 3478 */ 0, 47, 47, 5888, 5888, 5888, 0, 16896, 0, 0, 0, 16896, 0, 0, 0, 0, 16896, 16896, 16896, 16896, 0, 0, 0, 0,
  /* 3502 */ 58, 58, 0, 0, 0, 0, 1065, 1065, 0, 0, 0, 0, 0, 0, 0, 8248, 8248, 8248, 17152, 17152, 17152, 17152, 17152,
  /* 3525 */ 17152, 17152, 17152, 0, 0, 0, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 43, 47, 57, 51, 55, 69, 61, 67, 76, 73, 63, 80, 68, 68, 84, 88, 148, 92, 96, 143, 105, 100, 149, 109, 113,
  /*  25 */ 117, 121, 125, 129, 133, 137, 142, 147, 142, 138, 142, 142, 103, 142, 142, 142, 142, 105, 153, 157, 161,
  /*  46 */ 165, 169, 173, 177, 302, 213, 186, 246, 195, 200, 220, 196, 196, 303, 181, 182, 206, 196, 196, 303, 344,
  /*  67 */ 202, 196, 196, 196, 196, 342, 208, 196, 196, 196, 303, 345, 212, 217, 196, 196, 196, 303, 274, 265, 237,
  /*  88 */ 224, 227, 230, 234, 274, 274, 295, 241, 191, 250, 262, 272, 283, 256, 273, 274, 243, 274, 274, 189, 279,
  /* 109 */ 274, 289, 281, 285, 293, 274, 274, 268, 274, 299, 325, 253, 258, 274, 324, 307, 274, 324, 313, 311, 321,
  /* 130 */ 315, 274, 275, 317, 329, 335, 331, 339, 274, 274, 274, 245, 274, 274, 274, 274, 267, 245, 274, 274, 274,
  /* 151 */ 268, 274, 2056, 133120, 264192, 33556480, 134219776, 2048, 2048, 8521728, 134481920, 2099200, 136316928,
  /* 164 */ 134136, 138232, -143005696, -42342400, -33822720, 139256, 401400, 134356984, 139256, 139260, 134619128,
  /* 175 */ 134356984, 2498552, 136716280, 136716280, -41943048, -33554440, 128, 256, 768, 768, 72, 65536, 67108864,
  /* 188 */ 1610612736, 0, 0x80000000, 256, 512, 6144, 8192, 1024, 8, 8, 8, 8, 8, 72, 8, 8, 40, 8, 24, 40, 0, 8, 8, 8,
  /* 212 */ 768, 72, 24, 40, 8192, 768, 72, 8, 8, 24, 8, 40, -536870753, -536870689, -536870657, 536820512, 536820512,
  /* 229 */ 536820512, 536820512, 536820576, 536820576, 536821600, 536869728, -50177, -50177, 0, 64, 268435488,
  /* 240 */ 268435488, 16, -1073741824, 0, 0, 1, 0, 0, 0, 1024, 458752, 524288, 1048576, 2097152, 4194304, 8388608,
  /* 256 */ 33554432, 67108864, 134217728, 1024, 32768, 0, 4194304, 8388608, 117440512, 134217728, 268435456, 0, 0, 0,
  /* 270 */ 134217728, 0, 7168, 49152, 0, 0, 0, 0, 2, 6144, 196608, 262144, 1048576, 2097152, 4194304, 8388608,
  /* 286 */ 16777216, 33554432, 134217728, 256, 512, 6144, 131072, 1024, 49152, 0, 0, 1, 12, 0, 256, 512, 2048, 8, 8, 8,
  /* 306 */ 0, 1048576, 4194304, 8388608, 32768, 4096, 262144, 4194304, 0, 0, 2048, 0, 0, 4, 3, 2048, 4194304, 0, 2048,
  /* 325 */ 4096, 131072, 262144, 1048576, 1, 1, 4, 4, 6, 6, 4, 6, 4, 4, 7, 7, 0, 0, 128, 256, 256, 256, 768, 768
];

MaiaScript.TOKEN =
[
  "(0)",
  "END",
  "eof",
  "identifier",
  "'null'",
  "'true'",
  "'false'",
  "string",
  "complex",
  "real",
  "comment",
  "whitespace",
  "'!'",
  "'!='",
  "'%'",
  "'&'",
  "'&&'",
  "'('",
  "')'",
  "'*'",
  "'+'",
  "','",
  "'-'",
  "'.'",
  "'/'",
  "':'",
  "':='",
  "';'",
  "'<'",
  "'<<'",
  "'<='",
  "'='",
  "'=='",
  "'>'",
  "'>='",
  "'>>'",
  "'?='",
  "'['",
  "']'",
  "'^'",
  "'async'",
  "'break'",
  "'catch'",
  "'constructor'",
  "'continue'",
  "'do'",
  "'else'",
  "'elseif'",
  "'for'",
  "'foreach'",
  "'function'",
  "'if'",
  "'kernel'",
  "'local'",
  "'namespace'",
  "'return'",
  "'test'",
  "'throw'",
  "'try'",
  "'while'",
  "'{'",
  "'|'",
  "'||'",
  "'|||'",
  "'||||'",
  "'}'",
  "'~'"
];

// End
