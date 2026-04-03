/**
 * Seed script for Dentistimo DynamoDB tables
 *
 * Usage:
 *   node scripts/seed-data.mjs
 *   node scripts/seed-data.mjs --env prod
 *
 * Prerequisites:
 *   - AWS CLI configured with credentials
 *   - DynamoDB tables already created (via sam deploy)
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const env = process.argv.includes("--env")
  ? process.argv[process.argv.indexOf("--env") + 1]
  : "dev";

const CLINICS_TABLE = `dentistimo-clinics-${env}`;

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

// Sample clinic data for Gothenburg
const clinics = [
  {
    clinicId: 1,
    name: "Tandläkare City",
    owner: "Dr. Erik Lindberg",
    address: "Östra Hamngatan 23",
    city: "Göteborg",
    dentists: 3,
    coordinate: {
      latitude: 57.7072,
      longitude: 11.9668,
    },
    openinghours: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-15:00",
    },
  },
  {
    clinicId: 2,
    name: "Haga Tandvård",
    owner: "Dr. Anna Svensson",
    address: "Haga Nygata 12",
    city: "Göteborg",
    dentists: 2,
    coordinate: {
      latitude: 57.6987,
      longitude: 11.9534,
    },
    openinghours: {
      monday: "9:00-18:00",
      tuesday: "9:00-18:00",
      wednesday: "9:00-18:00",
      thursday: "9:00-18:00",
      friday: "9:00-16:00",
    },
  },
  {
    clinicId: 3,
    name: "Linnéstadens Tandklinik",
    owner: "Dr. Johan Bergström",
    address: "Linnégatan 45",
    city: "Göteborg",
    dentists: 4,
    coordinate: {
      latitude: 57.6921,
      longitude: 11.9478,
    },
    openinghours: {
      monday: "8:00-16:00",
      tuesday: "8:00-16:00",
      wednesday: "8:00-16:00",
      thursday: "8:00-16:00",
      friday: "8:00-14:00",
    },
  },
  {
    clinicId: 4,
    name: "Majorna Dental Care",
    owner: "Dr. Sofia Karlsson",
    address: "Mariaplan 3",
    city: "Göteborg",
    dentists: 2,
    coordinate: {
      latitude: 57.6892,
      longitude: 11.9234,
    },
    openinghours: {
      monday: "7:30-16:30",
      tuesday: "7:30-16:30",
      wednesday: "7:30-16:30",
      thursday: "7:30-16:30",
      friday: "7:30-14:00",
    },
  },
  {
    clinicId: 5,
    name: "Avenyn Tandläkare",
    owner: "Dr. Marcus Nilsson",
    address: "Kungsportsavenyn 8",
    city: "Göteborg",
    dentists: 5,
    coordinate: {
      latitude: 57.6996,
      longitude: 11.9745,
    },
    openinghours: {
      monday: "8:00-18:00",
      tuesday: "8:00-18:00",
      wednesday: "8:00-18:00",
      thursday: "8:00-18:00",
      friday: "8:00-15:00",
    },
  },
];

async function seedClinics() {
  console.log(`Seeding ${clinics.length} clinics to ${CLINICS_TABLE}...`);

  for (const clinic of clinics) {
    const command = new PutCommand({
      TableName: CLINICS_TABLE,
      Item: clinic,
    });

    try {
      await docClient.send(command);
      console.log(`  ✓ Added clinic: ${clinic.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to add ${clinic.name}:`, error.message);
    }
  }

  console.log("\nDone!");
}

seedClinics().catch(console.error);
