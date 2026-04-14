import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const agentRoleEnum = pgEnum('agent_role', [
  'ceo',
  'realtor',
  'loan_originator',
  'office_manager',
  'realtor_associate',
]);

export const propertyStatusEnum = pgEnum('property_status', [
  'for_sale',
  'for_rent',
  'pending',
  'sold',
  'rented',
]);

export const propertyTypeEnum = pgEnum('property_type', [
  'residential',
  'condo',
  'townhouse',
  'commercial',
  'multi_family',
  'land',
  'investment',
]);

export const leadInterestEnum = pgEnum('lead_interest', [
  'buying',
  'selling',
  'renting',
  'mortgage',
  'other',
]);

export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'qualified',
  'closed',
  'lost',
]);

export const loanProgramTypeEnum = pgEnum('loan_program_type', [
  'fha',
  'va',
  'usda',
  'conventional',
  'dscr',
  'hometown_heroes',
  'first_time_buyer',
]);

export const blogCategoryEnum = pgEnum('blog_category', [
  'investing',
  'market_update',
  'mortgage_tips',
  'buying_tips',
  'selling_tips',
  'company_news',
]);

export const siteSettingTypeEnum = pgEnum('site_setting_type', [
  'string',
  'number',
  'boolean',
  'json',
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  role: agentRoleEnum('role').notNull().default('realtor'),
  phone: varchar('phone', { length: 30 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  bio: text('bio').notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  specialties: jsonb('specialties').$type<string[]>().default([]),
  yearsExperience: integer('years_experience').notNull().default(0),
  licenseNumber: varchar('license_number', { length: 50 }),
  instagramUrl: varchar('instagram_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  facebookUrl: varchar('facebook_url', { length: 500 }),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  status: propertyStatusEnum('status').notNull(),
  propertyType: propertyTypeEnum('property_type').notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  sqft: integer('sqft').notNull(),
  address: varchar('address', { length: 500 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zip: varchar('zip', { length: 20 }).notNull(),
  images: jsonb('images').$type<{ url: string; caption: string; order: number }[]>().default([]),
  features: jsonb('features').$type<string[]>().default([]),
  agentId: integer('agent_id').references(() => agents.id),
  isFeatured: boolean('is_featured').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(true),
  yearBuilt: integer('year_built'),
  parking: integer('parking').notNull().default(0),
  lotSize: varchar('lot_size', { length: 100 }),
  mlsId: varchar('mls_id', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  interest: leadInterestEnum('interest').notNull(),
  message: text('message'),
  source: varchar('source', { length: 255 }),
  propertyId: integer('property_id').references(() => properties.id),
  status: leadStatusEnum('status').notNull().default('new'),
  assignedAgentId: integer('assigned_agent_id').references(() => agents.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  reviewerName: varchar('reviewer_name', { length: 255 }).notNull(),
  reviewerRole: varchar('reviewer_role', { length: 255 }),
  reviewerAvatarUrl: varchar('reviewer_avatar_url', { length: 500 }),
  rating: integer('rating').notNull(),
  reviewText: text('review_text').notNull(),
  isFeatured: boolean('is_featured').notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImageUrl: varchar('cover_image_url', { length: 500 }).notNull(),
  authorId: integer('author_id').references(() => agents.id),
  category: blogCategoryEnum('category').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  readTimeMinutes: integer('read_time_minutes').notNull().default(5),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const loanPrograms = pgTable('loan_programs', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  type: loanProgramTypeEnum('type').notNull(),
  tagline: varchar('tagline', { length: 500 }),
  description: text('description').notNull(),
  features: jsonb('features').$type<string[]>().default([]),
  requirements: jsonb('requirements').$type<string[]>().default([]),
  minDownPayment: varchar('min_down_payment', { length: 50 }),
  maxLoanAmount: varchar('max_loan_amount', { length: 50 }),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  type: siteSettingTypeEnum('type').notNull().default('string'),
  description: varchar('description', { length: 500 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Auth table for admin
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 500 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const agentsRelations = relations(agents, ({ many }) => ({
  properties: many(properties),
  leads: many(leads),
  blogPosts: many(blogPosts),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(agents, {
    fields: [properties.agentId],
    references: [agents.id],
  }),
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
  assignedAgent: one(agents, {
    fields: [leads.assignedAgentId],
    references: [agents.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(agents, {
    fields: [blogPosts.authorId],
    references: [agents.id],
  }),
}));
