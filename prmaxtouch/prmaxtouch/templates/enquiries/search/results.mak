# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
	<head><%include file="/prmaxtouch/templates/prmaxtouch_header.mak"/></head>
	<body oncontextmenu="return false;" id="main" class="claro ${fashion}">
		<table id="wait"><tr><td><i class="fa fa-spinner fa-4x fa-pulse"></i></td></tr></table>
		<div class="main-div" data-dojo-type="prmaxtouch/enquiries/search/results" data-dojo-props='
		contacthistory:${contacthistory},
		familyname:"${familyname}",
		firstname:"${firstname}",
		subject:"${subject}",
		option:"${option}",
		from_date:"${from_date}",
		to_date:"${to_date}",
		listpage:${listpage},
		total:${total}
		'/>
		</div>
		<script type="text/javascript" >
			require(["dojo/ready"], function(ready) {
				ready(function() {
					require([
						"dojo/parser",
						"dojo/dom",
						"dojo/dom-style",
						"prmaxtouch/enquiries/search/results"
					], function(parse, dom, domstyle) {
						parse.parse(dom.byId("main"));
						domstyle.set(dom.byId("wait"), "display", "none");
					});
				});
			});
		</script>
	% if prmax["release"] == True:
		<script type="text/javascript" src="/dojo/dojo/ppremcusresults.js?version=${prmax['dojoversion']}"></script>
	% endif
	</body>
</html>

