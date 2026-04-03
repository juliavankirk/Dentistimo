import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({});
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME || "dentistimo-events-dev";

export const handler = async (event) => {
  console.log("Processing booking request...");

  try {
    const body = event.body;

    const params = {
      Entries: [
        {
          Detail: body,
          DetailType: "CreateAppointment",
          EventBusName: EVENT_BUS_NAME,
          Source: "dentistimo-api",
          Time: new Date(),
        },
      ],
    };

    const command = new PutEventsCommand(params);
    const result = await client.send(command);

    console.log("Event published:", JSON.stringify(result));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Booking request received",
        eventId: result.Entries?.[0]?.EventId,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error publishing event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process booking request" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
