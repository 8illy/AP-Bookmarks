(function(){
	let fields = ["taogAntennaConnectorType","Antenna_Type","taogAntennaType","taogApplications","taogBandwidth","bulletPoint1","bulletPoint2","bulletPoint3","bulletPoint4","bulletPoint5","taogCableLengthmm","taoCableType","taogCellularAntennas","taogCenterContactMaterial","colour","taogConfiguration","taogConnector1","taogConnector1Gender","taogConnector1Material","taogConnector1Orientation","taogConnector1Polarity","taogConnector2","taogConnector2Gender","taogConnector2Material","taogConnector2Orientation","taogConnector2Polarity","taogConnectorBBodyStyle","taogConnectorBPolarity","taogConnectorStyle","taogConnectorType","taogContactTermination","taogCouplerType","taogCouplingFactor","taogDatasheetURLS","dimUnitOfMeasure","taogFeatures","taogFilterType","taogFrequency","taogFrequencyMax","taogFrequencyRange","taogGain","taogGNSSAntennas","taogGold_PlatingThickness","nonPackagedHeight","taogHousingColor","taogImageURL","taogImpedance","taogInductance","taogIngressProtection","taogInsertionLoss","taogIoTSpecificConnectivityCellular","taogIPRating","Isolation","taogIsolationvoltage","nonPackagedLength","taogMaxoppTemp","taogMinOppTemp","taogMountingAngle","taogMountingFeature","taogMountingStyle","taogMountingType","taogNumofAntennas","taogNumofchannels","taogNumofPorts","taogOtherAntennas","taogPackageCase","packagedHeight","packagedLength","packagedWeight","packagedWidth","taogPoERating","taogPowerMax","taogPowerRated","productSpecification1","productSpecification2","productSpecification3","productSpecification4","productSpecification5","taogReturnLoss","taoRFType","taogRoHS","taogSensitivity","taogSeries","taogShieldTermination","taogShielding","size","taogSort","taogSpeed","taogSupplierDevicePackage","taogTabDirection","tagsToAttach","tagsToDetach","taogTemperaturerange","taogTerminationStyle","taogTurns_RatioPrimarySeconda","taogVSWR","taogWebPage","webUrl","taogWifiAntennas","taogWorkingVoltage","taogWPID"];
	let maxFields = fields.map(function(e){return `MAX(${e})`});
	let fieldsSqlStr = maxFields.join(",");
	let output = [];
	
	let headerFields = 3;
	let baseQuery = "select productMainCategory#id,{0},mainCategoryName,{1} from ap_product where productMainCategory#id > 0 group by productMainCategory order by productMainCategory#id asc"
	let maxQuery = 2000;
	let charsAllowed = maxQuery - baseQuery.length - 100;
	
	let maxFieldsSplit = [[]];
	let c = 0;
	for(let i in maxFields){
		if(maxFieldsSplit[c].join(",").length + maxFields[i].length < charsAllowed){
			maxFieldsSplit[c].push(maxFields[i])
		}else{
			c+=1;
			maxFieldsSplit[c] = [maxFields[i]]
		}
	}
	
	let results = [];
	let promises = [];
	for(let i in maxFieldsSplit){
		let pr = $.Deferred();
		promises.push(pr);
		let query = baseQuery.replace("{1}",maxFieldsSplit[i].join(",")).replace("{0}",i);
		rbf_selectQuery2(query,0,10000,(result)=>{
			results[Number(result[0][1])] = result;
			pr.resolve();
		});
	}
	
	$.when(...promises).then(onQueriesFinished);

	
	
	function onQueriesFinished(){
console.log(results)
		//group together
		let result = results[0].map(function(e,i,a){
			let ret = [];
			for(let j in results){//headerFields
				let arr = results[j][i];
				if(j>0){
					arr = arr.slice(headerFields);
				}
				ret = ret.concat(arr);
			}
			return ret;
		});
		
		buildFile(result);
	}
	
	function buildFile(result){

console.log(result);	
		for(let i in result){
			let configJson = [];
			let fieldList = [];
			for(let j =headerFields;j<result[i].length;j++){
				if(result[i][j]){
					configJson.push({"AddToDoc":false,"Field":fields[j-headerFields],"Title":fields[j-headerFields]});
					fieldList.push(fields[j-headerFields])
				}
			}
			output.push({
				"Product Category" : result[i][0],
				"Product Category Name" : result[i][2],
				"Field List" : fieldList.join(","),
				"Config JSON" : configJson,
				//"Config JSON" : '"'+JSON.stringify(configJson).replace(/"/g,'""')+'"',
			})
		}	
		toCsv("attribute config.csv",output)
	}
	
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
		
})()