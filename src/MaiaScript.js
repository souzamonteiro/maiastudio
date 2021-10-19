// This file was generated on Tue Oct 19, 2021 11:16 (UTC-03) by REx v5.54 which is Copyright (c) 1979-2021 by Gunther Rademacher <grd@gmx.net>
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
    lookahead1W(21);                // END | eof | identifier | null | true | false | string | complex | real |
                                    // comment | whitespace^token | '!' | '(' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
      if (l1 != 64)                 // '||'
      {
        break;
      }
      consume(64);                  // '||'
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
      if (l1 != 64)                 // '||'
      {
        break;
      }
      consumeT(64);                 // '||'
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
      if (l1 != 66)                 // '||||'
      {
        break;
      }
      consume(66);                  // '||||'
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
      if (l1 != 66)                 // '||||'
      {
        break;
      }
      consumeT(66);                 // '||||'
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
      if (l1 != 63)                 // '|'
      {
        break;
      }
      consume(63);                  // '|'
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
      if (l1 != 63)                 // '|'
      {
        break;
      }
      consumeT(63);                 // '|'
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
      if (l1 != 65)                 // '|||'
      {
        break;
      }
      consume(65);                  // '|||'
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
      if (l1 != 65)                 // '|||'
      {
        break;
      }
      consumeT(65);                 // '|||'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
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
    case 68:                        // '~'
      consume(68);                  // '~'
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
    case 68:                        // '~'
      consumeT(68);                 // '~'
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
    case 55:                        // 'namespace'
    case 56:                        // 'object'
      parse_namespace();
      break;
    case 52:                        // 'inherit'
      parse_inherit();
      break;
    case 54:                        // 'local'
      parse_local();
      break;
    case 51:                        // 'if'
      parse_if();
      break;
    case 45:                        // 'do'
      parse_do();
      break;
    case 61:                        // 'while'
      parse_while();
      break;
    case 48:                        // 'for'
      parse_for();
      break;
    case 49:                        // 'foreach'
      parse_foreach();
      break;
    case 60:                        // 'try'
      parse_try();
      break;
    case 58:                        // 'test'
      parse_test();
      break;
    case 41:                        // 'break'
      parse_break();
      break;
    case 44:                        // 'continue'
      parse_continue();
      break;
    case 57:                        // 'return'
      parse_return();
      break;
    case 59:                        // 'throw'
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
    case 55:                        // 'namespace'
    case 56:                        // 'object'
      try_namespace();
      break;
    case 52:                        // 'inherit'
      try_inherit();
      break;
    case 54:                        // 'local'
      try_local();
      break;
    case 51:                        // 'if'
      try_if();
      break;
    case 45:                        // 'do'
      try_do();
      break;
    case 61:                        // 'while'
      try_while();
      break;
    case 48:                        // 'for'
      try_for();
      break;
    case 49:                        // 'foreach'
      try_foreach();
      break;
    case 60:                        // 'try'
      try_try();
      break;
    case 58:                        // 'test'
      try_test();
      break;
    case 41:                        // 'break'
      try_break();
      break;
    case 44:                        // 'continue'
      try_continue();
      break;
    case 57:                        // 'return'
      try_return();
      break;
    case 59:                        // 'throw'
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
    case 55:                        // 'namespace'
      consume(55);                  // 'namespace'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consume(62);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(67);                  // '}'
      break;
    default:
      consume(56);                  // 'object'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consume(62);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(67);                  // '}'
    }
    eventHandler.endNonterminal("namespace", e0);
  }

  function try_namespace()
  {
    switch (l1)
    {
    case 55:                        // 'namespace'
      consumeT(55);                 // 'namespace'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(62);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(67);                 // '}'
      break;
    default:
      consumeT(56);                 // 'object'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(62);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(67);                 // '}'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(62);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(67);                  // '}'
      break;
    case 43:                        // 'constructor'
      consume(43);                  // 'constructor'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(62);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(67);                  // '}'
      break;
    case 53:                        // 'kernel'
      consume(53);                  // 'kernel'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(62);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(67);                  // '}'
      break;
    default:
      consume(50);                  // 'function'
      lookahead1W(0);               // identifier | whitespace^token
      consume(3);                   // identifier
      lookahead1W(1);               // whitespace^token | '('
      consume(17);                  // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        whitespace();
        parse_arguments();
      }
      consume(18);                  // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consume(62);                  // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        whitespace();
        parse_expression();
      }
      consume(67);                  // '}'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(62);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(67);                 // '}'
      break;
    case 43:                        // 'constructor'
      consumeT(43);                 // 'constructor'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(62);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(67);                 // '}'
      break;
    case 53:                        // 'kernel'
      consumeT(53);                 // 'kernel'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(62);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(67);                 // '}'
      break;
    default:
      consumeT(50);                 // 'function'
      lookahead1W(0);               // identifier | whitespace^token
      consumeT(3);                  // identifier
      lookahead1W(1);               // whitespace^token | '('
      consumeT(17);                 // '('
      lookahead1W(18);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      if (l1 != 18)                 // ')'
      {
        try_arguments();
      }
      consumeT(18);                 // ')'
      lookahead1W(6);               // whitespace^token | '{'
      consumeT(62);                 // '{'
      for (;;)
      {
        lookahead1W(20);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
        if (l1 == 67)               // '}'
        {
          break;
        }
        try_expression();
      }
      consumeT(67);                 // '}'
    }
  }

  function parse_inherit()
  {
    eventHandler.startNonterminal("inherit", e0);
    consume(52);                    // 'inherit'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler.endNonterminal("inherit", e0);
  }

  function try_inherit()
  {
    consumeT(52);                   // 'inherit'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_local()
  {
    eventHandler.startNonterminal("local", e0);
    consume(54);                    // 'local'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    eventHandler.endNonterminal("local", e0);
  }

  function try_local()
  {
    consumeT(54);                   // 'local'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("elseif", e0);
  }

  function try_elseif()
  {
    consumeT(47);                   // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
  }

  function parse_else()
  {
    eventHandler.startNonterminal("else", e0);
    consume(46);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("else", e0);
  }

  function try_else()
  {
    consumeT(46);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
  }

  function parse_do()
  {
    eventHandler.startNonterminal("do", e0);
    consume(45);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(61);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(61);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
  }

  function parse_while()
  {
    eventHandler.startNonterminal("while", e0);
    consume(61);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("while", e0);
  }

  function try_while()
  {
    consumeT(61);                   // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
  }

  function parse_for()
  {
    eventHandler.startNonterminal("for", e0);
    consume(48);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("for", e0);
  }

  function try_for()
  {
    consumeT(48);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
  }

  function parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
    consume(49);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consume(27);                    // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      whitespace();
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("foreach", e0);
  }

  function try_foreach()
  {
    consumeT(49);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 27)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(27);                   // ';'
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
  }

  function parse_try()
  {
    eventHandler.startNonterminal("try", e0);
    consume(60);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("try", e0);
  }

  function try_try()
  {
    consumeT(60);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      try_catch();
    }
  }

  function parse_test()
  {
    eventHandler.startNonterminal("test", e0);
    consume(58);                    // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 42)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler.endNonterminal("test", e0);
  }

  function try_test()
  {
    consumeT(58);                   // 'test'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(22);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ';' | '[' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'catch' | 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' |
                                    // 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(62);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("catch", e0);
  }

  function try_catch()
  {
    consumeT(42);                   // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(62);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 67)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(67);                   // '}'
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
    consume(57);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    consumeT(57);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    consume(59);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    consumeT(59);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    case 37:                        // '['
    case 62:                        // '{'
    case 68:                        // '~'
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
    case 62:                        // '{'
    case 68:                        // '~'
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
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // whitespace^token | '!' | '(' | ')' | ',' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
     || lk == 854147                // identifier '(' 'inherit'
     || lk == 870531                // identifier '(' 'kernel'
     || lk == 886915                // identifier '(' 'local'
     || lk == 903299                // identifier '(' 'namespace'
     || lk == 919683                // identifier '(' 'object'
     || lk == 936067                // identifier '(' 'return'
     || lk == 952451                // identifier '(' 'test'
     || lk == 968835                // identifier '(' 'throw'
     || lk == 985219                // identifier '(' 'try'
     || lk == 1001603               // identifier '(' 'while'
     || lk == 1017987               // identifier '(' '{'
     || lk == 1116291)              // identifier '(' '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8741:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7717:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6949:                // '[' 'local'
          case 7973:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
          case 6821:                // '[' 'kernel'
          case 7077:                // '[' 'namespace'
          case 7205:                // '[' 'object'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 6181:                // '[' 'for'
          case 6309:                // '[' 'foreach'
          case 6565:                // '[' 'if'
          case 6693:                // '[' 'inherit'
          case 7333:                // '[' 'return'
          case 7461:                // '[' 'test'
          case 7589:                // '[' 'throw'
          case 7845:                // '[' 'while'
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
         && lk != 52                // 'inherit'
         && lk != 53                // 'kernel'
         && lk != 54                // 'local'
         && lk != 55                // 'namespace'
         && lk != 56                // 'object'
         && lk != 57                // 'return'
         && lk != 58                // 'test'
         && lk != 59                // 'throw'
         && lk != 60                // 'try'
         && lk != 61                // 'while'
         && lk != 62                // '{'
         && lk != 63                // '|'
         && lk != 64                // '||'
         && lk != 65                // '|||'
         && lk != 66                // '||||'
         && lk != 67                // '}'
         && lk != 68                // '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
      switch (lk)
      {
      case 2179:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
     || lk == 854147                // identifier '(' 'inherit'
     || lk == 870531                // identifier '(' 'kernel'
     || lk == 886915                // identifier '(' 'local'
     || lk == 903299                // identifier '(' 'namespace'
     || lk == 919683                // identifier '(' 'object'
     || lk == 936067                // identifier '(' 'return'
     || lk == 952451                // identifier '(' 'test'
     || lk == 968835                // identifier '(' 'throw'
     || lk == 985219                // identifier '(' 'try'
     || lk == 1001603               // identifier '(' 'while'
     || lk == 1017987               // identifier '(' '{'
     || lk == 1116291)              // identifier '(' '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // '-' | '.' | '/' | ':=' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' |
                                    // '>>' | '?=' | '[' | ']' | '^' | 'async' | 'break' | 'constructor' | 'continue' |
                                    // 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
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
                                    // 'for' | 'foreach' | 'function' | 'if' | 'inherit' | 'kernel' | 'local' |
                                    // 'namespace' | 'object' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' |
                                    // '|' | '||' | '|||' | '||||' | '}' | '~'
        switch (l1)
        {
        case 37:                    // '['
          lookahead2W(23);          // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 1573:                // '[' '!'
          case 8741:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 5797:                // '[' 'do'
          case 7717:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 1317:                // '[' comment
          case 5285:                // '[' 'break'
          case 5669:                // '[' 'continue'
            lookahead3W(10);        // whitespace^token | ',' | ';' | ']'
            break;
          case 2213:                // '[' '('
          case 6949:                // '[' 'local'
          case 7973:                // '[' '{'
            lookahead3W(16);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
          case 6821:                // '[' 'kernel'
          case 7077:                // '[' 'namespace'
          case 7205:                // '[' 'object'
            lookahead3W(0);         // identifier | whitespace^token
            break;
          case 6181:                // '[' 'for'
          case 6309:                // '[' 'foreach'
          case 6565:                // '[' 'if'
          case 6693:                // '[' 'inherit'
          case 7333:                // '[' 'return'
          case 7461:                // '[' 'test'
          case 7589:                // '[' 'throw'
          case 7845:                // '[' 'while'
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
         && lk != 52                // 'inherit'
         && lk != 53                // 'kernel'
         && lk != 54                // 'local'
         && lk != 55                // 'namespace'
         && lk != 56                // 'object'
         && lk != 57                // 'return'
         && lk != 58                // 'test'
         && lk != 59                // 'throw'
         && lk != 60                // 'try'
         && lk != 61                // 'while'
         && lk != 62                // '{'
         && lk != 63                // '|'
         && lk != 64                // '||'
         && lk != 65                // '|||'
         && lk != 66                // '||||'
         && lk != 67                // '}'
         && lk != 68                // '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
        try_arguments();
        consumeT(38);               // ']'
      }
    }
  }

  function parse_array()
  {
    eventHandler.startNonterminal("array", e0);
    consume(62);                    // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      whitespace();
      parse_element();
    }
    consume(67);                    // '}'
    eventHandler.endNonterminal("array", e0);
  }

  function try_array()
  {
    consumeT(62);                   // '{'
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
      try_element();
    }
    consumeT(67);                   // '}'
  }

  function parse_matrix()
  {
    eventHandler.startNonterminal("matrix", e0);
    consume(37);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'async' | 'break' |
                                    // 'constructor' | 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'inherit' | 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
      lookahead1W(16);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    lookahead1W(16);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'async' | 'break' | 'constructor' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'inherit' |
                                    // 'kernel' | 'local' | 'namespace' | 'object' | 'return' | 'test' | 'throw' |
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
    case 62:                        // '{'
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
    case 62:                        // '{'
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
  for (var i = 0; i < 69; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 246 + s - 1;
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
  /*    0 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*   18 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1824, 1824, 1824, 1827,
  /*   36 */ 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*   54 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1824, 1824, 1824, 1827, 2085, 2237, 2085, 2085,
  /*   72 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*   90 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2065, 1835, 1841, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085,
  /*  108 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  126 */ 2085, 2085, 2085, 3249, 1853, 1857, 2085, 2402, 2085, 1990, 2085, 2085, 2085, 2085, 2496, 2085, 2085, 2085,
  /*  144 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  162 */ 1869, 1873, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  180 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2084, 2179, 3093, 3088, 3093, 3418,
  /*  198 */ 2081, 2020, 3093, 3093, 3093, 3093, 2086, 3090, 3093, 3093, 3093, 3094, 2634, 3092, 3093, 3093, 3094, 2634,
  /*  216 */ 3093, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 2085, 2654, 2085, 3309, 2085, 2237, 2085, 1990, 2085, 2085,
  /*  234 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  252 */ 2085, 2085, 2085, 2085, 2085, 3375, 2085, 1885, 2085, 2237, 3605, 1990, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  270 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  288 */ 2085, 2085, 2085, 2085, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  306 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1897, 1901, 1909, 1913,
  /*  324 */ 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  342 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1925, 1927, 1936, 1943, 2085, 2237, 2085, 1990,
  /*  360 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  378 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 3616, 2085, 1955, 2085, 2237, 2161, 1990, 2085, 2085, 2085, 2085,
  /*  396 */ 2158, 2085, 2085, 2085, 2085, 2085, 3244, 2085, 2085, 2085, 2085, 1967, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  414 */ 2085, 2085, 2085, 3259, 1980, 1986, 2085, 2237, 2002, 1990, 2085, 2085, 2085, 2085, 2498, 2085, 2085, 2085,
  /*  432 */ 2085, 2085, 1998, 2085, 2085, 2085, 2085, 3254, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2011,
  /*  450 */ 2162, 2016, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  468 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1972, 2028, 2034, 2085, 2257,
  /*  486 */ 2002, 1990, 2085, 2085, 2085, 2085, 2498, 2085, 2085, 2085, 2085, 2085, 1998, 2085, 2085, 2085, 2085, 3254,
  /*  504 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2003, 2003, 2085, 3272, 2085, 2237, 2046, 1990, 2085, 2085,
  /*  522 */ 2085, 2085, 3162, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2153, 2085, 2085, 2085, 2085,
  /*  540 */ 2085, 2085, 2085, 2085, 2085, 1845, 2055, 2061, 2085, 2237, 2085, 3166, 2085, 2085, 2085, 2085, 2496, 2085,
  /*  558 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  576 */ 2085, 3157, 2073, 2077, 3093, 3515, 2094, 2020, 3093, 3093, 3093, 3093, 3218, 3090, 3093, 3093, 3093, 3094,
  /*  594 */ 2106, 3092, 3093, 3093, 3094, 2123, 3093, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 3461, 1861, 2085, 2773,
  /*  612 */ 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  630 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 3465, 2142, 2136, 2148, 2085, 2237, 2085, 1990,
  /*  648 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  666 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1877, 2085, 2170, 2085, 2237, 2047, 1990, 2085, 2085, 2085, 2085,
  /*  684 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  702 */ 2085, 2085, 2085, 3313, 2085, 2187, 2085, 2237, 2098, 2206, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  720 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1889,
  /*  738 */ 2085, 2225, 2085, 2237, 2085, 2245, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  756 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2838, 2085, 2826, 2085, 2237,
  /*  774 */ 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  792 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2084, 2179, 3093, 3088, 3093, 3418, 2265, 2020, 3093, 3093,
  /*  810 */ 3093, 3093, 2175, 3090, 3093, 3093, 3093, 3094, 3444, 3092, 3093, 3093, 3094, 2285, 3093, 3093, 3093, 3093,
  /*  828 */ 3093, 3093, 3095, 2085, 2085, 3594, 2308, 2312, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  846 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  864 */ 2085, 2085, 2085, 2085, 2085, 2788, 2085, 1990, 2085, 2085, 2085, 2085, 2496, 2085, 2085, 2085, 2085, 2085,
  /*  882 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2320, 2198, 2326,
  /*  900 */ 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  918 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1917, 2085, 2346, 2085, 2237, 2085, 1990,
  /*  936 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /*  954 */ 2085, 2085, 2085, 2085, 2085, 2085, 2196, 2192, 2366, 2370, 2382, 3418, 2390, 2020, 2410, 3084, 3093, 3093,
  /*  972 */ 2086, 3090, 3093, 2999, 3286, 3094, 2634, 2429, 2440, 2472, 3094, 2634, 2449, 3093, 3093, 3093, 2460, 2471,
  /*  990 */ 3095, 2085, 2215, 2211, 2480, 2484, 3093, 2492, 2081, 2020, 2441, 3093, 3093, 3093, 2632, 3090, 3093, 3093,
  /* 1008 */ 3093, 3094, 2634, 3092, 3093, 3093, 3094, 2634, 3093, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 2234, 2230,
  /* 1026 */ 2506, 2514, 3093, 3418, 2081, 2020, 3093, 3093, 2115, 3093, 2086, 3090, 2557, 2432, 2669, 3094, 2634, 3448,
  /* 1044 */ 2716, 2113, 3430, 2358, 3093, 2568, 3504, 3093, 3093, 2577, 3095, 2085, 2254, 2250, 2592, 2596, 3093, 3418,
  /* 1062 */ 2081, 2020, 3093, 3093, 3093, 3093, 2086, 3090, 3093, 3093, 3093, 3094, 2634, 3092, 3093, 3093, 3094, 2634,
  /* 1080 */ 3093, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 2835, 2831, 2604, 2611, 2707, 2628, 2642, 2020, 3532, 2662,
  /* 1098 */ 3093, 3093, 2175, 2738, 3093, 3093, 2681, 2689, 2696, 2374, 2704, 2715, 2724, 2732, 3555, 2755, 3093, 3093,
  /* 1116 */ 3093, 2534, 2767, 2085, 2785, 2889, 2796, 2800, 2920, 3418, 2081, 2020, 2808, 3093, 3093, 3093, 2632, 3090,
  /* 1134 */ 3093, 3093, 3093, 3094, 2634, 3092, 3093, 3093, 3094, 2634, 3093, 3093, 2114, 2463, 3093, 3093, 3095, 2085,
  /* 1152 */ 2084, 2179, 3093, 3088, 3093, 2820, 2884, 2020, 3093, 2846, 2932, 3093, 2086, 3090, 2857, 3093, 3093, 3094,
  /* 1170 */ 2634, 3092, 3093, 2111, 3094, 2634, 3093, 2529, 3093, 3093, 2620, 3093, 3095, 2085, 2274, 2270, 2866, 2870,
  /* 1188 */ 3093, 3418, 2081, 2020, 3093, 3093, 3093, 2569, 2878, 3090, 3093, 2906, 3093, 3094, 2634, 3092, 3093, 3495,
  /* 1206 */ 3094, 2634, 2916, 3184, 2929, 2940, 3093, 3093, 3095, 2085, 2084, 2179, 3093, 3088, 3093, 3418, 2081, 2020,
  /* 1224 */ 3093, 3093, 3093, 2950, 2086, 3090, 2421, 3093, 3093, 3094, 2634, 3092, 3093, 3093, 3094, 2634, 3093, 3093,
  /* 1242 */ 3093, 3093, 3093, 3093, 3095, 2085, 2335, 2331, 2961, 2965, 3093, 3418, 2081, 2020, 3093, 3093, 3093, 3093,
  /* 1260 */ 2086, 3090, 3093, 3093, 3093, 3094, 2634, 3092, 3093, 2112, 3094, 2277, 3093, 3093, 3093, 3093, 3093, 3093,
  /* 1278 */ 3095, 2085, 2355, 2351, 2973, 2977, 2985, 3418, 2081, 2020, 3093, 3407, 2996, 3007, 1928, 3017, 3093, 3093,
  /* 1296 */ 3093, 3028, 2338, 3092, 2452, 3093, 3094, 2634, 2560, 3093, 3093, 3036, 3093, 3093, 3095, 2085, 2084, 2179,
  /* 1314 */ 3093, 3088, 3093, 3418, 2081, 2020, 3093, 3093, 3093, 3047, 2086, 3090, 3180, 3093, 3093, 3094, 2634, 3092,
  /* 1332 */ 3093, 3093, 3094, 2634, 3093, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 3056, 3147, 3067, 3071, 3364, 3418,
  /* 1350 */ 2081, 2020, 2743, 3093, 3079, 3093, 2632, 3204, 3093, 2290, 3020, 3094, 2634, 3103, 3093, 3093, 3094, 2634,
  /* 1368 */ 3093, 3048, 2759, 3484, 3093, 3332, 3095, 2085, 2399, 2395, 3111, 3115, 3123, 3418, 3142, 2020, 3174, 2616,
  /* 1386 */ 3093, 3093, 2086, 3090, 3093, 3093, 3093, 2295, 2634, 3092, 3039, 3093, 3094, 2634, 3093, 3093, 3093, 3093,
  /* 1404 */ 3192, 3093, 3212, 2085, 2084, 2179, 3093, 3088, 3093, 3418, 2081, 2020, 3093, 3093, 3093, 3093, 2086, 3090,
  /* 1422 */ 3093, 3093, 3093, 3094, 2634, 3092, 3093, 3093, 3094, 2634, 3093, 3093, 3328, 3480, 3093, 3093, 3095, 2085,
  /* 1440 */ 2651, 2647, 3226, 3230, 3093, 3238, 3267, 2038, 3093, 3284, 2128, 2953, 2632, 2300, 3294, 3093, 3093, 3094,
  /* 1458 */ 2634, 3092, 3093, 3093, 3302, 2634, 2524, 3321, 2747, 3093, 3093, 3093, 2812, 2085, 2084, 2179, 3093, 2673,
  /* 1476 */ 3093, 3418, 2081, 3276, 3093, 3093, 3340, 3134, 2086, 3090, 3352, 2584, 3350, 3094, 3059, 3360, 3093, 3093,
  /* 1494 */ 3199, 2634, 2858, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 3372, 3152, 3383, 3387, 3093, 3418, 2081, 2020,
  /* 1512 */ 3093, 2472, 3093, 3528, 2632, 3090, 2988, 3395, 3093, 2921, 2634, 3403, 2544, 2519, 3415, 2634, 3426, 3093,
  /* 1530 */ 3093, 2539, 3009, 2942, 3438, 2085, 2084, 2179, 3093, 3088, 2549, 3418, 3456, 2020, 3473, 3093, 3093, 3342,
  /* 1548 */ 2086, 3492, 3093, 3503, 3093, 3512, 2634, 3092, 3130, 3093, 3094, 2634, 3093, 3093, 3093, 3564, 3523, 3093,
  /* 1566 */ 3095, 2085, 2898, 2894, 3540, 3544, 3093, 3418, 2081, 2020, 3093, 3093, 3093, 3093, 2086, 3090, 3093, 3093,
  /* 1584 */ 3093, 3094, 2634, 3092, 3093, 3093, 2908, 2634, 3093, 3552, 3093, 3093, 3093, 3093, 3095, 2085, 2084, 2179,
  /* 1602 */ 3093, 3088, 3093, 3418, 2081, 2020, 3093, 2849, 3093, 2918, 2086, 2417, 3093, 3563, 3093, 3094, 2634, 3092,
  /* 1620 */ 3093, 3093, 3094, 2634, 3093, 3093, 3093, 3093, 3093, 3093, 3095, 2085, 2217, 3589, 3572, 3576, 2085, 2237,
  /* 1638 */ 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1656 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1947, 2085, 3584, 2085, 2237, 2085, 3639, 2085, 2085,
  /* 1674 */ 2085, 2085, 2085, 3602, 2085, 2085, 2085, 2085, 2085, 3613, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1692 */ 2085, 2085, 2085, 2085, 2085, 3624, 3626, 3634, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1710 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1728 */ 2085, 2777, 3647, 3651, 2085, 2237, 2085, 1990, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1746 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1764 */ 2085, 2237, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1782 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 1959, 2085, 2085, 2085, 2085, 2085,
  /* 1800 */ 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085, 2085,
  /* 1818 */ 2085, 2085, 2085, 2085, 2085, 2085, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 0, 0, 0, 3328, 3328,
  /* 1837 */ 3328, 3328, 3328, 3328, 3328, 3328, 3381, 3381, 0, 0, 0, 0, 0, 6400, 6400, 6400, 46, 46, 46, 46, 46, 46,
  /* 1859 */ 46, 46, 0, 0, 0, 0, 0, 6711, 55, 55, 2877, 2877, 2877, 2877, 2877, 2877, 2877, 2877, 0, 0, 0, 0, 0, 7480,
  /* 1883 */ 7480, 7480, 0, 0, 4150, 4150, 0, 0, 0, 0, 0, 8762, 8762, 8762, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0,
  /* 1908 */ 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 0, 0, 0, 0, 0, 10240, 10240, 10240, 0, 0, 4864, 0, 0,
  /* 1930 */ 0, 0, 0, 0, 0, 1174, 0, 4864, 0, 0, 0, 4864, 0, 4864, 4864, 4864, 4864, 0, 0, 0, 0, 0, 16444, 16444, 16444,
  /* 1955 */ 0, 0, 5120, 5120, 0, 0, 0, 0, 768, 0, 0, 0, 101, 0, 101, 101, 101, 0, 0, 0, 48, 48, 5888, 5888, 5888, 47,
  /* 1981 */ 47, 47, 47, 47, 47, 47, 47, 5423, 5423, 0, 0, 0, 0, 2877, 0, 0, 0, 0, 186, 47, 0, 47, 0, 0, 0, 0, 0, 0, 0,
  /* 2010 */ 6144, 0, 5632, 5632, 0, 0, 5632, 5632, 5632, 5632, 0, 0, 0, 0, 2877, 0, 1054, 1054, 48, 48, 48, 48, 48, 48,
  /* 2034 */ 48, 48, 5936, 5936, 0, 0, 0, 0, 2877, 0, 1054, 1133, 102, 0, 0, 0, 0, 0, 0, 0, 7680, 62, 62, 62, 62, 62,
  /* 2060 */ 62, 62, 62, 6462, 6462, 0, 0, 0, 0, 3328, 53, 53, 53, 2609, 2609, 2609, 2609, 2609, 2609, 2609, 2609, 0,
  /* 2082 */ 1054, 1054, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 1054, 2609, 1054, 1054, 1054, 0, 0, 0, 0, 3584, 0, 6912, 7936,
  /* 2106 */ 185, 187, 2748, 2709, 2749, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1159, 185, 187,
  /* 2125 */ 187, 2748, 2749, 1054, 1054, 1054, 131, 1054, 1054, 1158, 1054, 0, 0, 7168, 0, 0, 7168, 7168, 0, 7168, 0,
  /* 2146 */ 0, 0, 7168, 7168, 7168, 7168, 0, 0, 0, 0, 145, 145, 0, 0, 0, 101, 0, 0, 0, 0, 0, 0, 0, 5632, 0, 0, 7480,
  /* 2173 */ 7480, 0, 0, 0, 0, 146, 0, 0, 0, 1054, 1054, 0, 0, 0, 0, 0, 8249, 8249, 0, 0, 0, 0, 1055, 1055, 0, 0, 0, 0,
  /* 2201 */ 0, 0, 0, 9984, 9984, 8448, 8960, 9472, 0, 2877, 0, 0, 0, 1056, 1056, 0, 0, 0, 0, 0, 0, 0, 16128, 0, 0, 0,
  /* 2227 */ 8762, 8762, 0, 0, 0, 0, 1057, 1057, 0, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 9216, 0, 0, 2877, 0, 0, 0, 1058,
  /* 2254 */ 1058, 0, 0, 0, 0, 0, 0, 0, 46, 99, 99, 103, 1054, 1054, 1054, 0, 0, 0, 0, 1061, 1061, 0, 0, 0, 0, 0, 0, 0,
  /* 2282 */ 1054, 1054, 10782, 146, 0, 0, 103, 146, 1054, 1054, 1054, 1054, 1194, 1054, 1054, 1054, 1054, 1207, 1054,
  /* 2301 */ 1054, 0, 1054, 1054, 1054, 12701, 1054, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 9728, 0, 0, 0, 0, 0, 0,
  /* 2322 */ 9984, 0, 0, 0, 9984, 9984, 9984, 9984, 0, 0, 0, 0, 1062, 1062, 0, 0, 0, 0, 0, 0, 0, 1054, 1310, 1054, 0, 0,
  /* 2348 */ 10240, 10240, 0, 0, 0, 0, 1063, 1063, 0, 0, 0, 0, 0, 0, 0, 1054, 10526, 1054, 1087, 1087, 1087, 1087, 1087,
  /* 2371 */ 1087, 1087, 1087, 0, 1054, 1054, 1054, 1219, 1054, 1221, 1054, 1104, 1054, 1054, 1107, 1054, 1054, 1054,
  /* 2389 */ 1113, 0, 1128, 1113, 1054, 0, 0, 0, 0, 1065, 1065, 0, 0, 0, 0, 0, 0, 0, 2048, 0, 0, 1104, 1054, 1128, 1054,
  /* 2414 */ 1054, 1054, 1140, 1054, 30, 0, 1178, 1054, 1054, 1054, 1054, 1187, 1054, 1054, 1054, 0, 1054, 1216, 1054,
  /* 2433 */ 1054, 1054, 1054, 1054, 1054, 1196, 1054, 1223, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1141, 1054, 1054,
  /* 2451 */ 1240, 1054, 1054, 1054, 1054, 1054, 1054, 1228, 1054, 1054, 1054, 1259, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 2469 */ 12318, 1054, 1263, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1151, 1088, 1088, 1088, 1088, 1088, 1088,
  /* 2486 */ 1088, 1088, 0, 1054, 1054, 1054, 1115, 1054, 1054, 1054, 0, 46, 0, 0, 0, 0, 0, 0, 148, 0, 1089, 1089, 1089,
  /* 2509 */ 1089, 1089, 1089, 1089, 1089, 1100, 1089, 1089, 1089, 0, 1054, 1054, 1054, 1054, 1231, 1054, 1054, 1054,
  /* 2527 */ 1054, 1242, 1054, 1054, 1054, 1054, 11038, 1054, 1054, 1054, 1054, 11550, 1054, 1054, 1054, 1054, 14622,
  /* 2544 */ 1054, 1054, 1054, 1054, 15134, 1054, 1054, 1054, 1109, 1054, 1054, 1054, 1114, 1054, 1054, 1185, 1054,
  /* 2561 */ 1054, 1054, 1054, 1054, 1054, 14110, 1054, 1245, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1167, 1054,
  /* 2578 */ 1264, 1166, 1265, 1054, 1054, 1266, 1054, 1054, 1054, 1193, 1054, 1054, 1054, 1197, 1090, 1090, 1090, 1090,
  /* 2596 */ 1090, 1090, 1090, 1090, 0, 1054, 1054, 1054, 1059, 1059, 1059, 1059, 1059, 1059, 1059, 1059, 1101, 1059,
  /* 2614 */ 1059, 0, 1054, 1054, 1054, 1134, 1054, 1054, 1054, 1054, 1054, 12830, 1054, 1054, 1054, 1116, 1117, 1054,
  /* 2632 */ 0, 46, 0, 0, 0, 0, 0, 1054, 1054, 1054, 103, 1054, 1054, 1117, 0, 0, 0, 0, 1066, 1066, 0, 0, 0, 0, 0, 0, 0,
  /* 2659 */ 3840, 3840, 3840, 1142, 1143, 1054, 1054, 1054, 1054, 1150, 1054, 1054, 1054, 1201, 1054, 1054, 1054, 1054,
  /* 2677 */ 0, 1054, 1102, 1054, 175, 1054, 1200, 1054, 1202, 1054, 1054, 1204, 1054, 1205, 1054, 1054, 1054, 30, 1054,
  /* 2696 */ 0, 0, 103, 0, 0, 1054, 1054, 1566, 1054, 1224, 1225, 1054, 1054, 1054, 1054, 1054, 1111, 1054, 1054, 12238,
  /* 2716 */ 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1229, 1054, 1054, 1161, 1054, 1054, 1054, 1054, 15872, 146, 0, 0,
  /* 2735 */ 103, 146, 1822, 1054, 1054, 0, 1054, 1179, 1054, 1054, 1054, 1137, 1054, 1054, 1054, 1054, 1054, 1252,
  /* 2753 */ 1054, 1054, 1054, 1054, 1054, 15902, 1054, 1054, 1054, 1054, 30, 1054, 1253, 1054, 1054, 14366, 1054, 1054,
  /* 2771 */ 1054, 1054, 0, 0, 55, 55, 0, 0, 0, 0, 17664, 0, 0, 0, 1060, 0, 0, 0, 0, 0, 0, 0, 98, 0, 0, 1091, 1091,
  /* 2798 */ 1091, 1091, 1091, 1091, 1091, 1091, 0, 1054, 1054, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054, 1054,
  /* 2816 */ 30, 11294, 0, 0, 1054, 1054, 1118, 1120, 97, 46, 0, 0, 59, 59, 0, 0, 0, 0, 1059, 1059, 0, 0, 0, 0, 0, 0, 0,
  /* 2843 */ 59, 59, 59, 1054, 1144, 1146, 1054, 1054, 1054, 1054, 1054, 1149, 1054, 1054, 1183, 1054, 1054, 1054, 1054,
  /* 2862 */ 1054, 1054, 1054, 1244, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 1092, 0, 1054, 1054, 1054, 144, 0, 0, 0,
  /* 2882 */ 2304, 0, 0, 1054, 1054, 1118, 0, 0, 0, 0, 1074, 1074, 0, 0, 0, 1068, 1068, 0, 0, 0, 0, 45, 0, 0, 1054,
  /* 2907 */ 1191, 1054, 1054, 1054, 1054, 1054, 1054, 30, 0, 1054, 1239, 1054, 1054, 1054, 1054, 1054, 1054, 30, 1054,
  /* 2926 */ 1054, 1054, 0, 1054, 1250, 1164, 1054, 1054, 1054, 1054, 1054, 1157, 1054, 1054, 1255, 1256, 1054, 1054,
  /* 2944 */ 1054, 1054, 1054, 1054, 1054, 1267, 1054, 1054, 1162, 1054, 1054, 1054, 1054, 1054, 1165, 1054, 1054, 1093,
  /* 2962 */ 1093, 1093, 1093, 1093, 1093, 1093, 1093, 0, 1054, 1054, 1054, 1094, 1094, 1094, 1094, 1094, 1094, 1094,
  /* 2980 */ 1094, 0, 1054, 1054, 1054, 1054, 1054, 1106, 1054, 1054, 1054, 1054, 1054, 1188, 1054, 1054, 1054, 1054,
  /* 2998 */ 1154, 1054, 1054, 1054, 1054, 1054, 1195, 1054, 1054, 1054, 1161, 1054, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 3016 */ 13598, 1175, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1203, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1054,
  /* 3034 */ 1166, 184, 1054, 1054, 13854, 1054, 1054, 1054, 1054, 1054, 1227, 1054, 1054, 1160, 1054, 1054, 1054, 1054,
  /* 3052 */ 1054, 1054, 1054, 1249, 1064, 0, 0, 0, 0, 0, 0, 0, 1214, 1054, 1054, 1095, 1095, 1095, 1095, 1095, 1095,
  /* 3073 */ 1095, 1095, 0, 1054, 1054, 1054, 1152, 1054, 1054, 1054, 1156, 1054, 1054, 1054, 1147, 1054, 1054, 1054,
  /* 3091 */ 1054, 0, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0, 0, 0, 1215, 1054, 1054, 1054, 1054, 1054, 1222,
  /* 3111 */ 1096, 1096, 1096, 1096, 1096, 1096, 1096, 1096, 0, 1054, 1054, 1054, 1105, 30, 1054, 1108, 1054, 1054,
  /* 3129 */ 1112, 1054, 1054, 1054, 1226, 1054, 1054, 1054, 1054, 1164, 1054, 1054, 1054, 0, 1108, 1054, 1054, 0, 0, 0,
  /* 3149 */ 0, 1075, 1075, 0, 0, 0, 1076, 1076, 0, 0, 0, 2609, 2609, 0, 0, 0, 145, 0, 0, 0, 0, 2877, 2877, 0, 0, 1134,
  /* 3175 */ 11806, 1135, 1054, 1054, 1139, 1054, 1054, 1054, 1186, 1054, 1054, 1054, 1054, 1054, 1247, 1054, 1054,
  /* 3192 */ 1054, 1237, 1054, 1054, 1054, 1054, 1262, 1054, 1054, 1054, 1236, 1054, 1054, 1054, 0, 1054, 1054, 1180,
  /* 3210 */ 1054, 1182, 1054, 1054, 1269, 1270, 1054, 1054, 0, 0, 100, 100, 0, 2707, 2709, 1054, 1097, 1097, 1097,
  /* 3229 */ 1097, 1097, 1097, 1097, 1097, 0, 1054, 1054, 1103, 1054, 1054, 1119, 1054, 0, 46, 0, 0, 101, 0, 101, 0, 0,
  /* 3251 */ 0, 46, 46, 0, 0, 0, 47, 47, 0, 0, 0, 47, 47, 5376, 5376, 5376, 0, 1054, 1054, 1130, 0, 0, 0, 0, 6144, 0, 0,
  /* 3278 */ 0, 0, 2877, 0, 1132, 1054, 1054, 1145, 1054, 1054, 1054, 1054, 1054, 1054, 1161, 1054, 1054, 1184, 1054,
  /* 3297 */ 1054, 1054, 1054, 1054, 1190, 1054, 1235, 1054, 1054, 1054, 1237, 1054, 0, 0, 3840, 3840, 0, 0, 0, 0, 0,
  /* 3318 */ 8249, 8249, 8249, 1054, 1246, 1054, 1054, 1054, 1054, 1248, 1054, 1054, 1054, 1251, 1054, 1054, 1054, 1054,
  /* 3336 */ 1054, 13086, 1054, 1054, 1054, 1153, 1054, 1054, 1054, 1054, 1054, 1054, 1166, 1054, 1054, 1166, 1054,
  /* 3353 */ 1054, 1054, 1054, 1054, 1054, 1189, 1054, 0, 1054, 1054, 1217, 1054, 1054, 1054, 1054, 1110, 1054, 1054,
  /* 3371 */ 1054, 1067, 0, 0, 0, 0, 0, 0, 0, 4150, 4150, 4150, 1098, 1098, 1098, 1098, 1098, 1098, 1098, 1098, 0, 1054,
  /* 3393 */ 1054, 1054, 1054, 1054, 1192, 1054, 1054, 1054, 1054, 1198, 0, 1054, 1054, 1218, 1054, 1054, 1054, 1054,
  /* 3411 */ 1148, 1054, 1054, 1054, 1234, 1054, 1054, 1054, 1054, 1054, 1054, 0, 46, 0, 0, 1238, 1054, 1054, 1241,
  /* 3430 */ 1054, 1054, 1054, 1054, 1164, 1054, 1054, 0, 1268, 1054, 1054, 1054, 1054, 1054, 0, 0, 103, 0, 0, 1054,
  /* 3450 */ 1054, 1054, 1054, 1220, 1054, 1054, 0, 1109, 1129, 1054, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 7168, 0, 0, 0, 1054,
  /* 3474 */ 1054, 1136, 1054, 1054, 1054, 1129, 1054, 1054, 1054, 1257, 1054, 1054, 1054, 1054, 1054, 14878, 1054,
  /* 3491 */ 1054, 1054, 1176, 0, 1054, 1054, 1054, 1054, 1054, 1232, 1233, 1054, 1176, 1054, 1054, 1054, 1054, 1054,
  /* 3509 */ 1054, 1054, 1254, 1054, 1054, 1206, 1054, 1054, 1054, 1054, 0, 46, 100, 2609, 1166, 1054, 1054, 1260, 1261,
  /* 3528 */ 1054, 1054, 1054, 1163, 1054, 1054, 1054, 1054, 1138, 1054, 1054, 1054, 1099, 1099, 1099, 1099, 1099, 1099,
  /* 3546 */ 1099, 1099, 0, 1054, 1054, 1054, 1054, 1054, 15390, 1054, 1054, 1054, 1054, 1054, 1243, 1054, 1054, 15646,
  /* 3564 */ 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1258, 16128, 16128, 16128, 16128, 16128, 16128, 16128, 16128, 0,
  /* 3581 */ 0, 0, 0, 0, 0, 16444, 16444, 0, 0, 0, 0, 16128, 16128, 0, 0, 0, 9728, 9728, 0, 0, 9728, 0, 0, 17049, 0, 0,
  /* 3607 */ 0, 0, 0, 4352, 0, 0, 17152, 0, 0, 0, 0, 0, 0, 0, 5120, 5120, 5120, 0, 17408, 0, 0, 0, 17408, 0, 0, 0, 0,
  /* 3634 */ 17408, 17408, 17408, 17408, 0, 0, 0, 0, 16747, 2877, 0, 0, 0, 17664, 17664, 17664, 17664, 17664, 17664,
  /* 3653 */ 17664, 17664, 0, 0, 0, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 47, 51, 84, 55, 59, 66, 71, 81, 67, 78, 66, 62, 66, 66, 66, 74, 88, 92, 145, 98, 102, 144, 109, 113, 152,
  /*  25 */ 126, 94, 122, 130, 134, 138, 105, 149, 93, 116, 93, 93, 119, 93, 93, 141, 93, 93, 93, 93, 93, 105, 156, 160,
  /*  49 */ 164, 168, 172, 176, 180, 184, 202, 212, 231, 216, 270, 218, 196, 198, 185, 224, 193, 198, 198, 198, 198,
  /*  70 */ 185, 222, 226, 204, 198, 186, 349, 230, 225, 202, 268, 198, 198, 197, 198, 198, 198, 190, 236, 240, 242,
  /*  91 */ 246, 250, 231, 231, 231, 231, 351, 256, 275, 261, 284, 265, 231, 231, 231, 206, 335, 340, 274, 279, 283,
  /* 112 */ 318, 298, 231, 231, 231, 232, 231, 231, 252, 231, 231, 302, 331, 283, 288, 281, 316, 297, 306, 231, 310,
  /* 133 */ 330, 314, 309, 328, 291, 322, 293, 326, 231, 348, 231, 231, 350, 231, 231, 208, 339, 344, 231, 231, 351,
  /* 154 */ 231, 257, 2056, 133120, 264192, 33556480, 134219776, 2048, 2048, 8521728, 134481920, 2099200, 136316928,
  /* 167 */ 134136, 138232, -143005696, -42342400, -33822720, 139256, 401400, 134356984, 139256, 139260, 134619128,
  /* 178 */ 134356984, 2498552, 136716280, 136716280, -41943048, -33554440, 2048, 8, 8, 8, 0, 0, 0, 128, 256, 768, 72,
  /* 195 */ 8, 8, 40, 8, 8, 8, 8, 768, 72, 24, 40, 0, 8, 0, 0, 1, 12, 8192, 65536, 67108864, 1610612736, 1024, 1024, 8,
  /* 219 */ 8, 24, 8, 0, 128, 256, 256, 256, 768, 768, 72, 1073741824, 0, 0, 0, 0, 7, 64, 1073741856, 1073741856,
  /* 239 */ -2147483489, -2147483425, -2147483393, 2147433248, 2147433248, 2147433248, 2147433248, 2147433312,
  /* 247 */ 2147433312, 2147434336, 2147482464, -50177, -50177, 0, 0, 6, 0, 16, 0, 0, 0, 256, 458752, 1572864, 2097152,
  /* 264 */ 4194304, 536870912, 7168, 49152, 0, 8, 8, 8, 72, 8, 0, 256, 512, 6144, 8192, 196608, 262144, 1048576,
  /* 282 */ 2097152, 4194304, 8388608, 16777216, 33554432, 469762048, 512, 6144, 131072, 262144, 1048576, 8388608, 0,
  /* 295 */ 2048, 8388608, 536870912, 1024, 49152, 0, 0, 256, 512, 2048, 4096, 134217728, 536870912, 1024, 32768, 0, 0,
  /* 312 */ 0, 2048, 2097152, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 0, 2048, 4096,
  /* 325 */ 262144, 0, 2048, 0, 2048, 4096, 131072, 262144, 1048576, 2097152, 16, 15, 7, 7, 16, 16, 16, 16, 24, 24, 24,
  /* 346 */ 31, 31, 4, 0, 0, 0, 536870912, 0, 0
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
  "'inherit'",
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
