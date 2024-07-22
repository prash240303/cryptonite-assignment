# Cryptonite

## Overview

Cryptonite is a modern web application designed for tracking a wide range of cryptocurrencies. Built with Next.js, the app provides real-time updates on cryptocurrency prices and detailed information about individual cryptocurrencies, including historical data and market trends.

## Objectives

- **User-Friendly Interface**: Create an intuitive and easy-to-use web application for tracking cryptocurrencies.
- **Real-Time Updates**: Implement real-time updates for cryptocurrency prices.
- **Comprehensive Information**: Offer detailed information about individual cryptocurrencies, including historical data and market trends.

## Features

- **Real-Time Price Tracking**: Monitor current prices and receive real-time updates for various cryptocurrencies.
- **In-Depth Cryptocurrency Information**: Access detailed information on individual cryptocurrencies, including historical data and market trends.
- **Graphical Representation**: Visualize market trends with graphs, including market cap trends for major cryptocurrencies.
- **Watchlist Management**: Manage a personal watchlist with up to 15 cryptocurrencies, utilizing drag-and-drop functionality for easy addition and removal.
- **Dynamic Routing**: View detailed information about specific coins through dynamic routing based on coin IDs.
- **Caching and Performance**: Cache API responses on the client side with an expiry time to enhance performance.
- **Error Handling and Notifications**: Receive error Messages for errors encountered during data fetching.

## Pages and Features

### Market Overview

- **Market Cap Graph**: Displays the market cap of Bitcoin, Ethereum, and Litecoin over the past year.
- **Company Holdings**: Provides information about companies holding Bitcoin and Ethereum.
- **Recently Viewed**: Shows recently viewed cryptocurrencies for easy access.

### Trending Section

- **Trending Coins**: Displays information about currently trending coins.
- **Watchlist Drag and Drop**: Allows users to drag and drop coins from the trending section into their watchlist for future reference.

### Explore Page

- **Paginated View**: Provides details of top coins with pagination (20 coins per page).

### Custom Coin Page

- **Dynamic Routing**: Shows details of a specific coin based on the coin ID from the URL parameter.
- **Line Chart**: Illustrates the price variation of the coin over the past year.
- **Fundamental Information**: Offers key details and a description of the coin.

## Technical Details

- **Tech Stack**: Utilizes Next.js for server-side rendering and routing, and Tailwind CSS for styling.
- **Caching**: Implements client-side caching with expiry time for API responses.
- **Rate Limiting**: Includes API request rate limiting to manage traffic and prevent abuse.
- **UI Design**: Employs ShadCN UI components for a better UI experience and easy application of dark mode themes.
- **Dark Mode**: Features a dark mode theme for improved user experience.

## Getting Started


To start the development server, run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# Add API_KEY to .env.local
for accessing the API, create a 'API_KEY' value from coingekko and add to .env.local file
