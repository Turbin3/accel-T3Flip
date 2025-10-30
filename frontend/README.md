# Frontend

This frontend is based on the solana-react-dapp template with nextjs, tailwind, wallet-ui, and codama.js

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the
command with `npm run`, eg: `npm run anchor`.

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Install dependencies

```shell
npm install
```

Start the app

```shell
npm run dev
```

Build the app

```shell
npm run build
```


#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the
Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program. This will also update
the constant in `anchor/src/basic-exports.ts` file.

```shell
npm run setup
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

