function TemplateEngine(template, options) {
	
	let re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
	let add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(template)) {
		add(template.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(template.substr(cursor, template.length - cursor));
	code += 'return r.join("");';
	return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

function copyBookmarklet(index){
	let bookmark = bookmarks[index]
	copyTextToClipboard(bookmark.code)
	showAlert(bookmark.name+" Bookmarklet Copied to Clipboard");
}

function copyTextToClipboard(copyText) {
   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);
  // Alert the copied text
  //alert("Copied bookmark to clipboard");
}

function showAlert(message,type="success"){
	$("#alertOutput").html(`
		<div class="alert alert-${type} alert-dismissible" role="alert">
			<div>${message}</div>
		</div>
	`);
}

function readExcelFileToJSON(cb,p){
	selectFile(function(evt){
		let files = evt.target.files; // FileList object
		let xl2json = new ExcelToJSON();
		xl2json.parseExcel(files[0],function(workbook){
			let sheets = workbook.Sheets;
			let firstSheet = Object.keys(workbook.Sheets)[0];
			let lines =  XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet],p);
			cb(lines);
		});
	});
}

function selectFile(cb){
	$("#fileSelect").off("change").change(cb);
	$("#fileSelect").click();
	
}

function buildTeamworksSheet(lines){
	let headerLine = lines[1].map((e)=>{return e.toUpperCase();});

	let currentHeader = undefined;
	
	lines = lines.map((line,i)=>{
		
		if(line.length == 1){
			currentHeader = line[0];
			//header line - ignore this
			return false;
		}
		
		if(JSON.stringify(line.map((e)=>{return e.toUpperCase();}))==JSON.stringify(headerLine)){
			return false;
		}
		
		let newLine = Object.fromEntries(headerLine.map(function(e,i,a){
			return [headerLine[i],line[i]];
		}));
		
		newLine.HEADING = currentHeader;
		
		return newLine;
	}).filter((e)=>{
		return !!e;
	}).map((line,i,a)=>{
		if(i%2==0){
			line.COMMENT = a[i+1].DESCRIPTION;
			return line;
		}else{
			return false;
		}
	}).filter((e)=>{
		return !!e && e.WHO;
	}).map((line)=>{
		
		//DATE	WHO	DESCRIPTION	START	END	TIME	HOURS	HEADING	COMMENT
		let order = ["HEADING","DATE", "WHO", "DESCRIPTION","COMMENT", "START","END","TIME","HOURS"];
		let newLine = {};
		for(let i of order){
			newLine[i] = line[i];
		}
				
		return newLine;
	})
	
	console.log(lines);
	
	let outputWorksheet = XLSX.utils.json_to_sheet(lines);
	let outputWorkbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, "Sheet1");
	
	XLSX.writeFile(outputWorkbook, "Output.xlsx", { compression: true });
}

function buildVariantSheet(lines){
	let outputLines = [];

	for(let line of lines){
		//first 3 columns copy to the output line
		let columns = Object.keys(line);
		for(let column in line){
			let value = line[column];
			if(value && value!="NULL" && columns.indexOf(column) > 2){
				outputLines.push({
					
					
					//"Variant SKU" : line[columns[0]],
					//"Rowid" : line[columns[1]],
					"Product" : line[columns[1]],
					"Product Name" : line[columns[2]],
					
					"Option Type" : "rectangle",
					"Option Name" : column,
					"Option Value" : value,
					"Option Code" : value,
					"Order" : 1,
					"Parent Order" : 1,
				})
			}
		}
	}
	
	//sort outputLines by product then optionName.
	outputLines.sort(function(a,b){
		return (a.Product.localeCompare(b.Product)) || (a["Option Name"].localeCompare(b["Option Name"]));
	});
	
	//remove duplicate product option name option value triplets
	outputLines = outputLines.filter(function(e,i,a){
		return a.findIndex(function(elem){
			return elem.Product==e.Product && elem["Option Name"]==e["Option Name"] && elem["Option Value"]==e["Option Value"]
		})==i;
	});
	//build our 2 sheets.
	let variantOptionLines = outputLines.map(function(e,i,a){
		
		if(i==0||a[i-1].Product != e.Product){
			e["Is Default"] = true;
			return e;
		}
		if(a[i-1]["Option Name"] == e["Option Name"]){
			e["Parent Order"] = a[i-1]["Parent Order"];
			e["Order"] = a[i-1]["Order"] + 1;
			e["Is Default"] = false;
		}else{
			e["Parent Order"] = a[i-1]["Parent Order"] + 1;
			//e["Order"] = 1;
			e["Is Default"] = true;
		}
		
		//e["Default"] = e["Order"] == 1;
		
		return e;
	});
	
	//add blank "header" lines.
	let variantOptionLinesWithHeaders =[];
	for(let lineIndex in variantOptionLines){
		let prevLine = variantOptionLines[lineIndex-1];
		prevLine = prevLine?prevLine:{};
		let line = variantOptionLines[lineIndex];
		let columns = Object.keys(line);
		if(prevLine.Product!=line.Product || prevLine["Option Name"]!=line["Option Name"]){
			variantOptionLinesWithHeaders.push({
				//"Product" : line.Product,
				
			//	"SKU" : line["SKU"],
			//	"Rowid" : line["Rowid"],
				"Product" : line["Product" ],
				"Product Name" : line["Product Name"],
				
				"Option Type" : "rectangle",
				"Option Name" : line["Option Name"],
				"Option Value" : "",
				"Option Code" : "",
				"Order" : "",
				"Parent Order" : line["Parent Order"],
				"Is Default" : false,
			});
		}
		variantOptionLinesWithHeaders.push(line);
	}
	
	
	//build option names
	let variantOptionNameLines = variantOptionLines.filter(function(e,i,a){
		return a.findIndex(function(elem){
			return elem.Product == e.Product && elem["Option Name"] == e["Option Name"];
		})==i;
	}).map(function(e){
		return {
		//	"Product" : e.Product,
		//	"SKU" : e["SKU"],
		//	"Rowid" : e["Rowid"],
			"Product" : e["Product" ],
			"Product Name" : e["Product Name"],
				
			"Option Name" : e["Option Name"],
			"Position" : e["Parent Order"],//maybe not needed?
		}
	});
	
	let optionNamesWorksheet = XLSX.utils.json_to_sheet(variantOptionNameLines);
	let optionNamesWorkbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(optionNamesWorkbook, optionNamesWorksheet, "Sheet1");
	
	let optionValuesWorksheet = XLSX.utils.json_to_sheet(variantOptionLinesWithHeaders);
	let optionValuesWorkbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(optionValuesWorkbook, optionValuesWorksheet, "Sheet1");
	
	XLSX.writeFile(optionValuesWorkbook, "Variant Option Values.xlsx", { compression: true });
	XLSX.writeFile(optionNamesWorkbook, "Variant Option Names.xlsx", { compression: true });

}

function buildCategorySheet(lines){
	let outputLines = [];
	let levelSeparator = " ▸ ";
	
	for(let line of lines){
		let cols = Object.values(line);
	
		for(let index = 0;index<cols.length;index++){
			if(!cols[index]){
				//ignore everything in the line after the first blank cell.
				break;
			}
			let fullCategoryName = cols.slice(0,index+1).join(levelSeparator);
			let parentCategoryName = cols.slice(0,index).join(levelSeparator);
	
			outputLines.push({
				"Product Category" : fullCategoryName,
				"Product Category Name" : cols[index],
				"Parent Product Category" : parentCategoryName,
				"External Reference 1" : fullCategoryName,
				"Depth" : index,
			});
		}
		
	}
	
	outputLines = outputLines.filter(function(e,i,a){
		return a.findIndex(function(elem){return elem["External Reference 1"]==e["External Reference 1"];}) == i;
	}).sort(function(a,b){
		return a.Depth-b.Depth;
	}).map(function(e){
		delete e.Depth;
		return e;
	})
	
	let newWorksheet = XLSX.utils.json_to_sheet(outputLines);
	let newWorkbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");
	XLSX.writeFile(newWorkbook, "Categories.xlsx", { compression: true });
}