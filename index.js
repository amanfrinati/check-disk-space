'use strict';
const nodemailer = require('nodemailer');
const diskspace = require('diskspace');

const alert_quota = 10; //in GB
const refreshTime = 60; //in minutes
const diskUnit = 'C';
const byte_to_giga = Math.pow(2, 30);
const serverName = 'Help Desk';
const mailSender = 'checkspace@email.com';
const serverAdminMail = 'admin@email.com';

const transporter = nodemailer.createTransport({
    host: 'YOUR-SMTP-HOST',
    port: 25,
    secure: false,
    ignoreTLS: true
});

let message = {
    from: mailSender,
    sender: mailSender,
    to: serverAdminMail,
    subject: `Spazio in esaurimento sul server ${serverName}`
};

setInterval(_ => {
	diskspace.check(diskUnit, (err, result) => {
	    if ((result.free / byte_to_giga) < alert_quota) {
	    	message.html = `<p>
	    						Attenzione! Lo spazio sul server ${serverName} sta terminando!</br>
	    						Lo spazio libero restante è di ${Math.floor(result.free / byte_to_giga)} GB su ${Math.floor(result.total / byte_to_giga)} GB.
	    					</p>
	    					<em>Questa mail è stata inviata dal sistema di controllo di spazio libero sul server ${serverName}</em>`;

	    	transporter.sendMail(message, (err, info) => {
	    		if (err) {
	    			console.log(err);
	    		} else  {
	    			console.log(info);
	    		}
	    	});
    	} else {
    		console.log(`Lo spazio libero è di ${Math.floor(result.free / byte_to_giga)}`);
    	}

	});
}, refreshTime * 60000);

