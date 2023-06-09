import { FindConfig } from "../common"
import { JoinerServiceConfig } from "../joiner"
import { SharedContext } from "../shared-context"
import {
  FilterableProductCategoryProps,
  FilterableProductCollectionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductVariantProps,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductTagDTO,
  ProductVariantDTO,
} from "./common"

export interface IProductModuleService<
  TProduct = any,
  TProductVariant = any,
  TProductTag = any,
  TProductCollection = any,
  TProductCategory = any
> {
  __joinerConfig(): JoinerServiceConfig
  list(
    filter: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    context?: SharedContext
  ): Promise<ProductDTO[]>

  listAndCount(
    filter: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    context?: SharedContext
  ): Promise<[ProductDTO[], number]>

  listTags(
    filter: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    context?: SharedContext
  ): Promise<ProductTagDTO[]>

  listVariants(
    filter: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    context?: SharedContext
  ): Promise<ProductVariantDTO[]>

  listCollections(
    filter: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    context?: SharedContext
  ): Promise<ProductCollectionDTO[]>

  listCategories(
    filters: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: SharedContext
  ): Promise<ProductCategoryDTO[]>
}
