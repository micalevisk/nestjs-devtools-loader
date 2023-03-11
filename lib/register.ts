import { loader } from './loader'

const isDisabled = process.env.NESTJS_DEVTOOLS_LOADER_DISABLED === 'true'

if (!isDisabled) {
  loader(
    process.env.NESTJS_DEVTOOLS_LOADER
      ? JSON.parse(process.env.NESTJS_DEVTOOLS_LOADER)
      : {
          http: true,
          port: 8000,
        },
  )
}
