# yzhanJSInterpreter  
![npm](https://img.shields.io/npm/v/yzhanjsinterpreter)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/yzhanjsinterpreter)
![npm](https://img.shields.io/npm/dt/yzhanjsinterpreter)
[![GitHub license](https://img.shields.io/github/license/mantoufan/yzhanjsinterpreter)](https://github.com/mantoufan/yzhanjsinterpreter/blob/main/LICENSE)  
A JavaScript Interpreter Using JS itself  
JavaScript 解释器，包含词法分析、语法解析和执行
## Demo
You could change JavaScript Code and view the result in realtime.  
[Online Demo](https://mantoufan.github.io/yzhanJSInterpreter)  
![DEMO PNG](https://s2.loli.net/2023/06/15/lwu5Cat9gox27dR.png)
## Setup
### Node.js
```javascript
npm i yzhanjsinterpreter
import yzhanJSInterpreter from 'yzhanjsinterpreter'
```
### Browser
```html
<script src="https://cdn.jsdelivr.net/npm/yzhanjsinterpreter@latest/docs/yzhanjsinterpreter.min.js"></script>
```
## Usage
### Declaration Code
```javascript
const code = `let a = 1;
let b = 1;
a <<= b++;
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  if ((i | 2) == '11') break;
  a++;
}
undefined && 1 ?? (0 || a + b);`
```
### Lexical Analyzer
```javascript
const lexResult = yzhanJSInterpreter.lex(code)
```
### Syntax Parser
```javascript
const parseResults = yzhanJSInterpreter.parse(lexResult)
```
### Executor
```javascript
const executeResult = yzhanJSInterpreter.execute(parseResults[0])
```
## Development
### Unit Testing
```shell
npm test
```
### Build
```shell
npm run build
```
### Preview
```shell
npm run dev
```
