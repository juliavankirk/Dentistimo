# Dentistimo

A modern dental appointment booking system built with Next.js 15 and AWS Serverless.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- Interactive map showing dental clinics in Gothenburg
- Real-time appointment availability
- Email confirmations via AWS SES
- Dark mode support
- Fully responsive design
- Event-driven architecture with AWS EventBridge

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Maps**: Leaflet + OpenStreetMap (free, no API key required)
- **State**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 20
- **Compute**: AWS Lambda
- **API**: Amazon API Gateway
- **Database**: Amazon DynamoDB
- **Events**: Amazon EventBridge
- **Email**: Amazon SES
- **IaC**: AWS SAM (Serverless Application Model)

## Project Structure

```
dentistimo/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities, API client, store
│   │   └── types/           # TypeScript types
│   └── .env.example         # Environment template
│
└── aws-service/             # AWS backend
    ├── src/
    │   ├── getClinics/      # List all clinics
    │   ├── GetClinic/       # Get single clinic
    │   ├── GetSchedule/     # Get availability
    │   ├── bookAppointmentEB/   # Publish booking event
    │   └── bookAppointmentDDB/  # Process booking
    ├── template.yaml        # SAM template
    └── .env.example         # Environment template
```

## Quick Start (Demo Mode)

Run the frontend locally with mock data - no AWS account required:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to see the app with sample clinics.

## Full Deployment

### Prerequisites

- [AWS Account](https://aws.amazon.com/free/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with credentials
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Node.js 20+

### 1. Deploy Backend

```bash
cd aws-service

# Build and deploy
sam build
sam deploy --guided
```

During guided deployment, you'll be prompted for:
- **Stack Name**: `dentistimo-stack` (or your choice)
- **AWS Region**: `us-east-1` (recommended for SES)
- **Environment**: `dev` or `prod`
- **FromEmail**: Your verified SES email address

> **Note**: For SES emails to work, you must [verify your email address](https://docs.aws.amazon.com/ses/latest/dg/verify-email-addresses.html) in the AWS Console first.

After deployment, note the **ApiEndpoint** output URL.

### 2. Seed Database

Add clinic data to DynamoDB:

```bash
# Using the AWS CLI
aws dynamodb put-item \
  --table-name dentistimo-clinics-dev \
  --item file://data/sample-clinic.json
```

Or use the seed script:

```bash
cd aws-service
node scripts/seed-data.mjs
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### 4. Run Frontend

```bash
npm install
npm run dev
```

### 5. Deploy Frontend (Optional)

Deploy to AWS Amplify, Vercel, or any static host:

```bash
npm run build
npm run start  # or deploy the .next folder
```

## Environment Variables

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | API Gateway endpoint | Yes (for real data) |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Force mock data mode | No |

### Backend (SAM Parameters)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `Environment` | Deployment environment | `dev` |
| `FromEmail` | SES verified email | Required |
| `AllowedOrigins` | CORS origins | `*` |

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│ API Gateway │────▶│   Lambda    │
│  Frontend   │     │   (REST)    │     │  Functions  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐             │
                    │ EventBridge │◀────────────┤
                    │    (Bus)    │             │
                    └──────┬──────┘             │
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Lambda    │────▶│  DynamoDB   │
                    │  (Worker)   │     │  (Tables)   │
                    └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     SES     │
                    │   (Email)   │
                    └─────────────┘
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/clinics/` | List all clinics |
| GET | `/clinics/{clinicId}` | Get clinic details |
| GET | `/schedule/{clinicId}/{date}` | Get availability |
| POST | `/schedule/` | Book appointment |

## Development

### Frontend

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

### Backend

```bash
cd aws-service
sam build        # Build Lambda functions
sam local invoke # Test locally
sam deploy       # Deploy to AWS
```

## License

MIT
