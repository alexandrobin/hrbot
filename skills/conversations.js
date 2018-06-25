module.exports = {
    sendSurvey7 : function(response, convo) {
      convo.say("Hey !")
      convo.say("Déjà 7 jours que tu es parmi nous !")
      convo.say({
            "text": " Peux-tu remplir cette survey pour nous aider à améliorer l’onboarding dans l’équipe ?",
            "attachments":   [
                {
                    "title": "Quels sont tes retours après cette première semaine ?",
                    "title_link": "https://fr.surveymonkey.com/r/JMSBNV2"
                }
            ]
        })
      convo.next()
    },

  sendSurvey3Months : function(response,convo){
    convo.say("hey ")
      convo.say({
        "text": "Hey ! Déjà trois mois !",
        "attachments": [
          {
              "title": "Quels sont tes retours après ces trois premiers mois ?",
              "title_link": "https://fr.surveymonkey.com/r/JMSBNV2"
          }
      ]
    })
    convo.next()
  },

  getInTouch : function(response,convo){
    convo.say({
      "text": "Vous vous connaissez ?"
    })
    convo.next()
  },


  mondayReminder : function(bot){
    bot.say({
    "text": "N'oubliez pas de remplir vos timesheets et Staffit !",
    "attachments": [
      {
      "title":"Staffit",
      "title_link":"https://rmsscs.deloitteresources.com/staffit/"
      },
      {
      "title":"Sigma",
      "title_link":"http://portailsigma.fr.deloitte.com/sites/DynamicsAx"
      }
    ],
    "channel":'C9VR434H4'
  })
},

  birthday : function(bot, attachments){
    bot.say({
    "text": "Anniversaire(s) à fêter aujourd'hui!",
    "attachments": attachments,
    "channel":'CAYKHP89K'
  })
},


  day2 : function(controller, bot, d){
    let day2 = new Date()
    day2.setUTCDate(d.getUTCDate() - 1)
    day2.setUTCHours(0, 0, 0, 0)

    controller.storage.users.find({
      "joinedDate":{"$eq":+day2}
    }, function(err,user){
      let attachments = []
      if (user.length >= 1){
      user.forEach(function(member){
        bot.startPrivateConversation(
          {
            user:member.id
          },function(response, convo){
            convo.say("Hello !")
            convo.say("Sais-tu que HRT fait partie de l’entité Capital Humain ?")
            convo.say({
                  "text": "Si tu veux en savoir plus, clique ici :",
                  "attachments":   [
                      {
                          "title": "Présentation de l'équipe",
                          "title_link": "https://hrtbot-dev.slack.com/files/U9U8UH5AL/FB2MZ892S/hc_commercial_pour_les_nuls.pptx"
                      }
                  ]
              })
            convo.next()
          })
      })

    }
  } )
},

day3 : function(controller, bot, d){
  let day3 = new Date()
  day3.setUTCDate(d.getUTCDate() - 2)
  day3.setUTCHours(0, 0, 0, 0)

  controller.storage.users.find({
    "joinedDate":{"$eq":+day3}
  }, function(err,user){
    let attachments = []
    if (user.length >= 1){
    user.forEach(function(member){
      bot.startPrivateConversation(
        {
          user:member.id
        },function(response, convo){
          convo.say("Hello !")
          convo.say("Il est temps de te familiariser avec l'équipe ! :chucknorris:")
          convo.say({
                "text": "Voici l'organigramme Human Capital",
                "attachments":   [
                    {
                        "title": "Organigramme HC",
                        "title_link": "https://hrtbot-dev.slack.com/files/U9U8UH5AL/FB2SPFR9D/trombi-ch.lnk"
                    }
                ]
            })
          convo.next()
        })
    })

  }
} )
},
}
