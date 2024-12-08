import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const sitesTable = pgTable('sites', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  code: varchar().notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
})

export const roleTypeTable = pgTable('role_type', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  code: varchar().notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
})

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  login_attempts: integer().notNull().default(0),
  password: varchar().notNull(),
  dob: varchar().notNull(),
  gender: varchar().notNull(),
  marital_status: varchar().notNull(),
  is_a_manager: boolean(),
  spouse_name: varchar(),
  spouse_dob: varchar(),
  number_of_dependents: integer(),
  joined_date: varchar(),
  emergency_contact_name: varchar(),
  emergency_contact_no: varchar(),
  alternate_contact_name: varchar(),
  alternate_contact_no: varchar(),
  temporary_address: varchar(),
  temporary_city: varchar(),
  temporary_state: varchar(),
  temporary_country: varchar(),
  temporary_postal_code: varchar(),
  permanent_address: varchar(),
  permanent_city: varchar(),
  permanent_state: varchar(),
  permanent_country: varchar(),
  permanent_postal_code: varchar(),
  mobile_no: varchar().unique(),
  email: varchar().unique(),
  department: varchar(),
  designation: varchar(),
  hobbies: varchar(),
  known_languages: varchar(),
  identification_type: varchar().notNull(),
  identification_number: varchar(),
  site_id: integer()
    .references(() => sitesTable.id)
    .notNull(),
  platform: varchar(),
  operating_system: varchar(),
  os_version: varchar(),
  manufacturer: varchar(),
  device_name: varchar(),
  device_model: varchar(),
  role_id: integer()
    .references(() => roleTypeTable.id)
    .notNull(),
  live_tracker_enabled: boolean().default(false),
  status: varchar().notNull().default('new'),
  access_token: varchar(),
  session_id: varchar(),
  verification_code: varchar(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
})

export const activityLogTable = pgTable('activity_log', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  clock_in: varchar('clock_in'),
  clock_out: varchar('clock_out'),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  speed: integer(),
  accuracy: integer(),
  altitude: integer(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export const locationTrackerTable = pgTable('location_tracker', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  speed: doublePrecision(),
  altitude: doublePrecision(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  timestamp: varchar(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export const loginLogs = pgTable('login_logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  login_time: timestamp('login_time'),
  logout_time: timestamp('logout_time'),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  platform: varchar(),
  operating_system: varchar(),
  os_version: varchar(),
  manufacturer: varchar(),
  device_name: varchar(),
  device_model: varchar(),
  session_id: varchar(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
})
