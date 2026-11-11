import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const tz = (name: string) => timestamp(name, { withTimezone: true });
const createdAt = () => tz("created_at").notNull().defaultNow();

export const roleEnum = pgEnum("role", ["admin", "client"]);

/** Administrador e clientes. Só o admin cria contas. */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: roleEnum("role").notNull().default("client"),
  name: text("name").notNull(),
  /** Cliente: número gerado pelo admin. Admin: nulo (entra por e-mail). */
  login: text("login").unique(),
  /** Usado para recuperar a senha (sempre em minúsculas). */
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").notNull().default(true),
  /** Bloqueio temporário por excesso de tentativas */
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lockedUntil: tz("locked_until"),
  createdAt: createdAt(),
  updatedAt: tz("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Uma conta pode ter várias galerias (casamento, pré-wedding...). */
export const galleries = pgTable(
  "galleries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    eventDate: date("event_date"),
    coverPhotoId: uuid("cover_photo_id"),
    /** Padrão: 365 dias, como diz a página do cliente. */
    expiresAt: tz("expires_at")
      .notNull()
      .default(sql`now() + interval '365 days'`),
    allowDownload: boolean("allow_download").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [index("galleries_user_idx").on(t.userId)],
);

/** Os arquivos ficam no storage privado; aqui só as chaves. */
export const photos = pgTable(
  "photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => galleries.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    /** Original em alta resolução (só para download autorizado) */
    originalKey: text("original_key").notNull(),
    /** Versão reduzida, sem metadados (usada na tela e nos links de visualização) */
    previewKey: text("preview_key").notNull(),
    thumbKey: text("thumb_key").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("photos_gallery_idx").on(t.galleryId, t.position)],
);

/** Links de visualização privada (só ver, sem baixar). */
export const shareLinks = pgTable(
  "share_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => galleries.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Só o hash fica salvo: o link completo aparece uma única vez, ao criar. */
    tokenHash: text("token_hash").notNull().unique(),
    label: text("label").notNull().default("Link para família"),
    expiresAt: tz("expires_at"),
    revokedAt: tz("revoked_at"),
    viewCount: integer("view_count").notNull().default(0),
    lastViewedAt: tz("last_viewed_at"),
    createdAt: createdAt(),
  },
  (t) => [index("share_links_gallery_idx").on(t.galleryId)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    userAgent: text("user_agent"),
    expiresAt: tz("expires_at").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const passwordResets = pgTable(
  "password_resets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: tz("expires_at").notNull(),
    usedAt: tz("used_at"),
    createdAt: createdAt(),
  },
  (t) => [index("password_resets_user_idx").on(t.userId)],
);

/** Limite de tentativas (por IP, por conta, por e-mail...) funcionando em serverless. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: tz("reset_at").notNull(),
});