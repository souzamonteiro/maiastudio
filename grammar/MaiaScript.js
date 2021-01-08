// This file was generated on Fri Jan 8, 2021 17:37 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
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
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
      if (l1 != 61)                 // '||'
      {
        break;
      }
      consume(61);                  // '||'
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
      if (l1 != 61)                 // '||'
      {
        break;
      }
      consumeT(61);                 // '||'
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
      if (l1 != 63)                 // '||||'
      {
        break;
      }
      consume(63);                  // '||||'
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
      if (l1 != 63)                 // '||||'
      {
        break;
      }
      consumeT(63);                 // '||||'
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
      if (l1 != 60)                 // '|'
      {
        break;
      }
      consume(60);                  // '|'
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
      if (l1 != 60)                 // '|'
      {
        break;
      }
      consumeT(60);                 // '|'
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
      if (l1 != 62)                 // '|||'
      {
        break;
      }
      consume(62);                  // '|||'
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
      if (l1 != 62)                 // '|||'
      {
        break;
      }
      consumeT(62);                 // '|||'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
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
    case 65:                        // '~'
      consume(65);                  // '~'
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
    case 65:                        // '~'
      consumeT(65);                 // '~'
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
    case 53:                        // 'namespace'
      parse_namespace();
      break;
    case 52:                        // 'local'
      parse_local();
      break;
    case 51:                        // 'if'
      parse_if();
      break;
    case 45:                        // 'do'
      parse_do();
      break;
    case 58:                        // 'while'
      parse_while();
      break;
    case 48:                        // 'for'
      parse_for();
      break;
    case 49:                        // 'foreach'
      parse_foreach();
      break;
    case 57:                        // 'try'
      parse_try();
      break;
    case 55:                        // 'test'
      parse_test();
      break;
    case 41:                        // 'break'
      parse_break();
      break;
    case 44:                        // 'continue'
      parse_continue();
      break;
    case 54:                        // 'return'
      parse_return();
      break;
    case 56:                        // 'throw'
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
    case 53:                        // 'namespace'
      try_namespace();
      break;
    case 52:                        // 'local'
      try_local();
      break;
    case 51:                        // 'if'
      try_if();
      break;
    case 45:                        // 'do'
      try_do();
      break;
    case 58:                        // 'while'
      try_while();
      break;
    case 48:                        // 'for'
      try_for();
      break;
    case 49:                        // 'foreach'
      try_foreach();
      break;
    case 57:                        // 'try'
      try_try();
      break;
    case 55:                        // 'test'
      try_test();
      break;
    case 41:                        // 'break'
      try_break();
      break;
    case 44:                        // 'continue'
      try_continue();
      break;
    case 54:                        // 'return'
      try_return();
      break;
    case 56:                        // 'throw'
      try_throw();
      break;
    default:
      try_function();
    }
  }

  function parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
    consume(53);                    // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    consumeT(53);                   // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(59);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 64)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(64);                  // '}'
      break;
    case 43:                        // 'constructor'
      consume(43);                  // 'constructor'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(59);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 64)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(64);                  // '}'
      break;
    default:
      consume(50);                  // 'function'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(59);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 64)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(64);                  // '}'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(59);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 64)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(64);                 // '}'
      break;
    case 43:                        // 'constructor'
      consumeT(43);                 // 'constructor'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(59);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 64)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(64);                 // '}'
      break;
    default:
      consumeT(50);                 // 'function'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(59);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 64)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(64);                 // '}'
    }
  }

  function parse_local()
  {
    eventHandler.startNonterminal("local", e0);
    consume(52);                    // 'local'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    eventHandler.endNonterminal("local", e0);
  }

  function try_local()
  {
    consumeT(52);                   // 'local'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
  }

  function parse_if()
  {
    eventHandler.startNonterminal("if", e0);
    consume(51);                    // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("elseif", e0);
  }

  function try_elseif()
  {
    consumeT(47);                   // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(46);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(46);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(45);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(58);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(58);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(58);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(58);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
  }

  function parse_for()
  {
    eventHandler.startNonterminal("for", e0);
    consume(48);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("for", e0);
  }

  function try_for()
  {
    consumeT(48);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
  }

  function parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
    consume(49);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("foreach", e0);
  }

  function try_foreach()
  {
    consumeT(49);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(57);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(57);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(55);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(55);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '}' | '~'
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(59);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("catch", e0);
  }

  function try_catch()
  {
    consumeT(42);                   // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(59);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 64)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(64);                   // '}'
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
    consume(54);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    consumeT(54);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    consume(56);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    consumeT(56);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    case 59:                        // '{'
    case 65:                        // '~'
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
    case 59:                        // '{'
    case 65:                        // '~'
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
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
     || lk == 854147                // identifier '(' 'local'
     || lk == 870531                // identifier '(' 'namespace'
     || lk == 886915                // identifier '(' 'return'
     || lk == 903299                // identifier '(' 'test'
     || lk == 919683                // identifier '(' 'throw'
     || lk == 936067                // identifier '(' 'try'
     || lk == 952451                // identifier '(' 'while'
     || lk == 968835                // identifier '(' '{'
     || lk == 1067139)              // identifier '(' '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 421:                 // '[' identifier
            lookahead3W(16);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' |
                                    // '[' | ']' | '^' | '|' | '||' | '|||' | '||||'
            break;
          case 4773:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8357:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7333:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6693:                // '[' 'local'
          case 7589:                // '[' '{'
            lookahead3W(15);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 5157:                // '[' 'async'
          case 5541:                // '[' 'constructor'
          case 6437:                // '[' 'function'
          case 6821:                // '[' 'namespace'
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
          case 6949:                // '[' 'return'
          case 7077:                // '[' 'test'
          case 7205:                // '[' 'throw'
          case 7461:                // '[' 'while'
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
         && lk != 52                // 'local'
         && lk != 53                // 'namespace'
         && lk != 54                // 'return'
         && lk != 55                // 'test'
         && lk != 56                // 'throw'
         && lk != 57                // 'try'
         && lk != 58                // 'while'
         && lk != 59                // '{'
         && lk != 60                // '|'
         && lk != 61                // '||'
         && lk != 62                // '|||'
         && lk != 63                // '||||'
         && lk != 64                // '}'
         && lk != 65                // '~'
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
              lookahead1W(15);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
        lookahead1W(15);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
     || lk == 854147                // identifier '(' 'local'
     || lk == 870531                // identifier '(' 'namespace'
     || lk == 886915                // identifier '(' 'return'
     || lk == 903299                // identifier '(' 'test'
     || lk == 919683                // identifier '(' 'throw'
     || lk == 936067                // identifier '(' 'try'
     || lk == 952451                // identifier '(' 'while'
     || lk == 968835                // identifier '(' '{'
     || lk == 1067139)              // identifier '(' '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'local' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '|||' | '||||' | '}' |
                                    // '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 421:                 // '[' identifier
            lookahead3W(16);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '?=' |
                                    // '[' | ']' | '^' | '|' | '||' | '|||' | '||||'
            break;
          case 4773:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8357:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7333:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6693:                // '[' 'local'
          case 7589:                // '[' '{'
            lookahead3W(15);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 5157:                // '[' 'async'
          case 5541:                // '[' 'constructor'
          case 6437:                // '[' 'function'
          case 6821:                // '[' 'namespace'
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
          case 6949:                // '[' 'return'
          case 7077:                // '[' 'test'
          case 7205:                // '[' 'throw'
          case 7461:                // '[' 'while'
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
         && lk != 52                // 'local'
         && lk != 53                // 'namespace'
         && lk != 54                // 'return'
         && lk != 55                // 'test'
         && lk != 56                // 'throw'
         && lk != 57                // 'try'
         && lk != 58                // 'while'
         && lk != 59                // '{'
         && lk != 60                // '|'
         && lk != 61                // '||'
         && lk != 62                // '|||'
         && lk != 63                // '||||'
         && lk != 64                // '}'
         && lk != 65                // '~'
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
              lookahead1W(15);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
        lookahead1W(15);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        try_arguments();
        consumeT(38);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(59);                    // '{'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_element();
    }
    consume(64);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(59);                   // '{'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_element();
    }
    consumeT(64);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(37);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
                                    // 'local' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'local' |
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
    case 59:                        // '{'
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
    case 59:                        // '{'
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
  for (var i = 0; i < 66; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 218 + s - 1;
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
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 528, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
  /* 28 */ 540
];

MaiaScript.TRANSITION =
[
  /*    0 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*   18 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1792, 1792, 1792, 1795,
  /*   36 */ 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*   54 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1792, 1792, 1792, 1795, 1982, 1958, 1982, 1982,
  /*   72 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*   90 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 3120, 1803, 1809, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982,
  /*  108 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  126 */ 1982, 1982, 1982, 3238, 1821, 1825, 1982, 3047, 1982, 3532, 1982, 1982, 1982, 1959, 1982, 1982, 1982, 1982,
  /*  144 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1921,
  /*  162 */ 1837, 1841, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  180 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1981, 2723, 2648, 2506, 2549, 2719,
  /*  198 */ 1980, 1974, 2549, 2549, 2549, 1981, 2507, 2549, 2549, 2549, 1980, 2507, 2549, 2549, 1978, 2647, 2549, 2549,
  /*  216 */ 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 1982, 1914, 1920, 1917, 1982, 1958, 1982, 3532, 1982, 1982,
  /*  234 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  252 */ 1982, 1982, 1982, 1982, 1982, 1938, 1944, 1941, 1982, 1958, 3116, 3532, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  270 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  288 */ 1982, 1982, 1982, 1982, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  306 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1853, 1857, 1865, 1869,
  /*  324 */ 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  342 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1881, 1883, 1892, 1899, 1982, 1958, 1982, 3532,
  /*  360 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  378 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 3165, 3171, 3168, 1982, 2043, 1982, 3532, 1982, 1982, 1982, 1813,
  /*  396 */ 1982, 1982, 1982, 1982, 3544, 1982, 1982, 1982, 3544, 1911, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  414 */ 1982, 1982, 1982, 2948, 1929, 1953, 1982, 2013, 1982, 3532, 1982, 1982, 1982, 1983, 1982, 1982, 1982, 1982,
  /*  432 */ 3051, 1982, 1982, 1982, 1982, 1935, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1967,
  /*  450 */ 1994, 1991, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  468 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2201, 2002, 2008, 1982, 2105,
  /*  486 */ 1982, 3532, 1982, 1982, 1982, 1983, 1982, 1982, 1982, 1982, 3051, 1982, 1982, 1982, 1982, 1935, 1982, 1982,
  /*  504 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1945, 1982, 3162, 3159, 1982, 2056, 1982, 3532, 1982, 1982,
  /*  522 */ 1982, 1829, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2021, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  540 */ 1982, 1982, 1982, 1982, 1982, 2024, 2032, 2038, 1982, 1958, 1982, 2051, 1982, 1982, 1982, 1959, 1982, 1982,
  /*  558 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  576 */ 1982, 3089, 2064, 2068, 2549, 2936, 1980, 1974, 2549, 2549, 2549, 2470, 2507, 2549, 2549, 2549, 3220, 2507,
  /*  594 */ 2549, 2549, 3508, 2076, 2549, 2549, 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 3233, 2587, 2584, 2581,
  /*  612 */ 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  630 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1873, 2086, 2092, 2100, 1982, 1958, 1982, 3532,
  /*  648 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  666 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2133, 2139, 2136, 1982, 1958, 2142, 3532, 1982, 1982, 1982, 1982,
  /*  684 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  702 */ 1982, 1982, 1982, 2124, 2130, 2127, 1982, 1958, 2113, 2121, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  720 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2223,
  /*  738 */ 2229, 2226, 1982, 1958, 1884, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  756 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 3535, 3541, 3538, 1982, 1958,
  /*  774 */ 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  792 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1981, 2723, 2648, 2506, 2549, 3313, 1980, 1974, 2549, 2549,
  /*  810 */ 2549, 2943, 2507, 2549, 2549, 2549, 2575, 2507, 2549, 2549, 2279, 2150, 2549, 2549, 2549, 2549, 2549, 1980,
  /*  828 */ 1982, 1982, 1982, 1982, 1982, 3263, 2160, 2164, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  846 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  864 */ 1982, 1982, 1982, 1982, 1982, 2196, 1982, 3532, 1982, 1982, 1982, 1959, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  882 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2172, 2212, 2209,
  /*  900 */ 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  918 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2232, 2238, 2235, 1982, 1958, 1982, 3532,
  /*  936 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /*  954 */ 1982, 1982, 1982, 1982, 1982, 1982, 2220, 2302, 2255, 2259, 2185, 3146, 2191, 2179, 2267, 2549, 2549, 1981,
  /*  972 */ 2507, 2549, 2275, 2808, 1980, 3186, 2287, 2901, 1978, 3076, 2549, 2549, 2368, 3299, 2549, 1980, 1982, 1982,
  /*  990 */ 1982, 1982, 2297, 2799, 2310, 2314, 2549, 2719, 1980, 1974, 2549, 2549, 2549, 2794, 2507, 2549, 2549, 2549,
  /* 1008 */ 1980, 2507, 2549, 2549, 1978, 2647, 2549, 2549, 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 2322, 2327,
  /* 1026 */ 2335, 2343, 2549, 2719, 1980, 1974, 2549, 2549, 2356, 1981, 2507, 2366, 3132, 2376, 1980, 2507, 2386, 2823,
  /* 1044 */ 1978, 3504, 2549, 2358, 2549, 2867, 2394, 1980, 1982, 1982, 1982, 1982, 2405, 2410, 2418, 2422, 2549, 2719,
  /* 1062 */ 1980, 1974, 2549, 2549, 2549, 1981, 2507, 2549, 2549, 2549, 1980, 2507, 2549, 2549, 1978, 2647, 2549, 2549,
  /* 1080 */ 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 2437, 2442, 2430, 2450, 2743, 2463, 2478, 1974, 2835, 2491,
  /* 1098 */ 2549, 2943, 3353, 2549, 2078, 2502, 2515, 2529, 2537, 2548, 3427, 2558, 2921, 2549, 2549, 2549, 2569, 1980,
  /* 1116 */ 1982, 1982, 1982, 1982, 2595, 2756, 2608, 2612, 2820, 2719, 1980, 1974, 2620, 2549, 2549, 2794, 2507, 2549,
  /* 1134 */ 2549, 2549, 1980, 2507, 2549, 2549, 1978, 2647, 2549, 2549, 2630, 2549, 2549, 1980, 1982, 1982, 1982, 1982,
  /* 1152 */ 1981, 2723, 2648, 2506, 2549, 2642, 2658, 1974, 2397, 2549, 2549, 1981, 2507, 2549, 2549, 2549, 1980, 2507,
  /* 1170 */ 2549, 2821, 1978, 2647, 3437, 2549, 2549, 2671, 2549, 1980, 1982, 1982, 1982, 1982, 2682, 2483, 2695, 2699,
  /* 1188 */ 2549, 2719, 1980, 1974, 2549, 2549, 2549, 2707, 2507, 3335, 2549, 2549, 1980, 2507, 2549, 2856, 1978, 2521,
  /* 1206 */ 2289, 2731, 2742, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 1981, 2723, 2648, 2506, 2549, 2719, 1980, 1974,
  /* 1224 */ 2549, 2549, 2549, 1981, 2507, 2549, 2549, 2549, 1980, 2507, 2549, 2822, 1978, 3451, 2549, 2549, 2549, 2549,
  /* 1242 */ 2549, 1980, 1982, 1982, 1982, 1982, 2751, 2600, 2764, 2768, 2776, 2719, 1980, 1974, 2549, 2787, 2807, 1981,
  /* 1260 */ 2816, 2549, 2549, 2820, 3200, 2831, 2845, 2549, 1978, 2647, 2843, 2549, 2549, 2549, 2549, 1980, 1982, 1982,
  /* 1278 */ 1982, 1982, 1981, 2723, 2648, 2506, 2549, 2719, 1980, 1974, 2549, 2549, 2853, 1981, 2507, 2864, 2549, 2549,
  /* 1296 */ 1980, 2507, 2549, 2549, 1978, 2647, 2549, 2549, 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 2875, 3205,
  /* 1314 */ 2888, 2892, 2549, 2719, 1980, 1974, 2549, 2960, 2900, 2794, 2455, 2909, 2918, 2549, 1980, 3348, 2549, 2549,
  /* 1332 */ 1978, 2647, 2549, 2929, 2956, 2549, 2968, 1980, 1982, 1982, 1982, 1982, 1981, 2723, 2648, 2506, 2978, 2984,
  /* 1350 */ 1980, 2992, 3000, 2549, 2549, 1981, 2507, 2549, 2549, 2152, 1980, 2507, 2779, 2549, 1978, 2647, 2549, 2549,
  /* 1368 */ 2970, 3008, 3034, 1980, 1982, 1982, 1982, 1982, 1981, 2723, 2648, 2506, 2549, 2719, 1980, 1974, 2549, 2549,
  /* 1386 */ 2549, 1981, 2507, 2549, 2549, 2549, 1980, 2507, 2549, 2549, 1978, 2647, 2549, 3020, 3032, 2549, 2549, 1980,
  /* 1404 */ 1982, 1982, 1982, 1982, 3042, 2663, 3059, 3063, 2549, 3071, 3084, 3097, 2494, 2550, 2378, 2794, 2348, 2674,
  /* 1422 */ 2549, 2549, 1980, 2507, 2549, 2549, 3111, 2647, 3128, 3140, 2549, 2549, 2549, 3154, 1982, 1982, 1982, 1982,
  /* 1440 */ 1981, 2723, 2648, 2634, 2549, 2719, 1980, 3181, 2549, 2540, 2561, 1981, 2507, 3024, 3194, 2549, 1980, 3213,
  /* 1458 */ 2549, 2549, 3228, 2647, 3246, 2549, 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 3258, 2880, 3271, 3275,
  /* 1476 */ 2549, 2719, 1980, 1974, 2549, 3283, 3012, 2794, 2507, 3295, 3307, 2650, 1980, 3456, 3403, 3250, 3321, 2713,
  /* 1494 */ 3334, 2549, 2549, 2549, 3343, 1980, 1982, 1982, 1982, 1982, 1981, 2723, 2648, 2506, 3361, 3103, 3381, 1974,
  /* 1512 */ 3399, 2549, 2910, 1981, 3411, 2622, 2549, 2734, 1980, 2507, 3423, 2549, 1978, 2647, 2549, 2549, 3287, 3435,
  /* 1530 */ 2549, 1980, 1982, 1982, 1982, 1982, 3445, 2687, 3464, 3468, 2549, 2719, 1980, 1974, 2549, 2549, 2549, 1981,
  /* 1548 */ 2507, 2549, 2549, 2549, 1980, 2507, 2549, 2549, 3373, 2647, 3415, 2549, 2549, 2549, 2549, 1980, 1982, 1982,
  /* 1566 */ 1982, 1982, 1981, 2723, 2648, 2506, 2549, 2719, 1980, 1974, 2549, 3476, 2649, 1981, 3368, 3478, 2549, 2549,
  /* 1584 */ 1980, 2507, 2549, 2549, 1978, 2647, 2549, 2549, 2549, 2549, 2549, 1980, 1982, 1982, 1982, 1982, 3173, 3326,
  /* 1602 */ 3486, 3490, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1620 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 2241, 2247, 2244, 1982, 1958,
  /* 1638 */ 1982, 3498, 1982, 1982, 1982, 1982, 3386, 1982, 1982, 1982, 1982, 3391, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1656 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 3516, 3518, 3526, 1982, 1958, 1982, 3532, 1982, 1982,
  /* 1674 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1692 */ 1982, 1982, 1982, 1982, 1982, 1903, 3552, 3556, 1982, 1958, 1982, 3532, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1710 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1728 */ 1982, 1982, 1982, 1982, 1982, 1958, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1746 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1845, 1982,
  /* 1764 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982,
  /* 1782 */ 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 1982, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101,
  /* 1800 */ 0, 0, 0, 51, 3328, 3328, 3328, 3328, 3328, 3328, 3328, 3379, 3379, 0, 0, 0, 0, 94, 0, 0, 0, 0, 44, 44, 44,
  /* 1825 */ 44, 44, 44, 44, 0, 0, 0, 0, 132, 0, 0, 0, 0, 2875, 2875, 2875, 2875, 2875, 2875, 2875, 0, 0, 0, 0, 768, 0,
  /* 1851 */ 0, 0, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 0, 0,
  /* 1875 */ 0, 0, 7168, 0, 0, 0, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 9216, 0, 4864, 0, 0, 0, 4864, 0, 4864, 4864, 4864,
  /* 1902 */ 4864, 0, 0, 0, 0, 16896, 0, 0, 16896, 94, 94, 0, 0, 0, 0, 0, 0, 3840, 3840, 0, 0, 0, 0, 0, 0, 0, 2875,
  /* 1929 */ 5376, 45, 45, 45, 45, 45, 45, 45, 0, 0, 0, 0, 0, 0, 4148, 4148, 0, 0, 0, 0, 0, 0, 0, 6144, 45, 45, 5421,
  /* 1956 */ 5421, 0, 0, 0, 0, 44, 0, 0, 0, 0, 0, 0, 5632, 5632, 0, 0, 5632, 5632, 0, 0, 2875, 0, 1054, 1054, 1054,
  /* 1981 */ 1054, 0, 0, 0, 0, 0, 0, 0, 0, 135, 5632, 5632, 5632, 5632, 0, 0, 0, 0, 0, 0, 5632, 5888, 46, 46, 46, 46,
  /* 2007 */ 46, 46, 46, 5934, 5934, 0, 0, 0, 0, 44, 0, 0, 45, 0, 132, 132, 0, 0, 0, 0, 0, 0, 6400, 6400, 60, 6400, 60,
  /* 2034 */ 60, 60, 60, 60, 60, 60, 6460, 6460, 0, 0, 0, 0, 44, 0, 0, 94, 0, 0, 0, 2875, 2875, 0, 0, 0, 0, 44, 0, 0,
  /* 2062 */ 95, 0, 0, 2607, 2607, 2607, 2607, 2607, 2607, 2607, 0, 1054, 1054, 1054, 2729, 2730, 1054, 1054, 1054,
  /* 2081 */ 1054, 1054, 1054, 159, 1054, 7168, 0, 7168, 0, 0, 0, 7168, 0, 7168, 0, 0, 7168, 7168, 0, 7168, 7168, 7168,
  /* 2103 */ 7168, 0, 0, 0, 0, 44, 92, 92, 45, 0, 0, 0, 3584, 0, 6912, 7936, 8448, 8960, 9472, 0, 2875, 0, 0, 0, 0, 0,
  /* 2129 */ 8247, 8247, 0, 0, 0, 0, 0, 0, 0, 7478, 7478, 0, 0, 0, 0, 0, 0, 0, 7680, 0, 0, 96, 133, 1054, 1054, 1054,
  /* 2155 */ 1054, 1054, 1054, 1054, 1188, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 0, 0, 0, 0, 0, 0, 9984, 0, 0,
  /* 2177 */ 0, 9984, 0, 0, 2875, 0, 1054, 1054, 1100, 1054, 1054, 1103, 1054, 1054, 1107, 1054, 0, 0, 0, 0, 0, 0, 91,
  /* 2200 */ 0, 0, 0, 0, 46, 46, 5888, 5888, 46, 9984, 9984, 9984, 9984, 0, 0, 0, 0, 0, 9984, 9984, 1055, 0, 0, 0, 0, 0,
  /* 2226 */ 0, 0, 8760, 8760, 0, 0, 0, 0, 0, 0, 0, 10240, 10240, 0, 0, 0, 0, 0, 0, 0, 15674, 15674, 0, 0, 0, 0, 0, 0,
  /* 2254 */ 0, 0, 1085, 1085, 1085, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054, 1121, 1054, 1054, 1131, 1054, 1054,
  /* 2273 */ 1054, 1137, 1054, 1054, 1054, 1179, 1054, 1054, 1054, 1054, 0, 133, 0, 0, 1054, 1202, 1054, 1054, 1054,
  /* 2292 */ 1054, 1054, 1054, 1054, 1220, 1056, 0, 0, 0, 0, 0, 0, 0, 1055, 1055, 0, 0, 1085, 0, 1086, 1086, 1086, 1086,
  /* 2315 */ 1086, 1086, 1086, 0, 1054, 1054, 1054, 1057, 0, 0, 0, 0, 0, 0, 0, 1057, 1057, 0, 0, 1087, 0, 1087, 1087,
  /* 2338 */ 1087, 1087, 1087, 1087, 1087, 1096, 1087, 1087, 1087, 0, 1054, 1054, 1054, 0, 1054, 1054, 1054, 12688,
  /* 2356 */ 1054, 1147, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1227, 1054, 1170, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 2374 */ 1054, 1231, 1054, 1185, 1054, 1054, 1054, 1054, 1054, 1054, 1152, 1054, 1201, 1054, 1054, 1054, 1054, 1054,
  /* 2392 */ 1054, 1207, 1054, 1054, 1238, 1054, 1054, 1054, 1054, 1054, 1134, 1136, 1054, 1058, 0, 0, 0, 0, 0, 0, 0,
  /* 2413 */ 1058, 1058, 0, 0, 1088, 0, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 0, 1054, 1054, 1054, 0, 1059, 1059,
  /* 2433 */ 1059, 1059, 1059, 1059, 1059, 0, 0, 0, 0, 0, 0, 0, 1059, 1059, 0, 0, 1059, 1059, 1097, 1059, 1059, 0, 1054,
  /* 2456 */ 1054, 1054, 0, 1054, 1054, 1167, 1054, 1110, 1054, 0, 44, 0, 0, 96, 1054, 0, 0, 93, 93, 0, 2694, 2696,
  /* 2478 */ 1054, 1110, 0, 0, 0, 0, 0, 0, 1061, 1061, 0, 0, 1090, 1054, 1054, 1140, 1054, 1054, 1054, 1054, 1054, 1135,
  /* 2500 */ 1054, 1054, 1184, 1054, 1054, 1186, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 0,
  /* 2520 */ 96, 0, 0, 1054, 1054, 1054, 1054, 1215, 1054, 1054, 1054, 1566, 0, 1054, 1054, 1054, 1200, 1054, 1054,
  /* 2539 */ 1203, 1054, 1054, 1054, 1054, 1054, 1143, 1054, 1054, 12216, 1054, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 2556 */ 1054, 121, 96, 133, 1822, 1054, 1054, 1054, 1054, 1054, 1151, 1054, 1054, 11550, 1054, 1054, 1054, 1054,
  /* 2574 */ 13854, 1054, 1054, 0, 0, 0, 96, 0, 0, 53, 53, 0, 0, 0, 0, 0, 0, 0, 6709, 53, 0, 1060, 0, 0, 0, 0, 0, 0, 0,
  /* 2603 */ 1062, 1062, 0, 0, 1091, 0, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054, 1054, 13342,
  /* 2622 */ 1054, 1054, 1054, 1054, 1054, 1054, 1163, 1054, 1054, 1054, 1054, 12318, 1054, 1054, 1054, 1054, 0, 1054,
  /* 2640 */ 1098, 1054, 1111, 1113, 90, 44, 0, 0, 0, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1111, 0,
  /* 2661 */ 0, 0, 0, 0, 0, 1064, 1064, 0, 0, 1093, 1054, 1054, 12830, 1054, 1054, 1054, 1054, 1054, 1174, 1054, 1054,
  /* 2682 */ 1061, 0, 0, 0, 0, 0, 0, 0, 1066, 1066, 0, 0, 1095, 0, 1090, 1090, 1090, 1090, 1090, 1090, 1090, 0, 1054,
  /* 2705 */ 1054, 1054, 1154, 131, 0, 0, 0, 2304, 0, 0, 1054, 1054, 1054, 1214, 1054, 1054, 0, 44, 0, 0, 0, 1054, 1054,
  /* 2728 */ 0, 0, 1054, 1054, 1054, 1223, 1054, 1054, 1054, 1054, 1054, 1187, 1054, 1054, 1228, 1054, 1054, 1054, 1054,
  /* 2747 */ 1054, 1054, 1054, 1109, 1062, 0, 0, 0, 0, 0, 0, 0, 1072, 1072, 0, 0, 1089, 0, 1091, 1091, 1091, 1091, 1091,
  /* 2770 */ 1091, 1091, 0, 1054, 1054, 1054, 1054, 1054, 1102, 1054, 1054, 1054, 1054, 1054, 1205, 1054, 1054, 1138,
  /* 2788 */ 1054, 1054, 1054, 1054, 1054, 1144, 1054, 0, 44, 0, 0, 0, 0, 0, 1056, 1056, 0, 0, 1086, 1054, 1054, 1054,
  /* 2810 */ 1149, 1054, 1054, 1054, 1054, 1054, 1161, 1162, 1054, 0, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1054,
  /* 2828 */ 1054, 1054, 1054, 1054, 1310, 1054, 0, 1054, 1054, 1054, 1054, 1132, 1133, 1054, 1054, 1054, 13598, 1054,
  /* 2846 */ 1054, 1054, 1054, 1054, 1054, 1206, 1054, 1054, 1054, 1148, 1054, 1054, 1054, 1054, 1054, 1210, 1061, 1054,
  /* 2864 */ 1054, 1054, 1171, 1054, 1054, 1054, 1054, 1054, 1236, 1153, 1237, 1063, 0, 0, 0, 0, 0, 0, 0, 1074, 1074, 0,
  /* 2886 */ 0, 1094, 0, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 0, 1054, 1054, 1054, 1146, 1054, 1054, 1054, 1054,
  /* 2905 */ 1054, 1054, 1054, 1141, 1169, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1153, 1054, 1054, 1178, 1054, 1054,
  /* 2923 */ 1054, 1054, 1054, 15134, 1054, 1054, 1054, 1222, 1054, 1054, 30, 1054, 1226, 1054, 1054, 0, 44, 93, 2607,
  /* 2942 */ 2607, 1054, 0, 0, 0, 133, 0, 0, 0, 45, 45, 5376, 5376, 45, 1054, 1054, 14110, 1054, 1054, 1054, 1054, 1054,
  /* 2964 */ 1142, 1054, 1054, 1054, 1054, 13086, 1054, 1054, 1054, 1054, 1054, 1054, 1213, 1054, 1101, 30, 1054, 1104,
  /* 2982 */ 1054, 1106, 1054, 1054, 0, 44, 0, 0, 0, 1104, 0, 0, 2875, 0, 1054, 1054, 1127, 11806, 1128, 1054, 1130,
  /* 3003 */ 1054, 1054, 1054, 1054, 1127, 1054, 1054, 1054, 1234, 1054, 1054, 1054, 1054, 1150, 1054, 1054, 1054, 1054,
  /* 3021 */ 1054, 1054, 1224, 1054, 1054, 1054, 1054, 1173, 1054, 1054, 1054, 1054, 1229, 1054, 1054, 1054, 1054, 1054,
  /* 3039 */ 1054, 1241, 1242, 1064, 0, 0, 0, 0, 0, 0, 0, 2048, 0, 0, 0, 0, 167, 45, 0, 45, 0, 1093, 1093, 1093, 1093,
  /* 3064 */ 1093, 1093, 1093, 0, 1054, 1054, 1099, 1112, 1054, 0, 44, 0, 0, 0, 1054, 1054, 1054, 1054, 1054, 1216,
  /* 3084 */ 1054, 1123, 0, 0, 0, 0, 0, 0, 2607, 2607, 0, 0, 2607, 0, 0, 2875, 0, 1054, 1126, 1054, 1054, 0, 44, 0, 0,
  /* 3109 */ 0, 1105, 1054, 1054, 1213, 1054, 0, 0, 0, 0, 4352, 0, 0, 0, 0, 3328, 51, 51, 3328, 1054, 1054, 1054, 1219,
  /* 3132 */ 1054, 1054, 1054, 1054, 1180, 1054, 1054, 1054, 1221, 1054, 1054, 1054, 1054, 1225, 1054, 1054, 0, 44, 0,
  /* 3151 */ 0, 0, 1121, 30, 11294, 0, 0, 0, 0, 0, 0, 6144, 0, 0, 0, 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 0, 0, 0, 15360,
  /* 3180 */ 0, 0, 0, 2875, 0, 1125, 1054, 1054, 1054, 0, 1054, 1197, 1054, 1054, 1054, 1177, 1054, 1054, 1054, 1181,
  /* 3200 */ 1054, 1153, 165, 0, 0, 0, 0, 0, 1073, 1073, 0, 0, 1092, 1195, 1054, 1054, 0, 1054, 1054, 1198, 1054, 1054,
  /* 3222 */ 0, 166, 168, 2729, 2696, 2730, 1054, 1212, 1054, 1054, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 44, 44, 0, 0, 44,
  /* 3246 */ 1054, 1054, 1218, 1054, 1054, 1054, 1054, 1054, 1209, 1054, 1054, 1054, 1065, 0, 0, 0, 0, 0, 0, 0, 9728,
  /* 3267 */ 9728, 0, 0, 9728, 0, 1094, 1094, 1094, 1094, 1094, 1094, 1094, 0, 1054, 1054, 1054, 1054, 1054, 1054, 1141,
  /* 3287 */ 1054, 1054, 1054, 1054, 1230, 1153, 1054, 1054, 1054, 1054, 1054, 1172, 1054, 1054, 1054, 1054, 1235, 1054,
  /* 3305 */ 1054, 1054, 1176, 1054, 1054, 1054, 1054, 1182, 1054, 1054, 0, 44, 0, 0, 96, 1054, 1211, 1054, 1054, 1054,
  /* 3325 */ 0, 0, 0, 0, 15360, 15360, 0, 0, 15360, 1217, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1175, 1054, 1054,
  /* 3345 */ 1054, 1239, 1240, 1054, 1054, 1054, 0, 1196, 1054, 1054, 1054, 0, 1054, 1166, 1054, 1054, 1054, 1054, 1054,
  /* 3364 */ 1105, 1054, 1054, 1108, 1054, 1054, 30, 0, 1165, 1054, 1054, 1054, 30, 0, 0, 0, 0, 1122, 1054, 0, 0, 0, 0,
  /* 3387 */ 0, 0, 16268, 0, 0, 0, 0, 16384, 0, 0, 0, 0, 1129, 1054, 1054, 1122, 1054, 1054, 1054, 1054, 14366, 1054,
  /* 3409 */ 1054, 1054, 1054, 1054, 1163, 0, 1054, 1054, 1054, 1054, 14622, 1054, 1054, 1054, 1054, 1054, 1054, 1204,
  /* 3427 */ 1054, 1054, 1054, 1054, 15104, 133, 0, 0, 1232, 1233, 1054, 1054, 1054, 1054, 1054, 1054, 11038, 1054,
  /* 3445 */ 1066, 0, 0, 0, 0, 43, 0, 0, 1054, 1054, 10782, 1054, 1054, 1054, 0, 1054, 1054, 1199, 1054, 0, 1095, 1095,
  /* 3467 */ 1095, 1095, 1095, 1095, 1095, 0, 1054, 1054, 1054, 1054, 1139, 1054, 1054, 1054, 1054, 1054, 1054, 14878,
  /* 3485 */ 1054, 0, 15360, 15360, 15360, 15360, 15360, 15360, 15360, 0, 0, 0, 0, 0, 15972, 2875, 0, 0, 0, 0, 0, 1054,
  /* 3507 */ 10526, 1054, 1054, 1054, 1054, 0, 166, 168, 168, 0, 16640, 0, 0, 0, 16640, 0, 0, 0, 0, 16640, 16640, 16640,
  /* 3529 */ 16640, 0, 0, 0, 0, 2875, 0, 0, 0, 0, 0, 57, 57, 0, 0, 0, 0, 0, 0, 0, 94, 0, 94, 0, 16896, 16896, 16896,
  /* 3556 */ 16896, 16896, 16896, 16896, 0, 0, 0, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 41, 45, 64, 49, 62, 70, 76, 68, 74, 68, 52, 68, 68, 55, 80, 84, 104, 91, 95, 58, 101, 97, 107, 111, 87, 115,
  /*  26 */ 119, 123, 127, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 131, 135, 139, 143, 147, 151, 155, 257, 174,
  /*  50 */ 164, 206, 258, 192, 196, 258, 258, 204, 286, 211, 211, 236, 171, 186, 258, 258, 159, 195, 258, 258, 258,
  /*  71 */ 258, 160, 194, 190, 200, 178, 258, 258, 185, 210, 218, 222, 225, 229, 233, 211, 211, 167, 278, 282, 240,
  /*  92 */ 166, 244, 265, 248, 211, 211, 211, 211, 285, 262, 307, 269, 211, 285, 211, 211, 181, 274, 307, 270, 211,
  /* 113 */ 211, 287, 291, 212, 295, 300, 213, 296, 214, 304, 254, 211, 211, 251, 314, 316, 311, 320, 2056, 133120,
  /* 133 */ 264192, 33556480, 134219776, 2048, 2048, 8521728, 134481920, 2099200, 136316928, 134136, 138232, -143005696,
  /* 145 */ -42342400, 139256, -33822720, 401400, 134356984, 139256, 139260, 134619128, 134356984, 2498552, 136716280,
  /* 156 */ 136716280, -41943048, -33554440, 8, 8, 0, 128, 256, 67108864, 1610612736, 0, 0, 256, 512, 2048, 72, 8, 8,
  /* 174 */ 24, 40, 8192, 65536, 72, 24, 40, 0, 0x80000000, 256, 512, 8, 8, 40, 8, 8, 8, 8, 0, 256, 256, 256, 768, 768,
  /* 198 */ 72, 8, 256, 768, 768, 768, 8, 8, 0, 0, 1024, 1024, 134217728, 0, 0, 0, 0, 2048, 4096, 262144, 64, 134217760,
  /* 220 */ 134217760, -268435297, -268435233, 268385056, -268435201, 268385056, 268385056, 268385056, 268385056,
  /* 229 */ 268385120, 268385120, 268386144, 268434272, -50177, -50177, 0, 0, -1073741824, 256, 512, 1, 12, 16,
  /* 243 */ -536870912, 6144, 8192, 458752, 524288, 67108864, 7168, 49152, 0, 1, 0, 0, 2048, 0, 2048, 8, 8, 8, 8, 6144,
  /* 263 */ 196608, 262144, 1048576, 2097152, 4194304, 58720256, 33554432, 67108864, 1024, 49152, 0, 6144, 131072,
  /* 276 */ 262144, 1048576, 4096, 131072, 262144, 1048576, 2097152, 4194304, 16777216, 67108864, 0, 0, 0, 67108864, 0,
  /* 291 */ 1024, 32768, 0, 0, 4096, 131072, 262144, 2097152, 0, 4194304, 32768, 0, 0, 2097152, 0, 2048, 2097152,
  /* 308 */ 4194304, 8388608, 16777216, 2, 2, 2, 2, 1, 0, 2, 2, 3, 3, 3, 3, 3
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
