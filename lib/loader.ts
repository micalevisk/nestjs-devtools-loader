import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { DynamicModule, Type, NestApplicationOptions } from '@nestjs/common'

type DevtoolsRegisterOpts = {
  port?: number
  http?: boolean
}

type NestjsModule = DynamicModule | Type<any>

const debug = (msg: string) =>
  process.env.DEBUG?.includes('nestjs-devtools-loader')
    ? console.debug('[nestjs-devtools-loader]', msg)
    : () => {}

export function loader(devtoolsRegisterOpts: DevtoolsRegisterOpts) {
  const originalCreateMethod = NestFactory.create

  // Ensure that we'll make this monkey patching only once
  // @ts-expect-error
  if (NestFactory['__nestjs_devtools_loader__']) return
  // @ts-expect-error
  NestFactory['__nestjs_devtools_loader__'] = true

  const resolveModuleImports = (moduleToResolve: Type<any>) => Reflect.getMetadata('imports', moduleToResolve) || []
  const importModuleInto = (targetModule: Type<any>, moduleToImport: NestjsModule) => {
    const currImportsList = resolveModuleImports(targetModule);
    Reflect.defineMetadata('imports', [moduleToImport, ...currImportsList], targetModule)
  }

  NestFactory.create = function create(...args) {
    const opts = args.length === 3 ? args[2] : args[1];
    if (typeof opts === 'object') {
      (opts as NestApplicationOptions).snapshot = true;
    }

    const rootModule = args[0];
    if (typeof rootModule === 'function') {
      const currImportsList = resolveModuleImports(rootModule);
      const isDevToolsRegisteredImported = currImportsList.some((importedModule: NestjsModule) => {
        if (typeof importedModule === 'object' && 'module' in importedModule) {
          return importedModule.module === DevtoolsModule;
        }
        return false;
      })

      if (isDevToolsRegisteredImported) {
        debug('Devtools already registered');
      } else {
        debug(
          `Importing \`DevtoolsModule.register(${JSON.stringify(
            devtoolsRegisterOpts,
          )})\` into module \`${rootModule.name}\``,
        );
        importModuleInto(rootModule, DevtoolsModule.register(devtoolsRegisterOpts))
      }
    }

    return originalCreateMethod.apply(this, args)
  }
}
