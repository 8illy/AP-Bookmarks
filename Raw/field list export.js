(function(){
	let objects = Array.from($(".listItemValue:nth-child(2)>a")).map(function(e){
		return {
			name : e.text,
			integrationName : $(e).parent().next().next().next().next().text(),
			id : e.href.split("=")[1],
		}
	});
	let promises = [];
	let fields = [];
	
	
	
	for(let i in objects){
		let pr = $.Deferred();
		promises.push(pr);
		
		rbf_getObjectDef(objects[i].integrationName, function(XmlData){
			
				let xmlObj = $(XmlData);
				fields[objects[i].integrationName] = [];
				
				xmlObj.find("DataFieldDef").each(function(index) {
					fields[objects[i].integrationName].push({
						objectName : objects[i].name,
						integrationName : objects[i].integrationName,
						fieldName :$(this).attr('fieldName') ,
						displayName:$(this).find("DisplayLabel").text(),
						fieldType:$(this).attr('uiClass'),
						//dataType:$(this).attr("dataName"),
						returnType:getReturnType($(this).find("returnType").text()),
					});
				});
				
				pr.resolve();
		});
	}
	
	$.when.apply(null, promises).done(function(){
		toCsv("Field Map.csv",[].concat(...Object.values(fields)).sort((a,b)=>{
			return (a.objectName+" "+a.fieldName)>(b.objectName+" "+b.fieldName)?1:-1;
		}));
	});
	
	
	
	function getReturnType(t){
		let returnTypes = {
			"1" : "Decimal",
			"2" : "Currency",
			"3" : "Integer",
			"4" : "String",
			"5" : "Boolean",
			"6" : "Date",
			"9" : "Date/Time",
		}
		return returnTypes[t]?returnTypes[t]:"";
	}
	
	function escapeCsvCell(data,replacer){
		return JSON.stringify(data,replacer);
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
	
	function rbf_getObjectDef(objName, callback, errorCallback) {
		var ajaxRreq = rbf_getXMLHTTPRequest();
		if (!ajaxRreq)
			return;
		ajaxRreq.onreadystatechange = function() {
			if (ajaxRreq.readyState == READY_STATE_COMPLETE) {
				var xmlString = ajaxRreq.responseText;
				if (rbf_checkAjaxError(xmlString, "rbf_getObjectDef", errorCallback))
					return;
				callback(xmlString);
			}
		}
		;
		var url = rbf_getAjaxURL() + "&cmd=getObjectDef&objName=" + encodeURIComponent(objName);
		ajaxRreq.open("GET", url, true);
		ajaxRreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		ajaxRreq.send(null);
	}
	
})()