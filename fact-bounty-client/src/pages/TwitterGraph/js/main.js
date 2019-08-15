import Twitter from './twitter'
import moment from 'moment'
import HoaxyGraph from './graph'
import TwitterSearchTimeline from './twitter_search_timeline'
import { Observable, Subject } from 'rxjs'

var Main = function(query, result_type) {
  console.log('starting main')

  // *********data*************
  var query_type = result_type
  var max_id = ''
  var query_limit = 10
  var query_string = decodeURIComponent(query)
  var twitterDates = []
  var twitterEdges = []
  var twitterUserSet = new Set()
  var show_zoom_buttons = false
  var failed_to_get_network = false
  var modal_opacity = false
  var graph_column_size = 3
  var animationAvailable = true
  var lang = 'en'
  var spinner_notices = {
    graph: '',
    timeline: '',
    articles: ''
  }
  var show_graphs = true
  var feedback_form = {
    display: false,
    comment: '',
    type: '',
    type_choices: {
      Human: 'human',
      Bot: 'bot',
      'Cyborg (human using e.g. a scheduler)': 'cyborg',
      Organization: 'organization'
    }
  }
  var node_modal_content = {
    staleAcctInfo: {
      isStale: false,
      newId: '',
      oldSn: '',
      newSn: ''
    },
    showStaleContent: true,
    user_id: '',
    screenname: '',
    has_quoted: [],
    has_mentioned: [],
    has_retweeted: [],
    is_quoted_by: [],
    is_mentioned_by: [],
    is_retweeted_by: [],
    has_quoted_count: 0,
    has_mentioned_count: 0,
    has_retweeted_count: 0,
    is_quoted_by_count: 0,
    is_mentioned_by_count: 0,
    is_retweeted_by_count: 0,
    completeAutomationProbability: 0,
    botscore: 0,
    botcolor: 0
  }
  var edge_modal_content = {
    edge: {},
    tweet_urls: {},
    label_string: ''
  }
  var getting_bot_scores = {
    running: false
  }
  var initialize_key = 'znlzy-T1dNp-G-NrjmwhxsiY-tg'
  var twitter = Twitter(initialize_key)
  var graphAnimation = {
    playing: false,
    increment: 0,
    total_increments: 240,
    current_timestamp: 0,
    paused: false
  }
  var twitterRateLimitReachedObj = {
    isReached: false
  }
  var graph = new HoaxyGraph({
    spinStart: spinStart,
    spinStop: spinStop,
    toggle_edge_modal: toggleEdgeModal,
    toggle_node_modal: toggleNodeModal,
    node_modal_content: node_modal_content,
    edge_modal_content: edge_modal_content,
    getting_bot_scores: getting_bot_scores,
    spinner_notices: spinner_notices,
    twitter: twitter,
    graphAnimation: graphAnimation,
    twitterRateLimitReached: twitterRateLimitReachedObj
  })
  var twitterTimeline = {
    claim: {
      timestamp: [],
      volume: []
    },
    fact_checking: {
      timestamp: [],
      volume: []
    }
  }
  var hoaxyEdges = []
  var show_articles = false
  var checked_articles = []
  var show_node_modal = false
  var globalTwitterSearchTimeline = new TwitterSearchTimeline({
    updateDateRangeCallback: updateGraph,
    graphAnimation: graphAnimation
  })
  globalTwitterSearchTimeline.chart.interactiveLayer.dispatch.on(
    'elementClick',
    function(e) {
      pauseGraphAnimation()
      graphAnimation.current_timestamp = Math.floor(e.pointXValue)
      graphAnimation.increment = 0
      graphAnimation.playing = true
      graphAnimation.paused = true
      unpauseGraphAnimation()
      pauseGraphAnimation()
      // console.debug(new Date(e.pointXValue))
    }
  )
  var timeline = globalTwitterSearchTimeline

  //observable
  var modal$ = new Subject()

  function getModalObservable() {
    return modal$
  }

  // **********functions***********
  stopGraphAnimation()
  resetTwitterSearchResults()
  resetHoaxySearchResults()

  function stopGraphAnimation() {
    graph.stopAnimation()
    graphAnimation.current_timestamp = 0
  }

  function resetTwitterSearchResults() {
    // Re-enabling animation
    animationAvailable = true
    // Reset Twitter Edge list
    twitterEdges = []
    // Reset Twitter timeline
    twitterTimeline = {
      claim: {
        timestamp: [],
        volume: []
      },
      fact_checking: {
        timestamp: [],
        volume: []
      }
    }
    // Used to only paginate up to 1000 nodes
    twitterUserSet = new Set()
    twitterDates = []
  }

  function resetHoaxySearchResults() {
    // Re-enabling animation
    animationAvailable = true
    hoaxyEdges = []
  }

  function paginateTwitterRequests() {
    console.log('getting twitter search results')
    const tweetsResponse = twitter.getTweets(
      query_string,
      lang,
      max_id,
      query_type
    )
    tweetsResponse.then(
      function(response) {
        query_limit -= 1
        if (response.search_metadata.next_results) {
          // Retrieving the maximum id for which the next result we must return tweets smaller than, hence older than this tweet
          max_id = response.statuses[response.statuses.length - 1].id_str
        } else {
          // No need to make another request as we are done (there are no more responses left)
          query_string = ''
        }
        buildTwitterEdgesTimeline(response.statuses)
        if (
          twitterUserSet.size < 1000 &&
          query_string !== '' &&
          query_limit > 0
        ) {
          // Continue pagination
          paginateTwitterRequests()
        } else {
          // Stop pagination
          console.log('Stopping get twitter search results')
          // Create timeline and graph given the Twitter results
          buildTwitterGraph()
          // Check if animation should be disabled or not
          checkIfShouldDisableAnimation(twitterEdges)
        }
      },
      function(error) {
        console.log('stopping getTwitterSearchResults')
        if (error.error.status === 429) {
          console.error('Twitter rate limit reached. Try again in 15 minutes.')
        } else {
          console.log('Error : ', error)
          toggleModal('authenticate', true)
        }
      }
    )
  }
  paginateTwitterRequests()

  function buildTwitterEdgesTimeline(twitterEntities) {
    console.log('Build graph')

    function TwitterEdge() {
      this.canonical_url = ''
      this.date_published = ''
      this.domain = ''
      this.from_user_botscore = ''
      this.from_user_id = ''
      this.from_user_screen_name = ''
      this.id = ''
      this.is_mention = false
      this.original_query = ''
      this.pub_date = ''
      this.site_domain = ''
      this.site_type = 'claim'
      this.title = ''
      this.to_user_botscore = ''
      this.to_user_id = ''
      this.to_user_screen_name = ''
      this.tweet_created_at = ''
      this.tweet_id = ''
      this.tweet_type = ''
      this.tweet_url = ''
      this.url_id = ''
      this.url_raw = ''
    }
    var totalTwitterEntities = twitterEntities.length
    var key = totalTwitterEntities
    var nonNullFrom = false
    var nonNullTo = false

    function updateEdgesAndTimeline(typeOfTweet) {
      try {
        twitterEdge.tweet_id = twitterEntities[key].id_str
      } catch (err) {
        twitterEdge.tweet_id = ''
      }
      var formattedDate = formatDate(twitterEntities[key].created_at)
      twitterDates.push(new Date(formattedDate))

      // Updating edges
      twitterEdge.date_published = formattedDate
      twitterEdge.pub_date = formattedDate
      twitterEdge.tweet_created_at = formattedDate
      twitterEdge.tweet_type = typeOfTweet
      twitterEdges.push(twitterEdge)
    }
    while (key > 0) {
      key = key - 1
      // Checking for quotes
      nonNullFrom = false
      nonNullTo = false
      if (twitterEntities[key].quoted_status) {
        var twitterEdge = new TwitterEdge()

        try {
          twitterEdge.from_user_id =
            twitterEntities[key].quoted_status.user.id_str
          twitterUserSet.add(twitterEdge.from_user_id)
          nonNullFrom = true
        } catch (err) {
          twitterEdge.from_user_id = ''
        }

        try {
          twitterEdge.from_user_screen_name =
            twitterEntities[key].quoted_status.user.screen_name
          nonNullFrom = true
        } catch (err) {
          twitterEdge.from_user_screen_name = ''
        }

        try {
          twitterEdge.to_user_id = twitterEntities[key].user.id_str
          twitterUserSet.add(twitterEdge.to_user_id)
          nonNullTo = true
        } catch (err) {
          twitterEdge.to_user_id = ''
        }

        try {
          twitterEdge.to_user_screen_name =
            twitterEntities[key].user.screen_name
          nonNullTo = true
        } catch (err) {
          twitterEdge.to_user_screen_name = ''
        }

        if (nonNullFrom && nonNullTo) {
          // Populate the rest of the edge entities
          updateEdgesAndTimeline('quote')
        }
      }

      // Checking for retweets
      nonNullFrom = false
      nonNullTo = false
      if (twitterEntities[key].retweeted_status) {
        var twitterEdge = new TwitterEdge()

        try {
          twitterEdge.from_user_id =
            twitterEntities[key].retweeted_status.user.id_str
          twitterUserSet.add(twitterEdge.from_user_id)
          nonNullFrom = true
        } catch (err) {
          twitterEdge.from_user_id = ''
        }

        try {
          twitterEdge.from_user_screen_name =
            twitterEntities[key].retweeted_status.user.screen_name
          nonNullFrom = true
        } catch (err) {
          twitterEdge.from_user_screen_name = ''
        }

        try {
          twitterEdge.to_user_id = twitterEntities[key].user.id_str
          twitterUserSet.add(twitterEdge.to_user_id)
          nonNullTo = true
        } catch (err) {
          twitterEdge.to_user_id = ''
        }

        try {
          twitterEdge.to_user_screen_name =
            twitterEntities[key].user.screen_name
          nonNullTo = true
        } catch (err) {
          twitterEdge.to_user_screen_name = ''
        }

        if (nonNullFrom && nonNullTo) {
          // Populate the rest of the edge entities
          // Attempting to retrieve tweet id
          updateEdgesAndTimeline('retweet')
        }
      } else {
        // Checking for mentions
        // Mentions will only occur if the Tweet entity is not a retweet so also doing this check here
        if (twitterEntities[key].entities.user_mentions.length > 0) {
          nonNullFrom = false
          nonNullTo = false
          // Mentions found, creating edges for each one
          for (
            var mention = 0;
            mention < twitterEntities[key].entities.user_mentions.length;
            mention++
          ) {
            var twitterEdge = new TwitterEdge()
            twitterEdge.is_mention = true

            try {
              twitterEdge.from_user_id = twitterEntities[key].user.id_str
              twitterUserSet.add(twitterEdge.from_user_id)
              nonNullFrom = true
            } catch (err) {
              twitterEdge.from_user_id = ''
            }

            try {
              twitterEdge.from_user_screen_name =
                twitterEntities[key].user.screen_name
              nonNullFrom = true
            } catch (err) {
              twitterEdge.from_user_screen_name = ''
            }

            try {
              twitterEdge.to_user_id =
                twitterEntities[key].entities.user_mentions[mention].id_str
              twitterUserSet.add(twitterEdge.to_user_id)
              nonNullTo = true
            } catch (err) {
              twitterEdge.to_user_id = ''
            }

            try {
              twitterEdge.to_user_screen_name =
                twitterEntities[key].entities.user_mentions[mention].screen_name
              nonNullTo = true
            } catch (err) {
              twitterEdge.to_user_screen_name = ''
            }

            if (nonNullFrom && nonNullTo) {
              // Populate the rest of the edge entities
              updateEdgesAndTimeline('mention')
            }
          }
        }
      }
    }
    console.log('Stopping build graph')
  }

  function formatDate(unFormattedDate) {
    // UnFormatted date should come as 'Day Mo DD HH:MM:SS +0000 YYYY' which must be parsed and changed
    // Changing to the YYYY-MM-DDTHH:MM:SSZ date format
    var createdAtArray = unFormattedDate.split(' ')
    // Invoking the moment.js package to yield us the number months
    var month = moment.monthsShort().indexOf(createdAtArray[1]) + 1
    var monthStr = month.toString()
    // Padding the month with an extra prefix 0 in case it is just length of one i.e. 8 -> 08
    if (monthStr.length === 1) {
      monthStr = '0' + monthStr
    }
    // Parsing HH:MM:SS part
    var hourMinSec = createdAtArray[3].split(':')
    // Creating final formatted date
    var formattedDate =
      createdAtArray[5] +
      '-' +
      monthStr +
      '-' +
      createdAtArray[2] +
      'T' +
      hourMinSec[0] +
      ':' +
      hourMinSec[1] +
      ':' +
      hourMinSec[2] +
      'Z'
    return formattedDate
  }

  function buildTwitterGraph(dont_reset) {
    if (twitterEdges.length === 0) {
      show_zoom_buttons = false
      failed_to_get_network = true
      spinner_notices.graph = ''
      show_graphs = true
      // Vue.nextTick(function () {
      graph.updateEdges(twitterEdges)
      updateGraph()
      graph.score_stats.reset()

      if (!dont_reset) {
        graph.resetBotscores()
        graph.setLang(lang)
        graph.getBotCacheScores()
      }
      spinStop('generateNetwork')
      scrollToElement('secondary_form')
      // });
      spinStop('buildGraph')
    } else {
      graph.updateEdges([])
      // Starting with the TimeLine
      //sorting timeline in ascending order
      twitterDates.sort(sortDates)
      //creating date bins
      createTwitterDateBins(twitterDates)
      spinner_notices.timeline = ''
      spinStart('updateTimeline')
      show_graphs = true

      // console.debug(v.twitterTimeline);

      //update the timeline on the next tick because at this point
      // the graphs are still hidden. Graphs will be visible on the
      // next tick
      // Vue.nextTick(function(){
      timeline.update(twitterTimeline)
      spinStop('updateTimeline')
      scrollToElement('secondary_form')
      timeline.redraw()
      // });

      spinStart('getNetwork')
      spinner_notices.graph = 'Fetching graph...'

      timeline.removeUpdateDateRangeCallback()
      failed_to_get_network = false

      spinStop('getNetwork')
      spinner_notices.graph = 'Drawing Graph...'
      spinStart('generateNetwork')

      show_graphs = true

      // Vue.nextTick(function(){
      // USED FOR DEBUGGING
      // console.log("POST EDGES:");
      // console.log(v.twitterEdges);
      // console.log(typeof(v.twitterEdges));
      graph.updateEdges(twitterEdges)
      updateGraph()
      graph.score_stats.reset()

      if (!dont_reset) {
        graph.resetBotscores()
        graph.setLang(lang)
        graph.getBotCacheScores()
      }
      spinStop('generateNetwork')
      scrollToElement('secondary_form')
      // });

      spinStop('buildGraph')
    }
  }

  function updateGraph(starting_time, ending_time) {
    graph_column_size = 3
    if (failed_to_get_network) {
      return false
    }
    graph.updateGraph(starting_time, ending_time)

    show_zoom_buttons = true
    scrollToElement('secondary_form')
  }

  function scrollToElement(id) {
    // var adjustment = 0;
    // {
    //     if(document.getElementById(id))
    //     {
    //         var o = this.getOffset(id).top - adjustment;
    //         window.scroll(0,o);
    //     }
    // }
    // this.loadShareButtons();
  }

  function checkIfShouldDisableAnimation(edges) {
    if (edges.length > 0) {
      var localAnimationAvailable = false
      var pubDate = edges[0]['tweet_created_at']
      for (var edgeIx = 0; edgeIx < edges.length; edgeIx++) {
        var newPubDate = edges[edgeIx]['tweet_created_at']
        // There are at least two different dates so we can animate this edge list
        if (newPubDate !== pubDate) {
          localAnimationAvailable = true
          break
        }
      }
      animationAvailable = localAnimationAvailable
    }
  }

  function spinStart(key) {
    console.log(key)
  }

  function spinStop(key, reset) {
    console.log(key)
  }

  function toggleEdgeModal(force) {
    toggleModal('edge', force)
  }

  function toggleNodeModal(force) {
    toggleModal('node', force)
    feedback_form.display = false
  }

  function toggleModal(modal, force) {
    graph.redraw()
    //the timeouts here help with the animation and will need to be adjusted as required
    var prop = 'show_' + modal + '_modal'
    // if (!this[prop] || force === true) //show
    if (force === true || !show_node_modal) {
      // this[prop] = true;
      show_node_modal = true
      document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
      setTimeout(function() {
        modal_opacity = true
        modal$.next(node_modal_content)
      }, 1)
    } //hide
    else {
      modal_opacity = false
      document.getElementsByTagName('body')[0].style.overflowY = ''
      setTimeout(function() {
        show_node_modal = false
      }, 100)
    }
  }

  function pauseGraphAnimation() {
    graph.pauseAnimation()
  }

  function unpauseGraphAnimation() {
    graph.unpauseAnimation()
  }

  function createTwitterDateBins(dates) {
    // USED FOR DEBUGGING THE DATES
    // console.log('NUMBER OF DATES');
    // console.log(dates.length);
    //
    // console.log('DATES');
    // for (var date in dates) {
    //   console.log(dates[date]);
    // }
    // console.debug(dates);
    var v = this
    var numBins = 0
    var offsetBin = 0
    var dateBins = []
    // Finding least date
    var leastDate = dates[0].getTime()
    // Finding latest date
    var latestDate = dates[dates.length - 1].getTime()
    // Finding the offset between the latest date and least date in seconds
    var offsetSec = Math.ceil(Math.abs(latestDate - leastDate) / 1000)

    // Dynamically creating the number of bins based on the difference between the least and latest date
    if (offsetSec < 600) {
      // Bins should be divided in seconds because the difference is between 0 and 10 minutes
      numBins = offsetSec + 1
      // Seconds offset
      offsetBin = 1000
    } else if (offsetSec < 36000) {
      // Bins should be divided in minutes because the difference is between 10 minutes and 10 hours
      numBins = Math.ceil(offsetSec / 60) + 1
      // Minutes offset
      offsetBin = 60 * 1000
    } else if (offsetSec < 864000) {
      // Bins should be divided in hours because the difference is between 10 hours and 10 days
      numBins = Math.ceil(offsetSec / (60 * 60)) + 1
      // Hours offset
      offsetBin = 60 * 60 * 1000
    } else {
      // Bins should be divided in days because the difference is more than 10 days
      numBins = Math.ceil(offsetSec / (24 * 60 * 60)) + 1
      // Days offset
      offsetBin = 24 * 60 * 60 * 1000
    }

    // Creating bins
    for (var bin = 0; bin <= numBins; bin++) {
      dateBins.push(leastDate + bin * offsetBin)
    }

    // Populating the date bins with number of tweets in each bin
    var bin = 0
    var numTweets = 0
    for (var theDate = 0; theDate < dates.length; theDate++) {
      if (dates[theDate].getTime() <= dateBins[bin]) {
        numTweets += 1
      } else {
        // next date exceeded current bin, so must move on to next bin(s)
        while (dates[theDate].getTime() > dateBins[bin]) {
          var offsetDate = new Date(dateBins[bin])
          twitterTimeline.claim.timestamp.push(offsetDate)
          twitterTimeline.claim.volume.push(numTweets)
          twitterTimeline.fact_checking.timestamp.push(offsetDate)
          twitterTimeline.fact_checking.volume.push(0)
          bin += 1
        }
        numTweets += 1
      }
      // adding the last date
      if (theDate === dates.length - 1) {
        var offsetDate = new Date(dateBins[bin])
        twitterTimeline.claim.timestamp.push(offsetDate)
        twitterTimeline.claim.volume.push(numTweets)

        twitterTimeline.fact_checking.timestamp.push(offsetDate)
        twitterTimeline.fact_checking.volume.push(0)
      }
    }

    // If there is only one timestamp then we create another helpful time tick to visualize a full bin
    // if (numBins == 1) {
    //   var offsetDate = new Date(dateBins[bin+1]);
    //   v.twitterTimeline.claim.timestamp.push(offsetDate);
    //   v.twitterTimeline.claim.volume.push(numTweets);
    //   v.twitterTimeline.fact_checking.timestamp.push(offsetDate);
    //   v.twitterTimeline.fact_checking.volume.push(0);
    // }

    // console.debug(v.twitterTimeline.claim);
  }

  function sortDates(dateOne, dateTwo) {
    if (dateOne > dateTwo) {
      return 1
    }
    if (dateOne < dateTwo) {
      return -1
    }
    // Dates Equal
    return 0
  }

  return {
    getModalObservable: getModalObservable,
    toggleNodeModal: toggleNodeModal
  }
}

export default Main
