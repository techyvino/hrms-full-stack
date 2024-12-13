import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

import { roleTypeTable } from '@/db/schemas/role.schema'
import { sitesTable } from '@/db/schemas/sites.schema'
import { defaultColumns } from '@/lib/sql'

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
  role_id: integer()
    .references(() => roleTypeTable.id)
    .notNull(),
  live_tracker_enabled: boolean().default(false),
  status: varchar().notNull().default('new'),
  access_token: varchar(),
  session_id: varchar(),
  verification_code: varchar(),
  ...defaultColumns,
})
