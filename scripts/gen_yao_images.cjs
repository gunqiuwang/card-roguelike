/**
 * MiniMax Image Generation Script
 * Generates yao (monster) portrait artwork for the game
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const API_KEY = fs.readFileSync(path.join(__dirname, 'minimax_api_key.txt'), 'utf8').trim();

const API_HOST = 'api.minimaxi.com';

const YAO_PROMPTS = [
  // Chapter 1 - Qingqiu
  {
    id: 'qinghu',
    name: '青狐小妖',
    prompt: 'Chinese ink wash style small fox spirit girl, cute appearance, three-eyed, flowing green dress, fox features with elegant mystique, ancient Chinese fantasy, vertical portrait, detailed illustration'
  },
  {
    id: 'yehu',
    name: '夜狐',
    prompt: 'Chinese ink wash style night fox spirit, dark ethereal appearance, shadowy flowing robes, glowing eyes, haunting beauty, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'xiaoshou',
    name: '鸮首',
    prompt: 'Chinese ink wash style owl-headed humanoid creature, bird face with human body, eerie yet majestic, nocturnal predator atmosphere, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'caotou_she',
    name: '草头蛇',
    prompt: 'Chinese ink wash style snake spirit with grass head, serpentine body, subtle green tones, mystical poison attribute, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'jiuweihu_elite',
    name: '九尾狐·绯 (精英)',
    prompt: 'Chinese ink wash style nine-tailed fox maiden, elegant red robes, six tails visible, graceful battle pose, fox fire spirits, ancient Chinese fantasy, vertical portrait'
  },
  // Chapter 2 - Taotie
  {
    id: 'gold_eater',
    name: '食金兽',
    prompt: 'Chinese ink wash style gold-eating beast, creature that consumes precious metals, metallic scales, glowing with inner light, treasure hoard aesthetic, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'desire_ghost',
    name: '欲念鬼',
    prompt: 'Chinese ink wash style desire ghost spirit, ethereal wispy form, seductive yet terrifying aura, flames of greed motif, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'stone_guardian',
    name: '石守将',
    prompt: 'Chinese ink wash style stone warrior guardian, massive armored figure, mountain-like solidity, ancient golem aesthetic, earth tones, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'furnace_wraith',
    name: '炉精',
    prompt: 'Chinese ink wash style furnace spirit, flame-wreathed elemental, ember glow, alchemical fire theme, ancient Chinese fantasy, vertical portrait'
  },
  // Chapter 3 - Guixu
  {
    id: 'dead_sailor',
    name: '亡海员',
    prompt: 'Chinese ink wash style ghostly dead sailor, spectral drowned sailor, waterlogged robes, ghostly green-blue tones, deep sea atmosphere, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'sea_serpent',
    name: '深海蚺',
    prompt: 'Chinese ink wash style deep sea serpent creature, massive snake-like water dragon, sinuous body, oceanic depths atmosphere, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'wave_specter',
    name: '浪啸幽灵',
    prompt: 'Chinese ink wash style wave啸幽灵 spirit, ghost of one who drowned at sea, crashing wave elements, tragic ethereal beauty, ancient Chinese fantasy, vertical portrait'
  },
  // Chapter 4 - Kunlun
  {
    id: 'celestial_deer',
    name: '天鹿',
    prompt: 'Chinese ink wash style celestial divine deer, luminous white deer with spiraling antlers, heavenly aura, misty mountain background, divine immortal realm, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'cloud_walker',
    name: '云行者',
    prompt: 'Chinese ink wash style cloud walking celestial, ethereal humanoid figure walking on clouds, flowing robes, mist and cloud elements, heavenly atmosphere, ancient Chinese fantasy, vertical portrait'
  },
  {
    id: 'staff_spirit',
    name: '杖灵',
    prompt: 'Chinese ink wash style staff spirit, sentient magical staff with face, ancient weapon artifact, glowing runes, Taoist immortal aesthetic, ancient Chinese fantasy, vertical portrait'
  }
];

function generateImage(yao) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'image-01',
      prompt: yao.prompt,
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
        console.log(`  Raw response: ${data.substring(0, 500)}`);
        try {
          const result = JSON.parse(data);
          if (result.base_resp.status_code === 0 && result.data && result.data.image_urls && result.data.image_urls[0]) {
            const url = result.data.image_urls[0];
            console.log(`SUCCESS: ${yao.name} (${yao.id})`);
            console.log(`  URL: ${url}`);
            resolve({ yao, url });
          } else {
            console.log(`FAILED: ${yao.name} (${yao.id})`);
            console.log(`  Response: ${JSON.stringify(result)}`);
            resolve({ yao, url: null, error: result });
          }
        } catch (e) {
          console.log(`ERROR: ${yao.name} - Parse error: ${e.message}`);
          resolve({ yao, url: null, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`NETWORK ERROR: ${yao.name} - ${e.message}`);
      resolve({ yao, url: null, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'public', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting yao portrait image generation...\n');

  const results = [];
  for (const yao of YAO_PROMPTS) {
    console.log(`Generating: ${yao.name}...`);
    const result = await generateImage(yao);
    results.push(result);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n=== Generation Summary ===');
  results.forEach(r => {
    if (r.url) {
      console.log(`[OK] ${r.yao.name}: ${r.url}`);
    } else {
      console.log(`[FAIL] ${r.yao.name}`);
    }
  });

  // Download images to public/images/
  console.log('\n=== Downloading Images ===');
  for (const result of results) {
    if (result.url) {
      await downloadImage(result.url, path.join(outputDir, `${result.yao.id}.jpg`));
    }
  }
  console.log('\nDone! Images saved to public/images/');
}

function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
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
        console.log(`Failed to download ${outputPath}: HTTP ${res.statusCode}`);
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

main().catch(console.error);
