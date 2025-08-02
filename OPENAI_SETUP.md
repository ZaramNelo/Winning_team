# OpenAI API Setup Guide (Serverless)

This guide will help you set up OpenAI API integration for the symptom analysis feature using serverless functions.

## Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Click "Create new secret key"
5. Give it a name (e.g., "HealthCare Hub")
6. Copy the generated API key (starts with `sk-`)

## Step 2: Set Up Environment Variables

### Local Development:

1. Create or update your `.env.local` file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### Production Deployment (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXTAUTH_SECRET`: A random secret key
   - `NEXTAUTH_URL`: Your production URL
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

## Step 3: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Go to your app and try the symptom checker
3. Enter some symptoms and click "Analyze Symptoms"
4. You should see AI-generated analysis

## Step 4: Deploy to Production

### Vercel Deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js app
4. Set environment variables in Vercel dashboard
5. Deploy!

### Other Platforms:

- **Netlify**: Use `netlify.toml` for configuration
- **Railway**: Set environment variables in dashboard
- **AWS Lambda**: Use serverless framework

## Serverless Features

### What's Optimized:

- **Rate Limiting**: 10 requests per minute per IP
- **Timeout Handling**: 30-second request timeout
- **Error Handling**: Comprehensive error responses
- **Cost Optimization**: Reduced token limits
- **Caching Headers**: Proper cache control
- **Input Validation**: Request sanitization

### Performance Benefits:

- **Cold Start Optimization**: Minimal startup time
- **Memory Management**: Efficient resource usage
- **Scalability**: Automatic scaling based on demand
- **Cost Efficiency**: Pay only for actual usage

## API Features

### What the AI Does:

- **Symptom Analysis**: Analyzes user-provided symptoms
- **Condition Assessment**: Suggests possible conditions with confidence levels
- **Severity Assessment**: Categorizes as Mild/Moderate/Severe
- **Personalized Recommendations**: Considers age and duration
- **Medical Guidelines**: Provides actionable health advice

### Safety Features:

- **Medical Disclaimers**: Always includes disclaimers
- **Conservative Assessment**: Err on the side of caution
- **Professional Guidance**: Recommends seeing doctors when appropriate
- **Age Considerations**: Adjusts advice based on patient age
- **Rate Limiting**: Prevents abuse and controls costs

## Cost Considerations

### OpenAI Pricing (as of 2024):

- **GPT-4**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Typical symptom analysis**: ~400-600 tokens total (optimized)
- **Estimated cost per analysis**: $0.01-$0.03 (reduced from previous estimate)

### Serverless Cost Optimization:

1. **Reduced Token Limits**: Max 800 tokens per response
2. **Rate Limiting**: Prevents excessive API calls
3. **Timeout Handling**: Prevents hanging requests
4. **Efficient Prompts**: Optimized prompt engineering

## Troubleshooting

### Common Issues:

1. **"Rate limit exceeded"**:

   - Wait 1 minute before trying again
   - This is a safety feature to control costs

2. **"Request timeout"**:

   - Try again with a shorter symptom description
   - Check your internet connection

3. **"AI service temporarily unavailable"**:

   - Check your OpenAI account balance
   - Verify API key permissions
   - Check OpenAI service status

4. **"OpenAI API key not configured"**:
   - Check your environment variables
   - Restart your development server
   - Verify the API key is correct

### Production Issues:

1. **Environment Variables Not Loading**:

   - Check Vercel dashboard settings
   - Redeploy after adding variables
   - Verify variable names match exactly

2. **CORS Errors**:

   - Check `vercel.json` configuration
   - Verify API route headers

3. **Function Timeout**:
   - Check `vercel.json` maxDuration setting
   - Optimize your prompts for faster responses

## Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** for all API keys
3. **Implement rate limiting** to prevent abuse
4. **Add request validation** to prevent malicious inputs
5. **Monitor API usage** for unusual patterns
6. **Use HTTPS** in production
7. **Validate all inputs** server-side

## Monitoring and Analytics

### Vercel Analytics:

- Monitor function execution times
- Track API usage and costs
- Set up alerts for errors

### OpenAI Usage:

- Check usage at: https://platform.openai.com/usage
- Set up billing alerts
- Monitor token consumption

## Advanced Features

You can extend the serverless integration with:

- **Caching Layer**: Redis for response caching
- **Queue System**: Background processing for complex analyses
- **Multi-language Support**: Analyze symptoms in different languages
- **Image Analysis**: Upload photos of rashes, injuries, etc.
- **Voice Input**: Speech-to-text for symptom description
- **Follow-up Questions**: Interactive symptom analysis
- **Medical History Integration**: Consider past conditions

## Example API Response

```json
{
  "success": true,
  "data": {
    "possibleConditions": [
      {
        "name": "Tension Headache",
        "confidence": 85,
        "severity": "Mild"
      }
    ],
    "recommendations": [
      "Rest in a quiet, dark room",
      "Stay hydrated",
      "Consider over-the-counter pain relievers"
    ],
    "nextSteps": "Consult a doctor if headache persists for more than 3 days",
    "aiInsights": {
      "confidence": 85,
      "analysisTime": "2.3 seconds",
      "symptomsAnalyzed": 5,
      "ageConsideration": "Patient age: 25 years",
      "durationImpact": "Duration: 1-3 days"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "model": "gpt-4",
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 150,
    "total_tokens": 270
  },
  "requestId": "abc123def"
}
```

This serverless setup provides a scalable, cost-effective, and secure AI-powered symptom checker that can handle high traffic while maintaining excellent performance!
