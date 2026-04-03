import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const CLINICS_TABLE = process.env.CLINICS_TABLE || "dentistimo-clinics-dev";

export const handler = async (event) => {
  const params = {
    TableName: CLINICS_TABLE,
    ProjectionExpression: "#name, #owner, clinicId, address, city, dentists, coordinate, openinghours",
    ExpressionAttributeNames: {
      "#name": "name",
      "#owner": "owner",
    },
  };

  try {
    const command = new ScanCommand(params);
    const result = await client.send(command);

    const clinics = result.Items.map((item) => unmarshall(item));

    return {
      statusCode: 200,
      body: JSON.stringify({ Clinics: clinics }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch clinics" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
