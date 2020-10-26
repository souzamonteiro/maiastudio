// This file was generated on Mon Oct 26, 2020 10:04 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -backtrack -tree -trace -main -cpp

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
            fprintf(stderr, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            fprintf(stderr, "<trace>\n");
            parser.parse_maiascript();
            fprintf(stderr, "</trace>\n");
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
    traceNonterminal(L"parse", L"start", L"maiascript");
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
      break;
    }
    eventHandler->endNonterminal(L"maiascript", e0);
    traceNonterminal(L"parse", L"end", L"maiascript");
  }

private:

  void parse_operation()
  {
    traceNonterminal(L"parse", L"start", L"operation");
    eventHandler->startNonterminal(L"operation", e0);
    parse_variableAssignment();
    eventHandler->endNonterminal(L"operation", e0);
    traceNonterminal(L"parse", L"end", L"operation");
  }

  void try_operation()
  {
    traceNonterminal(L"try", L"start", L"operation");
    try_variableAssignment();
    traceNonterminal(L"try", L"end", L"operation");
  }

  void parse_variableAssignment()
  {
    traceNonterminal(L"parse", L"start", L"variableAssignment");
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
    traceNonterminal(L"parse", L"end", L"variableAssignment");
  }

  void try_variableAssignment()
  {
    traceNonterminal(L"try", L"start", L"variableAssignment");
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
    traceNonterminal(L"try", L"end", L"variableAssignment");
  }

  void parse_logicalORExpression()
  {
    traceNonterminal(L"parse", L"start", L"logicalORExpression");
    eventHandler->startNonterminal(L"logicalORExpression", e0);
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
    eventHandler->endNonterminal(L"logicalORExpression", e0);
    traceNonterminal(L"parse", L"end", L"logicalORExpression");
  }

  void try_logicalORExpression()
  {
    traceNonterminal(L"try", L"start", L"logicalORExpression");
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
    traceNonterminal(L"try", L"end", L"logicalORExpression");
  }

  void parse_logicalXORExpression()
  {
    traceNonterminal(L"parse", L"start", L"logicalXORExpression");
    eventHandler->startNonterminal(L"logicalXORExpression", e0);
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
    eventHandler->endNonterminal(L"logicalXORExpression", e0);
    traceNonterminal(L"parse", L"end", L"logicalXORExpression");
  }

  void try_logicalXORExpression()
  {
    traceNonterminal(L"try", L"start", L"logicalXORExpression");
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
    traceNonterminal(L"try", L"end", L"logicalXORExpression");
  }

  void parse_logicalANDExpression()
  {
    traceNonterminal(L"parse", L"start", L"logicalANDExpression");
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
    traceNonterminal(L"parse", L"end", L"logicalANDExpression");
  }

  void try_logicalANDExpression()
  {
    traceNonterminal(L"try", L"start", L"logicalANDExpression");
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
    traceNonterminal(L"try", L"end", L"logicalANDExpression");
  }

  void parse_bitwiseORExpression()
  {
    traceNonterminal(L"parse", L"start", L"bitwiseORExpression");
    eventHandler->startNonterminal(L"bitwiseORExpression", e0);
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
    eventHandler->endNonterminal(L"bitwiseORExpression", e0);
    traceNonterminal(L"parse", L"end", L"bitwiseORExpression");
  }

  void try_bitwiseORExpression()
  {
    traceNonterminal(L"try", L"start", L"bitwiseORExpression");
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
    traceNonterminal(L"try", L"end", L"bitwiseORExpression");
  }

  void parse_bitwiseXORExpression()
  {
    traceNonterminal(L"parse", L"start", L"bitwiseXORExpression");
    eventHandler->startNonterminal(L"bitwiseXORExpression", e0);
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
    eventHandler->endNonterminal(L"bitwiseXORExpression", e0);
    traceNonterminal(L"parse", L"end", L"bitwiseXORExpression");
  }

  void try_bitwiseXORExpression()
  {
    traceNonterminal(L"try", L"start", L"bitwiseXORExpression");
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
    traceNonterminal(L"try", L"end", L"bitwiseXORExpression");
  }

  void parse_bitwiseANDExpression()
  {
    traceNonterminal(L"parse", L"start", L"bitwiseANDExpression");
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
    traceNonterminal(L"parse", L"end", L"bitwiseANDExpression");
  }

  void try_bitwiseANDExpression()
  {
    traceNonterminal(L"try", L"start", L"bitwiseANDExpression");
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
    traceNonterminal(L"try", L"end", L"bitwiseANDExpression");
  }

  void parse_equalityExpression()
  {
    traceNonterminal(L"parse", L"start", L"equalityExpression");
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
    traceNonterminal(L"parse", L"end", L"equalityExpression");
  }

  void try_equalityExpression()
  {
    traceNonterminal(L"try", L"start", L"equalityExpression");
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
    traceNonterminal(L"try", L"end", L"equalityExpression");
  }

  void parse_relationalExpression()
  {
    traceNonterminal(L"parse", L"start", L"relationalExpression");
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
    traceNonterminal(L"parse", L"end", L"relationalExpression");
  }

  void try_relationalExpression()
  {
    traceNonterminal(L"try", L"start", L"relationalExpression");
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
    traceNonterminal(L"try", L"end", L"relationalExpression");
  }

  void parse_shiftExpression()
  {
    traceNonterminal(L"parse", L"start", L"shiftExpression");
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
    traceNonterminal(L"parse", L"end", L"shiftExpression");
  }

  void try_shiftExpression()
  {
    traceNonterminal(L"try", L"start", L"shiftExpression");
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
    traceNonterminal(L"try", L"end", L"shiftExpression");
  }

  void parse_additiveExpression()
  {
    traceNonterminal(L"parse", L"start", L"additiveExpression");
    eventHandler->startNonterminal(L"additiveExpression", e0);
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
      whitespace();
      parse_multiplicativeExpression();
    }
    eventHandler->endNonterminal(L"additiveExpression", e0);
    traceNonterminal(L"parse", L"end", L"additiveExpression");
  }

  void try_additiveExpression()
  {
    traceNonterminal(L"try", L"start", L"additiveExpression");
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
    traceNonterminal(L"try", L"end", L"additiveExpression");
  }

  void parse_multiplicativeExpression()
  {
    traceNonterminal(L"parse", L"start", L"multiplicativeExpression");
    eventHandler->startNonterminal(L"multiplicativeExpression", e0);
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
      whitespace();
      parse_powerExpression();
    }
    eventHandler->endNonterminal(L"multiplicativeExpression", e0);
    traceNonterminal(L"parse", L"end", L"multiplicativeExpression");
  }

  void try_multiplicativeExpression()
  {
    traceNonterminal(L"try", L"start", L"multiplicativeExpression");
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
    traceNonterminal(L"try", L"end", L"multiplicativeExpression");
  }

  void parse_powerExpression()
  {
    traceNonterminal(L"parse", L"start", L"powerExpression");
    eventHandler->startNonterminal(L"powerExpression", e0);
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
    eventHandler->endNonterminal(L"powerExpression", e0);
    traceNonterminal(L"parse", L"end", L"powerExpression");
  }

  void try_powerExpression()
  {
    traceNonterminal(L"try", L"start", L"powerExpression");
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
    traceNonterminal(L"try", L"end", L"powerExpression");
  }

  void parse_unaryExpression()
  {
    traceNonterminal(L"parse", L"start", L"unaryExpression");
    eventHandler->startNonterminal(L"unaryExpression", e0);
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
      break;
    }
    eventHandler->endNonterminal(L"unaryExpression", e0);
    traceNonterminal(L"parse", L"end", L"unaryExpression");
  }

  void try_unaryExpression()
  {
    traceNonterminal(L"try", L"start", L"unaryExpression");
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
    traceNonterminal(L"try", L"end", L"unaryExpression");
  }

  void parse_primary()
  {
    traceNonterminal(L"parse", L"start", L"primary");
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
    traceNonterminal(L"parse", L"end", L"primary");
  }

  void try_primary()
  {
    traceNonterminal(L"try", L"start", L"primary");
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
    traceNonterminal(L"try", L"end", L"primary");
  }

  void parse_statement()
  {
    traceNonterminal(L"parse", L"start", L"statement");
    eventHandler->startNonterminal(L"statement", e0);
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
    eventHandler->endNonterminal(L"statement", e0);
    traceNonterminal(L"parse", L"end", L"statement");
  }

  void try_statement()
  {
    traceNonterminal(L"try", L"start", L"statement");
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
    traceNonterminal(L"try", L"end", L"statement");
  }

  void parse_namespace()
  {
    traceNonterminal(L"parse", L"start", L"namespace");
    eventHandler->startNonterminal(L"namespace", e0);
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
    eventHandler->endNonterminal(L"namespace", e0);
    traceNonterminal(L"parse", L"end", L"namespace");
  }

  void try_namespace()
  {
    traceNonterminal(L"try", L"start", L"namespace");
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
    traceNonterminal(L"try", L"end", L"namespace");
  }

  void parse_function()
  {
    traceNonterminal(L"parse", L"start", L"function");
    eventHandler->startNonterminal(L"function", e0);
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
    eventHandler->endNonterminal(L"function", e0);
    traceNonterminal(L"parse", L"end", L"function");
  }

  void try_function()
  {
    traceNonterminal(L"try", L"start", L"function");
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
    traceNonterminal(L"try", L"end", L"function");
  }

  void parse_if()
  {
    traceNonterminal(L"parse", L"start", L"if");
    eventHandler->startNonterminal(L"if", e0);
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
    eventHandler->endNonterminal(L"if", e0);
    traceNonterminal(L"parse", L"end", L"if");
  }

  void try_if()
  {
    traceNonterminal(L"try", L"start", L"if");
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
    traceNonterminal(L"try", L"end", L"if");
  }

  void parse_elseif()
  {
    traceNonterminal(L"parse", L"start", L"elseif");
    eventHandler->startNonterminal(L"elseif", e0);
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
    eventHandler->endNonterminal(L"elseif", e0);
    traceNonterminal(L"parse", L"end", L"elseif");
  }

  void try_elseif()
  {
    traceNonterminal(L"try", L"start", L"elseif");
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
    traceNonterminal(L"try", L"end", L"elseif");
  }

  void parse_else()
  {
    traceNonterminal(L"parse", L"start", L"else");
    eventHandler->startNonterminal(L"else", e0);
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
    eventHandler->endNonterminal(L"else", e0);
    traceNonterminal(L"parse", L"end", L"else");
  }

  void try_else()
  {
    traceNonterminal(L"try", L"start", L"else");
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
    traceNonterminal(L"try", L"end", L"else");
  }

  void parse_do()
  {
    traceNonterminal(L"parse", L"start", L"do");
    eventHandler->startNonterminal(L"do", e0);
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
    eventHandler->endNonterminal(L"do", e0);
    traceNonterminal(L"parse", L"end", L"do");
  }

  void try_do()
  {
    traceNonterminal(L"try", L"start", L"do");
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
    traceNonterminal(L"try", L"end", L"do");
  }

  void parse_while()
  {
    traceNonterminal(L"parse", L"start", L"while");
    eventHandler->startNonterminal(L"while", e0);
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
    eventHandler->endNonterminal(L"while", e0);
    traceNonterminal(L"parse", L"end", L"while");
  }

  void try_while()
  {
    traceNonterminal(L"try", L"start", L"while");
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
    traceNonterminal(L"try", L"end", L"while");
  }

  void parse_for()
  {
    traceNonterminal(L"parse", L"start", L"for");
    eventHandler->startNonterminal(L"for", e0);
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
    eventHandler->endNonterminal(L"for", e0);
    traceNonterminal(L"parse", L"end", L"for");
  }

  void try_for()
  {
    traceNonterminal(L"try", L"start", L"for");
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
    traceNonterminal(L"try", L"end", L"for");
  }

  void parse_foreach()
  {
    traceNonterminal(L"parse", L"start", L"foreach");
    eventHandler->startNonterminal(L"foreach", e0);
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
    eventHandler->endNonterminal(L"foreach", e0);
    traceNonterminal(L"parse", L"end", L"foreach");
  }

  void try_foreach()
  {
    traceNonterminal(L"try", L"start", L"foreach");
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
    traceNonterminal(L"try", L"end", L"foreach");
  }

  void parse_try()
  {
    traceNonterminal(L"parse", L"start", L"try");
    eventHandler->startNonterminal(L"try", e0);
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
    eventHandler->endNonterminal(L"try", e0);
    traceNonterminal(L"parse", L"end", L"try");
  }

  void try_try()
  {
    traceNonterminal(L"try", L"start", L"try");
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
    traceNonterminal(L"try", L"end", L"try");
  }

  void parse_test()
  {
    traceNonterminal(L"parse", L"start", L"test");
    eventHandler->startNonterminal(L"test", e0);
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
    eventHandler->endNonterminal(L"test", e0);
    traceNonterminal(L"parse", L"end", L"test");
  }

  void try_test()
  {
    traceNonterminal(L"try", L"start", L"test");
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
    traceNonterminal(L"try", L"end", L"test");
  }

  void parse_catch()
  {
    traceNonterminal(L"parse", L"start", L"catch");
    eventHandler->startNonterminal(L"catch", e0);
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
    eventHandler->endNonterminal(L"catch", e0);
    traceNonterminal(L"parse", L"end", L"catch");
  }

  void try_catch()
  {
    traceNonterminal(L"try", L"start", L"catch");
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
    traceNonterminal(L"try", L"end", L"catch");
  }

  void parse_break()
  {
    traceNonterminal(L"parse", L"start", L"break");
    eventHandler->startNonterminal(L"break", e0);
    consume(38);                    // 'break'
    eventHandler->endNonterminal(L"break", e0);
    traceNonterminal(L"parse", L"end", L"break");
  }

  void try_break()
  {
    traceNonterminal(L"try", L"start", L"break");
    consumeT(38);                   // 'break'
    traceNonterminal(L"try", L"end", L"break");
  }

  void parse_continue()
  {
    traceNonterminal(L"parse", L"start", L"continue");
    eventHandler->startNonterminal(L"continue", e0);
    consume(40);                    // 'continue'
    eventHandler->endNonterminal(L"continue", e0);
    traceNonterminal(L"parse", L"end", L"continue");
  }

  void try_continue()
  {
    traceNonterminal(L"try", L"start", L"continue");
    consumeT(40);                   // 'continue'
    traceNonterminal(L"try", L"end", L"continue");
  }

  void parse_return()
  {
    traceNonterminal(L"parse", L"start", L"return");
    eventHandler->startNonterminal(L"return", e0);
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
    eventHandler->endNonterminal(L"return", e0);
    traceNonterminal(L"parse", L"end", L"return");
  }

  void try_return()
  {
    traceNonterminal(L"try", L"start", L"return");
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
    traceNonterminal(L"try", L"end", L"return");
  }

  void parse_throw()
  {
    traceNonterminal(L"parse", L"start", L"throw");
    eventHandler->startNonterminal(L"throw", e0);
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
    eventHandler->endNonterminal(L"throw", e0);
    traceNonterminal(L"parse", L"end", L"throw");
  }

  void try_throw()
  {
    traceNonterminal(L"try", L"start", L"throw");
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
    traceNonterminal(L"try", L"end", L"throw");
  }

  void parse_expression()
  {
    traceNonterminal(L"parse", L"start", L"expression");
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
    eventHandler->endNonterminal(L"expression", e0);
    traceNonterminal(L"parse", L"end", L"expression");
  }

  void try_expression()
  {
    traceNonterminal(L"try", L"start", L"expression");
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
    traceNonterminal(L"try", L"end", L"expression");
  }

  void parse_arguments()
  {
    traceNonterminal(L"parse", L"start", L"arguments");
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
    traceNonterminal(L"parse", L"end", L"arguments");
  }

  void try_arguments()
  {
    traceNonterminal(L"try", L"start", L"arguments");
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
    traceNonterminal(L"try", L"end", L"arguments");
  }

  void parse_member()
  {
    traceNonterminal(L"parse", L"start", L"member");
    eventHandler->startNonterminal(L"member", e0);
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
        whitespace();
        parse_arguments();
        consume(36);                // ']'
      }
      break;
    }
    eventHandler->endNonterminal(L"member", e0);
    traceNonterminal(L"parse", L"end", L"member");
  }

  void try_member()
  {
    traceNonterminal(L"try", L"start", L"member");
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
    traceNonterminal(L"try", L"end", L"member");
  }

  void parse_array()
  {
    traceNonterminal(L"parse", L"start", L"array");
    eventHandler->startNonterminal(L"array", e0);
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
    eventHandler->endNonterminal(L"array", e0);
    traceNonterminal(L"parse", L"end", L"array");
  }

  void try_array()
  {
    traceNonterminal(L"try", L"start", L"array");
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
    traceNonterminal(L"try", L"end", L"array");
  }

  void parse_matrix()
  {
    traceNonterminal(L"parse", L"start", L"matrix");
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
    traceNonterminal(L"parse", L"end", L"matrix");
  }

  void try_matrix()
  {
    traceNonterminal(L"try", L"start", L"matrix");
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
    traceNonterminal(L"try", L"end", L"matrix");
  }

  void parse_element()
  {
    traceNonterminal(L"parse", L"start", L"element");
    eventHandler->startNonterminal(L"element", e0);
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
    whitespace();
    parse_expression();
    eventHandler->endNonterminal(L"element", e0);
    traceNonterminal(L"parse", L"end", L"element");
  }

  void try_element()
  {
    traceNonterminal(L"try", L"start", L"element");
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
    traceNonterminal(L"try", L"end", L"element");
  }

  void parse_key()
  {
    traceNonterminal(L"parse", L"start", L"key");
    eventHandler->startNonterminal(L"key", e0);
    consume(7);                     // string
    eventHandler->endNonterminal(L"key", e0);
    traceNonterminal(L"parse", L"end", L"key");
  }

  void try_key()
  {
    traceNonterminal(L"try", L"start", L"key");
    consumeT(7);                    // string
    traceNonterminal(L"try", L"end", L"key");
  }

  void parse_row()
  {
    traceNonterminal(L"parse", L"start", L"row");
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
    traceNonterminal(L"parse", L"end", L"row");
  }

  void try_row()
  {
    traceNonterminal(L"try", L"start", L"row");
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
    traceNonterminal(L"try", L"end", L"row");
  }

  void parse_column()
  {
    traceNonterminal(L"parse", L"start", L"column");
    eventHandler->startNonterminal(L"column", e0);
    parse_expression();
    eventHandler->endNonterminal(L"column", e0);
    traceNonterminal(L"parse", L"end", L"column");
  }

  void try_column()
  {
    traceNonterminal(L"try", L"start", L"column");
    try_expression();
    traceNonterminal(L"try", L"end", L"column");
  }

  void parse_parenthesizedExpression()
  {
    traceNonterminal(L"parse", L"start", L"parenthesizedExpression");
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
    traceNonterminal(L"parse", L"end", L"parenthesizedExpression");
  }

  void try_parenthesizedExpression()
  {
    traceNonterminal(L"try", L"start", L"parenthesizedExpression");
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    traceNonterminal(L"try", L"end", L"parenthesizedExpression");
  }

  void parse_value()
  {
    traceNonterminal(L"parse", L"start", L"value");
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
    eventHandler->endNonterminal(L"value", e0);
    traceNonterminal(L"parse", L"end", L"value");
  }

  void try_value()
  {
    traceNonterminal(L"try", L"start", L"value");
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
    traceNonterminal(L"try", L"end", L"value");
  }

  void traceNonterminal(const wchar_t *method, const wchar_t *occasion, const wchar_t *name)
  {
    fprintf(stderr, "  <%s %snonterminal=\"%s\"", Utf8Encoder::encode(method).c_str(), Utf8Encoder::encode(occasion).c_str(), Utf8Encoder::encode(name).c_str());
    if (l1 != 0)
      fprintf(stderr, " input=\"%s\"", Utf8Encoder::encode(xmlEscape(lookaheadString().c_str(), 0).c_str()).c_str());
    fprintf(stderr, "/>\n");
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
      fprintf(stderr, "  <parse terminal=\"%s\"%s%s%s/>\n", Utf8Encoder::encode(xmlEscape(TOKEN[t], 0).c_str()).c_str(), (l1 == 0 ? "" : " input=\""),  (l1 == 0 ? "" : Utf8Encoder::encode(xmlEscape(lookaheadString().c_str(), 0).c_str()).c_str()), (l1 == 0 ? "" : "\""));
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
      fprintf(stderr, "  <parse terminal=\"%s\"%s%s%s/>\n", Utf8Encoder::encode(xmlEscape(TOKEN[t], 0).c_str()).c_str(), (l1 == 0 ? "" : " input=\""),  (l1 == 0 ? "" : Utf8Encoder::encode(xmlEscape(lookaheadString().c_str(), 0).c_str()).c_str()), (l1 == 0 ? "" : "\""));
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
    fprintf(stderr, "  <tokenize tokenset=\"%d\">\n", tokenSetId);

    begin = end;
    int current = end;
    int result = INITIAL[tokenSetId];
    int state = 0;

    fprintf(stderr, "    <next state=\"%d\"", result & 255);
    for (int code = result & 255; code != 0; )
    {
      int charclass;
      int c0 = input[current];
      fprintf(stderr, " offset=\"%d\"", current);
      ++current;
      if (c0 < 0x80)
      {
        if (c0 >= 32 && c0 <= 126)
        {
          wchar_t c = (wchar_t) c0;
          fprintf(stderr, " char=\"%s\"", Utf8Encoder::encode(xmlEscape(&c, 1).c_str()).c_str());
        }
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
      fprintf(stderr, " codepoint=\"%d\" class=\"%d\"", c0, charclass);

      state = code;
      int i0 = (charclass << 8) + code - 1;
      code = TRANSITION[(i0 & 7) + TRANSITION[i0 >> 3]];
      if (code > 255)
      {
        result = code;
        fprintf(stderr, " result=\"%s\"", Utf8Encoder::encode(xmlEscape(TOKEN[((result >> 8) & 63) - 1], 0).c_str()).c_str());
        code &= 255;
        end = current;
      }
      fprintf(stderr, "/>\n");
      if (code != 0)
      {
        fprintf(stderr, "    <next state=\"%d\"", code);
      }
    }

    result >>= 8;
    if (result == 0)
    {
      end = current - 1;
      int c1 = input[end];
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      fprintf(stderr, "    <fail begin=\"%d\" end=\"%d\" state=\"%d\"/>\n", begin, end, state);
      fprintf(stderr, "  </tokenize>\n");
      return error(begin, end, state, -1, -1);
    }

    if (input[begin] == 0) end = begin;
    fprintf(stderr, "    <done result=\"%s\" begin=\"%d\" end=\"%d\"/>\n", Utf8Encoder::encode(xmlEscape(TOKEN[(result & 63) - 1], 0).c_str()).c_str(), begin, end);
    fprintf(stderr, "  </tokenize>\n");
    return (result & 63) - 1;
  }

  std::wstring lookaheadString()
  {
    std::wstring result;
    if (l1 > 0)
    {
      result += TOKEN[l1];
      if (l2 > 0)
      {
        result += L" ";
        result += TOKEN[l2];
        if (l3 > 0)
        {
          result += L" ";
          result += TOKEN[l3];
        }
      }
    }
    return result;
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

  static std::wstring xmlEscape(const wchar_t *string, size_t size)
  {
    std::wstring result;
    if (size == 0) size = wcslen(string);
    for (size_t i = 0; i < size; ++i)
    {
      const wchar_t c = string[i];
      switch (c)
      {
      case 0: break;
      case '&': result += L"&amp;"; break;
      case '<': result += L"&lt;"; break;
      case '"': result += L"&quot;"; break;
      default: result += c;
      }
    }
    return result;
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
/*   0 */ 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5,
/*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 9, 9,
/*  65 */ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9, 29, 30,
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
/* 157 */ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 9, 6, 6, 6,
/* 186 */ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9, 29, 30, 31, 32, 33,
/* 220 */ 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50, 51, 52, 9, 9, 9, 9, 9,
/* 250 */ 9, 9, 9, 53, 53, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
/* 286 */ 9
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
/* 1838 */ 42, 0, 0, 0, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1187, 1054, 0, 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 4146, 0,
/* 1863 */ 0, 0, 0, 768, 0, 0, 0, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608,
/* 1888 */ 4608, 4608, 0, 0, 0, 0, 3328, 49, 49, 3328, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 1054, 1054, 4864, 4864, 4864,
/* 1913 */ 4864, 0, 0, 0, 0, 4864, 0, 4864, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0, 86, 0, 86,
/* 1944 */ 0, 0, 86, 0, 86, 86, 86, 86, 0, 0, 0, 1072, 1072, 0, 0, 1088, 43, 43, 43, 5376, 43, 43, 43, 43, 5419, 5419,
/* 1970 */ 0, 0, 0, 0, 8960, 0, 2871, 0, 0, 42, 0, 0, 43, 0, 0, 0, 43, 43, 5376, 5376, 43, 126, 0, 0, 0, 0, 0, 0, 0,
/* 1999 */ 1183, 0, 154, 154, 43, 0, 0, 43, 0, 0, 0, 5120, 0, 0, 0, 0, 6912, 0, 0, 0, 5632, 5632, 5632, 5632, 0, 0, 0,
/* 2026 */ 0, 14979, 0, 0, 0, 44, 44, 44, 5888, 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 15616, 0, 0, 15616, 0, 42, 84,
/* 2052 */ 84, 43, 0, 0, 0, 43, 125, 43, 0, 0, 0, 154, 154, 43, 84, 0, 43, 0, 0, 0, 5632, 0, 0, 0, 5632, 5632, 0, 0,
/* 2080 */ 5632, 5632, 0, 0, 42, 0, 0, 87, 0, 0, 0, 121, 121, 121, 0, 0, 0, 121, 0, 0, 0, 0, 0, 0, 2871, 2871, 56, 56,
/* 2108 */ 56, 6400, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 42, 85, 2605, 2605, 1054, 1054,
/* 2132 */ 1054, 30, 1054, 1054, 1054, 0, 1054, 1185, 1054, 1054, 1054, 30, 1054, 1054, 1054, 1054, 1142, 152, 2687,
/* 2151 */ 1054, 1054, 1054, 0, 1054, 1054, 1054, 0, 1054, 1157, 1054, 153, 85, 155, 2716, 2718, 2687, 2718, 1054, 0, 0,
/* 2172 */ 85, 85, 0, 2684, 2605, 2605, 2605, 0, 2605, 2605, 2605, 2605, 0, 1054, 1054, 1054, 0, 1054, 1054, 11654, 153,
/* 2193 */ 155, 155, 2716, 2716, 2718, 1054, 1054, 1054, 1169, 1054, 1054, 1054, 1054, 1139, 1054, 1054, 1054, 0, 42,
/* 2212 */ 85, 2605, 2648, 1054, 1054, 1054, 1054, 1163, 1054, 1054, 1054, 1054, 1175, 1054, 1054, 0, 1184, 1054, 1054,
/* 2231 */ 1054, 1054, 0, 1054, 1054, 1094, 153, 122, 155, 2717, 2718, 2687, 2718, 1054, 0, 0, 85, 122, 0, 2684, 2648,
/* 2252 */ 174, 155, 155, 2717, 2717, 2718, 1054, 1054, 1054, 1191, 1054, 1054, 1054, 1054, 1054, 12062, 1054, 1054,
/* 2270 */ 6912, 0, 6912, 0, 0, 0, 6912, 0, 6912, 0, 6912, 6912, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0, 1056, 1056, 0,
/* 2294 */ 0, 1082, 0, 0, 7424, 0, 0, 0, 2871, 0, 0, 0, 6144, 0, 0, 0, 0, 44, 44, 5888, 5888, 44, 0, 0, 0, 7988, 0, 0,
/* 2322 */ 0, 0, 1058, 1058, 0, 0, 1058, 3584, 0, 7680, 8192, 8704, 0, 2871, 0, 0, 0, 7219, 0, 0, 0, 0, 1057, 1057, 0,
/* 2347 */ 0, 1083, 0, 0, 0, 8501, 0, 0, 0, 0, 1060, 1060, 0, 0, 1085, 0, 0, 0, 9216, 9216, 0, 0, 9216, 9216, 9216,
/* 2372 */ 9216, 9216, 9216, 9216, 9216, 0, 0, 0, 0, 0, 83, 0, 0, 0, 0, 0, 0, 14080, 0, 0, 0, 9472, 0, 0, 0, 9472, 0, 0,
/* 2400 */ 9472, 9472, 9472, 9472, 9472, 9472, 0, 0, 0, 0, 1062, 1062, 0, 0, 1087, 0, 0, 0, 9728, 0, 0, 0, 0, 1064,
/* 2424 */ 1064, 0, 0, 1089, 0, 42, 0, 0, 0, 1114, 1099, 1054, 0, 42, 0, 0, 0, 0, 0, 86, 0, 0, 86, 1054, 1093, 1054,
/* 2450 */ 1114, 1054, 1122, 1054, 1054, 1054, 1195, 1054, 1054, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 125, 1054, 1128, 1054,
/* 2472 */ 1054, 1054, 1054, 1054, 1054, 30, 1054, 1054, 1167, 1054, 1054, 1054, 1054, 1054, 1054, 1103, 1105, 1054,
/* 2490 */ 1200, 1054, 1054, 1054, 1054, 1054, 1054, 1104, 1054, 1054, 1054, 1215, 1054, 1054, 1054, 1054, 1054, 0,
/* 2508 */ 1054, 1209, 1055, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 1081, 1081, 1081, 0, 1081, 1081, 1081, 1081, 0, 1054, 1054,
/* 2531 */ 1054, 0, 1156, 1054, 1054, 1056, 0, 0, 0, 0, 0, 0, 0, 6144, 1082, 1082, 1082, 0, 1082, 1082, 1082, 1082,
/* 2553 */ 1090, 1082, 1082, 1082, 0, 1054, 1054, 1054, 1054, 1203, 1054, 1054, 1054, 1054, 10526, 1054, 1054, 12574,
/* 2571 */ 1054, 1054, 1168, 1054, 1054, 1054, 1054, 1172, 1057, 0, 0, 0, 0, 0, 0, 0, 154, 0, 0, 1083, 1083, 1083, 0,
/* 2594 */ 1083, 1083, 1083, 1083, 0, 1054, 1054, 1054, 1058, 1058, 1058, 0, 1058, 1058, 1058, 1058, 0, 0, 0, 0, 0, 0,
/* 2616 */ 0, 3840, 3840, 0, 0, 0, 0, 1058, 1091, 1058, 1058, 0, 1054, 1054, 1054, 1054, 12318, 1054, 1054, 1054, 1121,
/* 2637 */ 1054, 1115, 1054, 1054, 0, 42, 0, 0, 89, 1054, 1054, 1102, 1173, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 0,
/* 2659 */ 123, 0, 0, 89, 89, 123, 1822, 1054, 0, 123, 0, 89, 0, 0, 0, 1054, 1054, 0, 0, 1054, 1054, 1566, 0, 1054,
/* 2683 */ 1054, 1186, 1054, 1188, 1059, 0, 0, 0, 0, 0, 0, 0, 4146, 4146, 0, 0, 0, 0, 1084, 1084, 1084, 0, 1084, 1084,
/* 2707 */ 1084, 1084, 0, 1054, 1054, 1054, 82, 42, 0, 0, 0, 1054, 1054, 1103, 1127, 1054, 1054, 1054, 1054, 1054, 1054,
/* 2728 */ 1054, 30, 0, 11806, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0, 1060, 0, 0, 0, 0, 0, 0, 0, 5120, 5120,
/* 2751 */ 0, 0, 0, 0, 1085, 1085, 1085, 0, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054, 1143, 120, 0, 0, 0, 2304, 0, 0,
/* 2775 */ 0, 2605, 2605, 0, 0, 2605, 1194, 1060, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1054, 1054, 1054, 1199,
/* 2795 */ 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 1204, 1054, 1206, 1054, 1054, 0, 1054, 1054, 30, 0, 1054,
/* 2814 */ 1054, 1054, 1130, 1054, 1054, 1054, 1054, 146, 1054, 1171, 1054, 1210, 1054, 1054, 1054, 1054, 1054, 1054,
/* 2832 */ 1054, 1142, 1054, 1095, 1054, 1054, 1054, 1054, 1054, 1054, 1123, 1124, 1054, 1054, 1129, 1054, 1054, 1054,
/* 2850 */ 1054, 1134, 0, 1152, 1153, 1054, 0, 1054, 1054, 1054, 1138, 1054, 1054, 1054, 1054, 1054, 11177, 1054, 1054,
/* 2869 */ 1310, 1054, 0, 1054, 1054, 1054, 1054, 1054, 123, 1054, 1054, 1054, 1054, 1137, 1054, 1054, 1054, 1054, 1054,
/* 2888 */ 153, 1054, 1054, 1054, 1160, 1054, 1054, 1054, 1054, 1054, 1054, 1133, 1054, 1061, 0, 0, 0, 0, 0, 0, 0, 6400,
/* 2910 */ 6400, 56, 1086, 1086, 1086, 0, 1086, 1086, 1086, 1086, 0, 1054, 1054, 1054, 1054, 1136, 1054, 1054, 1054,
/* 2929 */ 1054, 1054, 1054, 1164, 1054, 1159, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 10270, 1054, 1205, 1054, 1054,
/* 2947 */ 30, 0, 1208, 1054, 1054, 1054, 1207, 1054, 0, 1054, 1054, 1154, 0, 1054, 1054, 1054, 1142, 1054, 1054, 1216,
/* 2967 */ 1054, 1054, 1054, 12830, 1054, 1054, 1054, 1054, 1054, 174, 1054, 1054, 30, 1054, 1097, 1054, 1054, 1054,
/* 2985 */ 1054, 1054, 1101, 1102, 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054, 1202, 1054, 1054, 1054, 1054, 1131,
/* 3005 */ 1054, 1054, 1054, 1054, 0, 1054, 1119, 10782, 1120, 1054, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054,
/* 3023 */ 1119, 1054, 1054, 1054, 1054, 1054, 1054, 1212, 1054, 1054, 1054, 1190, 1054, 1054, 1054, 1054, 1054, 1132,
/* 3041 */ 1054, 1054, 1054, 1214, 1054, 1054, 1054, 1054, 1054, 1054, 13854, 1054, 1054, 1211, 1054, 1054, 1054, 1054,
/* 3059 */ 1054, 1054, 1140, 1054, 1054, 1062, 0, 0, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 1087, 1087, 1087, 0, 1087, 1087,
/* 3083 */ 1087, 1087, 0, 1054, 1092, 1054, 0, 42, 0, 0, 0, 1054, 1054, 1116, 1118, 1054, 1054, 1054, 1054, 1054, 1054,
/* 3104 */ 1126, 111, 1054, 1054, 1054, 1054, 1054, 1141, 1054, 1054, 1054, 11294, 1054, 1054, 1054, 1054, 1054, 1197,
/* 3122 */ 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1142, 1054, 1054, 1213, 1063, 0, 0, 0, 0, 0, 0, 0, 7219, 7219, 0,
/* 3144 */ 0, 0, 0, 1088, 1088, 1088, 0, 1088, 1088, 1088, 1088, 0, 1054, 1054, 1054, 1054, 1054, 1161, 1054, 1054,
/* 3164 */ 1054, 1054, 1165, 1054, 13086, 1054, 1054, 1054, 1054, 1054, 1054, 1154, 1054, 1054, 1054, 1054, 1201, 1054,
/* 3182 */ 1054, 1054, 1054, 1054, 1197, 1054, 0, 1054, 1054, 1098, 1054, 1100, 1054, 1054, 1054, 1162, 1054, 1054,
/* 3200 */ 1054, 1054, 1054, 13598, 1054, 1054, 0, 42, 0, 0, 0, 1098, 1115, 1054, 1054, 1096, 1054, 1099, 1054, 1054,
/* 3220 */ 1054, 1054, 1192, 1054, 1054, 1054, 1054, 1196, 1054, 1054, 0, 1054, 1054, 1174, 1054, 1054, 1054, 1054, 0,
/* 3239 */ 1054, 1054, 1093, 1189, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 13824, 1064, 0, 0, 0, 0, 41, 0, 0, 0, 3840,
/* 3261 */ 0, 0, 0, 0, 121, 0, 0, 87, 1089, 1089, 1089, 0, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054, 0, 0, 0, 14080,
/* 3285 */ 14080, 0, 0, 14080, 14080, 14080, 0, 14080, 14080, 14080, 14080, 0, 0, 0, 0, 0, 0, 0, 14390, 0, 0, 0, 0,
/* 3308 */ 1070, 1070, 0, 0, 1084, 0, 0, 15104, 0, 0, 0, 0, 0, 7988, 7988, 0, 0, 0, 0, 0, 15360, 0, 0, 0, 15360, 0, 0,
/* 3335 */ 0, 0, 0, 8501, 8501, 0, 0, 0, 0, 15360, 15360, 15360, 15360, 0, 0, 0, 0, 1071, 1071, 0, 0, 1086, 15616,
/* 3358 */ 15616, 15616, 0, 15616, 15616, 15616, 15616, 0, 0, 0, 0
};

const int MaiaScript::EXPECTED[] =
{
/*   0 */ 96, 100, 104, 108, 112, 116, 120, 124, 134, 134, 163, 129, 139, 198, 135, 143, 134, 134, 134, 134, 162, 150,
/*  22 */ 129, 133, 134, 145, 134, 134, 134, 125, 149, 154, 131, 134, 134, 134, 134, 125, 149, 155, 134, 134, 134, 159,
/*  44 */ 134, 134, 134, 134, 211, 167, 177, 181, 188, 184, 192, 211, 211, 211, 210, 211, 211, 196, 173, 202, 206, 211,
/*  66 */ 211, 211, 209, 211, 211, 216, 220, 226, 230, 211, 211, 249, 211, 211, 170, 236, 222, 229, 211, 249, 211, 212,
/*  88 */ 236, 241, 248, 232, 245, 231, 237, 253, 2056, 133120, 264192, 33556480, 67110912, 2048, 2048, 8521728,
/* 104 */ 67373056, 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, 401400, 67248120, 139256,
/* 115 */ -33822720, 139260, 67510264, 67248120, 2498552, 69607416, 69607416, -41943048, -33554440, 2048, 8, 8, 8, 0,
/* 129 */ 768, 72, 24, 40, 0, 8, 8, 8, 8, 72, 8192, 65536, 805306368, (int) 0x80000000, 8, 24, 8, 40, 8, 8, 256, 256,
/* 151 */ 256, 768, 768, 768, 768, 768, 72, 8, 8, 256, 8, 8, 0, 128, 256, 768, 0, 2097152, 4194304, 0, 0, 67108864, 64,
/* 174 */ 256, 512, 28672, 0, 134217728, 16, 4194312, 272629768, 260046887, 125829175, 276820808, 276820808, 276820824,
/* 187 */ 276820824, 276820808, 276820808, 411038536, 125829183, 411038680, 411041624, 536867711, 536867711, 6,
/* 197 */ 117440512, 0, 0, 1024, 1024, 32768, 65536, 131072, 1835008, 2097152, 384, 3072, 0, 2097152, 0, 0, 0, 0, 64,
/* 216 */ 100663296, 64, 256, 12288, 16384, 65536, 131072, 262144, 524288, 2097152, 524288, 1048576, 2097152, 128, 3072,
/* 231 */ 0, 0, 0, 256, 8192, 256, 8192, 16384, 65536, 0, 131072, 524288, 2097152, 128, 16384, 65536, 131072, 2048, 0,
/* 250 */ 0, 0, 2097152, 256, 16384, 65536, 65536
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
