// This file was generated on Thu Aug 27, 2020 16:43 (UTC-03) by REx v5.52 which is Copyright (c) 1979-2020 by Gunther Rademacher <grd@gmx.net>
// REx command line: MaiaScript.ebnf -backtrack -tree -java -main

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
          parser.parse_maiascript();
        }
        catch (ParseException pe)
        {
          throw new RuntimeException("ParseException while processing " + arg + ":\n" + parser.getErrorMessage(pe));
        }
        finally
        {
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
    }
    eventHandler.endNonterminal("maiascript", e0);
  }

  private void parse_operation()
  {
    eventHandler.startNonterminal("operation", e0);
    parse_variableAssignment();
    eventHandler.endNonterminal("operation", e0);
  }

  private void try_operation()
  {
    try_variableAssignment();
  }

  private void parse_variableAssignment()
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

  private void try_variableAssignment()
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

  private void parse_logicalORExpression()
  {
    eventHandler.startNonterminal("logicalORExpression", e0);
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
    eventHandler.endNonterminal("logicalORExpression", e0);
  }

  private void try_logicalORExpression()
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

  private void parse_logicalANDExpression()
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

  private void try_logicalANDExpression()
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

  private void parse_bitwiseORExpression()
  {
    eventHandler.startNonterminal("bitwiseORExpression", e0);
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
    eventHandler.endNonterminal("bitwiseORExpression", e0);
  }

  private void try_bitwiseORExpression()
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

  private void parse_bitwiseXORExpression()
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

  private void try_bitwiseXORExpression()
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

  private void parse_bitwiseANDExpression()
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

  private void try_bitwiseANDExpression()
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

  private void parse_equalityExpression()
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

  private void try_equalityExpression()
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

  private void parse_relationalExpression()
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

  private void try_relationalExpression()
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

  private void parse_shiftExpression()
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

  private void try_shiftExpression()
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

  private void parse_additiveExpression()
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

  private void try_additiveExpression()
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

  private void parse_multiplicativeExpression()
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

  private void try_multiplicativeExpression()
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

  private void parse_powerExpression()
  {
    eventHandler.startNonterminal("powerExpression", e0);
    parse_unaryExpression();
    for (;;)
    {
      lookahead1W(27);              // END | identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | ',' |
                                    // '-' | '/' | ';' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '[' |
                                    // ']' | '^' | '`' | 'break' | 'continue' | 'do' | 'for' | 'foreach' | 'function' |
                                    // 'if' | 'namespace' | 'return' | 'test' | 'throw' | 'try' | 'while' | '{' | '|' |
                                    // '||' | '}' | '~'
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

  private void try_powerExpression()
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

  private void parse_unaryExpression()
  {
    eventHandler.startNonterminal("unaryExpression", e0);
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
    }
    eventHandler.endNonterminal("unaryExpression", e0);
  }

  private void try_unaryExpression()
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
    }
  }

  private void parse_primary()
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

  private void try_primary()
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

  private void parse_statement()
  {
    eventHandler.startNonterminal("statement", e0);
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
    }
    eventHandler.endNonterminal("statement", e0);
  }

  private void try_statement()
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
    }
  }

  private void parse_namespace()
  {
    eventHandler.startNonterminal("namespace", e0);
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
    eventHandler.endNonterminal("namespace", e0);
  }

  private void try_namespace()
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

  private void parse_function()
  {
    eventHandler.startNonterminal("function", e0);
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
    eventHandler.endNonterminal("function", e0);
  }

  private void try_function()
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

  private void parse_if()
  {
    eventHandler.startNonterminal("if", e0);
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
    eventHandler.endNonterminal("if", e0);
  }

  private void try_if()
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

  private void parse_elseif()
  {
    eventHandler.startNonterminal("elseif", e0);
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
    eventHandler.endNonterminal("elseif", e0);
  }

  private void try_elseif()
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

  private void parse_else()
  {
    eventHandler.startNonterminal("else", e0);
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
    eventHandler.endNonterminal("else", e0);
  }

  private void try_else()
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

  private void parse_do()
  {
    eventHandler.startNonterminal("do", e0);
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
    eventHandler.endNonterminal("do", e0);
  }

  private void try_do()
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

  private void parse_while()
  {
    eventHandler.startNonterminal("while", e0);
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
    eventHandler.endNonterminal("while", e0);
  }

  private void try_while()
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

  private void parse_for()
  {
    eventHandler.startNonterminal("for", e0);
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
    eventHandler.endNonterminal("for", e0);
  }

  private void try_for()
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

  private void parse_foreach()
  {
    eventHandler.startNonterminal("foreach", e0);
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
    eventHandler.endNonterminal("foreach", e0);
  }

  private void try_foreach()
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

  private void parse_try()
  {
    eventHandler.startNonterminal("try", e0);
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
    eventHandler.endNonterminal("try", e0);
  }

  private void try_try()
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

  private void parse_test()
  {
    eventHandler.startNonterminal("test", e0);
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
    eventHandler.endNonterminal("test", e0);
  }

  private void try_test()
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

  private void parse_catch()
  {
    eventHandler.startNonterminal("catch", e0);
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
    eventHandler.endNonterminal("catch", e0);
  }

  private void try_catch()
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

  private void parse_break()
  {
    eventHandler.startNonterminal("break", e0);
    consume(39);                    // 'break'
    eventHandler.endNonterminal("break", e0);
  }

  private void try_break()
  {
    consumeT(39);                   // 'break'
  }

  private void parse_continue()
  {
    eventHandler.startNonterminal("continue", e0);
    consume(41);                    // 'continue'
    eventHandler.endNonterminal("continue", e0);
  }

  private void try_continue()
  {
    consumeT(41);                   // 'continue'
  }

  private void parse_return()
  {
    eventHandler.startNonterminal("return", e0);
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
    eventHandler.endNonterminal("return", e0);
  }

  private void try_return()
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

  private void parse_throw()
  {
    eventHandler.startNonterminal("throw", e0);
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
    eventHandler.endNonterminal("throw", e0);
  }

  private void try_throw()
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

  private void parse_expression()
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
    case 55:                        // '{'
    case 59:                        // '~'
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

  private void try_expression()
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
    }
  }

  private void parse_arguments()
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

  private void try_arguments()
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

  private void parse_member()
  {
    eventHandler.startNonterminal("member", e0);
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
  }

  private void try_member()
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
  }

  private void parse_array()
  {
    eventHandler.startNonterminal("array", e0);
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
    eventHandler.endNonterminal("array", e0);
  }

  private void try_array()
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

  private void parse_matrix()
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

  private void try_matrix()
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

  private void parse_element()
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    whitespace();
    parse_expression();
    eventHandler.endNonterminal("element", e0);
  }

  private void try_element()
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
    lookahead1W(15);                // identifier | null | true | false | string | complex | real | comment |
                                    // whitespace^token | '!' | '(' | '[' | 'break' | 'continue' | 'do' | 'for' |
                                    // 'foreach' | 'function' | 'if' | 'namespace' | 'return' | 'test' | 'throw' |
                                    // 'try' | 'while' | '{' | '~'
    try_expression();
  }

  private void parse_key()
  {
    eventHandler.startNonterminal("key", e0);
    consume(7);                     // string
    eventHandler.endNonterminal("key", e0);
  }

  private void try_key()
  {
    consumeT(7);                    // string
  }

  private void parse_row()
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

  private void try_row()
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

  private void parse_column()
  {
    eventHandler.startNonterminal("column", e0);
    parse_expression();
    eventHandler.endNonterminal("column", e0);
  }

  private void try_column()
  {
    try_expression();
  }

  private void parse_parenthesizedExpression()
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

  private void try_parenthesizedExpression()
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

  private void parse_value()
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
    }
    eventHandler.endNonterminal("value", e0);
  }

  private void try_value()
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
    }
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
    throw new ParseException(bx, ex, sx, lx, tx);
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

  private int match(int tokenSetId)
  {
    begin = end;
    int current = end;
    int result = INITIAL[tokenSetId];
    int state = 0;

    for (int code = result & 255; code != 0; )
    {
      int charclass;
      int c0 = current < size ? input.charAt(current) : 0;
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
      int c1 = end < size ? input.charAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000)
      {
        --end;
      }
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    return (result & 63) - 1;
  }

  private static String[] getTokenSet(int tokenSetId)
  {
    java.util.ArrayList<String> expected = new java.util.ArrayList<>();
    int s = tokenSetId < 0 ? - tokenSetId : INITIAL[tokenSetId] & 255;
    for (int i = 0; i < 60; i += 32)
    {
      int j = i;
      int i0 = (i >> 5) * 190 + s - 1;
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
    /*   0 */ 55, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4,
    /*  35 */ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24,
    /*  63 */ 9, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 25, 26, 27, 28, 6, 29,
    /*  97 */ 30, 31, 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 6, 44, 45, 46, 47, 6, 48, 6, 49, 6, 50, 51,
    /* 125 */ 52, 53, 9
  };

  private static final int[] MAP1 =
  {
    /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
    /*  26 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
    /*  52 */ 87, 87, 119, 151, 182, 214, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    /*  73 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 245, 255, 255, 255, 255, 255, 255, 255,
    /*  94 */ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    /* 115 */ 255, 255, 255, 255, 55, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    /* 147 */ 0, 0, 0, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    /* 176 */ 19, 20, 21, 22, 23, 24, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    /* 209 */ 25, 26, 27, 28, 6, 29, 30, 31, 32, 33, 34, 35, 6, 36, 37, 6, 38, 39, 40, 41, 42, 43, 6, 44, 45, 46, 47, 6,
    /* 237 */ 48, 6, 49, 6, 50, 51, 52, 53, 9, 9, 9, 9, 9, 9, 9, 9, 54, 54, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    /* 270 */ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
  };

  private static final int[] MAP2 =
  {
    /* 0 */ 57344, 65536, 65533, 1114111, 9, 9
  };

  private static final int[] INITIAL =
  {
    /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 528, 18, 19, 20, 533, 22, 23, 24, 537, 538, 539,
    /* 28 */ 540
  };

  private static final int[] TRANSITION =
  {
    /*    0 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*   17 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1792, 1792,
    /*   34 */ 1792, 1795, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*   51 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1792, 1792, 1792, 1795,
    /*   68 */ 2848, 1943, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*   85 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1974, 1803, 1809, 2848, 1943,
    /*  102 */ 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  119 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1937, 1821, 1825, 2848, 1837, 2605, 2848,
    /*  136 */ 2848, 2848, 1942, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  153 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2604, 1849, 1853, 2848, 1943, 2605, 2848, 2848, 2848,
    /*  170 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  187 */ 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 2202, 1872, 2605, 2202, 2202, 2202, 2847, 1876,
    /*  204 */ 2202, 2202, 2410, 2286, 2202, 2202, 2411, 2288, 2202, 2245, 2202, 2410, 2848, 2848, 2848, 2848, 2848,
    /*  221 */ 2848, 2848, 2848, 2848, 2597, 2603, 2600, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  238 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  255 */ 2848, 2848, 2464, 2470, 2467, 2848, 1943, 1865, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  272 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  289 */ 2848, 2848, 2848, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  306 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1885, 1889, 1897,
    /*  323 */ 1901, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  340 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2282, 2284, 1913, 1920, 2848,
    /*  357 */ 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  374 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3267, 3273, 3270, 2848, 1932, 2605,
    /*  391 */ 2848, 2848, 2848, 1841, 2848, 2848, 2848, 2848, 1951, 2848, 2848, 1839, 1970, 2848, 2073, 2848, 2848,
    /*  408 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3313, 1982, 1988, 2848, 3308, 2605, 2848, 2848,
    /*  425 */ 2848, 2849, 2000, 2848, 2848, 2848, 2010, 2848, 2848, 2848, 2024, 2848, 2090, 2848, 2848, 2848, 2848,
    /*  442 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2036, 2054, 2051, 2848, 1943, 2605, 2848, 2848, 2848, 2848,
    /*  459 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  476 */ 2848, 2848, 2848, 2848, 2848, 2095, 2062, 2068, 2848, 2085, 2605, 2848, 2848, 2848, 2849, 2000, 2848,
    /*  493 */ 2848, 2848, 2103, 2848, 2848, 2848, 2024, 2848, 2090, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  510 */ 2848, 2848, 2471, 2848, 1960, 1957, 2848, 2127, 2605, 2848, 2848, 2848, 1813, 2848, 2848, 2848, 2848,
    /*  527 */ 2143, 2848, 2848, 2848, 2140, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  544 */ 2848, 2371, 2153, 2159, 2848, 1943, 1962, 2848, 2848, 2848, 1942, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  561 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3359,
    /*  578 */ 2172, 2176, 2202, 2188, 2605, 2202, 2202, 2202, 2444, 2201, 2202, 2202, 2430, 2211, 2202, 2202, 2431,
    /*  595 */ 2240, 2202, 2657, 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3359, 2172, 2176,
    /*  612 */ 2202, 2253, 2605, 2202, 2202, 2202, 2568, 2201, 2202, 2202, 2430, 2270, 2202, 2202, 2555, 2296, 2202,
    /*  629 */ 2711, 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2509, 2507, 2848, 2848, 2848, 1943,
    /*  646 */ 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  663 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2077, 2308, 2314, 2322, 2848, 1943, 2605, 2848,
    /*  680 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  697 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2588, 2594, 2591, 2848, 1943, 2729, 2848, 2848, 2848,
    /*  714 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  731 */ 2848, 2848, 2848, 2848, 2848, 2848, 2455, 2461, 2458, 2848, 1943, 2335, 2848, 2848, 2848, 2848, 2848,
    /*  748 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  765 */ 2848, 2848, 2848, 2848, 3258, 3264, 3261, 2848, 1943, 1992, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  782 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  799 */ 2848, 2848, 2016, 2356, 2360, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  816 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  833 */ 2848, 2848, 2848, 2848, 2368, 2605, 2848, 2848, 2848, 1942, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  850 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2820, 2382,
    /*  867 */ 2379, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  884 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2498, 2504, 2501, 2848,
    /*  901 */ 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  918 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2579, 2585, 2582, 2848, 1943, 2605,
    /*  935 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /*  952 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2661, 3156, 3248, 2605, 2390, 2408,
    /*  969 */ 2202, 2847, 1876, 2202, 2419, 2410, 2286, 2428, 2202, 2843, 1857, 2202, 2245, 3233, 2439, 2848, 2848,
    /*  986 */ 2848, 2848, 2848, 2848, 2848, 2848, 2452, 2132, 2479, 2483, 2202, 1872, 2605, 2202, 2202, 2202, 3255,
    /* 1003 */ 1876, 2202, 2202, 2410, 2286, 2202, 2202, 2411, 2288, 2202, 2245, 2202, 2410, 2848, 2848, 2848, 2848,
    /* 1020 */ 2848, 2848, 2848, 2848, 2495, 2164, 2517, 2525, 2202, 1872, 2605, 2202, 2202, 2202, 2847, 1876, 2202,
    /* 1037 */ 2537, 2410, 2286, 2698, 2552, 2411, 2288, 2202, 2193, 2202, 2563, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1054 */ 2848, 2848, 2576, 2327, 2613, 2617, 2202, 1872, 2605, 2202, 2202, 2202, 2847, 1876, 2202, 2202, 2410,
    /* 1071 */ 2286, 2202, 2202, 2411, 2288, 2202, 2245, 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1088 */ 2632, 2742, 2625, 2652, 2901, 2669, 2605, 2890, 3217, 2202, 3293, 2529, 2202, 3161, 3221, 2677, 2688,
    /* 1105 */ 2835, 3204, 2706, 2222, 2258, 2202, 2723, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2737, 3105,
    /* 1122 */ 2750, 2754, 2880, 1872, 2605, 3073, 2202, 2202, 3255, 1876, 2202, 2202, 2410, 2286, 2202, 2202, 2411,
    /* 1139 */ 2288, 2202, 2245, 2762, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244,
    /* 1156 */ 2764, 2772, 2605, 2203, 2780, 2202, 2847, 1876, 2202, 2202, 2410, 2286, 2202, 2878, 2411, 2288, 3172,
    /* 1173 */ 2245, 2999, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2789, 2794, 2802, 2806, 2202, 1872,
    /* 1190 */ 2605, 2202, 2202, 2202, 2814, 1876, 3116, 2202, 2410, 2286, 2202, 2956, 2411, 1905, 2989, 2828, 2202,
    /* 1207 */ 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 2202, 1872, 2605, 2202,
    /* 1224 */ 2202, 2202, 2847, 1876, 2202, 2202, 2410, 2286, 2202, 2879, 2411, 1924, 2202, 2245, 2202, 2410, 2848,
    /* 1241 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 2857, 1872, 2605, 2202, 2867, 2396,
    /* 1258 */ 2847, 2875, 2202, 2202, 3336, 3275, 2202, 2888, 2411, 2288, 2202, 2245, 2202, 2410, 2848, 2848, 2848,
    /* 1275 */ 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 2202, 1872, 2605, 2202, 2202, 2898, 2847, 1876,
    /* 1292 */ 2909, 2202, 2410, 2286, 2202, 2202, 2411, 2288, 2202, 2245, 2202, 2410, 2848, 2848, 2848, 2848, 2848,
    /* 1309 */ 2848, 2848, 2848, 2919, 3129, 2932, 2936, 2202, 1872, 2605, 2202, 2967, 2944, 3255, 2487, 2202, 2202,
    /* 1326 */ 2410, 2286, 2202, 2202, 2411, 2288, 2781, 2217, 2954, 3055, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1343 */ 2848, 2847, 2680, 1876, 2300, 2964, 2342, 2605, 2975, 2987, 2202, 2847, 1876, 2202, 2202, 2348, 2286,
    /* 1360 */ 2202, 2997, 2411, 2288, 2202, 2245, 2544, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847,
    /* 1377 */ 2680, 1876, 2244, 2202, 1872, 2605, 2202, 2202, 2202, 2847, 1876, 2202, 2202, 2410, 2286, 2202, 2202,
    /* 1394 */ 2411, 2288, 2202, 3007, 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3015, 2924, 3028,
    /* 1411 */ 3032, 2859, 2043, 2605, 3040, 2202, 3048, 3255, 2180, 2694, 2202, 2410, 2286, 2202, 2202, 3289, 2288,
    /* 1428 */ 3081, 2245, 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 2202,
    /* 1445 */ 1872, 2605, 2202, 2911, 3084, 2847, 1876, 3092, 2400, 2410, 2002, 2202, 2202, 3100, 2288, 3113, 2245,
    /* 1462 */ 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3124, 3193, 3137, 3141, 2202, 1872, 2605,
    /* 1479 */ 2202, 2839, 2262, 3255, 1876, 3149, 3169, 2276, 2286, 3180, 2202, 3188, 2288, 3201, 2245, 2202, 2410,
    /* 1496 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 3212, 3062, 2605, 2232, 2202,
    /* 1513 */ 2420, 2847, 3229, 2979, 2202, 3241, 2286, 2946, 2202, 2411, 2288, 2202, 2245, 3283, 2410, 2848, 2848,
    /* 1530 */ 2848, 2848, 2848, 2848, 2848, 2848, 3301, 3020, 3321, 3325, 2202, 1872, 2605, 2202, 2202, 2202, 2847,
    /* 1547 */ 1876, 2202, 2202, 2410, 2286, 2202, 2202, 2715, 2288, 3069, 2245, 2202, 2410, 2848, 2848, 2848, 2848,
    /* 1564 */ 2848, 2848, 2848, 2848, 2847, 2680, 1876, 2244, 2202, 1872, 2605, 2202, 2202, 1877, 2847, 3333, 2227,
    /* 1581 */ 2202, 2410, 2286, 2202, 2202, 2411, 2288, 2202, 2245, 2202, 2410, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1598 */ 2848, 2848, 2145, 2109, 2115, 2119, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1615 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1632 */ 2848, 2635, 2641, 2638, 2848, 1943, 2644, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1649 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3344,
    /* 1666 */ 3346, 3354, 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1683 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2028, 3367, 3371,
    /* 1700 */ 2848, 1943, 2605, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1717 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1943,
    /* 1734 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1751 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 1829, 2848, 2848, 2848, 2848, 2848,
    /* 1768 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848, 2848,
    /* 1785 */ 2848, 2848, 2848, 2848, 2848, 2848, 2848, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 3101, 0, 0, 0, 49,
    /* 1804 */ 3328, 3328, 3328, 3328, 3328, 3328, 3328, 3377, 3377, 0, 0, 0, 0, 120, 0, 0, 87, 0, 42, 42, 42, 42, 42,
    /* 1827 */ 42, 42, 0, 0, 0, 0, 768, 0, 0, 0, 0, 2048, 0, 0, 0, 0, 0, 0, 86, 0, 0, 86, 0, 2871, 2871, 2871, 2871,
    /* 1854 */ 2871, 2871, 2871, 0, 0, 0, 0, 1054, 1054, 1054, 1198, 0, 4352, 0, 0, 0, 0, 2871, 0, 42, 0, 0, 0, 1054,
    /* 1878 */ 1054, 1054, 1054, 1054, 1054, 1054, 30, 0, 4608, 0, 0, 0, 0, 0, 4608, 4608, 0, 0, 4608, 4608, 4608, 4608,
    /* 1900 */ 4608, 4608, 4608, 4608, 4608, 0, 0, 0, 0, 1054, 1054, 1197, 1054, 0, 4864, 0, 0, 0, 4864, 0, 4864, 4864,
    /* 1922 */ 4864, 4864, 0, 0, 0, 0, 1054, 10270, 1054, 1054, 0, 42, 0, 0, 86, 0, 0, 0, 42, 42, 0, 0, 42, 0, 0, 0, 0,
    /* 1949 */ 0, 0, 86, 0, 86, 0, 0, 86, 0, 0, 0, 6144, 0, 0, 0, 0, 0, 0, 0, 2871, 2871, 86, 86, 86, 86, 0, 0, 0, 0,
    /* 1978 */ 3328, 49, 49, 3328, 5376, 43, 43, 43, 43, 43, 43, 43, 5419, 5419, 0, 0, 0, 0, 8960, 0, 2871, 0, 125, 0,
    /* 2002 */ 0, 0, 0, 0, 0, 0, 1181, 1054, 152, 152, 43, 0, 0, 43, 0, 0, 0, 9216, 9216, 0, 0, 9216, 0, 43, 124, 43, 0,
    /* 2029 */ 0, 0, 0, 15360, 0, 0, 15360, 0, 5632, 5632, 0, 0, 5632, 5632, 0, 42, 0, 0, 0, 1054, 1054, 1116, 5632,
    /* 2052 */ 5632, 5632, 5632, 0, 0, 0, 0, 0, 0, 5632, 5888, 44, 44, 44, 44, 44, 44, 44, 5932, 5932, 0, 0, 0, 0, 86,
    /* 2077 */ 0, 0, 0, 0, 6912, 0, 0, 0, 0, 42, 84, 84, 43, 0, 0, 0, 152, 0, 0, 0, 0, 44, 44, 5888, 5888, 44, 152, 152,
    /* 2105 */ 43, 84, 0, 43, 0, 0, 0, 14336, 14336, 0, 0, 14336, 14336, 14336, 14336, 14336, 14336, 14336, 0, 0, 0, 0,
    /* 2127 */ 0, 42, 0, 0, 87, 0, 0, 0, 1055, 1055, 0, 0, 1081, 0, 120, 120, 120, 0, 0, 0, 0, 0, 0, 0, 14336, 0, 6400,
    /* 2154 */ 56, 56, 56, 56, 56, 56, 56, 6456, 6456, 0, 0, 0, 0, 1056, 1056, 0, 0, 1082, 0, 2605, 2605, 2605, 2605,
    /* 2177 */ 2605, 2605, 2605, 0, 1054, 1054, 1054, 1054, 1054, 11908, 1054, 0, 42, 85, 2605, 2605, 1054, 1054, 1054,
    /* 2196 */ 0, 1054, 1207, 1054, 1054, 2686, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1124, 85, 153, 2714,
    /* 2214 */ 2716, 2686, 2716, 1054, 1054, 30, 0, 1206, 1054, 1054, 1054, 1054, 14110, 1054, 1054, 1054, 1054, 13854,
    /* 2232 */ 1054, 1054, 1054, 1120, 1054, 1115, 1054, 1054, 153, 2714, 2714, 2716, 1054, 1054, 1054, 1054, 0, 1054,
    /* 2250 */ 1054, 1054, 1054, 0, 42, 85, 2605, 2648, 1054, 1054, 1054, 122, 1054, 1054, 1054, 1054, 1138, 1054, 1054,
    /* 2269 */ 1054, 121, 153, 2715, 2716, 2686, 2716, 1054, 1054, 30, 1054, 1054, 1054, 0, 0, 4864, 0, 0, 0, 0, 0, 0,
    /* 2291 */ 0, 1054, 1054, 1054, 1054, 153, 2715, 2715, 2716, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1094, 6912, 0,
    /* 2310 */ 6912, 0, 0, 0, 6912, 0, 6912, 0, 0, 6912, 6912, 0, 6912, 6912, 6912, 6912, 0, 0, 0, 0, 1057, 1057, 0, 0,
    /* 2334 */ 1083, 3584, 0, 7680, 8192, 8704, 0, 2871, 0, 42, 0, 0, 0, 1097, 1054, 1054, 1054, 1173, 1054, 1054, 0, 0,
    /* 2356 */ 9216, 9216, 9216, 9216, 9216, 9216, 9216, 9216, 0, 0, 0, 0, 0, 83, 0, 0, 0, 0, 0, 0, 6400, 6400, 56,
    /* 2379 */ 9472, 9472, 9472, 9472, 0, 0, 0, 0, 0, 9472, 9472, 1054, 1093, 1054, 1114, 1054, 1121, 1054, 1054, 1054,
    /* 2399 */ 1137, 1054, 1054, 1054, 1054, 1141, 1054, 1054, 1054, 1054, 1127, 1054, 1054, 1054, 1054, 1054, 1054, 0,
    /* 2417 */ 0, 0, 1165, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1141, 1054, 1182, 1054, 1054, 1054, 1054, 1054,
    /* 2435 */ 1054, 0, 151, 153, 1213, 1054, 1054, 1054, 1054, 1054, 0, 0, 85, 85, 0, 2683, 2605, 1055, 0, 0, 0, 0, 0,
    /* 2458 */ 0, 0, 7988, 7988, 0, 0, 0, 0, 0, 0, 0, 4146, 4146, 0, 0, 0, 0, 0, 0, 0, 6144, 0, 1081, 1081, 1081, 1081,
    /* 2484 */ 1081, 1081, 1081, 0, 1054, 1054, 1054, 1054, 1155, 1054, 1157, 1056, 0, 0, 0, 0, 0, 0, 0, 9728, 9728, 0,
    /* 2506 */ 0, 0, 0, 0, 0, 0, 6656, 0, 0, 0, 0, 0, 1082, 1082, 1082, 1082, 1082, 1082, 1082, 1090, 1082, 1082, 1082,
    /* 2529 */ 0, 1054, 1054, 1054, 1154, 1054, 1054, 1054, 1054, 1166, 1054, 1054, 1054, 1054, 1170, 1054, 1054, 1054,
    /* 2547 */ 1195, 1054, 1054, 1054, 1212, 1054, 1054, 1190, 1054, 1054, 1054, 1054, 1054, 0, 172, 153, 1054, 1141,
    /* 2565 */ 1054, 1054, 1214, 1054, 0, 0, 85, 121, 0, 2683, 2648, 1057, 0, 0, 0, 0, 0, 0, 0, 9984, 9984, 0, 0, 0, 0,
    /* 2590 */ 0, 0, 0, 7219, 7219, 0, 0, 0, 0, 0, 0, 0, 3840, 3840, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 0, 1083, 1083, 1083,
    /* 2617 */ 1083, 1083, 1083, 1083, 0, 1054, 1054, 1054, 0, 1058, 1058, 1058, 1058, 1058, 1058, 1058, 0, 0, 0, 0, 0,
    /* 2638 */ 0, 0, 14646, 14646, 0, 0, 0, 0, 0, 0, 0, 14848, 2871, 0, 1058, 1091, 1058, 1058, 0, 1054, 1054, 1054,
    /* 2660 */ 151, 1054, 1054, 1054, 1054, 0, 1054, 1054, 1093, 0, 42, 0, 0, 89, 1054, 1054, 1102, 122, 0, 89, 0, 0, 0,
    /* 2683 */ 1054, 1054, 0, 0, 1054, 1566, 1054, 1054, 1184, 1054, 1186, 1054, 1054, 1054, 1161, 1054, 1054, 1054,
    /* 2701 */ 1054, 1185, 1054, 1054, 1054, 0, 89, 89, 122, 1822, 1054, 1054, 1054, 172, 1054, 1054, 1054, 1054, 30, 0,
    /* 2721 */ 0, 0, 1054, 1054, 10782, 1054, 1054, 12830, 0, 0, 7424, 0, 0, 0, 2871, 0, 1059, 0, 0, 0, 0, 0, 0, 0,
    /* 2745 */ 1058, 1058, 0, 0, 1058, 0, 1084, 1084, 1084, 1084, 1084, 1084, 1084, 0, 1054, 1054, 1054, 1054, 11550,
    /* 2764 */ 1054, 1054, 1054, 1054, 1054, 1054, 1103, 1105, 82, 42, 0, 0, 0, 1054, 1054, 1103, 1126, 1054, 1054,
    /* 2783 */ 1054, 1054, 1054, 1054, 1054, 1203, 1060, 0, 0, 0, 0, 0, 0, 0, 1060, 1060, 0, 0, 1085, 0, 1085, 1085,
    /* 2805 */ 1085, 1085, 1085, 1085, 1085, 0, 1054, 1054, 1054, 1142, 119, 0, 0, 0, 2304, 0, 0, 9472, 0, 0, 0, 9472,
    /* 2827 */ 0, 1204, 1054, 1054, 0, 1054, 1054, 1208, 1054, 1054, 1054, 11431, 1054, 1054, 1054, 1054, 1130, 1054,
    /* 2845 */ 1054, 1054, 1054, 0, 0, 0, 0, 0, 0, 0, 0, 124, 1054, 1095, 1054, 1054, 1054, 1054, 1054, 1054, 1104,
    /* 2866 */ 1054, 1054, 1054, 1128, 1054, 1054, 1054, 1054, 1133, 0, 1151, 1152, 1054, 1054, 1054, 1054, 1054, 30,
    /* 2884 */ 1054, 1054, 1054, 1054, 1054, 1189, 1054, 1054, 1054, 1054, 1054, 1054, 1122, 1123, 1054, 1054, 1136,
    /* 2901 */ 1054, 1054, 1054, 1054, 1054, 1101, 1102, 1054, 1158, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1132,
    /* 2918 */ 1054, 1061, 0, 0, 0, 0, 0, 0, 0, 1062, 1062, 0, 0, 1087, 0, 1086, 1086, 1086, 1086, 1086, 1086, 1086, 0,
    /* 2941 */ 1054, 1054, 1054, 1054, 1135, 1054, 1054, 1054, 1054, 1054, 1054, 1187, 1054, 13086, 1054, 1054, 1054,
    /* 2958 */ 1054, 1054, 1054, 1054, 1192, 1060, 30, 1054, 1097, 1054, 1054, 1054, 1054, 1054, 1131, 1054, 1054, 1054,
    /* 2976 */ 1118, 11038, 1119, 1054, 1054, 1054, 1054, 1153, 1054, 1054, 1054, 1054, 1118, 1054, 1054, 1054, 1054,
    /* 2993 */ 1054, 1054, 1202, 1054, 1188, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 12062, 1054, 1054, 1205, 1054, 0,
    /* 3011 */ 1054, 1054, 1054, 1209, 1062, 0, 0, 0, 0, 0, 0, 0, 1064, 1064, 0, 0, 1089, 0, 1087, 1087, 1087, 1087,
    /* 3033 */ 1087, 1087, 1087, 0, 1054, 1092, 1054, 1117, 1054, 1054, 1054, 1054, 1054, 1054, 1125, 110, 1054, 1054,
    /* 3051 */ 1054, 1054, 1054, 1140, 1054, 1054, 1054, 12318, 1054, 1054, 0, 0, 42, 0, 0, 0, 1098, 1115, 1054, 1054,
    /* 3071 */ 1054, 13598, 1054, 1054, 1054, 1054, 12574, 1054, 1054, 1054, 1054, 1054, 1201, 1054, 1054, 1054, 1054,
    /* 3088 */ 1054, 1139, 1054, 1054, 1054, 1054, 1160, 1054, 1054, 1054, 1054, 1164, 1054, 1054, 1194, 1054, 1054, 0,
    /* 3106 */ 0, 0, 1070, 1070, 0, 0, 1084, 1054, 1200, 1054, 1054, 1054, 1054, 1054, 1054, 1162, 1054, 1054, 1063, 0,
    /* 3126 */ 0, 0, 0, 0, 0, 0, 1071, 1071, 0, 0, 1086, 0, 1088, 1088, 1088, 1088, 1088, 1088, 1088, 0, 1054, 1054,
    /* 3148 */ 1054, 1054, 1159, 1054, 1054, 1054, 1054, 1163, 1054, 1054, 1096, 1054, 1099, 1054, 1054, 1054, 144,
    /* 3165 */ 1054, 1169, 1054, 1171, 1054, 1054, 1167, 1054, 1054, 1054, 1054, 1054, 10526, 1054, 1054, 1054, 1054,
    /* 3182 */ 1183, 1054, 1054, 1054, 1054, 13342, 1054, 1193, 1054, 1054, 1054, 0, 0, 0, 1072, 1072, 0, 0, 1088, 1199,
    /* 3202 */ 1054, 1054, 1054, 1054, 1054, 1054, 1054, 14080, 122, 0, 1054, 1054, 1098, 1054, 1100, 1054, 1054, 1054,
    /* 3220 */ 1129, 1054, 1054, 1054, 1054, 30, 1054, 0, 0, 0, 1054, 1054, 1153, 1054, 1054, 1054, 1054, 1210, 1054,
    /* 3239 */ 1054, 1054, 1054, 1172, 1054, 1054, 1054, 1054, 0, 0, 42, 0, 0, 0, 1114, 1099, 1054, 0, 42, 0, 0, 0, 0,
    /* 3262 */ 0, 8501, 8501, 0, 0, 0, 0, 0, 0, 0, 5120, 5120, 0, 0, 0, 0, 0, 0, 0, 1054, 1310, 1054, 1054, 1141, 1054,
    /* 3287 */ 1054, 1211, 1054, 1054, 1054, 1195, 1054, 0, 0, 0, 122, 0, 0, 89, 1064, 0, 0, 0, 0, 41, 0, 0, 42, 0, 0,
    /* 3312 */ 43, 0, 0, 0, 43, 43, 5376, 5376, 43, 0, 1089, 1089, 1089, 1089, 1089, 1089, 1089, 0, 1054, 1054, 1054, 0,
    /* 3334 */ 1054, 1054, 30, 1054, 1054, 1054, 1054, 1141, 150, 0, 0, 15104, 0, 0, 0, 15104, 0, 0, 0, 0, 15104, 15104,
    /* 3356 */ 15104, 15104, 0, 0, 0, 0, 2605, 2605, 0, 0, 2605, 0, 15360, 15360, 15360, 15360, 15360, 15360, 15360, 0,
    /* 3376 */ 0, 0, 0
  };

  private static final int[] EXPECTED =
  {
    /*   0 */ 95, 99, 103, 107, 111, 115, 119, 123, 124, 124, 142, 192, 129, 180, 125, 133, 124, 124, 124, 124, 141,
    /*  21 */ 230, 192, 124, 124, 136, 124, 124, 124, 146, 230, 191, 136, 124, 124, 124, 124, 147, 231, 151, 124, 124,
    /*  42 */ 137, 124, 124, 124, 124, 153, 236, 159, 163, 167, 170, 174, 178, 212, 212, 237, 212, 212, 155, 214, 184,
    /*  63 */ 188, 211, 212, 212, 236, 212, 212, 214, 196, 201, 210, 212, 212, 212, 204, 212, 213, 218, 223, 210, 212,
    /*  84 */ 236, 212, 213, 218, 227, 235, 206, 197, 205, 219, 241, 2056, 133120, 264192, 33556480, 67110912, 2048,
    /* 101 */ 2048, 8521728, 67373056, 2099200, 69208064, 134136, 138232, -75896832, -42342400, 139256, -33822720,
    /* 112 */ 401400, 67248120, 139256, 139260, 67510264, 67248120, 2498552, 69607416, 69607416, -41943048, -33554440,
    /* 123 */ 2048, 8, 8, 8, 8, 72, 8192, 65536, 805306368, -2147483648, 8, 24, 8, 40, 8, 8, 8, 256, 8, 0, 128, 256,
    /* 145 */ 768, 8, 8, 0, 256, 256, 72, 8, 8, 8, 0, 0, 6, 33554432, 8388608, 0, 0, 67108864, 16, 8388616, 142606344,
    /* 166 */ 117440615, 50331767, 150988424, 50331775, 150988424, 218097288, 150988424, 150988424, 150988440,
    /* 175 */ 150988440, 218097560, 218103448, 268429055, 268429055, 0, 0, 1024, 1024, 1024, 57344, 65536, 131072,
    /* 188 */ 262144, 3670016, 4194304, 768, 768, 72, 24, 40, 24576, 32768, 131072, 262144, 4096, 524288, 1048576,
    /* 203 */ 2097152, 4194304, 0, 0, 0, 512, 16384, 256, 6144, 0, 0, 0, 0, 128, 512, 512, 16384, 32768, 131072, 0,
    /* 223 */ 262144, 524288, 1048576, 4194304, 262144, 1048576, 4194304, 256, 256, 768, 768, 768, 4096, 0, 0, 0,
    /* 239 */ 4194304, 0, 512, 32768, 131072, 131072
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
  };
}

// End
