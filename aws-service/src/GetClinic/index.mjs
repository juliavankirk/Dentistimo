import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const CLINICS_TABLE = process.env.CLINICS_TABLE || "dentistimo-clinics-dev";

export const handler = async (event) => {
  const clinicId = event.pathParameters?.clinicId;

  if (!clinicId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing clinicId parameter" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  const params = {
    TableName: CLINICS_TABLE,
    Key: {
      clinicId: { N: clinicId },
    },
  };

  try {
    const command = new GetItemCommand(params);
    const result = await client.send(command);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Clinic not found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    const clinic = unmarshall(result.Item);

    return {
      statusCode: 200,
      body: JSON.stringify(clinic),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error fetching clinic:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch clinic" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
