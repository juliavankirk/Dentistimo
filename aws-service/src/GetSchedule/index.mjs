import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const CLINICS_TABLE = process.env.CLINICS_TABLE || "dentistimo-clinics-dev";
const APPOINTMENTS_TABLE = process.env.APPOINTMENTS_TABLE || "dentistimo-appointments-dev";

export const handler = async (event) => {
  const { clinicId, date } = event.pathParameters || {};

  if (!clinicId || !date) {
    return errorResponse(400, "Missing clinicId or date parameter");
  }

  try {
    // Get clinic data
    const clinic = await getClinic(clinicId);

    if (!clinic) {
      return errorResponse(404, "Invalid Clinic");
    }

    // Get existing schedule
    const schedule = await getSchedule(clinicId, date);

    let timeSlots;

    if (!schedule) {
      // No existing schedule - generate time slots from opening hours
      timeSlots = parseOpeningHours(clinic.openinghours, date);
    } else {
      // Parse existing schedule
      timeSlots = parseTimeSlots(clinic.dentists, schedule.timeSlots);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        clinicId,
        date,
        timeSlots,
      }),
      headers: corsHeaders(),
    };
  } catch (error) {
    console.error("Error getting schedule:", error);
    return errorResponse(500, "Failed to get schedule");
  }
};

async function getClinic(clinicId) {
  const command = new GetItemCommand({
    TableName: CLINICS_TABLE,
    Key: { clinicId: { N: clinicId } },
  });

  const result = await client.send(command);
  return result.Item ? unmarshall(result.Item) : null;
}

async function getSchedule(clinicId, date) {
  const command = new GetItemCommand({
    TableName: APPOINTMENTS_TABLE,
    Key: {
      clinicId: { N: clinicId },
      date: { S: date },
    },
  });

  const result = await client.send(command);
  return result.Item ? unmarshall(result.Item) : null;
}

function parseOpeningHours(openingHours, date) {
  if (!openingHours) return [];

  const parsedDate = new Date(date);
  const weekday = parsedDate.getDay();

  const dayMap = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const dayName = dayMap[weekday];
  const hoursForDay = openingHours[dayName];

  if (!hoursForDay) return [];

  // Parse "9:00-17:00" format
  const [startStr, endStr] = hoursForDay.split("-");
  const startHour = parseFloat(startStr.split(":")[0]);
  const endHour = parseFloat(endStr.split(":")[0]);

  const timeSlots = [];
  let currentHour = startHour;

  while (currentHour <= endHour - 0.5) {
    const minutes = currentHour % 1 === 0.5 ? "30" : "00";
    const hour = Math.floor(currentHour);
    const time = `${hour}:${minutes}`;

    // Skip lunch break (12:00-13:00) and fika (14:30-15:00)
    if (time !== "12:00" && time !== "12:30" && time !== "14:30") {
      timeSlots.push({ time, available: true });
    }

    currentHour += 0.5;
  }

  return timeSlots;
}

function parseTimeSlots(dentists, slots) {
  if (!slots || !Array.isArray(slots)) return [];

  return slots.map((slot) => {
    const bookingsCount = slot.bookings?.length || 0;
    return {
      time: slot.time,
      available: bookingsCount < dentists,
    };
  });
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };
}

function errorResponse(statusCode, message) {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
    headers: corsHeaders(),
  };
}
