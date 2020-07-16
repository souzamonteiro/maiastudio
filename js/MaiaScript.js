// This file was generated on Tue Jul 14, 2020 07:53 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -backtrack -tree -javascript

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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    switch (l1)
    {
    case 2:                         // eof
      consume(2);                   // eof
      break;
    default:
      for (;;)
      {
        lookahead1W(17);            // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
    parse_logicalANDExpression();
    for (;;)
    {
      if (l1 != 59)                 // '||'
      {
        break;
      }
      consume(59);                  // '||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
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
      if (l1 != 59)                 // '||'
      {
        break;
      }
      consumeT(59);                 // '||'
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
      if (l1 != 58)                 // '|'
      {
        break;
      }
      consume(58);                  // '|'
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
      if (l1 != 58)                 // '|'
      {
        break;
      }
      consumeT(58);                 // '|'
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
      if (l1 != 38)                 // '`'
      {
        break;
      }
      consume(38);                  // '`'
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
      if (l1 != 38)                 // '`'
      {
        break;
      }
      consumeT(38);                 // '`'
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
    parse_powerExpression();
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
      parse_powerExpression();
    }
    eventHandler.endNonterminal("additiveExpression", e0);
  }

  function try_additiveExpression()
  {
    try_powerExpression();
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
      try_powerExpression();
    }
  }

  function parse_powerExpression()
  {
    eventHandler.startNonterminal("powerExpression", e0);
    parse_multiplicativeExpression();
    for (;;)
    {
      if (l1 != 37)                 // '^'
      {
        break;
      }
      consume(37);                  // '^'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
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
      if (l1 != 37)                 // '^'
      {
        break;
      }
      consumeT(37);                 // '^'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_multiplicativeExpression();
    }
  }

  function parse_multiplicativeExpression()
  {
    eventHandler.startNonterminal("multiplicativeExpression", e0);
    parse_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '|' | '||' | '}' | '~'
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
      parse_unaryExpression();
    }
    eventHandler.endNonterminal("multiplicativeExpression", e0);
  }

  function try_multiplicativeExpression()
  {
    try_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '|' | '||' | '}' | '~'
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
      try_unaryExpression();
    }
  }

  function parse_unaryExpression()
  {
    eventHandler.startNonterminal("unaryExpression", e0);
    switch (l1)
    {
    case 61:                        // '~'
      consume(61);                  // '~'
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
    case 61:                        // '~'
      consumeT(61);                 // '~'
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
    case 50:                        // 'namespace'
      parse_namespace();
      break;
    case 47:                        // 'function'
      parse_function();
      break;
    case 48:                        // 'if'
      parse_if();
      break;
    case 42:                        // 'do'
      parse_do();
      break;
    case 56:                        // 'while'
      parse_while();
      break;
    case 45:                        // 'for'
      parse_for();
      break;
    case 46:                        // 'foreach'
      parse_foreach();
      break;
    case 55:                        // 'try'
      parse_try();
      break;
    case 53:                        // 'test'
      parse_test();
      break;
    case 39:                        // 'break'
      parse_break();
      break;
    case 41:                        // 'continue'
      parse_continue();
      break;
    case 52:                        // 'return'
      parse_return();
      break;
    case 54:                        // 'throw'
      parse_throw();
      break;
    case 49:                        // 'import'
      parse_import();
      break;
    default:
      parse_require();
    }
    eventHandler.endNonterminal("statement", e0);
  }

  function try_statement()
  {
    switch (l1)
    {
    case 50:                        // 'namespace'
      try_namespace();
      break;
    case 47:                        // 'function'
      try_function();
      break;
    case 48:                        // 'if'
      try_if();
      break;
    case 42:                        // 'do'
      try_do();
      break;
    case 56:                        // 'while'
      try_while();
      break;
    case 45:                        // 'for'
      try_for();
      break;
    case 46:                        // 'foreach'
      try_foreach();
      break;
    case 55:                        // 'try'
      try_try();
      break;
    case 53:                        // 'test'
      try_test();
      break;
    case 39:                        // 'break'
      try_break();
      break;
    case 41:                        // 'continue'
      try_continue();
      break;
    case 52:                        // 'return'
      try_return();
      break;
    case 54:                        // 'throw'
      try_throw();
      break;
    case 49:                        // 'import'
      try_import();
      break;
    default:
      try_require();
    }
  }

  function parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
    consume(50);                    // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    consumeT(50);                   // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_function()
  {
    eventHandler.startNonterminal("function", e0);
    consume(47);                    // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_arguments();
    }
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("function", e0);
  }

  function try_function()
  {
    consumeT(47);                   // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_arguments();
    }
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_if()
  {
    eventHandler.startNonterminal("if", e0);
    consume(48);                    // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' |
                                    // 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'import' | 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
      if (l1 != 44)                 // 'elseif'
      {
        break;
      }
      whitespace();
      parse_elseif();
    }
    if (l1 == 43)                   // 'else'
    {
      whitespace();
      parse_else();
    }
    eventHandler.endNonterminal("if", e0);
  }

  function try_if()
  {
    consumeT(48);                   // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' |
                                    // 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'import' | 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '}' | '~'
      if (l1 != 44)                 // 'elseif'
      {
        break;
      }
      try_elseif();
    }
    if (l1 == 43)                   // 'else'
    {
      try_else();
    }
  }

  function parse_elseif()
  {
    eventHandler.startNonterminal("elseif", e0);
    consume(44);                    // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("elseif", e0);
  }

  function try_elseif()
  {
    consumeT(44);                   // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(43);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(43);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(42);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(56);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("do", e0);
  }

  function try_do()
  {
    consumeT(42);                   // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(56);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(56);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(56);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_for()
  {
    eventHandler.startNonterminal("for", e0);
    consume(45);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("for", e0);
  }

  function try_for()
  {
    consumeT(45);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
    consume(46);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(26);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("foreach", e0);
  }

  function try_foreach()
  {
    consumeT(46);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(55);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'import' |
                                    // 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(55);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'import' |
                                    // 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(53);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'import' |
                                    // 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(53);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 18                  // ')'
       && l1 != 26)                 // ';'
      {
        try_expression();
      }
      lookahead1W(8);               // whitespace^token | ')' | ';'
      if (l1 == 26)                 // ';'
      {
        consumeT(26);               // ';'
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        if (l1 != 18)               // ')'
        {
          try_expression();
        }
      }
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'import' |
                                    // 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_catch()
  {
    eventHandler.startNonterminal("catch", e0);
    consume(40);                    // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(57);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("catch", e0);
  }

  function try_catch()
  {
    consumeT(40);                   // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(57);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(60);                   // '}'
  }

  function parse_break()
  {
    eventHandler.startNonterminal("break", e0);
    consume(39);                    // 'break'
    eventHandler.endNonterminal("break", e0);
  }

  function try_break()
  {
    consumeT(39);                   // 'break'
  }

  function parse_continue()
  {
    eventHandler.startNonterminal("continue", e0);
    consume(41);                    // 'continue'
    eventHandler.endNonterminal("continue", e0);
  }

  function try_continue()
  {
    consumeT(41);                   // 'continue'
  }

  function parse_return()
  {
    eventHandler.startNonterminal("return", e0);
    consume(52);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
    consumeT(52);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
    consume(54);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
    consumeT(54);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_import()
  {
    eventHandler.startNonterminal("import", e0);
    consume(49);                    // 'import'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("import", e0);
  }

  function try_import()
  {
    consumeT(49);                   // 'import'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_require()
  {
    eventHandler.startNonterminal("require", e0);
    consume(51);                    // 'require'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("require", e0);
  }

  function try_require()
  {
    consumeT(51);                   // 'require'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
    try_expression();
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
    case 57:                        // '{'
    case 61:                        // '~'
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
    case 57:                        // '{'
    case 61:                        // '~'
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' |
                                    // 'require' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' |
                                    // 'require' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
      switch (lk)
      {
      case 1091:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
     || lk == 160835                // identifier '(' 'break'
     || lk == 169027                // identifier '(' 'continue'
     || lk == 173123                // identifier '(' 'do'
     || lk == 185411                // identifier '(' 'for'
     || lk == 189507                // identifier '(' 'foreach'
     || lk == 193603                // identifier '(' 'function'
     || lk == 197699                // identifier '(' 'if'
     || lk == 201795                // identifier '(' 'import'
     || lk == 205891                // identifier '(' 'namespace'
     || lk == 209987                // identifier '(' 'require'
     || lk == 214083                // identifier '(' 'return'
     || lk == 218179                // identifier '(' 'test'
     || lk == 222275                // identifier '(' 'throw'
     || lk == 226371                // identifier '(' 'try'
     || lk == 230467                // identifier '(' 'while'
     || lk == 234563                // identifier '(' '{'
     || lk == 250947)               // identifier '(' '~'
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
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
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
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '|' | '||' | '}' | '~'
        switch (l1)
        {
        case 35:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 227:                 // '[' identifier
            lookahead3W(15);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '`' | '|' | '||'
            break;
          case 2275:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 803:                 // '[' '!'
          case 3939:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 1123:                // '[' '('
          case 3683:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 2723:                // '[' 'do'
          case 3555:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 3043:                // '[' 'function'
          case 3235:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 675:                 // '[' comment
          case 2531:                // '[' 'break'
          case 2659:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 291:                 // '[' null
          case 355:                 // '[' true
          case 419:                 // '[' false
          case 483:                 // '[' string
          case 547:                 // '[' complex
          case 611:                 // '[' real
            lookahead3W(14);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | ']' | '^' | '`' | '|' | '||'
            break;
          case 2915:                // '[' 'for'
          case 2979:                // '[' 'foreach'
          case 3107:                // '[' 'if'
          case 3171:                // '[' 'import'
          case 3299:                // '[' 'require'
          case 3363:                // '[' 'return'
          case 3427:                // '[' 'test'
          case 3491:                // '[' 'throw'
          case 3619:                // '[' 'while'
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
         && lk != 38                // '`'
         && lk != 39                // 'break'
         && lk != 41                // 'continue'
         && lk != 42                // 'do'
         && lk != 45                // 'for'
         && lk != 46                // 'foreach'
         && lk != 47                // 'function'
         && lk != 48                // 'if'
         && lk != 49                // 'import'
         && lk != 50                // 'namespace'
         && lk != 51                // 'require'
         && lk != 52                // 'return'
         && lk != 53                // 'test'
         && lk != 54                // 'throw'
         && lk != 55                // 'try'
         && lk != 56                // 'while'
         && lk != 57                // '{'
         && lk != 58                // '|'
         && lk != 59                // '||'
         && lk != 60                // '}'
         && lk != 61                // '~'
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
         && lk != 109027            // '[' 'break' ';'
         && lk != 109155)           // '[' 'continue' ';'
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
              lookahead1W(16);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
        lookahead1W(16);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
      switch (lk)
      {
      case 1091:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
     || lk == 160835                // identifier '(' 'break'
     || lk == 169027                // identifier '(' 'continue'
     || lk == 173123                // identifier '(' 'do'
     || lk == 185411                // identifier '(' 'for'
     || lk == 189507                // identifier '(' 'foreach'
     || lk == 193603                // identifier '(' 'function'
     || lk == 197699                // identifier '(' 'if'
     || lk == 201795                // identifier '(' 'import'
     || lk == 205891                // identifier '(' 'namespace'
     || lk == 209987                // identifier '(' 'require'
     || lk == 214083                // identifier '(' 'return'
     || lk == 218179                // identifier '(' 'test'
     || lk == 222275                // identifier '(' 'throw'
     || lk == 226371                // identifier '(' 'try'
     || lk == 230467                // identifier '(' 'while'
     || lk == 234563                // identifier '(' '{'
     || lk == 250947)               // identifier '(' '~'
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
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '|' | '||' | '}' | '~'
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
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'import' | 'namespace' | 'require' | 'return' | 'test' | 'throw' | 'try' |
                                    // 'while' | '{' | '|' | '||' | '}' | '~'
        switch (l1)
        {
        case 35:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
          switch (lk)
          {
          case 227:                 // '[' identifier
            lookahead3W(15);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '`' | '|' | '||'
            break;
          case 2275:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 803:                 // '[' '!'
          case 3939:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 1123:                // '[' '('
          case 3683:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 2723:                // '[' 'do'
          case 3555:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 3043:                // '[' 'function'
          case 3235:                // '[' 'namespace'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 675:                 // '[' comment
          case 2531:                // '[' 'break'
          case 2659:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 291:                 // '[' null
          case 355:                 // '[' true
          case 419:                 // '[' false
          case 483:                 // '[' string
          case 547:                 // '[' complex
          case 611:                 // '[' real
            lookahead3W(14);        // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ';' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | ']' | '^' | '`' | '|' | '||'
            break;
          case 2915:                // '[' 'for'
          case 2979:                // '[' 'foreach'
          case 3107:                // '[' 'if'
          case 3171:                // '[' 'import'
          case 3299:                // '[' 'require'
          case 3363:                // '[' 'return'
          case 3427:                // '[' 'test'
          case 3491:                // '[' 'throw'
          case 3619:                // '[' 'while'
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
         && lk != 38                // '`'
         && lk != 39                // 'break'
         && lk != 41                // 'continue'
         && lk != 42                // 'do'
         && lk != 45                // 'for'
         && lk != 46                // 'foreach'
         && lk != 47                // 'function'
         && lk != 48                // 'if'
         && lk != 49                // 'import'
         && lk != 50                // 'namespace'
         && lk != 51                // 'require'
         && lk != 52                // 'return'
         && lk != 53                // 'test'
         && lk != 54                // 'throw'
         && lk != 55                // 'try'
         && lk != 56                // 'while'
         && lk != 57                // '{'
         && lk != 58                // '|'
         && lk != 59                // '||'
         && lk != 60                // '}'
         && lk != 61                // '~'
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
         && lk != 109027            // '[' 'break' ';'
         && lk != 109155)           // '[' 'continue' ';'
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
              lookahead1W(16);      // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
        lookahead1W(16);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
        try_arguments();
        consumeT(36);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(57);                    // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      whitespace();
      parse_element();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(57);                   // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
      try_element();
    }
    consumeT(60);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(35);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '`' | '|' | '||' | '}'
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
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '`' | '|' | '||' | '}'
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
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'import' | 'namespace' | 'require' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '~'
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
    case 57:                        // '{'
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
    case 57:                        // '{'
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
  for (var i = 0; i < 62; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 207 + s - 1;
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
  /*   0 */ 56, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
  /*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 9,
  /*  64 */ 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 29, 30,
  /*  98 */ 31, 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 6, 49, 6, 50, 6, 51, 52, 53,
  /* 126 */ 54, 9
];

MaiaScript.MAP1 =
[
  /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  54 */ 119, 151, 182, 214, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  /*  75 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 245, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  /*  96 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  /* 117 */ 255, 255, 56, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 151 */ 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22,
  /* 180 */ 23, 24, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6,
  /* 214 */ 29, 30, 31, 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 6, 49, 6, 50, 6, 51,
  /* 242 */ 52, 53, 54, 9, 9, 9, 9, 9, 9, 9, 9, 55, 55, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  /* 276 */ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
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
  /*    0 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*   18 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1824, 1824, 1824, 1827,
  /*   36 */ 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107,
  /*   54 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1824, 1824, 1824, 1827, 3107, 2172, 3107, 3107,
  /*   72 */ 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*   90 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2134, 1835, 1841, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175,
  /*  108 */ 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  126 */ 3107, 3107, 3107, 2165, 1855, 1859, 3107, 1871, 2117, 3107, 3107, 3107, 2170, 2175, 3107, 3107, 3107, 3107,
  /*  144 */ 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  162 */ 1881, 1885, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107,
  /*  180 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552, 2860, 1897,
  /*  198 */ 2117, 2860, 2860, 2860, 3105, 1900, 2860, 2860, 2860, 3104, 1899, 2860, 2860, 2861, 1873, 2860, 2860, 2555,
  /*  216 */ 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2910, 3107, 1908, 3107, 2172, 2117, 3107, 3107, 3107,
  /*  234 */ 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  252 */ 3107, 3107, 3107, 3107, 3107, 3267, 3107, 1920, 3107, 2172, 1932, 3107, 3107, 3107, 3107, 2175, 3107, 3107,
  /*  270 */ 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  288 */ 3107, 3107, 3107, 3107, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107,
  /*  306 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1959, 1963, 1971, 1975,
  /*  324 */ 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107,
  /*  342 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1987, 1989, 1998, 2005, 3107, 2172, 2117, 3107,
  /*  360 */ 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  378 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3357, 3107, 2017, 3107, 2029, 2481, 3107, 3107, 3107, 2821, 2044,
  /*  396 */ 3107, 3107, 3107, 1951, 2031, 3107, 3107, 3107, 2039, 3107, 3107, 2052, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  414 */ 3107, 3107, 3107, 2423, 2062, 2068, 3107, 2080, 2117, 3107, 3107, 3107, 3107, 2090, 3107, 3107, 3107, 3153,
  /*  432 */ 2082, 3107, 3107, 3107, 2390, 3107, 3107, 2115, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2125,
  /*  450 */ 3108, 2130, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107,
  /*  468 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2403, 2142, 2148, 3107, 2160,
  /*  486 */ 2117, 3107, 3107, 3107, 3107, 2090, 3107, 3107, 3107, 3153, 2183, 3107, 3107, 3107, 2390, 3107, 3107, 2115,
  /*  504 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1990, 1990, 3107, 2451, 3107, 2214, 2117, 3107, 3107, 3107,
  /*  522 */ 3009, 2218, 3107, 3107, 3107, 3009, 2174, 3107, 3107, 3107, 2436, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  540 */ 3107, 3107, 3107, 3107, 3107, 3400, 2226, 2232, 3107, 2172, 2351, 3107, 3107, 3107, 2170, 2175, 3107, 3107,
  /*  558 */ 3107, 3107, 3489, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  576 */ 3107, 2418, 2244, 2248, 2860, 2256, 2117, 2860, 2860, 2860, 2275, 2269, 2860, 2860, 2860, 2261, 2283, 2860,
  /*  594 */ 2860, 2861, 2307, 2860, 2860, 3230, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2418, 2244, 2248,
  /*  612 */ 2860, 2321, 2117, 2860, 2860, 2860, 2313, 2334, 2860, 2860, 2860, 2326, 2283, 2860, 2860, 2861, 2359, 2860,
  /*  630 */ 2860, 3344, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 1847, 1845, 3107, 3107, 3107, 2172, 2117, 3107,
  /*  648 */ 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  666 */ 3107, 3107, 3107, 3107, 3107, 3107, 2152, 2379, 2373, 2385, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175,
  /*  684 */ 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  702 */ 3107, 3107, 3107, 1863, 3107, 2398, 3107, 2172, 2411, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107,
  /*  720 */ 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1889,
  /*  738 */ 3107, 2431, 3107, 2172, 2444, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107,
  /*  756 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1912, 3107, 2463, 3107, 2172,
  /*  774 */ 2455, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  792 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2799, 2806, 2810, 3107, 2172, 2117, 3107, 3107, 3107,
  /*  810 */ 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  828 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2479, 2117, 3107, 3107, 3107, 2170, 2175, 3107, 3107,
  /*  846 */ 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  864 */ 3107, 2489, 3256, 2495, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107,
  /*  882 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1924, 3107, 2508,
  /*  900 */ 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107,
  /*  918 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 1979, 3107, 2521, 3107, 2172, 2117, 3107,
  /*  936 */ 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /*  954 */ 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2602, 2979, 2534, 2117, 2565, 2579, 2860, 3105, 1900,
  /*  972 */ 2860, 3175, 2860, 3104, 2500, 2860, 2860, 2549, 1873, 2589, 2860, 2555, 2937, 2599, 3107, 3107, 3107, 3107,
  /*  990 */ 3107, 3107, 2349, 2345, 2610, 2614, 2860, 1897, 2117, 2860, 2860, 2860, 2340, 1900, 2860, 2860, 2860, 3104,
  /* 1008 */ 1899, 2860, 2860, 2861, 1873, 2860, 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3487, 3483,
  /* 1026 */ 2622, 2630, 2860, 1897, 2117, 2860, 2860, 2860, 3105, 1900, 2860, 2988, 2643, 3104, 1899, 2653, 2666, 2861,
  /* 1044 */ 1873, 2860, 2860, 2541, 2860, 3420, 3107, 3107, 3107, 3107, 3107, 3107, 3254, 3250, 2677, 2681, 2860, 1897,
  /* 1062 */ 2117, 2860, 2860, 2860, 3105, 1900, 2860, 2860, 2860, 3104, 1899, 2860, 2860, 2861, 1873, 2860, 2860, 2555,
  /* 1080 */ 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 2105, 2101, 2689, 2696, 2669, 2713, 2117, 2774, 2701, 2860,
  /* 1098 */ 2471, 2721, 2860, 2557, 2736, 2728, 2513, 2748, 2951, 2581, 2765, 2860, 2782, 2772, 2860, 2792, 3107, 3107,
  /* 1116 */ 3107, 3107, 3107, 3107, 2818, 3478, 2829, 2833, 2658, 1897, 2117, 3329, 2860, 2860, 2340, 1900, 2860, 2860,
  /* 1134 */ 2860, 3104, 1899, 2860, 2860, 2861, 1873, 2860, 2657, 2555, 2841, 2861, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1152 */ 3106, 2468, 2860, 2552, 2591, 2851, 2117, 2919, 2859, 2860, 3105, 1900, 2860, 2860, 2860, 3104, 1899, 2860,
  /* 1170 */ 2656, 2861, 1873, 2860, 2869, 2555, 3031, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 1948, 1944, 2879, 2883,
  /* 1188 */ 2860, 1897, 2117, 2860, 2860, 2860, 2891, 1900, 2860, 2918, 2860, 3104, 1899, 2860, 2965, 2757, 1873, 2927,
  /* 1206 */ 2945, 2290, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552, 2860, 1897, 2117, 2860,
  /* 1224 */ 2860, 2860, 3105, 1900, 2860, 2860, 2860, 3104, 1899, 2860, 2657, 2861, 2054, 2860, 2860, 2555, 2860, 2861,
  /* 1242 */ 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552, 2963, 1897, 2117, 2860, 3293, 2705, 3105, 2973,
  /* 1260 */ 2860, 2860, 2657, 3245, 2526, 2860, 2996, 2861, 1873, 2860, 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107,
  /* 1278 */ 3107, 3107, 3106, 2468, 2860, 2552, 2984, 1897, 2117, 3179, 2860, 2753, 3105, 1900, 2295, 2860, 2860, 3104,
  /* 1296 */ 1899, 2860, 2860, 2861, 1873, 2860, 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3006, 2096,
  /* 1314 */ 3017, 3021, 2860, 1897, 2117, 2860, 3050, 3029, 2340, 3039, 3047, 2860, 2860, 3104, 1899, 2860, 2860, 2861,
  /* 1332 */ 1873, 2860, 2933, 3058, 3069, 3120, 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 3312, 3078, 3089,
  /* 1350 */ 2117, 3116, 3128, 2860, 3105, 1900, 2860, 2860, 3139, 3150, 1899, 3325, 3161, 2861, 1873, 2860, 2860, 2555,
  /* 1368 */ 2365, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552, 2860, 1897, 2117, 2860, 2860, 2203,
  /* 1386 */ 3105, 1900, 3170, 2860, 2860, 3104, 1899, 2860, 2860, 2861, 1873, 2860, 2998, 3377, 2860, 2861, 3107, 3107,
  /* 1404 */ 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552, 2860, 1897, 2117, 2860, 2860, 3061, 3105, 1900, 2740, 2860,
  /* 1422 */ 2860, 3104, 1899, 2860, 2860, 2861, 1873, 2860, 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1440 */ 2907, 2903, 3187, 3191, 2645, 3199, 2117, 3207, 2860, 3215, 2340, 1900, 3223, 2860, 2860, 3104, 1899, 2860,
  /* 1458 */ 2860, 3371, 1873, 2571, 3070, 3426, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552,
  /* 1476 */ 2860, 1897, 2117, 2860, 2843, 2871, 3105, 1900, 3131, 3240, 2860, 3104, 2190, 2860, 2860, 3100, 1873, 2299,
  /* 1494 */ 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3264, 1939, 3275, 3279, 2860, 1897, 2117, 2860,
  /* 1512 */ 2545, 3081, 2340, 1900, 2955, 3287, 2783, 3104, 1899, 3301, 2860, 3309, 1873, 3320, 2860, 2197, 2860, 2861,
  /* 1530 */ 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468, 2860, 2552, 3095, 3337, 2117, 2635, 2860, 2860, 3354, 3365,
  /* 1548 */ 3162, 2860, 3142, 3104, 1899, 2206, 2860, 2861, 1873, 2860, 2860, 2555, 3414, 2861, 3107, 3107, 3107, 3107,
  /* 1566 */ 3107, 3107, 3455, 3451, 3385, 3389, 2860, 1897, 2117, 2860, 2860, 2860, 3105, 1900, 2860, 2860, 2860, 3104,
  /* 1584 */ 1899, 2860, 2860, 2784, 1873, 3232, 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 3106, 2468,
  /* 1602 */ 2860, 2552, 2860, 1897, 2117, 2860, 2860, 2860, 3397, 3408, 3346, 2860, 2860, 3104, 1899, 2860, 2860, 2861,
  /* 1620 */ 1873, 2860, 2860, 2555, 2860, 2861, 3107, 3107, 3107, 3107, 3107, 3107, 2107, 2898, 3434, 3438, 3107, 2172,
  /* 1638 */ 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1656 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2009, 3107, 3446, 3107, 2172, 2021, 3107, 3107, 3107,
  /* 1674 */ 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1692 */ 3107, 3107, 3107, 3107, 3107, 3463, 3465, 3473, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107,
  /* 1710 */ 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1728 */ 3107, 2236, 3497, 3501, 3107, 2172, 2117, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107,
  /* 1746 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1764 */ 3107, 2172, 3107, 3107, 3107, 3107, 3107, 2175, 3107, 3107, 3107, 3107, 2174, 3107, 3107, 3107, 3107, 3107,
  /* 1782 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 2072, 3107, 3107, 3107, 3107, 3107,
  /* 1800 */ 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107, 3107,
  /* 1818 */ 3107, 3107, 3107, 3107, 3107, 3107, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 0, 0, 0, 3328, 3328,
  /* 1837 */ 3328, 3328, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 42, 42, 42, 42, 42, 42,
  /* 1861 */ 42, 42, 0, 0, 0, 0, 0, 7219, 7219, 7219, 0, 2048, 0, 0, 0, 0, 0, 0, 1054, 1054, 2871, 2871, 2871, 2871,
  /* 1885 */ 2871, 2871, 2871, 2871, 0, 0, 0, 0, 0, 7988, 7988, 7988, 0, 42, 0, 0, 0, 1054, 1054, 1054, 94, 1054, 1054,
  /* 1908 */ 0, 0, 3840, 3840, 0, 0, 0, 0, 0, 8501, 8501, 8501, 0, 0, 4146, 4146, 0, 0, 0, 0, 0, 9728, 9728, 9728, 0,
  /* 1933 */ 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 1072, 1072, 0, 0, 0, 1060, 1060, 0, 0, 0, 0, 0, 0, 0, 87, 0, 87, 0, 4608,
  /* 1961 */ 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 0, 0, 0, 0, 0, 9984,
  /* 1985 */ 9984, 9984, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 6144, 0, 4864, 0, 0, 0, 4864, 0, 4864, 4864, 4864, 4864, 0, 0,
  /* 2011 */ 0, 0, 0, 15158, 15158, 15158, 0, 0, 5120, 5120, 0, 0, 0, 0, 0, 15360, 2871, 0, 0, 42, 0, 0, 87, 0, 0, 0,
  /* 2037 */ 135, 0, 87, 0, 87, 87, 87, 87, 0, 0, 0, 0, 135, 0, 0, 0, 87, 0, 0, 0, 0, 0, 0, 1054, 10270, 43, 43, 43, 43,
  /* 2066 */ 43, 43, 43, 43, 5419, 5419, 0, 0, 0, 0, 768, 0, 0, 0, 0, 42, 0, 0, 43, 0, 0, 0, 94, 0, 129, 130, 0, 0, 0,
  /* 2095 */ 94, 0, 0, 0, 1071, 1071, 0, 0, 0, 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 14848, 0, 0, 162, 0, 0, 0, 0, 0, 0,
  /* 2123 */ 2871, 0, 0, 5632, 5632, 0, 0, 5632, 5632, 5632, 5632, 0, 0, 0, 0, 3328, 49, 49, 49, 44, 44, 44, 44, 44, 44,
  /* 2148 */ 44, 44, 5932, 5932, 0, 0, 0, 0, 6912, 0, 0, 0, 0, 42, 85, 85, 43, 0, 0, 0, 42, 42, 0, 0, 0, 42, 0, 0, 0, 0,
  /* 2178 */ 0, 0, 94, 0, 0, 85, 0, 43, 0, 0, 0, 94, 0, 0, 0, 1191, 1054, 1054, 94, 1054, 0, 1054, 1054, 1054, 12830,
  /* 2203 */ 1054, 1054, 1139, 1054, 1054, 1054, 1054, 1054, 1198, 1199, 1054, 0, 42, 0, 0, 88, 0, 0, 0, 0, 94, 0, 0,
  /* 2226 */ 56, 56, 56, 56, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0, 15872, 0, 0, 0, 2605, 2605, 2605, 2605, 2605, 2605,
  /* 2250 */ 2605, 2605, 0, 1054, 1054, 1054, 0, 42, 86, 2605, 2605, 1054, 1054, 1054, 0, 161, 86, 163, 2724, 2605,
  /* 2270 */ 2691, 1054, 1054, 1054, 94, 1054, 1054, 0, 0, 86, 86, 0, 2688, 2726, 2691, 2726, 1054, 1054, 1054, 94,
  /* 2290 */ 1054, 0, 1054, 1054, 1224, 1054, 1054, 1054, 1165, 1054, 1054, 1054, 1054, 1215, 1054, 1054, 1054, 161,
  /* 2308 */ 163, 163, 2724, 2724, 2726, 1054, 1054, 0, 0, 86, 126, 0, 2688, 0, 42, 86, 2605, 2649, 1054, 1054, 1054, 0,
  /* 2330 */ 161, 126, 163, 2725, 2649, 2691, 1054, 1054, 1054, 94, 1054, 1054, 0, 42, 0, 0, 0, 0, 1055, 1055, 0, 0, 0,
  /* 2353 */ 0, 0, 0, 0, 2871, 2871, 186, 163, 163, 2725, 2725, 2726, 1054, 1054, 1054, 1209, 1054, 1054, 1054, 1229, 0,
  /* 2374 */ 0, 6912, 0, 0, 6912, 6912, 0, 6912, 0, 0, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0, 43, 129, 43, 0, 0, 0, 0,
  /* 2400 */ 7219, 7219, 0, 0, 0, 0, 44, 44, 5888, 5888, 5888, 0, 0, 7424, 0, 0, 0, 2871, 0, 0, 0, 2605, 2605, 0, 0, 0,
  /* 2426 */ 43, 43, 5376, 5376, 5376, 0, 0, 7988, 7988, 0, 0, 0, 0, 125, 125, 125, 0, 0, 3584, 0, 7680, 8192, 8704, 0,
  /* 2450 */ 2871, 0, 0, 0, 6144, 0, 0, 0, 0, 8960, 0, 2871, 0, 0, 0, 8501, 8501, 0, 0, 0, 0, 1054, 1054, 0, 0, 0, 127,
  /* 2477 */ 0, 0, 0, 84, 0, 0, 0, 0, 0, 0, 2871, 94, 0, 0, 9472, 0, 0, 0, 9472, 9472, 9472, 9472, 0, 0, 0, 0, 1054,
  /* 2504 */ 1054, 1054, 94, 1192, 0, 0, 9728, 9728, 0, 0, 0, 0, 1054, 1054, 1566, 94, 1054, 0, 0, 9984, 9984, 0, 0, 0,
  /* 2528 */ 0, 1054, 1310, 1054, 94, 1054, 0, 42, 0, 0, 0, 1115, 1100, 1054, 0, 1054, 1223, 1054, 1054, 1054, 1054,
  /* 2549 */ 1133, 1054, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1054, 152, 1054, 1054, 1093,
  /* 2567 */ 1054, 1115, 1054, 1124, 1054, 1054, 1054, 1214, 1054, 1054, 1217, 1054, 1054, 1130, 1054, 1054, 1054, 1054,
  /* 2585 */ 1054, 1054, 1054, 14592, 1054, 1212, 1054, 1054, 1054, 1054, 1054, 1054, 1104, 1106, 1230, 1054, 1054,
  /* 2602 */ 1054, 1054, 1054, 1054, 0, 1054, 1054, 1093, 1081, 1081, 1081, 1081, 1081, 1081, 1081, 1081, 0, 1054, 1054,
  /* 2621 */ 1054, 1082, 1082, 1082, 1082, 1082, 1082, 1082, 1082, 1090, 1082, 1082, 1082, 0, 1054, 1054, 1054, 1122,
  /* 2639 */ 1054, 1116, 1054, 1054, 1054, 1178, 1054, 1054, 1054, 1054, 1054, 1054, 1105, 1054, 1054, 1054, 1195, 1054,
  /* 2657 */ 1054, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1054, 1054, 1202, 1054, 1054, 1054, 1054, 1054, 1102,
  /* 2675 */ 1103, 1054, 1083, 1083, 1083, 1083, 1083, 1083, 1083, 1083, 0, 1054, 1054, 1054, 1058, 1058, 1058, 1058,
  /* 2693 */ 1058, 1058, 1058, 1058, 1091, 1058, 1058, 0, 1054, 1054, 1054, 1132, 1054, 1054, 1054, 1054, 1141, 1054,
  /* 2711 */ 1054, 1054, 0, 42, 0, 0, 90, 1054, 1054, 1103, 90, 0, 1054, 1054, 1054, 94, 1160, 1054, 30, 1054, 0, 0,
  /* 2733 */ 127, 0, 90, 1177, 1054, 1054, 1180, 1054, 1054, 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1194, 1054, 1054,
  /* 2752 */ 1197, 1054, 1054, 1054, 1140, 1054, 1054, 1054, 1054, 1208, 1054, 1054, 0, 127, 0, 0, 90, 90, 127, 1822,
  /* 2772 */ 1054, 127, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 1126, 14622, 1054, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 2790 */ 30, 0, 1054, 13342, 1054, 10782, 1054, 1054, 13086, 0, 0, 0, 9216, 9216, 0, 0, 9216, 9216, 9216, 9216,
  /* 2810 */ 9216, 9216, 9216, 9216, 0, 0, 0, 0, 1059, 0, 0, 0, 0, 0, 0, 0, 87, 0, 0, 1084, 1084, 1084, 1084, 1084,
  /* 2834 */ 1084, 1084, 1084, 0, 1054, 1054, 1054, 1054, 11550, 1054, 1054, 1054, 1054, 1054, 1054, 1135, 1054, 83, 42,
  /* 2853 */ 0, 0, 0, 1054, 1054, 1104, 1129, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0, 1054, 10526, 1054,
  /* 2872 */ 1054, 1054, 1054, 1054, 1054, 1144, 1054, 1085, 1085, 1085, 1085, 1085, 1085, 1085, 1085, 0, 1054, 1054,
  /* 2890 */ 1054, 1054, 1147, 124, 0, 0, 0, 2304, 0, 0, 0, 14848, 14848, 0, 0, 0, 1062, 1062, 0, 0, 0, 0, 0, 0, 0,
  /* 2915 */ 3840, 3840, 3840, 1170, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1127, 1211, 1054, 1054, 1054, 1054, 1216,
  /* 2933 */ 1054, 1054, 1054, 1219, 1054, 1054, 1054, 1054, 1227, 1054, 1054, 1054, 1054, 1054, 1218, 1054, 1054, 1220,
  /* 2951 */ 1054, 1054, 1054, 11443, 1054, 1054, 1054, 1054, 1167, 1054, 1054, 1054, 1054, 1095, 1054, 1054, 1054,
  /* 2968 */ 1054, 1054, 1054, 1204, 1205, 0, 0, 1156, 1157, 1054, 94, 1054, 1054, 1096, 1054, 1100, 1054, 1054, 1054,
  /* 2987 */ 1099, 1054, 1054, 1054, 1054, 1174, 1054, 1054, 1054, 1054, 1201, 1054, 1054, 1054, 1054, 1054, 1054, 1221,
  /* 3005 */ 1054, 1061, 0, 0, 0, 0, 0, 0, 0, 125, 0, 0, 1086, 1086, 1086, 1086, 1086, 1086, 1086, 1086, 0, 1054, 1054,
  /* 3028 */ 1054, 1054, 1138, 1054, 1054, 1054, 1054, 1054, 1054, 12062, 1054, 0, 0, 1054, 1054, 1054, 94, 1054, 1161,
  /* 3047 */ 1054, 1163, 1054, 1054, 1054, 1054, 1054, 1054, 1134, 1054, 1054, 30, 0, 1222, 1054, 1054, 1054, 1054,
  /* 3065 */ 1054, 1142, 1054, 1054, 13598, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1146, 30, 1054, 1097, 1054, 1054,
  /* 3083 */ 1054, 1054, 1054, 1143, 1054, 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1098, 1054, 1101, 1054, 1054, 1054,
  /* 3103 */ 1207, 1054, 1054, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 5632, 1054, 1120, 11038, 1121, 1054, 1054, 1054, 1054,
  /* 3124 */ 12318, 1054, 1054, 0, 1054, 1120, 1054, 1054, 1054, 1054, 1054, 1054, 1168, 1054, 1054, 1054, 1054, 1179,
  /* 3142 */ 1054, 1054, 1054, 1054, 1054, 1181, 1182, 1054, 1183, 1054, 1054, 0, 0, 0, 0, 0, 162, 162, 43, 1200, 1054,
  /* 3163 */ 1054, 1054, 1054, 1054, 1054, 1054, 1158, 1054, 1054, 1164, 1054, 1054, 1054, 1054, 1054, 1173, 1054, 1054,
  /* 3181 */ 1054, 1054, 1123, 1054, 1054, 1054, 1087, 1087, 1087, 1087, 1087, 1087, 1087, 1087, 0, 1054, 1092, 1054, 0,
  /* 3200 */ 42, 0, 0, 0, 1054, 1054, 1117, 1119, 1054, 1054, 1054, 1054, 1054, 1054, 1128, 113, 1054, 1054, 1054, 1054,
  /* 3220 */ 1054, 1054, 1145, 11914, 1054, 1054, 1054, 1054, 1054, 1169, 1054, 161, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 3238 */ 1054, 14110, 1054, 1054, 1172, 1054, 1054, 1054, 1054, 1146, 160, 0, 0, 0, 0, 1057, 1057, 0, 0, 0, 0, 0, 0,
  /* 3261 */ 0, 9472, 9472, 1063, 0, 0, 0, 0, 0, 0, 0, 4146, 4146, 4146, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 1088,
  /* 3283 */ 0, 1054, 1054, 1054, 1054, 1171, 1054, 1054, 1054, 1175, 1054, 1054, 1131, 1054, 1054, 1054, 1054, 1136,
  /* 3301 */ 1193, 1054, 1054, 1054, 1054, 1054, 1054, 13854, 1054, 1206, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1054,
  /* 3319 */ 1094, 1054, 1054, 1213, 1054, 1054, 1054, 1054, 1054, 1196, 1054, 1054, 1054, 1054, 12574, 1054, 1054,
  /* 3336 */ 1054, 0, 42, 0, 0, 0, 1098, 1116, 1054, 186, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 14366, 1146, 1054,
  /* 3356 */ 0, 0, 0, 0, 0, 0, 5120, 5120, 5120, 0, 0, 1054, 1054, 1158, 94, 1054, 1054, 1144, 1054, 1054, 1209, 1054,
  /* 3378 */ 0, 1054, 1054, 1054, 1054, 1225, 1054, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054,
  /* 3397 */ 30, 1054, 0, 0, 0, 0, 0, 0, 6400, 6400, 6400, 0, 0, 1054, 1054, 30, 94, 1054, 1054, 1146, 1054, 1054, 1228,
  /* 3420 */ 1054, 1054, 1146, 1054, 1054, 1231, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1226, 14848, 14848, 14848,
  /* 3437 */ 14848, 14848, 14848, 14848, 14848, 0, 0, 0, 0, 0, 0, 15158, 15158, 0, 0, 0, 0, 1064, 1064, 0, 0, 0, 0, 41,
  /* 3461 */ 0, 0, 0, 15616, 0, 0, 0, 15616, 0, 0, 0, 0, 15616, 15616, 15616, 15616, 0, 0, 0, 0, 1070, 1070, 0, 0, 0,
  /* 3486 */ 1056, 1056, 0, 0, 0, 0, 0, 0, 0, 2910, 0, 15872, 15872, 15872, 15872, 15872, 15872, 15872, 15872, 0, 0, 0,
  /* 3508 */ 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 104, 108, 112, 116, 120, 124, 128, 132, 165, 165, 187, 191, 138, 207, 142, 146, 165, 165, 165, 165, 134,
  /*  21 */ 150, 190, 159, 165, 166, 165, 165, 165, 165, 133, 150, 153, 158, 165, 165, 165, 165, 165, 133, 150, 154,
  /*  42 */ 165, 165, 165, 165, 163, 165, 165, 165, 165, 133, 229, 219, 170, 174, 177, 180, 184, 229, 229, 221, 229,
  /*  63 */ 229, 230, 195, 201, 252, 205, 229, 229, 229, 223, 229, 229, 197, 212, 243, 256, 229, 229, 229, 222, 229,
  /*  84 */ 229, 196, 211, 241, 255, 229, 229, 222, 229, 196, 211, 216, 227, 229, 234, 239, 228, 235, 247, 251, 2056,
  /* 105 */ 133120, 264192, 33556480, 67110912, 2048, 2048, 8521728, 67373056, 2099200, 69208064, 134136, 138232,
  /* 117 */ -75896832, -42342400, -33822720, 139256, 401400, 67248120, 139256, 139260, 67510264, 67248120, 2498552,
  /* 128 */ 69607416, 69607416, -41943048, -33554440, 2048, 8, 8, 8, 0, 128, 8192, 65536, 805306368, 0x80000000, 8, 8,
  /* 144 */ 8, 72, 8, 24, 8, 40, 256, 256, 256, 768, 768, 768, 72, 8, 24, 40, 1024, 8, 8, 8, 256, 8, 8, 8, 8, 40,
  /* 170 */ 268435456, 16, 33554440, 570425352, 469762151, 201326711, 201326719, 603973256, 603973256, 872408712,
  /* 180 */ 603973256, 603973272, 603973272, 872408984, 872414872, 1073735423, 1073735423, 0, 128, 256, 768, 768, 72,
  /* 193 */ 24, 40, 134217728, 0, 0, 128, 512, 24576, 512, 1024, 57344, 196608, 768, 6144, 0, 0, 1024, 1024, 16384,
  /* 212 */ 32768, 131072, 262144, 1572864, 524288, 1048576, 4194304, 16777216, 33554432, 0, 0, 0, 16777216, 0, 0, 256,
  /* 228 */ 4096, 0, 0, 0, 0, 6, 0, 512, 16384, 32768, 262144, 131072, 262144, 524288, 1048576, 2097152, 4194304,
  /* 245 */ 8388608, 16777216, 524288, 0, 512, 32768, 262144, 262144, 1572864, 14680064, 16777216, 256, 6144, 0, 0
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
  "'import'",
  "'namespace'",
  "'require'",
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
