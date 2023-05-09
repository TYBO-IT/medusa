import { Migration } from '@mikro-orm/migrations';

export class Migration20230509125902 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_collection" ("id" text not null, "title" text not null, "handle" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_collection_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_collection_handle_unique ON product_collection (handle) WHERE deleted_at IS NULL;');

    this.addSql('create table "product_tag" ("id" text not null, "value" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_tag_pkey" primary key ("id"));');

    this.addSql('create table "product_type" ("id" text not null, "value" text not null, "metadata" json null, "deleted_at" timestamptz null, constraint "product_type_pkey" primary key ("id"));');

    this.addSql('create table "product" ("id" text not null, "title" text not null, "handle" text not null, "subtitle" text null, "description" text null, "is_giftcard" boolean not null default false, "status" text check ("status" in (\'draft\', \'proposed\', \'published\', \'rejected\')) not null, "thumbnail" text null, "weight" text null, "length" text null, "height" text null, "width" text null, "origin_country" text null, "hs_code" text null, "mid_code" text null, "material" text null, "collection_id" text null, "type_id" text null, "discountable" boolean not null default true, "external_id" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "metadata" jsonb null, constraint "product_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_handle_unique ON product (handle) WHERE deleted_at IS NULL;');

    await this.addSql(`
      CREATE TABLE IF NOT EXISTS "product_variant" (
        "id" character varying NOT NULL,
        "title" character varying NOT NULL,
        "product_id" character varying,
        "sku" character varying,
        "barcode" character varying,
        "ean" character varying,
        "upc" character varying,
        "inventory_quantity" integer NOT NULL,
        "allow_backorder" boolean NOT NULL DEFAULT false,
        "manage_inventory" boolean NOT NULL DEFAULT true,
        "hs_code" character varying,
        "origin_country" character varying,
        "mid_code" character varying,
        "material" character varying,
        "weight" integer,
        "length" integer,
        "height" integer,
        "width" integer,
        "variant_rank" integer DEFAULT '0',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "metadata" jsonb,

        CONSTRAINT "PK_product-variant-id" PRIMARY KEY ("id"))
      `
    );

    this.addSql('alter table "product" add constraint "product_collection_id_foreign" foreign key ("collection_id") references "product_collection" ("id") on update cascade on delete set null;');
    this.addSql('alter table "product" add constraint "product_type_id_foreign" foreign key ("type_id") references "product_type" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_collection_id_foreign";');

    this.addSql('alter table "product" drop constraint "product_type_id_foreign";');

    this.addSql('drop table if exists "product_collection" cascade;');

    this.addSql('drop table if exists "product_tag" cascade;');

    this.addSql('drop table if exists "product_type" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "product_variant" cascade;');
  }

}