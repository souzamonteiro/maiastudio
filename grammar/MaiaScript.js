// This file was generated on Mon Oct 26, 2020 10:55 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -javascript -backtrack -tree

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
                                    // comment | whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
    switch (l1)
    {
    case 2:                         // eof
      consume(2);                   // eof
      break;
    default:
      for (;;)
      {
        lookahead1W(16);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
      if (l1 != 30)                 // '='
      {
        break;
      }
      consume(30);                  // '='
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
      if (l1 != 30)                 // '='
      {
        break;
      }
      consumeT(30);                 // '='
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
      if (l1 != 56)                 // '||'
      {
        break;
      }
      consume(56);                  // '||'
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
      if (l1 != 56)                 // '||'
      {
        break;
      }
      consumeT(56);                 // '||'
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
      if (l1 != 58)                 // '||||'
      {
        break;
      }
      consume(58);                  // '||||'
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
      if (l1 != 58)                 // '||||'
      {
        break;
      }
      consumeT(58);                 // '||||'
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
      if (l1 != 55)                 // '|'
      {
        break;
      }
      consume(55);                  // '|'
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
      if (l1 != 55)                 // '|'
      {
        break;
      }
      consumeT(55);                 // '|'
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
      if (l1 != 57)                 // '|||'
      {
        break;
      }
      consume(57);                  // '|||'
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
      if (l1 != 57)                 // '|||'
      {
        break;
      }
      consumeT(57);                 // '|||'
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
       && l1 != 31)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 31:                      // '=='
        consume(31);                // '=='
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
       && l1 != 31)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 31:                      // '=='
        consumeT(31);               // '=='
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
      if (l1 != 27                  // '<'
       && l1 != 29                  // '<='
       && l1 != 32                  // '>'
       && l1 != 33)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 27:                      // '<'
        consume(27);                // '<'
        break;
      case 32:                      // '>'
        consume(32);                // '>'
        break;
      case 29:                      // '<='
        consume(29);                // '<='
        break;
      default:
        consume(33);                // '>='
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
      if (l1 != 27                  // '<'
       && l1 != 29                  // '<='
       && l1 != 32                  // '>'
       && l1 != 33)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 27:                      // '<'
        consumeT(27);               // '<'
        break;
      case 32:                      // '>'
        consumeT(32);               // '>'
        break;
      case 29:                      // '<='
        consumeT(29);               // '<='
        break;
      default:
        consumeT(33);               // '>='
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
      if (l1 != 28                  // '<<'
       && l1 != 34)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '<<'
        consume(28);                // '<<'
        break;
      default:
        consume(34);                // '>>'
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
      if (l1 != 28                  // '<<'
       && l1 != 34)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '<<'
        consumeT(28);               // '<<'
        break;
      default:
        consumeT(34);               // '>>'
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
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
      if (l1 != 37)                 // '^'
      {
        break;
      }
      consume(37);                  // '^'
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
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
      if (l1 != 37)                 // '^'
      {
        break;
      }
      consumeT(37);                 // '^'
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
    case 60:                        // '~'
      consume(60);                  // '~'
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
    case 60:                        // '~'
      consumeT(60);                 // '~'
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
    case 48:                        // 'namespace'
      parse_namespace();
      break;
    case 46:                        // 'function'
      parse_function();
      break;
    case 47:                        // 'if'
      parse_if();
      break;
    case 41:                        // 'do'
      parse_do();
      break;
    case 53:                        // 'while'
      parse_while();
      break;
    case 44:                        // 'for'
      parse_for();
      break;
    case 45:                        // 'foreach'
      parse_foreach();
      break;
    case 52:                        // 'try'
      parse_try();
      break;
    case 50:                        // 'test'
      parse_test();
      break;
    case 38:                        // 'break'
      parse_break();
      break;
    case 40:                        // 'continue'
      parse_continue();
      break;
    case 49:                        // 'return'
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
    case 48:                        // 'namespace'
      try_namespace();
      break;
    case 46:                        // 'function'
      try_function();
      break;
    case 47:                        // 'if'
      try_if();
      break;
    case 41:                        // 'do'
      try_do();
      break;
    case 53:                        // 'while'
      try_while();
      break;
    case 44:                        // 'for'
      try_for();
      break;
    case 45:                        // 'foreach'
      try_foreach();
      break;
    case 52:                        // 'try'
      try_try();
      break;
    case 50:                        // 'test'
      try_test();
      break;
    case 38:                        // 'break'
      try_break();
      break;
    case 40:                        // 'continue'
      try_continue();
      break;
    case 49:                        // 'return'
      try_return();
      break;
    default:
      try_throw();
    }
  }

  function parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
    consume(48);                    // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    consumeT(48);                   // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_function()
  {
    eventHandler.startNonterminal("function", e0);
    consume(46);                    // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_arguments();
    }
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("function", e0);
  }

  function try_function()
  {
    consumeT(46);                   // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_arguments();
    }
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_if()
  {
    eventHandler.startNonterminal("if", e0);
    consume(47);                    // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' |
                                    // 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 != 43)                 // 'elseif'
      {
        break;
      }
      whitespace();
      parse_elseif();
    }
    if (l1 == 42)                   // 'else'
    {
      whitespace();
      parse_else();
    }
    eventHandler.endNonterminal("if", e0);
  }

  function try_if()
  {
    consumeT(47);                   // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' |
                                    // 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 != 43)                 // 'elseif'
      {
        break;
      }
      try_elseif();
    }
    if (l1 == 42)                   // 'else'
    {
      try_else();
    }
  }

  function parse_elseif()
  {
    eventHandler.startNonterminal("elseif", e0);
    consume(43);                    // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("elseif", e0);
  }

  function try_elseif()
  {
    consumeT(43);                   // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(42);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(42);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(41);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(53);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("do", e0);
  }

  function try_do()
  {
    consumeT(41);                   // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(53);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(53);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(53);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_for()
  {
    eventHandler.startNonterminal("for", e0);
    consume(44);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("for", e0);
  }

  function try_for()
  {
    consumeT(44);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
    consume(45);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("foreach", e0);
  }

  function try_foreach()
  {
    consumeT(45);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(52);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 39)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(52);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 39)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(50);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18                    // ')'
     && l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(8);                 // whitespace^token | ')' | ';'
    if (l1 == 26)                   // ';'
    {
      consume(26);                  // ';'
      lookahead1W(22);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18                  // ')'
       && l1 != 26)                 // ';'
      {
        whitespace();
        parse_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 26)                 // ';'
      {
        consume(26);                // ';'
        lookahead1W(17);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 39)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(50);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18                    // ')'
     && l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(8);                 // whitespace^token | ')' | ';'
    if (l1 == 26)                   // ';'
    {
      consumeT(26);                 // ';'
      lookahead1W(22);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18                  // ')'
       && l1 != 26)                 // ';'
      {
        try_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 26)                 // ';'
      {
        consumeT(26);               // ';'
        lookahead1W(17);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
        if (l1 != 18)               // ')'
        {
          try_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 39)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_catch()
  {
    eventHandler.startNonterminal("catch", e0);
    consume(39);                    // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(54);                    // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("catch", e0);
  }

  function try_catch()
  {
    consumeT(39);                   // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(54);                   // '{'
    for (;;)
    {
      lookahead1W(19);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 59)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(59);                   // '}'
  }

  function parse_break()
  {
    eventHandler.startNonterminal("break", e0);
    consume(38);                    // 'break'
    eventHandler.endNonterminal("break", e0);
  }

  function try_break()
  {
    consumeT(38);                   // 'break'
  }

  function parse_continue()
  {
    eventHandler.startNonterminal("continue", e0);
    consume(40);                    // 'continue'
    eventHandler.endNonterminal("continue", e0);
  }

  function try_continue()
  {
    consumeT(40);                   // 'continue'
  }

  function parse_return()
  {
    eventHandler.startNonterminal("return", e0);
    consume(49);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    consumeT(49);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    consume(51);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    consumeT(51);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    case 35:                        // '['
    case 54:                        // '{'
    case 60:                        // '~'
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
    case 35:                        // '['
    case 54:                        // '{'
    case 60:                        // '~'
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
                                    // whitespace^token | '!' | '(' | ')' | ',' | '[' | ']' | 'break' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | ')' | ',' | '[' | ']' | 'break' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // '-' | '.' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '[' | ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '|||' | '||||' | '}' | '~'
      switch (lk)
      {
      case 1091:                    // identifier '('
        lookahead3W(17);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
        break;
      case 1475:                    // identifier '.'
        lookahead3W(0);             // identifier | whitespace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 13379                 // identifier '(' identifier
     || lk == 13763                 // identifier '.' identifier
     || lk == 17475                 // identifier '(' null
     || lk == 21571                 // identifier '(' true
     || lk == 25667                 // identifier '(' false
     || lk == 29763                 // identifier '(' string
     || lk == 33859                 // identifier '(' complex
     || lk == 37955                 // identifier '(' real
     || lk == 42051                 // identifier '(' comment
     || lk == 50243                 // identifier '(' '!'
     || lk == 70723                 // identifier '(' '('
     || lk == 144451                // identifier '(' '['
     || lk == 156739                // identifier '(' 'break'
     || lk == 164931                // identifier '(' 'continue'
     || lk == 169027                // identifier '(' 'do'
     || lk == 181315                // identifier '(' 'for'
     || lk == 185411                // identifier '(' 'foreach'
     || lk == 189507                // identifier '(' 'function'
     || lk == 193603                // identifier '(' 'if'
     || lk == 197699                // identifier '(' 'namespace'
     || lk == 201795                // identifier '(' 'return'
     || lk == 205891                // identifier '(' 'test'
     || lk == 209987                // identifier '(' 'throw'
     || lk == 214083                // identifier '(' 'try'
     || lk == 218179                // identifier '(' 'while'
     || lk == 222275                // identifier '(' '{'
     || lk == 246851)               // identifier '(' '~'
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
            lookahead1W(17);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    case 74819:                     // identifier '(' ')'
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
        lookahead1W(17);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // '-' | '.' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '[' | ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '|||' | '||||' | '}' | '~'
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
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
        switch (l1)
        {
        case 35:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 227:                 // '[' identifier
            lookahead3W(20);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '|' | '||' | '|||' | '||||'
            break;
          case 2275:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 803:                 // '[' '!'
          case 3875:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 1123:                // '[' '('
          case 3491:                // '[' '{'
            lookahead3W(15);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
            break;
          case 2659:                // '[' 'do'
          case 3363:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 2979:                // '[' 'function'
          case 3107:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 675:                 // '[' comment
          case 2467:                // '[' 'break'
          case 2595:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 291:                 // '[' null
          case 355:                 // '[' true
          case 419:                 // '[' false
          case 483:                 // '[' string
          case 547:                 // '[' complex
          case 611:                 // '[' real
            lookahead3W(14);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | ']' | '^' | '|' | '||' |
                                    // '|||' | '||||'
            break;
          case 2851:                // '[' 'for'
          case 2915:                // '[' 'foreach'
          case 3043:                // '[' 'if'
          case 3171:                // '[' 'return'
          case 3235:                // '[' 'test'
          case 3299:                // '[' 'throw'
          case 3427:                // '[' 'while'
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
         && lk != 26                // ';'
         && lk != 27                // '<'
         && lk != 28                // '<<'
         && lk != 29                // '<='
         && lk != 30                // '='
         && lk != 31                // '=='
         && lk != 32                // '>'
         && lk != 33                // '>='
         && lk != 34                // '>>'
         && lk != 36                // ']'
         && lk != 37                // '^'
         && lk != 38                // 'break'
         && lk != 40                // 'continue'
         && lk != 41                // 'do'
         && lk != 44                // 'for'
         && lk != 45                // 'foreach'
         && lk != 46                // 'function'
         && lk != 47                // 'if'
         && lk != 48                // 'namespace'
         && lk != 49                // 'return'
         && lk != 50                // 'test'
         && lk != 51                // 'throw'
         && lk != 52                // 'try'
         && lk != 53                // 'while'
         && lk != 54                // '{'
         && lk != 55                // '|'
         && lk != 56                // '||'
         && lk != 57                // '|||'
         && lk != 58                // '||||'
         && lk != 59                // '}'
         && lk != 60                // '~'
         && lk != 1699              // '[' ';'
         && lk != 2339              // '[' ']'
         && lk != 106723            // '[' identifier ';'
         && lk != 106787            // '[' null ';'
         && lk != 106851            // '[' true ';'
         && lk != 106915            // '[' false ';'
         && lk != 106979            // '[' string ';'
         && lk != 107043            // '[' complex ';'
         && lk != 107107            // '[' real ';'
         && lk != 107171            // '[' comment ';'
         && lk != 108963            // '[' 'break' ';'
         && lk != 109091)           // '[' 'continue' ';'
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
              consumeT(35);         // '['
              lookahead1W(15);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
              try_arguments();
              consumeT(36);         // ']'
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
        consume(35);                // '['
        lookahead1W(15);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
        whitespace();
        parse_arguments();
        consume(36);                // ']'
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
                                    // '-' | '.' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '[' | ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '|||' | '||||' | '}' | '~'
      switch (lk)
      {
      case 1091:                    // identifier '('
        lookahead3W(17);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
        break;
      case 1475:                    // identifier '.'
        lookahead3W(0);             // identifier | whitespace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 13379                 // identifier '(' identifier
     || lk == 13763                 // identifier '.' identifier
     || lk == 17475                 // identifier '(' null
     || lk == 21571                 // identifier '(' true
     || lk == 25667                 // identifier '(' false
     || lk == 29763                 // identifier '(' string
     || lk == 33859                 // identifier '(' complex
     || lk == 37955                 // identifier '(' real
     || lk == 42051                 // identifier '(' comment
     || lk == 50243                 // identifier '(' '!'
     || lk == 70723                 // identifier '(' '('
     || lk == 144451                // identifier '(' '['
     || lk == 156739                // identifier '(' 'break'
     || lk == 164931                // identifier '(' 'continue'
     || lk == 169027                // identifier '(' 'do'
     || lk == 181315                // identifier '(' 'for'
     || lk == 185411                // identifier '(' 'foreach'
     || lk == 189507                // identifier '(' 'function'
     || lk == 193603                // identifier '(' 'if'
     || lk == 197699                // identifier '(' 'namespace'
     || lk == 201795                // identifier '(' 'return'
     || lk == 205891                // identifier '(' 'test'
     || lk == 209987                // identifier '(' 'throw'
     || lk == 214083                // identifier '(' 'try'
     || lk == 218179                // identifier '(' 'while'
     || lk == 222275                // identifier '(' '{'
     || lk == 246851)               // identifier '(' '~'
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
            lookahead1W(17);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    case 74819:                     // identifier '(' ')'
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
        lookahead1W(17);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // '-' | '.' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '[' | ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '|||' | '||||' | '}' | '~'
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
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' | '||' |
                                    // '|||' | '||||' | '}' | '~'
        switch (l1)
        {
        case 35:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 227:                 // '[' identifier
            lookahead3W(20);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '|' | '||' | '|||' | '||||'
            break;
          case 2275:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 803:                 // '[' '!'
          case 3875:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 1123:                // '[' '('
          case 3491:                // '[' '{'
            lookahead3W(15);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
            break;
          case 2659:                // '[' 'do'
          case 3363:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 2979:                // '[' 'function'
          case 3107:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 675:                 // '[' comment
          case 2467:                // '[' 'break'
          case 2595:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 291:                 // '[' null
          case 355:                 // '[' true
          case 419:                 // '[' false
          case 483:                 // '[' string
          case 547:                 // '[' complex
          case 611:                 // '[' real
            lookahead3W(14);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | ']' | '^' | '|' | '||' |
                                    // '|||' | '||||'
            break;
          case 2851:                // '[' 'for'
          case 2915:                // '[' 'foreach'
          case 3043:                // '[' 'if'
          case 3171:                // '[' 'return'
          case 3235:                // '[' 'test'
          case 3299:                // '[' 'throw'
          case 3427:                // '[' 'while'
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
         && lk != 26                // ';'
         && lk != 27                // '<'
         && lk != 28                // '<<'
         && lk != 29                // '<='
         && lk != 30                // '='
         && lk != 31                // '=='
         && lk != 32                // '>'
         && lk != 33                // '>='
         && lk != 34                // '>>'
         && lk != 36                // ']'
         && lk != 37                // '^'
         && lk != 38                // 'break'
         && lk != 40                // 'continue'
         && lk != 41                // 'do'
         && lk != 44                // 'for'
         && lk != 45                // 'foreach'
         && lk != 46                // 'function'
         && lk != 47                // 'if'
         && lk != 48                // 'namespace'
         && lk != 49                // 'return'
         && lk != 50                // 'test'
         && lk != 51                // 'throw'
         && lk != 52                // 'try'
         && lk != 53                // 'while'
         && lk != 54                // '{'
         && lk != 55                // '|'
         && lk != 56                // '||'
         && lk != 57                // '|||'
         && lk != 58                // '||||'
         && lk != 59                // '}'
         && lk != 60                // '~'
         && lk != 1699              // '[' ';'
         && lk != 2339              // '[' ']'
         && lk != 106723            // '[' identifier ';'
         && lk != 106787            // '[' null ';'
         && lk != 106851            // '[' true ';'
         && lk != 106915            // '[' false ';'
         && lk != 106979            // '[' string ';'
         && lk != 107043            // '[' complex ';'
         && lk != 107107            // '[' real ';'
         && lk != 107171            // '[' comment ';'
         && lk != 108963            // '[' 'break' ';'
         && lk != 109091)           // '[' 'continue' ';'
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
              consumeT(35);         // '['
              lookahead1W(15);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
              try_arguments();
              consumeT(36);         // ']'
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
        consumeT(35);               // '['
        lookahead1W(15);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
        try_arguments();
        consumeT(36);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(54);                    // '{'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      whitespace();
      parse_element();
    }
    consume(59);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(54);                   // '{'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      try_element();
    }
    consumeT(59);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(35);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26                    // ';'
     && l1 != 36)                   // ']'
    {
      whitespace();
      parse_row();
    }
    for (;;)
    {
      if (l1 != 26)                 // ';'
      {
        break;
      }
      consume(26);                  // ';'
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      whitespace();
      parse_row();
    }
    consume(36);                    // ']'
    eventHandler.endNonterminal("matrix", e0);
  }

  function try_matrix()
  {
    consumeT(35);                   // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26                    // ';'
     && l1 != 36)                   // ']'
    {
      try_row();
    }
    for (;;)
    {
      if (l1 != 26)                 // ';'
      {
        break;
      }
      consumeT(26);                 // ';'
      lookahead1W(15);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      try_row();
    }
    consumeT(36);                   // ']'
  }

  function parse_element()
  {
    eventHandler.startNonterminal("element", e0);
    switch (l1)
    {
    case 7:                         // string
      lookahead2W(13);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '|' | '||' | '|||' |
                                    // '||||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 1607)                 // string ':'
    {
      parse_key();
      lookahead1W(3);               // whitespace^token | ':'
      consume(25);                  // ':'
    }
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '|' | '||' | '|||' |
                                    // '||||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 1607)                 // string ':'
    {
      try_key();
      lookahead1W(3);               // whitespace^token | ':'
      consumeT(25);                 // ':'
    }
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    case 54:                        // '{'
      parse_array();
      break;
    case 35:                        // '['
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
    case 54:                        // '{'
      try_array();
      break;
    case 35:                        // '['
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
  for (var i = 0; i < 61; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 192 + s - 1;
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
  /*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 9,
  /*  64 */ 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9, 29,
  /*  98 */ 30, 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50, 51,
  /* 126 */ 52, 9
];

MaiaScript.MAP1 =
[
  /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  54 */ 119, 151, 182, 214, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  /*  75 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 245, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  /*  96 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  /* 117 */ 255, 255, 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 151 */ 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22,
  /* 180 */ 23, 24, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6,
  /* 214 */ 9, 29, 30, 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50,
  /* 243 */ 51, 52, 9, 9, 9, 9, 9, 9, 9, 9, 53, 53, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  /* 278 */ 9, 9, 9, 9, 9, 9, 9, 9, 9
];

MaiaScript.MAP2 =
[
  /* 0 */ 57344, 65536, 65533, 1114111, 9, 9
];

MaiaScript.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 528, 17, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
  /* 28 */ 540
];

MaiaScript.TRANSITION =
[
  /*    0 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*   18 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1760, 1760, 1760, 1763,
  /*   36 */ 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*   54 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1760, 1760, 1760, 1763, 2460, 1932, 2460, 2460,
  /*   72 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*   90 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1890, 1771, 1777, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460,
  /*  108 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  126 */ 2460, 2460, 2460, 1926, 1792, 1796, 2460, 1811, 2512, 2460, 2460, 2460, 1931, 2460, 2460, 2460, 2460, 2460,
  /*  144 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2511,
  /*  162 */ 1821, 1825, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  180 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837,
  /*  198 */ 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732,
  /*  216 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2612, 3257, 2615, 2460, 1932, 2512, 2460, 2460, 2460,
  /*  234 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  252 */ 2460, 2460, 2460, 2460, 2460, 2690, 1858, 2693, 2460, 1932, 1851, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  270 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  288 */ 2460, 2460, 2460, 2460, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  306 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1870, 1874, 1882, 1886,
  /*  324 */ 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  342 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1898, 1900, 1913, 1910, 2460, 1932, 2512, 2460,
  /*  360 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  378 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2744, 2007, 2747, 2460, 1921, 2512, 2460, 2460, 2460, 2439, 2460,
  /*  396 */ 2460, 2460, 2460, 1940, 2460, 2460, 2460, 1946, 2460, 2438, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  414 */ 2460, 2460, 2460, 1983, 1960, 1966, 2460, 1978, 2512, 2460, 2460, 2460, 2461, 1991, 2460, 2460, 2460, 2000,
  /*  432 */ 2460, 2460, 2460, 2054, 2460, 2582, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2075,
  /*  450 */ 2069, 2019, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  468 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2308, 2031, 2037, 2460, 2049,
  /*  486 */ 2512, 2460, 2460, 2460, 2461, 1991, 2460, 2460, 2460, 2062, 2460, 2460, 2460, 2054, 2460, 2582, 2460, 2460,
  /*  504 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2537, 2460, 2303, 2303, 2460, 2083, 2512, 2460, 2460, 2460,
  /*  522 */ 3261, 2460, 2460, 2460, 2460, 2096, 2460, 2460, 2460, 2088, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  540 */ 2460, 2460, 2460, 2460, 2460, 2904, 2106, 2112, 2460, 1932, 2098, 2460, 2460, 2460, 1931, 2460, 2460, 2460,
  /*  558 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  576 */ 2460, 2773, 2176, 2180, 2732, 2125, 2512, 2732, 2732, 2732, 2169, 2150, 2732, 2732, 2733, 2162, 2786, 2732,
  /*  594 */ 2733, 2192, 2732, 2883, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2773, 2176, 2180,
  /*  612 */ 2732, 2210, 2512, 2732, 2732, 2732, 2244, 2150, 2732, 2732, 2733, 2237, 2786, 2732, 2733, 2252, 2732, 2971,
  /*  630 */ 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3069, 3067, 2460, 2460, 2460, 1932, 2512, 2460,
  /*  648 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  666 */ 2460, 2460, 2460, 2460, 2460, 2460, 2011, 2270, 2275, 2283, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460,
  /*  684 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  702 */ 2460, 2460, 2460, 3136, 2336, 3139, 2460, 1932, 2296, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  720 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3316,
  /*  738 */ 2316, 3319, 2460, 1932, 2329, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  756 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3333, 2349, 3336, 2460, 1932,
  /*  774 */ 1970, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  792 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2362, 2369, 2373, 2460, 1932, 2512, 2460, 2460, 2460,
  /*  810 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  828 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2381, 2512, 2460, 2460, 2460, 1931, 2460, 2460, 2460,
  /*  846 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  864 */ 2460, 2391, 2394, 2402, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  882 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1781, 2415, 1784,
  /*  900 */ 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  918 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 3234, 3213, 2428, 2512, 2447,
  /*  936 */ 2469, 2732, 2459, 1841, 2732, 2479, 2733, 1901, 2225, 2732, 3002, 1902, 2489, 2783, 3024, 2499, 2460, 2460,
  /*  954 */ 2460, 2460, 2460, 2460, 2460, 2460, 2510, 2117, 2520, 2524, 2732, 1837, 2512, 2732, 2732, 2732, 2435, 1841,
  /*  972 */ 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460,
  /*  990 */ 2460, 2460, 2536, 2288, 2545, 2553, 2732, 1837, 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2571, 2733, 1901,
  /* 1008 */ 1843, 3218, 2733, 1902, 2732, 2502, 2732, 2960, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2579, 2341,
  /* 1026 */ 2590, 2594, 2732, 1837, 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902,
  /* 1044 */ 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2609, 2321, 2602, 2623, 2982, 2641,
  /* 1062 */ 2512, 2836, 2813, 2732, 2655, 2528, 2732, 2817, 2649, 2667, 2679, 2861, 3243, 2659, 3045, 2872, 2732, 2563,
  /* 1080 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2687, 3305, 2701, 2705, 2140, 1837, 2512, 2628, 2732, 2732,
  /* 1098 */ 2435, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 3112, 2732, 2460, 2460, 2460, 2460,
  /* 1116 */ 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2481, 2713, 2512, 2795, 2721, 2732, 2459, 1841, 2732, 2732,
  /* 1134 */ 2733, 1901, 2786, 2722, 2733, 1902, 2935, 2783, 2732, 2731, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1152 */ 2741, 2354, 2755, 2759, 2732, 1837, 2512, 2732, 2732, 2732, 2767, 1841, 2926, 2732, 2733, 1901, 2786, 2732,
  /* 1170 */ 2781, 1902, 2794, 2803, 2825, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784,
  /* 1188 */ 2732, 1837, 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2471, 2733, 1813, 2732, 2783,
  /* 1206 */ 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2834, 1837, 2512, 2732,
  /* 1224 */ 2844, 2857, 2459, 2852, 2732, 2732, 2142, 1901, 2869, 2258, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460,
  /* 1242 */ 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2732, 2880, 2459, 1841,
  /* 1260 */ 2891, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1278 */ 2460, 2460, 2901, 3349, 2912, 2916, 2732, 1837, 2512, 2732, 3035, 2924, 2435, 2154, 2934, 2732, 2733, 1901,
  /* 1296 */ 2786, 2732, 2733, 1902, 2732, 2943, 2968, 2262, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671,
  /* 1314 */ 2785, 2229, 2979, 2990, 2512, 3010, 3022, 2732, 2459, 1841, 2732, 2732, 2220, 1901, 2786, 3032, 2733, 1902,
  /* 1332 */ 2732, 2783, 3116, 3043, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837,
  /* 1350 */ 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2950, 3053, 2732,
  /* 1368 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3064, 2407, 3077, 3081, 2491, 3089, 2512, 3097, 2732, 3105,
  /* 1386 */ 2435, 2184, 2215, 2732, 2733, 1901, 2786, 2732, 3181, 1902, 2558, 2783, 2732, 2732, 2460, 2460, 2460, 2460,
  /* 1404 */ 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2893, 3056, 2459, 1841, 3194, 3124,
  /* 1422 */ 2733, 1992, 2786, 2732, 3223, 1902, 2996, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1440 */ 3133, 1952, 3147, 3151, 2732, 1837, 2512, 2732, 3000, 2202, 2435, 1841, 3159, 2198, 2130, 1901, 2135, 3167,
  /* 1458 */ 2453, 1902, 3178, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784,
  /* 1476 */ 3189, 3206, 2512, 2633, 2732, 2826, 2459, 2955, 3170, 2732, 3231, 1901, 2786, 3242, 2733, 1902, 2732, 2783,
  /* 1494 */ 3125, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3251, 2420, 3269, 3273, 2732, 1837, 2512, 2732,
  /* 1512 */ 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2723, 1902, 3014, 2783, 2732, 2732, 2460, 2460,
  /* 1530 */ 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2732, 2722, 2459, 2808,
  /* 1548 */ 3198, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1566 */ 2460, 2460, 2383, 3281, 3288, 3292, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1584 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1800,
  /* 1602 */ 3300, 1803, 2460, 1932, 1829, 2460, 2460, 2460, 2460, 2023, 2460, 2460, 2460, 2460, 3313, 2460, 2460, 2460,
  /* 1620 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3327, 3330, 3344, 2460, 1932,
  /* 1638 */ 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1656 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2041, 3357, 3361, 2460, 1932, 2512, 2460, 2460, 2460,
  /* 1674 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1692 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1932, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1710 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1728 */ 2460, 2460, 1862, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
  /* 1746 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3101, 3101, 3101, 3101,
  /* 1764 */ 3101, 3101, 3101, 3101, 0, 0, 0, 3328, 3328, 3328, 49, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 0,
  /* 1786 */ 9728, 9728, 0, 0, 0, 0, 42, 42, 42, 0, 42, 42, 42, 42, 0, 0, 0, 0, 0, 14390, 14390, 0, 0, 0, 0, 0, 2048, 0,
  /* 1814 */ 0, 0, 0, 0, 0, 1054, 10014, 2871, 2871, 2871, 0, 2871, 2871, 2871, 2871, 0, 0, 0, 0, 0, 14685, 2871, 0, 0,
  /* 1838 */ 42, 0, 0, 0, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1187, 1054, 0, 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 4146,
  /* 1862 */ 0, 0, 0, 0, 768, 0, 0, 0, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608,
  /* 1887 */ 4608, 4608, 4608, 0, 0, 0, 0, 3328, 49, 49, 3328, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 1054, 1054, 4864, 4864,
  /* 1912 */ 4864, 4864, 0, 0, 0, 0, 4864, 0, 4864, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0, 86,
  /* 1942 */ 0, 86, 0, 0, 86, 0, 86, 86, 86, 86, 0, 0, 0, 1072, 1072, 0, 0, 1088, 43, 43, 43, 5376, 43, 43, 43, 43,
  /* 1968 */ 5419, 5419, 0, 0, 0, 0, 8960, 0, 2871, 0, 0, 42, 0, 0, 43, 0, 0, 0, 43, 43, 5376, 5376, 43, 126, 0, 0, 0,
  /* 1995 */ 0, 0, 0, 0, 1183, 0, 154, 154, 43, 0, 0, 43, 0, 0, 0, 5120, 0, 0, 0, 0, 6912, 0, 0, 0, 5632, 5632, 5632,
  /* 2022 */ 5632, 0, 0, 0, 0, 14979, 0, 0, 0, 44, 44, 44, 5888, 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 15616, 0, 0,
  /* 2048 */ 15616, 0, 42, 84, 84, 43, 0, 0, 0, 43, 125, 43, 0, 0, 0, 154, 154, 43, 84, 0, 43, 0, 0, 0, 5632, 0, 0, 0,
  /* 2076 */ 5632, 5632, 0, 0, 5632, 5632, 0, 0, 42, 0, 0, 87, 0, 0, 0, 121, 121, 121, 0, 0, 0, 121, 0, 0, 0, 0, 0, 0,
  /* 2104 */ 2871, 2871, 56, 56, 56, 6400, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 42, 85,
  /* 2128 */ 2605, 2605, 1054, 1054, 1054, 30, 1054, 1054, 1054, 0, 1054, 1185, 1054, 1054, 1054, 30, 1054, 1054, 1054,
  /* 2147 */ 1054, 1142, 152, 2687, 1054, 1054, 1054, 0, 1054, 1054, 1054, 0, 1054, 1157, 1054, 153, 85, 155, 2716,
  /* 2166 */ 2718, 2687, 2718, 1054, 0, 0, 85, 85, 0, 2684, 2605, 2605, 2605, 0, 2605, 2605, 2605, 2605, 0, 1054, 1054,
  /* 2187 */ 1054, 0, 1054, 1054, 11654, 153, 155, 155, 2716, 2716, 2718, 1054, 1054, 1054, 1169, 1054, 1054, 1054,
  /* 2205 */ 1054, 1139, 1054, 1054, 1054, 0, 42, 85, 2605, 2648, 1054, 1054, 1054, 1054, 1163, 1054, 1054, 1054, 1054,
  /* 2224 */ 1175, 1054, 1054, 0, 1184, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1094, 153, 122, 155, 2717, 2718, 2687,
  /* 2243 */ 2718, 1054, 0, 0, 85, 122, 0, 2684, 2648, 174, 155, 155, 2717, 2717, 2718, 1054, 1054, 1054, 1191, 1054,
  /* 2263 */ 1054, 1054, 1054, 1054, 12062, 1054, 1054, 6912, 0, 6912, 0, 0, 0, 6912, 0, 6912, 0, 6912, 6912, 0, 6912,
  /* 2284 */ 6912, 6912, 6912, 0, 0, 0, 0, 1056, 1056, 0, 0, 1082, 0, 0, 7424, 0, 0, 0, 2871, 0, 0, 0, 6144, 0, 0, 0, 0,
  /* 2311 */ 44, 44, 5888, 5888, 44, 0, 0, 0, 7988, 0, 0, 0, 0, 1058, 1058, 0, 0, 1058, 3584, 0, 7680, 8192, 8704, 0,
  /* 2335 */ 2871, 0, 0, 0, 7219, 0, 0, 0, 0, 1057, 1057, 0, 0, 1083, 0, 0, 0, 8501, 0, 0, 0, 0, 1060, 1060, 0, 0, 1085,
  /* 2362 */ 0, 0, 0, 9216, 9216, 0, 0, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 0, 0, 0, 0, 0, 83, 0, 0, 0, 0,
  /* 2387 */ 0, 0, 14080, 0, 0, 0, 9472, 0, 0, 0, 9472, 0, 0, 9472, 9472, 9472, 9472, 9472, 9472, 0, 0, 0, 0, 1062,
  /* 2411 */ 1062, 0, 0, 1087, 0, 0, 0, 9728, 0, 0, 0, 0, 1064, 1064, 0, 0, 1089, 0, 42, 0, 0, 0, 1114, 1099, 1054, 0,
  /* 2437 */ 42, 0, 0, 0, 0, 0, 86, 0, 0, 86, 1054, 1093, 1054, 1114, 1054, 1122, 1054, 1054, 1054, 1195, 1054, 1054,
  /* 2459 */ 1054, 0, 0, 0, 0, 0, 0, 0, 0, 125, 1054, 1128, 1054, 1054, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1167,
  /* 2481 */ 1054, 1054, 1054, 1054, 1054, 1054, 1103, 1105, 1054, 1200, 1054, 1054, 1054, 1054, 1054, 1054, 1104, 1054,
  /* 2499 */ 1054, 1054, 1215, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1209, 1055, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 1081,
  /* 2521 */ 1081, 1081, 0, 1081, 1081, 1081, 1081, 0, 1054, 1054, 1054, 0, 1156, 1054, 1054, 1056, 0, 0, 0, 0, 0, 0, 0,
  /* 2544 */ 6144, 1082, 1082, 1082, 0, 1082, 1082, 1082, 1082, 1090, 1082, 1082, 1082, 0, 1054, 1054, 1054, 1054, 1203,
  /* 2563 */ 1054, 1054, 1054, 1054, 10526, 1054, 1054, 12574, 1054, 1054, 1168, 1054, 1054, 1054, 1054, 1172, 1057, 0,
  /* 2581 */ 0, 0, 0, 0, 0, 0, 154, 0, 0, 1083, 1083, 1083, 0, 1083, 1083, 1083, 1083, 0, 1054, 1054, 1054, 1058, 1058,
  /* 2604 */ 1058, 0, 1058, 1058, 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 3840, 3840, 0, 0, 0, 0, 1058, 1091, 1058, 1058, 0,
  /* 2628 */ 1054, 1054, 1054, 1054, 12318, 1054, 1054, 1054, 1121, 1054, 1115, 1054, 1054, 0, 42, 0, 0, 89, 1054, 1054,
  /* 2648 */ 1102, 1173, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 0, 123, 0, 0, 89, 89, 123, 1822, 1054, 0, 123, 0, 89,
  /* 2671 */ 0, 0, 0, 1054, 1054, 0, 0, 1054, 1054, 1566, 0, 1054, 1054, 1186, 1054, 1188, 1059, 0, 0, 0, 0, 0, 0, 0,
  /* 2695 */ 4146, 4146, 0, 0, 0, 0, 1084, 1084, 1084, 0, 1084, 1084, 1084, 1084, 0, 1054, 1054, 1054, 82, 42, 0, 0, 0,
  /* 2718 */ 1054, 1054, 1103, 1127, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 30, 0, 11806, 1054, 1054, 1054, 1054,
  /* 2736 */ 1054, 1054, 1054, 1054, 0, 1060, 0, 0, 0, 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 1085, 1085, 1085, 0, 1085,
  /* 2760 */ 1085, 1085, 1085, 0, 1054, 1054, 1054, 1143, 120, 0, 0, 0, 2304, 0, 0, 0, 2605, 2605, 0, 0, 2605, 1194,
  /* 2782 */ 1060, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1199, 1054, 1054, 1054, 1054, 1054,
  /* 2800 */ 1054, 1054, 1125, 1204, 1054, 1206, 1054, 1054, 0, 1054, 1054, 30, 0, 1054, 1054, 1054, 1130, 1054, 1054,
  /* 2819 */ 1054, 1054, 146, 1054, 1171, 1054, 1210, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1142, 1054, 1095, 1054,
  /* 2837 */ 1054, 1054, 1054, 1054, 1054, 1123, 1124, 1054, 1054, 1129, 1054, 1054, 1054, 1054, 1134, 0, 1152, 1153,
  /* 2855 */ 1054, 0, 1054, 1054, 1054, 1138, 1054, 1054, 1054, 1054, 1054, 11177, 1054, 1054, 1310, 1054, 0, 1054,
  /* 2873 */ 1054, 1054, 1054, 1054, 123, 1054, 1054, 1054, 1054, 1137, 1054, 1054, 1054, 1054, 1054, 153, 1054, 1054,
  /* 2891 */ 1054, 1160, 1054, 1054, 1054, 1054, 1054, 1054, 1133, 1054, 1061, 0, 0, 0, 0, 0, 0, 0, 6400, 6400, 56,
  /* 2912 */ 1086, 1086, 1086, 0, 1086, 1086, 1086, 1086, 0, 1054, 1054, 1054, 1054, 1136, 1054, 1054, 1054, 1054, 1054,
  /* 2931 */ 1054, 1164, 1054, 1159, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 10270, 1054, 1205, 1054, 1054, 30, 0,
  /* 2949 */ 1208, 1054, 1054, 1054, 1207, 1054, 0, 1054, 1054, 1154, 0, 1054, 1054, 1054, 1142, 1054, 1054, 1216, 1054,
  /* 2968 */ 1054, 1054, 12830, 1054, 1054, 1054, 1054, 1054, 174, 1054, 1054, 30, 1054, 1097, 1054, 1054, 1054, 1054,
  /* 2986 */ 1054, 1101, 1102, 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054, 1202, 1054, 1054, 1054, 1054, 1131, 1054,
  /* 3006 */ 1054, 1054, 1054, 0, 1054, 1119, 10782, 1120, 1054, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054, 1119,
  /* 3024 */ 1054, 1054, 1054, 1054, 1054, 1054, 1212, 1054, 1054, 1054, 1190, 1054, 1054, 1054, 1054, 1054, 1132, 1054,
  /* 3042 */ 1054, 1054, 1214, 1054, 1054, 1054, 1054, 1054, 1054, 13854, 1054, 1054, 1211, 1054, 1054, 1054, 1054,
  /* 3059 */ 1054, 1054, 1140, 1054, 1054, 1062, 0, 0, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 1087, 1087, 1087, 0, 1087, 1087,
  /* 3083 */ 1087, 1087, 0, 1054, 1092, 1054, 0, 42, 0, 0, 0, 1054, 1054, 1116, 1118, 1054, 1054, 1054, 1054, 1054,
  /* 3103 */ 1054, 1126, 111, 1054, 1054, 1054, 1054, 1054, 1141, 1054, 1054, 1054, 11294, 1054, 1054, 1054, 1054, 1054,
  /* 3121 */ 1197, 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1142, 1054, 1054, 1213, 1063, 0, 0, 0, 0, 0, 0, 0, 7219,
  /* 3142 */ 7219, 0, 0, 0, 0, 1088, 1088, 1088, 0, 1088, 1088, 1088, 1088, 0, 1054, 1054, 1054, 1054, 1054, 1161, 1054,
  /* 3163 */ 1054, 1054, 1054, 1165, 1054, 13086, 1054, 1054, 1054, 1054, 1054, 1054, 1154, 1054, 1054, 1054, 1054,
  /* 3180 */ 1201, 1054, 1054, 1054, 1054, 1054, 1197, 1054, 0, 1054, 1054, 1098, 1054, 1100, 1054, 1054, 1054, 1162,
  /* 3198 */ 1054, 1054, 1054, 1054, 1054, 13598, 1054, 1054, 0, 42, 0, 0, 0, 1098, 1115, 1054, 1054, 1096, 1054, 1099,
  /* 3218 */ 1054, 1054, 1054, 1054, 1192, 1054, 1054, 1054, 1054, 1196, 1054, 1054, 0, 1054, 1054, 1174, 1054, 1054,
  /* 3236 */ 1054, 1054, 0, 1054, 1054, 1093, 1189, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 13824, 1064, 0, 0, 0, 0,
  /* 3256 */ 41, 0, 0, 0, 3840, 0, 0, 0, 0, 121, 0, 0, 87, 1089, 1089, 1089, 0, 1089, 1089, 1089, 1089, 0, 1054, 1054,
  /* 3280 */ 1054, 0, 0, 0, 14080, 14080, 0, 0, 14080, 14080, 14080, 0, 14080, 14080, 14080, 14080, 0, 0, 0, 0, 0, 0, 0,
  /* 3303 */ 14390, 0, 0, 0, 0, 1070, 1070, 0, 0, 1084, 0, 0, 15104, 0, 0, 0, 0, 0, 7988, 7988, 0, 0, 0, 0, 0, 15360, 0,
  /* 3330 */ 0, 0, 15360, 0, 0, 0, 0, 0, 8501, 8501, 0, 0, 0, 0, 15360, 15360, 15360, 15360, 0, 0, 0, 0, 1071, 1071, 0,
  /* 3355 */ 0, 1086, 15616, 15616, 15616, 0, 15616, 15616, 15616, 15616, 0, 0, 0, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 96, 100, 104, 108, 112, 116, 120, 124, 134, 134, 163, 129, 139, 198, 135, 143, 134, 134, 134, 134, 162, 150,
  /*  22 */ 129, 133, 134, 145, 134, 134, 134, 125, 149, 154, 131, 134, 134, 134, 134, 125, 149, 155, 134, 134, 134,
  /*  43 */ 159, 134, 134, 134, 134, 211, 167, 177, 181, 188, 184, 192, 211, 211, 211, 210, 211, 211, 196, 173, 202,
  /*  64 */ 206, 211, 211, 211, 209, 211, 211, 216, 220, 226, 230, 211, 211, 249, 211, 211, 170, 236, 222, 229, 211,
  /*  85 */ 249, 211, 212, 236, 241, 248, 232, 245, 231, 237, 253, 2056, 133120, 264192, 33556480, 67110912, 2048, 2048,
  /* 103 */ 8521728, 67373056, 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, 401400, 67248120,
  /* 114 */ 139256, -33822720, 139260, 67510264, 67248120, 2498552, 69607416, 69607416, -41943048, -33554440, 2048, 8,
  /* 126 */ 8, 8, 0, 768, 72, 24, 40, 0, 8, 8, 8, 8, 72, 8192, 65536, 805306368, 0x80000000, 8, 24, 8, 40, 8, 8, 256,
  /* 150 */ 256, 256, 768, 768, 768, 768, 768, 72, 8, 8, 256, 8, 8, 0, 128, 256, 768, 0, 2097152, 4194304, 0, 0,
  /* 172 */ 67108864, 64, 256, 512, 28672, 0, 134217728, 16, 4194312, 272629768, 260046887, 125829175, 276820808,
  /* 185 */ 276820808, 276820824, 276820824, 276820808, 276820808, 411038536, 125829183, 411038680, 411041624,
  /* 194 */ 536867711, 536867711, 6, 117440512, 0, 0, 1024, 1024, 32768, 65536, 131072, 1835008, 2097152, 384, 3072, 0,
  /* 210 */ 2097152, 0, 0, 0, 0, 64, 100663296, 64, 256, 12288, 16384, 65536, 131072, 262144, 524288, 2097152, 524288,
  /* 227 */ 1048576, 2097152, 128, 3072, 0, 0, 0, 256, 8192, 256, 8192, 16384, 65536, 0, 131072, 524288, 2097152, 128,
  /* 245 */ 16384, 65536, 131072, 2048, 0, 0, 0, 2097152, 256, 16384, 65536, 65536
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
  "'|||'",
  "'||||'",
  "'}'",
  "'~'"
];

// End
