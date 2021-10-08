// This file was generated on Fri Oct 8, 2021 16:22 (UTC-03) by REx v5.54 which is Copyright (c) 1979-2021 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -javascript -tree -backtrack

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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
      if (l1 != 63)                 // '||'
      {
        break;
      }
      consume(63);                  // '||'
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
      if (l1 != 63)                 // '||'
      {
        break;
      }
      consumeT(63);                 // '||'
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
      if (l1 != 65)                 // '||||'
      {
        break;
      }
      consume(65);                  // '||||'
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
      if (l1 != 65)                 // '||||'
      {
        break;
      }
      consumeT(65);                 // '||||'
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
      if (l1 != 62)                 // '|'
      {
        break;
      }
      consume(62);                  // '|'
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
      if (l1 != 62)                 // '|'
      {
        break;
      }
      consumeT(62);                 // '|'
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
      if (l1 != 64)                 // '|||'
      {
        break;
      }
      consume(64);                  // '|||'
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
      if (l1 != 64)                 // '|||'
      {
        break;
      }
      consumeT(64);                 // '|||'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
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
    case 67:                        // '~'
      consume(67);                  // '~'
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
    case 67:                        // '~'
      consumeT(67);                 // '~'
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
    case 55:                        // 'object'
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
    case 60:                        // 'while'
      parse_while();
      break;
    case 48:                        // 'for'
      parse_for();
      break;
    case 49:                        // 'foreach'
      parse_foreach();
      break;
    case 59:                        // 'try'
      parse_try();
      break;
    case 57:                        // 'test'
      parse_test();
      break;
    case 41:                        // 'break'
      parse_break();
      break;
    case 44:                        // 'continue'
      parse_continue();
      break;
    case 56:                        // 'return'
      parse_return();
      break;
    case 58:                        // 'throw'
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
    case 55:                        // 'object'
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
    case 60:                        // 'while'
      try_while();
      break;
    case 48:                        // 'for'
      try_for();
      break;
    case 49:                        // 'foreach'
      try_foreach();
      break;
    case 59:                        // 'try'
      try_try();
      break;
    case 57:                        // 'test'
      try_test();
      break;
    case 41:                        // 'break'
      try_break();
      break;
    case 44:                        // 'continue'
      try_continue();
      break;
    case 56:                        // 'return'
      try_return();
      break;
    case 58:                        // 'throw'
      try_throw();
      break;
    default:
      try_function();
    }
  }

  function parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
    switch (l1)
    {
    case 54:                        // 'namespace'
      consume(54);                  // 'namespace'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consume(61);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(66);                  // '}'
      break;
    default:
      consume(55);                  // 'object'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consume(61);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(66);                  // '}'
    }
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    switch (l1)
    {
    case 54:                        // 'namespace'
      consumeT(54);                 // 'namespace'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(61);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(66);                 // '}'
      break;
    default:
      consumeT(55);                 // 'object'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(61);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(66);                 // '}'
    }
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(61);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(66);                  // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(61);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(66);                  // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(61);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(66);                  // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(61);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(66);                  // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(61);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(66);                 // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(61);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(66);                 // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(61);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(66);                 // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(61);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
        if (l1 == 66)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(66);                 // '}'
    }
  }

  function parse_local()
  {
    eventHandler.startNonterminal("local", e0);
    consume(53);                    // 'local'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(46);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(46);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(45);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(60);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(60);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(60);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(60);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(59);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(59);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(57);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(57);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
        if (l1 != 18)               // ')'
        {
          try_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(61);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(66);                    // '}'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(61);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
      if (l1 == 66)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(66);                   // '}'
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
    consume(56);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    consumeT(56);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    consume(58);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    consumeT(58);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    case 61:                        // '{'
    case 67:                        // '~'
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
    case 61:                        // '{'
    case 67:                        // '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
     || lk == 903299                // identifier '(' 'object'
     || lk == 919683                // identifier '(' 'return'
     || lk == 936067                // identifier '(' 'test'
     || lk == 952451                // identifier '(' 'throw'
     || lk == 968835                // identifier '(' 'try'
     || lk == 985219                // identifier '(' 'while'
     || lk == 1001603               // identifier '(' '{'
     || lk == 1099907)              // identifier '(' '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8613:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7589:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6821:                // '[' 'local'
          case 7845:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
          case 5157:                // '[' 'async'
          case 5541:                // '[' 'constructor'
          case 6437:                // '[' 'function'
          case 6693:                // '[' 'kernel'
          case 6949:                // '[' 'namespace'
          case 7077:                // '[' 'object'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 6181:                // '[' 'for'
          case 6309:                // '[' 'foreach'
          case 6565:                // '[' 'if'
          case 7205:                // '[' 'return'
          case 7333:                // '[' 'test'
          case 7461:                // '[' 'throw'
          case 7717:                // '[' 'while'
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
         && lk != 55                // 'object'
         && lk != 56                // 'return'
         && lk != 57                // 'test'
         && lk != 58                // 'throw'
         && lk != 59                // 'try'
         && lk != 60                // 'while'
         && lk != 61                // '{'
         && lk != 62                // '|'
         && lk != 63                // '||'
         && lk != 64                // '|||'
         && lk != 65                // '||||'
         && lk != 66                // '}'
         && lk != 67                // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
     || lk == 903299                // identifier '(' 'object'
     || lk == 919683                // identifier '(' 'return'
     || lk == 936067                // identifier '(' 'test'
     || lk == 952451                // identifier '(' 'throw'
     || lk == 968835                // identifier '(' 'try'
     || lk == 985219                // identifier '(' 'while'
     || lk == 1001603               // identifier '(' '{'
     || lk == 1099907)              // identifier '(' '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
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
                                    // 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8613:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7589:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6821:                // '[' 'local'
          case 7845:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
          case 5157:                // '[' 'async'
          case 5541:                // '[' 'constructor'
          case 6437:                // '[' 'function'
          case 6693:                // '[' 'kernel'
          case 6949:                // '[' 'namespace'
          case 7077:                // '[' 'object'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 6181:                // '[' 'for'
          case 6309:                // '[' 'foreach'
          case 6565:                // '[' 'if'
          case 7205:                // '[' 'return'
          case 7333:                // '[' 'test'
          case 7461:                // '[' 'throw'
          case 7717:                // '[' 'while'
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
         && lk != 55                // 'object'
         && lk != 56                // 'return'
         && lk != 57                // 'test'
         && lk != 58                // 'throw'
         && lk != 59                // 'try'
         && lk != 60                // 'while'
         && lk != 61                // '{'
         && lk != 62                // '|'
         && lk != 63                // '||'
         && lk != 64                // '|||'
         && lk != 65                // '||||'
         && lk != 66                // '}'
         && lk != 67                // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
        try_arguments();
        consumeT(38);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(61);                    // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      whitespace();
      parse_element();
    }
    consume(66);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(61);                   // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
      try_element();
    }
    consumeT(66);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(37);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
      whitespace();
      parse_key();
      lookahead1W(3);               // whitespace^token | ':'
      consume(25);                  // ':'
    }
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '~'
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
    case 61:                        // '{'
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
    case 61:                        // '{'
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
  for (var i = 0; i < 68; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 236 + s - 1;
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
  /*   0 */ 56, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
  /*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24,
  /*  64 */ 9, 6, 6, 6, 6, 25, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 26, 27, 28, 29, 6, 9, 30,
  /*  98 */ 31, 32, 33, 34, 35, 6, 36, 37, 38, 39, 40, 41, 42, 43, 44, 6, 45, 46, 47, 48, 6, 49, 6, 50, 6, 51, 52, 53,
  /* 126 */ 54, 9
];

MaiaScript.MAP1 =
[
  /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  54 */ 119, 151, 214, 183, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256,
  /*  75 */ 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 246, 256, 256, 256, 256, 256, 256, 256, 256, 256,
  /*  96 */ 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256,
  /* 117 */ 256, 256, 56, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 151 */ 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21,
  /* 180 */ 22, 23, 24, 9, 30, 31, 32, 33, 34, 35, 6, 36, 37, 38, 39, 40, 41, 42, 43, 44, 6, 45, 46, 47, 48, 6, 49, 6,
  /* 208 */ 50, 6, 51, 52, 53, 54, 9, 6, 6, 6, 6, 25, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 26,
  /* 242 */ 27, 28, 29, 6, 9, 9, 9, 9, 9, 9, 9, 9, 55, 55, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
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
  /*    0 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*   18 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1824, 1824, 1824, 1827,
  /*   36 */ 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*   54 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1824, 1824, 1824, 1827, 1861, 3226, 1861, 1861,
  /*   72 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*   90 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 3169, 1835, 1841, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861,
  /*  108 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  126 */ 1861, 1861, 1861, 3124, 1853, 1857, 1861, 2615, 1861, 2016, 1861, 1861, 1861, 1861, 1860, 1861, 1861, 1861,
  /*  144 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  162 */ 1870, 1874, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  180 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2081, 3597, 2764, 3435, 2764, 3382,
  /*  198 */ 2078, 2034, 2764, 2764, 2764, 2765, 2233, 3438, 2764, 2764, 2764, 2776, 3132, 2764, 2764, 2764, 2080, 2764,
  /*  216 */ 2764, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 1861, 2887, 1861, 1886, 1861, 3226, 1861, 2016, 1861, 1861,
  /*  234 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  252 */ 1861, 1861, 1861, 1861, 1861, 3247, 1861, 1898, 1861, 3226, 3359, 2016, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  270 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  288 */ 1861, 1861, 1861, 1861, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  306 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1910, 1914, 1922, 1926,
  /*  324 */ 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  342 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1938, 1940, 1949, 1956, 1861, 3226, 1861, 2016,
  /*  360 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  378 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2366, 1861, 1968, 1861, 3226, 2709, 2016, 1861, 1861, 1861, 1861,
  /*  396 */ 2707, 1861, 1861, 1861, 1861, 1862, 2708, 1861, 1861, 1861, 2195, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  414 */ 1861, 1861, 1861, 2169, 1980, 1986, 1861, 3226, 1999, 2016, 1861, 1861, 1861, 1861, 2938, 1861, 1861, 1861,
  /*  432 */ 1861, 2532, 1998, 1861, 1861, 1861, 2044, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2007,
  /*  450 */ 2082, 2012, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  468 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2182, 2024, 2030, 1861, 2329,
  /*  486 */ 1999, 2016, 1861, 1861, 1861, 1861, 2938, 1861, 1861, 1861, 1861, 2532, 1998, 1861, 1861, 1861, 2044, 1861,
  /*  504 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1941, 1941, 1861, 3182, 1861, 3226, 2042, 2016, 1861, 1861,
  /*  522 */ 1861, 1861, 3223, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2214, 1861, 1861, 1861, 1861, 1861,
  /*  540 */ 1861, 1861, 1861, 1861, 1861, 3570, 2052, 2058, 1861, 3226, 1861, 2094, 1861, 1861, 1861, 1861, 1860, 1861,
  /*  558 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  576 */ 1861, 3119, 2070, 2074, 2764, 2967, 2090, 2034, 2764, 2764, 2764, 2765, 2102, 3438, 2764, 2764, 2764, 2571,
  /*  594 */ 2116, 2764, 2764, 2764, 2108, 2764, 2764, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 3165, 1845, 1861, 2392,
  /*  612 */ 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  630 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2144, 2134, 2128, 2140, 1861, 3226, 1861, 2016,
  /*  648 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  666 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1878, 1861, 2152, 1861, 3226, 2710, 2016, 1861, 1861, 1861, 1861,
  /*  684 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  702 */ 1861, 1861, 1861, 1890, 1861, 2164, 1861, 3226, 2396, 2177, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  720 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1902,
  /*  738 */ 1861, 2190, 1861, 3226, 1861, 2203, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  756 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2647, 1861, 2521, 1861, 3226,
  /*  774 */ 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  792 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2081, 3597, 2764, 3435, 2764, 3382, 2222, 2034, 2764, 2764,
  /*  810 */ 2764, 2765, 3594, 3438, 2764, 2764, 2764, 2857, 3132, 2764, 2764, 2764, 3266, 2764, 2764, 2764, 2764, 2764,
  /*  828 */ 2764, 2776, 1861, 1861, 1861, 3465, 2241, 2245, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  846 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  864 */ 1861, 1861, 1861, 1861, 1861, 2552, 1861, 2016, 1861, 1861, 1861, 1861, 1860, 1861, 1861, 1861, 1861, 1861,
  /*  882 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 2253, 2289, 2259,
  /*  900 */ 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  918 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1930, 1861, 2278, 1861, 3226, 1861, 2016,
  /*  936 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /*  954 */ 1861, 1861, 1861, 1861, 1861, 1861, 2212, 2208, 2297, 2301, 2309, 3382, 2317, 2034, 2337, 2963, 2764, 2765,
  /*  972 */ 2233, 3438, 2764, 2567, 2835, 2776, 3092, 3015, 2764, 3431, 2080, 2978, 2764, 2764, 2764, 2356, 2764, 2776,
  /*  990 */ 1861, 1861, 2530, 2526, 2374, 2378, 2764, 2386, 2078, 2034, 2907, 2764, 2764, 2765, 3128, 3438, 2764, 2764,
  /* 1008 */ 2764, 2776, 3132, 2764, 2764, 2764, 2080, 2764, 2764, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 2231, 2227,
  /* 1026 */ 2404, 2412, 2764, 3382, 2078, 2034, 2764, 2764, 3276, 2765, 2233, 3438, 2425, 3034, 2436, 2776, 3132, 2446,
  /* 1044 */ 2630, 3418, 2080, 2458, 2468, 3146, 2764, 3236, 3291, 2776, 1861, 1861, 2268, 2264, 2479, 2483, 2764, 3382,
  /* 1062 */ 2078, 2034, 2764, 2764, 2764, 2765, 2233, 3438, 2764, 2764, 2764, 2776, 3132, 2764, 2764, 2764, 2080, 2764,
  /* 1080 */ 2764, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 2287, 2283, 2491, 2498, 2787, 2515, 2540, 2034, 3484, 2560,
  /* 1098 */ 2764, 2765, 3594, 2344, 2764, 3440, 2579, 3106, 2598, 2623, 3452, 2833, 2655, 2663, 3529, 2764, 2764, 2764,
  /* 1116 */ 2671, 2776, 1861, 1861, 2679, 2875, 2689, 2693, 2450, 3382, 2078, 2034, 3480, 2764, 2764, 2765, 3128, 3438,
  /* 1134 */ 2764, 2764, 2764, 2776, 3132, 2764, 2764, 2764, 2080, 2764, 2764, 2764, 3197, 2764, 2764, 2776, 1861, 1861,
  /* 1152 */ 2081, 3597, 2764, 3435, 2764, 2701, 2603, 2034, 2764, 2718, 2764, 2765, 2233, 3438, 2764, 2764, 2764, 2776,
  /* 1170 */ 3132, 2764, 2426, 2764, 2080, 2764, 2744, 2764, 2764, 3506, 2764, 2776, 1861, 1861, 2326, 2322, 2729, 2733,
  /* 1188 */ 2764, 3382, 2078, 2034, 2764, 2764, 2764, 3348, 3088, 3438, 2438, 2764, 2764, 2776, 3132, 2764, 2764, 2741,
  /* 1206 */ 2080, 3400, 2927, 2752, 2763, 2764, 2764, 2776, 1861, 1861, 2081, 3597, 2764, 3435, 2764, 3382, 2078, 2034,
  /* 1224 */ 2764, 2764, 2764, 2773, 2233, 3438, 2784, 2764, 2764, 2776, 3132, 2764, 2764, 2764, 2080, 2764, 2764, 2764,
  /* 1242 */ 2764, 2764, 2764, 2776, 1861, 1861, 2644, 2640, 2795, 2799, 2764, 3382, 2078, 2034, 2764, 2764, 2764, 2765,
  /* 1260 */ 2233, 3438, 2764, 2764, 2764, 2776, 3132, 2764, 2427, 2764, 2080, 2807, 2764, 2764, 2764, 2764, 2764, 2776,
  /* 1278 */ 1861, 1861, 2549, 2545, 2818, 2822, 2830, 3382, 2078, 2034, 2764, 2590, 2843, 2854, 2270, 3438, 2764, 2764,
  /* 1296 */ 2449, 3320, 2865, 2764, 2895, 2764, 2080, 2764, 2906, 2764, 2915, 2764, 2764, 2776, 1861, 1861, 2081, 3597,
  /* 1314 */ 2764, 3435, 2764, 3382, 2078, 2034, 2764, 2764, 3409, 2765, 2233, 3438, 2925, 2764, 2764, 2776, 3132, 2764,
  /* 1332 */ 2764, 2764, 2080, 2764, 2764, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 2935, 3078, 2946, 2950, 2764, 3382,
  /* 1350 */ 2078, 2034, 2764, 2764, 2958, 2765, 3128, 2120, 2764, 2975, 2986, 2776, 2997, 2586, 2764, 2764, 2080, 2764,
  /* 1368 */ 2764, 3023, 3296, 2764, 3061, 2776, 1861, 1861, 2612, 2608, 3042, 3046, 3054, 3382, 3073, 2034, 3100, 2503,
  /* 1386 */ 2764, 2765, 2233, 3438, 2764, 2764, 2764, 3114, 3132, 2764, 3144, 2764, 2080, 2764, 2764, 2764, 2764, 3154,
  /* 1404 */ 2764, 3177, 1861, 1861, 2081, 3597, 2764, 3435, 2764, 3382, 2078, 2034, 2764, 2764, 2764, 2765, 2233, 3438,
  /* 1422 */ 2764, 2764, 2764, 2776, 3132, 2764, 2764, 2764, 2080, 2764, 2764, 3030, 3194, 2764, 2764, 2776, 1861, 1861,
  /* 1440 */ 2884, 2880, 3205, 3209, 2764, 3217, 2870, 3186, 2764, 3234, 2417, 3065, 3128, 3136, 2898, 2764, 2764, 2776,
  /* 1458 */ 3132, 2764, 2764, 2764, 3244, 2764, 3011, 3255, 2764, 2764, 2764, 3160, 1861, 1861, 2081, 3597, 2764, 2348,
  /* 1476 */ 2764, 3382, 2078, 2062, 2764, 2764, 3274, 3261, 2233, 3438, 2507, 3284, 2764, 2776, 3314, 3337, 2764, 2471,
  /* 1494 */ 2080, 2764, 3346, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 3356, 3083, 3367, 3371, 2764, 3382, 2078, 2034,
  /* 1512 */ 2764, 3338, 2764, 3379, 3128, 3438, 3396, 3390, 2764, 2635, 3132, 3408, 3417, 3426, 2080, 3004, 2764, 2764,
  /* 1530 */ 3448, 2764, 2989, 2776, 1861, 1861, 2081, 3597, 2764, 3435, 3306, 3382, 3460, 2034, 3473, 2764, 2764, 2846,
  /* 1548 */ 2233, 3492, 3494, 2764, 2460, 2776, 3132, 2917, 2764, 2764, 2080, 2764, 2764, 2764, 2721, 3502, 2764, 2776,
  /* 1566 */ 1861, 1861, 3329, 3325, 3514, 3518, 2764, 3382, 2078, 2034, 2764, 2764, 2764, 2765, 2233, 3438, 2764, 2764,
  /* 1584 */ 2764, 2776, 3132, 2764, 2764, 2764, 2363, 2764, 3301, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 2081, 3597,
  /* 1602 */ 2764, 3435, 2764, 3382, 2078, 2034, 2764, 2810, 2764, 2428, 2233, 3526, 2755, 2764, 2764, 2776, 3132, 2764,
  /* 1620 */ 2764, 2764, 2080, 2764, 2764, 2764, 2764, 2764, 2764, 2776, 1861, 1861, 2681, 3554, 3537, 3541, 1861, 3226,
  /* 1638 */ 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1656 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1960, 1861, 3549, 1861, 3226, 1861, 3559, 1861, 1861,
  /* 1674 */ 1861, 1861, 1861, 3567, 1861, 1861, 1861, 1861, 1972, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1692 */ 1861, 1861, 1861, 1861, 1861, 3578, 3580, 3588, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1710 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1728 */ 1861, 2156, 3605, 3609, 1861, 3226, 1861, 2016, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1746 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1764 */ 1861, 3226, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1782 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1990, 1861, 1861, 1861, 1861, 1861,
  /* 1800 */ 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861, 1861,
  /* 1818 */ 1861, 1861, 1861, 1861, 1861, 1861, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 0, 0, 0, 3328, 3328,
  /* 1837 */ 3328, 3328, 3328, 3328, 3328, 3328, 3381, 3381, 0, 0, 0, 0, 0, 6711, 55, 55, 46, 46, 46, 46, 46, 46, 46,
  /* 1860 */ 46, 0, 0, 0, 0, 0, 0, 0, 0, 100, 2877, 2877, 2877, 2877, 2877, 2877, 2877, 2877, 0, 0, 0, 0, 0, 7480, 7480,
  /* 1885 */ 7480, 0, 0, 3840, 3840, 0, 0, 0, 0, 0, 8249, 8249, 8249, 0, 0, 4150, 4150, 0, 0, 0, 0, 0, 8762, 8762, 8762,
  /* 1910 */ 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 0, 0, 0, 0,
  /* 1934 */ 0, 10240, 10240, 10240, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 6144, 0, 4864, 0, 0, 0, 4864, 0, 4864, 4864, 4864,
  /* 1959 */ 4864, 0, 0, 0, 0, 0, 16188, 16188, 16188, 0, 0, 5120, 5120, 0, 0, 0, 0, 0, 16896, 0, 0, 47, 47, 47, 47, 47,
  /* 1985 */ 47, 47, 47, 5423, 5423, 0, 0, 0, 0, 768, 0, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 0, 0, 5632, 5632, 0, 0, 5632,
  /* 2013 */ 5632, 5632, 5632, 0, 0, 0, 0, 2877, 0, 0, 0, 48, 48, 48, 48, 48, 48, 48, 48, 5936, 5936, 0, 0, 0, 0, 2877,
  /* 2039 */ 0, 1054, 1054, 101, 0, 0, 0, 0, 0, 0, 0, 47, 47, 62, 62, 62, 62, 62, 62, 62, 62, 6462, 6462, 0, 0, 0, 0,
  /* 2066 */ 2877, 0, 1131, 1054, 2609, 2609, 2609, 2609, 2609, 2609, 2609, 2609, 0, 1054, 1054, 1054, 0, 0, 0, 0, 0, 0,
  /* 2088 */ 0, 5632, 2609, 1054, 1054, 1054, 0, 0, 0, 0, 2877, 2877, 0, 0, 0, 99, 99, 0, 2704, 2706, 1054, 1054, 0,
  /* 2111 */ 180, 182, 182, 2743, 2744, 2706, 2744, 1054, 1054, 1054, 0, 1054, 1054, 1177, 1054, 1179, 1054, 0, 0, 7168,
  /* 2131 */ 0, 0, 7168, 7168, 0, 7168, 0, 0, 0, 7168, 7168, 7168, 7168, 0, 0, 0, 0, 7168, 0, 0, 0, 0, 0, 7480, 7480, 0,
  /* 2157 */ 0, 0, 0, 17408, 0, 0, 0, 0, 0, 8249, 8249, 0, 0, 0, 0, 47, 47, 5376, 5376, 5376, 8448, 8960, 9472, 0, 2877,
  /* 2182 */ 0, 0, 0, 48, 48, 5888, 5888, 5888, 0, 0, 8762, 8762, 0, 0, 0, 0, 100, 0, 100, 100, 100, 0, 9216, 0, 0,
  /* 2207 */ 2877, 0, 0, 0, 1055, 1055, 0, 0, 0, 0, 0, 0, 0, 142, 142, 102, 1054, 1054, 1054, 0, 0, 0, 0, 1057, 1057, 0,
  /* 2233 */ 0, 0, 0, 0, 0, 0, 1054, 1054, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 0, 0, 0, 0, 0, 0, 9984, 0, 0,
  /* 2258 */ 0, 9984, 9984, 9984, 9984, 0, 0, 0, 0, 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 1171, 1172, 0, 0, 10240, 10240, 0,
  /* 2283 */ 0, 0, 0, 1059, 1059, 0, 0, 0, 0, 0, 0, 0, 9984, 9984, 1087, 1087, 1087, 1087, 1087, 1087, 1087, 1087, 0,
  /* 2306 */ 1054, 1054, 1054, 1104, 1054, 1054, 1107, 1054, 1054, 1054, 1112, 0, 1127, 1112, 1054, 0, 0, 0, 0, 1061,
  /* 2326 */ 1061, 0, 0, 0, 0, 0, 0, 0, 46, 98, 98, 1104, 1054, 1127, 1054, 1054, 1054, 1138, 1054, 0, 1054, 1176, 1054,
  /* 2349 */ 1054, 1054, 1054, 0, 1054, 1102, 1054, 1054, 1249, 1054, 1054, 1054, 1054, 1253, 1054, 30, 0, 0, 0, 0, 0,
  /* 2370 */ 0, 5120, 5120, 5120, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 0, 1054, 1054, 1054, 1114, 1054, 1054,
  /* 2389 */ 1054, 0, 46, 0, 0, 55, 55, 0, 0, 0, 0, 3584, 0, 6912, 7936, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 1089,
  /* 2412 */ 1100, 1089, 1089, 1089, 0, 1054, 1054, 1054, 129, 1054, 1155, 1054, 1054, 1181, 1054, 1054, 1054, 1054,
  /* 2430 */ 1054, 1054, 1054, 30, 1054, 0, 1054, 1197, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1187, 1054, 1054,
  /* 2448 */ 1215, 1054, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 10526, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 2466 */ 1054, 1201, 1054, 1054, 1236, 1054, 1054, 1054, 1054, 1054, 1054, 1228, 1054, 1090, 1090, 1090, 1090, 1090,
  /* 2484 */ 1090, 1090, 1090, 0, 1054, 1054, 1054, 1059, 1059, 1059, 1059, 1059, 1059, 1059, 1059, 1101, 1059, 1059, 0,
  /* 2503 */ 1054, 1054, 1054, 1133, 1054, 1054, 1054, 1054, 1185, 1054, 1054, 1054, 1054, 1115, 1116, 1054, 0, 46, 0,
  /* 2522 */ 0, 59, 59, 0, 0, 0, 0, 1056, 1056, 0, 0, 0, 0, 0, 0, 0, 181, 47, 102, 1054, 1054, 1116, 0, 0, 0, 0, 1063,
  /* 2549 */ 1063, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 1140, 1141, 1054, 1054, 1054, 1054, 1148, 1054, 1054, 1054, 1191,
  /* 2571 */ 1054, 1054, 1054, 1054, 0, 180, 182, 2743, 1196, 1054, 1054, 1054, 1199, 1054, 1200, 1054, 1054, 1054,
  /* 2589 */ 1216, 1054, 1054, 1054, 1054, 1146, 1054, 1054, 1054, 0, 0, 1054, 1054, 1566, 0, 1054, 1054, 1117, 0, 0, 0,
  /* 2610 */ 0, 1065, 1065, 0, 0, 0, 0, 0, 0, 0, 2048, 0, 0, 1054, 1214, 1054, 1054, 1054, 1218, 1219, 1054, 1054, 1054,
  /* 2633 */ 1223, 1054, 30, 1054, 1054, 1054, 0, 0, 0, 0, 1062, 1062, 0, 0, 0, 0, 0, 0, 0, 59, 59, 59, 1054, 1054,
  /* 2657 */ 15616, 143, 0, 0, 102, 143, 1822, 1054, 1054, 1054, 1054, 1054, 1054, 1234, 1054, 1054, 11550, 1054, 1054,
  /* 2676 */ 1054, 1054, 14110, 1060, 0, 0, 0, 0, 0, 0, 0, 15872, 0, 1091, 1091, 1091, 1091, 1091, 1091, 1091, 1091, 0,
  /* 2698 */ 1054, 1054, 1054, 1054, 1054, 1117, 1119, 96, 46, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 7680, 1054, 1142, 1144,
  /* 2721 */ 1054, 1054, 1054, 1054, 1054, 1054, 1248, 1163, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 0, 1054,
  /* 2739 */ 1054, 1054, 1054, 1226, 1061, 1054, 1054, 1054, 1054, 1054, 1054, 11038, 1054, 1054, 1054, 1241, 1054,
  /* 2756 */ 1054, 1054, 1054, 1054, 1054, 15390, 1054, 1246, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0, 1054,
  /* 2774 */ 1159, 1054, 1054, 1054, 1054, 1054, 0, 0, 0, 0, 1054, 1054, 1183, 1054, 1054, 1054, 1054, 1054, 1110, 1054,
  /* 2794 */ 1054, 1093, 1093, 1093, 1093, 1093, 1093, 1093, 1093, 0, 1054, 1054, 1054, 1054, 1054, 10782, 1054, 1054,
  /* 2812 */ 1054, 1054, 1054, 1147, 1054, 1054, 1094, 1094, 1094, 1094, 1094, 1094, 1094, 1094, 0, 1054, 1054, 1054,
  /* 2830 */ 1054, 1054, 1106, 1054, 1054, 1054, 1054, 1054, 1158, 1054, 1054, 1054, 1054, 1054, 1054, 1152, 1054, 1054,
  /* 2848 */ 1054, 1054, 1054, 1163, 1054, 0, 1158, 1054, 1054, 1054, 1054, 1054, 1054, 0, 0, 0, 102, 0, 0, 1054, 1310,
  /* 2869 */ 1054, 0, 1054, 1054, 1129, 0, 0, 0, 0, 1074, 1074, 0, 0, 0, 1066, 1066, 0, 0, 0, 0, 0, 0, 0, 3840, 3840,
  /* 2894 */ 3840, 1054, 1054, 1222, 1054, 1054, 1054, 1054, 1054, 1186, 1054, 1054, 13854, 1054, 1054, 1054, 1054,
  /* 2911 */ 1054, 1054, 1054, 1139, 1054, 13598, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1220, 1054, 1182, 1054,
  /* 2928 */ 1054, 1054, 1054, 1054, 1054, 1054, 1238, 1064, 0, 0, 0, 0, 0, 0, 0, 145, 0, 0, 1095, 1095, 1095, 1095,
  /* 2950 */ 1095, 1095, 1095, 1095, 0, 1054, 1054, 1054, 1150, 1054, 1054, 1054, 1154, 1054, 1054, 1054, 1145, 1054,
  /* 2968 */ 1054, 1054, 1054, 0, 46, 99, 2609, 1054, 1054, 1190, 1054, 1054, 1054, 1054, 1054, 1232, 1054, 1054, 1054,
  /* 2987 */ 1054, 1198, 1054, 1054, 1054, 1054, 1054, 1257, 1258, 1054, 0, 0, 1054, 1054, 1054, 0, 1210, 1054, 1054,
  /* 3006 */ 1054, 1230, 1054, 1054, 1233, 1054, 1054, 1054, 1237, 1054, 1054, 1054, 1054, 1217, 1054, 1054, 1054, 1054,
  /* 3024 */ 1240, 1054, 1054, 30, 1054, 1244, 1054, 1054, 1054, 1242, 1054, 1054, 1054, 1054, 1192, 1054, 1054, 1054,
  /* 3042 */ 1096, 1096, 1096, 1096, 1096, 1096, 1096, 1096, 0, 1054, 1054, 1054, 1105, 30, 1054, 1108, 1054, 1054,
  /* 3060 */ 1111, 1054, 1054, 1054, 13086, 1054, 1054, 1054, 1054, 1162, 1054, 1054, 0, 0, 1108, 1054, 1054, 0, 0, 0,
  /* 3080 */ 0, 1075, 1075, 0, 0, 0, 1076, 1076, 0, 0, 0, 2304, 0, 0, 1054, 1054, 1054, 0, 1054, 1211, 1133, 11806,
  /* 3102 */ 1134, 1054, 1054, 1137, 1054, 1054, 30, 1054, 0, 0, 0, 102, 1054, 1202, 1054, 1054, 0, 0, 0, 0, 2609, 2609,
  /* 3124 */ 0, 0, 0, 46, 46, 0, 0, 0, 0, 0, 1054, 1054, 1054, 0, 1054, 1054, 1054, 12698, 1054, 1180, 1054, 1221, 1054,
  /* 3147 */ 1054, 1054, 1054, 1054, 1054, 1054, 1245, 1229, 1054, 1054, 1054, 1054, 1252, 1054, 1054, 30, 11294, 0, 0,
  /* 3166 */ 0, 0, 6656, 0, 0, 0, 0, 3328, 53, 53, 53, 1259, 1260, 1054, 1054, 0, 0, 0, 0, 6144, 0, 0, 0, 0, 2877, 0,
  /* 3192 */ 1054, 1132, 1054, 1054, 1247, 1054, 1054, 1054, 1054, 1054, 12318, 1054, 1054, 1097, 1097, 1097, 1097,
  /* 3209 */ 1097, 1097, 1097, 1097, 0, 1054, 1054, 1103, 1054, 1054, 1118, 1054, 0, 46, 0, 0, 142, 0, 0, 0, 0, 0, 46,
  /* 3232 */ 0, 0, 1054, 1143, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1254, 1229, 1054, 0, 0, 0, 0, 0, 0, 4150, 4150,
  /* 3254 */ 4150, 1239, 1054, 1054, 1054, 1054, 1243, 1054, 1054, 1054, 1161, 1054, 1054, 1054, 0, 143, 0, 0, 102, 143,
  /* 3274 */ 1054, 1151, 1054, 1054, 1054, 1054, 1054, 1054, 1156, 1054, 1054, 1189, 1054, 1054, 1054, 1193, 1054, 1163,
  /* 3292 */ 1255, 1054, 1054, 1256, 1054, 1054, 1054, 1054, 14622, 1054, 1054, 1054, 1054, 15134, 1054, 1054, 1054,
  /* 3309 */ 1109, 1054, 1054, 1054, 1113, 0, 0, 1209, 1054, 1054, 0, 1054, 1054, 1054, 1163, 179, 0, 0, 0, 1068, 1068,
  /* 3330 */ 0, 0, 0, 0, 45, 0, 0, 1212, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1149, 1054, 1235, 1054, 1054, 1054,
  /* 3351 */ 1054, 1054, 1054, 1164, 141, 1067, 0, 0, 0, 0, 0, 0, 0, 4352, 0, 0, 1098, 1098, 1098, 1098, 1098, 1098,
  /* 3373 */ 1098, 1098, 0, 1054, 1054, 1054, 1054, 1054, 1160, 1054, 1054, 1054, 1054, 0, 46, 0, 0, 1188, 1054, 1054,
  /* 3393 */ 1054, 1054, 1194, 1054, 1054, 1054, 1184, 1054, 1054, 1054, 1054, 1231, 1054, 1054, 1054, 1213, 1054, 1054,
  /* 3411 */ 1054, 1054, 1054, 1054, 1054, 1157, 14878, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1161, 1225, 1054,
  /* 3428 */ 1054, 1054, 1227, 1054, 1054, 1054, 1149, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 3446 */ 171, 1054, 1054, 1054, 1054, 14366, 1054, 1054, 1054, 1054, 12232, 1054, 1054, 1054, 0, 1109, 1128, 1054,
  /* 3464 */ 0, 0, 0, 0, 9728, 9728, 0, 0, 9728, 1054, 1054, 1135, 1054, 1054, 1054, 1128, 1054, 1054, 1054, 13342,
  /* 3484 */ 1054, 1054, 1054, 1054, 1136, 1054, 1054, 1054, 1173, 0, 1054, 1054, 1054, 1054, 1054, 1054, 1173, 1054,
  /* 3502 */ 1054, 1054, 1250, 1251, 1054, 1054, 1054, 1054, 12830, 1054, 1054, 1054, 1099, 1099, 1099, 1099, 1099,
  /* 3519 */ 1099, 1099, 1099, 0, 1054, 1054, 1054, 30, 0, 1175, 1054, 1054, 1054, 1054, 1054, 15646, 1054, 1054, 15872,
  /* 3538 */ 15872, 15872, 15872, 15872, 15872, 15872, 15872, 0, 0, 0, 0, 0, 0, 16188, 16188, 0, 0, 0, 0, 15872, 15872,
  /* 3559 */ 0, 0, 0, 16490, 2877, 0, 0, 0, 0, 16790, 0, 0, 0, 0, 0, 0, 6400, 6400, 6400, 0, 17152, 0, 0, 0, 17152, 0,
  /* 3585 */ 0, 0, 0, 17152, 17152, 17152, 17152, 0, 0, 0, 0, 143, 0, 0, 0, 1054, 1054, 0, 0, 0, 17408, 17408, 17408,
  /* 3608 */ 17408, 17408, 17408, 17408, 17408, 0, 0, 0, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 45, 49, 72, 53, 57, 61, 65, 70, 79, 66, 60, 76, 60, 60, 127, 83, 87, 89, 130, 93, 101, 120, 99, 89, 105, 95,
  /*  26 */ 147, 109, 113, 117, 124, 134, 140, 139, 140, 140, 144, 140, 135, 140, 140, 140, 140, 140, 130, 151, 155,
  /*  47 */ 159, 163, 167, 171, 175, 179, 189, 193, 276, 197, 203, 199, 218, 206, 206, 206, 206, 180, 211, 188, 215,
  /*  68 */ 206, 206, 206, 217, 206, 206, 206, 185, 181, 223, 205, 206, 206, 206, 222, 227, 307, 240, 244, 246, 250,
  /*  89 */ 276, 276, 275, 276, 291, 262, 282, 276, 276, 284, 272, 281, 276, 276, 283, 276, 325, 288, 292, 296, 297,
  /* 110 */ 276, 236, 268, 305, 235, 311, 319, 313, 317, 276, 276, 325, 266, 292, 323, 330, 207, 206, 206, 206, 276,
  /* 131 */ 254, 325, 258, 334, 276, 276, 276, 230, 277, 276, 276, 276, 276, 233, 276, 276, 276, 326, 301, 292, 2056,
  /* 152 */ 133120, 264192, 33556480, 134219776, 2048, 2048, 8521728, 134481920, 2099200, 136316928, 134136, 138232,
  /* 164 */ -143005696, -42342400, -33822720, 139256, 401400, 134356984, 139256, 139260, 134619128, 134356984, 2498552,
  /* 175 */ 136716280, 136716280, -41943048, -33554440, 2048, 8, 8, 8, 0, 256, 0, 128, 256, 768, 768, 72, 24, 40, 8192,
  /* 194 */ 65536, 67108864, 1610612736, 1024, 1024, 8, 8, 24, 8, 8, 8, 72, 8, 8, 8, 8, 12, 128, 256, 256, 256, 40, 0,
  /* 217 */ 8, 8, 40, 8, 8, 0, 256, 256, 768, 768, 0, 268435456, 536870912, 0, 2, 0, 0, 3, 0, 0, 2048, 4096, 131072,
  /* 240 */ 536870944, -1073741665, -1073741601, -1073741569, 1073691424, 1073691424, 1073691424, 1073691424,
  /* 248 */ 1073691488, 1073691488, 1073692512, 1073740640, -50177, -50177, 1, 12, 16, 0x80000000, 6144, 8192, 458752,
  /* 261 */ 524288, 16777216, 234881024, 268435456, 7168, 6144, 196608, 262144, 1048576, 4194304, 8388608, 33554432,
  /* 273 */ 67108864, 134217728, 268435456, 0, 0, 0, 0, 3, 1024, 49152, 0, 0, 0, 268435456, 0, 6144, 131072, 262144,
  /* 291 */ 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 268435456, 1024, 32768, 4096, 131072,
  /* 303 */ 262144, 1048576, 16777216, 32768, 0, 0, 64, 536870944, 131072, 262144, 4194304, 0, 2048, 4194304, 0, 2048,
  /* 319 */ 0, 2048, 4096, 262144, 0, 4, 0, 0, 256, 512, 2048, 8, 7, 3, 3, 12, 12, 15, 15
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
  "'object'",
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
