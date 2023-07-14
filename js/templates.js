const bookmarkTemplate = `
	<div class="panel panel-default">
		<div class="panel-heading bookmarkTitle"><%this.name%></div>
		<div class="panel-body">
			<div class="bookmarkDesc">
				<%this.desc%>
			</div>
			<div class="bookmarkUsage">
				<b>Usage: </b><%this.usage%>
			</div>
			<button class="btn btn-primary bookmarkButton" onclick="copyBookmarklet(<%this.index%>);" >Copy</button>
		</div>
	</div>
`
//copyTextToClipboard($(this).attr('data'))
//data="<%this.code.replace(/"/g,'&quot;')%>"