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
    convo.say("Je suis le bot personnel de l'équipe, je suis là pour t'aider au quotidien :grinning:")
    convo.ask("Avant toute chose : comment t'appelles-tu ?", function(response, convo) {
      convo.say(response.text + " ? C'est noté !");
      askBirthday(response, convo);
      convo.next();
    });
  }

  askBirthday = function(response,convo) {
    convo.ask("Quelle est ta date de naissance (DD/MM/YYYY) ?", function(response, convo){
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
          _user.birthday=response.text
        }
        controller.storage.users.save(_user, function(err, saved){
          console.log(_user.id + " age was saved")
        })
      })

      console.log(age)
      convo.say(age + " ans ! Je tâcherai de m'en rappeler ;-)")
      askStaffing(response,convo)
      convo.next()
    })
  }

  askStaffing = function(response,convo){
    convo.ask("Tu viens d'arriver, mais est-ce que tu sais déjà si tu vas être staffé dans les jours qui viennent ? (Oui / Non)",
    function(response,convo){
      console.log(response.text)
      convo.say("Parfait, je me le note !")
      convo.say("Oh sais-tu que je fais également office de todo list ? un simple 'add' suivi de ta tâche, et je le prends en note pour toi !")
      convo.next()
    })
  }

  controller.hears(['onboarding'],['direct_message'], function(bot,message){
    bot.startPrivateConversation(message,beginOnboarding)
  })

  controller.on('team_join', function(bot,response){
    console.log(response)
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
