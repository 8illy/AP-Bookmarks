let ExcelToJSON = function() {

	this.parseExcel = function(file,cb) {
		let reader = new FileReader();
		
		reader.onload = function(e) {
			let data = e.target.result;
			let workbook = XLSX.read(data, {
				type: 'binary'
			});
			cb(workbook);
		};

		reader.onerror = function(ex) {
			console.log(ex);
		};
		
		reader.readAsBinaryString(file);
	};
};