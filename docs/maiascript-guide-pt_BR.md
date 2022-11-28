# MaiaScript Guide

MaiaScript é uma linguagem de programação voltada a construção de aplicações adaptáveis e inteligentes, com ênfase na facilidade de aprendizagem e elevada performance. São suportados nativamente, operações com números complexos e matrizes, criação e análise de redes complexas e sociais, redes neurais artificiais, acesso a bancos de dados SQL, programação paralela com threads e GPU, estatística avançada, computação algébrica, incluindo cálculo diferencial e integral e programação de aplicações desktop e web.

Este manual cobre os fundamentos de programação em MaiaScript, apresentando exemplos práticos para os recursos mais comumente usados e orientações gerais sobre o uso desta linguagem.

Para informações detalhadas sobre a gramática da linguagem MaiaScript consulte a descrição em EBNF e os diagramas de sintaxe disponíveis na pasta `docs` da sua distribuição do compilador MaiaScript.

## Tipos de dados

MaiaScript suporta três tipos de dados nativamente: `integer`, `real` e `string`. Esses tipos são automáticos, não sendo necessário defini-los quando da criação de variáveis e funções comuns. Para uso exclusivamente com funções em **WebAssembly** e **MaiaAssembly** são suportados os tipos `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32 bits`, `f32` e `real 64 bits`, `f64`. Funções em **MaiaAssembly** são tratadas no capítulo sobre funções. Funções em **WebAssembly** estão além do escopo deste guia. Para maiores informações consulte o site oficial do projeto: <https://webassembly.org>.

## Saída de dados

MaiaScript permite a exibição de mensagens na tela do computador, ou na saída padrão, através de várias funções da biblioteca `system`, dentre elas as mais usadas são `print`, `println`, `printf` e `showMessageDialog`. O exemplo a seguir ilustra o uso dessas funções:

```
system.println("Hello World!")
system.showMessageDialog("Hello World!")
system.printf("%d, %.3f, %s", 1, 1.23456, "Hello World!")
```

## Entrada de dados

É possível ler dados digitados pelo usuário através da função `showInputDialog` da biblioteca `system`. Esta função exibe uma caixa de diálogo com a mensagem passada como parâmetro e um botão de confirmação, que quando clicado, retorna o valor digitado na caixa de texto apresentada. O exemplo a seguir ilustra o uso desta função:

```
a = system.showInputDialog("Type a number:")
system.println(a)
```

## Variáveis

Variáveis são contêineres onde armazenamos dados para processamento ou resultados de processamentos. Em MaiaScript variáveis podem armazenar valores de qualquer tipo, não sendo normalmente necessário especificar o tipo de dado que a variável ira armazenar, no momento de sua criação. Contudo, quando da criação de funções em **MaiaAssembly** ou **WebAssembly**, deve-se especificar o tipo de dado que a variável ira armazenar e esta variável só poderá armazenar valores deste tipo de dado por toda a sua existência. São suportados os tipos `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32 bits`, `f32`, `real 64 bits`, `f64`. Funções em **MaiaAssembly** são tratadas no capítulo sobre funções. Funções em **WebAssembly** estão além do escopo deste guia. Para maiores informações consulte o site oficial do projeto: <https://webassembly.org>. O exemplo a seguir mostra como criar variáveis de diversos tipos:

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

// Vetores semelhantes ao JavaScript.
f = [[1, 2],[3, 4]]
system.println(f)

// Matrizes semelhantes ao Matlab.
g = [5, 6; 7, 8]
system.println(g)

// Objetos semelhantes ao JavaScript
h = {a: 1, b: 2.0, "c": "Hello World!"}
system.println(JSON.stringify(h))
i = {}
system.println(JSON.stringify(i))
```

## Operadores

MaiaScript suporta operadores matemáticos, relacionais, lógicos, de deslocamento de bits, de operação e atribuição e o operador condicional ternário. A seguir apresentamos em notação EBNF todos os operadores suportados pela linguagem. A ordem de precedência é de cima para baixo.

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

Nas próximas sessões abordaremos cada um desses operadores.

### Operadores matemáticos

MaiaScript suporta os operadores matemáticos **soma**, `+`, **subtração**, `-`, **potenciação**, `**`, **multiplicação**, `*`, **divisão**, `/` e **resto da divisão**, `%`. Os exemplos a seguir mostram como utilizar esses operadores:

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

// Operador de potência semelhante ao Python.
c = a ** b
system.println(c)

// Operadores de incremento e decremento semelhantes ao C.
c = a++
system.println(c)
c = b--
system.println(c)
c = ++a
system.println(c)
c = --b
system.println(c)
```

### Operadores relacionais

MaiaScript suporta os operadores relacionais **igual**, `==`, **diferente**, `!=`, **menor**, `<`, **menor ou igual**, `<=`, **maior**, `>` e **maior ou igual**, `>=`. Os exemplos a seguir mostram como utilizar esses operadores:

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

### Operadores lógicos

MaiaScript suporta os operadores lógicos **e**, `&&`, **ou**, `||`, **e bit a bit**, `&`, **ou exclusivo bit a bit**, `^` e **ou bit a bit**, `|`. Os exemplos a seguir mostram como utilizar esses operadores:

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

### Operadores de deslocamento de bits

MaiaScript suporta os operadores de **deslocamento a esquerda**, `<<`, e **deslocamento a direita**, `>>`. Os exemplos a seguir mostram como utilizar esses operadores:

```
a = 3

c = a << 2
system.println(c)
c = a >> 2
system.println(c)
```

### Operadores de operação e atribuição

MaiaScript suporta os seguintes operadores especiais de operação seguida de atribuição: `*=` , `/=` , `%=` , `+=` , `-=` , `<<=` , `>>=` , `&=` , `^=` , `|=`. A seguir são apresentados exemplos dos usos mais comuns desses operadores:

```
c = a += b
system.println(c)
c = a -= b
system.println(c)
```

### Operador condicional (ternário)

A linguagem MaiaScript oferece um **operador condicional ternário**. Este operador recebe três operandos: uma `expressão condicional`, uma `expressão que será retornada caso a condição seja avaliada como verdadeira` e uma `expressão que será retornada caso a condição seja avaliada como falsa`. No exemplo a seguir, como a variável `a` contém o valor `1` a condição `a == 1` será avaliada como `verdadeira` e a expressão `"Hello"` será retornada.

```
a = 1

c = a == 1 ? "Hello" : "World"
system.println(c)
```

### Números complexos

MaiaScript suporta **números complexos** nativamente para os operadores `+`, `-`, `**`, `*` e `\` e para as funções matemáticas `abs`, `arg`, `cos`, `cosh`, `exp`, `log`, `sin`, `sinh`, `sqrt`, `tan` e `tanh`. Também estão disponíveis diversas funções especializadas na biblioteca `core`. Para conhecer todas as funções MaiaScript com suporte a números complexos, consulte a documentação das bibliotecas na pasta `docs` em sua distribuição do compilador MaiaScript.

A seguir é apresentada em notação EBNF a sintaxe de números complexos em MaiaScript:

```
Complex                  ::= Real? Imaginary
Real                     ::= '-'? Digit+ '.' Digit+ (('e' | 'E' | 'p' | 'P') ('+' | '-')? Digit+)?
Imaginary                ::= (('+' | '-')? Real '*' 'i')
```

O exemplo a seguir ilustra a operação de soma com dois números complexos:

```
e = 1.0+2.0*i
f = 3.0+4.0*i
g = e + f
system.println(g)
```

### Matrizes

MaiaScript suporta matrizes nativamente para os operadores `+`, `-`, `**`, e `*` e oferece a biblioteca `matrix` para algebra linear. Também estão disponíveis diversas funções especializadas na biblioteca `core`. Para conhecer todas as funções MaiaScript com suporte a matrizes, consulte a documentação das bibliotecas na pasta `docs` em sua distribuição do compilador MaiaScript.

A seguir é apresentada em notação EBNF a sintaxe **vetores associativos** e **matrizes** em MaiaScript:

```
Array                    ::= '{' Element? (',' Element)* '}'
Matrix                   ::= '[' Row? (';' Row)* ']'

Element                  ::= (Key ':')? Expression
Key                      ::= Identifier
                           | String

Row                      ::= Column (',' Column)*
Column                   ::= Expression
```

Em MaiaScript pode-se usar tanto a notação de matrizes do **Matlab** quanto do **JavaScript**. Na notação Matlab as colunas são separadas por `vírgulas`, `,`, e as linhas por `pontos e vírgulas`, `;`. Na notação JavaScript cada linha deve ser indicada entre colchetes `[]` e as linhas separadas por `vírgulas`, `,`. O exemplo a seguir apresenta exemplos de operações com matrizes usando as duas notações:

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

## Estruturas de decisão

MaiaScript oferece duas estruturas para controle de fluxo de execução: `if... else...` e `switch`. Ambas as estruturas estão disponíveis tanto no MaiaScript quanto no MaiaAssembly. Nas próximas sessões serão apresentadas essas declarações, assim como exemplos de suas utilizações.

### Declaração Se... Então...

A declaração `if... else...` permite decidir, mediante a avaliação de uma `condição` pela execução de uma sessão de `código de programa` ou não. A `expressão condicional` deve ser apresentada imediatamente após a palavra `if` e entre `parênteses`. Caso essa expressão seja avaliada como `verdadeira` a `expressão` ou `bloco de comandos` imediatamente após os `parênteses` será executada, caso contrário a `expressão` ou `bloco de comandos` imediatamente após a palavra `else` será executada. A cláusula `else` é opcional.

A seguir é apresentada a sintaxe da declaração `if... else...` em notação EBNF:

```
If                       ::= 'if' '(' Expression ')' Expression Else?
Else                     ::= 'else' Expression
```

O exemplo a seguir ilustra o uso da declaração `if... else...`:

```
a = 1
b = 2

// Declaração if semelhante ao C.
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
    system.println("a > b")
} else {
    system.println("a = " + a)
    system.println("b = " + b)
    system.println("a == b")
}
```

### Declaração Selecione... Caso...

A declaração `switch... case... default...` permite decidir, mediante a comparação de uma `expressão` com diversos `casos` fornecidos, pela execução de uma sessão de `código de programa` ou não. A `expressão condicional` deve ser apresentada imediatamente após a palavra `switch` e entre `parênteses`. Essa `expressão` será comparada com cada `caso` fornecido e caso seja encontrada uma **equivalência** a `expressão` ou `bloco de comandos` imediatamente após os `dois pontos` do `caso` será executada. Caso nenhum dos casos corresponda à `expressão` dada, a `expressão` ou `bloco de comandos` imediatamente após os `dois pontos` do caso `default` será executada. A cláusula `default` é opcional.

A seguir é apresentada a sintaxe da declaração `switch... case... default...` em notação EBNF:

```
Switch                   ::= 'switch' '(' Expression ')' '{' Case+ Default? '}'
Case                     ::= 'case' Expression ':' Expression*
Default                  ::= 'default' ':' Expression*
```

O exemplo a seguir ilustra o uso da declaração `switch... case... default...`:

```
a = 1

// Declaração switch semelhante ao C.
switch (a) {
    case 0:
    case 1:
        system.println("a == 0 || a == 1 || a == 2")
    case 2:
        system.println("a == 2")
        break
    default:
        system.println("a = " + a)
        system.println("a != 1 && a != 2")
}
```

## Estruturas de repetição

Estruturas de repetição permitem executar uma sessão de programa um número de vezes ou até que uma condição seja satisfeita. MaiaScript oferece quatro estruturas de repetição: `do... while`, `while...`, `for` e `foreach`. Todas essas estruturas estão disponíveis tanto no MaiaScript quanto no MaiaAssembly. Nas próximas sessões serão apresentadas essas declarações, assim como exemplos de suas utilizações.

### Declaração Faça...

A declaração `do... while...` executa uma `expressão` ou `bloco de comandos` `enquanto` uma dada `condição` for avaliada como `verdadeira`. A diferença desta declaração e da declaração `while...` é que esta declaração **executa pelo menos uma vez** a sessão de código, mesmo que a `condição` já seja `falsa` quando o fluxo de execução do programa chegar a ela, enquanto a declaração `while...` **não executará nenhuma vez** caso a `condição` já seja `falsa` quando o fluxo de execução do programa chegar a ela. Caso se deseje interromper a execução do **laço** antes que a `condição` se torne `falsa`, pode-se utilizar a declaração `break`. Caso se deseje interromper a execução da iteração atual do **laço** antes que o **bloco de comandos** tenha sido completamente executado e saltar para a próxima iteração, pode-se utilizar a declaração `continue`.

A seguir é apresentada a sintaxe da declaração `do... while...` em notação EBNF:

```
Do                       ::= 'do' Expression 'while' '(' Expression ')'
Break                    ::= 'break'
Continue                 ::= 'continue'
```

O exemplo a seguir ilustra o uso da declaração `do... while...`:

```
a = 0

do {
    system.println(a)
    a++
} while (a < 10);
```

### Declaração Enquanto...

A declaração `while...` executa uma `expressão` ou `bloco de comandos` `enquanto` uma dada `condição` for avaliada como `verdadeira`. A diferença desta declaração e da declaração `do... while...` é que aquela declaração **executa pelo menos uma vez** a sessão de código, mesmo que a `condição` já seja `falsa` quando o fluxo de execução do programa chegar a ela, enquanto a declaração `while...` **não executará nenhuma vez** caso a `condição` já seja `falsa` quando o fluxo de execução do programa chegar a ela. Caso se deseje interromper a execução do **laço** antes que a `condição` se torne `falsa`, pode-se utilizar a declaração `break`. Caso se deseje interromper a execução da iteração atual do **laço** antes que o **bloco de comandos** tenha sido completamente executado e saltar para a próxima iteração, pode-se utilizar a declaração `continue`.

A seguir é apresentada a sintaxe da declaração `while...` em notação EBNF:

```
While                    ::= 'while' '(' Expression ')' Expression
```

O exemplo a seguir ilustra o uso da declaração `while...`:

```
a = 0

while (a < 10) {
    if (a % 2 == 0) {
        continue
    }
    if (a >= 5) {
        system.println("Break the loop.")
        break
    }
    system.println(a)
    a++
}
```

### Declaração Para...

A declaração `for...` executa uma `expressão` ou `bloco de comandos` `enquanto` uma dada `condição` for avaliada como `verdadeira`. A diferença desta declaração e da declaração `while...` é que aquela declaração requer um controle interno da `condição` de execução para que em algum momento a `condição` se torne falsa e a execução do código seja interrompida. Esta declaração permite passar três argumentos: uma `expressão que será executado antes da primeira interação`, uma `expressão condicional` e uma `expressão que será avaliada ao final de cada iteração`. Pode-se usar o `primeiro parâmetro` para **inicializar uma variável de controle**, e o `último parâmetro` para **modificá-lo**. Caso se deseje interromper a execução do **laço** antes que a `condição` se torne `falsa`, pode-se utilizar a declaração `break`. Caso se deseje interromper a execução da iteração atual do **laço** antes que o **bloco de comandos** tenha sido completamente executado e saltar para a próxima iteração, pode-se utilizar a declaração `continue`.

A seguir é apresentada a sintaxe da declaração `for...` em notação EBNF:

```
For                      ::= 'for' '(' Expression ';' Expression ';' Expression ')' Expression
```

O exemplo a seguir ilustra o uso da declaração `for...`:

```
b = [1, 2, 3]

for (a = 0; a < 10; ++a) {
    system.println(a)
}

for (i = 0; i < b.length; i++) {
    system.println(b[i])
}
```

### Declaração Para cada...

A declaração `foreach...` executa uma `expressão` ou `bloco de comandos` `para cada` elemento de um `vetor associativo` ou `objeto`. Esta declaração recebe três parâmetros: um `vetor associativo` ou `objeto`, uma `variável para conter a chave do vetor` ou `nome da propriedade do objeto` e uma `variável para conter o valor do elemento do vetor` ou objeto. Caso se deseje interromper a execução do **laço** antes que a `condição` se torne `falsa`, pode-se utilizar a declaração `break`. Caso se deseje interromper a execução da iteração atual do **laço** antes que o **bloco de comandos** tenha sido completamente executado e saltar para a próxima iteração, pode-se utilizar a declaração `continue`.

A seguir é apresentada a sintaxe da declaração `foreach...` em notação EBNF:

```
ForEach                  ::= 'foreach' '(' Expression ';' Expression ';' Expression ')' Expression
```

O exemplo a seguir ilustra o uso da declaração `foreach...`:

```
c = {a: 1, b: 2}

// Declaração foreach semelhante ao Tcl.
foreach(c; key; value) {
    system.println(key + ": " + value)
}
```

## Funções

Funções e procedimentos são sub-rotinas de programa que podem ser executadas invocando-se seus nomes. MaiaScript suporta diversos tipos de funções. Nas próximas sessões discutiremos cada um deles.

A seguir é apresentada a sintaxe para os diversos tipos de `funções` MaiaScript em notação EBNF:

```
FunctionDeclaration      ::= Identifier ('.' Identifier)* '(' Arguments? ')' '=' Expression
                           | Identifier ('.' Identifier)* '(' Arguments? ')' '?=' Block
                           | Identifier ('.' Identifier)* '(' Arguments? ')' '#=' Block
                           | Identifier ('.' Identifier)* '(' Arguments? ')' ':=' Block
                           | Type? Identifier ('.' Identifier)* '(' Arguments? ')' Block
                           | Type? Identifier ('.' Identifier)* '(' Arguments? ')' Script
Return                   ::= 'return' Expression
```

### Declaração de uma função

Declaramos uma `função` escrevendo seu `nome`, seguido de `parênteses`, que podem ou não conter `argumentos` separados por `vírgulas`, `,`, e um `bloco de comandos` entre `chaves`, `{}`. Funções em MaiaScript podem ou não ter `tipos de retornos` declarados e utilizar ou não `operadores especiais de atribuição`, `=`, `?=`, `#=`, `:=`, em sua declaração.

Caso um `tipo de retorno` seja indicado na declaração da função, ela será interpretada como sendo uma função em **MaiaAssembly** ou em **WebAssembly**. Nos dois casos deve-se especificar os `tipos dos valores` dos argumentos da função caso ela possua `argumentos`. Se as `chaves`, `/{ /}` dos `blocos de comandos` forem precedidas do caractere `/` a função será interpretada como sendo em **WebAssembly**, caso contrário será considerada como sendo em **MaiaAssembly**. Funções MaiaScript podem ser **recursivas**, ou seja chamar a si mesmas para executar tarefas complexas. O exemplo a seguir ilustra a função `factorial` implementada usando um algoritmo recursivo:

```
// Uma função recursiva.
factorial(n) {
    if (n == 0 || n == 1) {
        return 1
    }
    return n * factorial(n - 1)
}

system.println(factorial(5))
```

### Funções em linha

Para funções mais simples, que podem ser implementadas em apenas uma linha, pode-se usar a forma simplificada de declaração de funções. Esta forma permite escrever uma função da forma como se costuma fazer na matemática, utilizando-se o operador `atribuição`, `=`, e omitindo-se as chaves do `bloco de comandos`. O exemplo a seguir mostra a declaração de uma função do segundo grau:

```
// Uma função em linha.
f(x) = 2 * x ** 2 + x - 1

system.println(f(2))
```

### Funções assíncronas

Funções pode ser **executadas assincronamente**. Para tanto deve-se declarar a função utilizando-se o `operador de execução assíncrona`, `?=`. Para esperar a **função assíncrona** terminar sua execução, bloqueado o **fluxo de execução** do resto do programa, deve-se `atribuir` a função a uma `variável` utilizando-se o `operador de execução assíncrona`, `?=`.

```
// Uma função assíncrona.
f(x) ?= {
    return x
}

// Uma chamada de função assíncrona.
a ?= f(2)
```

### Funções paralelas

MaiaScript permite criar funções paralelas usando **threads** ou **núcleos de GPU**. Nos dois casos as funções precisam ser do tipo `kernel`. Funções `kernel` devem ser criadas usando-se o `operador de declaração de função kernel`, `#=`. Uma função `kernel` é compilada de forma diferente das demais funções. Elas não suportam operações com números complexos nem com matrizes. Somente os tipos de dados e recursos básicos do JavaScript são suportados. O exemplo a seguir mostra como criar uma **thread** em MaiaScript. Para maiores detalhes consulte a documentação da biblioteca `task` disponível na pasta `docs` da sua distribuição do compilador MaiaScript.

```
// Uma função paralela.
task1(x) #= {
    i = 0
    timedCount #= () {
        i = i + 1
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

### Funções em MaiaAssembly

**MaiaAssembly** é uma linguagem de programação otimizada para compilação para **WebAssembly**. Ela permite criar algoritmos tão rápidos quanto programas escritos em linguagem C, embutidos em programas de alto nível em MaiaScript. Funções em **MaiaAssembly** são tipadas, o que significa que é preciso declarar os tipos das funções e variáveis no momento de suas criações. Os tipos suportados em **MaiaAssembly** são `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32 bits`, `f32` e `real 64 bits`, `f64`. Todos as estruturas de decisão e de repetição do **MaiaScript** são suportados em **MaiaAssembly**. Além disso são suportados `vetores` de dimensões arbitrárias dos `tipos` de dados suportados. Não é possível passar objetos ou mesmo vetores como argumentos de funções **MaiaAssembly**, mas é possível importá-los. Para tanto utiliza-se a declaração `import`. Ela permite importar propriedades de objetos para dentro da função e utilizá-las como se fossem variáveis locais. Em **MaiaAssembly** é possível criar **variáveis globais** usando-se a declaração `global`. Variáveis globais são acessáceis de qualquer parte do programa. O exemplo a seguir mostra como criar uma função para somar dois valores passados para ela como argumentos. A função também cria uma `variável local` para armazenar o resultado da soma. Variáveis locais devem ser declaradas no cabeçalho da função e devem aparecer após os argumentos da função.

```
// Uma função em MaiaAssembly.
i32 f4(i32 a, i32 b, local i32 c) {
    c = a + b;
    return c;
}

// Chamando uma função em MaiaAssembly.
c = f(1, 2)
```

### Funções em JavaScript

Funções em **JavaScript** podem ser declaradas precedendo as `chaves`, `/{ /}` dos `blocos de comandos` com o caractere `/`. **Funções em JavaScript não são compiladas**, sendo inseridas no código produzido pelo compilador da forma como tiverem sido escritas. O exemplo a seguir mostra como definir uma função em **JavaScript**:

```
// Uma função em JavaScript.
f(x) /{
    y = x + 1;
    return y;
}/

// Chamando uma função em JavaScript.
c = f(2)
```

### Funções em WebAssembly

Funções em **WebAssembly** são montadas pelo assembler e inseridas em forma binária no código resultante da compilação. Elas são tipadas, o que significa que é preciso declarar os tipos das funções e variáveis no momento de suas criações. Os tipos suportados em **WebAssembly** são `integer 32 bits`, `ì32`, `integer 64 bits`, `ì64`, `real 32 bits`, `f32` e `real 64 bits`, `f64`. `Variáveis locais` devem ser declaradas no cabeçalho da função e devem aparecer após os argumentos da função. O exemplo a seguir mostra como criar uma função para somar dois valores passados para ela como argumentos:

```
// Uma função em WebAssembly.
i32 f(i32 a, i32 b) /{
    (i32.add
      (local.get $a)
      (local.get $b)
    )
}/

// Chamando uma função em WebAssembly.
f = f(1, 2)
```

## Criando namespaces e objetos

**Namespaces** são uma forma de organizar funções e variáveis para constituir bibliotecas. O uso de `namespaces` não só torna mais organizado e reusável o código, mas também tornam o acesso aos recursos das bibliotecas mais eficiente. Todo `namespace` é um `objeto`, mas `namespaces` não são `construtores de objetos`. Para criar `objetos` devemos criar `construtores` para eles. Nas próximas sessões veremos como criar `namespaces` e `construtores de objetos`.

### Criando Namespaces

Criamos um `namespace` definindo um `nome` para ele e um `bloco de código` contendo variáveis e funções.

A seguir é apresentada a sintaxe para criação de `namespaces` em notação EBNF:

```
NamespaceDeclaration     ::= Identifier ('.' Identifier)* Block
```

O exemplo a seguir ilustra como criar um `namespace` contendo uma `variável`, `propriedade` e uma `função`, `método`:

```
// Criando um namespace (um objeto)
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

### Construtores de Objetos

**Construtores de objetos** permitem criar `instancias de classes` definidas por eles. `Classes` são **moldes** para `objetos`. Elas definem suas `propriedades`, características mutáveis em tempo de execução, e seus `métodos`, funcionalidades dos objetos. Para criar um `construtor de objetos` definimos uma função utilizando o `operador para criação de objetos`, `:=`. Para **instanciar** um `objeto` atribuímos a uma variável o valor de retorno do `construtor de objetos`, utilizando o `operador para criação de objetos`, `:=`. O exemplo a seguir cria uma `objeto` que possui uma propriedade `y` e atribui a essa variável o valor passado para o construtor no momento de sua criação:

```
// Um construtor de objeto.
A(x) := {
    y = x
}

c := A(2)

system.println(c.y);
```


## Redes complexas e sociais

MaiaScript fornece diversas funções para criação e **análise de redes complexas e sociais**. Esses recursos estão disponíveis nas bibliotecas `cna`e `snet`. Os exemplos a seguir mostram as aplicações mais comuns para as funções dessas bibliotecas. Para uma referência completa consulte a documentação disponível na pasta `docs` de sua distribuição do compilador MaiaScript.

```
// Cria um arquivo de rede no formato Pajek.
fileContents = ""
fileContents = fileContents + "*Vertices 10" + "\r\n"
fileContents = fileContents + "1 \"v1\" -13.53320569881955 15.024369378567805 1" + "\r\n"
fileContents = fileContents + "2 \"v2\" 138.57890381783866 -149.73844730901712 1" + "\r\n"
fileContents = fileContents + "3 \"v3\" -195.0525404708813 294.7061191626409 1" + "\r\n"
fileContents = fileContents + "4 \"v4\" -4.710077309561689 -119.03537285786881 1" + "\r\n"
fileContents = fileContents + "5 \"v5\" 276.72724773173434 -241.1655959044472 1" + "\r\n"
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

// Objeto para conter as propriedades da rede.
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

// Converte o arquivo em uma matriz de adjacência.
property.adj = cna.parsePajekFile(fileContents, property)

// Calcula a densidade da rede.
property.networkDensity = cna.getDensity(property.adj, property.directed)

// Calcula os graus dos vértices e o grau médio da rede.
property.networkDegree = cna.getDegrees(property.adj, property.directed)
property.networkAverageDegree = cna.getAverageDegree(property.networkDegree)

// Calcula os coeficientes de aglomeração dos vértices e o coeficiente de aglomeração médio da rede.
property.networkClustering = cna.getClustering(property.adj, property.directed)
property.networkAverageClustering = cna.getAverageClustering(property.networkClustering)

// Calcula os caminhos mínimos entre os vértices e o caminho mínimo médio da rede.
property.networkShortestPath = cna.getShortestPath(property.adj)
property.networkAverageShortestPath = cna.getAverageShortestPath(property.networkShortestPath)

// Calcula o diâmetro da rede.
property.networkDiameter = cna.getDiameter(property.networkShortestPath)

// Calcula a eficiência global da rede.
property.networkGlobalEfficiency = cna.getGlobalEfficiency(property.networkVertexEfficiency)
```

## Redes neurais artificiais

MaiaScript fornece funções para criação e treinar **redes neurais artificiais** de diversas topologias. Esses recursos estão disponíveis na biblioteca `ann`. Os exemplos a seguir mostram as aplicações mais comuns para as funções dessa biblioteca. Para uma referência completa consulte a documentação disponível na pasta `docs` de sua distribuição do compilador MaiaScript.

```
// Callback.
trainingCallback(epochs, RSS, correctness, ETL) {
    system.println("Epochs: " + core.toString(epochs) + ", RSS: " + core.toString(RSS) + ", Correctness: " + core.toString(correctness) + ", ETL: " + core.toString(ETL))
}

// Dados para treinar.
// O algoritmo de treinamento espera uma matriz com uma linha para cada dado e uma coluna para cada neurônio de entrada ou saída.
dataX = [[0.00],[0.25],[0.50],[0.75],[1.00],[1.25],[1.50],[1.75],[2.00],[2.25],[2.50],[2.75],[3.00],[3.25],[3.50],[3.75],[4.00],[4.25],[4.50],[4.75],[5.00],[5.25],[5.50],[5.75],[6.00],[6.25],[6.50],[6.75],[7.00],[7.25],[7.50],[7.75],[8.00],[8.25],[8.50],[8.75],[9.00],[9.25],[9.50],[9.75],[10.00]]
dataY = [[2.0000],[2.2197],[2.3811],[2.5136],[2.7310],[2.7827],[2.8327],[3.0351],[2.9551],[3.3973],[3.5117],[3.5909],[3.7345],[3.8419],[4.0952],[4.2879],[4.4000],[4.8764],[5.2843],[5.9241],[6.3302],[6.9608],[7.3044],[7.6791],[8.2819],[9.0139],[9.3387],[10.0420],[10.4000],[10.6437],[10.4786],[10.4928],[10.7082],[10.6233],[10.8862],[10.6830],[10.8393],[10.9186],[10.8814],[10.9779],[11.0000]]

nData = core.length(dataX)

// Cria uma rede neural Perceptron multicamadas.
nn = ann.createANN("mlp", 0, 0, 0, 0, 1, 1, 1, 3)
// Displays the untrained neural network.
system.println("ANN before be prepared: " + core.toString(nn))
system.println(core.toString(ann.getLabels(nn)))

// Atribui pesos iniciais aleatórios às sinapses neurais.
nn = ann.prepare(nn, true, true, true)
system.println(core.toString("ANN after be prepared: " + core.toString(nn)))

// Treina a rede neural.
statistics = ann.training(nn, dataX, dataY, 0.005, "tanh", "linear", "none", [1, 0], 2000, 0.001, trainingCallback, 100)
// Displays training statistics.
// system.println("Statistics: " + core.toString(statistics))

// Exibe a rede neural treinada.
system.println("Trained ANN: " + core.toString(nn))

// Usa a rede treinada para estimar o valor da função.

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

## Banco de dados SQL

MaiaScript suporta nativamente o banco de dados **SQLite** mas pode utilizar qualquer banco de dados suportado pelo **Node.js**. Esses recursos estão disponíveis na biblioteca `core`. O exemplo a seguir cria um banco de dados, uma tabela e insere dados na tabela criada. Para uma referência completa consulte a documentação disponível na pasta `docs` de sua distribuição do compilador MaiaScript.

```
dataHandler(transaction, results) {
}

errorHandler(transaction, error) {
}

createTable(transaction) {
    scheme = ""
    scheme = scheme + "CREATE TABLE people(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
    scheme = scheme + "name TEXT NOT NULL DEFAULT 'John Doe',"
    scheme = scheme + "shirt TEXT NOT NULL DEFAULT 'Purple');"
    transaction.executeSql(scheme, [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES ('Joe', 'Green');", [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES ('Mark', 'Blue');", [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES ('Phil', 'Orange');", [], dataHandler, errorHandler)
    transaction.executeSql("insert into people (name, shirt) VALUES ('jdoe', 'Purple');", [], dataHandler, errorHandler)
}

// Abre o banco de dados se ele existir ou cria um novo caso ele não exista.
db = core.openSQLDatabase("Test", "1.0", "Test", 65536)

// Cria uma tabela e insere dados nela.
if (typeof(db) != "undefined") {
    db.transaction(createTable)
}
```

## Programação paralela usando GPU

É possível acelerar o processamento em alguns problemas usando **programação paralela**. MaiaScript permite paralelismo real usando **núcleos de GPU** se este recurso estiver disponível na máquina hospedeira. Caso não esteja, o compilador MaiaScript compilará o programa para execução sequencial. Funções de computação em GPU são chamadas *shaders*. Essas funções são compiladas de modo diferente pelo compilador MaiaScript e não suportam números complexos ou cálculos com matrizes. Os recursos de programação com GPU estão disponíveis na biblioteca `gpu`. Para uma referência completa consulte a documentação disponível na pasta `docs` de sua distribuição do compilador MaiaScript.

O exemplo a seguir mostra como criar uma função para multiplicação paralela de duas matrizes. Também é implementada uma versão sequencial do cálculo para comparação de desempenho.

```
// Crie duas matrizes de 512x512.
a = core.zero(512, 512)
b = core.zero(512, 512)

// Preenche as matrizes.
for (i = 0; i < 512; i = i + 1) {
    for (j = 0; j < 512; j = j + 1) {
        v = i * 512 + j
        a[i, j] = v
        b[i, j] = v
    }
}

// Função paralela.
shader #= (a, b) {
    local sum = 0
    for (local i = 0; i < 512; i = i + 1) {
        sum = sum + a[this.thread.y, i] * b[i, this.thread.x]
    }
    return(sum)
}

// Função de computação usando a GPU.
useGPU ?= () {
    device = gpu.new()
    multiplyMatrices = device.createKernel(shader)
    multiplyMatrices.setOutput([512, 512])
    
    startTime := Date()
    c = multiplyMatrices(a, b)
    endTime := Date()
    
    elapsedTime = endTime - startTime
    
    system.log("GPU result:")
    system.log("c[511,511]: " + c[511,511])
    system.log("Elapsed time: " + elapsedTime + " ms\n")
}

// Função de computação usando a CPU.
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
    
    system.log("CPU result:")
    system.log("d[511,511]: " + d[511,511])
    system.log("Elapsed time: " + elapsedTime + " ms\n")
}

// Iniciar cálculo.
useGPU()
useCPU()
```

## Estatística avançada

MaiaScript oferece diversas funções estatísticas para operações com **matrizes** e arquivos **CSV**. Essas funções estão disponíveis nas bibliotecas `matrix`, `statistics` e `dfa`. A biblioteca `statistics` implementa funções para cálculos de **médias**, **desvios** e **erros padrões**, além de funções envolvendo **números aleatórios** e **distribuição normal**, incluído o cálculo da **inversa da distribuição normal**. A biblioteca `dfa` implementa cálculos de **DFA**, **DCCA** e **rhoDCCA**. Para uma referência completa consulte a documentação disponível na pasta `docs` de sua distribuição do compilador MaiaScript.

Os exemplos a seguir mostram aplicações comuns para as funções da biblioteca estatística:

```
a = [1,0,0;0,1,0;0,0,1]
b = [1,2,3;4,5,6;7,8,9]
c = [2,3,-1;4,4,-3;2,-3,1]
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
system.println("dim([1,2,3]) = " + core.toString(core.dim([1,2,3])))
system.println("d = " + core.toString(d))
system.println("e = " + core.toString(e))
```

## Computação algébrica

MaiaScript possui um **CAS (Computer Algebra System)** completo implementado na biblioteca `cas`. Esse CAS permite simplificar expressões, resolver equações e realizar operações complexas de álgebra linear e cálculo diferencial e integral. O CAS é baseado na biblioteca *open source* **Algebrite**. Para uma referência completa consulte a documentação oficial do projeto Algebrite em <http://algebrite.org>. A única excessão é que o Algebrite originalmente utiliza o operador `ˆ` para potenciação e em MaiaScript o operador de potenciação é `**`. Os exemplos a seguir mostram como realizar as operações mais comuns de cálculo com o CAS MaiaScript:

```
// Resolve uma expressão algébrica.
res = cas.eval("x + x")
system.showMessageDialog("x + x:\n\n" + res)

// Simplifica uma expressão.
res = cas.eval("simplify(cos(x)**2 + sin(x)**2)\n" +
               "simplify(a*b+a*c)\n" +
               "simplify(n!/(n+1)!)")
system.showMessageDialog("simplify(cos(x)**2 + sin(x)**2)\n" +
                         "simplify(a*b+a*c)\n" +
                         "simplify(n!/(n+1)!):\n\n" + res)

// Calcula a integral de uma expressão.
res = cas.eval("integral(x**2)\n" +
               "integral(x*y,x,y)")
system.showMessageDialog("integral(x**2)\n" +
                         "integral(x*y,x,y):\n\n" + res)

// Calcula a derivada de uma expressão.
res = cas.eval("d(x**2)\n" +
               "r=sqrt(x**2+y**2)\n" +
               "d(r,[x,y])")
system.showMessageDialog("d(x**2)\n" +
                         "r=sqrt(x**2+y**2)\n" +
                         "d(r,[x,y])\n\n" + res)
```