module.exports = function(controller) {

    // listen for someone saying 'tasks' to the bot
    // reply with a list of current tasks loaded from the storage system
    // based on this user's id
    controller.hears(['tasks','todo'], 'direct_message', function(bot, message) {

        // load user from storage...
        controller.storage.users.get(message.user, function(err, user) {

            // user object can contain arbitary keys. we will store tasks in .tasks
            if (!user || !user.tasks || user.tasks.length == 0) {
                bot.reply(message, "Il n'y a plus aucune tâche dans ta liste. Ecris `add _task_` pour en ajouter une.");
            } else {

                var text = 'Voici toutes tes tâches en cours : \n' +
                    generateTaskList(user) +
                    'Répond avec `done _number_` pour compléter une tâche.';

                bot.reply(message, text);

            }

        });

    });

    // listen for a user saying "add <something>", and then add it to the user's list
    // store the new list in the storage system
    controller.hears(['add (.*)'],'direct_message,direct_mention,mention', function(bot, message) {

        var newtask = message.match[1];
        controller.storage.users.get(message.user, function(err, user) {

            if (!user) {
                user = {};
                user.id = message.user;
                user.tasks = [];
            }
            if (!user.tasks){
              user.tasks=[]
            }

            user.tasks.push(newtask);

            controller.storage.users.save(user, function(err,saved) {

                if (err) {
                    bot.reply(message, "Quelque chose a bugué, merci de communiquer ce message d'erreur : "  + err);
                } else {
                    bot.api.reactions.add({
                        name: 'thumbsup',
                        channel: message.channel,
                        timestamp: message.ts
                    });
                }

            });
        });

    });

    // listen for a user saying "done <number>" and mark that item as done.
    controller.hears(['done (.*)'],'direct_message', function(bot, message) {
        console.log(message.user)

        var number = message.match[1];

        if (isNaN(number)) {
            bot.reply(message, 'Merci de préciser le numéro.');
        } else {

            // adjust for 0-based array index
            number = parseInt(number) - 1;

            controller.storage.users.get(message.user, function(err, user) {

                if (!user) {
                    user = {};
                    user.id = message.user;
                    user.tasks = [];
                }
                if (!user.tasks) {
                  user.tasks = []
                }

                if (number < 0 || number >= user.tasks.length) {
                    bot.reply(message, "Désolé, mais le chiffre ne correspond pas à ce que j'ai en tête. En ce moment, il y a " + user.tasks.length + ' tâches en cours');
                } else {

                    var item = user.tasks.splice(number,1);
                    console.log(user.tasks)


                    // reply with a strikethrough message...
                    bot.reply(message, '~' + item + '~');

                    if (user.tasks.length > 0) {
                        bot.reply(message, 'Voici les tâches restantes\n' + generateTaskList(user));
                    } else {
                        bot.reply(message, 'La liste est maintenant vide !');
                    }
                }

                controller.storage.users.save(user, function(err,saved) {

                    if (err) {
                        bot.reply(message, "Je n'ai pas pu supprimer cette tâche, voic le message d'erreur : " + err);
                    } else {
                        bot.api.reactions.add({
                            name: 'white_check_mark',
                            channel: message.channel,
                            timestamp: message.ts
                        });
                    }

                });
            });

        }

    });

    // simple function to generate the text of the task list so that
    // it can be used in various places
    function generateTaskList(user) {

        var text = '';

        for (var t = 0; t < user.tasks.length; t++) {
            text = text + '> `' +  (t + 1) + '`) ' +  user.tasks[t] + '\n';
        }

        return text;

    }
}
