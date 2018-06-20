# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
	<head><%include file="/prmaxtouch/templates/prmaxtouch_header.mak"/></head>
	<body oncontextmenu="" id="main" class="claro modern">
		<table id="wait"><tr><td><i class="fa fa-spinner fa-4x fa-pulse"></i></td></tr></table>
		<div class="main-div" data-dojo-type="prmaxtouch/home" data-dojo-props='logout:"logout"'></div>
		<script type="text/javascript" >
			require(["dojo/ready"], function(ready) {
				ready(function() {
					require([
						"dojo/parser",
						"dojo/dom",
						"dojo/dom-style",
						"prmaxtouch/home"
					], function(parse, dom, domstyle) {
						parse.parse(dom.byId("main"));
						domstyle.set(dom.byId("wait"), "display", "none");
					});
				});
			});
		</script>
	% if prmax["release"] == True:
		<script type="text/javascript" src="/dojo/dojo/prmaxhome.js?version=${prmax['dojoversion']}"></script>
	% endif
	</body>
</html>

