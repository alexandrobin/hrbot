module.exports = function(controller) {
    controller.hears('Contacts','direct_message', function(bot,message){
      bot.reply(message,{
        "text":"Voici tous les contacts utiles",
        "attachments":[
          {
            "text":"Contact RH"
          },
          {
            "text":"Conciergerie"
          }
        ]
      })
    })
}
