/**
 * Generate game cover image using MiniMax API
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = fs.readFileSync(path.join(__dirname, 'minimax_api_key.txt'), 'utf8').trim();
const API_HOST = 'api.minimaxi.com';

const PROMPTS = [
  {
    id: 'cover_main',
    name: 'Game Cover',
    prompt: 'Chinese ink wash style game cover art, mystical ancient Chinese fantasy theme, a lone wanderer on mountain path at dusk, nine-tailed fox spirit glimpsed in mist behind, thunder clouds and mountain landscape, ornate seal talisman floating, dark ink tones with ember orange accents, vertical composition, atmospheric and dramatic, detailed illustration'
  }
];

function generateImage(item) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'image-01',
      prompt: item.prompt,
      response_format: 'url',
      size: '1024x1024'
    });

    const options = {
      hostname: API_HOST,
      path: '/v1/image_generation',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.base_resp.status_code === 0 && result.data && result.data.image_urls && result.data.image_urls[0]) {
            console.log(`SUCCESS: ${item.name}`);
            console.log(`  URL: ${result.data.image_urls[0]}`);
            resolve({ item, url: result.data.image_urls[0] });
          } else {
            console.log(`FAILED: ${item.name}`);
            console.log(`  Response: ${JSON.stringify(result)}`);
            resolve({ item, url: null, error: result });
          }
        } catch (e) {
          console.log(`ERROR: ${item.name} - Parse error: ${e.message}`);
          resolve({ item, url: null, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`NETWORK ERROR: ${e.message}`);
      resolve({ item, url: null, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const { URL } = require('url');
    const url = new URL(imageUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET'
    };
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        const writeStream = fs.createWriteStream(outputPath);
        res.pipe(writeStream);
        writeStream.on('finish', () => {
          console.log(`Downloaded: ${path.basename(outputPath)}`);
          resolve();
        });
      } else {
        console.log(`Failed to download: HTTP ${res.statusCode}`);
        resolve();
      }
    });
    req.on('error', (e) => {
      console.log(`Error downloading: ${e.message}`);
      resolve();
    });
    req.end();
  });
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'public', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating game cover...\n');
  const result = await generateImage(PROMPTS[0]);

  if (result.url) {
    await downloadImage(result.url, path.join(outputDir, 'cover.jpg'));
    console.log('\nCover saved to public/images/cover.jpg');
  }
}

main().catch(console.error);