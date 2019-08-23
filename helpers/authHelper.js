const request = require('request-promise').defaults({ jar: true });

const getHeaders = () => {
	return {
		'Connection': 'keep-alive',
		'Cache-Control': 'max-age=0',
		'Origin': 'https://moodle-academico.uffs.edu.br',
		'Upgrade-Insecure-Requests': '1',
		'Content-Type': 'application/x-www-form-urlencoded',
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
		'Sec-Fetch-Mode': 'navigate',
		'Sec-Fetch-User': '?1',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
		'Sec-Fetch-Site': 'same-origin',
		'Referer': 'https://moodle-academico.uffs.edu.br/login/index.php',
		'Accept-Language': 'en-US,en;q=0.9',
		'Content-Encoding': 'gzip'
	};
}

const doLogin = async (username, password) => {
	const headers = getHeaders();

	const dataString = `username=${username}&password=${password}&anchor=`;

	const options = {
		url: 'https://moodle-academico.uffs.edu.br/login/index.php',
		method: 'POST',
		headers: headers,
		body: dataString,
		gzip: true
	};


	return request(options);
}

const verifyIfIsLoggedIn = async () => {
	const headers = getHeaders();

	options = {
		url: 'https://moodle-academico.uffs.edu.br/my/',
		method: 'GET',
		headers: headers,
		gzip: true
	}

	return request(options);
}

const getSessKey = (response) => {

	const sesskeyName = 'sesskey';

	const sesskeyIndex = response.indexOf(sesskeyName);

    // TODO: Rename the variables to more meaningful names 
	const aux = response.substring(sesskeyIndex - 1, sesskeyIndex + 200);
	const aux2 = aux.search(',');
	const infoAsString = aux.substring(0, aux2)

	const indexAux = infoAsString.indexOf(':"') + 1;

	const dataToLogout = infoAsString.substring(indexAux)

	return dataToLogout.replace(/[\"]/g, '')
}

const logout = async (response) => {
	const headers = getHeaders();

	const sesskey = getSessKey(response);

	options = {
		url: 'https://moodle-academico.uffs.edu.br/login/logout.php?sesskey=' + sesskey,
		method: 'GET',
		headers: headers,
		gzip: true
	};

	return request(options);
};

module.exports = {logout, getSessKey, getHeaders, doLogin, verifyIfIsLoggedIn};