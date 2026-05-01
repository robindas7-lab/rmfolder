module.exports = {
  SOURCE_URL: 'https://dpbossnat.com',
  SELECTORS: {
    MARKET_ROW: '.satta-result-table tbody tr', // Example selector
    MARKET_NAME: '.market-name', 
    MARKET_TIME: '.market-time',
    RESULT_JODI: '.jodi-result',
    RESULT_PANEL: '.panel-result',
    CHART_LINK: 'a.chart-link'
  },
  CRON_INTERVAL: 60000 // 60 seconds
};
