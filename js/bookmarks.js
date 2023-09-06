let bookmarks = [

	{
		name : "AP Object Field Export",
		type : BOOKMARK,
		desc : "Exports a list of all fields on all objects.",
		usage : "Go to the objects list then run the bookmark.",
		code : 'javascript:!function(){let e=Array.from($(".listItemValue:nth-child(2)>a")).map(function(e){return{name:e.text,integrationName:$(e).parent().next().next().next().next().text(),id:e.href.split("=")[1]}}),t=[],n=[];for(let a in e){let i=$.Deferred();t.push(i),l(e[a].integrationName,function(t){let l=$(t);n[e[a].integrationName]=[],l.find("DataFieldDef").each(function(t){n[e[a].integrationName].push({objectName:e[a].name,integrationName:e[a].integrationName,fieldName:$(this).attr("fieldName"),displayName:$(this).find("DisplayLabel").text(),fieldType:$(this).attr("uiClass"),returnType:r($(this).find("returnType").text())})}),i.resolve()})}function r(e){let t={1:"Decimal",2:"Currency",3:"Integer",4:"String",5:"Boolean",6:"Date",9:"Date/Time"};return t[e]?t[e]:""}function l(e,t,n){var a=rbf_getXMLHTTPRequest();if(a){a.onreadystatechange=function(){if(a.readyState==READY_STATE_COMPLETE){var e=a.responseText;rbf_checkAjaxError(e,"rbf_getObjectDef",n)||t(e)}};var i=rbf_getAjaxURL()+"&cmd=getObjectDef&objName="+encodeURIComponent(e);a.open("GET",i,!0),a.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),a.send(null)}}$.when.apply(null,t).done(function(){var e,t,a,i,r="Field Map.csv";let l,o;i=[].concat(...Object.values(n)).sort((e,t)=>e.objectName+" "+e.fieldName>t.objectName+" "+t.fieldName?1:-1),l=(e,t)=>null===t?"":t,o=Object.keys(i[0]),e=r,t=[o.join(","),...i.map(e=>o.map(t=>{var n,a;return n=e[t],JSON.stringify(n,a=l)}).join(","))].join("\\r\\n"),a=document.createElement("a"),a.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),a.setAttribute("download",e),a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a)})}();',
		
	},
	
	{
		name : "AP Object Relationships Export",
		type : BOOKMARK,
		desc : "Exports a list of all relationships on all objects.",
		usage : "Go to the objects list then run the bookmark.",
		code : 'javascript:!function(){let e=Array.from($(".listItemValue:nth-child(2)>a")).map(function(e){return{name:e.text,integrationName:$(e).parent().next().next().next().next().text(),id:e.href.split("=")[1]}}),t=[],a=[];for(let n in e){let i=$.Deferred();t.push(i),r(e[n].integrationName,function(t){let r=$(t);a[e[n].integrationName]=[],r.find("RelationshipDef").each(function(t){let i=$(this).attr("objDef1");$(this).attr("objDef2");let l=i==e[n].integrationName?2:1,o=("true"==$(this).attr("isMultiple"+(2==l?1:2))?"Many ":"One ")+e[n].integrationName+" To "+("true"==$(this).attr("isMultiple"+l)?"Many ":"One ")+$(this).attr("objDef"+l),s=$(this).attr("id"),f=$(Array.from(r.find("DataFieldDef > props > relid")).find(e=>$(e).text()==s)).closest("DataFieldDef");a[e[n].integrationName].push({objectName:e[n].name,relatedObjectName:$(this).attr("objDef"+l),relationshipName:$(this).attr("pluralName"+l),cardinality:o,fieldName:f.attr("fieldName"),fieldLabel:f.find("DisplayLabel").text()})}),i.resolve()})}function r(e,t,a){var n=rbf_getXMLHTTPRequest();if(n){n.onreadystatechange=function(){if(n.readyState==READY_STATE_COMPLETE){var e=n.responseText;rbf_checkAjaxError(e,"rbf_getObjectDef",a)||t(e)}};var i=rbf_getAjaxURL()+"&cmd=getObjectDef&objName="+encodeURIComponent(e);n.open("GET",i,!0),n.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),n.send(null)}}$.when.apply(null,t).done(function(){var e,t,n,i,r="Relationship Map.csv";let l,o;i=[].concat(...Object.values(a)).sort((e,t)=>e.objectName+" "+e.fieldName>t.objectName+" "+t.fieldName?1:-1),l=(e,t)=>null===t?"":t,o=Object.keys(i[0]),e=r,t=[o.join(","),...i.map(e=>o.map(t=>{var a,n;return a=e[t],JSON.stringify(a,n=l)}).join(","))].join("\\r\\n"),n=document.createElement("a"),n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)})}();',
		
	},
	
	{
		name : "AP Mapping Export",
		type : BOOKMARK,
		desc : "Exports a list of all fields that are currently mapped.",
		usage : "Open the bookmark while mapping during an import.",
		code : 'javascript:!function(){let e=Array.from($("#rb-styleable-content-box > form > div > table:nth-child(9) > tbody > tr:not(:nth-child(1))")).map(e=>{let t=$(e).find(".rbs_leftDataColWide > select:nth-child(1) > option:selected").text();t="Not mapped"==t?"":t;let l=$(e).find(".rbs_leftDataColWide > select:not(:nth-child(1)) > option:selected").text();return l=l?"Unique Field"==l?"":l:"N/A",{"Field Label":$(e).find(".rbs_rightLabelRequired.rbs-aux-simple-label,.rbs_rightLabelWide.rbs-aux-simple-label").text(),"Integration Name":$(e).find(".rbs_leftDataColWide select").attr("name"),"Mapped To Column":t,"Unique Field":l}}),t=(e,t)=>null===t?"":t,l=Object.keys(e[0]);var i,n,a="mappings.csv";i=[l.join(","),...e.map(e=>l.map(l=>JSON.stringify(e[l],t)).join(","))].join("\\r\\n"),n=document.createElement("a"),n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(i)),n.setAttribute("download",a),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)}();',
		
	},
	
	{
		name : "Remove 'Field Default' from AP Mapping",
		type : BOOKMARK,
		desc : "Replaces 'Field Default' with 'Not Mapped' during an import.",
		usage : "Open the bookmark while mapping during an import.",
		code : 'javascript:$("select").each(function(){-10==$(this).val()&&$(this).val(-12)});',
	},
	
	{
		name : "Remove AP Mapping",
		type : BOOKMARK,
		desc : "Replaces all mapped fields with 'Not Mapped' during an import.",
		usage : "Open the bookmark while mapping during an import.",
		code : 'javascript:$("select").each(function(){$(this).val(-12)});',
		
	},
	
	{
		name : "Category Builder",
		type : TOOL,
		desc : "Tool to build a Category Import Sheet",
		usage : "Upload an excel sheet to build the Import Sheet",
		script : ()=>{readExcelFileToJSON(buildCategorySheet);},
	},
	
	{
		name : "Variant Option Builder",
		type : TOOL,
		desc : "Tool to build a Variant Option Import Sheet",
		usage : "Upload an excel sheet to build the Import Sheet",
		script : ()=>{readExcelFileToJSON(buildVariantSheet);},
		
	},
	
	{
		name : "Teamworks Spreadsheet Converter",
		type : TOOL,
		desc : "Tool to Convert a Teamworks Sheet",
		usage : "Upload an excel sheet to build the Sheet",
		script : ()=>{readExcelFileToJSON(buildTeamworksSheet,{"header":1,"raw": false,});},
		
	},


]