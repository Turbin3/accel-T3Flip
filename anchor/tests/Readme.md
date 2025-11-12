## Raw anchor project template and testing:
> In case the current project template can't run anchor test or script related to it, use this guide.
- cd /to/anchor/project/root
- copy package.json from the root, or create one with necessary testing libraries like coral-xyz/anchor, chai, etc.
```
{
  "license": "ISC",
  "scripts": {
    "lint:fix": "prettier */*.js \"*/**/*{.js,.ts}\" -w",
    "lint": "prettier */*.js \"*/**/*{.js,.ts}\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.31.1"
  },
  "devDependencies": {
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "typescript": "^5.7.3",
    "prettier": "^2.6.2"
  }
}
```
- tsconfig.json with content
``` 
{
  "compilerOptions": {
    "types": ["mocha", "chai"],
    "typeRoots": ["./node_modules/@types"],
    "lib": ["es2015"],
    "module": "commonjs",
    "target": "es6",
    "esModuleInterop": true
  }
}
```