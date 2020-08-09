// This file was generated on Sun Aug 9, 2020 15:12 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -backtrack -tree -main -cpp

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
  class EventHandler;

  MaiaScript(const wchar_t *string, EventHandler *t)
  {
    initialize(string, t);
  }

  virtual ~MaiaScript()
  {
  }

  class EventHandler
  {
  public:
    virtual ~EventHandler() {}

    virtual void reset(const wchar_t *string) = 0;
    virtual void startNonterminal(const wchar_t *name, int begin) = 0;
    virtual void endNonterminal(const wchar_t *name, int end) = 0;
    virtual void terminal(const wchar_t *name, int begin, int end) = 0;
    virtual void whitespace(int begin, int end) = 0;
  };

  class XmlSerializer : public EventHandler
  {
  public:
    XmlSerializer(bool indent)
    : input(0)
    , delayedTag(0)
    , indent(indent)
    , hasChildElement(false)
    , depth(0)
    {
    }

    void reset(const wchar_t *input)
    {
      fputs("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", stdout);

      this->input = input;
      delayedTag = 0;
      hasChildElement = false;
      depth = 0;
    }

    void startNonterminal(const wchar_t *tag, int b)
    {
      if (delayedTag != 0)
      {
        fputc('<', stdout);
        fputs(Utf8Encoder::encode(delayedTag).c_str(), stdout);
        fputc('>', stdout);
      }
      delayedTag = tag;
      if (indent)
      {
        fputc('\n', stdout);
        for (int i = 0; i < depth; ++i)
        {
          fputs("  ", stdout);
        }
      }
      hasChildElement = false;
      ++depth;
    }

    void endNonterminal(const wchar_t *tag, int e)
    {
      --depth;
      if (delayedTag != 0)
      {
        delayedTag = 0;
        fputc('<', stdout);
        fputs(Utf8Encoder::encode(tag).c_str(), stdout);
        fputs("/>", stdout);
      }
      else
      {
        if (indent)
        {
          if (hasChildElement)
          {
            fputc('\n', stdout);
            for (int i = 0; i < depth; ++i)
            {
              fputs("  ", stdout);
            }
          }
        }
        fputs("</", stdout);
        fputs(Utf8Encoder::encode(tag).c_str(), stdout);
        fputc('>', stdout);
      }
      hasChildElement = true;
    }

    void whitespace(int b, int e)
    {
      characters(b, e);
    }

    void characters(int b, int e)
    {
      if (b < e)
      {
        if (delayedTag != 0)
        {
          fputc('<', stdout);
          fputs(Utf8Encoder::encode(delayedTag).c_str(), stdout);
          fputc('>', stdout);
          delayedTag = 0;
        }
        std::string encoded = Utf8Encoder::encode(input + b, e - b);
        int size = encoded.size();
        for (int i = 0; i < size; ++i)
        {
          char c = encoded[i];
          switch (c)
          {
          case 0: break;
          case L'&': fputs("&amp;", stdout); break;
          case L'<': fputs("&lt;", stdout); break;
          case L'>': fputs("&gt;", stdout); break;
          default: fputc(c, stdout);
          }
        }
      }
    }

    void terminal(const wchar_t *tag, int b, int e)
    {
      if (tag[0] == L'\'') tag = L"TOKEN";
      startNonterminal(tag, b);
      characters(b, e);
      endNonterminal(tag, e);
    }

  private:
    const wchar_t *input;
    const wchar_t *delayedTag;
    bool indent;
    bool hasChildElement;
    int depth;
  };

  class Symbol
  {
  public:
    virtual ~Symbol() {}

    const wchar_t *name;
    int begin;
    int end;

    virtual void send(EventHandler *e) = 0;

  protected:
    Symbol(const wchar_t *name, int begin, int end)
    {
      this->name = name;
      this->begin = begin;
      this->end = end;
    }
  };

  class Terminal : public Symbol
  {
  public:
    Terminal(const wchar_t *name, int begin, int end)
    : Symbol(name, begin, end)
    {}

    void send(EventHandler *e)
    {
      e->terminal(name, begin, end);
    }
  };

  class Nonterminal : public Symbol
  {
  public:
    std::vector<Symbol *> *children;

    Nonterminal(const wchar_t *name, int begin, int end, std::vector<Symbol *> *children)
    : Symbol(name, begin, end)
    {
      this->children = children;
    }

    ~Nonterminal()
    {
      for (std::vector<Symbol *>::iterator child = children->begin(); child != children->end(); ++child)
        delete *child;
      delete children;
    }

    void send(EventHandler *e)
    {
      e->startNonterminal(name, begin);
      int pos = begin;
      for (std::vector<Symbol *>::iterator i = children->begin(); i != children->end(); ++i)
      {
        Symbol *c = *i;
        if (pos < c->begin) e->whitespace(pos, c->begin);
        c->send(e);
        pos = c->end;
      }
      if (pos < end) e->whitespace(pos, end);
      e->endNonterminal(name, end);
    }
  };

  class TopDownTreeBuilder : public EventHandler
  {
  public:
    TopDownTreeBuilder()
    {
      input = 0;
      stack.clear();
      top = -1;
    }

    void reset(const wchar_t *input)
    {
      this->input = input;
      top = -1;
    }

    void startNonterminal(const wchar_t *name, int begin)
    {
      Nonterminal *nonterminal = new Nonterminal(name, begin, begin, new std::vector<Symbol *>());
      if (top++ >= 0) addChild(nonterminal);
      if ((size_t) top >= stack.size())
        stack.resize(stack.size() == 0 ? 64 : stack.size() << 1);
      stack[top] = nonterminal;
    }

    void endNonterminal(const wchar_t *name, int end)
    {
      stack[top]->end = end;
      if (top > 0) --top;
    }

    void terminal(const wchar_t *name, int begin, int end)
    {
      addChild(new Terminal(name, begin, end));
    }

    void whitespace(int begin, int end)
    {
    }

    void serialize(EventHandler *e)
    {
      e->reset(input);
      stack[0]->send(e);
    }

  private:
    void addChild(Symbol *s)
    {
      Nonterminal *current = stack[top];
      current->children->push_back(s);
    }

    const wchar_t *input;
    std::vector<Nonterminal *> stack;
    int top;
  };

  static int main(int argc, char **argv)
  {
    int returnCode = 0;

    if (argc < 2)
    {
      fprintf(stderr, "Usage: %s [-i] INPUT...\n", argv[0]);
      fprintf(stderr, "\n");
      fprintf(stderr, "  parse INPUT, which is either a filename or literal text enclosed in curly braces\n");
      fprintf(stderr, "\n");
      fprintf(stderr, "  Option:\n");
      fprintf(stderr, "    -i     indented parse tree\n");
    }
    else
    {
#ifdef _WIN32
      setmode(fileno(stdout), O_BINARY);
#endif

      bool indent = false;
      for (int i = 1; i < argc; ++i)
      {
        if (strcmp(argv[i], "-i") == 0)
        {
          indent = true;
          continue;
        }
        try
        {
          XmlSerializer s(indent);
          std::wstring input = read(argv[i]);
          MaiaScript parser(input.c_str(), &s);
          try
          {
            parser.parse_maiascript();
          }
          catch (ParseException &pe)
          {
            fprintf(stderr, "\n");
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

  void initialize(const wchar_t *source, EventHandler *parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
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
    eventHandler->reset(input);
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
    eventHandler->startNonterminal(L"maiascript", e0);
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
        lookahead1W(17);            // END | identifier | null | true | false | string | complex | real | comment |
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
      break;
    }
    eventHandler->endNonterminal(L"maiascript", e0);
  }

private:

  void parse_operation()
  {
    eventHandler->startNonterminal(L"operation", e0);
    parse_variableAssignment();
    eventHandler->endNonterminal(L"operation", e0);
  }

  void try_operation()
  {
    try_variableAssignment();
  }

  void parse_variableAssignment()
  {
    eventHandler->startNonterminal(L"variableAssignment", e0);
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
    eventHandler->endNonterminal(L"variableAssignment", e0);
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
    eventHandler->startNonterminal(L"logicalORExpression", e0);
    parse_logicalANDExpression();
    for (;;)
    {
      if (l1 != 57)                 // '||'
      {
        break;
      }
      consume(57);                  // '||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_logicalANDExpression();
    }
    eventHandler->endNonterminal(L"logicalORExpression", e0);
  }

  void try_logicalORExpression()
  {
    try_logicalANDExpression();
    for (;;)
    {
      if (l1 != 57)                 // '||'
      {
        break;
      }
      consumeT(57);                 // '||'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_logicalANDExpression();
    }
  }

  void parse_logicalANDExpression()
  {
    eventHandler->startNonterminal(L"logicalANDExpression", e0);
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
    eventHandler->endNonterminal(L"logicalANDExpression", e0);
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
    eventHandler->startNonterminal(L"bitwiseORExpression", e0);
    parse_bitwiseXORExpression();
    for (;;)
    {
      if (l1 != 56)                 // '|'
      {
        break;
      }
      consume(56);                  // '|'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_bitwiseXORExpression();
    }
    eventHandler->endNonterminal(L"bitwiseORExpression", e0);
  }

  void try_bitwiseORExpression()
  {
    try_bitwiseXORExpression();
    for (;;)
    {
      if (l1 != 56)                 // '|'
      {
        break;
      }
      consumeT(56);                 // '|'
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_bitwiseXORExpression();
    }
  }

  void parse_bitwiseXORExpression()
  {
    eventHandler->startNonterminal(L"bitwiseXORExpression", e0);
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
    eventHandler->endNonterminal(L"bitwiseXORExpression", e0);
  }

  void try_bitwiseXORExpression()
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

  void parse_bitwiseANDExpression()
  {
    eventHandler->startNonterminal(L"bitwiseANDExpression", e0);
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
    eventHandler->endNonterminal(L"bitwiseANDExpression", e0);
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
    eventHandler->startNonterminal(L"equalityExpression", e0);
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
      whitespace();
      parse_relationalExpression();
    }
    eventHandler->endNonterminal(L"equalityExpression", e0);
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
    eventHandler->startNonterminal(L"relationalExpression", e0);
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
      whitespace();
      parse_shiftExpression();
    }
    eventHandler->endNonterminal(L"relationalExpression", e0);
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
    eventHandler->startNonterminal(L"shiftExpression", e0);
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
      whitespace();
      parse_additiveExpression();
    }
    eventHandler->endNonterminal(L"shiftExpression", e0);
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
    eventHandler->startNonterminal(L"additiveExpression", e0);
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      whitespace();
      parse_powerExpression();
    }
    eventHandler->endNonterminal(L"additiveExpression", e0);
  }

  void try_additiveExpression()
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
        break;
      }
      lookahead1W(12);              // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '!' | '(' | '[' | '{' | '~'
      try_powerExpression();
    }
  }

  void parse_powerExpression()
  {
    eventHandler->startNonterminal(L"powerExpression", e0);
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
    eventHandler->endNonterminal(L"powerExpression", e0);
  }

  void try_powerExpression()
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

  void parse_multiplicativeExpression()
  {
    eventHandler->startNonterminal(L"multiplicativeExpression", e0);
    parse_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '}' | '~'
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
      whitespace();
      parse_unaryExpression();
    }
    eventHandler->endNonterminal(L"multiplicativeExpression", e0);
  }

  void try_multiplicativeExpression()
  {
    try_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '}' | '~'
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
      try_unaryExpression();
    }
  }

  void parse_unaryExpression()
  {
    eventHandler->startNonterminal(L"unaryExpression", e0);
    switch (l1)
    {
    case 59:                        // '~'
      consume(59);                  // '~'
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
      break;
    }
    eventHandler->endNonterminal(L"unaryExpression", e0);
  }

  void try_unaryExpression()
  {
    switch (l1)
    {
    case 59:                        // '~'
      consumeT(59);                 // '~'
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
    eventHandler->startNonterminal(L"primary", e0);
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
    eventHandler->endNonterminal(L"primary", e0);
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
    eventHandler->startNonterminal(L"statement", e0);
    switch (l1)
    {
    case 49:                        // 'namespace'
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
    case 54:                        // 'while'
      parse_while();
      break;
    case 45:                        // 'for'
      parse_for();
      break;
    case 46:                        // 'foreach'
      parse_foreach();
      break;
    case 53:                        // 'try'
      parse_try();
      break;
    case 51:                        // 'test'
      parse_test();
      break;
    case 39:                        // 'break'
      parse_break();
      break;
    case 41:                        // 'continue'
      parse_continue();
      break;
    case 50:                        // 'return'
      parse_return();
      break;
    default:
      parse_throw();
      break;
    }
    eventHandler->endNonterminal(L"statement", e0);
  }

  void try_statement()
  {
    switch (l1)
    {
    case 49:                        // 'namespace'
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
    case 54:                        // 'while'
      try_while();
      break;
    case 45:                        // 'for'
      try_for();
      break;
    case 46:                        // 'foreach'
      try_foreach();
      break;
    case 53:                        // 'try'
      try_try();
      break;
    case 51:                        // 'test'
      try_test();
      break;
    case 39:                        // 'break'
      try_break();
      break;
    case 41:                        // 'continue'
      try_continue();
      break;
    case 50:                        // 'return'
      try_return();
      break;
    default:
      try_throw();
      break;
    }
  }

  void parse_namespace()
  {
    eventHandler->startNonterminal(L"namespace", e0);
    consume(49);                    // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"namespace", e0);
  }

  void try_namespace()
  {
    consumeT(49);                   // 'namespace'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_function()
  {
    eventHandler->startNonterminal(L"function", e0);
    consume(47);                    // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consume(3);                     // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"function", e0);
  }

  void try_function()
  {
    consumeT(47);                   // 'function'
    lookahead1W(0);                 // identifier | whitespace^token
    consumeT(3);                    // identifier
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 18)                   // ')'
    {
      try_arguments();
    }
    consumeT(18);                   // ')'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_if()
  {
    eventHandler->startNonterminal(L"if", e0);
    consume(48);                    // 'if'
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' |
                                    // 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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
    eventHandler->endNonterminal(L"if", e0);
  }

  void try_if()
  {
    consumeT(48);                   // 'if'
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
    for (;;)
    {
      lookahead1W(26);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' |
                                    // 'continue' | 'do' | 'else' | 'elseif' | 'for' | 'foreach' | 'function' | 'if' |
                                    // 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
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

  void parse_elseif()
  {
    eventHandler->startNonterminal(L"elseif", e0);
    consume(44);                    // 'elseif'
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"elseif", e0);
  }

  void try_elseif()
  {
    consumeT(44);                   // 'elseif'
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_else()
  {
    eventHandler->startNonterminal(L"else", e0);
    consume(43);                    // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"else", e0);
  }

  void try_else()
  {
    consumeT(43);                   // 'else'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_do()
  {
    eventHandler->startNonterminal(L"do", e0);
    consume(42);                    // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consume(54);                    // 'while'
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
    eventHandler->endNonterminal(L"do", e0);
  }

  void try_do()
  {
    consumeT(42);                   // 'do'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
    lookahead1W(5);                 // whitespace^token | 'while'
    consumeT(54);                   // 'while'
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
    eventHandler->startNonterminal(L"while", e0);
    consume(54);                    // 'while'
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"while", e0);
  }

  void try_while()
  {
    consumeT(54);                   // 'while'
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_for()
  {
    eventHandler->startNonterminal(L"for", e0);
    consume(45);                    // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
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
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"for", e0);
  }

  void try_for()
  {
    consumeT(45);                   // 'for'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_foreach()
  {
    eventHandler->startNonterminal(L"foreach", e0);
    consume(46);                    // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
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
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"foreach", e0);
  }

  void try_foreach()
  {
    consumeT(46);                   // 'foreach'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    if (l1 != 26)                   // ';'
    {
      try_expression();
    }
    lookahead1W(4);                 // whitespace^token | ';'
    consumeT(26);                   // ';'
    lookahead1W(19);                // identifier | null | true | false | string | complex | real | comment |
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_try()
  {
    eventHandler->startNonterminal(L"try", e0);
    consume(53);                    // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler->endNonterminal(L"try", e0);
  }

  void try_try()
  {
    consumeT(53);                   // 'try'
    lookahead1W(6);                 // whitespace^token | '{'
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      try_catch();
    }
  }

  void parse_test()
  {
    eventHandler->startNonterminal(L"test", e0);
    consume(51);                    // 'test'
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      whitespace();
      parse_catch();
    }
    eventHandler->endNonterminal(L"test", e0);
  }

  void try_test()
  {
    consumeT(51);                   // 'test'
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
    lookahead1W(25);                // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ')' | ',' | ';' | '[' | ']' | 'break' | 'catch' |
                                    // 'continue' | 'do' | 'for' | 'foreach' | 'function' | 'if' | 'namespace' |
                                    // 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '}' | '~'
    if (l1 == 40)                   // 'catch'
    {
      try_catch();
    }
  }

  void parse_catch()
  {
    eventHandler->startNonterminal(L"catch", e0);
    consume(40);                    // 'catch'
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
    consume(55);                    // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      whitespace();
      parse_expression();
    }
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"catch", e0);
  }

  void try_catch()
  {
    consumeT(40);                   // 'catch'
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
    consumeT(55);                   // '{'
    for (;;)
    {
      lookahead1W(20);              // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '}' | '~'
      if (l1 == 58)                 // '}'
      {
        break;
      }
      try_expression();
    }
    consumeT(58);                   // '}'
  }

  void parse_break()
  {
    eventHandler->startNonterminal(L"break", e0);
    consume(39);                    // 'break'
    eventHandler->endNonterminal(L"break", e0);
  }

  void try_break()
  {
    consumeT(39);                   // 'break'
  }

  void parse_continue()
  {
    eventHandler->startNonterminal(L"continue", e0);
    consume(41);                    // 'continue'
    eventHandler->endNonterminal(L"continue", e0);
  }

  void try_continue()
  {
    consumeT(41);                   // 'continue'
  }

  void parse_return()
  {
    eventHandler->startNonterminal(L"return", e0);
    consume(50);                    // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
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
    eventHandler->endNonterminal(L"return", e0);
  }

  void try_return()
  {
    consumeT(50);                   // 'return'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
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
    eventHandler->startNonterminal(L"throw", e0);
    consume(52);                    // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consume(17);                    // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
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
    eventHandler->endNonterminal(L"throw", e0);
  }

  void try_throw()
  {
    consumeT(52);                   // 'throw'
    lookahead1W(1);                 // whitespace^token | '('
    consumeT(17);                   // '('
    lookahead1W(18);                // identifier | null | true | false | string | complex | real | comment |
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
    eventHandler->startNonterminal(L"expression", e0);
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
    case 55:                        // '{'
    case 59:                        // '~'
      parse_operation();
      break;
    case 10:                        // comment
      consume(10);                  // comment
      break;
    default:
      parse_statement();
      break;
    }
    eventHandler->endNonterminal(L"expression", e0);
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
    case 55:                        // '{'
    case 59:                        // '~'
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
    eventHandler->startNonterminal(L"arguments", e0);
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
    eventHandler->endNonterminal(L"arguments", e0);
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
    eventHandler->startNonterminal(L"member", e0);
    switch (l1)
    {
    case 3:                         // identifier
      lookahead2W(28);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '.' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '|' | '||' | '}' | '~'
      switch (lk)
      {
      case 1091:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
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
     || lk == 160835                // identifier '(' 'break'
     || lk == 169027                // identifier '(' 'continue'
     || lk == 173123                // identifier '(' 'do'
     || lk == 185411                // identifier '(' 'for'
     || lk == 189507                // identifier '(' 'foreach'
     || lk == 193603                // identifier '(' 'function'
     || lk == 197699                // identifier '(' 'if'
     || lk == 201795                // identifier '(' 'namespace'
     || lk == 205891                // identifier '(' 'return'
     || lk == 209987                // identifier '(' 'test'
     || lk == 214083                // identifier '(' 'throw'
     || lk == 218179                // identifier '(' 'try'
     || lk == 222275                // identifier '(' 'while'
     || lk == 226371                // identifier '(' '{'
     || lk == 242755)               // identifier '(' '~'
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
            lookahead1W(18);        // identifier | null | true | false | string | complex | real | comment |
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
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
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '|' | '||' | '}' | '~'
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
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '}' | '~'
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
            lookahead3W(16);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '`' | '|' | '||'
            break;
          case 2275:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 803:                 // '[' '!'
          case 3811:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 1123:                // '[' '('
          case 3555:                // '[' '{'
            lookahead3W(15);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
            break;
          case 2723:                // '[' 'do'
          case 3427:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 3043:                // '[' 'function'
          case 3171:                // '[' 'namespace'
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
          case 3235:                // '[' 'return'
          case 3299:                // '[' 'test'
          case 3363:                // '[' 'throw'
          case 3491:                // '[' 'while'
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
         && lk != 38                // '`'
         && lk != 39                // 'break'
         && lk != 41                // 'continue'
         && lk != 42                // 'do'
         && lk != 45                // 'for'
         && lk != 46                // 'foreach'
         && lk != 47                // 'function'
         && lk != 48                // 'if'
         && lk != 49                // 'namespace'
         && lk != 50                // 'return'
         && lk != 51                // 'test'
         && lk != 52                // 'throw'
         && lk != 53                // 'try'
         && lk != 54                // 'while'
         && lk != 55                // '{'
         && lk != 56                // '|'
         && lk != 57                // '||'
         && lk != 58                // '}'
         && lk != 59                // '~'
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
        whitespace();
        parse_arguments();
        consume(36);                // ']'
      }
      break;
    }
    eventHandler->endNonterminal(L"member", e0);
  }

  void try_member()
  {
    switch (l1)
    {
    case 3:                         // identifier
      lookahead2W(28);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '.' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '|' | '||' | '}' | '~'
      switch (lk)
      {
      case 1091:                    // identifier '('
        lookahead3W(18);            // identifier | null | true | false | string | complex | real | comment |
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
     || lk == 160835                // identifier '(' 'break'
     || lk == 169027                // identifier '(' 'continue'
     || lk == 173123                // identifier '(' 'do'
     || lk == 185411                // identifier '(' 'for'
     || lk == 189507                // identifier '(' 'foreach'
     || lk == 193603                // identifier '(' 'function'
     || lk == 197699                // identifier '(' 'if'
     || lk == 201795                // identifier '(' 'namespace'
     || lk == 205891                // identifier '(' 'return'
     || lk == 209987                // identifier '(' 'test'
     || lk == 214083                // identifier '(' 'throw'
     || lk == 218179                // identifier '(' 'try'
     || lk == 222275                // identifier '(' 'while'
     || lk == 226371                // identifier '(' '{'
     || lk == 242755)               // identifier '(' '~'
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
            lookahead1W(18);        // identifier | null | true | false | string | complex | real | comment |
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
        lookahead1W(18);            // identifier | null | true | false | string | complex | real | comment |
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
                                    // '[' | ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' |
                                    // 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' |
                                    // '{' | '|' | '||' | '}' | '~'
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
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '}' | '~'
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
            lookahead3W(16);        // whitespace^token | '!=' | '%' | '&' | '&&' | '(' | '*' | '+' | ',' | '-' | '.' |
                                    // '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' | ']' |
                                    // '^' | '`' | '|' | '||'
            break;
          case 2275:                // '[' '['
            lookahead3W(23);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | ';' | '[' | ']' | 'break' | 'continue' | 'do' |
                                    // 'for' | 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' |
                                    // 'throw' | 'try' | 'while' | '{' | '~'
            break;
          case 803:                 // '[' '!'
          case 3811:                // '[' '~'
            lookahead3W(11);        // identifier | null | true | false | string | complex | real | whitespace^token |
                                    // '(' | '[' | '{'
            break;
          case 1123:                // '[' '('
          case 3555:                // '[' '{'
            lookahead3W(15);        // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
            break;
          case 2723:                // '[' 'do'
          case 3427:                // '[' 'try'
            lookahead3W(6);         // whitespace^token | '{'
            break;
          case 3043:                // '[' 'function'
          case 3171:                // '[' 'namespace'
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
          case 3235:                // '[' 'return'
          case 3299:                // '[' 'test'
          case 3363:                // '[' 'throw'
          case 3491:                // '[' 'while'
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
         && lk != 38                // '`'
         && lk != 39                // 'break'
         && lk != 41                // 'continue'
         && lk != 42                // 'do'
         && lk != 45                // 'for'
         && lk != 46                // 'foreach'
         && lk != 47                // 'function'
         && lk != 48                // 'if'
         && lk != 49                // 'namespace'
         && lk != 50                // 'return'
         && lk != 51                // 'test'
         && lk != 52                // 'throw'
         && lk != 53                // 'try'
         && lk != 54                // 'while'
         && lk != 55                // '{'
         && lk != 56                // '|'
         && lk != 57                // '||'
         && lk != 58                // '}'
         && lk != 59                // '~'
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
    eventHandler->startNonterminal(L"array", e0);
    consume(55);                    // '{'
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
    consume(58);                    // '}'
    eventHandler->endNonterminal(L"array", e0);
  }

  void try_array()
  {
    consumeT(55);                   // '{'
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
    consumeT(58);                   // '}'
  }

  void parse_matrix()
  {
    eventHandler->startNonterminal(L"matrix", e0);
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
    eventHandler->endNonterminal(L"matrix", e0);
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
    eventHandler->startNonterminal(L"element", e0);
    switch (l1)
    {
    case 7:                         // string
      lookahead2W(13);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '`' | '|' | '||' | '}'
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
    whitespace();
    parse_expression();
    eventHandler->endNonterminal(L"element", e0);
  }

  void try_element()
  {
    switch (l1)
    {
    case 7:                         // string
      lookahead2W(13);              // whitespace^token | '!=' | '%' | '&' | '&&' | '*' | '+' | ',' | '-' | '/' | ':' |
                                    // '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '^' | '`' | '|' | '||' | '}'
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
    eventHandler->startNonterminal(L"key", e0);
    consume(7);                     // string
    eventHandler->endNonterminal(L"key", e0);
  }

  void try_key()
  {
    consumeT(7);                    // string
  }

  void parse_row()
  {
    eventHandler->startNonterminal(L"row", e0);
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
    eventHandler->endNonterminal(L"row", e0);
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
    eventHandler->startNonterminal(L"column", e0);
    parse_expression();
    eventHandler->endNonterminal(L"column", e0);
  }

  void try_column()
  {
    try_expression();
  }

  void parse_parenthesizedExpression()
  {
    eventHandler->startNonterminal(L"parenthesizedExpression", e0);
    consume(17);                    // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consume(18);                    // ')'
    eventHandler->endNonterminal(L"parenthesizedExpression", e0);
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
    eventHandler->startNonterminal(L"value", e0);
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
    case 55:                        // '{'
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
    eventHandler->endNonterminal(L"value", e0);
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
    case 55:                        // '{'
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
      whitespace();
      eventHandler->terminal(TOKEN[l1], b1, e1);
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

  void whitespace()
  {
    if (e0 != b1)
    {
      eventHandler->whitespace(e0, b1);
      e0 = b1;
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
  EventHandler *eventHandler;
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
    for (int i = 0; i < 60; i += 32)
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
    int i0 = t * 192 + s - 1;
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
/*   0 */ 55, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
/*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 9, 9,
/*  65 */ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 29, 30, 31,
/*  99 */ 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 6, 44, 45, 46, 47, 6, 48, 6, 49, 6, 50, 51, 52, 53, 9
};

const int MaiaScript::MAP1[] =
{
/*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
/*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
/*  54 */ 119, 151, 182, 214, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
/*  76 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 245, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
/*  98 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 55,
/* 120 */ 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5, 6, 7,
/* 157 */ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 9, 6, 6, 6,
/* 186 */ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 29, 30, 31, 32, 33,
/* 219 */ 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 6, 44, 45, 46, 47, 6, 48, 6, 49, 6, 50, 51, 52, 53, 9, 9, 9, 9,
/* 249 */ 9, 9, 9, 9, 54, 54, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
/* 285 */ 9, 9
};

const int MaiaScript::MAP2[] =
{
/* 0 */ 57344, 65536, 65533, 1114111, 9, 9
};

const int MaiaScript::INITIAL[] =
{
/*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 528, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
/* 28 */ 540
};

const int MaiaScript::TRANSITION[] =
{
/*    0 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*   18 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1792, 1792, 1792, 1795,
/*   36 */ 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739,
/*   54 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1792, 1792, 1792, 1795, 2739, 1976, 2739, 2739,
/*   72 */ 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*   90 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1957, 1803, 1809, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813,
/*  108 */ 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  126 */ 2739, 2739, 2739, 1970, 1823, 1827, 2739, 1839, 1938, 2739, 2739, 2739, 1975, 1813, 2739, 2739, 2739, 2739,
/*  144 */ 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1937,
/*  162 */ 1849, 1853, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739,
/*  180 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 2887, 2809, 1867,
/*  198 */ 1938, 2809, 2809, 2809, 2738, 1871, 2809, 2809, 2664, 2646, 1873, 2809, 2664, 2647, 2809, 2886, 2809, 2809,
/*  216 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2639, 2645, 2642, 2739, 1976, 1938, 2739, 2739, 2739,
/*  234 */ 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  252 */ 2739, 2739, 2739, 2739, 2739, 2405, 2411, 2408, 2739, 1976, 1881, 2739, 2739, 2739, 2739, 1813, 2739, 2739,
/*  270 */ 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  288 */ 2739, 2739, 2739, 2739, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739,
/*  306 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1906, 1910, 1918, 1922,
/*  324 */ 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739,
/*  342 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1934, 1936, 1946, 1953, 2739, 1976, 1938, 2739,
/*  360 */ 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  378 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2691, 2697, 2694, 2739, 1965, 2166, 2739, 2739, 2739, 2431, 1857,
/*  396 */ 2739, 2739, 2739, 1984, 1859, 2739, 2739, 1990, 2739, 2430, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  414 */ 2739, 2739, 2739, 2037, 2014, 2020, 2739, 2032, 1938, 2739, 2739, 2739, 2740, 2045, 2739, 2739, 2739, 2058,
/*  432 */ 1815, 2739, 2739, 2050, 2739, 2591, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2083,
/*  450 */ 2115, 2112, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739,
/*  468 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2146, 2123, 2129, 2739, 2141,
/*  486 */ 1938, 2739, 2739, 2739, 2740, 2045, 2739, 2739, 2739, 2154, 1815, 2739, 2739, 2050, 2739, 2591, 2739, 2739,
/*  504 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2698, 2739, 2164, 2161, 2739, 2174, 1938, 2739, 2739, 2739,
/*  522 */ 1831, 1813, 2739, 2739, 2739, 2187, 1815, 2739, 2739, 2179, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  540 */ 2739, 2739, 2739, 2739, 2739, 2780, 2197, 2203, 2739, 1976, 2189, 2739, 2739, 2739, 1975, 1813, 2739, 2739,
/*  558 */ 2739, 2739, 2427, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  576 */ 2739, 2090, 2096, 2100, 2809, 2215, 1938, 2809, 2809, 2809, 2245, 2228, 2809, 2809, 2664, 2238, 1873, 2809,
/*  594 */ 2664, 2253, 2809, 2986, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2090, 2096, 2100,
/*  612 */ 2809, 2276, 1938, 2809, 2809, 2809, 2298, 2228, 2809, 2809, 2664, 2291, 1873, 2809, 2664, 2306, 2809, 3058,
/*  630 */ 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2555, 2553, 2739, 2739, 2739, 1976, 1938, 2739,
/*  648 */ 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  666 */ 2739, 2739, 2739, 2739, 2739, 2739, 2024, 2324, 2330, 2338, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813,
/*  684 */ 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  702 */ 2739, 2739, 2739, 2473, 2479, 2476, 2739, 1976, 2351, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739,
/*  720 */ 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2582,
/*  738 */ 2588, 2585, 2739, 1976, 2377, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739,
/*  756 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2630, 2636, 2633, 2739, 1976,
/*  774 */ 2133, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  792 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2358, 2365, 2369, 2739, 1976, 1938, 2739, 2739, 2739,
/*  810 */ 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  828 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2402, 1938, 2739, 2739, 2739, 1975, 1813, 2739, 2739,
/*  846 */ 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  864 */ 2739, 2420, 2442, 2439, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739,
/*  882 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2682, 2688, 2685,
/*  900 */ 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739,
/*  918 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2771, 2777, 2774, 2739, 1976, 1938, 2739,
/*  936 */ 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/*  954 */ 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 3312, 2450, 2463, 1938, 2489, 2509, 2809, 2738, 1871,
/*  972 */ 2809, 2519, 2664, 2646, 2312, 2809, 2501, 2647, 2529, 2886, 3109, 2539, 2739, 2739, 2739, 2739, 2739, 2739,
/*  990 */ 2739, 2739, 2550, 2343, 2563, 2567, 2809, 1867, 1938, 2809, 2809, 2809, 2470, 1871, 2809, 2809, 2664, 2646,
/* 1008 */ 1873, 2809, 2664, 2647, 2809, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2579, 3009,
/* 1026 */ 2599, 2607, 2809, 1867, 1938, 2809, 2809, 2809, 2738, 1871, 2809, 2619, 2664, 2646, 2230, 2711, 2664, 2647,
/* 1044 */ 2809, 2542, 2809, 3282, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2627, 3176, 2655, 2659, 2809, 1867,
/* 1062 */ 1938, 2809, 2809, 2809, 2738, 1871, 2809, 2809, 2664, 2646, 1873, 2809, 2664, 2647, 2809, 2886, 2809, 2809,
/* 1080 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2679, 3239, 2672, 2706, 3069, 2724, 1938, 2943, 3148, 2809,
/* 1098 */ 3213, 2611, 2809, 3152, 2732, 2748, 2760, 2792, 3028, 3217, 3130, 2975, 2809, 2924, 2739, 2739, 2739, 2739,
/* 1116 */ 2739, 2739, 2739, 2739, 2768, 3337, 3343, 3347, 2281, 1867, 1938, 2914, 2809, 2809, 2470, 1871, 2809, 2809,
/* 1134 */ 2664, 2646, 1873, 2809, 2664, 2647, 2809, 2886, 2788, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1152 */ 2738, 2752, 2663, 2887, 2521, 2800, 1938, 2820, 2808, 2809, 2738, 1871, 2809, 2809, 2664, 2646, 1873, 2810,
/* 1170 */ 2664, 2647, 2933, 2886, 2809, 2819, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2828, 3370, 2848, 2852,
/* 1188 */ 2809, 1867, 1938, 2809, 2809, 2809, 2860, 1871, 3019, 2809, 2664, 2646, 1873, 2809, 2884, 2647, 2895, 2904,
/* 1206 */ 2932, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 2887, 2809, 1867, 1938, 2809,
/* 1224 */ 2809, 2809, 2738, 1871, 2809, 2809, 2664, 2646, 1873, 2511, 2664, 1841, 2809, 2886, 2809, 2809, 2739, 2739,
/* 1242 */ 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 2887, 2941, 1867, 1938, 2809, 2951, 2264, 2738, 2959,
/* 1260 */ 2809, 2809, 2283, 2646, 2972, 3043, 2664, 2647, 2809, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1278 */ 2739, 2739, 2738, 2752, 2663, 2887, 2809, 1867, 1938, 2809, 2809, 2983, 2738, 1871, 2994, 2809, 2664, 2646,
/* 1296 */ 1873, 2809, 2664, 2647, 2809, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 3004, 1888,
/* 1314 */ 1894, 1898, 2809, 1867, 1938, 2809, 3120, 3017, 2470, 2571, 3027, 2809, 2664, 2646, 1873, 2809, 2664, 2647,
/* 1332 */ 2809, 3036, 3055, 2268, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 2316, 3066, 3077,
/* 1350 */ 1938, 3095, 3107, 2809, 2738, 1871, 2809, 2809, 2455, 2646, 1873, 3117, 2664, 2647, 2809, 2886, 3323, 3128,
/* 1368 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 2887, 2809, 1867, 1938, 2809, 2809, 2809,
/* 1386 */ 2738, 1871, 2809, 2809, 2664, 2646, 1873, 2809, 2664, 2647, 2809, 3138, 3160, 2809, 2739, 2739, 2739, 2739,
/* 1404 */ 2739, 2739, 2739, 2739, 3171, 1996, 2002, 2006, 2531, 3184, 1938, 3192, 2809, 3200, 2470, 2104, 3087, 2809,
/* 1422 */ 2664, 2646, 1873, 2809, 3269, 2647, 2919, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1440 */ 2738, 2752, 2663, 2887, 2809, 1867, 1938, 2809, 2996, 3163, 2738, 1871, 2495, 3225, 2664, 2412, 1873, 2809,
/* 1458 */ 2716, 2647, 3297, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 3234, 2065, 2071, 2075,
/* 1476 */ 2809, 1867, 1938, 2809, 2499, 3301, 2470, 1871, 3247, 3083, 2220, 2646, 2259, 3255, 3207, 2647, 3266, 2886,
/* 1494 */ 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2738, 2752, 2663, 2887, 3277, 3290, 1938, 2964,
/* 1512 */ 2809, 2896, 2738, 3143, 3258, 2809, 3309, 2646, 1873, 3320, 2664, 2647, 2809, 2886, 3226, 2809, 2739, 2739,
/* 1530 */ 2739, 2739, 2739, 2739, 2739, 2739, 3331, 2866, 2872, 2876, 2809, 1867, 1938, 2809, 2809, 2809, 2738, 1871,
/* 1548 */ 2809, 2809, 2664, 2646, 1873, 2809, 2811, 2647, 3047, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1566 */ 2739, 2739, 2738, 2752, 2663, 2887, 2809, 1867, 1938, 2809, 2809, 2810, 2738, 2909, 3099, 2809, 2664, 2646,
/* 1584 */ 1873, 2809, 2664, 2647, 2809, 2886, 2809, 2809, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2481, 2384,
/* 1602 */ 2390, 2394, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739,
/* 1620 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2831, 2837, 2834, 2739, 1976,
/* 1638 */ 2840, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1656 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 3355, 3357, 3365, 2739, 1976, 1938, 2739, 2739, 2739,
/* 1674 */ 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1692 */ 2739, 2739, 2739, 2739, 2739, 2207, 3378, 3382, 2739, 1976, 1938, 2739, 2739, 2739, 2739, 1813, 2739, 2739,
/* 1710 */ 2739, 2739, 1815, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1728 */ 2739, 2739, 2739, 2739, 2739, 1976, 2739, 2739, 2739, 2739, 2739, 1813, 2739, 2739, 2739, 2739, 1815, 2739,
/* 1746 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 1926, 2739,
/* 1764 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739,
/* 1782 */ 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 2739, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101,
/* 1800 */ 0, 0, 0, 49, 3328, 3328, 3328, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 93, 0, 0, 0, 0, 0, 0, 42, 42,
/* 1826 */ 42, 42, 42, 42, 42, 0, 0, 0, 0, 121, 0, 0, 87, 0, 2048, 0, 0, 0, 0, 0, 0, 1054, 10270, 0, 2871, 2871, 2871,
/* 1853 */ 2871, 2871, 2871, 2871, 0, 0, 0, 0, 131, 0, 0, 0, 0, 0, 0, 42, 0, 0, 0, 1054, 1054, 1054, 93, 1054, 1054,
/* 1878 */ 1054, 1054, 1054, 0, 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 1071, 1071, 0, 0, 1086, 1086, 1086, 1086, 1086, 1086,
/* 1901 */ 1086, 0, 1054, 1054, 1054, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608,
/* 1923 */ 4608, 4608, 4608, 0, 0, 0, 0, 768, 0, 0, 0, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 0, 4864, 0, 0, 0, 4864,
/* 1952 */ 0, 4864, 4864, 4864, 4864, 0, 0, 0, 0, 3328, 49, 49, 3328, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0,
/* 1980 */ 0, 0, 0, 0, 0, 86, 0, 86, 0, 0, 86, 0, 86, 86, 86, 86, 0, 0, 0, 1062, 1062, 0, 0, 1087, 1087, 1087, 1087,
/* 2007 */ 1087, 1087, 1087, 0, 1054, 1092, 1054, 5376, 43, 43, 43, 43, 43, 43, 43, 5419, 5419, 0, 0, 0, 0, 6912, 0, 0,
/* 2031 */ 0, 0, 42, 0, 0, 43, 0, 0, 0, 43, 43, 5376, 5376, 43, 126, 0, 0, 0, 93, 0, 0, 0, 43, 125, 43, 0, 0, 0, 154,
/* 2060 */ 154, 43, 0, 0, 43, 0, 0, 0, 1072, 1072, 0, 0, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 0, 1054, 1054, 1054,
/* 2083 */ 0, 5632, 5632, 0, 0, 5632, 5632, 0, 0, 0, 2605, 2605, 0, 0, 2605, 2605, 2605, 2605, 2605, 2605, 2605, 0,
/* 2105 */ 1054, 1054, 1054, 93, 1054, 1054, 11910, 5632, 5632, 5632, 5632, 0, 0, 0, 0, 0, 0, 5632, 5888, 44, 44, 44,
/* 2127 */ 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 8960, 0, 2871, 0, 0, 42, 84, 84, 43, 0, 0, 0, 44, 44, 5888, 5888, 44,
/* 2154 */ 0, 154, 154, 43, 84, 0, 43, 0, 0, 0, 6144, 0, 0, 0, 0, 0, 0, 0, 2871, 93, 0, 42, 0, 0, 87, 0, 0, 0, 121, 121,
/* 2184 */ 121, 0, 0, 0, 121, 0, 0, 0, 0, 0, 0, 2871, 2871, 6400, 56, 56, 56, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0,
/* 2211 */ 15360, 0, 0, 15360, 0, 42, 85, 2605, 2605, 1054, 1054, 1054, 30, 1054, 1054, 1054, 0, 2687, 1054, 1054, 1054,
/* 2232 */ 93, 1054, 1054, 1054, 1187, 1054, 153, 85, 155, 2716, 2718, 2687, 2718, 1054, 0, 0, 85, 85, 0, 2684, 2605,
/* 2253 */ 153, 155, 155, 2716, 2716, 2718, 1054, 1054, 93, 1054, 1185, 1054, 1054, 1054, 1138, 1054, 1054, 1054, 1054,
/* 2272 */ 1054, 12318, 1054, 1054, 0, 42, 85, 2605, 2648, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1142, 152, 153,
/* 2292 */ 122, 155, 2717, 2718, 2687, 2718, 1054, 0, 0, 85, 122, 0, 2684, 2648, 174, 155, 155, 2717, 2717, 2718, 1054,
/* 2313 */ 1054, 93, 1184, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1094, 6912, 0, 6912, 0, 0, 0, 6912, 0, 6912, 0, 0,
/* 2335 */ 6912, 6912, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 0, 7424, 0, 0, 0, 2871, 0, 0,
/* 2360 */ 0, 9216, 9216, 0, 0, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 0, 0, 0, 0, 3584, 0, 7680, 8192, 8704,
/* 2382 */ 0, 2871, 0, 0, 0, 14336, 14336, 0, 0, 14336, 14336, 14336, 14336, 14336, 14336, 14336, 0, 0, 0, 0, 0, 83, 0,
/* 2405 */ 0, 0, 0, 0, 0, 4146, 4146, 0, 0, 0, 0, 0, 0, 0, 1183, 0, 0, 9472, 0, 0, 0, 9472, 0, 0, 2909, 0, 0, 0, 0, 0,
/* 2435 */ 86, 0, 0, 86, 9472, 9472, 9472, 9472, 0, 0, 0, 0, 0, 9472, 9472, 1054, 1054, 1096, 1054, 1099, 1054, 1054,
/* 2457 */ 1054, 1054, 1175, 1054, 1054, 0, 0, 42, 0, 0, 0, 1114, 1099, 1054, 0, 42, 0, 0, 0, 0, 0, 7219, 7219, 0, 0, 0,
/* 2483 */ 0, 0, 0, 0, 14336, 0, 1054, 1093, 1054, 1114, 1054, 1122, 1054, 1054, 1054, 1162, 1054, 1054, 1054, 1054,
/* 2503 */ 1131, 1054, 1054, 1054, 1054, 0, 1054, 1128, 1054, 1054, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1167, 1054,
/* 2522 */ 1054, 1054, 1054, 1054, 1054, 1103, 1105, 1054, 1200, 1054, 1054, 1054, 1054, 1054, 1054, 1104, 1054, 1054,
/* 2540 */ 1054, 1215, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1209, 1055, 0, 0, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 0,
/* 2564 */ 1081, 1081, 1081, 1081, 1081, 1081, 1081, 0, 1054, 1054, 1054, 93, 1054, 1157, 1054, 1056, 0, 0, 0, 0, 0, 0,
/* 2586 */ 0, 7988, 7988, 0, 0, 0, 0, 0, 0, 0, 154, 0, 0, 0, 1082, 1082, 1082, 1082, 1082, 1082, 1082, 1090, 1082, 1082,
/* 2610 */ 1082, 0, 1054, 1054, 1054, 93, 1156, 1054, 1054, 1054, 1054, 1168, 1054, 1054, 1054, 1054, 1172, 1057, 0, 0,
/* 2630 */ 0, 0, 0, 0, 0, 8501, 8501, 0, 0, 0, 0, 0, 0, 0, 3840, 3840, 0, 0, 0, 0, 0, 0, 0, 1054, 1054, 0, 1083, 1083,
/* 2658 */ 1083, 1083, 1083, 1083, 1083, 0, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0, 0, 1058, 1058, 1058, 1058,
/* 2677 */ 1058, 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 9728, 9728, 0, 0, 0, 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 0, 0, 0,
/* 2705 */ 6144, 1058, 1091, 1058, 1058, 0, 1054, 1054, 1054, 1054, 1192, 1054, 1054, 1054, 1054, 1196, 1054, 1054, 0,
/* 2724 */ 0, 42, 0, 0, 89, 1054, 1054, 1102, 1173, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 125, 0,
/* 2749 */ 123, 0, 89, 0, 0, 0, 1054, 1054, 0, 0, 1054, 1054, 1566, 93, 1054, 1054, 1186, 1054, 1188, 1059, 0, 0, 0, 0,
/* 2773 */ 0, 0, 0, 9984, 9984, 0, 0, 0, 0, 0, 0, 0, 6400, 6400, 56, 1054, 1054, 1054, 11550, 1054, 1054, 1054, 1054,
/* 2796 */ 1054, 11433, 1054, 1054, 82, 42, 0, 0, 0, 1054, 1054, 1103, 1127, 1054, 1054, 1054, 1054, 1054, 1054, 1054,
/* 2816 */ 1054, 30, 0, 12062, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 1060, 0, 0, 0, 0, 0, 0, 0, 14646, 14646,
/* 2838 */ 0, 0, 0, 0, 0, 0, 0, 14848, 2871, 0, 0, 1085, 1085, 1085, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054, 1143,
/* 2861 */ 120, 0, 0, 0, 2304, 0, 0, 0, 1064, 1064, 0, 0, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054,
/* 2884 */ 1194, 1060, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1199, 1054, 1054, 1054, 1054, 1054, 1054,
/* 2902 */ 1054, 1142, 1204, 1054, 1206, 1054, 1054, 0, 1054, 1054, 30, 93, 1054, 1054, 1054, 1054, 12574, 1054, 1054,
/* 2921 */ 1054, 1054, 1203, 1054, 1054, 1054, 1054, 10782, 1054, 1054, 12830, 1210, 1054, 1054, 1054, 1054, 1054, 1054,
/* 2939 */ 1054, 10526, 1054, 1095, 1054, 1054, 1054, 1054, 1054, 1054, 1123, 1124, 1054, 1054, 1129, 1054, 1054, 1054,
/* 2957 */ 1054, 1134, 0, 1152, 1153, 1054, 93, 1054, 1054, 1054, 1121, 1054, 1115, 1054, 1054, 1310, 1054, 93, 1054,
/* 2976 */ 1054, 1054, 1054, 1054, 123, 1054, 1054, 1054, 1054, 1137, 1054, 1054, 1054, 1054, 1054, 153, 1054, 1054,
/* 2994 */ 1054, 1160, 1054, 1054, 1054, 1054, 1054, 1054, 1133, 1054, 1061, 0, 0, 0, 0, 0, 0, 0, 1056, 1056, 0, 0,
/* 3016 */ 1082, 1054, 1136, 1054, 1054, 1054, 1054, 1054, 1054, 1164, 1054, 1159, 1054, 1054, 1054, 1054, 1054, 1054,
/* 3034 */ 1054, 14080, 1054, 1205, 1054, 1054, 30, 0, 1208, 1054, 1054, 1054, 1191, 1054, 1054, 1054, 1054, 1054,
/* 3052 */ 13598, 1054, 1054, 1054, 1054, 13086, 1054, 1054, 1054, 1054, 1054, 174, 1054, 1054, 30, 1054, 1097, 1054,
/* 3070 */ 1054, 1054, 1054, 1054, 1101, 1102, 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054, 1169, 1054, 1054, 1054,
/* 3090 */ 1054, 1163, 1054, 1054, 1054, 1054, 1119, 11038, 1120, 1054, 1054, 1054, 1054, 1054, 13854, 1054, 1054, 1054,
/* 3108 */ 1119, 1054, 1054, 1054, 1054, 1054, 1054, 1212, 1054, 1054, 1054, 1190, 1054, 1054, 1054, 1054, 1054, 1132,
/* 3126 */ 1054, 1054, 1054, 1214, 1054, 1054, 1054, 1054, 1054, 1054, 14110, 1054, 1054, 1054, 1054, 1207, 1054, 0,
/* 3144 */ 1054, 1054, 1154, 93, 1054, 1054, 1054, 1130, 1054, 1054, 1054, 1054, 146, 1054, 1171, 1054, 1054, 1211,
/* 3162 */ 1054, 1054, 1054, 1054, 1054, 1054, 1140, 1054, 1054, 1062, 0, 0, 0, 0, 0, 0, 0, 1057, 1057, 0, 0, 1083, 0,
/* 3185 */ 42, 0, 0, 0, 1054, 1054, 1116, 1118, 1054, 1054, 1054, 1054, 1054, 1054, 1126, 111, 1054, 1054, 1054, 1054,
/* 3205 */ 1054, 1141, 1054, 1054, 1054, 1195, 1054, 1054, 1054, 0, 0, 0, 123, 0, 0, 89, 89, 123, 1822, 1054, 1166,
/* 3226 */ 1054, 1054, 1054, 1054, 1142, 1054, 1054, 1213, 1063, 0, 0, 0, 0, 0, 0, 0, 1058, 1058, 0, 0, 1058, 1054,
/* 3248 */ 1054, 1161, 1054, 1054, 1054, 1054, 1165, 1054, 13342, 1054, 1054, 1054, 1054, 1054, 1054, 1154, 1054, 1054,
/* 3266 */ 1054, 1054, 1201, 1054, 1054, 1054, 1054, 1054, 1197, 1054, 0, 1054, 1054, 1098, 1054, 1100, 1054, 1054,
/* 3284 */ 1054, 1142, 1054, 1054, 1216, 1054, 0, 42, 0, 0, 0, 1098, 1115, 1054, 1054, 1054, 1202, 1054, 1054, 1054,
/* 3304 */ 1054, 1139, 1054, 1054, 1054, 1054, 1054, 1174, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1093, 1189, 1054,
/* 3322 */ 1054, 1054, 1054, 1054, 1054, 1054, 1197, 1054, 1054, 1064, 0, 0, 0, 0, 41, 0, 0, 0, 1070, 1070, 0, 0, 1084,
/* 3345 */ 1084, 1084, 1084, 1084, 1084, 1084, 0, 1054, 1054, 1054, 0, 15104, 0, 0, 0, 15104, 0, 0, 0, 0, 15104, 15104,
/* 3367 */ 15104, 15104, 0, 0, 0, 0, 1060, 1060, 0, 0, 1085, 0, 15360, 15360, 15360, 15360, 15360, 15360, 15360, 0, 0,
/* 3388 */ 0, 0
};

const int MaiaScript::EXPECTED[] =
{
/*   0 */ 96, 100, 104, 108, 112, 116, 120, 124, 134, 134, 158, 129, 139, 190, 135, 143, 134, 134, 134, 134, 157, 222,
/*  22 */ 129, 133, 134, 145, 134, 134, 134, 125, 221, 149, 131, 134, 134, 134, 134, 125, 221, 150, 134, 134, 134, 154,
/*  44 */ 134, 134, 134, 134, 207, 162, 169, 173, 180, 176, 184, 207, 207, 207, 206, 207, 207, 188, 194, 198, 202, 207,
/*  66 */ 207, 207, 205, 207, 207, 165, 212, 218, 235, 207, 207, 245, 207, 207, 208, 226, 214, 234, 207, 245, 207, 208,
/*  88 */ 226, 231, 244, 237, 241, 236, 227, 249, 2056, 133120, 264192, 33556480, 67110912, 2048, 2048, 8521728,
/* 104 */ 67373056, 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, -33822720, 401400, 67248120,
/* 115 */ 139256, 139260, 67510264, 67248120, 2498552, 69607416, 69607416, -41943048, -33554440, 2048, 8, 8, 8, 0, 768,
/* 130 */ 72, 24, 40, 1024, 8, 8, 8, 8, 72, 8192, 65536, 805306368, (int) 0x80000000, 8, 24, 8, 40, 8, 8, 768, 768, 768,
/* 152 */ 72, 8, 8, 256, 8, 8, 0, 128, 256, 768, 0, 4194304, 8388608, 0, 128, 512, 24576, 0, 67108864, 16, 8388616,
/* 173 */ 142606344, 117440615, 50331767, 150988424, 150988424, 150988440, 150988440, 50331775, 150988424, 150988424,
/* 183 */ 218097288, 218097560, 218103448, 268429055, 268429055, 6, 33554432, 0, 0, 1024, 1024, 128, 512, 1024, 57344,
/* 198 */ 65536, 131072, 262144, 3670016, 4194304, 768, 6144, 0, 4194304, 0, 0, 0, 0, 128, 32768, 131072, 262144,
/* 215 */ 524288, 1048576, 4194304, 1048576, 2097152, 4194304, 256, 256, 256, 768, 768, 512, 16384, 32768, 131072, 0,
/* 231 */ 262144, 1048576, 4194304, 256, 6144, 0, 0, 0, 512, 16384, 32768, 131072, 262144, 4096, 0, 0, 0, 4194304, 512,
/* 250 */ 32768, 131072, 131072
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
  L"'`'",
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
  L"'}'",
  L"'~'"
};

int main(int argc, char **argv)
{
  return MaiaScript::main(argc, argv);
}

// End
