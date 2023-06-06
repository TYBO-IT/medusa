import { Modules } from "@medusajs/modules-sdk"
import { JoinerServiceConfig } from "@medusajs/types"

export const joinerConfig: JoinerServiceConfig = {
  serviceName: Modules.PRODUCT,
  primaryKeys: ["id", "handle"],
}
