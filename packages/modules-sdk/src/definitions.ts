import {
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
} from "@medusajs/types"

export enum Modules {
  EVENT_BUS = "eventBus",
  STOCK_LOCATION = "stockLocationService",
  INVENTORY = "inventoryService",
  CACHE = "cacheService",
  PRODUCT = "productService",
}

export enum ModuleQueryProperty {
  STOCK_LOCATION = "stock_location",
  INVENTORY = "inventory",
  PRODUCT = "product",
}

export const ModuleQueryPropertyMap = new Map<ModuleQueryProperty, Modules>([
  [ModuleQueryProperty.STOCK_LOCATION, Modules.STOCK_LOCATION],
  [ModuleQueryProperty.INVENTORY, Modules.INVENTORY],
  [ModuleQueryProperty.PRODUCT, Modules.PRODUCT],
])

export const ModulesDefinition: { [key: string]: ModuleDefinition } = {
  [Modules.EVENT_BUS]: {
    key: Modules.EVENT_BUS,
    registrationName: "eventBusModuleService",
    defaultPackage: "@medusajs/event-bus-local",
    label: "EventBusModuleService",
    canOverride: true,
    isRequired: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.STOCK_LOCATION]: {
    key: Modules.STOCK_LOCATION,
    registrationName: "stockLocationService",
    defaultPackage: false,
    label: "StockLocationService",
    isRequired: false,
    canOverride: true,
    isQueryable: true,
    queryPropertyName: ModuleQueryProperty.STOCK_LOCATION,
    dependencies: ["eventBusService"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.INVENTORY]: {
    key: Modules.INVENTORY,
    registrationName: "inventoryService",
    defaultPackage: false,
    label: "InventoryService",
    isRequired: false,
    canOverride: true,
    isQueryable: true,
    queryPropertyName: ModuleQueryProperty.INVENTORY,
    dependencies: ["eventBusService"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CACHE]: {
    key: Modules.CACHE,
    registrationName: "cacheService",
    defaultPackage: "@medusajs/cache-inmemory",
    label: "CacheService",
    isRequired: true,
    canOverride: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PRODUCT]: {
    key: Modules.PRODUCT,
    registrationName: "productService",
    defaultPackage: false,
    label: "ProductService",
    isRequired: false,
    canOverride: true,
    isQueryable: true,
    queryPropertyName: ModuleQueryProperty.PRODUCT,
    dependencies: [],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
    },
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
