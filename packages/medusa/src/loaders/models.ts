import formatRegistrationName from "../utils/format-registration-name"
import glob from "glob"
import path from "path"
import { ClassConstructor, MedusaContainer } from "../types/global"
import { EntitySchema } from "typeorm"
import { asClass, asValue } from "awilix"

function formatModelName(modelName) {
  // Remove "Model" from the end of the string
  let formattedName = modelName.replace('Model', '');

  // Capitalize the first letter of the string
  formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

  return formattedName;
}

/**
 * Registers all models in the model directory
 */
export default (
  { container, isTest, rootDirectory }: { container: MedusaContainer; isTest?: boolean, rootDirectory?: string },
  config = { register: true }
) => {
  const corePath = isTest ? "../models/*.ts" : "../models/*.js"
  const modelExtensionsGlob = "dist/models/*.js"
  const coreFull = path.join(__dirname, corePath)
  const modelExtensionsFullGlob = rootDirectory ? path.join(rootDirectory, modelExtensionsGlob) : null
  const models: (ClassConstructor<unknown> | EntitySchema)[] = []

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: ["index.js", "index.ts"],
  })

  const modelExtensions = modelExtensionsFullGlob ? glob.sync(modelExtensionsFullGlob, {
    ignore: ["index.js"],
  }) : []
  const modelExtensionsMap = {}

  modelExtensions.forEach((modelExtensionPath) => {
    const extendedModel = require(modelExtensionPath) as ClassConstructor<unknown> | EntitySchema

    if (extendedModel) {
      Object.entries(extendedModel).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            if (config.register) {
              const name = formatRegistrationName(modelExtensionPath)

              modelExtensionsMap[name] = val
            }
          }
        }
      )
    }
  })

  core.forEach((fn) => {
    const loaded = require(fn) as ClassConstructor<unknown> | EntitySchema

    if (loaded) {
      Object.entries(loaded).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            if (config.register) {
              const name = formatRegistrationName(fn)

              // If an extension file is found, override it with that instead
              if (modelExtensionsMap[name]) {
                const coreModel = require(fn)
                const modelName = formatModelName(name)

                coreModel[modelName] = modelExtensionsMap[name]
                val = modelExtensionsMap[name]
              }

              container.register({
                [name]: asClass(val as ClassConstructor<unknown>),
              })

              container.registerAdd("db_entities", asValue(val))
            }

            models.push(val)
          }
        }
      )
    }
  })

  return models
}
