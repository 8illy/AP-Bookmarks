$(document).ready(()=>{
	let out = "";
	for(let i in bookmarks){
		bookmarks[i].index = i;
		out+=TemplateEngine(bookmarkTemplate, bookmarks[i]);
	}
	$("#bookmarks").html(out)
	
})