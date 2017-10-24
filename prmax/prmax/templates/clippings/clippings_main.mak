# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
<head>
	<title>PRmax Clippings</title>
	<link rel="shortcut icon" type="image/x-icon" href="/prmax_common_s/images/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="author" content="Chris Hoy"/>
	<meta name="COPYRIGHT" content="PRMax V${prmax['dojoversion']} ${prmax['copyright']}"/>
	<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
	<style type="text/css"  media="screen" >
		@import "/dojo1/dijit/themes/claro/claro.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/prcommon.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/prlayout.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/font-awesome/css/font-awesome.min.css?version=${prmax['dojoversion']}";
		@import "/static/${prmax['prodpath']}/css/clippings_main.css?version=${prmax['dojoversion']}";
		html, body { width: 100%; height: 100%;overflow: hidden; border: 0; padding: 0; margin: 0;font-family: sans-serif;font-size:10pt};
	</style>
% if prmax["release"] == False:
	<script type="text/javascript" >
	djConfig={isDebug:true,
		popup:true,
		parseOnLoad:false,
		locale: 'en-gb',
		baseUrl:'/dojo1/dojo/',
		cacheBust: false,
		async:true,
		paths:
		{
			'ttl':'/ttl_comp/ttl',
			'prcommon2':'/prmax_common_comp/prcommon2',
			'dgrid':'/dojo1/dgrid',
			"xstyle": "/dojo1/xstyle",
			"put-selector": "/dojo1/put-selector",
			"dojox":"/dojo1/dojox"
		}
	};
	</script>
	<script type="text/javascript" src="/dojo1/dojo/dojo.js?version=${prmax['dojoversion']}"></script>
% else:
	<script type="text/javascript" src="/dojo1/dojo/dojo.js?version=${prmax['dojoversion']}" data-dojo-config="locale:'en-gb',isDebug:false, parseOnLoad:false, async:true, cacheBust:true"></script>
% endif
	<script type="text/javascript" >
	PRMAX = {};
	PRCOMMON = {};
	TTL = {};
	//Global definitions
	PRCOMMON.Events = null;
	PRCOMMON.Constants = null;
	TTL.UUID = null;
	PRCOMMON.utils = {};
	PRCOMMON.data = {};
	PRMAX.utils = {};
	</script>
</head>
<body id="main" class="claro">
	<table id="wait" width="100%" height="100%"><tr><td style="text-align:center;vertical-align:middle">
		<p>Loading PRmax Clippings</p><br/>
		<i class="fa fa-spinner fa-2x fa-pulse" style="color:#0282A9"></i></td><td style="text-align:left;vertical-align:middle">
	</td></tr></table>
	<div id="mainframe" data-dojo-type="prcommon2/clippings/frame" data-dojo-props='style:"width:100%;height:100%;${top_border}",as_frame:${as_frame}'></div>
<script type="text/javascript" >
// get the ready function
function start_up( parse, BorderContainer, json, UUID, dom, domstyle, frame, PREVENTS,DataStores)
{
	PRCOMMON.utils.uuid = new UUID();

	PRMAX.Settings = json.parse('${control}');
	PRCOMMON.Events = new PREVENTS();
	PRCOMMON.utils.stores = new DataStores();
	PRMAX.utils.settings = PRMAX.Settings;

	parse.parse( dom.byId("main"));
	domstyle.set(dom.byId("wait"),"display", "none");
}

function on_ready(ready)
{
	ready( function(){
		require(["dojo/parser",
							"dijit/layout/BorderContainer",
							"dojo/json",
							"ttl/Amduuid",
							"dojo/dom",
							"dojo/dom-style",
							"prcommon2/clippings/frame",
							"prcommon2/prevents",
							"prcommon2/store/DataStores"
],start_up);
	});
}

require(["dojo/ready"], on_ready);

</script>
% if prmax["release"] == True:
<script type="text/javascript" src="/dojo1/dojo/prmaxclippings.js?version=${prmax['dojoversion']}"></script>
% endif
</body>
</html>

