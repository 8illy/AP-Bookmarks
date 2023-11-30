(function(){
	let rows = $("#columnselectcollection > table > tbody").children;
let headers = getRowData(rows[0]);
let output = [];
for(let i =1;i<rows.length;i++){
	let row = getRowData(rows[i]);
	output.push(mapRow(row,headers));
}

toCsv("SAP Export.csv",output)

function mapRow(row,headers){
	let output = {};
	for(let i in headers){
		output[headers[i]] = row[i];
	}
	return output;
}

function getRowData(row){
	return Array.from(row.children).map(function(e){return e.innerText});
}


function escapeCsvCell(data,replacer){
		return data;
		//return '"'+JSON.stringify(data,replacer).replace(/"/g,'""')+'"';
	}
	
	function toCsv(filename,lines){
		let replacer = (key, value) => value === null ? '' : value;
		let header = Object.keys(lines[0]);
		let content = [
			header.join(','), 
			...lines.map(row => header.map(fieldName => escapeCsvCell(row[fieldName], replacer)).join(','))
		];
		let csv = content.join('\r\n');
		download(filename, csv);
	}
	
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

})()