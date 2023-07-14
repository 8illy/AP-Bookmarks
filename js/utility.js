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