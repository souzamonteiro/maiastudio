// This file was generated on Mon Oct 26, 2020 10:04 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -backtrack -tree -trace -java -main

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Arrays;

public class MaiaScript
{
  public static void main(String args[]) throws Exception
  {
    if (args.length == 0)
    {
      System.out.println("Usage: java MaiaScript [-i] INPUT...");
      System.out.println();
      System.out.println("  parse INPUT, which is either a filename or literal text enclosed in curly braces");
      System.out.println();
      System.out.println("  Option:");
      System.out.println("    -i     indented parse tree");
    }
    else
    {
      boolean indent = false;
      for (String arg : args)
      {
        if (arg.equals("-i"))
        {
          indent = true;
          continue;
        }
        Writer w = new OutputStreamWriter(System.out, "UTF-8");
        XmlSerializer s = new XmlSerializer(w, indent);
        String input = read(arg);
        MaiaScript parser = new MaiaScript(input, s);
        try
        {
          parser.writeTrace("<?xml version=\"1.0\" encoding=\"UTF-8\"?" + ">\n<trace>\n");
          parser.parse_maiascript();
          parser.writeTrace("</trace>\n");
        }
        catch (ParseException pe)
        {
          throw new RuntimeException("ParseException while processing " + arg + ":\n" + parser.getErrorMessage(pe));
        }
        finally
        {
          parser.flushTrace();
          w.close();
        }
      }
    }
  }

  public static class ParseException extends RuntimeException
  {
    private static final long serialVersionUID = 1L;
    private int begin, end, offending, expected, state;

    public ParseException(int b, int e, int s, int o, int x)
    {
      begin = b;
      end = e;
      state = s;
      offending = o;
      expected = x;
    }

    @Override
    public String getMessage()
    {
      return offending < 0
           ? "lexical analysis failed"
           : "syntax error";
    }

    public void serialize(EventHandler eventHandler)
    {
    }

    public int getBegin() {return begin;}
    public int getEnd() {return end;}
    public int getState() {return state;}
    public int getOffending() {return offending;}
    public int getExpected() {return expected;}
    public boolean isAmbiguousInput() {return false;}
  }

  public interface EventHandler
  {
    public void reset(CharSequence string);
    public void startNonterminal(String name, int begin);
    public void endNonterminal(String name, int end);
    public void terminal(String name, int begin, int end);
    public void whitespace(int begin, int end);
  }

  public static class TopDownTreeBuilder implements EventHandler
  {
    private CharSequence input = null;
    private Nonterminal[] stack = new Nonterminal[64];
    private int top = -1;

    @Override
    public void reset(CharSequence input)
    {
      this.input = input;
      top = -1;
    }

    @Override
    public void startNonterminal(String name, int begin)
    {
      Nonterminal nonterminal = new Nonterminal(name, begin, begin, new Symbol[0]);
      if (top >= 0) addChild(nonterminal);
      if (++top >= stack.length) stack = Arrays.copyOf(stack, stack.length << 1);
      stack[top] = nonterminal;
    }

    @Override
    public void endNonterminal(String name, int end)
    {
      stack[top].end = end;
      if (top > 0) --top;
    }

    @Override
    public void terminal(String name, int begin, int end)
    {
      addChild(new Terminal(name, begin, end));
    }

    @Override
    public void whitespace(int begin, int end)
    {
    }

    private void addChild(Symbol s)
    {
      Nonterminal current = stack[top];
      current.children = Arrays.copyOf(current.children, current.children.length + 1);
      current.children[current.children.length - 1] = s;
    }

    public void serialize(EventHandler e)
    {
      e.reset(input);
      stack[0].send(e);
    }
  }

  public static abstract class Symbol
  {
    public String name;
    public int begin;
    public int end;

    protected Symbol(String name, int begin, int end)
    {
      this.name = name;
      this.begin = begin;
      this.end = end;
    }

    public abstract void send(EventHandler e);
  }

  public static class Terminal extends Symbol
  {
    public Terminal(String name, int begin, int end)
    {
      super(name, begin, end);
    }

    @Override
    public void send(EventHandler e)
    {
      e.terminal(name, begin, end);
    }
  }

  public static class Nonterminal extends Symbol
  {
    public Symbol[] children;

    public Nonterminal(String name, int begin, int end, Symbol[] children)
    {
      super(name, begin, end);
      this.children = children;
    }

    @Override
    public void send(EventHandler e)
    {
      e.startNonterminal(name, begin);
      int pos = begin;
      for (Symbol c : children)
      {
        if (pos < c.begin) e.whitespace(pos, c.begin);
        c.send(e);
        pos = c.end;
      }
      if (pos < end) e.whitespace(pos, end);
      e.endNonterminal(name, end);
    }
  }

  public static class XmlSerializer implements EventHandler
  {
    private CharSequence input;
    private String delayedTag;
    private Writer out;
    private boolean indent;
    private boolean hasChildElement;
    private int depth;

    public XmlSerializer(Writer w, boolean indent)
    {
      input = null;
      delayedTag = null;
      out = w;
      this.indent = indent;
    }

    @Override
    public void reset(CharSequence string)
    {
      writeOutput("<?xml version=\"1.0\" encoding=\"UTF-8\"?" + ">");
      input = string;
      delayedTag = null;
      hasChildElement = false;
      depth = 0;
    }

    @Override
    public void startNonterminal(String name, int begin)
    {
      if (delayedTag != null)
      {
        writeOutput("<");
        writeOutput(delayedTag);
        writeOutput(">");
      }
      delayedTag = name;
      if (indent)
      {
        writeOutput("\n");
        for (int i = 0; i < depth; ++i)
        {
          writeOutput("  ");
        }
      }
      hasChildElement = false;
      ++depth;
    }

    @Override
    public void endNonterminal(String name, int end)
    {
      --depth;
      if (delayedTag != null)
      {
        delayedTag = null;
        writeOutput("<");
        writeOutput(name);
        writeOutput("/>");
      }
      else
      {
        if (indent)
        {
          if (hasChildElement)
          {
            writeOutput("\n");
            for (int i = 0; i < depth; ++i)
            {
              writeOutput("  ");
            }
          }
        }
        writeOutput("</");
        writeOutput(name);
        writeOutput(">");
      }
      hasChildElement = true;
    }

    @Override
    public void terminal(String name, int begin, int end)
    {
      if (name.charAt(0) == '\'')
      {
        name = "TOKEN";
      }
      startNonterminal(name, begin);
      characters(begin, end);
      endNonterminal(name, end);
    }

    @Override
    public void whitespace(int begin, int end)
    {
      characters(begin, end);
    }

    private void characters(int begin, int end)
    {
      if (begin < end)
      {
        if (delayedTag != null)
        {
          writeOutput("<");
          writeOutput(delayedTag);
          writeOutput(">");
          delayedTag = null;
        }
        writeOutput(input.subSequence(begin, end)
                         .toString()
                         .replace("&", "&amp;")
                         .replace("<", "&lt;")
                         .replace(">", "&gt;"));
      }
    }

    public void writeOutput(String content)
    {
      try
      {
        out.write(content);
      }
      catch (IOException e)
      {
        throw new RuntimeException(e);
      }
    }
  }

  private static String read(String input) throws Exception
  {
    if (input.startsWith("{") && input.endsWith("}"))
    {
      return input.substring(1, input.length() - 1);
    }
    else
    {
      byte buffer[] = new byte[(int) new java.io.File(input).length()];
      java.io.FileInputStream stream = new java.io.FileInputStream(input);
      stream.read(buffer);
      stream.close();
      String content = new String(buffer, System.getProperty("file.encoding"));
      return content.length() > 0 && content.charAt(0) == '\uFEFF'
           ? content.substring(1)
           : content;
    }
  }

  public MaiaScript(CharSequence string, EventHandler t)
  {
    initialize(string, t);
  }

  public void initialize(CharSequence source, EventHandler parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = source;
    size = source.length();
    reset(0, 0, 0);
  }

  public CharSequence getInput()
  {
    return input;
  }

  public int getTokenOffset()
  {
    return b0;
  }

  public int getTokenEnd()
  {
    return e0;
  }

  public final void reset(int l, int b, int e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    l2 = 0; b2 = 0; e2 = 0;
    l3 = 0; b3 = 0; e3 = 0;
    end = e;
    ex = -1;
    memo.clear();
    eventHandler.reset(input);
  }

  public void reset()
  {
    reset(0, 0, 0);
  }

  public static String getOffendingToken(ParseException e)
  {
    return e.getOffending() < 0 ? null : TOKEN[e.getOffending()];
  }

  public static String[] getExpectedTokenSet(ParseException e)
  {
    String[] expected;
    if (e.getExpected() >= 0)
    {
      expected = new String[]{TOKEN[e.getExpected()]};
    }
    else
    {
      expected = getTokenSet(- e.getState());
    }
    return expected;
  }

  public String getErrorMessage(ParseException e)
  {
    String message = e.getMessage();
    String[] tokenSet = getExpectedTokenSet(e);
    String found = getOffendingToken(e);
    int size = e.getEnd() - e.getBegin();
    message += (found == null ? "" : ", found " + found)
            + "\nwhile expecting "
            + (tokenSet.length == 1 ? tokenSet[0] : java.util.Arrays.toString(tokenSet))
            + "\n"
            + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ");
    String prefix = input.subSequence(0, e.getBegin()).toString();
    int line = prefix.replaceAll("[^\n]", "").length() + 1;
    int column = prefix.length() - prefix.lastIndexOf('\n');
    return message
         + "at line " + line + ", column " + column + ":\n..."
         + input.subSequence(e.getBegin(), Math.min(input.length(), e.getBegin() + 64))
         + "...";
  }

  public void parse_maiascript()
  {
    traceNonterminal("parse", "start", "maiascript");
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
    traceNonterminal("parse", "end", "maiascript");
    flushTrace();
  }

  private void parse_operation()
  {
    traceNonterminal("parse", "start", "operation");
    eventHandler.startNonterminal("operation", e0);
    parse_variableAssignment();
    eventHandler.endNonterminal("operation", e0);
    traceNonterminal("parse", "end", "operation");
  }

  private void try_operation()
  {
    traceNonterminal("try", "start", "operation");
    try_variableAssignment();
    traceNonterminal("try", "end", "operation");
  }

  private void parse_variableAssignment()
  {
    traceNonterminal("parse", "start", "variableAssignment");
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
    traceNonterminal("parse", "end", "variableAssignment");
  }

  private void try_variableAssignment()
  {
    traceNonterminal("try", "start", "variableAssignment");
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
    traceNonterminal("try", "end", "variableAssignment");
  }

  private void parse_logicalORExpression()
  {
    traceNonterminal("parse", "start", "logicalORExpression");
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
    traceNonterminal("parse", "end", "logicalORExpression");
  }

  private void try_logicalORExpression()
  {
    traceNonterminal("try", "start", "logicalORExpression");
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
    traceNonterminal("try", "end", "logicalORExpression");
  }

  private void parse_logicalXORExpression()
  {
    traceNonterminal("parse", "start", "logicalXORExpression");
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
    traceNonterminal("parse", "end", "logicalXORExpression");
  }

  private void try_logicalXORExpression()
  {
    traceNonterminal("try", "start", "logicalXORExpression");
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
    traceNonterminal("try", "end", "logicalXORExpression");
  }

  private void parse_logicalANDExpression()
  {
    traceNonterminal("parse", "start", "logicalANDExpression");
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
    traceNonterminal("parse", "end", "logicalANDExpression");
  }

  private void try_logicalANDExpression()
  {
    traceNonterminal("try", "start", "logicalANDExpression");
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
    traceNonterminal("try", "end", "logicalANDExpression");
  }

  private void parse_bitwiseORExpression()
  {
    traceNonterminal("parse", "start", "bitwiseORExpression");
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
    traceNonterminal("parse", "end", "bitwiseORExpression");
  }

  private void try_bitwiseORExpression()
  {
    traceNonterminal("try", "start", "bitwiseORExpression");
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
    traceNonterminal("try", "end", "bitwiseORExpression");
  }

  private void parse_bitwiseXORExpression()
  {
    traceNonterminal("parse", "start", "bitwiseXORExpression");
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
    traceNonterminal("parse", "end", "bitwiseXORExpression");
  }

  private void try_bitwiseXORExpression()
  {
    traceNonterminal("try", "start", "bitwiseXORExpression");
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
    traceNonterminal("try", "end", "bitwiseXORExpression");
  }

  private void parse_bitwiseANDExpression()
  {
    traceNonterminal("parse", "start", "bitwiseANDExpression");
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
    traceNonterminal("parse", "end", "bitwiseANDExpression");
  }

  private void try_bitwiseANDExpression()
  {
    traceNonterminal("try", "start", "bitwiseANDExpression");
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
    traceNonterminal("try", "end", "bitwiseANDExpression");
  }

  private void parse_equalityExpression()
  {
    traceNonterminal("parse", "start", "equalityExpression");
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
    traceNonterminal("parse", "end", "equalityExpression");
  }

  private void try_equalityExpression()
  {
    traceNonterminal("try", "start", "equalityExpression");
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
    traceNonterminal("try", "end", "equalityExpression");
  }

  private void parse_relationalExpression()
  {
    traceNonterminal("parse", "start", "relationalExpression");
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
    traceNonterminal("parse", "end", "relationalExpression");
  }

  private void try_relationalExpression()
  {
    traceNonterminal("try", "start", "relationalExpression");
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
    traceNonterminal("try", "end", "relationalExpression");
  }

  private void parse_shiftExpression()
  {
    traceNonterminal("parse", "start", "shiftExpression");
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
    traceNonterminal("parse", "end", "shiftExpression");
  }

  private void try_shiftExpression()
  {
    traceNonterminal("try", "start", "shiftExpression");
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
    traceNonterminal("try", "end", "shiftExpression");
  }

  private void parse_additiveExpression()
  {
    traceNonterminal("parse", "start", "additiveExpression");
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
    traceNonterminal("parse", "end", "additiveExpression");
  }

  private void try_additiveExpression()
  {
    traceNonterminal("try", "start", "additiveExpression");
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
    traceNonterminal("try", "end", "additiveExpression");
  }

  private void parse_multiplicativeExpression()
  {
    traceNonterminal("parse", "start", "multiplicativeExpression");
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
    traceNonterminal("parse", "end", "multiplicativeExpression");
  }

  private void try_multiplicativeExpression()
  {
    traceNonterminal("try", "start", "multiplicativeExpression");
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
    traceNonterminal("try", "end", "multiplicativeExpression");
  }

  private void parse_powerExpression()
  {
    traceNonterminal("parse", "start", "powerExpression");
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
    traceNonterminal("parse", "end", "powerExpression");
  }

  private void try_powerExpression()
  {
    traceNonterminal("try", "start", "powerExpression");
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
    traceNonterminal("try", "end", "powerExpression");
  }

  private void parse_unaryExpression()
  {
    traceNonterminal("parse", "start", "unaryExpression");
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
    traceNonterminal("parse", "end", "unaryExpression");
  }

  private void try_unaryExpression()
  {
    traceNonterminal("try", "start", "unaryExpression");
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
    traceNonterminal("try", "end", "unaryExpression");
  }

  private void parse_primary()
  {
    traceNonterminal("parse", "start", "primary");
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
    traceNonterminal("parse", "end", "primary");
  }

  private void try_primary()
  {
    traceNonterminal("try", "start", "primary");
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
    traceNonterminal("try", "end", "primary");
  }

  private void parse_statement()
  {
    traceNonterminal("parse", "start", "statement");
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
    traceNonterminal("parse", "end", "statement");
  }

  private void try_statement()
  {
    traceNonterminal("try", "start", "statement");
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
    traceNonterminal("try", "end", "statement");
  }

  private void parse_namespace()
  {
    traceNonterminal("parse", "start", "namespace");
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
    traceNonterminal("parse", "end", "namespace");
  }

  private void try_namespace()
  {
    traceNonterminal("try", "start", "namespace");
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
    traceNonterminal("try", "end", "namespace");
  }

  private void parse_function()
  {
    traceNonterminal("parse", "start", "function");
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
    traceNonterminal("parse", "end", "function");
  }

  private void try_function()
  {
    traceNonterminal("try", "start", "function");
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
    traceNonterminal("try", "end", "function");
  }

  private void parse_if()
  {
    traceNonterminal("parse", "start", "if");
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
    traceNonterminal("parse", "end", "if");
  }

  private void try_if()
  {
    traceNonterminal("try", "start", "if");
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
    traceNonterminal("try", "end", "if");
  }

  private void parse_elseif()
  {
    traceNonterminal("parse", "start", "elseif");
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
    traceNonterminal("parse", "end", "elseif");
  }

  private void try_elseif()
  {
    traceNonterminal("try", "start", "elseif");
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
    traceNonterminal("try", "end", "elseif");
  }

  private void parse_else()
  {
    traceNonterminal("parse", "start", "else");
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
    traceNonterminal("parse", "end", "else");
  }

  private void try_else()
  {
    traceNonterminal("try", "start", "else");
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
    traceNonterminal("try", "end", "else");
  }

  private void parse_do()
  {
    traceNonterminal("parse", "start", "do");
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
    traceNonterminal("parse", "end", "do");
  }

  private void try_do()
  {
    traceNonterminal("try", "start", "do");
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
    traceNonterminal("try", "end", "do");
  }

  private void parse_while()
  {
    traceNonterminal("parse", "start", "while");
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
    traceNonterminal("parse", "end", "while");
  }

  private void try_while()
  {
    traceNonterminal("try", "start", "while");
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
    traceNonterminal("try", "end", "while");
  }

  private void parse_for()
  {
    traceNonterminal("parse", "start", "for");
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
    traceNonterminal("parse", "end", "for");
  }

  private void try_for()
  {
    traceNonterminal("try", "start", "for");
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
    traceNonterminal("try", "end", "for");
  }

  private void parse_foreach()
  {
    traceNonterminal("parse", "start", "foreach");
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
    traceNonterminal("parse", "end", "foreach");
  }

  private void try_foreach()
  {
    traceNonterminal("try", "start", "foreach");
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
    traceNonterminal("try", "end", "foreach");
  }

  private void parse_try()
  {
    traceNonterminal("parse", "start", "try");
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
    traceNonterminal("parse", "end", "try");
  }

  private void try_try()
  {
    traceNonterminal("try", "start", "try");
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
    traceNonterminal("try", "end", "try");
  }

  private void parse_test()
  {
    traceNonterminal("parse", "start", "test");
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
    traceNonterminal("parse", "end", "test");
  }

  private void try_test()
  {
    traceNonterminal("try", "start", "test");
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
    traceNonterminal("try", "end", "test");
  }

  private void parse_catch()
  {
    traceNonterminal("parse", "start", "catch");
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
    traceNonterminal("parse", "end", "catch");
  }

  private void try_catch()
  {
    traceNonterminal("try", "start", "catch");
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
    traceNonterminal("try", "end", "catch");
  }

  private void parse_break()
  {
    traceNonterminal("parse", "start", "break");
    eventHandler.startNonterminal("break", e0);
    consume(38);                    // 'break'
    eventHandler.endNonterminal("break", e0);
    traceNonterminal("parse", "end", "break");
  }

  private void try_break()
  {
    traceNonterminal("try", "start", "break");
    consumeT(38);                   // 'break'
    traceNonterminal("try", "end", "break");
  }

  private void parse_continue()
  {
    traceNonterminal("parse", "start", "continue");
    eventHandler.startNonterminal("continue", e0);
    consume(40);                    // 'continue'
    eventHandler.endNonterminal("continue", e0);
    traceNonterminal("parse", "end", "continue");
  }

  private void try_continue()
  {
    traceNonterminal("try", "start", "continue");
    consumeT(40);                   // 'continue'
    traceNonterminal("try", "end", "continue");
  }

  private void parse_return()
  {
    traceNonterminal("parse", "start", "return");
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
    traceNonterminal("parse", "end", "return");
  }

  private void try_return()
  {
    traceNonterminal("try", "start", "return");
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
    traceNonterminal("try", "end", "return");
  }

  private void parse_throw()
  {
    traceNonterminal("parse", "start", "throw");
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
    traceNonterminal("parse", "end", "throw");
  }

  private void try_throw()
  {
    traceNonterminal("try", "start", "throw");
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
    traceNonterminal("try", "end", "throw");
  }

  private void parse_expression()
  {
    traceNonterminal("parse", "start", "expression");
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
    traceNonterminal("parse", "end", "expression");
  }

  private void try_expression()
  {
    traceNonterminal("try", "start", "expression");
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
    traceNonterminal("try", "end", "expression");
  }

  private void parse_arguments()
  {
    traceNonterminal("parse", "start", "arguments");
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
    traceNonterminal("parse", "end", "arguments");
  }

  private void try_arguments()
  {
    traceNonterminal("try", "start", "arguments");
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
    traceNonterminal("try", "end", "arguments");
  }

  private void parse_member()
  {
    traceNonterminal("parse", "start", "member");
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
        catch (ParseException p1A)
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
            catch (ParseException p1B)
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
    traceNonterminal("parse", "end", "member");
  }

  private void try_member()
  {
    traceNonterminal("try", "start", "member");
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
        catch (ParseException p1A)
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
            catch (ParseException p1B)
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
    traceNonterminal("try", "end", "member");
  }

  private void parse_array()
  {
    traceNonterminal("parse", "start", "array");
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
    traceNonterminal("parse", "end", "array");
  }

  private void try_array()
  {
    traceNonterminal("try", "start", "array");
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
    traceNonterminal("try", "end", "array");
  }

  private void parse_matrix()
  {
    traceNonterminal("parse", "start", "matrix");
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
    traceNonterminal("parse", "end", "matrix");
  }

  private void try_matrix()
  {
    traceNonterminal("try", "start", "matrix");
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
    traceNonterminal("try", "end", "matrix");
  }

  private void parse_element()
  {
    traceNonterminal("parse", "start", "element");
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
    traceNonterminal("parse", "end", "element");
  }

  private void try_element()
  {
    traceNonterminal("try", "start", "element");
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
    traceNonterminal("try", "end", "element");
  }

  private void parse_key()
  {
    traceNonterminal("parse", "start", "key");
    eventHandler.startNonterminal("key", e0);
    consume(7);                     // string
    eventHandler.endNonterminal("key", e0);
    traceNonterminal("parse", "end", "key");
  }

  private void try_key()
  {
    traceNonterminal("try", "start", "key");
    consumeT(7);                    // string
    traceNonterminal("try", "end", "key");
  }

  private void parse_row()
  {
    traceNonterminal("parse", "start", "row");
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
    traceNonterminal("parse", "end", "row");
  }

  private void try_row()
  {
    traceNonterminal("try", "start", "row");
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
    traceNonterminal("try", "end", "row");
  }

  private void parse_column()
  {
    traceNonterminal("parse", "start", "column");
    eventHandler.startNonterminal("column", e0);
    parse_expression();
    eventHandler.endNonterminal("column", e0);
    traceNonterminal("parse", "end", "column");
  }

  private void try_column()
  {
    traceNonterminal("try", "start", "column");
    try_expression();
    traceNonterminal("try", "end", "column");
  }

  private void parse_parenthesizedExpression()
  {
    traceNonterminal("parse", "start", "parenthesizedExpression");
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
    traceNonterminal("parse", "end", "parenthesizedExpression");
  }

  private void try_parenthesizedExpression()
  {
    traceNonterminal("try", "start", "parenthesizedExpression");
    consumeT(17);                   // '('
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
    lookahead1W(2);                 // whitespace^token | ')'
    consumeT(18);                   // ')'
    traceNonterminal("try", "end", "parenthesizedExpression");
  }

  private void parse_value()
  {
    traceNonterminal("parse", "start", "value");
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
    traceNonterminal("parse", "end", "value");
  }

  private void try_value()
  {
    traceNonterminal("try", "start", "value");
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
    traceNonterminal("try", "end", "value");
  }

  private void traceNonterminal(String method, String occasion, String name)
  {
    writeTrace("  <" + method + " " + occasion + "nonterminal=\"" + name + "\"" + (l1 == 0 ? "" : " input=\"" + xmlEscape(lookaheadString()) + "\"") + "/>\n");
  }

  private void consume(int t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(TOKEN[l1], b1, e1);
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
      writeTrace("  <parse terminal=\"" + xmlEscape(TOKEN[t]) + "\"" + (l1 == 0 ? "" : " input=\"" + xmlEscape(lookaheadString()) + "\"") + "/>\n");
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  private void consumeT(int t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
      writeTrace("  <parse terminal=\"" + xmlEscape(TOKEN[t]) + "\"" + (l1 == 0 ? "" : " input=\"" + xmlEscape(lookaheadString()) + "\"") + "/>\n");
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  private void whitespace()
  {
    if (e0 != b1)
    {
      eventHandler.whitespace(e0, b1);
      e0 = b1;
    }
  }

  private int matchW(int tokenSetId)
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

  private void lookahead1W(int tokenSetId)
  {
    if (l1 == 0)
    {
      l1 = matchW(tokenSetId);
      b1 = begin;
      e1 = end;
    }
  }

  private void lookahead2W(int tokenSetId)
  {
    if (l2 == 0)
    {
      l2 = matchW(tokenSetId);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 6) | l1;
  }

  private void lookahead3W(int tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = matchW(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 12;
  }

  private int error(int b, int e, int s, int l, int t)
  {
    if (e >= ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    flushTrace();
    throw new ParseException(bx, ex, sx, lx, tx);
  }

  private String lookaheadString()
  {
    String result = "";
    if (l1 > 0)
    {
      result += TOKEN[l1];
      if (l2 > 0)
      {
        result += " " + TOKEN[l2];
        if (l3 > 0)
        {
          result += " " + TOKEN[l3];
        }
      }
    }
    return result;
  }

  private void memoize(int i, int e, int v)
  {
    memo.put((e << 1) + i, v);
  }

  private int memoized(int i, int e)
  {
    Integer v = memo.get((e << 1) + i);
    return v == null ? 0 : v;
  }

  private int lk, b0, e0;
  private int l1, b1, e1;
  private int l2, b2, e2;
  private int l3, b3, e3;
  private int bx, ex, sx, lx, tx;
  private EventHandler eventHandler = null;
  private java.util.Map<Integer, Integer> memo = new java.util.HashMap<Integer, Integer>();
  private CharSequence input = null;
  private int size = 0;
  private int begin = 0;
  private int end = 0;
  private java.io.Writer err;
  {
    try
    {
      err = new java.io.OutputStreamWriter(System.err, "UTF-8");
    }
    catch (java.io.UnsupportedEncodingException uee)
    {}
  }

  private int match(int tokenSetId)
  {
    writeTrace("  <tokenize tokenset=\"" + tokenSetId + "\">\n");

    begin = end;
    int current = end;
    int result = INITIAL[tokenSetId];
    int state = 0;

    writeTrace("    <next state=\"" + (result & 255) + "\"");
    for (int code = result & 255; code != 0; )
    {
      int charclass;
      int c0 = current < size ? input.charAt(current) : 0;
      writeTrace(" offset=\"" + current + "\"");
      ++current;
      if (c0 < 0x80)
      {
        if (c0 >= 32 && c0 <= 126)
        {
          writeTrace(" char=\"" + xmlEscape(String.valueOf((char) c0)) + "\"");
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
          int c1 = current < size ? input.charAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
          }
        }

        int lo = 0, hi = 1;
        for (int m = 1; ; m = (hi + lo) >> 1)
        {
          if (MAP2[m] > c0) {hi = m - 1;}
          else if (MAP2[2 + m] < c0) {lo = m + 1;}
          else {charclass = MAP2[4 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }
      writeTrace(" codepoint=\"" + c0 + "\" class=\"" + charclass + "\"");

      state = code;
      int i0 = (charclass << 8) + code - 1;
      code = TRANSITION[(i0 & 7) + TRANSITION[i0 >> 3]];

      if (code > 255)
      {
        result = code;
        writeTrace(" result=\"" + xmlEscape(TOKEN[((result >> 8) & 63) - 1]) + "\"");
        code &= 255;
        end = current;
      }
      writeTrace("/>\n");
      if (code != 0)
      {
        writeTrace("    <next state=\"" + code + "\"");
      }
    }

    result >>= 8;
    if (result == 0)
    {
      end = current - 1;
      int c1 = end < size ? input.charAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000)
      {
        --end;
      }
      writeTrace("    <fail begin=\"" + begin + "\" end=\"" + end + "\" state=\"" + state + "\"/>\n");
      writeTrace("  </tokenize>\n");
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    writeTrace("    <done result=\"" + xmlEscape(TOKEN[(result & 63) - 1]) + "\" begin=\"" + begin + "\" end=\"" + end + "\"/>\n");
    writeTrace("  </tokenize>\n");
    return (result & 63) - 1;
  }

  private static String xmlEscape(String s)
  {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); ++i)
    {
      char c = s.charAt(i);
      switch (c)
      {
      case '<': sb.append("&lt;"); break;
      case '"': sb.append("&quot;"); break;
      case '&': sb.append("&amp;"); break;
      default : sb.append(c); break;
      }
    }
    return sb.toString();
  }

  public void setTraceWriter(java.io.Writer w)
  {
    err = w;
  }

  private void writeTrace(String content)
  {
    try
    {
      err.write(content);
    }
    catch (java.io.IOException e)
    {
      throw new RuntimeException(e);
    }
  }

  private void flushTrace()
  {
    try
    {
      err.flush();
    }
    catch (java.io.IOException e)
    {
      throw new RuntimeException(e);
    }
  }

  private static String[] getTokenSet(int tokenSetId)
  {
    java.util.ArrayList<String> expected = new java.util.ArrayList<>();
    int s = tokenSetId < 0 ? - tokenSetId : INITIAL[tokenSetId] & 255;
    for (int i = 0; i < 61; i += 32)
    {
      int j = i;
      int i0 = (i >> 5) * 192 + s - 1;
      int f = EXPECTED[(i0 & 3) + EXPECTED[i0 >> 2]];
      for ( ; f != 0; f >>>= 1, ++j)
      {
        if ((f & 1) != 0)
        {
          expected.add(TOKEN[j]);
        }
      }
    }
    return expected.toArray(new String[]{});
  }

  private static final int[] MAP0 =
  {
    /*   0 */ 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4,
    /*  35 */ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24,
    /*  63 */ 9, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 9,
    /*  97 */ 29, 30, 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6, 47, 6, 48, 6, 49, 50,
    /* 125 */ 51, 52, 9
  };

  private static final int[] MAP1 =
  {
    /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
    /*  26 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
    /*  52 */ 87, 87, 119, 151, 182, 214, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    /*  73 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 245, 255, 255, 255, 255, 255, 255, 255,
    /*  94 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    /* 115 */ 255, 255, 255, 255, 54, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    /* 147 */ 0, 0, 0, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    /* 176 */ 19, 20, 21, 22, 23, 24, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    /* 209 */ 25, 26, 27, 28, 6, 9, 29, 30, 31, 32, 33, 34, 6, 35, 36, 6, 37, 38, 39, 40, 41, 42, 6, 43, 44, 45, 46, 6,
    /* 237 */ 47, 6, 48, 6, 49, 50, 51, 52, 9, 9, 9, 9, 9, 9, 9, 9, 53, 53, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    /* 270 */ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
  };

  private static final int[] MAP2 =
  {
    /* 0 */ 57344, 65536, 65533, 1114111, 9, 9
  };

  private static final int[] INITIAL =
  {
    /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 528, 17, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
    /* 28 */ 540
  };

  private static final int[] TRANSITION =
  {
    /*    0 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*   17 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1760, 1760,
    /*   34 */ 1760, 1763, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*   51 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1760, 1760, 1760, 1763,
    /*   68 */ 2460, 1932, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*   85 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1890, 1771, 1777, 2460, 1932,
    /*  102 */ 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  119 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1926, 1792, 1796, 2460, 1811, 2512, 2460,
    /*  136 */ 2460, 2460, 1931, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  153 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2511, 1821, 1825, 2460, 1932, 2512, 2460, 2460, 2460,
    /*  170 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  187 */ 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2732, 2732, 2459, 1841,
    /*  204 */ 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460,
    /*  221 */ 2460, 2460, 2460, 2460, 2612, 3257, 2615, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  238 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  255 */ 2460, 2460, 2690, 1858, 2693, 2460, 1932, 1851, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  272 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  289 */ 2460, 2460, 2460, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  306 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1870, 1874, 1882,
    /*  323 */ 1886, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  340 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1898, 1900, 1913, 1910, 2460,
    /*  357 */ 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  374 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2744, 2007, 2747, 2460, 1921, 2512,
    /*  391 */ 2460, 2460, 2460, 2439, 2460, 2460, 2460, 2460, 1940, 2460, 2460, 2460, 1946, 2460, 2438, 2460, 2460,
    /*  408 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1983, 1960, 1966, 2460, 1978, 2512, 2460, 2460,
    /*  425 */ 2460, 2461, 1991, 2460, 2460, 2460, 2000, 2460, 2460, 2460, 2054, 2460, 2582, 2460, 2460, 2460, 2460,
    /*  442 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2075, 2069, 2019, 2460, 1932, 2512, 2460, 2460, 2460, 2460,
    /*  459 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  476 */ 2460, 2460, 2460, 2460, 2460, 2308, 2031, 2037, 2460, 2049, 2512, 2460, 2460, 2460, 2461, 1991, 2460,
    /*  493 */ 2460, 2460, 2062, 2460, 2460, 2460, 2054, 2460, 2582, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  510 */ 2460, 2460, 2537, 2460, 2303, 2303, 2460, 2083, 2512, 2460, 2460, 2460, 3261, 2460, 2460, 2460, 2460,
    /*  527 */ 2096, 2460, 2460, 2460, 2088, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  544 */ 2460, 2904, 2106, 2112, 2460, 1932, 2098, 2460, 2460, 2460, 1931, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  561 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2773,
    /*  578 */ 2176, 2180, 2732, 2125, 2512, 2732, 2732, 2732, 2169, 2150, 2732, 2732, 2733, 2162, 2786, 2732, 2733,
    /*  595 */ 2192, 2732, 2883, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2773, 2176, 2180,
    /*  612 */ 2732, 2210, 2512, 2732, 2732, 2732, 2244, 2150, 2732, 2732, 2733, 2237, 2786, 2732, 2733, 2252, 2732,
    /*  629 */ 2971, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3069, 3067, 2460, 2460, 2460, 1932,
    /*  646 */ 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  663 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2011, 2270, 2275, 2283, 2460, 1932, 2512, 2460,
    /*  680 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  697 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3136, 2336, 3139, 2460, 1932, 2296, 2460, 2460, 2460,
    /*  714 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  731 */ 2460, 2460, 2460, 2460, 2460, 2460, 3316, 2316, 3319, 2460, 1932, 2329, 2460, 2460, 2460, 2460, 2460,
    /*  748 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  765 */ 2460, 2460, 2460, 2460, 3333, 2349, 3336, 2460, 1932, 1970, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  782 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  799 */ 2460, 2460, 2362, 2369, 2373, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  816 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  833 */ 2460, 2460, 2460, 2460, 2381, 2512, 2460, 2460, 2460, 1931, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  850 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2391, 2394,
    /*  867 */ 2402, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  884 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1781, 2415, 1784, 2460,
    /*  901 */ 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /*  918 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 3234, 3213, 2428, 2512,
    /*  935 */ 2447, 2469, 2732, 2459, 1841, 2732, 2479, 2733, 1901, 2225, 2732, 3002, 1902, 2489, 2783, 3024, 2499,
    /*  952 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2510, 2117, 2520, 2524, 2732, 1837, 2512, 2732, 2732,
    /*  969 */ 2732, 2435, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460,
    /*  986 */ 2460, 2460, 2460, 2460, 2460, 2460, 2536, 2288, 2545, 2553, 2732, 1837, 2512, 2732, 2732, 2732, 2459,
    /* 1003 */ 1841, 2732, 2571, 2733, 1901, 1843, 3218, 2733, 1902, 2732, 2502, 2732, 2960, 2460, 2460, 2460, 2460,
    /* 1020 */ 2460, 2460, 2460, 2460, 2579, 2341, 2590, 2594, 2732, 1837, 2512, 2732, 2732, 2732, 2459, 1841, 2732,
    /* 1037 */ 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1054 */ 2460, 2460, 2609, 2321, 2602, 2623, 2982, 2641, 2512, 2836, 2813, 2732, 2655, 2528, 2732, 2817, 2649,
    /* 1071 */ 2667, 2679, 2861, 3243, 2659, 3045, 2872, 2732, 2563, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1088 */ 2687, 3305, 2701, 2705, 2140, 1837, 2512, 2628, 2732, 2732, 2435, 1841, 2732, 2732, 2733, 1901, 2786,
    /* 1105 */ 2732, 2733, 1902, 2732, 2783, 3112, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671,
    /* 1122 */ 2785, 2784, 2481, 2713, 2512, 2795, 2721, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2722, 2733,
    /* 1139 */ 1902, 2935, 2783, 2732, 2731, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2741, 2354, 2755, 2759,
    /* 1156 */ 2732, 1837, 2512, 2732, 2732, 2732, 2767, 1841, 2926, 2732, 2733, 1901, 2786, 2732, 2781, 1902, 2794,
    /* 1173 */ 2803, 2825, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837,
    /* 1190 */ 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2471, 2733, 1813, 2732, 2783, 2732,
    /* 1207 */ 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2834, 1837, 2512, 2732,
    /* 1224 */ 2844, 2857, 2459, 2852, 2732, 2732, 2142, 1901, 2869, 2258, 2733, 1902, 2732, 2783, 2732, 2732, 2460,
    /* 1241 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2732, 2880,
    /* 1258 */ 2459, 1841, 2891, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460,
    /* 1275 */ 2460, 2460, 2460, 2460, 2460, 2901, 3349, 2912, 2916, 2732, 1837, 2512, 2732, 3035, 2924, 2435, 2154,
    /* 1292 */ 2934, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2943, 2968, 2262, 2460, 2460, 2460, 2460, 2460,
    /* 1309 */ 2460, 2460, 2460, 2459, 2671, 2785, 2229, 2979, 2990, 2512, 3010, 3022, 2732, 2459, 1841, 2732, 2732,
    /* 1326 */ 2220, 1901, 2786, 3032, 2733, 1902, 2732, 2783, 3116, 3043, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1343 */ 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2732, 2732, 2459, 1841, 2732, 2732, 2733, 1901,
    /* 1360 */ 2786, 2732, 2733, 1902, 2732, 2950, 3053, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3064,
    /* 1377 */ 2407, 3077, 3081, 2491, 3089, 2512, 3097, 2732, 3105, 2435, 2184, 2215, 2732, 2733, 1901, 2786, 2732,
    /* 1394 */ 3181, 1902, 2558, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785,
    /* 1411 */ 2784, 2732, 1837, 2512, 2732, 2893, 3056, 2459, 1841, 3194, 3124, 2733, 1992, 2786, 2732, 3223, 1902,
    /* 1428 */ 2996, 2783, 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3133, 1952, 3147, 3151, 2732,
    /* 1445 */ 1837, 2512, 2732, 3000, 2202, 2435, 1841, 3159, 2198, 2130, 1901, 2135, 3167, 2453, 1902, 3178, 2783,
    /* 1462 */ 2732, 2732, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 3189, 3206, 2512,
    /* 1479 */ 2633, 2732, 2826, 2459, 2955, 3170, 2732, 3231, 1901, 2786, 3242, 2733, 1902, 2732, 2783, 3125, 2732,
    /* 1496 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3251, 2420, 3269, 3273, 2732, 1837, 2512, 2732, 2732,
    /* 1513 */ 2732, 2459, 1841, 2732, 2732, 2733, 1901, 2786, 2732, 2723, 1902, 3014, 2783, 2732, 2732, 2460, 2460,
    /* 1530 */ 2460, 2460, 2460, 2460, 2460, 2460, 2459, 2671, 2785, 2784, 2732, 1837, 2512, 2732, 2732, 2722, 2459,
    /* 1547 */ 2808, 3198, 2732, 2733, 1901, 2786, 2732, 2733, 1902, 2732, 2783, 2732, 2732, 2460, 2460, 2460, 2460,
    /* 1564 */ 2460, 2460, 2460, 2460, 2383, 3281, 3288, 3292, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1581 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1598 */ 2460, 2460, 2460, 1800, 3300, 1803, 2460, 1932, 1829, 2460, 2460, 2460, 2460, 2023, 2460, 2460, 2460,
    /* 1615 */ 2460, 3313, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1632 */ 2460, 3327, 3330, 3344, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1649 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2041,
    /* 1666 */ 3357, 3361, 2460, 1932, 2512, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1683 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1700 */ 2460, 1932, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1717 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 1862, 2460, 2460, 2460,
    /* 1734 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460,
    /* 1751 */ 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 2460, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 0,
    /* 1769 */ 0, 0, 3328, 3328, 3328, 49, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 0, 9728, 9728, 0, 0, 0, 0,
    /* 1792 */ 42, 42, 42, 0, 42, 42, 42, 42, 0, 0, 0, 0, 0, 14390, 14390, 0, 0, 0, 0, 0, 2048, 0, 0, 0, 0, 0, 0, 1054,
    /* 1820 */ 10014, 2871, 2871, 2871, 0, 2871, 2871, 2871, 2871, 0, 0, 0, 0, 0, 14685, 2871, 0, 0, 42, 0, 0, 0, 1054,
    /* 1843 */ 1054, 1054, 0, 1054, 1054, 1054, 1187, 1054, 0, 4352, 0, 0, 0, 0, 2871, 0, 0, 0, 4146, 0, 0, 0, 0, 768,
    /* 1867 */ 0, 0, 0, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608, 4608,
    /* 1890 */ 0, 0, 0, 0, 3328, 49, 49, 3328, 0, 0, 4864, 0, 0, 0, 0, 0, 0, 0, 1054, 1054, 4864, 4864, 4864, 4864, 0,
    /* 1915 */ 0, 0, 0, 4864, 0, 4864, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0, 86, 0, 86, 0, 0,
    /* 1946 */ 86, 0, 86, 86, 86, 86, 0, 0, 0, 1072, 1072, 0, 0, 1088, 43, 43, 43, 5376, 43, 43, 43, 43, 5419, 5419, 0,
    /* 1971 */ 0, 0, 0, 8960, 0, 2871, 0, 0, 42, 0, 0, 43, 0, 0, 0, 43, 43, 5376, 5376, 43, 126, 0, 0, 0, 0, 0, 0, 0,
    /* 1999 */ 1183, 0, 154, 154, 43, 0, 0, 43, 0, 0, 0, 5120, 0, 0, 0, 0, 6912, 0, 0, 0, 5632, 5632, 5632, 5632, 0, 0,
    /* 2025 */ 0, 0, 14979, 0, 0, 0, 44, 44, 44, 5888, 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 15616, 0, 0, 15616, 0,
    /* 2050 */ 42, 84, 84, 43, 0, 0, 0, 43, 125, 43, 0, 0, 0, 154, 154, 43, 84, 0, 43, 0, 0, 0, 5632, 0, 0, 0, 5632,
    /* 2077 */ 5632, 0, 0, 5632, 5632, 0, 0, 42, 0, 0, 87, 0, 0, 0, 121, 121, 121, 0, 0, 0, 121, 0, 0, 0, 0, 0, 0, 2871,
    /* 2105 */ 2871, 56, 56, 56, 6400, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 42, 85, 2605,
    /* 2129 */ 2605, 1054, 1054, 1054, 30, 1054, 1054, 1054, 0, 1054, 1185, 1054, 1054, 1054, 30, 1054, 1054, 1054,
    /* 2147 */ 1054, 1142, 152, 2687, 1054, 1054, 1054, 0, 1054, 1054, 1054, 0, 1054, 1157, 1054, 153, 85, 155, 2716,
    /* 2166 */ 2718, 2687, 2718, 1054, 0, 0, 85, 85, 0, 2684, 2605, 2605, 2605, 0, 2605, 2605, 2605, 2605, 0, 1054,
    /* 2186 */ 1054, 1054, 0, 1054, 1054, 11654, 153, 155, 155, 2716, 2716, 2718, 1054, 1054, 1054, 1169, 1054, 1054,
    /* 2204 */ 1054, 1054, 1139, 1054, 1054, 1054, 0, 42, 85, 2605, 2648, 1054, 1054, 1054, 1054, 1163, 1054, 1054,
    /* 2222 */ 1054, 1054, 1175, 1054, 1054, 0, 1184, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1094, 153, 122, 155, 2717,
    /* 2241 */ 2718, 2687, 2718, 1054, 0, 0, 85, 122, 0, 2684, 2648, 174, 155, 155, 2717, 2717, 2718, 1054, 1054, 1054,
    /* 2261 */ 1191, 1054, 1054, 1054, 1054, 1054, 12062, 1054, 1054, 6912, 0, 6912, 0, 0, 0, 6912, 0, 6912, 0, 6912,
    /* 2281 */ 6912, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0, 1056, 1056, 0, 0, 1082, 0, 0, 7424, 0, 0, 0, 2871, 0, 0, 0,
    /* 2306 */ 6144, 0, 0, 0, 0, 44, 44, 5888, 5888, 44, 0, 0, 0, 7988, 0, 0, 0, 0, 1058, 1058, 0, 0, 1058, 3584, 0,
    /* 2331 */ 7680, 8192, 8704, 0, 2871, 0, 0, 0, 7219, 0, 0, 0, 0, 1057, 1057, 0, 0, 1083, 0, 0, 0, 8501, 0, 0, 0, 0,
    /* 2357 */ 1060, 1060, 0, 0, 1085, 0, 0, 0, 9216, 9216, 0, 0, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 0, 0,
    /* 2379 */ 0, 0, 0, 83, 0, 0, 0, 0, 0, 0, 14080, 0, 0, 0, 9472, 0, 0, 0, 9472, 0, 0, 9472, 9472, 9472, 9472, 9472,
    /* 2405 */ 9472, 0, 0, 0, 0, 1062, 1062, 0, 0, 1087, 0, 0, 0, 9728, 0, 0, 0, 0, 1064, 1064, 0, 0, 1089, 0, 42, 0, 0,
    /* 2432 */ 0, 1114, 1099, 1054, 0, 42, 0, 0, 0, 0, 0, 86, 0, 0, 86, 1054, 1093, 1054, 1114, 1054, 1122, 1054, 1054,
    /* 2455 */ 1054, 1195, 1054, 1054, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 125, 1054, 1128, 1054, 1054, 1054, 1054, 1054,
    /* 2476 */ 1054, 30, 1054, 1054, 1167, 1054, 1054, 1054, 1054, 1054, 1054, 1103, 1105, 1054, 1200, 1054, 1054, 1054,
    /* 2494 */ 1054, 1054, 1054, 1104, 1054, 1054, 1054, 1215, 1054, 1054, 1054, 1054, 1054, 0, 1054, 1209, 1055, 0, 0,
    /* 2513 */ 0, 0, 0, 0, 0, 2871, 0, 1081, 1081, 1081, 0, 1081, 1081, 1081, 1081, 0, 1054, 1054, 1054, 0, 1156, 1054,
    /* 2535 */ 1054, 1056, 0, 0, 0, 0, 0, 0, 0, 6144, 1082, 1082, 1082, 0, 1082, 1082, 1082, 1082, 1090, 1082, 1082,
    /* 2556 */ 1082, 0, 1054, 1054, 1054, 1054, 1203, 1054, 1054, 1054, 1054, 10526, 1054, 1054, 12574, 1054, 1054,
    /* 2573 */ 1168, 1054, 1054, 1054, 1054, 1172, 1057, 0, 0, 0, 0, 0, 0, 0, 154, 0, 0, 1083, 1083, 1083, 0, 1083,
    /* 2595 */ 1083, 1083, 1083, 0, 1054, 1054, 1054, 1058, 1058, 1058, 0, 1058, 1058, 1058, 1058, 0, 0, 0, 0, 0, 0, 0,
    /* 2617 */ 3840, 3840, 0, 0, 0, 0, 1058, 1091, 1058, 1058, 0, 1054, 1054, 1054, 1054, 12318, 1054, 1054, 1054, 1121,
    /* 2637 */ 1054, 1115, 1054, 1054, 0, 42, 0, 0, 89, 1054, 1054, 1102, 1173, 1054, 1054, 1054, 1054, 30, 1054, 0, 0,
    /* 2658 */ 0, 123, 0, 0, 89, 89, 123, 1822, 1054, 0, 123, 0, 89, 0, 0, 0, 1054, 1054, 0, 0, 1054, 1054, 1566, 0,
    /* 2682 */ 1054, 1054, 1186, 1054, 1188, 1059, 0, 0, 0, 0, 0, 0, 0, 4146, 4146, 0, 0, 0, 0, 1084, 1084, 1084, 0,
    /* 2705 */ 1084, 1084, 1084, 1084, 0, 1054, 1054, 1054, 82, 42, 0, 0, 0, 1054, 1054, 1103, 1127, 1054, 1054, 1054,
    /* 2725 */ 1054, 1054, 1054, 1054, 30, 0, 11806, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 0, 1060, 0, 0, 0,
    /* 2745 */ 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 1085, 1085, 1085, 0, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054,
    /* 2767 */ 1143, 120, 0, 0, 0, 2304, 0, 0, 0, 2605, 2605, 0, 0, 2605, 1194, 1060, 1054, 1054, 1054, 1054, 1054, 0,
    /* 2789 */ 1054, 1054, 1054, 1054, 1054, 1199, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 1204, 1054, 1206,
    /* 2806 */ 1054, 1054, 0, 1054, 1054, 30, 0, 1054, 1054, 1054, 1130, 1054, 1054, 1054, 1054, 146, 1054, 1171, 1054,
    /* 2825 */ 1210, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1142, 1054, 1095, 1054, 1054, 1054, 1054, 1054, 1054,
    /* 2842 */ 1123, 1124, 1054, 1054, 1129, 1054, 1054, 1054, 1054, 1134, 0, 1152, 1153, 1054, 0, 1054, 1054, 1054,
    /* 2860 */ 1138, 1054, 1054, 1054, 1054, 1054, 11177, 1054, 1054, 1310, 1054, 0, 1054, 1054, 1054, 1054, 1054, 123,
    /* 2878 */ 1054, 1054, 1054, 1054, 1137, 1054, 1054, 1054, 1054, 1054, 153, 1054, 1054, 1054, 1160, 1054, 1054,
    /* 2895 */ 1054, 1054, 1054, 1054, 1133, 1054, 1061, 0, 0, 0, 0, 0, 0, 0, 6400, 6400, 56, 1086, 1086, 1086, 0, 1086,
    /* 2917 */ 1086, 1086, 1086, 0, 1054, 1054, 1054, 1054, 1136, 1054, 1054, 1054, 1054, 1054, 1054, 1164, 1054, 1159,
    /* 2935 */ 1054, 1054, 1054, 1054, 1054, 1054, 1054, 10270, 1054, 1205, 1054, 1054, 30, 0, 1208, 1054, 1054, 1054,
    /* 2953 */ 1207, 1054, 0, 1054, 1054, 1154, 0, 1054, 1054, 1054, 1142, 1054, 1054, 1216, 1054, 1054, 1054, 12830,
    /* 2971 */ 1054, 1054, 1054, 1054, 1054, 174, 1054, 1054, 30, 1054, 1097, 1054, 1054, 1054, 1054, 1054, 1101, 1102,
    /* 2989 */ 1054, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054, 1202, 1054, 1054, 1054, 1054, 1131, 1054, 1054, 1054, 1054,
    /* 3009 */ 0, 1054, 1119, 10782, 1120, 1054, 1054, 1054, 1054, 1054, 13342, 1054, 1054, 1054, 1119, 1054, 1054,
    /* 3026 */ 1054, 1054, 1054, 1054, 1212, 1054, 1054, 1054, 1190, 1054, 1054, 1054, 1054, 1054, 1132, 1054, 1054,
    /* 3043 */ 1054, 1214, 1054, 1054, 1054, 1054, 1054, 1054, 13854, 1054, 1054, 1211, 1054, 1054, 1054, 1054, 1054,
    /* 3060 */ 1054, 1140, 1054, 1054, 1062, 0, 0, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 1087, 1087, 1087, 0, 1087, 1087,
    /* 3083 */ 1087, 1087, 0, 1054, 1092, 1054, 0, 42, 0, 0, 0, 1054, 1054, 1116, 1118, 1054, 1054, 1054, 1054, 1054,
    /* 3103 */ 1054, 1126, 111, 1054, 1054, 1054, 1054, 1054, 1141, 1054, 1054, 1054, 11294, 1054, 1054, 1054, 1054,
    /* 3120 */ 1054, 1197, 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1142, 1054, 1054, 1213, 1063, 0, 0, 0, 0, 0, 0, 0,
    /* 3141 */ 7219, 7219, 0, 0, 0, 0, 1088, 1088, 1088, 0, 1088, 1088, 1088, 1088, 0, 1054, 1054, 1054, 1054, 1054,
    /* 3161 */ 1161, 1054, 1054, 1054, 1054, 1165, 1054, 13086, 1054, 1054, 1054, 1054, 1054, 1054, 1154, 1054, 1054,
    /* 3178 */ 1054, 1054, 1201, 1054, 1054, 1054, 1054, 1054, 1197, 1054, 0, 1054, 1054, 1098, 1054, 1100, 1054, 1054,
    /* 3196 */ 1054, 1162, 1054, 1054, 1054, 1054, 1054, 13598, 1054, 1054, 0, 42, 0, 0, 0, 1098, 1115, 1054, 1054,
    /* 3215 */ 1096, 1054, 1099, 1054, 1054, 1054, 1054, 1192, 1054, 1054, 1054, 1054, 1196, 1054, 1054, 0, 1054, 1054,
    /* 3233 */ 1174, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1093, 1189, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 13824,
    /* 3251 */ 1064, 0, 0, 0, 0, 41, 0, 0, 0, 3840, 0, 0, 0, 0, 121, 0, 0, 87, 1089, 1089, 1089, 0, 1089, 1089, 1089,
    /* 3276 */ 1089, 0, 1054, 1054, 1054, 0, 0, 0, 14080, 14080, 0, 0, 14080, 14080, 14080, 0, 14080, 14080, 14080,
    /* 3295 */ 14080, 0, 0, 0, 0, 0, 0, 0, 14390, 0, 0, 0, 0, 1070, 1070, 0, 0, 1084, 0, 0, 15104, 0, 0, 0, 0, 0, 7988,
    /* 3322 */ 7988, 0, 0, 0, 0, 0, 15360, 0, 0, 0, 15360, 0, 0, 0, 0, 0, 8501, 8501, 0, 0, 0, 0, 15360, 15360, 15360,
    /* 3347 */ 15360, 0, 0, 0, 0, 1071, 1071, 0, 0, 1086, 15616, 15616, 15616, 0, 15616, 15616, 15616, 15616, 0, 0, 0,
    /* 3368 */ 0
  };

  private static final int[] EXPECTED =
  {
    /*   0 */ 96, 100, 104, 108, 112, 116, 120, 124, 134, 134, 163, 129, 139, 198, 135, 143, 134, 134, 134, 134, 162,
    /*  21 */ 150, 129, 133, 134, 145, 134, 134, 134, 125, 149, 154, 131, 134, 134, 134, 134, 125, 149, 155, 134, 134,
    /*  42 */ 134, 159, 134, 134, 134, 134, 211, 167, 177, 181, 188, 184, 192, 211, 211, 211, 210, 211, 211, 196, 173,
    /*  63 */ 202, 206, 211, 211, 211, 209, 211, 211, 216, 220, 226, 230, 211, 211, 249, 211, 211, 170, 236, 222, 229,
    /*  84 */ 211, 249, 211, 212, 236, 241, 248, 232, 245, 231, 237, 253, 2056, 133120, 264192, 33556480, 67110912,
    /* 101 */ 2048, 2048, 8521728, 67373056, 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, 401400,
    /* 113 */ 67248120, 139256, -33822720, 139260, 67510264, 67248120, 2498552, 69607416, 69607416, -41943048,
    /* 123 */ -33554440, 2048, 8, 8, 8, 0, 768, 72, 24, 40, 0, 8, 8, 8, 8, 72, 8192, 65536, 805306368, -2147483648, 8,
    /* 144 */ 24, 8, 40, 8, 8, 256, 256, 256, 768, 768, 768, 768, 768, 72, 8, 8, 256, 8, 8, 0, 128, 256, 768, 0,
    /* 168 */ 2097152, 4194304, 0, 0, 67108864, 64, 256, 512, 28672, 0, 134217728, 16, 4194312, 272629768, 260046887,
    /* 183 */ 125829175, 276820808, 276820808, 276820824, 276820824, 276820808, 276820808, 411038536, 125829183,
    /* 192 */ 411038680, 411041624, 536867711, 536867711, 6, 117440512, 0, 0, 1024, 1024, 32768, 65536, 131072, 1835008,
    /* 206 */ 2097152, 384, 3072, 0, 2097152, 0, 0, 0, 0, 64, 100663296, 64, 256, 12288, 16384, 65536, 131072, 262144,
    /* 224 */ 524288, 2097152, 524288, 1048576, 2097152, 128, 3072, 0, 0, 0, 256, 8192, 256, 8192, 16384, 65536, 0,
    /* 241 */ 131072, 524288, 2097152, 128, 16384, 65536, 131072, 2048, 0, 0, 0, 2097152, 256, 16384, 65536, 65536
  };

  private static final String[] TOKEN =
  {
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
  };
}

// End
