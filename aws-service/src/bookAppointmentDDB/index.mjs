import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({});

// Environment variables (set via CloudFormation/SAM)
const CLINICS_TABLE = process.env.CLINICS_TABLE || "dentistimo-clinics-dev";
const APPOINTMENTS_TABLE = process.env.APPOINTMENTS_TABLE || "dentistimo-appointments-dev";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";

export const handler = async (event) => {
  const detail = event.detail;
  console.log("Processing booking:", JSON.stringify(detail));

  try {
    // Get clinic data
    const clinic = await getClinicData(detail.clinicId);
    if (!clinic) {
      await sendDenialEmail(detail, "the clinic does not exist.");
      return { statusCode: 404, body: "Clinic not found" };
    }

    // Get existing schedule
    let schedule = await getSchedule(detail.clinicId, detail.date);

    if (!schedule) {
      // Create new schedule from opening hours
      const timeSlots = parseOpeningHours(clinic.openinghours, detail.date);
      schedule = {
        clinicId: parseInt(detail.clinicId),
        date: detail.date,
        timeSlots,
      };
    }

    // Try to book the appointment
    const result = await processBooking(schedule, detail, clinic.dentists);

    if (result.success) {
      await writeSchedule(result.schedule);
      await sendConfirmationEmail(detail);
      return { statusCode: 200, body: "Booking confirmed" };
    } else {
      await sendDenialEmail(detail, result.reason);
      return { statusCode: 400, body: result.reason };
    }
  } catch (error) {
    console.error("Error processing booking:", error);
    await sendDenialEmail(detail, "we encountered a system error. Please try again.");
    return { statusCode: 500, body: "Internal error" };
  }
};

async function getClinicData(clinicId) {
  const command = new GetCommand({
    TableName: CLINICS_TABLE,
    Key: { clinicId: parseInt(clinicId) },
  });

  const result = await docClient.send(command);
  return result.Item;
}

async function getSchedule(clinicId, date) {
  const command = new GetCommand({
    TableName: APPOINTMENTS_TABLE,
    Key: {
      clinicId: parseInt(clinicId),
      date: date,
    },
  });

  const result = await docClient.send(command);
  return result.Item;
}

async function writeSchedule(schedule) {
  const command = new PutCommand({
    TableName: APPOINTMENTS_TABLE,
    Item: schedule,
  });

  await docClient.send(command);
}

function processBooking(schedule, detail, dentists) {
  const { time, email } = detail;
  const timeSlots = schedule.timeSlots;

  // Find the requested time slot
  const slotIndex = timeSlots.findIndex((slot) => slot.time === time);

  if (slotIndex === -1) {
    return {
      success: false,
      reason: "the requested time slot does not exist.",
    };
  }

  const slot = timeSlots[slotIndex];
  const bookings = slot.bookings || [];

  // Check if already booked by this email
  if (bookings.includes(email)) {
    return {
      success: false,
      reason: "you already have an appointment at this time.",
    };
  }

  // Check if slot is fully booked
  if (bookings.length >= dentists) {
    return {
      success: false,
      reason: "this time slot is fully booked.",
    };
  }

  // Add the booking
  bookings.push(email);
  timeSlots[slotIndex].bookings = bookings;
  schedule.timeSlots = timeSlots;

  return {
    success: true,
    schedule,
  };
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

  const [startStr, endStr] = hoursForDay.split("-");
  const startHour = parseFloat(startStr.split(":")[0]);
  const endHour = parseFloat(endStr.split(":")[0]);

  const timeSlots = [];
  let currentHour = startHour;

  while (currentHour <= endHour - 0.5) {
    const minutes = currentHour % 1 === 0.5 ? "30" : "00";
    const hour = Math.floor(currentHour);
    const time = `${hour}:${minutes}`;

    // Skip lunch and fika breaks
    if (time !== "12:00" && time !== "12:30" && time !== "14:30") {
      timeSlots.push({ time, bookings: [] });
    }

    currentHour += 0.5;
  }

  return timeSlots;
}

async function sendConfirmationEmail(detail) {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [detail.email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Welcome! Your booking request was successful for ${detail.date} at ${detail.time}. Thank you for choosing Dentistimo!`,
        },
      },
      Subject: {
        Data: "Booking Confirmed - Dentistimo",
      },
    },
    Source: FROM_EMAIL,
  });

  try {
    await sesClient.send(command);
    console.log("Confirmation email sent to:", detail.email);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

async function sendDenialEmail(detail, reason) {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [detail.email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Hello! We regret to inform you that your booking request for ${detail.date} at ${detail.time} cannot be completed, ${reason} Please try again at dentistimo.com`,
        },
      },
      Subject: {
        Data: "Booking Request Unsuccessful - Dentistimo",
      },
    },
    Source: FROM_EMAIL,
  });

  try {
    await sesClient.send(command);
    console.log("Denial email sent to:", detail.email);
  } catch (error) {
    console.error("Failed to send denial email:", error);
  }
}
