(function(){let mapping = Array.from($("body > table.rbs_mainContentTable > tbody > tr:nth-child(2) > td.wide.top > table > tbody > tr > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td > table:nth-child(7) > tbody > tr")).map((e)=>{

let label = $(e).find('[id^=mapConv][id$=_label]');
if(!label.length){return false;}
let code = label.attr("id").substr(7).slice(0,-6);
return {
	label : label.text(),
	code : code,
	mappedCode : $(`[name=mapConv${code}]`).val(), 
	mappedLabel : $(`[name=mapConv${code}] > option:selected`).text(), 
	mappedConst : $(`[name=const${code}]`).val(), 
}

}).filter(function(e){
	return !!e && !!e.mappedCode;
})

toCsv("mapping.csv",mapping)

function escapeCsvCell(data,replacer){
		return '"'+JSON.stringify(data,replacer).replace(/"/g,'""')+'"';
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
	
})();