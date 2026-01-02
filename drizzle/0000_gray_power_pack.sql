CREATE TYPE "public"."user_app_type" AS ENUM('ADMIN', 'INVESTOR', 'DISTRIBUTOR');--> statement-breakpoint
CREATE TYPE "public"."amc_document_type" AS ENUM('agreement', 'license', 'other');--> statement-breakpoint
CREATE TYPE "public"."distributor_document_type" AS ENUM('passport', 'id_card', 'license');--> statement-breakpoint
CREATE TYPE "public"."investor_document_type" AS ENUM('pan', 'aadhaar', 'passport', 'address_proof', 'bank_proof', 'other');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"password" text,
	"phone" varchar(255),
	"country_code" varchar(20),
	"username" varchar(255),
	"user_code" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"terms" boolean DEFAULT true NOT NULL,
	"role_id" uuid,
	"app_type" "user_app_type",
	"last_login_at" timestamp,
	"last_activity_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"requires_password_change" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_user_code_unique" UNIQUE("user_code")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "roles_to_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "roles_to_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "amcs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amc_code" varchar(50),
	"name" varchar(255),
	"short_name" varchar(100),
	"logo_url" text,
	"about" text,
	"color" varchar(7),
	"inception_date" date,
	"sebi_registration_no" varchar(100),
	"common_investment_philosophy" text,
	"no_of_strategies" integer,
	"investment_team" text,
	"investor_login_url" text,
	"address" text,
	"website_url" text,
	"twitter_url" text,
	"facebook_url" text,
	"linkedin_url" text,
	"youtube_url" text,
	"creative_url" text,
	"google_map_link" text,
	"restrict_display" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"priority_order" integer DEFAULT 0 NOT NULL,
	"aum" integer,
	"risk_category" varchar(100),
	"product_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "amcs_amc_code_unique" UNIQUE("amc_code")
);
--> statement-breakpoint
CREATE TABLE "amc_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amc_id" uuid NOT NULL,
	"document_type" "amc_document_type" NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amc_id" uuid NOT NULL,
	"product_id" uuid,
	"scheme_code" varchar(20) NOT NULL,
	"scheme_name" varchar(255) NOT NULL,
	"color" varchar(7),
	"category_id" uuid,
	"sub_category_id" uuid,
	"asset_class_id" uuid,
	"benchmark_index_id" uuid,
	"benchmark_short_index_id" uuid,
	"ia_structure" varchar(50),
	"ia_code" varchar(50),
	"ia_short_name" varchar(100),
	"strategy_code" varchar(50),
	"strategy_name" varchar(255),
	"aum" numeric,
	"avg_market_cap" numeric,
	"reporting_structure" varchar(100),
	"comparison_reporting_structure" varchar(100),
	"about" text,
	"investment_objective" text,
	"investment_approach" text,
	"ia_theme" varchar(255),
	"key_strength" text,
	"scheme_inception_date" date,
	"setup_fees" numeric,
	"large_cap" numeric,
	"mid_cap" numeric,
	"small_cap" numeric,
	"cash_equivalent" numeric,
	"others" numeric,
	"sip_option" boolean DEFAULT false,
	"stp_option" boolean DEFAULT false,
	"topup_option" boolean DEFAULT false,
	"fee_profit_share" numeric,
	"fee_structure" varchar(50),
	"fee_fixed_amc" numeric,
	"fee_variable_amc" numeric,
	"fee_hurdle" numeric,
	"remarks_for_fee_structure" text,
	"exit_load_1_yr" numeric,
	"exit_load_2_yr" numeric,
	"exit_load_3_yr" numeric,
	"exit_load" text,
	"exit_option" text,
	"ideal_stocks_in_portfolio" integer,
	"min_investment" numeric,
	"min_topup_amount" numeric,
	"initial_drawdown" numeric,
	"is_distributable" boolean DEFAULT false,
	"show_in_dashboard" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_suggested" boolean DEFAULT false,
	"is_open_for_subscription" boolean DEFAULT true,
	"priority_order" integer DEFAULT 0 NOT NULL,
	"investor_type" varchar(50),
	"fund_type" varchar(50),
	"scheme_type" varchar(50),
	"currency" varchar(10),
	"fund_approach" varchar(50),
	"fund_approach_description" text,
	"fund_tenure" varchar(50),
	"fund_tenure_description" text,
	"fund_target_size" numeric,
	"fund_target_size_description" text,
	"min_commitment" numeric,
	"min_commitment_description" text,
	"drawdown" numeric,
	"drawdown_description" text,
	"targetted_gross_irr" numeric,
	"targetted_gross_irr_description" text,
	"who_can_invest" text,
	"who_cannot_invest" text,
	"tentative_balance_commitment_call" text,
	"sponsor_commitment" text,
	"tentative_final_closing" text,
	"subscription_and_redemption" text,
	"nav_frequency" varchar(50),
	"custody" varchar(255),
	"registrar_and_transfer_agent" varchar(255),
	"trustee" varchar(255),
	"asset_structure" varchar(255),
	"legal_advisor" varchar(255),
	"tax_advisor" varchar(255),
	"taxation" text,
	"performance_note" text,
	"top_5_holdings" json,
	"top_5_sectors" json,
	"tenure_in_months" integer,
	"risk_level" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schemes_scheme_code_unique" UNIQUE("scheme_code")
);
--> statement-breakpoint
CREATE TABLE "scheme_fund_managers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheme_id" uuid NOT NULL,
	"fund_manager_id" uuid NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date,
	"is_current" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheme_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheme_id" uuid NOT NULL,
	"performance_type" varchar(50) NOT NULL,
	"year" varchar(20) NOT NULL,
	"display_order" integer DEFAULT 0,
	"scheme_performance" numeric,
	"benchmark_performance" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "distributors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"category" text,
	"parent_distributor_id" uuid,
	"code" varchar(100),
	"name" varchar(255),
	"relationship_manager_id" uuid,
	"email" varchar(150),
	"phone" varchar(20),
	"pan_no" varchar(20),
	"tan_no" varchar(20),
	"gst_type" text,
	"gst_no" varchar(50),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"pincode" varchar(20),
	"total_aum" numeric(18, 2),
	"commission" numeric(10, 2),
	"agreement_date" date,
	"bank_name" varchar(150),
	"bank_account_name" varchar(150),
	"bank_account_no" varchar(50),
	"ifsc_code" varchar(20),
	"micr_code" varchar(20),
	"apmi_reg_no" varchar(50),
	"apmi_euin_no" varchar(50),
	"nism_cert_no" varchar(50),
	"amfi_reg_no" varchar(50),
	"amfi_euin_no" varchar(50),
	"internal_notes" text,
	"total_commission_paid" numeric(18, 2),
	"is_verified" boolean DEFAULT false NOT NULL,
	"last_commission_paid_date" date,
	"last_login_at" timestamp,
	"last_activity_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	CONSTRAINT "distributors_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "distributor_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"distributor_id" uuid NOT NULL,
	"document_type" "distributor_document_type" NOT NULL,
	"file_url" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"pan" varchar(10) NOT NULL,
	"date_of_birth" date,
	"gender" varchar(20),
	"mobile" varchar(20),
	"email" varchar(255),
	"address_1" text,
	"address_2" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"pincode" varchar(20),
	"residential_status" varchar(50) NOT NULL,
	"sub_status" varchar(100) DEFAULT 'None',
	"guardian_name" varchar(255),
	"guardian_id_type" varchar(50),
	"guardian_id_number" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "investors_pan_unique" UNIQUE("pan")
);
--> statement-breakpoint
CREATE TABLE "investor_investments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"scheme_id" uuid NOT NULL,
	"product" varchar(100) NOT NULL,
	"amc_client_code" varchar(50),
	"strategy_code" varchar(50),
	"strategy_name" varchar(100),
	"inception_date" date,
	"mode_of_holding" varchar(50),
	"amc_sharing" numeric(5, 2),
	"fee_structure" text,
	"distributor_id" uuid,
	"cre_id" uuid,
	"rm_id" uuid,
	"fm_code" varchar(50),
	"branch_code" varchar(50),
	"investor_bank_id" uuid NOT NULL,
	"client_bank_name" varchar(100),
	"client_bank_account" varchar(50),
	"client_bank_ifsc" varchar(20),
	"client_account_type" varchar(20),
	"dp_type" varchar(20),
	"dp_name" varchar(100),
	"dp_id" varchar(50),
	"client_id" varchar(50),
	"remarks" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investor_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"document_type" "investor_document_type" NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text,
	"file_size" integer NOT NULL,
	"mime_type" text,
	"uploaded_at" timestamp DEFAULT now(),
	"uploaded_by" uuid
);
--> statement-breakpoint
CREATE TABLE "investor_drawdowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investment_id" uuid NOT NULL,
	"drawdown_number" varchar(50),
	"payment_reference_number" varchar(100),
	"drawdown_amount" numeric(20, 2),
	"drawdown_percentage" numeric(5, 2),
	"payment_due_date" date,
	"payment_received_date" date,
	"next_due_date" date,
	"late_fee" numeric(20, 2),
	"remarks" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investor_holders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"pan" varchar(10),
	"date_of_birth" date,
	"gender" varchar(20),
	"mobile" varchar(20),
	"email" varchar(255),
	"address_1" text,
	"address_2" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"pincode" varchar(20),
	"guardian_name" varchar(255),
	"guardian_id_type" varchar(50),
	"guardian_id_number" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investor_investment_holders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investment_id" uuid NOT NULL,
	"holder_id" uuid,
	"nominee_id" uuid,
	"holder_number" integer NOT NULL,
	"holder_type" varchar(20) DEFAULT 'holder' NOT NULL,
	"percentage" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investor_nominees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"id_type" varchar(50),
	"id_number" varchar(50),
	"relationship" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investor_banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"bank_name" varchar(255) NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"ifsc_code" varchar(11) NOT NULL,
	"account_type" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7),
	"parent_category_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"desc" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"isin_code" varchar(50) NOT NULL,
	"categorization" varchar(100),
	"sector" varchar(100),
	"as_on_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "market_list_isin_code_unique" UNIQUE("isin_code")
);
--> statement-breakpoint
CREATE TABLE "index_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"valuation_date" date NOT NULL,
	"scheme_code" varchar(50),
	"scheme_name" varchar(100),
	"open_value" numeric(20, 2),
	"high_value" numeric(20, 2),
	"low_value" numeric(20, 2),
	"close_value" numeric(20, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "asset_classes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "benchmark_indices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "benchmark_indices_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "fund_managers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50),
	"name" varchar(255) NOT NULL,
	"code" varchar(50),
	"designation" varchar(255),
	"amc_id" uuid,
	"profile_picture" text,
	"about" text,
	"experience" text,
	"fund_manager_creative" text,
	"is_featured" boolean DEFAULT false,
	"priority_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_valuations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investment_id" uuid NOT NULL,
	"client_code" varchar(50),
	"valuation_date" date NOT NULL,
	"valuation_amount" numeric(20, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "holdings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investment_id" uuid NOT NULL,
	"client_code" varchar(50),
	"market_list_id" uuid,
	"isin_code" varchar(50),
	"security_name" varchar(255),
	"security_type" varchar(50),
	"valuation_date" date NOT NULL,
	"quantity" numeric(20, 4),
	"average_price" numeric(20, 2),
	"market_price" numeric(20, 2),
	"current_value" numeric(20, 2),
	"portfolio_weightage" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investment_id" uuid NOT NULL,
	"client_code" varchar(50),
	"order_date" date NOT NULL,
	"valuation_date" date,
	"transaction_type" varchar(50) NOT NULL,
	"amount" numeric(20, 2) NOT NULL,
	"capital_commitment" numeric(20, 2),
	"capital_called" numeric(20, 2),
	"remarks" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_to_permissions" ADD CONSTRAINT "roles_to_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_to_permissions" ADD CONSTRAINT "roles_to_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amcs" ADD CONSTRAINT "amcs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amc_documents" ADD CONSTRAINT "amc_documents_amc_id_amcs_id_fk" FOREIGN KEY ("amc_id") REFERENCES "public"."amcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_amc_id_amcs_id_fk" FOREIGN KEY ("amc_id") REFERENCES "public"."amcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_sub_category_id_categories_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_asset_class_id_asset_classes_id_fk" FOREIGN KEY ("asset_class_id") REFERENCES "public"."asset_classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_benchmark_index_id_benchmark_indices_id_fk" FOREIGN KEY ("benchmark_index_id") REFERENCES "public"."benchmark_indices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_benchmark_short_index_id_benchmark_indices_id_fk" FOREIGN KEY ("benchmark_short_index_id") REFERENCES "public"."benchmark_indices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheme_fund_managers" ADD CONSTRAINT "scheme_fund_managers_scheme_id_schemes_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."schemes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheme_fund_managers" ADD CONSTRAINT "scheme_fund_managers_fund_manager_id_fund_managers_id_fk" FOREIGN KEY ("fund_manager_id") REFERENCES "public"."fund_managers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheme_performance" ADD CONSTRAINT "scheme_performance_scheme_id_schemes_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."schemes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_parent_distributor_id_distributors_id_fk" FOREIGN KEY ("parent_distributor_id") REFERENCES "public"."distributors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_relationship_manager_id_users_id_fk" FOREIGN KEY ("relationship_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributor_documents" ADD CONSTRAINT "distributor_documents_distributor_id_distributors_id_fk" FOREIGN KEY ("distributor_id") REFERENCES "public"."distributors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_scheme_id_schemes_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."schemes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_distributor_id_distributors_id_fk" FOREIGN KEY ("distributor_id") REFERENCES "public"."distributors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_cre_id_users_id_fk" FOREIGN KEY ("cre_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_rm_id_users_id_fk" FOREIGN KEY ("rm_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investments" ADD CONSTRAINT "investor_investments_investor_bank_id_investor_banks_id_fk" FOREIGN KEY ("investor_bank_id") REFERENCES "public"."investor_banks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_drawdowns" ADD CONSTRAINT "investor_drawdowns_investment_id_investor_investments_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investor_investments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_holders" ADD CONSTRAINT "investor_holders_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investment_holders" ADD CONSTRAINT "investor_investment_holders_investment_id_investor_investments_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investor_investments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investment_holders" ADD CONSTRAINT "investor_investment_holders_holder_id_investor_holders_id_fk" FOREIGN KEY ("holder_id") REFERENCES "public"."investor_holders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investment_holders" ADD CONSTRAINT "investor_investment_holders_nominee_id_investor_nominees_id_fk" FOREIGN KEY ("nominee_id") REFERENCES "public"."investor_nominees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_nominees" ADD CONSTRAINT "investor_nominees_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_banks" ADD CONSTRAINT "investor_banks_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fund_managers" ADD CONSTRAINT "fund_managers_amc_id_amcs_id_fk" FOREIGN KEY ("amc_id") REFERENCES "public"."amcs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_valuations" ADD CONSTRAINT "daily_valuations_investment_id_investor_investments_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investor_investments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_investment_id_investor_investments_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investor_investments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_market_list_id_market_list_id_fk" FOREIGN KEY ("market_list_id") REFERENCES "public"."market_list"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_investment_id_investor_investments_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investor_investments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inv_name_idx" ON "investors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "inv_email_idx" ON "investors" USING btree ("email");--> statement-breakpoint
CREATE INDEX "inv_inv_investor_idx" ON "investor_investments" USING btree ("investor_id");--> statement-breakpoint
CREATE INDEX "inv_inv_distributor_idx" ON "investor_investments" USING btree ("distributor_id");--> statement-breakpoint
CREATE INDEX "inv_inv_scheme_idx" ON "investor_investments" USING btree ("scheme_id");--> statement-breakpoint
CREATE INDEX "inv_inv_product_idx" ON "investor_investments" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "hld_investor_idx" ON "investor_holders" USING btree ("investor_id");--> statement-breakpoint
CREATE INDEX "hld_pan_idx" ON "investor_holders" USING btree ("pan");--> statement-breakpoint
CREATE INDEX "lnk_hld_inv_idx" ON "investor_investment_holders" USING btree ("investment_id");--> statement-breakpoint
CREATE INDEX "lnk_hld_holder_idx" ON "investor_investment_holders" USING btree ("holder_id");--> statement-breakpoint
CREATE INDEX "lnk_hld_nominee_idx" ON "investor_investment_holders" USING btree ("nominee_id");--> statement-breakpoint
CREATE INDEX "mkt_company_idx" ON "market_list" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "mkt_isin_idx" ON "market_list" USING btree ("isin_code");--> statement-breakpoint
CREATE INDEX "dv_inv_idx" ON "daily_valuations" USING btree ("investment_id");--> statement-breakpoint
CREATE INDEX "dv_date_idx" ON "daily_valuations" USING btree ("valuation_date");--> statement-breakpoint
CREATE INDEX "hld_inv_idx" ON "holdings" USING btree ("investment_id");--> statement-breakpoint
CREATE INDEX "hld_date_idx" ON "holdings" USING btree ("valuation_date");--> statement-breakpoint
CREATE INDEX "hld_market_list_idx" ON "holdings" USING btree ("market_list_id");--> statement-breakpoint
CREATE INDEX "trx_inv_idx" ON "transactions" USING btree ("investment_id");--> statement-breakpoint
CREATE INDEX "trx_date_idx" ON "transactions" USING btree ("order_date");