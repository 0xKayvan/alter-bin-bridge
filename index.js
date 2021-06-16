const express = require('express')
const axios = require('axios')
const PORT = process.env.PORT || 5000

express()
  .get('/', (req, res) => res.send('works'))
  .get('/binance/get-market/:pricingMarketSymbol', async (req, res) => {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${req.params.pricingMarketSymbol}`
    console.log(url)
    const requestConfig = {
      // url: `https://api.binance.com/api/v3/trades?symbol=${req.params.pricingMarketSymbol}&limit=1`,
      url: url
    }
    try {
      const response = await axios(requestConfig)
      res.json(response.data)
    } catch (err) {
      console.log(err.message)
      res.sendStatus(400)
    }
  })
  .get('/binance/get-fees', async (req, res) => {
    const timestamp = Date.now()
    const paramsObject = {'timestamp': timestamp}
    const binanceApiKey = process.env.BINANCE_SPOT_MARKET_API_KEY
    const binanceSecretKey = process.env.BINANCE_SPOT_MARKET_SECRET_KEY

    const queryString = Object.keys(paramsObject).map((key) => {
      return `${key}=${paramsObject[key]}`
    }).join('&')
    const signature = CryptoJS.HmacSHA256(queryString, binanceSecretKey).toString()

    const requestConfig = {
      url: `https://api.binance.com/sapi/v1/capital/config/getall?timestamp=${timestamp}&signature=${signature}`,
      headers: {
        'X-MBX-APIKEY': binanceApiKey
      }
    }

    const response = await axios(requestConfig)
    res.json(response)
    // const result = response?.data
    // if (result && Array.isArray(result) && result.length > 0) {
      // return result
    // }
    // return null
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
