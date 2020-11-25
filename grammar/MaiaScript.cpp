// This file was generated on Wed Nov 25, 2020 15:55 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -ll 3 -backtrack -main -cpp

#include <string.h>
#include <stdlib.h>
#ifdef _WIN32
  #include <fcntl.h>
#endif
#include <vector>
#include <map>
#include <stdio.h>
#include <string>

class MaiaScript
{
public:
  MaiaScript(const wchar_t *string)
  {
    initialize(string);
  }

  virtual ~MaiaScript()
  {
  }

  static int main(int argc, char **argv)
  {
    int returnCode = 0;

    if (argc < 2)
    {
      fprintf(stderr, "Usage: %s INPUT...\n", argv[0]);
      fprintf(stderr, "\n");
      fprintf(stderr, "  parse INPUT, which is either a filename or literal text enclosed in curly braces\n");
    }
    else
    {
#ifdef _WIN32
      setmode(fileno(stdout), O_BINARY);
#endif

      for (int i = 1; i < argc; ++i)
      {
        try
        {
          std::wstring input = read(argv[i]);
          MaiaScript parser(input.c_str());
          try
          {
            parser.parse_maiascript();
          }
          catch (ParseException &pe)
          {
            fprintf(stderr, "%s\n", Utf8Encoder::encode(parser.getErrorMessage(pe).c_str()).c_str());
            returnCode = 1;
            break;
          }
        }
        catch (FileNotFound &fnf)
        {
          fprintf(stderr, "error: file not found: %s\n", fnf.getFilename().c_str());
          returnCode = 1;
          break;
        }
        catch (MalformedInputException &mie)
        {
          fprintf(stderr, "error: UTF-8 decoding error in %s at offset %d\n",
            argv[i], static_cast<int>(mie.getOffset()));
          returnCode = 1;
          break;
        }
      }
    }
    return returnCode;
  }

  class ParseException
  {
  private:
    int begin, end, offending, expected, state;
    friend class MaiaScript;

  protected:
    ParseException(int b, int e, int s, int o, int x)
    : begin(b), end(e), offending(o), expected(x), state(s)
    {
    }

  public:
    const wchar_t *getMessage() const
    {
      return offending < 0
           ? L"lexical analysis failed"
           : L"syntax error";
    }

    int getBegin() const {return begin;}
    int getEnd() const {return end;}
    int getState() const {return state;}
    int getOffending() const {return offending;}
    int getExpected() const {return expected;}
  };

  void initialize(const wchar_t *source)
  {
    input = source;
    reset(0, 0, 0);
  }

  const wchar_t *getInput() const
  {
    return input;
  }

  int getTokenOffset() const
  {
    return b0;
  }

  int getTokenEnd() const
  {
    return e0;
  }

  void reset(int l, int b, int e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    l2 = 0; b2 = 0; e2 = 0;
    l3 = 0; b3 = 0; e3 = 0;
    end = e;
    ex = -1;
    memo.clear();
  }

  void reset()
  {
    reset(0, 0, 0);
  }

  static const wchar_t *getOffendingToken(ParseException e)
  {
    return e.getOffending() < 0 ? 0 : TOKEN[e.getOffending()];
  }

  static void getExpectedTokenSet(const ParseException &e, const wchar_t **set, int size)
  {
    if (e.expected < 0)
    {
      getTokenSet(- e.state, set, size);
    }
    else if (size == 1)
    {
      set[0] = 0;
    }
    else if (size > 1)
    {
      set[0] = TOKEN[e.expected];
      set[1] = 0;
    }
  }

  std::wstring getErrorMessage(const ParseException &e)
  {
    std::wstring message(e.getMessage());
    wchar_t buffer[11];
    const wchar_t *found = getOffendingToken(e);
    if (found != 0)
    {
      message += L", found ";
      message += found;
    }
    const wchar_t *expected[64];
    getExpectedTokenSet(e, expected, sizeof expected / sizeof *expected);
    message += L"\nwhile expecting ";
    const wchar_t *delimiter(expected[1] ? L"[" : L"");
    for (const wchar_t **x = expected; *x; ++x)
    {
      message += delimiter;
      message += *x;
      delimiter = L", ";
    }
    message += expected[1] ? L"]\n" : L"\n";
    int size = e.getEnd() - e.getBegin();
    if (size != 0 && found == 0)
    {
      message += L"after successfully scanning ";
      swprintf(buffer, L"%d", size);
      message += buffer;
      message += L" characters beginning ";
    }
    int line = 1;
    int column = 1;
    for (int i = 0; i < e.getBegin(); ++i)
    {
      if (input[i] == L'\n')
      {
        ++line;
        column = 1;
      }
      else
      {
        ++column;
      }
    }
    message += L"at line ";
    swprintf(buffer, L"%d", line);
    message += buffer;
    message += L", column ";
    swprintf(buffer, L"%d", column);
    message += buffer;
    message += L":\n...";
    const wchar_t *w = input + e.getBegin();
    for (int i = 0; i < 64 && *w; ++i)
    {
      message += *w++;
    }
    message += L"...";
    return message;
  }

  void parse_maiascript()
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
      break;
    }
  }

private:

  void parse_operation()
  {
    parse_variableAssignment();
  }

  void try_operation()
  {
    try_variableAssignment();
  }

  void parse_variableAssignment()
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

  void try_variableAssignment()
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

  void parse_logicalORExpression()
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

  void try_logicalORExpression()
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

  void parse_logicalXORExpression()
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

  void try_logicalXORExpression()
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

  void parse_logicalANDExpression()
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

  void try_logicalANDExpression()
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

  void parse_bitwiseORExpression()
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

  void try_bitwiseORExpression()
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

  void parse_bitwiseXORExpression()
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

  void try_bitwiseXORExpression()
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

  void parse_bitwiseANDExpression()
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

  void try_bitwiseANDExpression()
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

  void parse_equalityExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      parse_relationalExpression();
    }
  }

  void try_equalityExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_relationalExpression();
    }
  }

  void parse_relationalExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      parse_shiftExpression();
    }
  }

  void try_relationalExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_shiftExpression();
    }
  }

  void parse_shiftExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      parse_additiveExpression();
    }
  }

  void try_shiftExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_additiveExpression();
    }
  }

  void parse_additiveExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      parse_multiplicativeExpression();
    }
  }

  void try_additiveExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_multiplicativeExpression();
    }
  }

  void parse_multiplicativeExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      parse_powerExpression();
    }
  }

  void try_multiplicativeExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_powerExpression();
    }
  }

  void parse_powerExpression()
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

  void try_powerExpression()
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

  void parse_unaryExpression()
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
      break;
    }
  }

  void try_unaryExpression()
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
      break;
    }
  }

  void parse_primary()
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
      break;
    }
  }

  void try_primary()
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
      break;
    }
  }

  void parse_statement()
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
      break;
    }
  }

  void try_statement()
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
      break;
    }
  }

  void parse_namespace()
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

  void try_namespace()
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

  void parse_function()
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

  void try_function()
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

  void parse_if()
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

  void try_if()
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

  void parse_elseif()
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

  void try_elseif()
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

  void parse_else()
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

  void try_else()
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

  void parse_do()
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

  void try_do()
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

  void parse_while()
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

  void try_while()
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

  void parse_for()
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

  void try_for()
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

  void parse_foreach()
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

  void try_foreach()
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

  void parse_try()
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

  void try_try()
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

  void parse_test()
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

  void try_test()
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

  void parse_catch()
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

  void try_catch()
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

  void parse_break()
  {
    consume(38);                    // 'break'
  }

  void try_break()
  {
    consumeT(38);                   // 'break'
  }

  void parse_continue()
  {
    consume(40);                    // 'continue'
  }

  void try_continue()
  {
    consumeT(40);                   // 'continue'
  }

  void parse_return()
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

  void try_return()
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

  void parse_throw()
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

  void try_throw()
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

  void parse_expression()
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
      break;
    }
  }

  void try_expression()
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
      break;
    }
  }

  void parse_arguments()
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

  void try_arguments()
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

  void parse_member()
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
      break;
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
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2; int l3A = l3;
        int b3A = b3; int e3A = e3;
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
        catch (ParseException &)
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
          break;
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
            int b0B = b0; int e0B = e0; int l1B = l1;
            int b1B = b1; int e1B = e1; int l2B = l2;
            int b2B = b2; int e2B = e2; int l3B = l3;
            int b3B = b3; int e3B = e3;
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
            catch (ParseException &)
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
      break;
    }
  }

  void try_member()
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
      break;
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
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2; int l3A = l3;
        int b3A = b3; int e3A = e3;
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
        catch (ParseException &)
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
          break;
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
            int b0B = b0; int e0B = e0; int l1B = l1;
            int b1B = b1; int e1B = e1; int l2B = l2;
            int b2B = b2; int e2B = e2; int l3B = l3;
            int b3B = b3; int e3B = e3;
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
            catch (ParseException &)
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
      break;
    }
  }

  void parse_array()
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

  void try_array()
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

  void parse_matrix()
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

  void try_matrix()
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

  void parse_element()
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
      break;
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

  void try_element()
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
      break;
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

  void parse_key()
  {
    consume(7);                     // string
  }

  void try_key()
  {
    consumeT(7);                    // string
  }

  void parse_row()
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

  void try_row()
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

  void parse_column()
  {
    parse_expression();
  }

  void try_column()
  {
    try_expression();
  }

  void parse_parenthesizedExpression()
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

  void try_parenthesizedExpression()
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

  void parse_value()
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
      break;
    }
  }

  void try_value()
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
      break;
    }
  }

  void consume(int t)
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

  void consumeT(int t)
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

  int matchW(int tokenSetId)
  {
    int code;
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

  void lookahead1W(int tokenSetId)
  {
    if (l1 == 0)
    {
      l1 = matchW(tokenSetId);
      b1 = begin;
      e1 = end;
    }
  }

  void lookahead2W(int tokenSetId)
  {
    if (l2 == 0)
    {
      l2 = matchW(tokenSetId);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 6) | l1;
  }

  void lookahead3W(int tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = matchW(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 12;
  }

  int error(int b, int e, int s, int l, int t)
  {
    if (e >= ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    throw ParseException(bx, ex, sx, lx, tx);
  }

  int lk, b0, e0;
  int l1, b1, e1;
  int l2, b2, e2;
  int l3, b3, e3;
  int bx, ex, sx, lx, tx;
  std::map<int, int> memo;

  void memoize(int i, int e, int v)
  {
    memo[(e << 1) + i] = v;
  }

  int memoized(int i, int e)
  {
    std::map<int, int>::iterator v = memo.find((e << 1) + i);
    return v != memo.end() ? v->second : 0;
  }

  const wchar_t *input;
  int begin;
  int end;

  int match(int tokenSetId)
  {
    begin = end;
    int current = end;
    int result = INITIAL[tokenSetId];
    int state = 0;

    for (int code = result & 255; code != 0; )
    {
      int charclass;
      int c0 = input[current];
      ++current;
      if (c0 < 0x80)
      {
        charclass = MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        int c1 = c0 >> 5;
        charclass = MAP1[(c0 & 31) + MAP1[(c1 & 31) + MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          int c1 = input[current];
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
          }
        }
        int lo = 0, hi = 1;
        for (int m = 1; ; m = (hi + lo) >> 1)
        {
          if (MAP2[m] > c0) hi = m - 1;
          else if (MAP2[2 + m] < c0) lo = m + 1;
          else {charclass = MAP2[4 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      int i0 = (charclass << 8) + code - 1;
      code = TRANSITION[(i0 & 7) + TRANSITION[i0 >> 3]];
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
      int c1 = input[end];
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (input[begin] == 0) end = begin;
    return (result & 63) - 1;
  }

  class FileNotFound
  {
  public:
    FileNotFound(std::string name) : filename(name) {}
    const std::string &getFilename() const {return filename;}

  private:
    std::string filename;
  };

  class MalformedInputException
  {
  public:
    MalformedInputException(size_t offset) : offset(offset) {}
    size_t getOffset() const {return offset;}

  private:
    size_t offset;
  };

  class Utf8Encoder
  {
  public:
    static std::string encode(const wchar_t *unencoded)
    {
      return encode(unencoded, wcslen(unencoded));
    }

    static std::string encode(const wchar_t *unencoded, size_t size)
    {
      std::string encoded;
      encoded.reserve(size + 3);

      for (size_t i = 0; i < size; ++i)
      {
        if (encoded.size() + 4 >= encoded.capacity()) encoded.reserve(encoded.capacity() * 2);

        int w = unencoded[i];
        if (w < 0x80)
        {
          encoded += w;
        }
        else if (w < 0x800)
        {
          encoded += 0xc0 | (w >> 6);
          encoded += 0x80 | (w & 0x3f);
        }
        else if (w < 0xd800)
        {
          encoded += 0xe0 | ( w          >> 12);
          encoded += 0x80 | ((w & 0xfff) >>  6);
          encoded += 0x80 | ( w &  0x3f       );
        }
        else if (w < 0xe000)
        {
          if (++i >= size)
          {
            throw MalformedInputException(i - 1);
          }
          int w2 = unencoded[i];
          if (w2 < 0xdc00 || w2 > 0xdfff)
          {
            throw MalformedInputException(i - 1);
          }
          w = (((w  & 0x3ff) << 10) | (w2 & 0x3ff)) + 0x10000;
          encoded += 0xf0 | ( w            >> 18);
          encoded += 0x80 | ((w & 0x3ffff) >> 12);
          encoded += 0x80 | ((w &   0xfff) >>  6);
          encoded += 0x80 | ( w &    0x3f       );
        }
        else if (w < 0x10000)
        {
          encoded += 0xe0 | ( w          >> 12);
          encoded += 0x80 | ((w & 0xfff) >>  6);
          encoded += 0x80 | ( w &  0x3f       );
        }
        else if (w < 0x110000)
        {
          encoded += 0xf0 | ( w            >> 18);
          encoded += 0x80 | ((w & 0x3ffff) >> 12);
          encoded += 0x80 | ((w &   0xfff) >>  6);
          encoded += 0x80 | ( w &    0x3f       );
        }
        else
        {
          throw MalformedInputException(i);
        }
      }
      return encoded;
    }
  };

  class Utf8Decoder
  {
  public:
    static std::wstring decode(const char *string)
    {
      return decode(string, strlen(string));
    }

    static std::wstring decode(const char *string, size_t size)
    {
      std::wstring decoded;
      decoded.reserve(size + 1);

      for (size_t consumed = 0; consumed < size; )
      {
        if (decoded.size() + 2 >= decoded.capacity()) decoded.reserve(decoded.capacity() * 2);

        size_t bytes;
        int codepoint = decodeChar(string + consumed, &bytes);

        if (bytes == 0)
        {
          throw MalformedInputException(consumed);
        }

        consumed += bytes;

        if (codepoint < 0x10000)
        {
          decoded += codepoint;
        }
        else
        {
          codepoint -= 0x10000;
          decoded += 0x0d800 | (codepoint >> 10);
          decoded += 0x0dc00 | (codepoint & 0x3ff);
        }
      }

      return decoded;
    }

  private:
    static int decodeChar(const char *input, size_t *size)
    {
      int codepoint = input[0];
      if ((codepoint & 0x80) == 0)
      {
        *size = 1;
      }
      else if (   (codepoint & 0x60) == 0x40
               && (input[1]  & 0xc0) == 0x80)
      {
        codepoint = ((codepoint & 0x1f) << 6)
                  |  (input[1]  & 0x3f);
        *size = codepoint < 0x80 ? 0 : 2;
      }
      else if (   (codepoint & 0x70) == 0x60
               && (input[1]  & 0xc0) == 0x80
               && (input[2]  & 0xc0) == 0x80)
      {
        codepoint = ((codepoint &  0xf) << 12)
                  | ((input[1]  & 0x3f) <<  6)
                  |  (input[2]  & 0x3f);
        *size = codepoint < 0x800 ? 0 : 3;
      }
      else if (   (codepoint & 0x78) == 0x70
               && (input[1]  & 0xc0) == 0x80
               && (input[2]  & 0xc0) == 0x80
               && (input[3]  & 0xc0) == 0x80)
      {
        codepoint  = ((codepoint &  0x7) << 18)
                   | ((input[1]  & 0x3f) << 12)
                   | ((input[2]  & 0x3f) <<  6)
                   | ( input[3]  & 0x3f       );
        *size = codepoint < 0x10000 || codepoint > 0x10ffff ? 0 : 4;
      }
      else
      {
        *size = 0;
      }
      return codepoint;
    }
  };

  static std::wstring read(const char *input)
  {
    size_t l = strlen(input);
    if (l > 0 && input[0] == '{' && input[l - 1] == '}')
    {
      return Utf8Decoder::decode(input + 1, l - 2);
    }
    else
    {
      FILE *file = fopen(input, "rb");
      if (file == 0)
      {
        throw FileNotFound(std::string(input));
      }

      std::string content;
      content.reserve(4096);

      for (int c = getc(file); c != EOF; c = getc(file))
      {
        if (content.size() + 1 >= content.capacity()) content.reserve(content.capacity() * 2);
        content += c;
      }

      fclose(file);

      if (content.size() >= 3
       && (unsigned char) content[0] == 0xef
       && (unsigned char) content[1] == 0xbb
       && (unsigned char) content[2] == 0xbf)
      {
        content.erase(0, 3);
      }

      return Utf8Decoder::decode(content.c_str());
    }
  }

  static void getTokenSet(int tokenSetId, const wchar_t **set, int size)
  {
    int s = tokenSetId < 0 ? - tokenSetId : INITIAL[tokenSetId] & 255;
    for (int i = 0; i < 61; i += 32)
    {
      int j = i;
      for (unsigned int f = ec(i >> 5, s); f != 0; f >>= 1, ++j)
      {
        if ((f & 1) != 0)
        {
          if (size > 1)
          {
            set[0] = TOKEN[j];
            ++set;
            --size;
          }
        }
      }
    }
    if (size > 0)
    {
      set[0] = 0;
    }
  }

  static int ec(int t, int s)
  {
    int i0 = t * 187 + s - 1;
    return EXPECTED[(i0 & 3) + EXPECTED[i0 >> 2]];
  }

  static const int MAP0[];
  static const int MAP1[];
  static const int MAP2[];
  static const int INITIAL[];
  static const int TRANSITION[];
  static const int EXPECTED[];
  static const wchar_t *TOKEN[];
};

const int MaiaScript::MAP0[] =
{
/*   0 */ 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
/*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 9, 9,
/*  65 */ 6, 6, 6, 6, 24, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9, 29, 30,
/*  99 */ 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50, 51, 52, 9
};

const int MaiaScript::MAP1[] =
{
/*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
/*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
/*  54 */ 119, 151, 182, 214, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
/*  76 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 245, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
/*  98 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 54,
/* 120 */ 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5, 6, 7,
/* 157 */ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 9, 6, 6, 6,
/* 186 */ 6, 24, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9, 29, 30, 31, 32,
/* 219 */ 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50, 51, 52, 9, 9, 9, 9,
/* 249 */ 9, 9, 9, 9, 53, 53, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
/* 285 */ 9, 9
};

const int MaiaScript::MAP2[] =
{
/* 0 */ 57344, 65536, 65533, 1114111, 9, 9
};

const int MaiaScript::INITIAL[] =
{
/*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 528, 17, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
/* 28 */ 540
};

const int MaiaScript::TRANSITION[] =
{
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
/* 1764 */ 3101, 3101, 3101, 3101, 0, 0, 0, 3328, 3328, 3328, 49, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 86, 0,
/* 1787 */ 0, 0, 42, 42, 42, 0, 42, 42, 42, 42, 0, 0, 0, 0, 120, 0, 0, 0, 0, 2048, 0, 0, 0, 0, 0, 0, 2871, 2871, 2871,
/* 1816 */ 2871, 2871, 0, 2871, 2871, 2871, 2871, 0, 0, 0, 0, 768, 0, 0, 0, 0, 42, 0, 0, 0, 1054, 1054, 1054, 1054,
/* 1840 */ 1054, 1054, 0, 0, 0, 0, 0, 0, 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 14390, 0, 0, 0, 0, 7219, 0, 0, 0, 0, 1064,
/* 1868 */ 1064, 0, 0, 1089, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608,
/* 1891 */ 4608, 0, 0, 0, 0, 1179, 1054, 1054, 0, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 4864, 4864, 4864, 4864, 0,
/* 1917 */ 0, 0, 0, 4864, 0, 4864, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0, 86, 0, 86, 0, 0, 0,
/* 1949 */ 0, 6912, 0, 0, 0, 86, 86, 0, 0, 0, 0, 0, 0, 14080, 0, 43, 43, 43, 5376, 43, 43, 43, 43, 0, 0, 0, 0, 0, 0, 86,
/* 1979 */ 0, 86, 43, 43, 5419, 5419, 0, 0, 0, 0, 8960, 0, 2871, 0, 0, 42, 0, 0, 43, 0, 0, 0, 43, 43, 5376, 5376, 43,
/* 2006 */ 151, 43, 0, 43, 0, 0, 0, 0, 15616, 0, 0, 15616, 0, 5632, 5632, 0, 0, 5632, 5632, 0, 0, 0, 14976, 0, 0, 0, 0,
/* 2033 */ 7988, 0, 0, 0, 0, 1070, 1070, 0, 0, 1084, 5632, 5632, 5632, 5632, 0, 0, 0, 0, 44, 44, 5888, 5888, 44, 44, 44,
/* 2058 */ 44, 5888, 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 1054, 1054, 0, 0, 1054, 1054, 1054, 1054, 1054, 1197, 0,
/* 2081 */ 42, 84, 84, 43, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 42, 0, 0, 87, 0, 0, 0, 1057, 1057, 0, 0, 1083, 120, 120,
/* 2108 */ 0, 0, 0, 0, 0, 0, 3840, 3840, 0, 0, 0, 0, 56, 56, 56, 6400, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0, 1058,
/* 2135 */ 1058, 0, 0, 1058, 2605, 2605, 2605, 0, 2605, 2605, 2605, 2605, 0, 1054, 1054, 1054, 0, 42, 85, 2605, 2605,
/* 2156 */ 1054, 1054, 1054, 30, 0, 0, 0, 0, 1060, 1060, 0, 0, 1085, 152, 2713, 2684, 2714, 1054, 1054, 1054, 0, 1054,
/* 2178 */ 1154, 1054, 1156, 2713, 2714, 1054, 1054, 1054, 1054, 1054, 1054, 0, 150, 152, 152, 6912, 0, 6912, 0, 0, 0,
/* 2199 */ 6912, 0, 6912, 0, 6912, 6912, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0, 1062, 1062, 0, 0, 1087, 0, 0, 7424, 0,
/* 2223 */ 0, 0, 2871, 0, 0, 1054, 1054, 1054, 1054, 1196, 1054, 0, 42, 0, 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 3584, 0,
/* 2249 */ 7680, 8192, 8704, 0, 2871, 0, 0, 1054, 1054, 1054, 1195, 1054, 1054, 30, 1054, 1054, 1054, 0, 0, 85, 85, 0,
/* 2271 */ 2682, 2684, 0, 42, 0, 0, 88, 1054, 1054, 1054, 143, 1054, 1168, 1054, 1170, 0, 88, 0, 0, 1054, 1054, 1054, 0,
/* 2294 */ 1153, 1054, 1054, 1054, 88, 121, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 10526, 9216, 9216, 9216, 9216,
/* 2312 */ 9216, 9216, 9216, 9216, 0, 0, 0, 0, 0, 83, 0, 0, 0, 0, 0, 0, 4146, 4146, 0, 0, 0, 0, 0, 0, 9472, 0, 0, 0,
/* 2340 */ 9472, 0, 0, 9472, 9472, 9472, 9472, 9472, 9472, 0, 0, 0, 0, 2605, 2605, 0, 0, 2605, 0, 42, 0, 0, 0, 1113,
/* 2364 */ 1099, 1054, 1054, 1096, 1054, 1099, 1054, 1054, 1054, 1054, 13824, 121, 0, 0, 1054, 1093, 1054, 1113, 1054,
/* 2383 */ 1121, 1054, 1054, 30, 0, 1054, 1054, 1054, 1054, 13598, 1054, 1054, 1054, 1054, 1127, 1054, 1054, 1054, 1054,
/* 2402 */ 1054, 1054, 1103, 1105, 1164, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 30, 1180, 1054, 1054, 1054,
/* 2420 */ 1054, 1054, 1054, 1054, 1124, 1054, 1207, 1054, 1054, 1054, 1210, 1054, 1054, 1054, 1205, 1054, 1054, 1054,
/* 2438 */ 1054, 30, 1054, 0, 0, 1055, 0, 0, 0, 0, 0, 0, 0, 6144, 1081, 1081, 1081, 0, 1081, 1081, 1081, 1081, 0, 1054,
/* 2462 */ 1054, 1054, 1056, 0, 0, 0, 0, 0, 0, 0, 15104, 1082, 1082, 1082, 0, 1082, 1082, 1082, 1082, 1090, 1082, 1082,
/* 2484 */ 1082, 0, 1054, 1054, 1054, 1120, 1054, 1114, 1054, 1054, 1054, 1165, 1054, 1054, 1054, 1054, 1169, 1054,
/* 2502 */ 1054, 1098, 1054, 1100, 1054, 1054, 1054, 1183, 1054, 1054, 1054, 1054, 0, 121, 0, 0, 1054, 1188, 1054, 1054,
/* 2522 */ 1054, 1054, 1054, 1054, 1104, 1054, 1054, 1054, 1204, 1054, 1054, 1054, 1054, 1054, 1101, 1102, 1054, 1054,
/* 2540 */ 1211, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 123, 1057, 0, 0, 0, 0, 0, 0, 0, 6400, 6400, 56, 1083, 1083, 1083, 0,
/* 2566 */ 1083, 1083, 1083, 1083, 0, 1054, 1054, 1054, 1058, 1058, 1058, 0, 1058, 1058, 1058, 1058, 0, 0, 0, 0, 0, 0,
/* 2588 */ 0, 6656, 0, 0, 0, 0, 1058, 1091, 1058, 1058, 0, 1054, 1054, 1054, 1129, 1054, 1054, 1054, 1054, 0, 1054,
/* 2609 */ 1054, 1054, 1054, 0, 42, 0, 0, 88, 1054, 1054, 1102, 0, 88, 0, 0, 1054, 1054, 1566, 0, 0, 1054, 1054, 1194,
/* 2632 */ 1054, 1054, 1054, 1160, 1054, 1054, 1054, 1054, 1151, 1054, 1054, 1054, 1054, 1054, 1182, 1054, 1184, 1054,
/* 2650 */ 1054, 1054, 1137, 1054, 1054, 1054, 1054, 1130, 1054, 1054, 1054, 1054, 1054, 11173, 1054, 1054, 1054, 1054,
/* 2668 */ 1054, 1131, 1054, 1054, 88, 121, 1822, 1054, 1054, 1054, 1054, 1054, 1139, 1054, 1054, 1054, 1054, 13854,
/* 2686 */ 1054, 1054, 1054, 1054, 1054, 1161, 1054, 1054, 1054, 1054, 12574, 0, 0, 0, 0, 0, 7219, 7219, 0, 0, 0, 0,
/* 2708 */ 1059, 0, 0, 0, 0, 0, 0, 0, 7988, 7988, 0, 0, 0, 0, 1084, 1084, 1084, 0, 1084, 1084, 1084, 1084, 0, 1054,
/* 2732 */ 1054, 1054, 82, 42, 0, 0, 0, 1054, 1054, 1103, 1126, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1130, 1060, 0,
/* 2753 */ 0, 0, 0, 0, 0, 0, 8501, 8501, 0, 0, 0, 0, 1085, 1085, 1085, 0, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054,
/* 2777 */ 1142, 119, 0, 0, 0, 2304, 0, 0, 0, 9216, 9216, 0, 0, 9216, 1054, 1095, 1054, 1054, 1054, 1054, 1054, 1054,
/* 2799 */ 1122, 1123, 1149, 1150, 1054, 0, 1054, 1054, 1054, 1054, 1138, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054,
/* 2818 */ 1141, 149, 0, 0, 1054, 10014, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1187, 1054, 1054, 1054,
/* 2837 */ 1054, 1054, 1054, 1054, 1141, 1054, 1157, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1186, 1061, 0, 0, 0, 0,
/* 2857 */ 0, 0, 0, 9728, 9728, 0, 0, 0, 0, 1086, 1086, 1086, 0, 1086, 1086, 1086, 1086, 0, 1054, 1054, 1054, 1054,
/* 2879 */ 1135, 1054, 1054, 1054, 1054, 1054, 1054, 1132, 1054, 30, 1203, 1054, 1054, 1054, 12830, 1054, 1054, 1054,
/* 2897 */ 10270, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1093, 12062, 1054, 1054, 0, 0, 0, 0, 0, 14390, 14390, 0, 0, 0,
/* 2919 */ 0, 30, 1054, 1097, 1054, 1054, 1054, 1054, 1054, 1190, 1060, 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054,
/* 2940 */ 11806, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1094, 1054, 1118, 10782, 1119, 1054, 1054, 1054, 1054, 1141,
/* 2958 */ 1054, 1054, 1054, 1054, 1118, 1054, 1054, 1054, 1054, 1054, 1054, 11294, 1054, 1193, 1054, 1054, 1054, 1209,
/* 2976 */ 1054, 1054, 1054, 1172, 1054, 1054, 0, 0, 0, 121, 0, 0, 0, 1072, 1072, 0, 0, 1088, 1062, 0, 0, 0, 0, 0, 0, 0,
/* 3002 */ 14684, 2871, 0, 1087, 1087, 1087, 0, 1087, 1087, 1087, 1087, 0, 1054, 1092, 1054, 0, 42, 0, 0, 0, 1054, 1054,
/* 3024 */ 1115, 1117, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 110, 1054, 1054, 1054, 1054, 1054, 1140, 1054, 1054,
/* 3042 */ 1128, 1054, 1054, 1054, 1054, 1133, 1054, 1054, 1193, 1054, 0, 0, 0, 0, 4146, 0, 0, 0, 0, 1054, 1310, 1054,
/* 3064 */ 0, 1198, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1202, 1054, 1192, 1054, 1054, 0, 0, 0, 0, 5120, 0, 0, 0,
/* 3086 */ 0, 3328, 49, 49, 3328, 1063, 0, 0, 0, 0, 0, 0, 0, 5632, 0, 0, 0, 5632, 1088, 1088, 1088, 0, 1088, 1088, 1088,
/* 3111 */ 1088, 0, 1054, 1054, 1054, 1054, 1158, 1054, 1054, 1054, 1054, 1162, 1054, 1054, 1136, 1054, 1054, 1054,
/* 3129 */ 1054, 1054, 1185, 1054, 1054, 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1054, 1200, 1054, 1054, 1054, 1181,
/* 3147 */ 1054, 1054, 1054, 1054, 13086, 1054, 1054, 1151, 0, 1054, 1054, 1054, 1054, 1199, 1054, 1201, 1054, 1191,
/* 3165 */ 1054, 1054, 1054, 0, 0, 0, 0, 6144, 0, 0, 0, 0, 1056, 1056, 0, 0, 1082, 0, 42, 0, 0, 0, 1098, 1114, 1054,
/* 3190 */ 1054, 1159, 1054, 1054, 1054, 1054, 1163, 1054, 1171, 1054, 1054, 1054, 1054, 0, 0, 0, 9728, 0, 0, 0, 0,
/* 3211 */ 3840, 0, 0, 0, 0, 1054, 1054, 1054, 0, 1054, 1054, 11651, 1054, 1054, 1054, 1208, 1054, 1054, 1054, 1054,
/* 3231 */ 1054, 1206, 1054, 1054, 1054, 1064, 0, 0, 0, 0, 41, 0, 0, 0, 14080, 14080, 0, 0, 14080, 1089, 1089, 1089, 0,
/* 3254 */ 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054, 1054, 1054, 1054, 12318, 1054,
/* 3272 */ 1054, 1054, 14080, 14080, 14080, 0, 14080, 14080, 14080, 14080, 0, 0, 0, 0, 0, 15360, 0, 0, 0, 15360, 0, 0,
/* 3294 */ 0, 0, 0, 15360, 15360, 15360, 15360, 0, 0, 0, 0, 8501, 0, 0, 0, 0, 1071, 1071, 0, 0, 1086, 15616, 15616,
/* 3317 */ 15616, 0, 15616, 15616, 15616, 15616, 0, 0, 0, 0
};

const int MaiaScript::EXPECTED[] =
{
/*   0 */ 94, 98, 102, 106, 110, 114, 118, 122, 141, 141, 157, 128, 133, 205, 142, 137, 141, 141, 141, 141, 156, 148,
/*  22 */ 129, 141, 141, 140, 141, 141, 141, 124, 149, 129, 141, 141, 141, 141, 141, 146, 153, 141, 141, 141, 141, 141,
/*  44 */ 141, 141, 123, 167, 161, 172, 176, 183, 179, 187, 167, 167, 163, 167, 167, 168, 194, 199, 239, 203, 167, 167,
/*  66 */ 167, 166, 167, 190, 209, 216, 242, 167, 167, 167, 165, 167, 228, 233, 220, 243, 167, 163, 167, 195, 234, 222,
/*  88 */ 167, 233, 226, 232, 212, 238, 2056, 133120, 264192, 33556480, 67110912, 2048, 2048, 8521728, 67373056,
/* 103 */ 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, 401400, 67248120, 139256, -33822720, 139260,
/* 115 */ 67510264, 67248120, 2498552, 69607416, 69607416, -41943048, -33554440, 2048, 8, 8, 8, 0, 256, 768, 72, 24, 40,
/* 132 */ 0, 8192, 65536, 805306368, (int) 0x80000000, 8, 24, 8, 40, 8, 8, 8, 8, 72, 0, 256, 256, 256, 768, 768, 768,
/* 153 */ 768, 768, 72, 8, 0, 128, 256, 768, 2097152, 4194304, 0, 0, 0, 2097152, 0, 0, 0, 0, 6, 134217728, 16, 4194312,
/* 175 */ 272629768, 260046887, 125829175, 276820808, 276820808, 276820824, 276820824, 411038680, 276820808, 411038536,
/* 185 */ 125829183, 276820808, 411041624, 536867711, 536867711, 0, 0, 100663296, 64, 117440512, 0, 0, 64, 256, 256,
/* 200 */ 512, 28672, 32768, 384, 3072, 0, 0, 1024, 1024, 256, 12288, 16384, 65536, 0, 256, 16384, 131072, 262144,
/* 218 */ 524288, 1048576, 131072, 262144, 524288, 2097152, 128, 2048, 131072, 2048, 0, 0, 67108864, 64, 0, 256, 8192,
/* 235 */ 16384, 65536, 131072, 65536, 65536, 131072, 1835008, 2097152, 128, 3072, 0, 0
};

const wchar_t *MaiaScript::TOKEN[] =
{
  L"(0)",
  L"END",
  L"eof",
  L"identifier",
  L"'null'",
  L"'true'",
  L"'false'",
  L"string",
  L"complex",
  L"real",
  L"comment",
  L"whitespace",
  L"'!'",
  L"'!='",
  L"'%'",
  L"'&'",
  L"'&&'",
  L"'('",
  L"')'",
  L"'*'",
  L"'+'",
  L"','",
  L"'-'",
  L"'.'",
  L"'/'",
  L"':'",
  L"';'",
  L"'<'",
  L"'<<'",
  L"'<='",
  L"'='",
  L"'=='",
  L"'>'",
  L"'>='",
  L"'>>'",
  L"'['",
  L"']'",
  L"'^'",
  L"'break'",
  L"'catch'",
  L"'continue'",
  L"'do'",
  L"'else'",
  L"'elseif'",
  L"'for'",
  L"'foreach'",
  L"'function'",
  L"'if'",
  L"'namespace'",
  L"'return'",
  L"'test'",
  L"'throw'",
  L"'try'",
  L"'while'",
  L"'{'",
  L"'|'",
  L"'||'",
  L"'|||'",
  L"'||||'",
  L"'}'",
  L"'~'"
};

int main(int argc, char **argv)
{
  return MaiaScript::main(argc, argv);
}

// End
