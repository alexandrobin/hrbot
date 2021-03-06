//CONFIG===============================================

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');
var database = require('../config/database')({mongoUri: process.env.MONGO})
var request = require('request')
var Conversations = require('../skills/conversations.js')
if (!process.env.SLACK_ID || !process.env.SLACK_SECRET || !process.env.PORT) {
  console.log('Error: Specify SLACK_ID SLACK_SECRET and PORT in environment');
  process.exit(1);
}

let chuckquote
let getChuck = () => {
  request('https://api.chucknorris.io/jokes/random', function(error, response, body) {
    let data = JSON.parse(response.body)
    chuckquote = data.value
  })
}

var controller = Botkit.slackbot({storage: database, clientVerificationToken: process.env.SLACK_TOKEN})

exports.controller = controller

//CONNECTION FUNCTIONS=====================================================
exports.connect = function(team_config) {
  var bot = controller.spawn(team_config);
  controller.trigger('create_bot', [bot, team_config]);
}

// just a simple way to make sure we don't
// connect to the RTM twice for the same team
var _bots = {};

function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('create_bot', function(bot, team) {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
    console.log("already online! do nothing.")
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);

        console.log("RTM ok")

        controller.saveTeam(team, function(err, id) {
          if (err) {
            console.log("Error saving team")
          } else {
            console.log("Team " + team.name + " saved")
          }
        })
      } else {
        console.log("RTM failed")
      }

      bot.startPrivateConversation({
        user: team.createdBy
      }, function(err, convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      });

    });
  }
});

//REACTIONS TO EVENTS==========================================================

// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function(bot) {
  console.log('** The RTM api just connected!');

  getChuck()

  //CRON JOB To execute some logic every day.
  var CronJob = require('cron').CronJob

  //MondayCheck
  var mondayCheck = new CronJob('00 00 10 * * 1'/*'* * * * *'*/, function(){
  //Create a conversation between two users every monday
    console.log(`MondayCheck triggered ${new Date()}`)
    let d = new Date()
        d.setUTCHours(0, 0, 0, 0)

    let threeMonthsAgo = new Date()
        threeMonthsAgo.setUTCMonth(d.getUTCMonth() - 3)
        threeMonthsAgo.setUTCHours(0, 0, 0, 0)

    Conversations.mondayReminder(bot)

    controller.storage.users.find({"joinedDate":{"$gt":+threeMonthsAgo}
    }, function(err,user){
      user.forEach(function(member){
        console.log(member.id)
        if(!member.hasMet){
          member.hasMet = []
        }

        let randMember = controller.storage.users.aggregate([ { "$sample": { size: 1 } } ])
        randMember.then(function(result){
          console.log(result)
          bot.api.conversations.open(
            {
              users:`${member.id},UAA649D88`
            }, function(err,response){
              console.log(response)
              bot.say({
                text:`Hey, Have you met @${member.id} ?`,
                channel:response.channel.id
              })
            })
        })
      })
    })


  }, function() {
    /* This function is executed when the job stops */
  }, true,
  /* Start the job right now */
  timeZone = 'Europe/Paris'/* Time zone of this job. */)



  //DAILY CHECK
  var dailyCheck = new CronJob('00 00 9 * * 1-5' , function() {
    /*
   * Runs every weekday (Monday through Friday)
   * at 09:00:00 AM. It does not run on Saturday
   * or Sunday.
   */
   console.log(`DailyCheck triggered ${new Date()}`)
    //Gets today's date
    let d = new Date()
        d.setUTCHours(0, 0, 0, 0)
        console.log(d.toUTCString())
        console.log(d)

    let threeMonthsAgo = new Date()
        threeMonthsAgo.setUTCMonth(d.getUTCMonth() - 3)
        threeMonthsAgo.setUTCHours(0, 0, 0, 0)
        console.log(threeMonthsAgo.toUTCString())
        console.log(+ threeMonthsAgo)

    let sevenDaysAgo = new Date()
        sevenDaysAgo.setUTCDate(d.getUTCDate() - 7)
        sevenDaysAgo.setUTCHours(0, 0, 0, 0)
        console.log(sevenDaysAgo.toUTCString())
        console.log(+ sevenDaysAgo)

    controller.storage.users.find({
      "joinedDate":{"$eq":+sevenDaysAgo}
    }, function(err,user){
      user.forEach(function(member){
        console.log(`Message was sent to ${member.name}(${member.id})`)
        bot.startPrivateConversation({
          user:member.id},Conversations.sendSurvey7)
        })
      })

    controller.storage.users.find({
      "joinedDate": {
        "$eq": + threeMonthsAgo
      }
    }, function(err, user) {
      user.forEach(function(member) {
        console.log(`Message was sent to ${member.name}(${member.id})`)
        bot.startPrivateConversation({
          user: member.id
        }, Conversations.sendSurvey3Months)
      })
    })

  }, function() {
    /* This function is executed when the job stops */
  }, true,
  /* Start the job right now */
  timeZone = 'Europe/Paris'/* Time zone of this job. */)

  bot.rtm.close();

});

controller.on('rtm_close', function(bot) {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});

//DIALOG ======================================================================

controller.hears([
  'hello', 'hi'
], 'direct_message,direct_mention,mention', function(bot, message) {


  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face'
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  bot.api.users.info({
    user: message.user
  }, function(error, response) {
    if (error)
      throw error
    console.log(response)
    let {name, real_name} = response.user
    console.log(name, real_name)
    controller.storage.users.get(message.user, function(err, user) {
      if (err)
        throw err
      if (!user.name) {
        user.name = real_name
        controller.storage.users.save(user, function(err, saved) {
          if (err)
            throw err
        });
      }
      if (!user.username) {
        user.username = name
        controller.storage.users.save(user, function(err, saved) {
          if (err)
            throw err
        });
      }
    })
  })

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'Hello ' + user.name + '!!');
    } else {
      bot.reply(message, 'Hello.');
    }
  });
});

controller.hears('^stop', 'direct_message', function(bot, message) {
  bot.reply(message, 'Goodbye');
  bot.rtm.close();
});

controller.on('slash_command', function(bot, message) {
  console.log("command triggered : " + message.command + " by " + message.user)
  /*switch(message.command){
    case "/airtable" :
        bot.replyPrivate("Blablabla test")
        break
    case "/admin":
        if (message.text === "start_onboarding")
          startOnboarding()
        break
    default:
        bot.replyPrivate(message,"Sorry did not get it")
        break
  }*/
  bot.replyPrivate(message, 'Hey, did you try to summon me ?')
})

controller.on('direct_message,mention,direct_mention', function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face'
  }, function(err) {
    if (err) {
      console.log(err)
    }
    bot.reply(message, 'I heard you loud and clear boss.');
  });
});

controller.on('reaction_added', function(bot, event) {
  console.log(event)
  bot.startPrivateConversation(event, function(err, convo) {
    console.log(chuckquote)
    if (err) {
      console.log(err);
    } else {
      convo.say('You just reacted with :chucknorris:... Here is one for you');
      convo.say(chuckquote);
      getChuck()
    }
  });
})

controller.storage.teams.all(function(err, teams) {

  console.log(teams)

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t in teams) {
    if (teams[t].bot) {
      var bot = controller.spawn(teams[t]).startRTM(function(err) {
        if (err) {
          console.log('Error connecting bot to Slack:', err);
        } else {
          trackBot(bot);
        }
      });
    }
  }

});

require('../skills/taskbot.js')(controller)
require('../skills/onboarding.js')(controller)
require('../skills/usefullinks.js')(controller)
require('../config/populateDB.js')(controller)
