// pages/api/postQuote.js

import axios from 'axios';
import { TwitterApi } from 'twitter-api-v2';

// Zen Quotes API endpoint
const zenQuotesUrl = 'https://zenquotes.io/api/random';

// Twitter API credentials
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET
});

// Function to fetch a random quote from Zen Quotes API
async function fetchQuote() {
  try {
    const response = await axios.get(zenQuotesUrl);
    return response.data[0].q + ' - ' + response.data[0].a;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

// Function to post a tweet
async function postTweet(tweet) {
  try {
    await twitterClient.v1.tweet(tweet);
    console.log('Tweet posted successfully:', tweet);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}

export default async function handler(req, res) {
  const quote = await fetchQuote();
  if (quote) {
    await postTweet(quote);
    res.status(200).json({ message: 'Tweet posted successfully.' });
  } else {
    res.status(500).json({ message: 'Failed to fetch quote.' });
  }
}
