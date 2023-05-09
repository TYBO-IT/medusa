import { moduleOptions } from "./config"
import * as ProductModels from "@models"
import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql"
import { TSMigrationGenerator } from "@mikro-orm/migrations"

console.log(Object.values(ProductModels))

const ORMConfig: Options = {
  type: "postgresql",
  dbName: moduleOptions.database.clientUrl,
  entities: Object.values(ProductModels),
  schema: moduleOptions.database.schema,
  debug: false,
  migrations: {
    path: "../../src/migrations",
    pathTs: "../../src/migrations",
    glob: "!(*.d).{js,ts}",
    silent: true,
    dropTables: true,
    transactional: true,
    allOrNothing: true,
    safe: false,
    generator: TSMigrationGenerator,
  },
}

interface TestDatabase {
  orm: MikroORM | null
  manager: SqlEntityManager | null

  setupDatabase(): Promise<void>
  clearDatabase(): Promise<void>
  getManager(): SqlEntityManager
  getORM(): MikroORM
}

export const TestDatabase: TestDatabase = {
  orm: null,
  manager: null,

  getManager() {
    if (this.manager === null) {
      throw "manager entity not available"
    }

    return this.manager
  },

  getORM() {
    if (this.orm === null) {
      throw "orm entity not available"
    }

    return this.orm
  },

  async setupDatabase() {
    // Initializing the ORM
    this.orm = await MikroORM.init(ORMConfig)

    if (this.orm === null) {
      throw "ORM not configured"
    }

    this.manager = this.orm.em.fork()

    await this.orm.schema.refreshDatabase()
  },

  async clearDatabase() {
    if (this.orm === null) {
      throw "ORM not configured"
    }

    await this.orm.close(true)

    this.orm = null
    this.manager = null
  },
}
