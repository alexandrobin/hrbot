module.exports = function(controller) {

  // introduction
  // --> Ask Name
  //     acknowledge name
  //     --> Ask birthday
  //         acknowledge birthday and Save Birth date
  //         --> Ask Staffing
  //             Present functions

  beginOnboarding = function(response, convo) {
    convo.say("Hello !")
    convo.say("Bienvenue sur le channel Slack HRT !")
    convo.say("Je suis HR2T2, le bot de l'équipe et je t'accompagnerai tout au long de ton intégration :grinning:")
    convo.ask("Avant toute chose : comment t'appelles-tu ?", function(response, convo) {
      convo.say(response.text + " ? C'est noté !");

      controller.storage.users.get(response.user, function(err, _user){
        if (!_user.joinedDate){
          askFirstDayAtDeloitte(response,convo)
          convo.next()
        } else {
          askBirthday(response,convo)
          convo.next()
        }
      })
    });
  }

  askBirthday = function(response,convo) {
    convo.say("J'aimerais apprendre à te connaitre un peu mieux.")
    convo.say("Quelle est ta date de naissance ?")
    convo.ask("Comme je suis un petit robot, j'ai besoin de la forme JJ/MM/AAAA pour pouvoir la comprendre", function(response, convo){
      console.log(response.text)
      let temp = response.text.split("/")
      let date = new Date (Date.UTC(temp[2], temp[1]-1, temp[0]))
      howOld = new function(){
         let temp = Date.now() - date.getTime()
         console.log(temp)
         let ageDate = new Date(temp)
         return age = Math.abs(ageDate.getUTCFullYear() - 1970)
      }
      controller.storage.users.get(response.user, function(err, _user){
        if (!_user.age){
          _user.age=age
        }
        if (!_user.birthday){
          _user.birthdayTS=date.setYear(1970)
          _user.birthday=date
        }
        controller.storage.users.save(_user, function(err, saved){
          console.log(_user.id + " age was saved")
        })
      })

      console.log(age)
      convo.say(age + " ans ! Je tâcherai de m'en rappeler ;-)")
      convo.say({
            "text": " Au fait, si tu n'as pas encore reçu le livret d'accueil, le voici : ",
            "attachments":   [
                {
                    "title": "Livret d'accueil HRT",
                    "title_link": "https://hrtbot-dev.slack.com/files/U9U8UH5AL/FB1KZ3M6F/livret_d_accueil_hrt_-_vf_bhp_v1__002_.pptx",
                }
              ]
            })
    convo.say({
          "text": "De plus pour pouvoir accéder à la cantine :hamburger: ces prochains jours, ton badge doit être activé",
          "attachments":   [
              {
                  "title": "Voici comment faire",
                  "title_link": "https://hrtbot-dev.slack.com/files/U9U8UH5AL/FB2SEP71D/guide_cr__ation_compte_sohappy_work__002_.pdf",
              }
            ]
          })
      convo.say("Sais-tu que je fais également office de todo list ? un simple `'add'` suivi de ta tâche, et je le prends en note pour toi !")
      convo.next()
    })
  }

  askFirstDayAtDeloitte = function (response, convo){
    convo.ask("Quand était ton premier jour à Deloitte ? (DD/MM/YYYY)", function(response, convo){
      console.log(response.text)
      let temp = response.text.split("/")
      let firstDay = new Date (Date.UTC(temp[2], temp[1]-1, temp[0]))
      let firstDayTS = firstDay.valueOf()
      controller.storage.users.get(response.user, function(err, _user){
        if (!_user.joinedDate){
          _user.joinedDate=firstDayTS
          _user._joinedDate=firstDay
        }
        controller.storage.users.save(_user, function(err, saved){
          console.log(_user.id + " joinedDate has been updated")
        })
      })
      convo.say("Bien noté !")
      askBirthday(response,convo)
      convo.next()
    })
  }


  controller.hears(['onboarding'],['direct_message'], function(bot,message){
    bot.startPrivateConversation(message,beginOnboarding)
  })

  controller.on('team_join', function(bot,response){
    let d = new Date()
        d.setUTCHours(0,0,0,0)
    //Create a unique timestamp to know when the user joined the Slack for the first time
    response.user.joinedDate = d.valueOf()//new Date().toLocaleDateString("fr-FR") //to be tested
    response.user._joinedDate = d
    controller.storage.users.save(response.user, function(err, _user){
      if (!err){
        console.log(_user.id + " has been added to the database")
      }
    })
    bot.startPrivateConversation({user:response.user.id}, beginOnboarding)
  })

  controller.on('onboard', function(bot){

        debug('Starting an onboarding experience!');

            bot.startPrivateConversation({user: bot.config.createdBy},function(err,convo) {
              if (err) {
                console.log(err);
              } else {
                convo.say('Welcome');
                convo.say('I am hrtbot, HRT personal assistant');
              }
            });
        }
    )
}
