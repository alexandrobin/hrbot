module.exports = {
    sendSurvey7 : function(response, convo) {
      convo.say({
            "text": "Hey ! Cela fait maintenant 1 semaine que tu es là, le temps passe vite !",
            "attachments": [
                {
                    "title": "Quels sont tes retours après cette première semaine ?",
                    "title_link": "https://fr.surveymonkey.com/r/JMSBNV2"
                }
            ]
        })
      convo.next()
    },

  sendSurvey3Months : function(response,convo){
    convo.say({
      "text": "Déjà trois mois !",
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
          "title": "Sigma",
          "title_link": "https://sigma"
      },
      {
        "title": "Staffit",
              "title_link": "https://staffit"
      }
    ],
    "channel":'C9VR434H4'
  })
}

  



}
