# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
	<head><%include file="/prmaxtouch/templates/prmaxtouch_header.mak"/></head>
	<body oncontextmenu="return false;" id="main" class="claro ${fashion}">
		<table id="wait"><tr><td><i class="fa fa-spinner fa-4x fa-pulse"></i></td></tr></table>
		<div class="main-div" data-dojo-type="prmaxtouch/enquiries/edit/edit" data-dojo-props='
			kb:1,
			fashion:"modern",
			icontactid:"${contactid if contactid else ""}",
			isubject:"${subject._to_unicode() if subject else ""}",
			icontacthistoryid:"${ch.contacthistoryid}",
			familyname:"${familyname if familyname else ""}",
			firstname:"${firstname if firstname else ""}",
			iemail:"${email if email else ""}",
			iphone:"${phone if phone else ""}",
			ifacebook:"${facebook if facebook else ""}",
			itwitter:"${twitter if twitter else ""}",
			iclientitems:"${clientitems}",
			iclientid:${ch.clientid if ch.clientid else -1},
			itakenbyitems:"${takenbyitems}",
			itakenby:"${ch.taken_by if ch.taken_by else -1}",
			itaken:"${taken._to_date()}",
			iresponse:"${response._to_unicode()}",
			iemployeeid:"${employeeid if employeeid else ""}",
			ioutletid:"${outletid if outletid else ""}",
			iuserid:${userid},
			user_name:"${username}"' </div>
		<script type="text/javascript" >
			require(["dojo/ready"], function(ready) {
				ready(function() {
					require([
						"dojo/parser",
						"dojo/dom",
						"dojo/dom-style",
						"prmaxtouch/enquiries/edit/edit"
					], function(parse, dom, domstyle) {
						parse.parse(dom.byId("main"));
						domstyle.set(dom.byId("wait"), "display", "none");
					});
				});
			});
		</script>
	% if prmax["release"] == True:
		<script type="text/javascript" src="/dojo/dojo/ppremcusadd.js?version=${prmax['dojoversion']}"></script>
	% endif
	</body>
</html>
