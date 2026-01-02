import { pgTable, uuid, varchar, text, date, integer, boolean, timestamp, numeric, json } from 'drizzle-orm/pg-core';
import { amcs } from './amc.schema';
import { products } from '../master/products.schema';
import { categories } from '../master/categories.schema';
import { asset_classes } from '../master/asset_classes.schema';
import { benchmark_indices } from '../master/benchmark_indices.schema';

export const schemes = pgTable('schemes', {
    id: uuid("id").defaultRandom().primaryKey(),
    amcId: uuid("amc_id").notNull().references(() => amcs.id, { onDelete: "cascade" }),
    productId: uuid('product_id').references(() => products.id),
    schemeCode: varchar("scheme_code", { length: 20 }).notNull().unique(),
    schemeName: varchar("scheme_name", { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }), // Hex color code
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    subCategoryId: uuid("sub_category_id").references(() => categories.id, { onDelete: "set null" }),
    
    // New Dropdowns (References)
    assetClassId: uuid("asset_class_id").references(() => asset_classes.id),
    benchmarkIndexId: uuid("benchmark_index_id").references(() => benchmark_indices.id),
    benchmarkShortIndexId: uuid("benchmark_short_index_id").references(() => benchmark_indices.id),

    // IA Fields
    iaStructure: varchar("ia_structure", { length: 50 }),
    iaCode: varchar("ia_code", { length: 50 }),
    iaShortName: varchar("ia_short_name", { length: 100 }),
    strategyCode: varchar("strategy_code", { length: 50 }),
    strategyName: varchar("strategy_name", { length: 255 }),
    
    // Financials
    aum: numeric("aum"),
    avgMarketCap: numeric("avg_market_cap"),
    
    // Reporting
    reportingStructure: varchar("reporting_structure", { length: 100 }),
    comparisonReportingStructure: varchar("comparison_reporting_structure", { length: 100 }),
    
    // Details
    about: text("about"),
    investmentObjective: text("investment_objective"),
    investmentApproach: text("investment_approach"),
    iaTheme: varchar("ia_theme", { length: 255 }),
    keyStrength: text("key_strength"),
    schemeInceptionDate: date("scheme_inception_date"),
    
    // Fees & Portfolio Composition
    setupFees: numeric("setup_fees"),
    largeCap: numeric("large_cap"),
    midCap: numeric("mid_cap"),
    smallCap: numeric("small_cap"),
    cashEquivalent: numeric("cash_equivalent"),
    others: numeric("others"),
    
    // Options
    sipOption: boolean("sip_option").default(false),
    stpOption: boolean("stp_option").default(false),
    topupOption: boolean("topup_option").default(false),
    
    // Fee Structure
    feeProfitShare: numeric("fee_profit_share"),
    feeStructure: varchar("fee_structure", { length: 50 }),
    feeFixedAmc: numeric("fee_fixed_amc"),
    feeVariableAmc: numeric("fee_variable_amc"),
    feeHurdle: numeric("fee_hurdle"),
    remarksForFeeStructure: text("remarks_for_fee_structure"),
    
    // Exit Loads
    exitLoad1Yr: numeric("exit_load_1_yr"),
    exitLoad2Yr: numeric("exit_load_2_yr"),
    exitLoad3Yr: numeric("exit_load_3_yr"),
    exitLoad: text("exit_load"),
    exitOption: text("exit_option"),
    
    // Portfolio Const
    idealStocksInPortfolio: integer("ideal_stocks_in_portfolio"),
    minInvestment: numeric("min_investment"),
    minTopupAmount: numeric("min_topup_amount"),
    initialDrawdown: numeric("initial_drawdown"),
    
    // Flags
    isDistributable: boolean("is_distributable").default(false),
    showInDashboard: boolean("show_in_dashboard").default(true),
    isFeatured: boolean('is_featured').default(false).notNull(), // Existing field mapped to IsFeaturedProduct
    isSuggested: boolean("is_suggested").default(false),
    isOpenForSubscription: boolean("is_open_for_subscription").default(true),
    priorityOrder: integer('priority_order').default(0).notNull(),
    
    // Additional Details
    investorType: varchar("investor_type", { length: 50 }),
    fundType: varchar("fund_type", { length: 50 }),
    schemeType: varchar("scheme_type", { length: 50 }),
    currency: varchar("currency", { length: 10 }),
    
    // Fund Approach & Tenure
    fundApproach: varchar("fund_approach", { length: 50 }),
    fundApproachDescription: text("fund_approach_description"),
    fundTenure: varchar("fund_tenure", { length: 50 }),
    fundTenureDescription: text("fund_tenure_description"),
    
    // Fund Size & Commitments
    fundTargetSize: numeric("fund_target_size"),
    fundTargetSizeDescription: text("fund_target_size_description"),
    minCommitment: numeric("min_commitment"),
    minCommitmentDescription: text("min_commitment_description"),
    drawdown: numeric("drawdown"),
    drawdownDescription: text("drawdown_description"),
    targettedGrossIrr: numeric("targetted_gross_irr"),
    targettedGrossIrrDescription: text("targetted_gross_irr_description"),
    
    // Policy
    whoCanInvest: text("who_can_invest"),
    whoCannotInvest: text("who_cannot_invest"),
    tentativeBalanceCommitmentCall: text("tentative_balance_commitment_call"),
    sponsorCommitment: text("sponsor_commitment"),
    tentativeFinalClosing: text("tentative_final_closing"),
    subscriptionAndRedemption: text("subscription_and_redemption"),
    
    // Operational
    navFrequency: varchar("nav_frequency", { length: 50 }),
    custody: varchar("custody", { length: 255 }),
    registrarAndTransferAgent: varchar("registrar_and_transfer_agent", { length: 255 }),
    trustee: varchar("trustee", { length: 255 }),
    assetStructure: varchar("asset_structure", { length: 255 }),
    legalAdvisor: varchar("legal_advisor", { length: 255 }),
    taxAdvisor: varchar("tax_advisor", { length: 255 }),
    taxation: text("taxation"),
    performanceNote: text("performance_note"),

    // JSON Fields for Top 5 (Since requirements said Input Name / Input %)
    top5Holdings: json("top_5_holdings"), // { name: string, value: number }[]
    top5Sectors: json("top_5_sectors"), // { name: string, value: number }[]

    // Standard Fields
    tenureInMonths: integer("tenure_in_months"),
    riskLevel: varchar("risk_level", { length: 50 }),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
