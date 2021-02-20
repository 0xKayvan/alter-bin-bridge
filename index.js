const express = require('express')
const axios = require('axios')
const PORT = process.env.PORT || 5000

express()
  .get('/', (req, res) => res.send('works'))
  .get('/binance/get-market/:pricingMarketSymbol', async (req, res) => {
    const requestConfig = {
      url: `https://api.binance.com/api/v3/trades?symbol=${req.params.pricingMarketSymbol}&limit=1`
    }
    try {
      const response = await axios(requestConfig)
      const result = response ? response.data : null
      console.log(result)
      if (result && Array.isArray(result) && result.length > 0) {
        // const lastTrade = result[0]
        return res.json(result)
      }
    } catch (err) {
      res.sendStatus(400)
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
