const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');

function toISOUTCMidSeconds(date) {
  return date.toISOString().split('.')[0] + 'Z';
}

const urls = [];
const details = [];

router.post('/shorturls', (req, res) => {
  const data = req.body;
  const now = new Date();
  const ex = new Date(now.getTime() + (data.validity * 60 * 1000));
  const item = {
    'url': data.url,
    'validity': data.validity,
    'shortUrl': data.shortcode,
    'createdAt': toISOUTCMidSeconds(now),
    expiry: toISOUTCMidSeconds(ex)
  };
  urls.push(item);
  const detailsItem = {
    'surl': item.shortUrl,
    'no of clicks': 0,
    'createdAt': item.createdAt,
    'expiry': item.expiry,
    'click_details': []
  };
  details.push(detailsItem);
  res.status(201).json({ shortlink: 'https://localhost:3000/' + item.shortUrl, expiry: item.expiry });
});

router.get('/shorturls/:url', (req, res) => {
  const su = req.params.url;
  const now = new Date();
  const urlItem = urls.find(item => item.shortUrl === su);
  if (!urlItem) {
    return res.status(404).json({ message: 'Short URL not found' });
  }
  if (new Date(urlItem.expiry) < now) {
    return res.status(410).json({ message: 'Short URL has expired' });
  }
  const detailsItem = details.find(item => item.surl === su);
  detailsItem['no of clicks'] += 1;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip) || {};
  const clickData = {
    timestamp: toISOUTCMidSeconds(now),
    source: req.get('referrer') || 'Direct',
    userAgent: req.get('User-Agent') || 'Unknown',
    ip: ip,
    geo: {
      country: geo.country || 'Unknown',
      region: geo.region || 'Unknown',
      city: geo.city || 'Unknown'
    }
  };
  detailsItem['click_details'].push(clickData);
  res.status(200).json({ shortURL_data: detailsItem });
});

router.get('/shorturls', (req, res) => {
  res.status(200).json(urls);
});

router.delete('/shorturls/:url', (req, res) => {
  const su = req.params.url;
  const index = urls.findIndex(item => item.shortUrl === su);
  if (index !== -1) {
    urls.splice(index, 1);
    res.status(200).json({ message: 'Short URL deleted successfully' });
  } else {
    res.status(404).json({ message: 'Short URL not found' });
  }
});

module.exports = router;
