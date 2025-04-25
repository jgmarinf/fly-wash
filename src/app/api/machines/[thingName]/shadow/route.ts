import { NextRequest, NextResponse } from 'next/server';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { fromEnv } from '@aws-sdk/credential-providers';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ thingName: string }> }
) {
  const params = await context.params;
  const thingName = params.thingName;
  const region = process.env.AWS_REGION || 'us-west-2';
  const iotEndpoint = process.env.AWS_IOT_ENDPOINT; // Ensure this is set in your .env.local

  if (!thingName) {
    return NextResponse.json({ error: 'Thing name is required' }, { status: 400 });
  }

  if (!iotEndpoint) {
    console.error('AWS_IOT_ENDPOINT environment variable is not set.');
    return NextResponse.json({ error: 'Server configuration error: IoT endpoint missing' }, { status: 500 });
  }

  const url = new URL(`https://${iotEndpoint}/things/${thingName}/shadow`);

  try {
    const credentials = await fromEnv()();
    if (!credentials) {
      throw new Error('AWS credentials could not be loaded from environment variables.');
    }

    const signer = new SignatureV4({
      credentials,
      region: region,
      service: 'iotdevicegateway', // Correct service name for IoT Device Gateway
      sha256: Sha256,
    });

    const httpRequest = new HttpRequest({
      method: 'GET',
      protocol: 'https:',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        host: url.hostname, // Host header is required for signing
        'Content-Type': 'application/json',
      },
    });

    const signedRequest = await signer.sign(httpRequest);

    // Use fetch with the signed headers
    const response = await fetch(url.toString(), {
      method: signedRequest.method,
      headers: signedRequest.headers,
      // No body for GET request
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error fetching shadow for ${thingName}: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch shadow: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error(`Error fetching shadow for ${thingName}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch machine shadow.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}