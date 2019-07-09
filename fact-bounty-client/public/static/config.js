var configuration = (function() {
  var obj = {}

  var mashape_key = '3298980fe4msh6cad2540efad0b6p11d7a7jsn9f110b5fdf9e'

  obj.articles_url = 'https://localhost:8080/articles'
  obj.articles_headers = {
    'X-Mashape-Key': mashape_key,
    Accept: 'application/json'
  }

  obj.timeline_url = 'https://localhost:8080/timeline'
  obj.timeline_headers = {
    'X-Mashape-Key': mashape_key,
    Accept: 'application/json'
  }

  obj.network_url = 'https://localhost:8080/network'
  obj.network_headers = {
    'X-Mashape-Key': mashape_key,
    Accept: 'application/json'
  }

  obj.top_articles_url = 'https://localhost:8080/top-articles'
  obj.top_articles_headers = { 'X-Mashape-Key': mashape_key }

  obj.top_users_url = 'https://localhost:8080/top-users'
  obj.top_users_headers = { 'X-Mashape-Key': mashape_key }

  obj.botometer_url = 'https://example.com'
  obj.botometer_headers = {
    'X-Mashape-Key': '--KEY--',
    Accept: 'application/json'
  }

  obj.botcache_url = 'https://example.com/api/scores'
  obj.feedback_url = 'https://example.com/api/feedback'

  obj.twitter_key = 'znlzy-T1dNp-G-NrjmwhxsiY-tg'

  obj.botcache_chunk_sizes = [
    // 50,
    // 200,
    2000
  ]

  return obj
})()
