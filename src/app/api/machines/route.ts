import { NextResponse } from 'next/server';
import { IoTClient, ListThingsCommand } from "@aws-sdk/client-iot";
import { fromEnv } from "@aws-sdk/credential-providers";

export async function GET() {
  try {
    // Credentials will be loaded from environment variables on the server
    const credentials = fromEnv();
    const client = new IoTClient({
      region: process.env.AWS_REGION || 'us-west-2', // Ensure AWS_REGION is set in your .env.local or environment
      credentials
    });

    const command = new ListThingsCommand({});
    const response = await client.send(command);

    return NextResponse.json(response.things || []);
  } catch (err) {
    console.error("Error fetching AWS IoT things in API route:", err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch machines.';
    // Return a 500 status code for server errors
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}