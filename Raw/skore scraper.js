var originalSend = WebSocket.prototype.send;
var messages = [];

WebSocket.prototype.send = function(...args) {
	messages.push(args[0]);
	return originalSend.call(this, ...args);
};

var listItems = document.querySelectorAll(".truncate");
clickLinkUrl(0);

var listItemsTitles = Array.from(listItems).map(function(e){return e.innerText});

function clickLinkUrl(i){
	if(listItems[i]){
		console.log(i+"/"+listItems.length);
		listItems[i].click();
		setTimeout(()=>{
			clickLinkUrl(i+1);
		},5000);
	}
}

function parseOutput(){
	messages.map(JSON.parse).filter((e)=>{return e.data!="-" && e.opr!="ack" && e.data && e.navdata}).map((e)=>{
		return e.data.navdata.cpage;
	})
}