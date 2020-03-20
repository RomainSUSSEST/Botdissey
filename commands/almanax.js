const fetch = require('node-fetch');
const { prefix } = require('../config.json');

module.exports = {
	name: 'almanax',
	description: 'Obtenir les bonus de l\'almanax du jour.',
	execute(message) {
        fetch('http://almanax.kasswat.com', {method: 'get'})
        .then(res => res.json()).then((json) => {
            message.channel.send("Almanax du "+json["day"]+" "+json["month"]+" : **"+json["bonus"][0]+"**");
        });
	},
};