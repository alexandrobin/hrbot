module.exports = {

  meetbot: function(controller, threeMonthsAgo, bot){
    controller.storage.users.find({
    "joinedDate": {
      "$gt": + threeMonthsAgo
    }
  }, function(err, user) {
    user.forEach(function(member) {
      console.log(member.id)
      if (!member.hasMet) {
        member.hasMet = [member.id, 'USLACKBOT']
      }

      let randMember = controller.storage.users.aggregate([
        {
          $match: {
              id: { $nin: member.hasMet }
          }
        },
        {
          $sample: {
            size: 1
          }
        }
      ])
      randMember.then(function(result) {
        console.log(result)

        const findID = (id) => {
          if (id === result[0].id)
            return id
        }

        if (member.hasMet.find(findID) == null && result[0].id != member.id && !result[0].is_bot) {
          member.hasMet.push(result[0].id)
          // discuss
          bot.api.mpim.open({
            users: `${member.id},${result[0].id}`
          }, function(err, response) {
            console.log(response)
            bot.say({
              "link_names": 1,
              text: `Hey @${member.name}, as-tu déjà rencontré @${result[0].name}? Prenez le temps d'un :coffee: pour faire connaissance :sunglasses:!`,
              channel: response.group.id
            })
          })

          controller.storage.users.save(member, function(err, saved) {
            console.log(member.id + "hasMet has been updated")
          })
        }

      })
    })
  })
}
}
