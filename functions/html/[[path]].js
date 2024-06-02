const fs = require('fs');
const path = require('path');

export async function onRequest(context) {
  const filePath = context.params.path;
  const assetPath = path.join(__dirname, '..', '..', 'example', 'html', filePath);
  try {
    // Read the file asynchronously
    const fileContent = await fs.promises.readFile(assetPath, 'utf8');

    // Return the file content as the response
    return new Response(fileContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    // If the file is not found or there's an error reading it, return a 404 response
    return new Response('Not Found', { status: 404 });
  }
}
