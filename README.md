# HabiStride UI

Next.js application for HabiStride. The UI uses App Router, shadcn-style primitives, Lucide icons and the Quicksand font.

## Local development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local` to the same OAuth 2.0 Web Client ID used by the API.

The browser calls `/backend/*`; the Next.js route handler proxies requests to `API_INTERNAL_URL` (defaults to `http://localhost:3000`).

On Render Free, set `API_INTERNAL_URL=https://habi-stride-api.onrender.com` on the UI service. The public URL is used because a Free Web Service cannot receive private-network traffic from another service.

## Routes

- `/login`, `/register`
- `/dashboard`, `/habits`, `/insights`, `/tree`, `/coach`, `/settings`

## Docker

Run from `habistride-nestjs-api`:

```bash
docker compose up -d --build
```

The UI is available at `http://localhost:3100`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
