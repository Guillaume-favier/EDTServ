let url = new URL(window.location.href)
let params = new URLSearchParams(url.search);
let passwd = params.get('passwd')

const table = document.getElementById('logsTable')

const max20 = (s) => {
	if (s.length > 20) return s.slice(0, 17) + "..."
	return s
}


const simpleJsonToText = j => {
	let res = ""
	const args = Object.keys(j)

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		res += arg + " : " + max20(j[arg]) + "\t ; \t"
	}

	return res.slice(0, -5)
}


let evenOrOdd = true;
const dispOne = log => {

	const tr = document.createElement('tr')

	tr.className += evenOrOdd ? "even" : "odd"
	evenOrOdd = !evenOrOdd

	const id = document.createElement('td')
	const url = document.createElement('td')
	const respCode = document.createElement('td')
	const reqParam = document.createElement('td')
	const ip = document.createElement('td')
	const date = document.createElement('td')

	id.innerText = log[6] ? log[6] : ""
	url.innerText = log[1].startsWith("/api/v2/") ? log[1].replace("/api/v2/","") : log[1]
	respCode.innerText = log[2]
	// adapt color to response code
	if (log[2].toString().startsWith("2")) respCode.className += "green"
	else if (log[2].toString().startsWith("3")) respCode.className += "orange"
	else respCode.className += "red"

	reqParam.innerText = simpleJsonToText(log[5])
	ip.innerText = log[3]

	const tmpDate = (new Date(log[0])).toString().split(" ")
	date.innerText = tmpDate.splice(1, 5).join(" ")


	tr.appendChild(id)
	tr.appendChild(url)
	tr.appendChild(respCode)
	tr.appendChild(reqParam)
	tr.appendChild(ip)
	tr.appendChild(date)
	table.appendChild(tr)
}


const dispAll = logs => { for (let i = 0; i < logs.length; i++) dispOne(logs[i]) }


if (passwd == null) {
	window.location.href = "/infos"
}else {
	fetch("/api/v2/viewLogs?passwd=" + passwd)
	.then(response => response.json())
	.then(data => {
		dispAll(data)
	})
}