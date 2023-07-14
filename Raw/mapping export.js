javascript:(function(){
	
	let lines = $("#rb-styleable-content-box > form > div > table:nth-child(9) > tbody > tr:not(:nth-child(1))");
	
	let items = Array.from(lines).map((e)=>{
		let mappedTo = $(e).find(".rbs_leftDataColWide > select:nth-child(1) > option:selected").text();
		mappedTo=mappedTo=="Not mapped"?"":mappedTo;
		
		let uniqueField = $(e).find(".rbs_leftDataColWide > select:not(:nth-child(1)) > option:selected").text();
		uniqueField = uniqueField? (uniqueField=="Unique Field"?"":uniqueField) :"N/A";
		
		return {
			"Field Label" : $(e).find(".rbs_rightLabelRequired.rbs-aux-simple-label,.rbs_rightLabelWide.rbs-aux-simple-label").text(),
			"Integration Name" : $(e).find(".rbs_leftDataColWide select").attr("name"),
			"Mapped To Column" : mappedTo,
			"Unique Field" : uniqueField,
		}
	
	});

	let replacer = (key, value) => value === null ? '' : value;
	let header = Object.keys(items[0]);
	let csv = [
		header.join(','), 
		...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
	].join('\r\n');

	download("mappings.csv", csv);
  
  
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