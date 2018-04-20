module.getUsersInfo = function (){
  bot.api.teams.info({team:"T20M1CVD3"},function(err, data){
    console.log(data)
  })
}
