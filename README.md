# `nestjs-devtools-loader`

[![npm version](https://img.shields.io/npm/v/nestjs-devtools-loader.svg)](https://www.npmjs.com/package/nestjs-devtools-loader)
[![npm downloads](https://img.shields.io/npm/dt/nestjs-devtools-loader.svg)](https://www.npmjs.com/package/nestjs-devtools-loader)
[![supported nestjs versions](https://img.shields.io/badge/supported_versions-9-873131.svg?logo=nestjs)](https://nestjs.com)

A helper package to easily enable/disable [NestJS Devtools](https://docs.nestjs.com/devtools/overview) integration!

### What it does

1. Add `snapshot` to `true` for `NestFactory.create` call
2. Import `DevtoolsModule.register({ http: true, port: 8000 })` into the module passed to the `NestFactory.create` call

### Install

You must have `@nestjs/core`, `@nestjs/devtools-integration` and `reflect-metadata` installed!

```bash
npm install --save-dev nestjs-devtools-loader
```

### Usage

Note that if your root module (usually `AppModule`) already had `DevtoolsModule` imported, this package won't import it again.

#### Via preload module

You need to supply the `--require nestjs-devtools-loader/register` option to `node`  
With NestJS's CLI, you can do:

```bash
nest start --exec "node -r nestjs-devtools-loader/register"
#                       ^~ an alias for --require
```

If you want to change the default options that are supplied to `DevtoolsModule.register()`, use the environment variable: `NESTJS_DEVTOOLS_LOADER` like this:

```
NESTJS_DEVTOOLS_LOADER='{"http":true,"port":3001}'
```

#### Programmatically

```ts
import { loader } from 'nestjs-devtools-loader'
// ...
// Before calling `NestFactory.create()`:
loader({ http: true, port: 8000 })
```

#### Disable

If you want to disable the loader while still injecting it into your app, set the environment variable `NESTJS_DEVTOOLS_LOADER_DISABLED` to `"true"`

#### Debug

If the env. var. `DEBUG` contains the string `"nestjs-devtools-loader"` like:  
`DEBUG=nestjs-devtools-loader`  
you'll see if the loader was injected or not.
