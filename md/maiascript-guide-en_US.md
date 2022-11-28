# MaiaScript Guide

MaiaScript is a programming language focused on building adaptable and intelligent applications, with an emphasis on ease of learning and high performance. Operations with complex numbers and matrices, creation and analysis of complex and social networks, artificial neural networks, access to SQL databases, parallel programming with threads and GPU, advanced statistics, algebraic computing, including differential and integral calculation and programming of desktop and web applications are natively supported.

This manual covers the fundamentals of programming in MaiaScript, presenting practical examples for the most commonly used features and general guidelines on the use of this language.

For detailed information about the grammar of the MaiaScript language see the description in EBNF and the syntax diagrams available in the `docs` folder of your MaiaScript compiler distribution.

## Data types

MaiaScript supports three types of data natively: `integer`, `real` and `string`. These types are automatic, and you do not have to define them when creating common variables and functions. For use exclusively with functions in **WebAssembly** and **MaiaAssembly** are supported the types `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32 bits`, `f32` and `real 64 bits`, `f64`. Functions in **MaiaAssembly** are handled in the chapter on functions. Functions in **WebAssembly** are beyond the scope of this guide. For more information see the official project website: <https://webassembly.org>.

## Data output

MaiaScript allows the display of messages on the computer screen, or in the standard output, through various functions of the `system` library, among them the most used are `print`, `println`, `printf` and `showMessageDialog`. The following example illustrates the use of these functions:

```
system.println("Hello World!")
system.showMessageDialog("Hello World!")
system.printf("%d, %.3f, %s", 1, 1.23456, "Hello World!")
```

## Data entry

You can read data entered by the user using the `showInputDialog` function of the `system` library. This function displays a dialog box with the message passed as a parameter and a confirmation button, which when clicked, returns the value entered in the displayed text box. The following example illustrates the use of this function:

```
a = system.showInputDialog("Type a number:")
system.println(a)
```

## Variables

Variables are containers where we store data for processing or processing results. In MaiaScript variables can store values of any type, and it is not usually necessary to specify the type of data that the variable will store at the time of its creation. However, when creating functions in **MaiaAssembly** or **WebAssembly**, you must specify the type of data that the variable will store and this variable can only store values of this type of data throughout its existence. The types `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32 bits`, `f32`, `real 64 bits`, `f64` are supported. Functions in **MaiaAssembly** are handled in the chapter on functions. Functions in **WebAssembly** are beyond the scope of this guide. For more information see the official project website: <https://webassembly.org>. The following example shows how to create variables of various types:

```
a = 1
system.println(a)
b = 2.0
system.println(b)
c = "Hello World!"
system.println(c)
d = [1, 2.0]
system.println(d)
e = []
system.println(e)

// Vectors similar to JavaScript.
f = [[1, 2],[3, 4]]
system.println(f)

// Matlab-like matrices.
g = [5, 6; 7, 8]
system.println(g)

// JavaScript-like objects.
h = {a: 1, b: 2.0, "c": "Hello World!"}
system.println(JSON.stringify(h))
i = {}
system.println(JSON.stringify(i))
```
## Operators

MaiaScript supports mathematical, relational, logical, bit offset operation, combined assignment operators and ternary conditional operator. The following is an EBNF notation for all operators supported by the language. The order of precedence is top-down.

```
Operation                ::= VariableAssignment
VariableAssignment       ::= ConditionalExpression (('=' | '*=' | '/=' | '%=' | '+=' | '-=' | '<<=' | '>>=' | '&=' | '^=' | '|=' | '?=' | ':=') ConditionalExpression)*
ConditionalExpression    ::= LogicalORExpression ('?' VariableAssignment ':' VariableAssignment)?
LogicalORExpression      ::= LogicalANDExpression ('||' LogicalANDExpression)*
LogicalANDExpression     ::= BitwiseORExpression ('&&' BitwiseORExpression)*
BitwiseORExpression      ::= BitwiseXORExpression ('|' BitwiseXORExpression)*
BitwiseXORExpression     ::= BitwiseANDExpression ('^' BitwiseANDExpression)*
BitwiseANDExpression     ::= EqualityExpression ('&' EqualityExpression)*
EqualityExpression       ::= RelationalExpression (('==' | '!=') RelationalExpression)*
RelationalExpression     ::= ShiftExpression (('<' | '>' | '<=' | '>=') ShiftExpression)*
ShiftExpression          ::= AdditiveExpression (('<<' | '>>') AdditiveExpression)*
AdditiveExpression       ::= PowerExpression (('+' | '-') PowerExpression)*
PowerExpression          ::= MultiplicativeExpression ('**' MultiplicativeExpression)*
MultiplicativeExpression ::= UnaryExpression (('*' | '/' | '%') UnaryExpression)*
UnaryExpression          ::= Primary '++'
                           | Primary '--'
                           | '++' Primary
                           | '--' Primary
                           | '+' Primary
                           | '-' Primary
                           | '~' Primary
                           | '!' Primary
                           | Primary

Primary                  ::= Type? Member
                           | Value
                           | ParenthesizedExpression
```

In the next sessions we will address each of these operators.

### Mathematical operators

MaiaScript supports the following mathematical operators: **add**, `+`, **subtraction**, `-`, **potentiation**, `**`, **multiplication**, `*`, **division**, `/` and **rest of division**, `%`. The following examples show how to use these operators:

```
a = 1
b = 2

c = a + b
system.println(c)

c = a - b
system.println(c)

c = a * b
system.println(c)

c = a / b
system.println(c)

c = a % b
system.println(c)

// Python-like power operator.
c = a ** b
system.println(c)

// Increment and decrement operators similar to C.
c = a++
system.println(c)
c = b--
system.println(c)
c = ++a
system.println(c)
c = --b
system.println(c)
```

### Relational operators

MaiaScript supports the following relational operators: **equal**, `==`, **different**, `!=`, **minor**, `<`, **less or equal**, `<=`, **major**, `>` and **greater or equal**, `>=`. The following examples show how to use these operators:

```
a = 1
b = 2

c = a == b
system.println(c)
c = a != b
system.println(c)
c = a < b
system.println(c)
c = a <= b
system.println(c)
c = a > b
system.println(c)
c = a >= b
system.println(c)
```

### Logical operators

MaiaScript supports the following logical operators: **and**, `&&`, **or**, `|| `, **and bitwise**, `&`, **exclusive or bitwise**, `^` and **or bitwise**, `|`. The following examples show how to use these operators:

```
a = 1
b = 0

c = a && b
system.println(c)
c = a || b
system.println(c)
c = a & b
system.println(c)
c = a | b
system.println(c)
c = a ^ b
system.println(c)
```

### Bit offset operators

MaiaScript supports  the following shift operators: **left shift**, `<<`, and **right shift**, `>>`. The following examples show how to use these operators:

```
a = 3

c = << 2
system.println(c)
c = >> 2
system.println(c)
```

### Assignment operators

MaiaScript supports the following special operators of operation followed by assignment: `*=` , `/=` , `%=` , `+=` , `-=` , `<<=` , `>>=` , `&=` , `^=` , `|=`. The following are examples of the most common uses of these operators:

```
c = a += b
system.println(c)
c = a -= b
system.println(c)
```

### Conditional operator (ternary)

The MaiaScript language offers a **ternary conditional operator**. This operator receives three operands: a `conditional expression`, an `expression that is returned if the condition is evaluated to true` and an `expression that is returned if the condition is evaluated as false`. In the following example, as the variable `a` contains the value `1` the condition `a == 1` will be evaluated as `true` and the expression `Hello` will be returned.

```
a = 1

c = a == 1 ? "Hello" : "World"
system.println(c)
```

### Complex numbers

MaiaScript supports **complex numbers** natively for the `+`, `-`, `**`, `*` and `\` and for the mathematical functions `abs`, `arg`, `cos`, `cosh`, `exp`, `log`, `sin`, `sinh`, `sqrt`, `tan` and `tanh`. Several specialized functions are also available in the `core` library. For all MaiaScript functions that support complex numbers, see the library documentation in the `docs` folder in your MaiaScript compiler distribution.

The following is presented in EBNF notation the syntax of complex numbers in MaiaScript:

```
Complex                  ::= Real? Imaginary
Real                     ::= '-'? Digit+ '.' Digit+ (('e' | 'E' | 'p' | 'P') ('+' | '-')? Digit+)?
Imaginary                ::= (('+' | '-')? Real '*' 'i')
```

The following example illustrates the sum operation with two complex numbers:

```
e = 1.0+2.0*i
f = 3.0+4.0*i
g = e + f
system.println(g)
```

### Matrices

MaiaScript supports matrices natively for the `+`, `-`, `**`, and `*` operators and offers the `matrix` library for linear algebra. Several specialized functions are also available in the `core` library. For all MaiaScript functions that support matrices, see the documentation for the libraries in the `docs` folder in your MaiaScript compiler distribution.

The following is presented in EBNF notation the syntax **associative vectors** and **matrices** in MaiaScript:

```
Array                    ::= '{' Element? (',' Element)* '}'
Matrix                   ::= '[' Row? (';' Row)* ']'

Element                  ::= (Key ':')? Expression
Key                      ::= Identifier
                           | String

Row                      ::= Column (',' Column)*
Column                   ::= Expression
```

In MaiaScript you can use both **Matlab** and **JavaScript** matrices notation. In Matlab notation the columns are separated by `commas`, `,`, and the lines by `semicolons`, `;`. In javascript notation each line must be indicated between brackets `[]` and lines separated by `commas`, `,`. The following example presents examples of operations with matrices using the two notations:

```
a = [1, 2; 3, 4]
b = [[5, 6], [7, 8]]

c = a + b
system.println(c)

c = a - b
system.println(c)

c = a ** 2
system.println(c)

c = a * b
system.println(c)
```

## Decision structures

MaiaScript offers two statements for flow control: `if... else...` and `switch`. Both structures are available in both MaiaScript and MaiaAssembly. These statements will be presented in the next sessions, as well as examples of their uses.

### If... So... Statement

The `if... else...` statement allows you to decide, by evaluating a `condition` by running a `program code` session or not. The `conditional expression` should be written immediately after the word `if` and in `parentheses`. If this expression is evaluated as `true` the `expression` or `command block` immediately after the `parentheses` is executed, otherwise the `expression` or `command block` immediately after the word `else` is executed. The `else` clause is optional.

The following is the syntax of the declaration `if... else...` in EBNF notation:

```
If                       ::= 'if' '(' Expression ')' Expression Else?
Else                     ::= 'else' Expression
```

The following example illustrates the use of the `if... else...` statement:

```
a = 1
b = 2

// If statement similar to C.
if (a < b) {
    system.println("a = " + a)
    system.println("b = " + b)
    system.println("a < b")
    if (a == 1)
        system.println("a == 1")
    else
        system.println("a != 1")
} else if (a > b) {
    system.println("a = " + a)
    system.println("b = " + b)
    system.println("the > b")
} else {
    system.println("a = " + a)
    system.println("b = " + b)
    system.println("a == b")
}
```

### Switch... Case... statement

The `switch... case... default...` statement allows you to decide, by comparing an `expression` with several provided `cases`, by running a `program code` session or not. The `conditional expression` should be written immediately after the word `switch` and in `parentheses`. This `expression` will be compared with each provided `case` and if an **equivalence** is found the `expression` or `command block` immediately after the `colon` of the `case` is executed. If none of the cases matches the given `expression`, the `expression` or `command block` immediately after the `colon` of the `default` case is executed. The `default` clause is optional.

The following is the syntax of the `switch... Case... default...` statement in EBNF notation:

```
Switch                   ::= 'switch' '(' Expression ')' '{' Case+ Default? '}'
Case                     ::= 'case' Expression ':' Expression*
Default                  ::= 'default' ':' Expression*
```

The following example illustrates the use of the `switch... Case... default...` statement:

```
a = 1

// Switch statement similar to C.
switch (a) {
    case 0:
    case 1:
        system.println("a == 0 || a == 1 || a == 2")
    case 2:
        system.println("a == 2")
        Break
    default:
        system.println("a = " + a)
        system.println("a != 1 &; a!= 2")
}
```

## Repeating structures
Loops structures allow you to run a program session a number of times or until a condition is satisfied. MaiaScript offers four looping structures: `do... while`, `while...`, `for` and `foreach`. All of these statements are available in both MaiaScript and MaiaAssembly. These statements will be presented in the next sessions, as well as examples of their uses.

### Do... statement

The `do... while...` statements executes an `expression` or `command block` `while` a given `condition` is evaluated to `true`. The difference from this statement and the `while...` statement is that this statement **executes the code session at least once**, even if the `condition` is already `false` when the program execution stream reaches it, while the `while...` **statement will not execute at all** if the `condition` is already `false` when the program execution flow reaches it. If you wish to stop the execution of the **loop** before the `condition` becomes `false`, you can use the `break` statement. If you want to stop running the current iteration of the **loop** before the command block has been fully executed and jump to the next iteration, you can use the `continue` statement.

The following is the syntax of the `do... while...` statement in EBNF notation:

```
Do                       ::= 'do' Expression 'while' '(' Expression ')'
Break                    ::= 'break'
Continue                 ::= 'continue'
```

The following example illustrates the use of the `do... while...` statement:

```

a = 0

do {
    system.println
    a++
} while (a < 10);
```

### While... statement

The `while...` statement executes an `expression` or `command block` `while` a given `condition` is evaluated to `true`. The difference of this  and the declaration `do... while...` statement is that that statement **executes the code session at least once**, even if the `condition` is already `false` when the program execution stream reaches it, while the `while...` **statement will not execute at all** if the `condition` is already `false` when the program execution flow reaches it. If you wish to stop the execution of the **loop** before the `condition` becomes `false`, you can use the `break` statement. If you want to stop running the current iteration of the **loop** before the **command block** has been fully executed and you jump to the next iteration, you can use the `continue` statement.

The following is the syntax of the `while...` statement in EBNF notation:

```
While                    ::= 'while' '(' Expression ')' Expression
```

The following example illustrates the use of the `while...` statement:

```
a = 0

while (a < 10) {
    if (a % 2 == 0) {
        continue
    }
    if (a >= 5) {
        system.println("Break the loop.")
        Break
    }
    system.println(a)
    a++
}
```

### For... statement

The `for...` statement executes an `expression` or `command block` while a given `condition` is evaluated as `true`. The difference of this statement and the `while...` declaration is that that declaration requires internal control of the execution so that at some point of execution flow the `condition` becomes false and the execution of the code is stopped. This statement allows you to pass three arguments: an `expression that will be executed before the first interaction`, a `conditional expression` and an `expression that will be evaluated at the end of each iteration`. You can use the `first parameter` to **initialize a control variable**, and the `last parameter` to **modify it**. If you wish to stop the execution of the **loop** before the `condition` becomes `false`, you can use the `break` statement. If you want to stop running the current iteration of the **loop** before the **command block** has been fully executed and you jump to the next iteration, you can use the `continue` statement.

The following is the syntax of the `for...` statement in EBNF notation:

```
For                      ::= 'for' '(' Expression ';' Expression ';' Expression ')' Expression
```

The following example illustrates the use of the `for...` statement:

```
b = [1, 2, 3]

for (a = 0; a < 10; ++a) {
    system.println(a)
}

for (i = 0; i < b.length; i++) {
    system.println(b[i])
}
```

### Foreach... statement

The `foreach...` statement executes an `expression` or `command block` `for each` element of an `associative vector` or `object`. This statement receives three parameters: an `associative array` or `object`, a `variable to contain the array key` or `object property name` and a `variable to contain the value of the array element` or `object`. If you wish to stop the execution of the **loop** before the `condition` becomes `false`, you can use the `break` statement. If you want to stop running the current iteration of the **loop** before the **command block** has been fully executed and you jump to the next iteration, you can use the `continue` statement.

The following is the syntax of the `foreach...` statement in EBNF notation:

```
ForEach                  ::= 'foreach' '(' Expression ';' Expression ';' Expression ')' Expression
```

The following example illustrates the use of the `foreach...` statement:

```
c = {a: 1, b: 2}

// Foreach statement similar to Tcl.
foreach(c; key; value) {
    system.println(key + ": " + value)
}
```

## Functions

Functions and procedures are program subroutines that can be performed by invoking their names. MaiaScript supports several types of functions. In the next few sessions we will discuss each of them.

The following is the syntax for the various types of MaiaScript `functions` in EBNF notation:

```
FunctionDeclaration      ::= Identifier ('.' Identifier)* '(' Arguments? ')' '=' Expression
                           | Identifier ('.' Identifier)* '(' Arguments? ')' '?=' Block
                           | Identifier ('.' Identifier)* '(' Arguments? ')' '#=' Block
                           | Identifier ('.' Identifier)* '(' Arguments? ')' ':=' Block
                           | Type? Identifier ('.' Identifier)* '(' Arguments? ')' Block
                           | Type? Identifier ('.' Identifier)* '(' Arguments? ')' Script
Return                   ::= 'return' Expression
```

### Function declaration

We declare a `function` by writing its `name`, followed by `parentheses`, which may or may not contain `arguments` separated by `commas`, `,`, and a `command block` between `curly braces`, `{}`. Functions in MaiaScript may or may not have declared `return types` and use or not `special assignment operators`, `=`, `?=`, `#=`, `:=`, in their declaration.

If a `return type` is indicated in the function declaration, it is interpreted as being a function in **MaiaAssembly** or in **WebAssembly**. In both cases you must specify the `value types` of the function arguments if it has `arguments`. If the `curly braces`, `/{ /}` of the `command blocks` are preceded by the character `/` the function is interpreted as being in **WebAssembly**, otherwise it is considered to be in **MaiaAssembly**. MaiaScript functions can be **recursive**, that is, call themselves to perform complex tasks. The following example illustrates the `factorial` function implemented using a recursive algorithm:

```
// A recursive function.
factorial(n) {
    if (n == 0 || n == 1) {
        return 1
    }
    return n * factorial(n - 1)
}
system.println(factorial(5))
```

### Inline functions

For simpler functions, which can be implemented in only one line, you can use the simplified form of function declaration. This way allows you to write a function as it usually is done in mathematics, using the `assignment`, `=`, operator and omitting the `curly braces` of the `command block`. The following example shows the declaration of a second-degree function:

```
// An inline function.
f(x) = 2 * x ** 2 + x - 1

system.println(f(2))
```

### Asynchronous functions

Functions can be **executed asynchronously**. To do so, you must declare the function using the `asynchronous execution operator`, `?=`. To wait for the **asynchronous function** to finish its execution, blocking the **execution stream** of the rest of the program, you must `assign` the function to a `variable` using the `asynchronous execution operator`, `?=`.

```
// An asynchronous function.
f(x) ?= {
    return x
}

// An asynchronous function call.
a ?= f(2)
```

### Parallel functions

MaiaScript allows you to create parallel functions using **threads** or **GPU cores**. In both cases the functions need to be of the `kernel` type. `Kernel` functions must be created using the `kernel function declaration operator`, `#=`. A `kernel` function is compiled differently from the other functions. They do not support operations with complex numbers or matrices. Only the basic data types and features of JavaScript are supported. The following example shows how to create a **thread** in MaiaScript. For more details see the documentation of the `task` library available in the `docs` folder of your MaiaScript compiler distribution.

```
task1() #= {
    i = 0
    timedCount() #= {
        i++
        postMessage(i)
        if (i < 10) {
            setTimeout(timedCount(), 500)
        }
    }
    timedCount()
}

onMessage1(m) {
    system.log("Task 1: " + m.data)
    if (m.data >= 5) {
        t1.terminate()
    }
}

try {
    t1 = task.new(task1)
    t1.onmessage = onMessage1
} catch (e) {
    system.log(e.message)
}
```

### Functions in MaiaAssembly

**MaiaAssembly** is a build-optimized programming language for **WebAssembly**. It allows you to create algorithms as fast as programs written in C language, embedded in high-level programs in MaiaScript. Functions in **MaiaAssembly** are typed, which means that you must declare the types of functions and variables at the time of their creations. The types supported in **MaiaAssembly** are `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32-bit`, `f32` and `real 64-bit`, `f64`. All **MaiaScript** decision and loop structures are supported in **MaiaAssembly**. In addition, arbitrary dimensions `matrices` of supported data `types` are supported. You cannot pass objects or even arrays as **MaiaAssembly** function arguments, but you can import them. The `import` declaration is used for this. It allows you to import properties of objects into the function and use them as if they were local variables. In **MaiaAssembly** it is possible to create **global variables** using the `global` declaration. Global variables are accessible from anywhere in the program. The following example shows how to create a function to sum two values passed to it as arguments. The function also creates a `local variable` to store the sum result. Local variables must be declared in the function header and should appear after the function arguments.

```
// A function in MaiaAssembly.
i32 f4(i32 a, i32 b, site i32 c) {
    c = a + b;
    return c;
}

// Calling a function in MaiaAssembly.
c = f(1, 2)
```

### Functions in JavaScript

Functions in **JavaScript** can be declared preceding the `curly braces`, `/{ /}` of the `command blocks` with the character `/`. **JavaScript functions are not compiled**, and are inserted into compiler-produced code as they were written. The following example shows how to define a function in **JavaScript**:

```
// A function in JavaScript.
f(x) /{
    y = x + 1;
    return y;
}/

// Calling a function in JavaScript.
c = f(2)
```

### Functions in WebAssembly
Functions in **WebAssembly** are assembled by the assembler and inserted into binary form into the code resulting from the build. They are typed, which means that you need to declare the types of functions and variables at the time of their creations. The types supported in **WebAssembly** are `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32-bit`, `f32` and `real 64-bit`, `f64`. `Local variables` must be declared in the function header and should appear after the function arguments. The following example shows how to create a function to sum two values passed to it as arguments:

```
// A function in WebAssembly.
i32 f(i32 a, i32 b) /{
    (i32.add
      (local.get $a)
      (local.get $b)
    )
}/

// Calling a function in WebAssembly.
f = f(1, 2)
```

## Creating namespaces and objects

**Namespaces** are a way to organize functions and variables to build libraries. The use of `namespaces` not only makes code more organized and reusable, but also makes access to library resources more efficient. Every namespace is an `object`, but `namespaces` are not `object constructors`. To create `objects` we must create `constructors` for them. In the next few sessions we'll see how to create `namespaces` and `object constructors`.

### Creating namespaces

We create a namespace by defining a `name` for it and a `block of code` containing variables and functions.

The following is the syntax for creating `namespaces` in EBNF notation:

```
NamespaceDeclaration     ::= Identifier ('.' Identifier)* Block
```

The following example illustrates how to create a `namespace` containing a `variable`, `property` and a `function`, `method`:

```
// Creating a namespace (an object)
a {
    b = 1
    f(n) {
        if (n == 0 || n == 1) {
            return 1
        }
        return n * this.f(n - 1)
    }
}

system.println(a.b)
system.println(a.f(5))
```

### Object constructors

**Object constructors** allow you to create `class instantiations` defined by them. `Classes` are **templates** for `objects`. They define their `properties`, changeable characteristics at runtime, and their `methods`, functionalities of objects. To create an `object constructor` we define a function using the `object creation operator`, `:=`. To **instantiate** an `object` we assign to a variable the return value of the `object constructor`, using the `object creation operator`, `:=`. The following example creates an `object` that has a `y` property and assigns to that variable the value passed to the constructor at the time of its creation:

```
/// An object constructor.
A(x) := {
    y = x
}

c := A(2)

system.println (c.y);
```

## Complex and social networks

MaiaScript provides several functions for creating and **analyzing complex and social networks**. These features are available in the `cna` and `snet` libraries. The following examples show the most common applications for the functions of these libraries. For a complete reference see the documentation available in the `docs` folder of your MaiaScript compiler distribution.

```
// Creates a network file in Pajek format.
fileContents = ""
fileContents = fileContents + "*Vertices 10" + "\r\n"
fileContents = fileContents + "1\"v1\" -13.53320569881955 15.024369378567805 1" + "\r\n"
fileContents = fileContents + "2 \"v2\" 138.57890381783866 -149.73844730901712 1" + "\r\n"
fileContents = fileContents + "3\"v3\" -195.0525404708813 294.7061191626409 1" + "\r\n"
fileContents = fileContents + "4\"v4\" -4.710077309561689 -119.03537285786881 1" + "\r\n"
fileContents = fileContents + "5\"v5\" 276.72724773173434 -241.1655959044472 1" + "\r\n"
fileContents = fileContents + "6 \"v6\" 218.72444256014836 -294.7061191626409 1" + "\r\n"
fileContents = fileContents + "7 \"v7\" 119.53996984903722 -4.504246484231039 1" + "\r\n"
fileContents = fileContents + "8 \"v8\" -276.72724773173434 219.58638008091668 1" + "\r\n"
fileContents = fileContents + "9 \"v9\" -80.8765683805954 206.98274428233245 1" + "\r\n"
fileContents = fileContents + "10 \"v10\" -198.91296298859544 98.42821322326704 1" + "\r\n"
fileContents = fileContents + "*Arcs" + "\r\n"
fileContents = fileContents + "1 2 1" + "\r\n"
fileContents = fileContents + "1 4 1" + "\r\n"
fileContents = fileContents + "1 7 1" + "\r\n"
fileContents = fileContents + "1 9 1" + "\r\n"
fileContents = fileContents + "1 10 1" + "\r\n"
fileContents = fileContents + "2 1 1" + "\r\n"
fileContents = fileContents + "2 4 1" + "\r\n"
fileContents = fileContents + "2 5 1" + "\r\n"
fileContents = fileContents + "2 6 1" + "\r\n"
fileContents = fileContents + "2 7 1" + "\r\n"
fileContents = fileContents + "3 8 1" + "\r\n"
fileContents = fileContents + "3 9 1" + "\r\n"
fileContents = fileContents + "4 1 1" + "\r\n"
fileContents = fileContents + "4 2 1" + "\r\n"
fileContents = fileContents + "5 2 1" + "\r\n"
fileContents = fileContents + "5 6 1" + "\r\n"
fileContents = fileContents + "6 2 1" + "\r\n"
fileContents = fileContents + "6 5 1" + "\r\n"
fileContents = fileContents + "7 1 1" + "\r\n"
fileContents = fileContents + "7 2 1" + "\r\n"
fileContents = fileContents + "8 3 1" + "\r\n"
fileContents = fileContents + "8 10 1" + "\r\n"
fileContents = fileContents + "9 1 1" + "\r\n"
fileContents = fileContents + "9 3 1" + "\r\n"
fileContents = fileContents + "10 1 1" + "\r\n"
fileContents = fileContents + "10 8 1" + "\r\n"

// Object to contain network properties.
property = {
    "adj": [],
    "n": 0,
    "m": 0,
    "directed": false,
    "density": 0,
    "networkLabel": [],
    "networkDegree": [],
    "networkAverageDegree": 0,
    "networkDegreeDistribution": [],
    "networkDensity": 0,
    "networkClustering": [],
    "networkAverageClustering": 0,
    "networkShortestPath": [],
    "networkAverageShortestPath": 0,
    "networkDiameter": 0,
    "networkCentrality": [],
    "networkVertexEfficiency": [],
    "networkGlobalEfficiency": 0
}

// Converts the file into an adjacency array.
property.adj = cna.parsePajekFile (fileContents, property)

// Calculates the density of the network.
property.networkDensity = cna.getDensity(property.adj, property.directed)

// Calculates the degrees of the vertices and the average degree of the network.
property.networkDegree = cna.getDegrees(property.adj, property.directed)
property.networkAverageDegree = cna.getAverageDegree(property.networkDegree)

// Calculates the clustering coefficients of the vertices and the average agglomeration coefficient of the network.
property.networkClustering = cna.getClustering(property.adj, property.directed)
property.networkAverageClustering = cna.getAverageClustering (property.networkClustering)

// Calculates the shortest paths between the vertices and the network's average shortest path.
property.networkShortestPath = cna.getShortestPath(property.adj)
property.networkAverageShortestPath = cna.getAverageShortestPath(property.networkShortestPath)

// Calculates the diameter of the network.
property.networkDiameter = cna.getDiameter(property.networkShortestPath)

// Calculates the global efficiency of the network.
property.networkGlobalEfficiency = cna.getGlobalEfficiency (property.networkVertexEfficiency)
```

## Artificial neural networks

MaiaScript provides functions for creating and training **artificial neural networks** of various topologies. These features are available in the `ann` library. The following examples show the most common applications for the functions of this library. For a complete reference see the documentation available in the `docs` folder of your MaiaScript compiler distribution.

```
Callback.
trainingCallback (epochs, RSS, correctness, ETL) {
    system.println("Epochs: " + core.toString(epochs) + ", RSS: " + core.toString(RSS) + ", Correctness: " + core.toString(correctness) + ", ETL: " + core.toString(ETL))
}

// Data to train.
The training algorithm expects an array with one row for each die and a column for each input or output neuron.
dataX = [[0.00],[0.25],[0.50],[0.75],[1.00],[1.25],[1.50],[1.75],[2.00],[2.25],[2.25],[1.25],[1.25],[1.50],[1.75],[2.00],[2.00],[2.25],[2.25],[1.25],[1.50],[1.75],[2.00],[2.25],[2.25],[2.25],[2.25],[1.25],[1.25],[1.50],[1.75],[1.[2.50],[2.75],[3.00],[3.25],[3.50],[3.75],[4.00],[4.25],[4.50],[4.75],[5.5). 00],[5.25],[5.50],[5.75],[6.00],[6.25],[6.50],[6.75],[7.00],[7.25],[7.50],,[7.75],[8.00],[8.25],[8.50],[8.75],[9.00],[9.25],[9.50],[9.75],[10.00]]
dataY = [[2.0000],[2.2197],[2.3811],[2.5136],[2.7310],[2.7827],[2.8327],[3.0351],[2.9551],[3.3973],[3.5 1117],[3,5909],[3.7345],[3.8419],[4.0952],[4.2879],[4.4000],[4.8764],[5.2843],[5.9241],[6.3302],[6.9608],[7.3044],[7.6791],[8.2819],[9.0139],[9.3387],[10.0420],[10.4000],[10.6437],[10.4786],[10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.[10.10.10.10.10.10.[10.10.10.[10.10.10.10.[10.10.10.[10.10.10.[10.10.10.10.10.10.10.10.10.[10.10.10.10.10.[10.10.10.10.[10.10.10.[10.10.10.[10.10.10.10.10 4928],[10.7082],[10.6233],[10.8862],[10.6830],[10.8393],[10.9186],[10.8814],[10.9779],[11.0000]]
nData = core.length(dataX)

// Creates a multilayerperceptron neural network.
nn = ann.createANN("mlp", 0, 0, 0, 0, 1, 1, 1, 3)
Displays the untrained neural network.
system.println("ANN before be prepared: " + core.toString(nn))
system.println(core.toString(ann.getLabels(nn)))

// Assigns random starting weights to neural synapses.
nn = ann.prepare(nn, true, true, true)
system.println(core.toString("ANN after be prepared: " + core.toString(nn)))

// It trains the neural network.
statistics = ann.training(nn, dataX, dataY, 0.005, "tanh", "linear", "none", [1, 0], 2000, 0.001, trainingCallback, 100)

// Displays training statistics.
system.println("Statistics: " + core.toString(statistics))

// Displays trained neural network.
system.println("Trained ANN: " + core.toString(nn))

// Uses the trained network to estimate the value of the function.

system.println("The output must be f(0.50) = 2.3811")
out = ann.think(nn, [0.50], 1, 1, "tanh", "linear", "none", [1, 0])
system.println("ANN for f(0.50): " + core.toString(nn))
system.println("f(0.50) = " + out[0])

system.println("The output must be f(1.25) = 2.7827")
out = ann.think(nn, [1.25], 1, 1, "tanh", "linear", "none", [1, 0])
system.println("ANN for f(1.25): " + core.toString(nn))
system.println("f(1.25) = " + out[0])

system.println("The output must be f(5.00) = 6.3302")
out = ann.think(nn, [5.00], 1, 1, "tanh", "linear", "none", [1, 0])
system.println("ANN for f(5.00): " + core.toString(nn))
system.println("f(5.00) = " + out[0])

system.println("The output must be f(5.1267) = 6.65671")
out = ann.think(nn, [5.1267], 1, 1, "tanh", "linear", "none", [1, 0])
system.println("ANN for f(5.1267): " + core.toString(nn))
system.println("f(5.1267) = " + out[0])
```

## SQL database

MaiaScript natively supports the **SQLite** database but can use any database supported by **Node.js**. These features are available in the `core` library. The following example creates a database, a table, and inserts data into the created table. For a complete reference see the documentation available in the `docs` folder of your MaiaScript compiler distribution.

```
dataHandler(transaction, results) {
}

errorHandler (transaction, error) {
}

createTable(transaction) {
    scheme = ""
    scheme = scheme + "CREATE TABLE people(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
    scheme = scheme + "name TEXT NOT NULL DEFAULT `John Doe`,"
    scheme = scheme + "shirt TEXT NOT NULL DEFAULT `Purple`);"
    transaction.executeSql(scheme, [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES (`Joe`, `Green`);", [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES (`Mark`, `Blue`);", [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES (`Phil`, `Orange`);", [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES (`jdoe`, `Purple`);", [], dataHandler, errorHandler)
}

// Opens the database if it exists or creates a new one if it does not exist.
db = core.openSQLDatabase("Test", "1.0", "Test", 65536)

// Creates a table and inserts data into it.
if (typeof(db) != "undefined") {
    db.transaction(createTable)
}
```
## Parallel programming using GPU

You can speed up processing on some issues by using **parallel programming**. MaiaScript allows for real parallelism using **GPU cores** if this feature is available on the host machine. If not, the MaiaScript compiler will compile the program for sequential execution. GPU computing functions are called *shaders*. These functions are compiled differently by the MaiaScript compiler and do not support complex numbers or calculations with matrices. GPU programming features are available in the `gpu` library. For a complete reference see the documentation available in the `docs` folder of your MaiaScript compiler distribution.

The following example shows how to create a function for parallel multiplication of two matrices. A sequential version of the calculation for performance comparison is also implemented.

```
// Create two 512x512 matrices.
a = core.zero(512, 512)
b = core.zero(512, 512)

// Fill in the matrices.
for (i = 0; i < 512; i = i + 1) {
    for (j = 0; j < 512; j = j + 1) {
        v = i * 512 + j
        a[i, j] = v
        b[i, j] = v
    }
}

// Parallel function.
shader #= (a, b) {
    local sum = 0
    for (local i = 0; i < 512; i = i + 1) {
        sum = sum + a[this.thread.y, i] * b[i, this.thread.x]
    }
    return(sum)
}

// Compute function using gpu.
useGPU ?= () {
    device = gpu.new()
    multiplyMatrices = device.createKernel(shader)
    multiplyMatrices.setOutput([512, 512])
    
    startTime := Date()
    c = multiplyMatrices(a, b)
    endTime := Date()
    
    elapsedTime = endTime - startTime
    
    system.log ("GPU result:")
    system.log ("c[511,511]: " + c[511,511])
    system.log("Elapsed time: " + elapsedTime + " ms\n")
}

// Compute function using the CPU.
useCPU ?= () {
    startTime := Date()
    d = core.zero(512, 512)
    for (i = 0; i < 512; i = i + 1) {
        for (j = 0; j < 512; j = j + 1) {
            s = 0
            for (k = 0; k < 512; k = k + 1) {
                s = s + a[i, k] * b[k, j]
            }
            d[i, j] = s
        }
    }
    endTime := Date()
    
    elapsedTime = endTime - startTime
    
    system.log ("CPU result:")
    system.log("d[511,511]: " + d[511,511])
    system.log("Elapsed time: " + elapsedTime + " ms\n")
}

// Start calculation.
useGPU()
useCPU()
```

## Advanced statistics

MaiaScript offers several statistical functions for operations with **matrices** and **CSV** files. These functions are available in the `matrix`, `statistics` and `dfa` libraries. The `statistics` library implements functions for calculations of **averages**, **deviations** and **standard errors**, as well as functions involving **random numbers** and **normal distribution**, including the calculation of the **inverse of the normal distribution**. The `dfa` library implements calculations of **DFA**, **DCCA** and **rhoDCCA**. For a complete reference see the documentation available in the `docs` folder of your MaiaScript compiler distribution.

The following examples show common applications for statistical library functions:

```
a = [1.0,0;0,1,0;0,0,1]
b = [1,2,3;4,5,6;7,8,9]
c = [2.3,-1;4,4,-3;2,-3,1]
d = core.matrix(0, 1, 3)
e = core.matrix(0, 3, 3)
avg = matrix.avg(b)
system.println("avg(b) = " + avg.avg + ", dev(b) = " + avg.dev)
system.println("count(a) = " + matrix.count(a))
system.println("max(b) = " + matrix.max(b))
system.println("min(b) = " + matrix.min(b))
system.println("trans(b) = " + core.toString(matrix.trans(b)))
system.println("det(c) = " + core.det(c))
system.println("diag(c) = " + core.toString(core.diag(c)))
system.println("triang(c) = " + core.toString(matrix.triang(c)))
system.println("cross([1,2,3], [4,5,6]) = " + core.toString(matrix.cross([1,2,3], [4,5,6])))
system.println("dot([1,2,5], [2,-7,12]) = " + core.toString(matrix.dot([1,2,5], [2,-7,12])))
system.println("dim([1,2,3]) = " + core.toString(core.dim([1,2,3]))
system.println("d = " + core.toString(d))
system.println("e = " + core.toString(e))
```

## Algebraic computing

MaiaScript has a complete **CAS (Computer Algebra System)** implemented in the `cas` library. This CAS allows you to simplify expressions, solve equations and perform complex operations of linear algebra and differential and integral calculation. The CAS is based on the *open source* **Algebrite** library. For a complete reference see the official Algebrite project documentation <http://algebrite.org>. The only exception is that Algebrite originally uses the `ˆ` operator for powering and in MaiaScript the `power operator` is `**`. The following examples show how to perform the most common calculation operations with CAS in MaiaScript:

```
//Solves an algebraic expression.
res = cas.eval("x + x")
system.showMessageDialog("x + x:\n\n" + res)

// Simplifies an expression.
res = cas.eval("simplify(cos(x)**2 + sin(x)**2)\n" +
               "simplify(a*b+a*c)\n" +
               "simplify(n!/(n+1)!)")
system.showMessageDialog("simplify(cos(x)**2 + sin(x)**2)\n+
                         "simplify(a*b+a*c)\n" +
                         "simplify(n!/(n+1)!):\ n\n" + res)

// Calculates the integral of an expression.
res = cas.eval("integral(x**2)\n" +
               "integral(x*y,x,y)")
system.showMessageDialog("integral(x**2)\n" +
                         "integral(x*y,x,y):\n\n" + res)

// Calculates the derivative of an expression.
res = cas.eval("d(x**2)\n" +
               "r=sqrt(x**2+y**2)\n" +
               "d(r,[x,y])")
system.showMessageDialog("d(x**2)\n" +
                         "r=sqrt(x**2+y**2)\n" +
                         "d(r,[x,y])\n\n" + res)
```
