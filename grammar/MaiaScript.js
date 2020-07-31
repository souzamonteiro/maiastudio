// This file was generated on Thu Jul 30, 2020 11:24 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -backtrack -javascript -tree

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
    lookahead1W(21);                // END | eof | identifier | string | complex | real | comment | whitespace^token |
                                    // '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    switch (l1)
    {
    case 2:                         // eof
      consume(2);                   // eof
      break;
    default:
      for (;;)
      {
        lookahead1W(17);            // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
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
      if (l1 != 27)                 // '='
      {
        break;
      }
      consume(27);                  // '='
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 27)                 // '='
      {
        break;
      }
      consumeT(27);                 // '='
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_logicalORExpression();
    }
  }

  function parse_logicalORExpression()
  {
    eventHandler.startNonterminal("logicalORExpression", e0);
    parse_logicalANDExpression();
    for (;;)
    {
      if (l1 != 54)                 // '||'
      {
        break;
      }
      consume(54);                  // '||'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      whitespace();
      parse_logicalANDExpression();
    }
    eventHandler.endNonterminal("logicalORExpression", e0);
  }

  function try_logicalORExpression()
  {
    try_logicalANDExpression();
    for (;;)
    {
      if (l1 != 54)                 // '||'
      {
        break;
      }
      consumeT(54);                 // '||'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_logicalANDExpression();
    }
  }

  function parse_logicalANDExpression()
  {
    eventHandler.startNonterminal("logicalANDExpression", e0);
    parse_bitwiseORExpression();
    for (;;)
    {
      if (l1 != 13)                 // '&&'
      {
        break;
      }
      consume(13);                  // '&&'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 13)                 // '&&'
      {
        break;
      }
      consumeT(13);                 // '&&'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_bitwiseORExpression();
    }
  }

  function parse_bitwiseORExpression()
  {
    eventHandler.startNonterminal("bitwiseORExpression", e0);
    parse_bitwiseXORExpression();
    for (;;)
    {
      if (l1 != 53)                 // '|'
      {
        break;
      }
      consume(53);                  // '|'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 53)                 // '|'
      {
        break;
      }
      consumeT(53);                 // '|'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_bitwiseXORExpression();
    }
  }

  function parse_bitwiseXORExpression()
  {
    eventHandler.startNonterminal("bitwiseXORExpression", e0);
    parse_bitwiseANDExpression();
    for (;;)
    {
      if (l1 != 35)                 // '`'
      {
        break;
      }
      consume(35);                  // '`'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 35)                 // '`'
      {
        break;
      }
      consumeT(35);                 // '`'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_bitwiseANDExpression();
    }
  }

  function parse_bitwiseANDExpression()
  {
    eventHandler.startNonterminal("bitwiseANDExpression", e0);
    parse_equalityExpression();
    for (;;)
    {
      if (l1 != 12)                 // '&'
      {
        break;
      }
      consume(12);                  // '&'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 12)                 // '&'
      {
        break;
      }
      consumeT(12);                 // '&'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_equalityExpression();
    }
  }

  function parse_equalityExpression()
  {
    eventHandler.startNonterminal("equalityExpression", e0);
    parse_relationalExpression();
    for (;;)
    {
      if (l1 != 10                  // '!='
       && l1 != 28)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '=='
        consume(28);                // '=='
        break;
      default:
        consume(10);                // '!='
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 10                  // '!='
       && l1 != 28)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '=='
        consumeT(28);               // '=='
        break;
      default:
        consumeT(10);               // '!='
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_relationalExpression();
    }
  }

  function parse_relationalExpression()
  {
    eventHandler.startNonterminal("relationalExpression", e0);
    parse_shiftExpression();
    for (;;)
    {
      if (l1 != 24                  // '<'
       && l1 != 26                  // '<='
       && l1 != 29                  // '>'
       && l1 != 30)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 24:                      // '<'
        consume(24);                // '<'
        break;
      case 29:                      // '>'
        consume(29);                // '>'
        break;
      case 26:                      // '<='
        consume(26);                // '<='
        break;
      default:
        consume(30);                // '>='
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 24                  // '<'
       && l1 != 26                  // '<='
       && l1 != 29                  // '>'
       && l1 != 30)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 24:                      // '<'
        consumeT(24);               // '<'
        break;
      case 29:                      // '>'
        consumeT(29);               // '>'
        break;
      case 26:                      // '<='
        consumeT(26);               // '<='
        break;
      default:
        consumeT(30);               // '>='
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_shiftExpression();
    }
  }

  function parse_shiftExpression()
  {
    eventHandler.startNonterminal("shiftExpression", e0);
    parse_additiveExpression();
    for (;;)
    {
      if (l1 != 25                  // '<<'
       && l1 != 31)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 25:                      // '<<'
        consume(25);                // '<<'
        break;
      default:
        consume(31);                // '>>'
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
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
      if (l1 != 25                  // '<<'
       && l1 != 31)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 25:                      // '<<'
        consumeT(25);               // '<<'
        break;
      default:
        consumeT(31);               // '>>'
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_additiveExpression();
    }
  }

  function parse_additiveExpression()
  {
    eventHandler.startNonterminal("additiveExpression", e0);
    parse_powerExpression();
    for (;;)
    {
      if (l1 != 17                  // '+'
       && l1 != 19)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 17:                      // '+'
        consume(17);                // '+'
        break;
      default:
        consume(19);                // '-'
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      whitespace();
      parse_powerExpression();
    }
    eventHandler.endNonterminal("additiveExpression", e0);
  }

  function try_additiveExpression()
  {
    try_powerExpression();
    for (;;)
    {
      if (l1 != 17                  // '+'
       && l1 != 19)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 17:                      // '+'
        consumeT(17);               // '+'
        break;
      default:
        consumeT(19);               // '-'
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_powerExpression();
    }
  }

  function parse_powerExpression()
  {
    eventHandler.startNonterminal("powerExpression", e0);
    parse_multiplicativeExpression();
    for (;;)
    {
      if (l1 != 34)                 // '^'
      {
        break;
      }
      consume(34);                  // '^'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      whitespace();
      parse_multiplicativeExpression();
    }
    eventHandler.endNonterminal("powerExpression", e0);
  }

  function try_powerExpression()
  {
    try_multiplicativeExpression();
    for (;;)
    {
      if (l1 != 34)                 // '^'
      {
        break;
      }
      consumeT(34);                 // '^'
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_multiplicativeExpression();
    }
  }

  function parse_multiplicativeExpression()
  {
    eventHandler.startNonterminal("multiplicativeExpression", e0);
    parse_unaryExpression();
    for (;;)
    {
      lookahead1W(26);              // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '/' | ';' | '<' |
                                    // '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' | 'break' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
      if (l1 != 11                  // '%'
       && l1 != 16                  // '*'
       && l1 != 21)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 16:                      // '*'
        consume(16);                // '*'
        break;
      case 21:                      // '/'
        consume(21);                // '/'
        break;
      default:
        consume(11);                // '%'
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      whitespace();
      parse_unaryExpression();
    }
    eventHandler.endNonterminal("multiplicativeExpression", e0);
  }

  function try_multiplicativeExpression()
  {
    try_unaryExpression();
    for (;;)
    {
      lookahead1W(26);              // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '/' | ';' | '<' |
                                    // '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' | 'break' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
      if (l1 != 11                  // '%'
       && l1 != 16                  // '*'
       && l1 != 21)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 16:                      // '*'
        consumeT(16);               // '*'
        break;
      case 21:                      // '/'
        consumeT(21);               // '/'
        break;
      default:
        consumeT(11);               // '%'
      }
      lookahead1W(13);              // identifier | string | complex | real | whitespace^token | '!' | '(' | '[' | '{' |
                                    // '~'
      try_unaryExpression();
    }
  }

  function parse_unaryExpression()
  {
    eventHandler.startNonterminal("unaryExpression", e0);
    switch (l1)
    {
    case 56:                        // '~'
      consume(56);                  // '~'
      lookahead1W(12);              // identifier | string | complex | real | whitespace^token | '(' | '[' | '{'
      whitespace();
      parse_primary();
      break;
    case 9:                         // '!'
      consume(9);                   // '!'
      lookahead1W(12);              // identifier | string | complex | real | whitespace^token | '(' | '[' | '{'
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
    case 56:                        // '~'
      consumeT(56);                 // '~'
      lookahead1W(12);              // identifier | string | complex | real | whitespace^token | '(' | '[' | '{'
      try_primary();
      break;
    case 9:                         // '!'
      consumeT(9);                  // '!'
      lookahead1W(12);              // identifier | string | complex | real | whitespace^token | '(' | '[' | '{'
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
    case 14:                        // '('
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
    case 14:                        // '('
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
    case 46:                        // 'namespace'
      parse_namespace();
      break;
    case 44:                        // 'function'
      parse_function();
      break;
    case 45:                        // 'if'
      parse_if();
      break;
    case 39:                        // 'do'
      parse_do();
      break;
    case 51:                        // 'while'
      parse_while();
      break;
    case 42:                        // 'for'
      parse_for();
      break;
    case 43:                        // 'foreach'
      parse_foreach();
      break;
    case 50:                        // 'try'
      parse_try();
      break;
    case 48:                        // 'test'
      parse_test();
      break;
    case 36:                        // 'break'
      parse_break();
      break;
    case 38:                        // 'continue'
      parse_continue();
      break;
    case 47:                        // 'return'
      parse_return();
      break;
    default:
      parse_throw();
    }
    eventHandler.endNonterminal("statement", e0);
  }

  function try_statement()
  {
    switch (l1)
    {
    case 46:                        // 'namespace'
      try_namespace();
      break;
    case 44:                        // 'function'
      try_function();
      break;
    case 45:                        // 'if'
      try_if();
      break;
    case 39:                        // 'do'
      try_do();
      break;
    case 51:                        // 'while'
      try_while();
      break;
    case 42:                        // 'for'
      try_for();
      break;
    case 43:                        // 'foreach'
      try_foreach();
      break;
    case 50:                        // 'try'
      try_try();
      break;
    case 48:                        // 'test'
      try_test();
      break;
    case 36:                        // 'break'
      try_break();
      break;
    case 38:                        // 'continue'
      try_continue();
      break;
    case 47:                        // 'return'
      try_return();
      break;
    default:
      try_throw();
    }
  }

  function parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
    consume(46);                    // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    consumeT(46);                   // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_function()
  {
    eventHandler.startNonterminal("function", e0);
    consume(44);                    // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      whitespace();
      parse_arguments();
    }
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("function", e0);
  }

  function try_function()
  {
    consumeT(44);                   // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      try_arguments();
    }
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_if()
  {
    eventHandler.startNonterminal("if", e0);
    consume(45);                    // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    for (;;)
    {
      lookahead1W(25);              // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'continue' | 'do' | 'else' |
                                    // 'elseif' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 != 41)                 // 'elseif'
      {
        break;
      }
      whitespace();
      parse_elseif();
    }
    if (l1 == 40)                   // 'else'
    {
      whitespace();
      parse_else();
    }
    eventHandler.endNonterminal("if", e0);
  }

  function try_if()
  {
    consumeT(45);                   // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
    for (;;)
    {
      lookahead1W(25);              // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'continue' | 'do' | 'else' |
                                    // 'elseif' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 != 41)                 // 'elseif'
      {
        break;
      }
      try_elseif();
    }
    if (l1 == 40)                   // 'else'
    {
      try_else();
    }
  }

  function parse_elseif()
  {
    eventHandler.startNonterminal("elseif", e0);
    consume(41);                    // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("elseif", e0);
  }

  function try_elseif()
  {
    consumeT(41);                   // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(40);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(40);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(39);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(51);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    eventHandler.endNonterminal("do", e0);
  }

  function try_do()
  {
    consumeT(39);                   // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(51);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(51);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(51);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_for()
  {
    eventHandler.startNonterminal("for", e0);
    consume(42);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(23);                    // ';'
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(23);                    // ';'
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("for", e0);
  }

  function try_for()
  {
    consumeT(42);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(23);                   // ';'
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(23);                   // ';'
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
    consume(43);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(23);                    // ';'
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(23);                    // ';'
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("foreach", e0);
  }

  function try_foreach()
  {
    consumeT(43);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(23);                   // ';'
    lookahead1W(19);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 23)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(23);                   // ';'
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(50);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    lookahead1W(24);                // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 37)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(50);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
    lookahead1W(24);                // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 37)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(48);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(22);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15                    // ')'
     && l1 != 23)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(8);                 // whitespace^token | ')' | ';'
    if (l1 == 23)                   // ';'
    {
      consume(23);                  // ';'
      lookahead1W(22);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 15                  // ')'
       && l1 != 23)                 // ';'
      {
        whitespace();
        parse_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 23)                 // ';'
      {
        consume(23);                // ';'
        lookahead1W(18);            // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 != 15)               // ')'
        {
          whitespace();
          parse_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    lookahead1W(24);                // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 37)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(48);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(22);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15                    // ')'
     && l1 != 23)                   // ';'
    {
      try_expression();
    }
    lookahead1W(8);                 // whitespace^token | ')' | ';'
    if (l1 == 23)                   // ';'
    {
      consumeT(23);                 // ';'
      lookahead1W(22);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 15                  // ')'
       && l1 != 23)                 // ';'
      {
        try_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 23)                 // ';'
      {
        consumeT(23);               // ';'
        lookahead1W(18);            // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 != 15)               // ')'
        {
          try_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
    lookahead1W(24);                // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 37)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_catch()
  {
    eventHandler.startNonterminal("catch", e0);
    consume(37);                    // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(52);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("catch", e0);
  }

  function try_catch()
  {
    consumeT(37);                   // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(52);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 55)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(55);                   // '}'
  }

  function parse_break()
  {
    eventHandler.startNonterminal("break", e0);
    consume(36);                    // 'break'
    eventHandler.endNonterminal("break", e0);
  }

  function try_break()
  {
    consumeT(36);                   // 'break'
  }

  function parse_continue()
  {
    eventHandler.startNonterminal("continue", e0);
    consume(38);                    // 'continue'
    eventHandler.endNonterminal("continue", e0);
  }

  function try_continue()
  {
    consumeT(38);                   // 'continue'
  }

  function parse_return()
  {
    eventHandler.startNonterminal("return", e0);
    consume(47);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    eventHandler.endNonterminal("return", e0);
  }

  function try_return()
  {
    consumeT(47);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
  }

  function parse_throw()
  {
    eventHandler.startNonterminal("throw", e0);
    consume(49);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(14);                    // '('
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    eventHandler.endNonterminal("throw", e0);
  }

  function try_throw()
  {
    consumeT(49);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(14);                   // '('
    lookahead1W(18);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // ')' | '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 15)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
  }

  function parse_expression()
  {
    eventHandler.startNonterminal("expression", e0);
    switch (l1)
    {
    case 3:                         // identifier
    case 4:                         // string
    case 5:                         // complex
    case 6:                         // real
    case 9:                         // '!'
    case 14:                        // '('
    case 32:                        // '['
    case 52:                        // '{'
    case 56:                        // '~'
      parse_operation();
      break;
    case 7:                         // comment
      consume(7);                   // comment
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
    case 4:                         // string
    case 5:                         // complex
    case 6:                         // real
    case 9:                         // '!'
    case 14:                        // '('
    case 32:                        // '['
    case 52:                        // '{'
    case 56:                        // '~'
      try_operation();
      break;
    case 7:                         // comment
      consumeT(7);                  // comment
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
      lookahead1W(10);              // whitespace^token | ')' | ',' | ']'
      if (l1 != 18)                 // ','
      {
        break;
      }
      consume(18);                  // ','
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
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
      lookahead1W(10);              // whitespace^token | ')' | ',' | ']'
      if (l1 != 18)                 // ','
      {
        break;
      }
      consumeT(18);                 // ','
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
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
      lookahead2W(27);              // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' |
                                    // 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '}' | '~'
      switch (lk)
      {
      case 899:                     // identifier '('
        lookahead3W(14);            // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        break;
      case 1283:                    // identifier '.'
        lookahead3W(0);             // identifier | whitespace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 13187                 // identifier '(' identifier
     || lk == 13571                 // identifier '.' identifier
     || lk == 17283                 // identifier '(' string
     || lk == 21379                 // identifier '(' complex
     || lk == 25475                 // identifier '(' real
     || lk == 29571                 // identifier '(' comment
     || lk == 37763                 // identifier '(' '!'
     || lk == 58243                 // identifier '(' '('
     || lk == 131971                // identifier '(' '['
     || lk == 148355                // identifier '(' 'break'
     || lk == 156547                // identifier '(' 'continue'
     || lk == 160643                // identifier '(' 'do'
     || lk == 172931                // identifier '(' 'for'
     || lk == 177027                // identifier '(' 'foreach'
     || lk == 181123                // identifier '(' 'function'
     || lk == 185219                // identifier '(' 'if'
     || lk == 189315                // identifier '(' 'namespace'
     || lk == 193411                // identifier '(' 'return'
     || lk == 197507                // identifier '(' 'test'
     || lk == 201603                // identifier '(' 'throw'
     || lk == 205699                // identifier '(' 'try'
     || lk == 209795                // identifier '(' 'while'
     || lk == 213891                // identifier '(' '{'
     || lk == 230275)               // identifier '(' '~'
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
            if (l1 != 20)           // '.'
            {
              break;
            }
            consumeT(20);           // '.'
            lookahead1W(0);         // identifier | whitespace^token
            consumeT(3);            // identifier
          }
          consumeT(14);             // '('
          lookahead1W(14);          // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          try_arguments();
          consumeT(15);             // ')'
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
      consume(3);                   // identifier
      for (;;)
      {
        lookahead1W(7);             // whitespace^token | '(' | '.'
        if (l1 != 20)               // '.'
        {
          break;
        }
        consume(20);                // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consume(3);                 // identifier
      }
      consume(14);                  // '('
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_arguments();
      consume(15);                  // ')'
      break;
    default:
      consume(3);                   // identifier
      for (;;)
      {
        lookahead1W(27);            // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' |
                                    // 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '}' | '~'
        if (l1 != 20)               // '.'
        {
          break;
        }
        consume(20);                // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consume(3);                 // identifier
      }
      for (;;)
      {
        lookahead1W(26);            // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '/' | ';' | '<' |
                                    // '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' | 'break' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
        switch (l1)
        {
        case 32:                    // '['
          lookahead2W(14);          // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 224:                 // '[' identifier
            lookahead3W(23);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '`' | '|' | '||'
            break;
          case 608:                 // '[' '!'
          case 3616:                // '[' '~'
            lookahead3W(12);        // identifier | string | complex | real | whitespace^token | '(' | '[' | '{'
            break;
          case 2528:                // '[' 'do'
          case 3232:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 2848:                // '[' 'function'
          case 2976:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 288:                 // '[' string
          case 352:                 // '[' complex
          case 416:                 // '[' real
            lookahead3W(16);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | ']' | '^' | '`' | '|' | '||'
            break;
          case 480:                 // '[' comment
          case 2336:                // '[' 'break'
          case 2464:                // '[' 'continue'
            lookahead3W(11);        // whitespace^token | ',' | ';' | ']'
            break;
          case 928:                 // '[' '('
          case 2080:                // '[' '['
          case 3360:                // '[' '{'
            lookahead3W(14);        // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 2720:                // '[' 'for'
          case 2784:                // '[' 'foreach'
          case 2912:                // '[' 'if'
          case 3040:                // '[' 'return'
          case 3104:                // '[' 'test'
          case 3168:                // '[' 'throw'
          case 3296:                // '[' 'while'
            lookahead3W(1);         // whitespace^token | '('
            break;
          }
          break;
        default:
          lk = l1;
        }
        if (lk != 1                 // END
         && lk != 3                 // identifier
         && lk != 4                 // string
         && lk != 5                 // complex
         && lk != 6                 // real
         && lk != 7                 // comment
         && lk != 9                 // '!'
         && lk != 10                // '!='
         && lk != 11                // '%'
         && lk != 12                // '&'
         && lk != 13                // '&&'
         && lk != 14                // '('
         && lk != 15                // ')'
         && lk != 16                // '*'
         && lk != 17                // '+'
         && lk != 18                // ','
         && lk != 19                // '-'
         && lk != 21                // '/'
         && lk != 23                // ';'
         && lk != 24                // '<'
         && lk != 25                // '<<'
         && lk != 26                // '<='
         && lk != 27                // '='
         && lk != 28                // '=='
         && lk != 29                // '>'
         && lk != 30                // '>='
         && lk != 31                // '>>'
         && lk != 33                // ']'
         && lk != 34                // '^'
         && lk != 35                // '`'
         && lk != 36                // 'break'
         && lk != 38                // 'continue'
         && lk != 39                // 'do'
         && lk != 42                // 'for'
         && lk != 43                // 'foreach'
         && lk != 44                // 'function'
         && lk != 45                // 'if'
         && lk != 46                // 'namespace'
         && lk != 47                // 'return'
         && lk != 48                // 'test'
         && lk != 49                // 'throw'
         && lk != 50                // 'try'
         && lk != 51                // 'while'
         && lk != 52                // '{'
         && lk != 53                // '|'
         && lk != 54                // '||'
         && lk != 55                // '}'
         && lk != 56                // '~'
         && lk != 94432             // '[' identifier ';'
         && lk != 94496             // '[' string ';'
         && lk != 94560             // '[' complex ';'
         && lk != 94624             // '[' real ';'
         && lk != 94688             // '[' comment ';'
         && lk != 96544             // '[' 'break' ';'
         && lk != 96672)            // '[' 'continue' ';'
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
              consumeT(32);         // '['
              lookahead1W(14);      // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
              try_arguments();
              consumeT(33);         // ']'
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
        consume(32);                // '['
        lookahead1W(14);            // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        whitespace();
        parse_arguments();
        consume(33);                // ']'
      }
    }
    eventHandler.endNonterminal("member", e0);
  }

  function try_member()
  {
    switch (l1)
    {
    case 3:                         // identifier
      lookahead2W(27);              // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' |
                                    // 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '}' | '~'
      switch (lk)
      {
      case 899:                     // identifier '('
        lookahead3W(14);            // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        break;
      case 1283:                    // identifier '.'
        lookahead3W(0);             // identifier | whitespace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 13187                 // identifier '(' identifier
     || lk == 13571                 // identifier '.' identifier
     || lk == 17283                 // identifier '(' string
     || lk == 21379                 // identifier '(' complex
     || lk == 25475                 // identifier '(' real
     || lk == 29571                 // identifier '(' comment
     || lk == 37763                 // identifier '(' '!'
     || lk == 58243                 // identifier '(' '('
     || lk == 131971                // identifier '(' '['
     || lk == 148355                // identifier '(' 'break'
     || lk == 156547                // identifier '(' 'continue'
     || lk == 160643                // identifier '(' 'do'
     || lk == 172931                // identifier '(' 'for'
     || lk == 177027                // identifier '(' 'foreach'
     || lk == 181123                // identifier '(' 'function'
     || lk == 185219                // identifier '(' 'if'
     || lk == 189315                // identifier '(' 'namespace'
     || lk == 193411                // identifier '(' 'return'
     || lk == 197507                // identifier '(' 'test'
     || lk == 201603                // identifier '(' 'throw'
     || lk == 205699                // identifier '(' 'try'
     || lk == 209795                // identifier '(' 'while'
     || lk == 213891                // identifier '(' '{'
     || lk == 230275)               // identifier '(' '~'
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
            if (l1 != 20)           // '.'
            {
              break;
            }
            consumeT(20);           // '.'
            lookahead1W(0);         // identifier | whitespace^token
            consumeT(3);            // identifier
          }
          consumeT(14);             // '('
          lookahead1W(14);          // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          try_arguments();
          consumeT(15);             // ')'
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
      consumeT(3);                  // identifier
      for (;;)
      {
        lookahead1W(7);             // whitespace^token | '(' | '.'
        if (l1 != 20)               // '.'
        {
          break;
        }
        consumeT(20);               // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consumeT(3);                // identifier
      }
      consumeT(14);                 // '('
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_arguments();
      consumeT(15);                 // ')'
      break;
    case -3:
      break;
    default:
      consumeT(3);                  // identifier
      for (;;)
      {
        lookahead1W(27);            // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' |
                                    // 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '}' | '~'
        if (l1 != 20)               // '.'
        {
          break;
        }
        consumeT(20);               // '.'
        lookahead1W(0);             // identifier | whitespace^token
        consumeT(3);                // identifier
      }
      for (;;)
      {
        lookahead1W(26);            // END | identifier | string | complex | real | comment | whitespace^token | '!' |
                                    // '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' | '-' | '/' | ';' | '<' |
                                    // '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' | '^' | '`' | 'break' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
        switch (l1)
        {
        case 32:                    // '['
          lookahead2W(14);          // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 224:                 // '[' identifier
            lookahead3W(23);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '`' | '|' | '||'
            break;
          case 608:                 // '[' '!'
          case 3616:                // '[' '~'
            lookahead3W(12);        // identifier | string | complex | real | whitespace^token | '(' | '[' | '{'
            break;
          case 2528:                // '[' 'do'
          case 3232:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 2848:                // '[' 'function'
          case 2976:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 288:                 // '[' string
          case 352:                 // '[' complex
          case 416:                 // '[' real
            lookahead3W(16);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | ']' | '^' | '`' | '|' | '||'
            break;
          case 480:                 // '[' comment
          case 2336:                // '[' 'break'
          case 2464:                // '[' 'continue'
            lookahead3W(11);        // whitespace^token | ',' | ';' | ']'
            break;
          case 928:                 // '[' '('
          case 2080:                // '[' '['
          case 3360:                // '[' '{'
            lookahead3W(14);        // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 2720:                // '[' 'for'
          case 2784:                // '[' 'foreach'
          case 2912:                // '[' 'if'
          case 3040:                // '[' 'return'
          case 3104:                // '[' 'test'
          case 3168:                // '[' 'throw'
          case 3296:                // '[' 'while'
            lookahead3W(1);         // whitespace^token | '('
            break;
          }
          break;
        default:
          lk = l1;
        }
        if (lk != 1                 // END
         && lk != 3                 // identifier
         && lk != 4                 // string
         && lk != 5                 // complex
         && lk != 6                 // real
         && lk != 7                 // comment
         && lk != 9                 // '!'
         && lk != 10                // '!='
         && lk != 11                // '%'
         && lk != 12                // '&'
         && lk != 13                // '&&'
         && lk != 14                // '('
         && lk != 15                // ')'
         && lk != 16                // '*'
         && lk != 17                // '+'
         && lk != 18                // ','
         && lk != 19                // '-'
         && lk != 21                // '/'
         && lk != 23                // ';'
         && lk != 24                // '<'
         && lk != 25                // '<<'
         && lk != 26                // '<='
         && lk != 27                // '='
         && lk != 28                // '=='
         && lk != 29                // '>'
         && lk != 30                // '>='
         && lk != 31                // '>>'
         && lk != 33                // ']'
         && lk != 34                // '^'
         && lk != 35                // '`'
         && lk != 36                // 'break'
         && lk != 38                // 'continue'
         && lk != 39                // 'do'
         && lk != 42                // 'for'
         && lk != 43                // 'foreach'
         && lk != 44                // 'function'
         && lk != 45                // 'if'
         && lk != 46                // 'namespace'
         && lk != 47                // 'return'
         && lk != 48                // 'test'
         && lk != 49                // 'throw'
         && lk != 50                // 'try'
         && lk != 51                // 'while'
         && lk != 52                // '{'
         && lk != 53                // '|'
         && lk != 54                // '||'
         && lk != 55                // '}'
         && lk != 56                // '~'
         && lk != 94432             // '[' identifier ';'
         && lk != 94496             // '[' string ';'
         && lk != 94560             // '[' complex ';'
         && lk != 94624             // '[' real ';'
         && lk != 94688             // '[' comment ';'
         && lk != 96544             // '[' 'break' ';'
         && lk != 96672)            // '[' 'continue' ';'
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
              consumeT(32);         // '['
              lookahead1W(14);      // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
              try_arguments();
              consumeT(33);         // ']'
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
        consumeT(32);               // '['
        lookahead1W(14);            // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        try_arguments();
        consumeT(33);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(52);                    // '{'
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_element();
    for (;;)
    {
      lookahead1W(9);               // whitespace^token | ',' | '}'
      if (l1 != 18)                 // ','
      {
        break;
      }
      consume(18);                  // ','
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_element();
    }
    consume(55);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(52);                   // '{'
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_element();
    for (;;)
    {
      lookahead1W(9);               // whitespace^token | ',' | '}'
      if (l1 != 18)                 // ','
      {
        break;
      }
      consumeT(18);                 // ','
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_element();
    }
    consumeT(55);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(32);                    // '['
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_row();
    for (;;)
    {
      if (l1 != 23)                 // ';'
      {
        break;
      }
      consume(23);                  // ';'
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_row();
    }
    consume(33);                    // ']'
    eventHandler.endNonterminal("matrix", e0);
  }

  function try_matrix()
  {
    consumeT(32);                   // '['
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_row();
    for (;;)
    {
      if (l1 != 23)                 // ';'
      {
        break;
      }
      consumeT(23);                 // ';'
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_row();
    }
    consumeT(33);                   // ']'
  }

  function parse_element()
  {
    eventHandler.startNonterminal("element", e0);
    switch (l1)
    {
    case 4:                         // string
      lookahead2W(15);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '`' | '|' | '||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 1412)                 // string ':'
    {
      parse_key();
      lookahead1W(3);               // whitespace^token | ':'
      consume(22);                  // ':'
    }
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    eventHandler.endNonterminal("element", e0);
  }

  function try_element()
  {
    switch (l1)
    {
    case 4:                         // string
      lookahead2W(15);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '`' | '|' | '||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 1412)                 // string ':'
    {
      try_key();
      lookahead1W(3);               // whitespace^token | ':'
      consumeT(22);                 // ':'
    }
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
  }

  function parse_key()
  {
    eventHandler.startNonterminal("key", e0);
    consume(4);                     // string
    eventHandler.endNonterminal("key", e0);
  }

  function try_key()
  {
    consumeT(4);                    // string
  }

  function parse_row()
  {
    eventHandler.startNonterminal("row", e0);
    parse_column();
    for (;;)
    {
      lookahead1W(11);              // whitespace^token | ',' | ';' | ']'
      if (l1 != 18)                 // ','
      {
        break;
      }
      consume(18);                  // ','
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
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
      lookahead1W(11);              // whitespace^token | ',' | ';' | ']'
      if (l1 != 18)                 // ','
      {
        break;
      }
      consumeT(18);                 // ','
      lookahead1W(14);              // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
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
    consume(14);                    // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(15);                    // ')'
    eventHandler.endNonterminal("parenthesizedExpression", e0);
  }

  function try_parenthesizedExpression()
  {
    consumeT(14);                   // '('
    lookahead1W(14);                // identifier | string | complex | real | comment | whitespace^token | '!' | '(' |
                                    // '[' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(15);                   // ')'
  }

  function parse_value()
  {
    eventHandler.startNonterminal("value", e0);
    switch (l1)
    {
    case 6:                         // real
      consume(6);                   // real
      break;
    case 5:                         // complex
      consume(5);                   // complex
      break;
    case 4:                         // string
      consume(4);                   // string
      break;
    case 52:                        // '{'
      parse_array();
      break;
    default:
      parse_matrix();
    }
    eventHandler.endNonterminal("value", e0);
  }

  function try_value()
  {
    switch (l1)
    {
    case 6:                         // real
      consumeT(6);                  // real
      break;
    case 5:                         // complex
      consumeT(5);                  // complex
      break;
    case 4:                         // string
      consumeT(4);                  // string
      break;
    case 52:                        // '{'
      try_array();
      break;
    default:
      try_matrix();
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
      if (code != 8)                // whitespace^token
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
    lk = (l2 << 6) | l1;
  }

  function lookahead3W(tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = matchW(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 12;
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
    return (result & 63) - 1;
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
  for (var i = 0; i < 57; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 179 + s - 1;
    var f = MaiaScript.EXPECTED[(i0 & 3) + MaiaScript.EXPECTED[i0 >> 2]];
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
  /*   0 */ 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
  /*  36 */ 6, 7, 8, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 19, 20, 21, 22, 23, 5, 5,
  /*  65 */ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 24, 25, 26, 27, 6, 28, 29, 30,
  /*  99 */ 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50, 51, 52, 5
];

MaiaScript.MAP1 =
[
  /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  54 */ 119, 151, 255, 224, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  /*  75 */ 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 182, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  /*  96 */ 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  /* 117 */ 192, 192, 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 151 */ 1, 3, 4, 5, 6, 7, 8, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 19, 20, 21,
  /* 180 */ 22, 23, 5, 5, 5, 5, 5, 5, 5, 5, 53, 53, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  /* 215 */ 5, 5, 5, 5, 5, 5, 5, 5, 5, 28, 29, 30, 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45,
  /* 245 */ 46, 6, 47, 6, 48, 6, 49, 50, 51, 52, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  /* 279 */ 6, 6, 6, 24, 25, 26, 27, 6
];

MaiaScript.MAP2 =
[
  /* 0 */ 57344, 65536, 65533, 1114111, 5, 5
];

MaiaScript.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 527, 18, 19, 20, 533, 22, 23, 536, 537, 538, 539
];

MaiaScript.TRANSITION =
[
  /*    0 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*   18 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1760, 1760, 1760, 1764,
  /*   36 */ 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*   54 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1760, 1760, 1760, 1764, 1775, 1774, 1775, 1775,
  /*   72 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*   90 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1883, 1784, 1791, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775,
  /*  108 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  126 */ 1775, 1775, 1775, 1768, 1802, 1772, 1775, 1824, 1775, 1775, 1775, 1872, 2924, 1775, 1775, 1775, 1775, 1775,
  /*  144 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  162 */ 1775, 1775, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  180 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 2072, 3167,
  /*  198 */ 2073, 2067, 2071, 2771, 2521, 2071, 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2071, 2070, 2071, 2772, 1775,
  /*  216 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2377, 1835, 1833, 1775, 1774, 1775, 1775, 1775, 1775,
  /*  234 */ 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  252 */ 1775, 1775, 1775, 1775, 1775, 2438, 1845, 1843, 1775, 1774, 2530, 1775, 1775, 1775, 2924, 1775, 1775, 1775,
  /*  270 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  288 */ 1853, 1856, 1864, 1869, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  306 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1880, 1896, 1891, 1907,
  /*  324 */ 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  342 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2557, 1921, 1919, 1775, 1929, 1775, 1775,
  /*  360 */ 1775, 1825, 1945, 1775, 1775, 1775, 1941, 1775, 1775, 1974, 1953, 1775, 1954, 1775, 1775, 1775, 1775, 1775,
  /*  378 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1911, 1963, 1970, 1775, 1982, 1775, 1775, 1775, 1775, 3212, 1775,
  /*  396 */ 1775, 1775, 1994, 1775, 1775, 1776, 2020, 1775, 2030, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  414 */ 1775, 1775, 1775, 2039, 2048, 2046, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775,
  /*  432 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1933,
  /*  450 */ 2056, 2063, 1775, 2081, 1775, 1775, 1775, 1775, 3212, 1775, 1775, 1775, 2093, 1775, 1775, 1776, 2020, 1775,
  /*  468 */ 2030, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2617, 1775, 2618, 2118, 1775, 2130,
  /*  486 */ 1775, 1775, 1775, 2608, 2494, 1775, 1775, 1775, 2142, 1775, 1775, 2608, 2152, 1775, 1775, 1775, 1775, 1775,
  /*  504 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2144, 2162, 2169, 1775, 2181, 1775, 1775, 1775, 1872,
  /*  522 */ 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  540 */ 1775, 1775, 1775, 1775, 1775, 3116, 2198, 3120, 2072, 2206, 2073, 2067, 2071, 2876, 2218, 2071, 2071, 2072,
  /*  558 */ 2231, 2071, 2071, 2012, 2249, 2071, 2259, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  576 */ 1775, 3116, 2198, 3120, 2072, 2268, 2073, 2067, 2071, 2241, 2285, 2071, 2071, 2072, 2299, 2071, 2071, 2277,
  /*  594 */ 2318, 2071, 2328, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2499, 2653, 1775, 1775,
  /*  612 */ 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  630 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 3324, 2337, 2349, 2354, 1775, 1774, 1775, 1775,
  /*  648 */ 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  666 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2742, 2368, 2366, 1775, 1774, 1775, 2376, 1775, 1775, 2924, 1775,
  /*  684 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  702 */ 1775, 1775, 1775, 2781, 2387, 2385, 1775, 1774, 2154, 2395, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775,
  /*  720 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2885,
  /*  738 */ 2409, 2407, 1775, 1774, 1775, 2417, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  756 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 3343, 2429, 3347, 1775, 1774,
  /*  774 */ 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  792 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2437, 1775, 1775, 1775, 1872,
  /*  810 */ 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  828 */ 1775, 1775, 1775, 1775, 1775, 2446, 2460, 2458, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775,
  /*  846 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  864 */ 1775, 3008, 2470, 2468, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  882 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 3140, 2480, 2478,
  /*  900 */ 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  918 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 2310, 2008, 1809, 2488, 3079,
  /*  936 */ 2071, 2771, 2521, 2071, 3261, 2072, 2031, 2071, 2251, 2772, 2100, 2071, 2070, 2511, 2772, 1775, 1775, 1775,
  /*  954 */ 1775, 1775, 1775, 1775, 1775, 1775, 2529, 2173, 2538, 2545, 2072, 3167, 2073, 2067, 2071, 2999, 2521, 2071,
  /*  972 */ 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2071, 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /*  990 */ 1775, 1775, 2556, 2503, 2565, 2573, 2072, 3167, 2073, 2067, 2071, 2771, 2521, 2071, 2952, 2072, 1955, 3029,
  /* 1008 */ 2585, 2772, 2069, 2071, 2594, 3130, 2605, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2616, 2341,
  /* 1026 */ 2626, 2633, 2072, 3167, 2073, 2067, 2071, 2771, 2521, 2071, 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2071,
  /* 1044 */ 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2652, 2358, 2645, 2661, 2637, 2673,
  /* 1062 */ 2110, 2122, 2071, 2982, 2865, 2071, 2577, 2686, 2697, 3278, 2710, 2860, 2720, 2730, 2721, 2722, 3100, 1775,
  /* 1080 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2741, 2399, 2750, 2757, 2291, 3167, 2769, 2067, 2071, 2999,
  /* 1098 */ 2521, 2071, 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2071, 2548, 2071, 2772, 1775, 1775, 1775, 1775, 1775,
  /* 1116 */ 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 3032, 3167, 2665, 2067, 2071, 2771, 2521, 2071, 2071, 2072,
  /* 1134 */ 1955, 2071, 2290, 2772, 2069, 3052, 2070, 3194, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1152 */ 2780, 2421, 2789, 2796, 2072, 3167, 2073, 2067, 2071, 2678, 2808, 2320, 2071, 2072, 1955, 2071, 2835, 2772,
  /* 1170 */ 2831, 2823, 2843, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126,
  /* 1188 */ 2072, 3167, 2073, 2067, 2071, 2771, 2521, 2071, 2071, 2072, 1955, 2071, 3189, 2772, 2855, 2071, 2070, 2071,
  /* 1206 */ 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 2873, 3167, 2073, 2134,
  /* 1224 */ 2906, 2771, 2521, 2071, 2071, 1816, 1955, 2329, 2071, 2772, 2069, 2071, 2070, 2071, 2772, 1775, 1775, 1775,
  /* 1242 */ 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 2072, 3167, 2073, 2067, 2733, 2771, 2521, 3183,
  /* 1260 */ 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2071, 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1278 */ 1775, 1775, 2884, 3351, 2893, 2900, 2072, 3167, 2073, 2067, 2914, 2999, 2190, 2932, 2071, 2072, 1955, 2071,
  /* 1296 */ 2071, 2772, 2069, 2847, 2946, 2071, 2960, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168,
  /* 1314 */ 3123, 2223, 2238, 2972, 2980, 3067, 2071, 2771, 2521, 2071, 2071, 3198, 1955, 3263, 2071, 2772, 2069, 2071,
  /* 1332 */ 2070, 2990, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 2072, 3167,
  /* 1350 */ 2073, 2067, 2071, 2771, 2521, 2071, 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2712, 2210, 2071, 2772, 1775,
  /* 1368 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 3007, 2450, 3016, 3023, 2597, 3040, 3282, 2067, 2105, 3162,
  /* 1386 */ 3225, 2761, 2071, 2072, 1955, 2071, 2071, 3063, 2702, 2071, 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775,
  /* 1404 */ 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 2072, 3167, 2073, 2067, 3094, 3075, 2521, 2813, 3087, 2072,
  /* 1422 */ 1955, 2071, 2071, 3112, 3239, 2071, 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1440 */ 3139, 3104, 3148, 3155, 2072, 3167, 2073, 2085, 2260, 2999, 2521, 2938, 2818, 2273, 1955, 3176, 2586, 2772,
  /* 1458 */ 2001, 2071, 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126,
  /* 1476 */ 2306, 3167, 3206, 2067, 2071, 2920, 2521, 3131, 2071, 2996, 1955, 2800, 2071, 2772, 2069, 2071, 3129, 3046,
  /* 1494 */ 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 3233, 2964, 3247, 3254, 2072, 3167, 2073, 2067,
  /* 1512 */ 2071, 2771, 2521, 2071, 2071, 2072, 1955, 2071, 2071, 2517, 2069, 3271, 2070, 2071, 2772, 1775, 1775, 1775,
  /* 1530 */ 1775, 1775, 1775, 1775, 1775, 1775, 2607, 3168, 3123, 3126, 2072, 3167, 2073, 2067, 2071, 2689, 2521, 3055,
  /* 1548 */ 2071, 2072, 1955, 2071, 2071, 2772, 2069, 2071, 2070, 2071, 2772, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1566 */ 1775, 1775, 1794, 3217, 3290, 3221, 1775, 1774, 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775,
  /* 1584 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2022,
  /* 1602 */ 3300, 3298, 1775, 1774, 1775, 2186, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1620 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 3308, 3312, 3320, 1775, 1774,
  /* 1638 */ 1775, 1775, 1775, 1775, 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1656 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1899, 3332, 3339, 1775, 1774, 1775, 1775, 1775, 1775,
  /* 1674 */ 2924, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1692 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1774, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1710 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1728 */ 1775, 1775, 1986, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775,
  /* 1746 */ 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 1775, 2332, 2332, 2332, 2332,
  /* 1764 */ 2332, 2332, 2332, 2332, 0, 0, 0, 0, 41, 41, 41, 0, 0, 0, 0, 0, 0, 0, 0, 42, 55, 2560, 2560, 2560, 2560,
  /* 1789 */ 2560, 55, 2560, 2615, 2615, 0, 0, 0, 0, 0, 0, 13568, 0, 0, 41, 41, 41, 41, 41, 0, 41, 0, 0, 0, 0, 1053,
  /* 1815 */ 1088, 1053, 29, 1053, 1053, 1053, 1053, 1134, 140, 1280, 0, 0, 0, 0, 0, 0, 0, 81, 0, 3072, 3072, 0, 0, 0,
  /* 1839 */ 0, 0, 3072, 0, 0, 3384, 3384, 0, 0, 0, 0, 0, 3384, 0, 0, 3840, 0, 0, 0, 0, 0, 3840, 3840, 3840, 0, 0, 3840,
  /* 1866 */ 3840, 3840, 3840, 3840, 3840, 3840, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 4096, 0, 0, 0, 0, 0, 2560, 2560, 55, 0,
  /* 1892 */ 4096, 0, 0, 0, 4096, 0, 4096, 0, 0, 0, 0, 0, 14592, 14592, 0, 4096, 4096, 4096, 0, 0, 0, 0, 0, 42, 42, 42,
  /* 1918 */ 4608, 0, 4352, 4352, 0, 0, 0, 0, 0, 4352, 0, 41, 0, 0, 81, 0, 0, 0, 0, 43, 43, 43, 5120, 0, 81, 0, 81, 0,
  /* 1946 */ 0, 81, 0, 2133, 0, 0, 0, 81, 81, 0, 0, 0, 0, 0, 0, 0, 1053, 4608, 42, 42, 42, 42, 42, 4608, 42, 4650, 4650,
  /* 1973 */ 0, 0, 0, 0, 0, 81, 0, 81, 81, 41, 0, 0, 42, 0, 0, 0, 0, 768, 0, 0, 0, 0, 142, 142, 42, 0, 0, 42, 0, 0,
  /* 2003 */ 1053, 1053, 1053, 1188, 1053, 1053, 1091, 1053, 1094, 1053, 1053, 1053, 0, 141, 143, 143, 1936, 117, 42, 0,
  /* 2023 */ 0, 0, 0, 0, 0, 0, 13884, 142, 0, 0, 0, 0, 0, 0, 0, 1171, 0, 4864, 4864, 4864, 0, 0, 0, 4864, 4864, 4864, 0,
  /* 2050 */ 0, 0, 0, 0, 4864, 4864, 5120, 43, 43, 43, 43, 43, 5120, 43, 5163, 5163, 0, 0, 0, 0, 0, 1053, 1053, 1053,
  /* 2074 */ 1053, 1053, 1053, 1053, 1053, 0, 0, 41, 79, 79, 42, 0, 0, 0, 0, 1053, 1053, 1053, 1123, 0, 142, 142, 42,
  /* 2097 */ 79, 0, 42, 0, 0, 1053, 1053, 1187, 1053, 1053, 1053, 103, 1053, 1053, 1053, 1053, 1115, 1116, 1053, 0, 0,
  /* 2118 */ 0, 0, 5376, 0, 0, 0, 0, 0, 1053, 1053, 1122, 1053, 41, 0, 0, 82, 0, 0, 0, 0, 1053, 1121, 1053, 1053, 0,
  /* 2143 */ 113, 0, 0, 0, 0, 0, 0, 45, 5632, 113, 113, 0, 0, 0, 0, 0, 0, 2816, 0, 5632, 45, 45, 45, 45, 45, 5632, 45,
  /* 2170 */ 5677, 5677, 0, 0, 0, 0, 0, 1054, 1054, 1070, 0, 41, 0, 0, 0, 2133, 0, 0, 0, 14080, 0, 0, 0, 0, 2133, 1053,
  /* 2196 */ 1145, 1053, 0, 1836, 1836, 1836, 1836, 1836, 0, 1836, 41, 80, 1836, 1836, 0, 1053, 1053, 1053, 1198, 1053,
  /* 2216 */ 1053, 1053, 0, 1908, 1836, 1911, 2133, 1053, 1053, 1053, 0, 1053, 1053, 1089, 29, 141, 80, 143, 1936, 1938,
  /* 2236 */ 1911, 1938, 1053, 1092, 1053, 1053, 1053, 1053, 1053, 0, 0, 80, 114, 1936, 1938, 1053, 1053, 1053, 1053,
  /* 2255 */ 1053, 1053, 1123, 1053, 141, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1131, 41, 80, 1836, 1875, 0, 1053,
  /* 2274 */ 1053, 1053, 29, 1053, 1053, 1053, 0, 161, 143, 143, 1937, 0, 1908, 1875, 1911, 2133, 1053, 1053, 1053, 29,
  /* 2294 */ 1053, 1053, 1053, 1053, 0, 141, 114, 143, 1937, 1938, 1911, 1938, 1053, 1093, 1053, 1095, 1053, 1053, 1053,
  /* 2313 */ 0, 1053, 1053, 1088, 1053, 1937, 1938, 1053, 1053, 1053, 1053, 1053, 1053, 1152, 1053, 161, 1053, 1053,
  /* 2331 */ 1053, 1053, 1053, 1053, 1053, 1178, 6144, 0, 0, 6144, 0, 0, 0, 0, 1056, 1056, 1072, 0, 6144, 0, 6144, 0, 0,
  /* 2354 */ 6144, 6144, 6144, 0, 0, 0, 0, 0, 1057, 1057, 1057, 0, 0, 6457, 6457, 0, 0, 0, 0, 0, 6457, 0, 6656, 0, 0, 0,
  /* 2380 */ 0, 0, 0, 0, 3072, 0, 7226, 7226, 0, 0, 0, 0, 0, 7226, 0, 6912, 7424, 7936, 0, 0, 0, 0, 0, 1058, 1058, 1073,
  /* 2406 */ 0, 0, 7739, 7739, 0, 0, 0, 0, 0, 7739, 0, 0, 0, 8192, 0, 0, 0, 0, 0, 1059, 1059, 1074, 0, 0, 8448, 8448,
  /* 2432 */ 8448, 8448, 8448, 8448, 8448, 78, 0, 0, 0, 0, 0, 0, 0, 3384, 0, 0, 8704, 8704, 0, 0, 0, 0, 1061, 1061,
  /* 2456 */ 1076, 0, 8704, 8704, 8704, 0, 0, 0, 0, 0, 8704, 8704, 0, 8960, 8960, 0, 0, 0, 0, 0, 8960, 0, 0, 9216, 9216,
  /* 2481 */ 0, 0, 0, 0, 0, 9216, 0, 1091, 1053, 1114, 1053, 1053, 1053, 0, 0, 82, 0, 2133, 0, 0, 0, 5888, 0, 0, 0, 0,
  /* 2507 */ 1055, 1055, 1071, 0, 1053, 1199, 1053, 1053, 1053, 1202, 1053, 1053, 29, 0, 0, 0, 0, 0, 2133, 1053, 1053,
  /* 2528 */ 1053, 1054, 0, 0, 0, 0, 0, 0, 0, 3584, 0, 1070, 1070, 1070, 1070, 1070, 0, 1070, 1070, 1070, 0, 1053, 1053,
  /* 2551 */ 1053, 1053, 1053, 10781, 1053, 1055, 0, 0, 0, 0, 0, 0, 0, 4352, 0, 1071, 1071, 1071, 1071, 1071, 0, 1085,
  /* 2573 */ 1071, 1071, 1071, 0, 1053, 1053, 1053, 1053, 134, 1053, 1159, 1053, 1179, 1053, 1053, 1053, 1053, 1053,
  /* 2591 */ 1053, 1053, 1182, 0, 1053, 1196, 1053, 1053, 1053, 1053, 1053, 1099, 1053, 0, 1053, 1203, 1053, 0, 0, 0, 0,
  /* 2612 */ 0, 0, 0, 113, 1056, 0, 0, 0, 0, 0, 0, 0, 5376, 0, 0, 1072, 1072, 1072, 1072, 1072, 0, 1072, 1072, 1072, 0,
  /* 2637 */ 1053, 1053, 1053, 1053, 1096, 1097, 1053, 0, 0, 1057, 1057, 1057, 1057, 1057, 0, 1057, 0, 0, 0, 0, 0, 0, 0,
  /* 2660 */ 5888, 1086, 1057, 1057, 0, 1053, 1053, 1053, 1053, 1117, 1119, 0, 0, 41, 0, 0, 84, 0, 1053, 1053, 1053,
  /* 2681 */ 1135, 112, 0, 0, 0, 1161, 1053, 1053, 1053, 1053, 29, 1053, 0, 0, 0, 0, 0, 115, 0, 84, 0, 0, 0, 1053, 1053,
  /* 2706 */ 1053, 1053, 1053, 1190, 1053, 10652, 1053, 1053, 1053, 1053, 1053, 1053, 1194, 1053, 84, 115, 1053, 1053,
  /* 2724 */ 1053, 1053, 1053, 1053, 1053, 10013, 1053, 13341, 1053, 1053, 1053, 1053, 1053, 1053, 1129, 1053, 1053,
  /* 2741 */ 1058, 0, 0, 0, 0, 0, 0, 0, 6457, 0, 1073, 1073, 1073, 1073, 1073, 0, 1073, 1073, 1073, 0, 1053, 1053, 1053,
  /* 2764 */ 1053, 1151, 1053, 1053, 1053, 1053, 11805, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 1059, 0, 0, 0, 0, 0, 0,
  /* 2787 */ 0, 7226, 0, 1074, 1074, 1074, 1074, 1074, 0, 1074, 1074, 1074, 0, 1053, 1053, 1053, 1053, 1176, 1053, 1053,
  /* 2807 */ 1053, 1536, 0, 0, 0, 2133, 1053, 1053, 1053, 1150, 1053, 1053, 1053, 1053, 1157, 1053, 1053, 1053, 1053,
  /* 2826 */ 1191, 1053, 1193, 1053, 1053, 0, 0, 1053, 1186, 1053, 1053, 1053, 1053, 1181, 1059, 1053, 1053, 0, 1053,
  /* 2845 */ 1053, 1197, 1053, 1053, 1053, 1053, 1192, 1053, 1053, 29, 0, 0, 9501, 1053, 1053, 1053, 1053, 1053, 13312,
  /* 2864 */ 115, 0, 0, 84, 0, 2133, 1144, 1053, 1053, 1090, 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 80, 80, 1060, 0,
  /* 2886 */ 0, 0, 0, 0, 0, 0, 7739, 0, 1075, 1075, 1075, 1075, 1075, 0, 1075, 1075, 1075, 0, 1053, 1053, 1053, 1053,
  /* 2908 */ 1126, 1053, 1053, 1053, 1130, 1053, 1124, 1053, 1053, 1053, 1128, 1053, 1053, 1053, 1134, 1053, 0, 0, 0, 0,
  /* 2928 */ 2133, 0, 0, 0, 1147, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1149, 1053, 1053, 1053, 1053, 1153, 0, 1195,
  /* 2948 */ 1053, 1053, 1053, 12317, 1053, 1053, 1156, 1053, 1053, 1053, 1053, 1160, 11549, 1053, 1053, 0, 0, 0, 0, 0,
  /* 2968 */ 1063, 1063, 1078, 0, 41, 0, 0, 0, 0, 1053, 1111, 10269, 1112, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 115,
  /* 2990 */ 1184, 1053, 1053, 1053, 1201, 1053, 1053, 1053, 1162, 1053, 1053, 1053, 1053, 0, 41, 0, 0, 1061, 0, 0, 0,
  /* 3011 */ 0, 0, 0, 0, 8960, 0, 1076, 1076, 1076, 1076, 1076, 0, 1076, 1076, 1076, 0, 1053, 1087, 1053, 1053, 1174,
  /* 3032 */ 1053, 1053, 1053, 1053, 1053, 1098, 1100, 77, 41, 0, 0, 0, 0, 1110, 1053, 1053, 1200, 1053, 1053, 1053,
  /* 3052 */ 1053, 1053, 9757, 1053, 1053, 1053, 1053, 1053, 13085, 1053, 1053, 1053, 1184, 1053, 0, 0, 0, 0, 0, 1111,
  /* 3072 */ 1053, 1053, 1053, 1132, 1053, 1053, 1053, 0, 0, 0, 0, 1120, 1053, 1053, 1053, 1154, 1053, 1053, 1053, 1053,
  /* 3092 */ 1134, 1053, 1053, 1125, 1053, 1053, 1053, 1053, 1053, 1053, 12061, 0, 0, 0, 0, 0, 1062, 1062, 1077, 0,
  /* 3112 */ 1183, 1053, 1053, 0, 0, 0, 0, 0, 1836, 1836, 1836, 0, 1053, 1053, 1053, 1053, 1053, 0, 1053, 1053, 1053,
  /* 3133 */ 1053, 1053, 1053, 1134, 1053, 1053, 1062, 0, 0, 0, 0, 0, 0, 0, 9216, 0, 1077, 1077, 1077, 1077, 1077, 0,
  /* 3155 */ 1077, 1077, 1077, 0, 1053, 1053, 1053, 1053, 1133, 1053, 1053, 0, 41, 0, 0, 0, 0, 1053, 1053, 1053, 0,
  /* 3176 */ 1172, 1053, 1053, 1053, 1053, 12573, 1053, 1053, 1148, 1053, 1053, 1053, 1053, 1053, 1053, 29, 1053, 1053,
  /* 3194 */ 1053, 1053, 1053, 11293, 1053, 1053, 1053, 1053, 1163, 1053, 1053, 0, 1113, 1053, 1095, 1053, 1053, 1053,
  /* 3212 */ 0, 0, 117, 118, 2133, 0, 0, 0, 0, 13568, 13568, 13568, 0, 0, 0, 0, 0, 2133, 1053, 1053, 11130, 1063, 0, 0,
  /* 3236 */ 0, 0, 40, 0, 0, 1053, 1053, 1053, 1053, 1189, 1053, 0, 1078, 1078, 1078, 1078, 1078, 0, 1078, 1078, 1078,
  /* 3257 */ 0, 1053, 1053, 1053, 1053, 1155, 1053, 1053, 1053, 1053, 1053, 1053, 1177, 1053, 12829, 1053, 1053, 1053,
  /* 3275 */ 1053, 1053, 1053, 1053, 1173, 1053, 1175, 1053, 1053, 1053, 1053, 1118, 1053, 0, 0, 0, 13568, 13568, 13568,
  /* 3294 */ 13568, 13568, 0, 13568, 0, 13884, 13884, 0, 0, 0, 0, 0, 13884, 0, 0, 14336, 0, 0, 0, 0, 0, 14336, 0, 0, 0,
  /* 3319 */ 14336, 14336, 14336, 14336, 0, 0, 0, 0, 0, 6144, 0, 0, 0, 0, 14592, 14592, 14592, 14592, 14592, 0, 14592,
  /* 3340 */ 14592, 14592, 0, 0, 0, 0, 0, 8448, 8448, 8448, 0, 0, 0, 0, 0, 1060, 1060, 1075, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 90, 94, 98, 102, 106, 110, 113, 125, 125, 126, 117, 124, 125, 141, 130, 125, 125, 125, 125, 133, 118, 124,
  /*  22 */ 125, 125, 125, 125, 125, 126, 135, 119, 125, 125, 125, 125, 126, 135, 120, 125, 125, 125, 139, 125, 125,
  /*  43 */ 125, 126, 182, 145, 152, 156, 160, 163, 167, 182, 182, 184, 182, 173, 177, 181, 169, 203, 182, 182, 183,
  /*  64 */ 182, 182, 188, 192, 200, 182, 182, 182, 184, 182, 147, 208, 194, 203, 182, 184, 182, 148, 209, 196, 182,
  /*  85 */ 207, 213, 206, 218, 217, 264, 16640, 33024, 4194560, 8388864, 256, 256, 1065216, 8421632, 262400, 295168,
  /* 101 */ 8651008, 16760, 17272, 17400, -9487104, -5292800, 50168, 8406008, 17400, 17404, 8438776, -4227840, 8700920,
  /* 114 */ -5242888, -4194312, 256, 16, 32, 96, 96, 96, 8, 8, 128, 8, 8, 8, 8, 0, 100663296, 268435456, -1073741824, 0,
  /* 134 */ 16, 32, 32, 32, 96, 32, 8, 8, 8, 1024, 8192, 524288, 1048576, 0, 0, 16, 64, 2048, 8388608, 2, 2, 1048577,
  /* 156 */ 17825793, 18873553, 14680076, 6291470, 18873553, 18873553, 27262161, 18873553, 6291471, 27262195, 27262931,
  /* 167 */ 33553631, 33553631, 0, 0, 4194304, 96, 16, 64, 128, 7168, 8192, 16384, 32768, 458752, 524288, 0, 0, 0, 0,
  /* 186 */ 524288, 0, 16, 64, 3072, 4096, 16384, 32768, 65536, 131072, 524288, 32, 512, 0, 262144, 524288, 32, 768, 0,
  /* 205 */ 0, 0, 64, 2048, 4096, 16384, 32768, 131072, 32768, 512, 0, 0, 16384, 16384, 0, 64, 4096
];

MaiaScript.TOKEN =
[
  "(0)",
  "END",
  "eof",
  "identifier",
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
  "';'",
  "'<'",
  "'<<'",
  "'<='",
  "'='",
  "'=='",
  "'>'",
  "'>='",
  "'>>'",
  "'['",
  "']'",
  "'^'",
  "'`'",
  "'break'",
  "'catch'",
  "'continue'",
  "'do'",
  "'else'",
  "'elseif'",
  "'for'",
  "'foreach'",
  "'function'",
  "'if'",
  "'namespace'",
  "'return'",
  "'test'",
  "'throw'",
  "'try'",
  "'while'",
  "'{'",
  "'|'",
  "'||'",
  "'}'",
  "'~'"
];

// End
