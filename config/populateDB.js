
module.exports = function(controller) {
let users = []
controller.hears('getAllUsers', 'direct_message', function(bot, message) {
  bot.api.users.list({}, function(err, list){
    bot.reply(message, "Data was added");
      for (const user of Object.values(list.members)) {

          controller.storage.users.get(user.id, function(err, _user) {
            if (!_user) {
              controller.storage.users.save(user, function(err,saved) {
                console.log(user.id + " " + user.real_name + " was added to the database")
            })
          }
        })

      }
  })
});
}
