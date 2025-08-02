# Medical ChatGPT Assistant with Pharmacy Finder

A Next.js-powered medical assistant that provides health information and helps users find nearby pharmacies using ChatGPT and Google Maps integration.

## Features

🏥 **Medical Consultation**
- Describe symptoms and get medical information
- Over-the-counter medication recommendations
- When to seek professional medical help
- Built-in medical disclaimers for safety

🗺️ **Pharmacy Finder**
- Find nearest pharmacies using GPS location
- Manual address input for pharmacy search
- Google Maps integration for directions
- Real-time location detection

💬 **General Chat**
- Powered by OpenAI's ChatGPT API
- Interactive chat interface
- Real-time responses

## Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API Key
- Google Maps API Key (optional, for enhanced features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Winning_team
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - (Optional) Add Google Maps API key for enhanced pharmacy search

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
