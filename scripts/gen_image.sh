#!/bin/bash
API_KEY="sk-cp-xr-UVjSKYZK3H2sgJSkNC9PVCRXr5BzKZvpkFG7t6EEPqDVybB3DXLptDF6f20DB3gxbyLB8nePZW-dBFRQWCMcrZzGXi8Wkox3Bdi2KYIRNovSIlTORx1Y"
API_HOST="https://api.minimaxi.com"

curl -s "$API_HOST/v1/images/generation" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "image-01",
    "input": {"prompt": "Chinese ink wash style nine-tailed fox demon goddess, elegant pose, red dress, mystical aura, ancient Chinese fantasy art, detailed illustration"},
    "response_format": "url",
    "size": "1024x1024"
  }'