import { relations } from 'drizzle-orm';

import { users } from '../core/users.schema';

import { pgTable, uuid, text, timestamp, varchar, numeric, date, boolean } from 'drizzle-orm/pg-core';

export const distributors = pgTable('distributors', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    category: text('category'),
    parentDistributorId: uuid('parent_distributor_id').references(() => distributors.id),
    code: varchar('code', { length: 100 }).unique(),
    name: varchar('name', { length: 255 }),
    relationshipManagerId: uuid('relationship_manager_id').references(() => users.id),
    email: varchar('email', { length: 150 }),
    phone: varchar('phone', { length: 20 }),
    panNo: varchar('pan_no', { length: 20 }),
    tanNo: varchar('tan_no', { length: 20 }),
    gstType: text('gst_type'),
    gstNo: varchar('gst_no', { length: 50 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    pincode: varchar('pincode', { length: 20 }),
    totalAum: numeric('total_aum', { precision: 18, scale: 2 }),
    commission: numeric('commission', { precision: 10, scale: 2 }),
    agreementDate: date('agreement_date'),
    bankName: varchar('bank_name', { length: 150 }),
    bankAccountName: varchar('bank_account_name', { length: 150 }),
    bankAccountNo: varchar('bank_account_no', { length: 50 }),
    ifscCode: varchar('ifsc_code', { length: 20 }),
    micrCode: varchar('micr_code', { length: 20 }),
    apmiRegNo: varchar('apmi_reg_no', { length: 50 }),
    apmiEuinNo: varchar('apmi_euin_no', { length: 50 }),
    nismCertNo: varchar('nism_cert_no', { length: 50 }),
    amfiRegNo: varchar('amfi_reg_no', { length: 50 }),
    amfiEuinNo: varchar('amfi_euin_no', { length: 50 }),
    internalNotes: text('internal_notes'),
    totalCommissionPaid: numeric('total_commission_paid', { precision: 18, scale: 2 }),
    isVerified: boolean('is_verified').default(false).notNull(),
    lastCommissionPaidDate: date('last_commission_paid_date'),
    lastLoginAt: timestamp('last_login_at', { mode: 'string' }),
    lastActivityAt: timestamp('last_activity_at', { mode: 'string' }),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    createdById: uuid('created_by_id').references(() => users.id),
    updatedById: uuid('updated_by_id').references(() => users.id),
});

export const distributorsRelations = relations(distributors, ({ one }) => ({
    parent: one(distributors, {
        fields: [distributors.parentDistributorId],
        references: [distributors.id],
    }),
    relationshipManager: one(users, {
        fields: [distributors.relationshipManagerId],
        references: [users.id],
    }),
    createdBy: one(users, {
        fields: [distributors.createdById],
        references: [users.id],
    }),
    updatedBy: one(users, {
        fields: [distributors.updatedById],
        references: [users.id],
    }),
}));