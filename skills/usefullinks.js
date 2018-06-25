module.exports = function(controller) {
    controller.hears('Contacts','direct_message, mention,direct_mention', function(bot,message){
      bot.reply(message,	{
			"text":"Voici tous les liens & contacts utiles",
			"attachments":[
			  {
				"author_name":"Contact RH",
				"title":"Yasmina MEGHOUCHE",
				"title_link":"mailto:ymeghouche@deloitte.fr",
				"text":"Tel:+33 1 40 88 15 06",
				"color":"#66B266"

			  },
			  {
				"author_name":"Support informatique",
				"title":"Helpdesk en ligne",
				"title_link":"https://helpdesk.deloitte.fr/saw/ess?TENANTID=599195092",
				"text":"Tel: 11 22 22 (01 40 88 22 22 de l’extérieur)",
				"color":"#7F7FFF"
			  },

			  {
				"author_name":"Services collaborateurs",
				"title":"Conciergerie",
				"text":"Soon"

			  }
			]
		  })
    })

    controller.hears('Liens', 'direct_message, mention,direct_mention', function(bot, message){
      bot.reply(message, 	{
			"text":"Voici quelques liens utiles à Deloitte",
			"attachments":[
			  {
				"title":"E-Chargement badge",
				"title_link":"https://cashsystemes.net/CollWebConvive/login.xhtml?m=DELOITTE"

			  },
			  {
				"title":"Staffit",
				"title_link":"https://rmsscs.deloitteresources.com/staffit/"
			  },
			  {
				"title":"Sigma",
				"title_link":"http://portailsigma.fr.deloitte.com/sites/DynamicsAx"
			  },
			  {
				"title":"KX",
				"title_link":"https://global.deloitteresources.com/Pages/Home.aspx"
			  },
				{
				"title":"Brandspace",
				"title_link":"https://brandspace.deloitte.com/site/login"
			  }
			]
		  })
    })
}
