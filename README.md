# AI News & Tools Aggregator API

A Cloudflare Worker that scrapes and aggregates AI news and tools from multiple sources, providing a clean REST API for developers and applications.

## 🌟 Features

- **Multi-Source Support**: Fetch data from "There's An AI For That" and Toolify AI Daily News
- **Anti-Blocking Techniques**: Advanced rotation of user agents and headers to bypass restrictions
- **RESTful API**: Simple, intuitive endpoints with JSON responses
- **Error Resilience**: Graceful degradation and fallback extraction methods
- **CORS Enabled**: Ready for frontend consumption
- **Lightweight**: Runs on Cloudflare's edge network for low latency

## 📊 Supported Sources

| Source | Type | Description |
|--------|------|-------------|
| **There's An AI For That** | AI Tools Database | Latest and trending AI tools |
| **Toolify AI Daily News** | AI News Aggregator | Daily AI news articles with scores |

## 🚀 Quick Start

### 1. Deploy to Cloudflare Workers

1. **Sign up** for a [Cloudflare account](https://dash.cloudflare.com/sign-up) if you don't have one
2. **Create a new Worker** in the Workers & Pages section
3. **Copy** the code from `worker.js` and paste it into the editor
4. **Save and deploy** - your Worker will be available at `https://your-worker.workers.dev`

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tharunkumarmekala/AI-News-Tools-Aggregator-API)

### 2. Test the API

```bash
# Test API documentation
curl https://your-worker.workers.dev/

# Get latest AI tools
curl https://your-worker.workers.dev/latest

# Get trending AI tools
curl https://your-worker.workers.dev/trending

# Get daily AI news
curl https://your-worker.workers.dev/toolify

# Get all data combined
curl https://your-worker.workers.dev/all
```

## 📚 API Endpoints

### `GET /`
Returns API documentation and usage examples.

### `GET /latest`
Fetches latest AI tools from "There's An AI For That".

**Response Example:**
```json
{
  "success": true,
  "source": "There's An AI For That - Latest",
  "count": 15,
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "description": "AI-powered conversational assistant",
      "link": "https://chat.openai.com",
      "source": "There's An AI For That",
      "category": "latest"
    }
  ]
}
```

### `GET /trending`
Fetches trending AI tools from "There's An AI For That".

### `GET /toolify` or `GET /daily-ai-news`
Fetches daily AI news from Toolify AI.

**Response Example:**
```json
{
  "success": true,
  "source": "Toolify AI - Daily News",
  "count": 20,
  "data": [
    {
      "id": 1,
      "title": "AI Accelerates the Pursuit of Zero System Downtime",
      "description": "As digital infrastructure complexity increases...",
      "score": 4.0,
      "time_ago": "5m ago",
      "categories": ["Applications", "Industry News"],
      "source": "Toolify AI Daily News"
    }
  ]
}
```

### `GET /all`
Fetches data from all sources combined.

### `GET /status`
Returns API health status and uptime information.

## 🔧 Development

### Local Development

1. **Install Wrangler CLI** (Cloudflare's development tool):
```bash
npm install -g wrangler
```

2. **Clone the repository**:
```bash
git clone https://github.com/yourusername/ai-news-aggregator.git
cd ai-news-aggregator
```

3. **Login to Cloudflare**:
```bash
wrangler login
```

4. **Develop locally**:
```bash
wrangler dev
```

### Project Structure

```
ai-news-aggregator/
├── worker.js           # Main Cloudflare Worker code
├── README.md          # This documentation
├── package.json       # Dependencies (if any)
├── wrangler.toml      # Cloudflare Worker configuration
└── test/
    └── api-test.js    # API testing scripts
```

## ⚡ Performance

- **Edge Computing**: Runs on Cloudflare's global network
- **Caching**: Responses cached for 5 minutes (configurable)
- **Concurrent Fetching**: `/all` endpoint fetches sources in parallel
- **Lightweight**: Minimal dependencies, pure JavaScript

## 🛡️ Anti-Blocking Features

The scraper includes multiple techniques to avoid being blocked:

1. **User Agent Rotation**: Multiple browser user agents
2. **Header Randomization**: Varying request headers
3. **Referer Spoofing**: Random referer URLs
4. **Rate Limiting**: Exponential backoff between retries
5. **Fallback Methods**: Multiple HTML parsing strategies

## 📈 Rate Limiting

To respect target websites and avoid being blocked:
- Built-in delays between retry attempts
- Maximum of 3 retries per failed request
- Randomized wait times between requests

## 🚨 Error Handling

The API provides informative error responses:

```json
{
  "success": false,
  "error": "Failed to fetch Toolify after 3 attempts",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Common HTTP Status Codes:
- `200`: Success
- `404`: Endpoint not found
- `500`: Internal server error
- `503`: Service temporarily unavailable (during retries)

## 🔄 Updating Scraping Logic

If a website changes its HTML structure:

1. **Update regex patterns** in the appropriate function:
   - `scrapeTAFT()` for "There's An AI For That"
   - `extractNewsFromToolify()` for Toolify AI

2. **Add new extraction patterns** to the fallback arrays

3. **Test locally** before deploying:
```bash
wrangler dev --test
```

## 🌐 CORS Configuration

The API includes CORS headers for cross-origin requests:

```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400'
}
```

## 📦 Deployment Options

### 1. Cloudflare Dashboard (Simplest)
- Copy-paste code in Cloudflare's online editor
- No local setup required

### 2. Wrangler CLI (Advanced)
```bash
# Publish to Cloudflare
wrangler publish

# Deploy to specific environment
wrangler publish --env production
```

### 3. GitHub Actions (CI/CD)
- Automatically deploy on push to main branch
- See `.github/workflows/deploy.yml` for example

## 🧪 Testing

Basic API testing script included in `/test/api-test.js`:

```bash
# Run tests
node test/api-test.js
```

## 🔍 Monitoring

Check API health:
```bash
curl https://your-worker.workers.dev/status
```

Response includes:
- Operational status
- Available endpoints
- Uptime information
- Timestamp

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Contribution Guidelines:
- Add tests for new features
- Update documentation
- Follow existing code style
- Handle errors gracefully

## ⚠️ Legal Disclaimer

This tool is for educational and personal use only. Ensure you:
1. Respect websites' `robots.txt` files
2. Don't overwhelm servers with requests
3. Comply with terms of service of scraped websites
4. Use appropriate rate limiting

## 📞 Support

For issues and questions:
1. Check the [Issues](https://github.com/yourusername/ai-news-aggregator/issues) page
2. Review the [FAQ](#) section
3. Create a new issue with detailed description

---

**Happy Scraping!** 🚀

*Note: Websites may change their structure, requiring updates to the scraping logic.*
