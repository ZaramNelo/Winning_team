export async function GET() {
  return new Response('Hello from test API', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function POST() {
  return new Response('POST method works', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
