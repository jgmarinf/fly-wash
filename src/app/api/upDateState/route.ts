import { NextResponse } from 'next/server';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { fromEnv } from '@aws-sdk/credential-provider-env';

export async function POST(request: Request) {
  try {
    const { thingName } = await request.json();
    
    if (!thingName ) {
      return NextResponse.json({ error: 'thingName is required' }, { status: 400 });
    }

    console.log(thingName.thingName, "thingName");

    const region = process.env.AWS_REGION || 'us-west-2';
    const iotEndpoint = process.env.AWS_IOT_ENDPOINT;
    const url = new URL(`https://${iotEndpoint}/topics/cmd/things/${thingName.thingName}/vending`);

    const credentials = await fromEnv()();
    const signer = new SignatureV4({
      credentials,
      region,
      service: 'iotdevicegateway',
      sha256: Sha256,
    });

    const httpRequest = new HttpRequest({
      method: 'POST',
      protocol: 'https:',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        host: url.hostname,
      },
      body: JSON.stringify({"Update":"UpdTo"}),
    });

    const signedRequest = await signer.sign(httpRequest);
    const response = await fetch(url.toString(), {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body,
    });

    if (!response.ok) {
      throw new Error(`AWS IoT error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Venta remota error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to process remote sale';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
