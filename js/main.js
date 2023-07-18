$(document).ready(()=>{
	let out = "";
	
	let templateConfig = {
		[BOOKMARK]: bookmarkTemplate,
		[TOOL] : toolTemplate
	}
	
	for(let i in bookmarks){
		bookmarks[i].index = i;
		out+=TemplateEngine(templateConfig[bookmarks[i].type], bookmarks[i]);
		
	}
	$("#bookmarks").html(out)
	
})