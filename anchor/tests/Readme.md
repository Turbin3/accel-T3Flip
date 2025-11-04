## Raw anchor project template and testing:
> In case the current project template can't run anchor test or script related to it, use this guide.
- cd /to/anchor/project/root
- copy package.json from the root, or create one with necessary testing libraries like coral-xyz/anchor, chai, etc.
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