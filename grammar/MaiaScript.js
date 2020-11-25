// This file was generated on Wed Nov 25, 2020 15:55 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -ll 3 -backtrack -javascript

function MaiaScript(string)
{
  init(string);

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

  function init(source)
  {
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
        parse_expression();
      }
    }
  };

  function parse_operation()
  {
    parse_variableAssignment();
  }

  function try_operation()
  {
    try_variableAssignment();
  }

  function parse_variableAssignment()
  {
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
      parse_logicalORExpression();
    }
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
      parse_logicalXORExpression();
    }
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
      parse_logicalANDExpression();
    }
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
      parse_bitwiseORExpression();
    }
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
      parse_bitwiseXORExpression();
    }
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
      parse_bitwiseANDExpression();
    }
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
      parse_equalityExpression();
    }
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
      parse_relationalExpression();
    }
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
      parse_shiftExpression();
    }
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
      parse_additiveExpression();
    }
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
      parse_multiplicativeExpression();
    }
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
      parse_powerExpression();
    }
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
      parse_unaryExpression();
    }
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
    switch (l1)
    {
    case 60:                        // '~'
      consume(60);                  // '~'
      lookahead1W(11);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
      parse_primary();
      break;
    case 12:                        // '!'
      consume(12);                  // '!'
      lookahead1W(11);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
      parse_primary();
      break;
    default:
      parse_primary();
    }
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
      parse_expression();
    }
    consume(59);                    // '}'
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
      parse_expression();
    }
    consume(59);                    // '}'
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
    consume(47);                    // 'if'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
      parse_elseif();
    }
    if (l1 == 42)                   // 'else'
    {
      parse_else();
    }
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
    consume(43);                    // 'elseif'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
      parse_expression();
    }
    consume(59);                    // '}'
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
      parse_expression();
    }
    consume(59);                    // '}'
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
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
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
    consume(53);                    // 'while'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
      parse_expression();
    }
    consume(59);                    // '}'
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
    consume(44);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
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
      parse_expression();
    }
    consume(59);                    // '}'
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
    consume(45);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
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
      parse_expression();
    }
    consume(59);                    // '}'
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
      parse_expression();
    }
    consume(59);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 39)                   // 'catch'
    {
      parse_catch();
    }
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
      parse_expression();
    }
    consume(59);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 39)                   // 'catch'
    {
      parse_catch();
    }
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
    consume(39);                    // 'catch'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
      parse_expression();
    }
    consume(59);                    // '}'
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
    consume(38);                    // 'break'
  }

  function try_break()
  {
    consumeT(38);                   // 'break'
  }

  function parse_continue()
  {
    consume(40);                    // 'continue'
  }

  function try_continue()
  {
    consumeT(40);                   // 'continue'
  }

  function parse_return()
  {
    consume(49);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
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
    consume(51);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(17);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      parse_expression();
    }
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
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
      parse_expression();
    }
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
        parse_arguments();
        consume(36);                // ']'
      }
    }
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
    consume(54);                    // '{'
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
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
      parse_element();
    }
    consume(59);                    // '}'
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
    consume(35);                    // '['
    lookahead1W(23);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
    if (l1 != 26                    // ';'
     && l1 != 36)                   // ']'
    {
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
      parse_row();
    }
    consume(36);                    // ']'
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
    parse_expression();
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
    consume(7);                     // string
  }

  function try_key()
  {
    consumeT(7);                    // string
  }

  function parse_row()
  {
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
      parse_column();
    }
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
    parse_expression();
  }

  function try_column()
  {
    try_expression();
  }

  function parse_parenthesizedExpression()
  {
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
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

MaiaScript.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : MaiaScript.INITIAL[tokenSetId] & 255;
  for (var i = 0; i < 61; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 187 + s - 1;
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

MaiaScript.MAP0 =
[
  /*   0 */ 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
  /*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 9,
  /*  64 */ 9, 6, 6, 6, 6, 24, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9, 29,
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
  /* 151 */ 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21,
  /* 180 */ 22, 23, 9, 6, 6, 6, 6, 24, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6,
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
  /*    0 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*   18 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1760, 1760, 1760, 1763,
  /*   36 */ 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*   54 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1760, 1760, 1760, 1763, 2542, 1934, 2542, 2542,
  /*   72 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*   90 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 3083, 1771, 1777, 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542,
  /*  108 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  126 */ 2542, 2542, 2542, 1928, 1789, 1793, 2542, 1805, 1904, 2542, 2542, 2542, 1933, 2542, 2542, 2542, 2542, 2542,
  /*  144 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1903,
  /*  162 */ 1815, 1819, 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  180 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2407, 1831,
  /*  198 */ 1904, 2407, 2407, 2407, 2541, 2604, 2407, 2407, 1836, 3212, 2407, 2407, 1838, 1834, 2407, 2407, 2407, 1839,
  /*  216 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2109, 3208, 2112, 2542, 1934, 1904, 2542, 2542, 2542,
  /*  234 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  252 */ 2542, 2542, 2542, 2542, 2542, 2323, 3053, 2326, 2542, 1934, 1847, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  270 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  288 */ 2542, 2542, 2542, 2542, 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  306 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1872, 1876, 1884, 1888,
  /*  324 */ 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  342 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1900, 1902, 1915, 1912, 2542, 1934, 1904, 2542,
  /*  360 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  378 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2236, 3079, 2239, 2542, 1923, 1904, 2542, 2542, 2542, 1781, 2542,
  /*  396 */ 2542, 2542, 2542, 1942, 2542, 2542, 1973, 1954, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  414 */ 2542, 2542, 2542, 1998, 1964, 1981, 2542, 1993, 1904, 2542, 2542, 2542, 2543, 2542, 2542, 2542, 2542, 2006,
  /*  432 */ 2542, 2542, 2542, 1970, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2018,
  /*  450 */ 3096, 2043, 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  468 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2048, 2056, 2062, 2542, 2080,
  /*  486 */ 1904, 2542, 2542, 2542, 2543, 2542, 2542, 2542, 2542, 2006, 2542, 2542, 2542, 1970, 2542, 2542, 2542, 2542,
  /*  504 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2444, 2542, 3169, 3169, 2542, 2093, 1904, 2542, 2542, 2542,
  /*  522 */ 1797, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2106, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  540 */ 2542, 2542, 2542, 2542, 2542, 2554, 2120, 2126, 2542, 1934, 1807, 2542, 2542, 2542, 1933, 2542, 2542, 2542,
  /*  558 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  576 */ 2542, 2350, 2139, 2143, 2407, 2151, 1904, 2407, 2407, 2407, 2265, 2604, 2407, 2407, 2183, 2169, 2407, 2407,
  /*  594 */ 2185, 2181, 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2586, 2584, 2542, 2542,
  /*  612 */ 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  630 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1946, 2193, 2198, 2206, 2542, 1934, 1904, 2542,
  /*  648 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  666 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2697, 1859, 2700, 2542, 1934, 2219, 2542, 2542, 2542, 2542, 2542,
  /*  684 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  702 */ 2542, 2542, 2542, 2711, 2030, 2714, 2542, 1934, 2247, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  720 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2754,
  /*  738 */ 3302, 2757, 2542, 1934, 1985, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  756 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2407, 2273,
  /*  774 */ 1904, 2407, 2407, 2407, 2981, 2604, 2407, 2407, 1836, 2286, 2407, 2407, 2510, 2298, 2407, 2407, 2407, 1839,
  /*  792 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2783, 2308, 2312, 2542, 1934, 1904, 2542, 2542, 2542,
  /*  810 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  828 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2320, 1904, 2542, 2542, 2542, 1933, 2542, 2542, 2542,
  /*  846 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  864 */ 2542, 2334, 2337, 2345, 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  882 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2855, 3203, 2858,
  /*  900 */ 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  918 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2898, 2365, 2358, 1904, 2378,
  /*  936 */ 2396, 2407, 2541, 2604, 2407, 2406, 1836, 3212, 2416, 2743, 1838, 2254, 2407, 2407, 2425, 1839, 2542, 2542,
  /*  954 */ 2542, 2542, 2542, 2542, 2542, 2542, 2443, 2085, 2452, 2456, 2407, 1831, 1904, 2407, 2407, 2407, 2233, 2604,
  /*  972 */ 2407, 2407, 1836, 3212, 2407, 2407, 1838, 1834, 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542,
  /*  990 */ 2542, 2542, 2464, 3174, 2473, 2481, 2407, 1831, 1904, 2407, 2407, 2407, 2541, 2604, 2407, 2494, 1836, 3212,
  /* 1008 */ 2506, 2518, 1838, 1834, 2407, 2528, 2835, 2539, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2551, 2098,
  /* 1026 */ 2562, 2566, 2407, 1831, 1904, 2407, 2407, 2407, 2541, 2604, 2407, 2407, 1836, 3212, 2407, 2407, 1838, 1834,
  /* 1044 */ 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2581, 2131, 2574, 2594, 2531, 2612,
  /* 1062 */ 1904, 2793, 2599, 2407, 2981, 2290, 2407, 2278, 2435, 2620, 2644, 2661, 2370, 2672, 2683, 2407, 2300, 2694,
  /* 1080 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2708, 2035, 2722, 2726, 2825, 1831, 1904, 3266, 2407, 2407,
  /* 1098 */ 2233, 2604, 2407, 2407, 1836, 3212, 2407, 2407, 1838, 1834, 2407, 2963, 2407, 1839, 2542, 2542, 2542, 2542,
  /* 1116 */ 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2398, 2734, 1904, 2417, 2742, 2407, 2541, 2604, 2407, 2407,
  /* 1134 */ 1836, 3212, 2407, 2824, 1838, 1834, 2894, 2407, 2937, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1152 */ 2751, 2161, 2765, 2769, 2407, 1831, 1904, 2407, 2407, 2407, 2777, 2604, 2686, 2407, 1836, 3212, 2407, 2923,
  /* 1170 */ 1838, 2627, 3156, 2431, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603,
  /* 1188 */ 2407, 1831, 1904, 2407, 2407, 2407, 2541, 2604, 2407, 2407, 1836, 3212, 2407, 2825, 1838, 2820, 2407, 2407,
  /* 1206 */ 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2791, 1831, 1904, 2407,
  /* 1224 */ 3040, 2649, 2541, 2801, 2407, 2407, 2813, 3057, 2407, 2833, 1838, 1834, 2407, 2407, 2407, 1839, 2542, 2542,
  /* 1242 */ 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2407, 1831, 1904, 2407, 2407, 3123, 2541, 2604,
  /* 1260 */ 2843, 2407, 1836, 3212, 2407, 2407, 1838, 1834, 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1278 */ 2542, 2542, 2852, 3307, 2866, 2870, 2407, 1831, 1904, 2407, 2664, 2878, 2233, 2173, 2407, 2407, 1836, 3212,
  /* 1296 */ 2407, 2407, 1838, 1834, 3137, 2888, 2407, 2906, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067,
  /* 1314 */ 2604, 2941, 2920, 2931, 1904, 2949, 2961, 2407, 2541, 2604, 2407, 2407, 2976, 3212, 2844, 2407, 1838, 1834,
  /* 1332 */ 2407, 2407, 2971, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2407, 1831,
  /* 1350 */ 1904, 2407, 2407, 2407, 2541, 2604, 2407, 2407, 1836, 3212, 2407, 2407, 1838, 1834, 3066, 3228, 2407, 1839,
  /* 1368 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2994, 2211, 3005, 3009, 2520, 3017, 1904, 3025, 2407, 3033,
  /* 1386 */ 2233, 3216, 2632, 2407, 1836, 3212, 2407, 2407, 3048, 1834, 3065, 2407, 2407, 1839, 2542, 2542, 2542, 2542,
  /* 1404 */ 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2407, 1831, 1904, 2407, 2880, 2675, 2541, 2604, 3189, 2953,
  /* 1422 */ 1836, 1892, 2407, 2407, 3074, 2072, 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1440 */ 3091, 2986, 3104, 3108, 2407, 1831, 1904, 2407, 2653, 2805, 2233, 2604, 3116, 3134, 2260, 3212, 3145, 2407,
  /* 1458 */ 3164, 2226, 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603,
  /* 1476 */ 2501, 3182, 1904, 2486, 2407, 2834, 2541, 3152, 2636, 2407, 3197, 3212, 3126, 2407, 1838, 1834, 2407, 2834,
  /* 1494 */ 3224, 1839, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 3236, 1864, 3250, 3254, 2407, 1831, 1904, 2407,
  /* 1512 */ 2407, 2407, 2541, 2604, 2407, 2407, 1836, 3212, 2407, 2407, 2156, 1834, 3262, 2407, 2407, 1839, 2542, 2542,
  /* 1530 */ 2542, 2542, 2542, 2542, 2542, 2542, 2541, 2067, 2604, 2603, 2407, 1831, 1904, 2407, 2407, 2408, 2541, 2384,
  /* 1548 */ 2388, 2407, 1836, 3212, 2407, 2407, 1838, 1834, 2407, 2407, 2407, 1839, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1566 */ 2542, 2542, 1956, 3242, 3274, 3278, 2542, 1934, 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1584 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2909,
  /* 1602 */ 1854, 2912, 2542, 1934, 2997, 2542, 2542, 2542, 2542, 2025, 2542, 2542, 2542, 2465, 2542, 2542, 2542, 2542,
  /* 1620 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 3286, 3289, 3297, 2542, 1934,
  /* 1638 */ 1904, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1656 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2010, 3315, 3319, 2542, 1934, 1904, 2542, 2542, 2542,
  /* 1674 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1692 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 1934, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1710 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1728 */ 2542, 2542, 1823, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542,
  /* 1746 */ 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 2542, 3101, 3101, 3101, 3101,
  /* 1764 */ 3101, 3101, 3101, 3101, 0, 0, 0, 3328, 3328, 3328, 49, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 86,
  /* 1786 */ 0, 0, 0, 42, 42, 42, 0, 42, 42, 42, 42, 0, 0, 0, 0, 120, 0, 0, 0, 0, 2048, 0, 0, 0, 0, 0, 0, 2871, 2871,
  /* 1815 */ 2871, 2871, 2871, 0, 2871, 2871, 2871, 2871, 0, 0, 0, 0, 768, 0, 0, 0, 0, 42, 0, 0, 0, 1054, 1054, 1054,
  /* 1839 */ 1054, 1054, 1054, 0, 0, 0, 0, 0, 0, 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 14390, 0, 0, 0, 0, 7219, 0, 0, 0, 0,
  /* 1867 */ 1064, 1064, 0, 0, 1089, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608,
  /* 1890 */ 4608, 4608, 0, 0, 0, 0, 1179, 1054, 1054, 0, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 4864, 4864, 4864,
  /* 1915 */ 4864, 0, 0, 0, 0, 4864, 0, 4864, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0, 86, 0,
  /* 1945 */ 86, 0, 0, 0, 0, 6912, 0, 0, 0, 86, 86, 0, 0, 0, 0, 0, 0, 14080, 0, 43, 43, 43, 5376, 43, 43, 43, 43, 0, 0,
  /* 1974 */ 0, 0, 0, 0, 86, 0, 86, 43, 43, 5419, 5419, 0, 0, 0, 0, 8960, 0, 2871, 0, 0, 42, 0, 0, 43, 0, 0, 0, 43, 43,
  /* 2003 */ 5376, 5376, 43, 151, 43, 0, 43, 0, 0, 0, 0, 15616, 0, 0, 15616, 0, 5632, 5632, 0, 0, 5632, 5632, 0, 0, 0,
  /* 2028 */ 14976, 0, 0, 0, 0, 7988, 0, 0, 0, 0, 1070, 1070, 0, 0, 1084, 5632, 5632, 5632, 5632, 0, 0, 0, 0, 44, 44,
  /* 2053 */ 5888, 5888, 44, 44, 44, 44, 5888, 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 1054, 1054, 0, 0, 1054, 1054,
  /* 2076 */ 1054, 1054, 1054, 1197, 0, 42, 84, 84, 43, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 42, 0, 0, 87, 0, 0, 0, 1057,
  /* 2102 */ 1057, 0, 0, 1083, 120, 120, 0, 0, 0, 0, 0, 0, 3840, 3840, 0, 0, 0, 0, 56, 56, 56, 6400, 56, 56, 56, 56,
  /* 2128 */ 6456, 6456, 0, 0, 0, 0, 1058, 1058, 0, 0, 1058, 2605, 2605, 2605, 0, 2605, 2605, 2605, 2605, 0, 1054, 1054,
  /* 2150 */ 1054, 0, 42, 85, 2605, 2605, 1054, 1054, 1054, 30, 0, 0, 0, 0, 1060, 1060, 0, 0, 1085, 152, 2713, 2684,
  /* 2172 */ 2714, 1054, 1054, 1054, 0, 1054, 1154, 1054, 1156, 2713, 2714, 1054, 1054, 1054, 1054, 1054, 1054, 0, 150,
  /* 2191 */ 152, 152, 6912, 0, 6912, 0, 0, 0, 6912, 0, 6912, 0, 6912, 6912, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0,
  /* 2214 */ 1062, 1062, 0, 0, 1087, 0, 0, 7424, 0, 0, 0, 2871, 0, 0, 1054, 1054, 1054, 1054, 1196, 1054, 0, 42, 0, 0,
  /* 2238 */ 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 3584, 0, 7680, 8192, 8704, 0, 2871, 0, 0, 1054, 1054, 1054, 1195, 1054,
  /* 2261 */ 1054, 30, 1054, 1054, 1054, 0, 0, 85, 85, 0, 2682, 2684, 0, 42, 0, 0, 88, 1054, 1054, 1054, 143, 1054,
  /* 2283 */ 1168, 1054, 1170, 0, 88, 0, 0, 1054, 1054, 1054, 0, 1153, 1054, 1054, 1054, 88, 121, 1054, 1054, 1054,
  /* 2303 */ 1054, 1054, 1054, 1054, 10526, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 0, 0, 0, 0, 0, 83, 0, 0, 0,
  /* 2325 */ 0, 0, 0, 4146, 4146, 0, 0, 0, 0, 0, 0, 9472, 0, 0, 0, 9472, 0, 0, 9472, 9472, 9472, 9472, 9472, 9472, 0, 0,
  /* 2351 */ 0, 0, 2605, 2605, 0, 0, 2605, 0, 42, 0, 0, 0, 1113, 1099, 1054, 1054, 1096, 1054, 1099, 1054, 1054, 1054,
  /* 2373 */ 1054, 13824, 121, 0, 0, 1054, 1093, 1054, 1113, 1054, 1121, 1054, 1054, 30, 0, 1054, 1054, 1054, 1054,
  /* 2392 */ 13598, 1054, 1054, 1054, 1054, 1127, 1054, 1054, 1054, 1054, 1054, 1054, 1103, 1105, 1164, 1054, 1054,
  /* 2409 */ 1054, 1054, 1054, 1054, 1054, 1054, 30, 1180, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1124, 1054, 1207,
  /* 2427 */ 1054, 1054, 1054, 1210, 1054, 1054, 1054, 1205, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 1055, 0, 0, 0, 0,
  /* 2448 */ 0, 0, 0, 6144, 1081, 1081, 1081, 0, 1081, 1081, 1081, 1081, 0, 1054, 1054, 1054, 1056, 0, 0, 0, 0, 0, 0, 0,
  /* 2472 */ 15104, 1082, 1082, 1082, 0, 1082, 1082, 1082, 1082, 1090, 1082, 1082, 1082, 0, 1054, 1054, 1054, 1120,
  /* 2490 */ 1054, 1114, 1054, 1054, 1054, 1165, 1054, 1054, 1054, 1054, 1169, 1054, 1054, 1098, 1054, 1100, 1054, 1054,
  /* 2508 */ 1054, 1183, 1054, 1054, 1054, 1054, 0, 121, 0, 0, 1054, 1188, 1054, 1054, 1054, 1054, 1054, 1054, 1104,
  /* 2527 */ 1054, 1054, 1054, 1204, 1054, 1054, 1054, 1054, 1054, 1101, 1102, 1054, 1054, 1211, 1054, 0, 0, 0, 0, 0, 0,
  /* 2548 */ 0, 0, 123, 1057, 0, 0, 0, 0, 0, 0, 0, 6400, 6400, 56, 1083, 1083, 1083, 0, 1083, 1083, 1083, 1083, 0, 1054,
  /* 2572 */ 1054, 1054, 1058, 1058, 1058, 0, 1058, 1058, 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 1058, 1091,
  /* 2596 */ 1058, 1058, 0, 1054, 1054, 1054, 1129, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 0, 42, 0, 0, 88,
  /* 2617 */ 1054, 1054, 1102, 0, 88, 0, 0, 1054, 1054, 1566, 0, 0, 1054, 1054, 1194, 1054, 1054, 1054, 1160, 1054,
  /* 2637 */ 1054, 1054, 1054, 1151, 1054, 1054, 1054, 1054, 1054, 1182, 1054, 1184, 1054, 1054, 1054, 1137, 1054, 1054,
  /* 2655 */ 1054, 1054, 1130, 1054, 1054, 1054, 1054, 1054, 11173, 1054, 1054, 1054, 1054, 1054, 1131, 1054, 1054, 88,
  /* 2673 */ 121, 1822, 1054, 1054, 1054, 1054, 1054, 1139, 1054, 1054, 1054, 1054, 13854, 1054, 1054, 1054, 1054, 1054,
  /* 2691 */ 1161, 1054, 1054, 1054, 1054, 12574, 0, 0, 0, 0, 0, 7219, 7219, 0, 0, 0, 0, 1059, 0, 0, 0, 0, 0, 0, 0,
  /* 2716 */ 7988, 7988, 0, 0, 0, 0, 1084, 1084, 1084, 0, 1084, 1084, 1084, 1084, 0, 1054, 1054, 1054, 82, 42, 0, 0, 0,
  /* 2739 */ 1054, 1054, 1103, 1126, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1130, 1060, 0, 0, 0, 0, 0, 0, 0, 8501,
  /* 2760 */ 8501, 0, 0, 0, 0, 1085, 1085, 1085, 0, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054, 1142, 119, 0, 0, 0,
  /* 2782 */ 2304, 0, 0, 0, 9216, 9216, 0, 0, 9216, 1054, 1095, 1054, 1054, 1054, 1054, 1054, 1054, 1122, 1123, 1149,
  /* 2802 */ 1150, 1054, 0, 1054, 1054, 1054, 1054, 1138, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1141, 149, 0, 0,
  /* 2822 */ 1054, 10014, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1187, 1054, 1054, 1054, 1054, 1054, 1054,
  /* 2840 */ 1054, 1141, 1054, 1157, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1186, 1061, 0, 0, 0, 0, 0, 0, 0, 9728,
  /* 2861 */ 9728, 0, 0, 0, 0, 1086, 1086, 1086, 0, 1086, 1086, 1086, 1086, 0, 1054, 1054, 1054, 1054, 1135, 1054, 1054,
  /* 2882 */ 1054, 1054, 1054, 1054, 1132, 1054, 30, 1203, 1054, 1054, 1054, 12830, 1054, 1054, 1054, 10270, 1054, 1054,
  /* 2900 */ 1054, 1054, 0, 1054, 1054, 1093, 12062, 1054, 1054, 0, 0, 0, 0, 0, 14390, 14390, 0, 0, 0, 0, 30, 1054,
  /* 2922 */ 1097, 1054, 1054, 1054, 1054, 1054, 1190, 1060, 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054, 11806, 1054,
  /* 2942 */ 1054, 1054, 1054, 0, 1054, 1054, 1094, 1054, 1118, 10782, 1119, 1054, 1054, 1054, 1054, 1141, 1054, 1054,
  /* 2960 */ 1054, 1054, 1118, 1054, 1054, 1054, 1054, 1054, 1054, 11294, 1054, 1193, 1054, 1054, 1054, 1209, 1054,
  /* 2977 */ 1054, 1054, 1172, 1054, 1054, 0, 0, 0, 121, 0, 0, 0, 1072, 1072, 0, 0, 1088, 1062, 0, 0, 0, 0, 0, 0, 0,
  /* 3002 */ 14684, 2871, 0, 1087, 1087, 1087, 0, 1087, 1087, 1087, 1087, 0, 1054, 1092, 1054, 0, 42, 0, 0, 0, 1054,
  /* 3023 */ 1054, 1115, 1117, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 110, 1054, 1054, 1054, 1054, 1054, 1140, 1054,
  /* 3041 */ 1054, 1128, 1054, 1054, 1054, 1054, 1133, 1054, 1054, 1193, 1054, 0, 0, 0, 0, 4146, 0, 0, 0, 0, 1054, 1310,
  /* 3063 */ 1054, 0, 1198, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1202, 1054, 1192, 1054, 1054, 0, 0, 0, 0, 5120, 0,
  /* 3084 */ 0, 0, 0, 3328, 49, 49, 3328, 1063, 0, 0, 0, 0, 0, 0, 0, 5632, 0, 0, 0, 5632, 1088, 1088, 1088, 0, 1088,
  /* 3109 */ 1088, 1088, 1088, 0, 1054, 1054, 1054, 1054, 1158, 1054, 1054, 1054, 1054, 1162, 1054, 1054, 1136, 1054,
  /* 3127 */ 1054, 1054, 1054, 1054, 1185, 1054, 1054, 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1054, 1200, 1054, 1054,
  /* 3145 */ 1054, 1181, 1054, 1054, 1054, 1054, 13086, 1054, 1054, 1151, 0, 1054, 1054, 1054, 1054, 1199, 1054, 1201,
  /* 3163 */ 1054, 1191, 1054, 1054, 1054, 0, 0, 0, 0, 6144, 0, 0, 0, 0, 1056, 1056, 0, 0, 1082, 0, 42, 0, 0, 0, 1098,
  /* 3188 */ 1114, 1054, 1054, 1159, 1054, 1054, 1054, 1054, 1163, 1054, 1171, 1054, 1054, 1054, 1054, 0, 0, 0, 9728, 0,
  /* 3208 */ 0, 0, 0, 3840, 0, 0, 0, 0, 1054, 1054, 1054, 0, 1054, 1054, 11651, 1054, 1054, 1054, 1208, 1054, 1054,
  /* 3229 */ 1054, 1054, 1054, 1206, 1054, 1054, 1054, 1064, 0, 0, 0, 0, 41, 0, 0, 0, 14080, 14080, 0, 0, 14080, 1089,
  /* 3251 */ 1089, 1089, 0, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054, 1054, 1054,
  /* 3269 */ 1054, 12318, 1054, 1054, 1054, 14080, 14080, 14080, 0, 14080, 14080, 14080, 14080, 0, 0, 0, 0, 0, 15360, 0,
  /* 3289 */ 0, 0, 15360, 0, 0, 0, 0, 0, 15360, 15360, 15360, 15360, 0, 0, 0, 0, 8501, 0, 0, 0, 0, 1071, 1071, 0, 0,
  /* 3314 */ 1086, 15616, 15616, 15616, 0, 15616, 15616, 15616, 15616, 0, 0, 0, 0
];

MaiaScript.EXPECTED =
[
  /*   0 */ 94, 98, 102, 106, 110, 114, 118, 122, 141, 141, 157, 128, 133, 205, 142, 137, 141, 141, 141, 141, 156, 148,
  /*  22 */ 129, 141, 141, 140, 141, 141, 141, 124, 149, 129, 141, 141, 141, 141, 141, 146, 153, 141, 141, 141, 141,
  /*  43 */ 141, 141, 141, 123, 167, 161, 172, 176, 183, 179, 187, 167, 167, 163, 167, 167, 168, 194, 199, 239, 203,
  /*  64 */ 167, 167, 167, 166, 167, 190, 209, 216, 242, 167, 167, 167, 165, 167, 228, 233, 220, 243, 167, 163, 167,
  /*  85 */ 195, 234, 222, 167, 233, 226, 232, 212, 238, 2056, 133120, 264192, 33556480, 67110912, 2048, 2048, 8521728,
  /* 102 */ 67373056, 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, 401400, 67248120, 139256,
  /* 113 */ -33822720, 139260, 67510264, 67248120, 2498552, 69607416, 69607416, -41943048, -33554440, 2048, 8, 8, 8, 0,
  /* 127 */ 256, 768, 72, 24, 40, 0, 8192, 65536, 805306368, 0x80000000, 8, 24, 8, 40, 8, 8, 8, 8, 72, 0, 256, 256, 256,
  /* 150 */ 768, 768, 768, 768, 768, 72, 8, 0, 128, 256, 768, 2097152, 4194304, 0, 0, 0, 2097152, 0, 0, 0, 0, 6,
  /* 172 */ 134217728, 16, 4194312, 272629768, 260046887, 125829175, 276820808, 276820808, 276820824, 276820824,
  /* 182 */ 411038680, 276820808, 411038536, 125829183, 276820808, 411041624, 536867711, 536867711, 0, 0, 100663296, 64,
  /* 194 */ 117440512, 0, 0, 64, 256, 256, 512, 28672, 32768, 384, 3072, 0, 0, 1024, 1024, 256, 12288, 16384, 65536, 0,
  /* 214 */ 256, 16384, 131072, 262144, 524288, 1048576, 131072, 262144, 524288, 2097152, 128, 2048, 131072, 2048, 0, 0,
  /* 230 */ 67108864, 64, 0, 256, 8192, 16384, 65536, 131072, 65536, 65536, 131072, 1835008, 2097152, 128, 3072, 0, 0
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
