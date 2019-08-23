const express = require('express');
// const request = require('request-promise');
const request = require('request-promise').defaults({ jar: true });

const bodyParser = require('body-parser');
const {doLoginPortal, isAuthenticatedPortal, logout, doLogin, verifyIfIsLoggedIn} = require('./helpers/authHelper');

const app = express();

// Parsers to post requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//TODO: This should be in a routes files
app.get('/', (req, res) => {
	res.send({ mensagem: "Hello World" });
});

app.post('/login', async (req, res, next) => { // This should be in a controller file!
	const username = req.body.username;
	const password = req.body.password;


	try {
		response = await doLogin(username, password);
	}
	catch (err) {
		response = err;
	}

	let loggedIn = false;

	try {
		response = await verifyIfIsLoggedIn();

		// Verificar com uma tag - Mais lento
		//loggedIn = response.indexOf('Picture of') > 0 ? true : false;

		//Verificar com o tamanho. Caso de erro o tamanho é 26416, usar 30000 just in case
		loggedIn = response.length > 30000 ? true : false;

	}
	catch (err) {
		response = err;
	}

	logout(response).then().catch();

	status = loggedIn ? 'User is allowed' : 'Password or idUFFS are wrong';

	res.json({ status, username, loggedIn })
});


app.post('/auth/portalAluno', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	const request = doLoginPortal(username, password);

	request.then(response => {
        res.json({
            username: username,
            authenticated: true
        });

    }).catch(err => {
        res.json({
            username: username,
            authenticated: false
        });
	});	
});


app.listen(3001, () => {
	console.log("Servidor is running");
});