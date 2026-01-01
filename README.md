# MyAlternates Backend

A progressive Node.js framework (NestJS) backend application for MyAlternates.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL
- **Validation**: Zod & NestJS-Zod
- **Authentication**: Passport-JWT
- **Logging**: Winston
- **Documentation**: Swagger

## 📂 Project Structure

```
src
├── app.module.ts
├── config
│   ├── config.module.ts
│   ├── configurations
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── swagger.config.ts
│   │   ├── throttler.config.ts
│   │   └── winston.config.ts
│   ├── services
│   │   └── throttler-config.service.ts
│   └── validation
│       ├── app.schema.ts
│       ├── database.schema.ts
│       ├── jwt.schema.ts
│       ├── swagger.schema.ts
│       ├── throttler.schema.ts
│       └── winston.schema.ts
├── infrastructure
│   ├── database
│   │   ├── constants.ts
│   │   ├── database.module.ts
│   │   └── drizzle.provider.ts
│   ├── repositories
│   │   ├── base
│   │   │   └── base.repository.ts
│   │   ├── index.ts
│   │   ├── roles.repository.ts
│   │   └── users.repository.ts
│   └── schemas
│       ├── amc
│       │   ├── amc.schema.ts
│       │   ├── amc_documents.schema.ts
│       │   └── schemes.schema.ts
│       ├── core
│       │   ├── permissions.schema.ts
│       │   ├── roles.schema.ts
│       │   ├── roles_to_permissions.schema.ts
│       │   └── users.schema.ts
│       ├── distributor
│       │   ├── distributor_documents.schema.ts
│       │   └── distributors.schema.ts
│       ├── index.ts
│       ├── investor
│       │   ├── investor_banks.schema.ts
│       │   ├── investor_documents.schema.ts
│       │   ├── investor_drawdowns.schema.ts
│       │   ├── investor_holders.schema.ts
│       │   ├── investor_investment_holders.schema.ts
│       │   ├── investor_investments.schema.ts
│       │   ├── investor_nominees.schema.ts
│       │   └── investors.schema.ts
│       ├── master
│       │   ├── categories.schema.ts
│       │   ├── index_history.schema.ts
│       │   ├── market_list.schema.ts
│       │   └── products.schema.ts
│       └── portfolio
│           ├── daily_valuations.schema.ts
│           ├── holdings.schema.ts
│           └── transactions.schema.ts
├── main.ts
├── modules
│   └── iam
│       ├── auth
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── dto
│       │   │   ├── login-client.dto.ts
│       │   │   └── register-client.dto.ts
│       │   └── jwt.strategy.ts
│       ├── roles
│       │   ├── roles.module.ts
│       │   └── roles.service.ts
│       └── users
│           ├── dto
│           │   └── create-user.dto.ts
│           ├── users.controller.ts
│           ├── users.module.ts
│           └── users.service.ts
└── shared
    ├── decorators
    │   ├── permissions.decorator.ts
    │   └── public.decorator.ts
    ├── filters
    │   └── all-exceptions.filter.ts
    ├── guards
    │   ├── jwt-auth.guard.ts
    │   └── permissions.guard.ts
    ├── interfaces
    │   ├── core
    │   │   ├── app.types.ts
    │   │   ├── database.types.ts
    │   │   ├── swagger.type.ts
    │   │   └── winston.d.ts
    │   └── repositories
    │       ├── roles.repository.ts
    │       └── users.repository.ts
    ├── pipes
    └── utils
        └── series-code-generate.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env` file in the root directory:

```env
# Application
PORT=3000
NODE_ENV=development
API_VERSION=1
ALLOWED_ORIGINS=*

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/my_database

# JWT Auth
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1h

# Swagger (Optional)
SWAGGER_ENABLED=true
```

## 🏃 Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## 🗄️ Database Migrations

This project uses Drizzle ORM for database management.

```bash
# Generate migrations
npm run migration:generate

# Run migrations
npm run migration:run

# Push schema changes (prototyping)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 📝 API Documentation

Swagger documentation is available when running the application (if enabled in config).
Access it at: `http://localhost:3000/api/v1/docs` (default path, check logs on startup).

## 📄 License

This project is [UNLICENSED](LICENSE).
