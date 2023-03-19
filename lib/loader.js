// @ts-check
require('reflect-metadata')
const { NestFactory } = require('@nestjs/core')
const { DevtoolsModule } = require('@nestjs/devtools-integration')

/**
 * @typedef { {port?:number, http?:boolean} } DevtoolsRegisterOpts
 */

/**
 * @typedef {import('@nestjs/common').DynamicModule | import('@nestjs/common').Type} NestjsModule
 */

const debug = process.env.DEBUG?.includes('nestjs-devtools-loader')
    ? (msg) => console.debug('[nestjs-devtools-loader]', msg)
    : () => {}

/**
 * @param {DevtoolsRegisterOpts} devtoolsRegisterOpts
 * @returns {void}
 */
module.exports.loader = function loader(devtoolsRegisterOpts) {
  const originalCreateMethod = NestFactory.create

  // Ensure that we'll make this monkey patching only once
  if (NestFactory['__nestjs_devtools_loader__']) return
  NestFactory['__nestjs_devtools_loader__'] = true

  /**
   * @param {import('@nestjs/common').Type} moduleToResolve
   * @returns {NestjsModule[]}
   */
  const resolveModuleImports = (moduleToResolve) => Reflect.getMetadata('imports', moduleToResolve) || []
  /**
   * @param {import('@nestjs/common').Type} targetModule
   * @param {NestjsModule} moduleToImport
   */
  const importModuleInto = (targetModule, moduleToImport) => {
    const currImportsList = resolveModuleImports(targetModule);
    Reflect.defineMetadata('imports', [moduleToImport, ...currImportsList], targetModule)
  }

  NestFactory.create = function create(...args) {
    // create(module, options)
    // create(module, httpAdapter, options)
    const optsIdx = args.length === 3 ? 2 : 1

    /** @type {import('@nestjs/common').NestApplicationOptions} */
    const optsToMerge = {
      snapshot: true,
    }
    args[optsIdx] = Object.assign(
      args[optsIdx] || {},
      optsToMerge,
    )

    const rootModule = args[0];
    if (typeof rootModule === 'function') {
      const currImportsList = resolveModuleImports(rootModule);
      const isDevToolsRegisteredImported = currImportsList.some((importedModule) => {
        if (typeof importedModule === 'object' && 'module' in importedModule) {
          return importedModule.module === DevtoolsModule
        }
        return false
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
