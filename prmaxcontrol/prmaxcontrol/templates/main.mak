# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
<head>
	<title>PRmax Control</title>
	<link rel="shortcut icon" type="image/x-icon" href="/prmax_common_s/images/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="author" content="Chris Hoy"/>
	<meta name="COPYRIGHT" content="PRMax V${prmax['dojoversion']} ${prmax['copyright']}"/>
	<meta name="ROBOTS" content="NOINDEX"/>
	<style type="text/css"  media="screen" >
		@import "/dojo/dijit/themes/claro/claro.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/prcommon.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/prlayout.css?version=${prmax['dojoversion']}";
		@import "/prmax_control_s/css/prmaxcontrol.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/font-awesome/css/font-awesome.css";
		html, body { width: 100%; height: 100%;overflow: hidden; border: 0; padding: 0; margin: 0;font-family: sans-serif;font-size:10pt}
	</style>
% if prmax["release"] == False:
	<script type="text/javascript" >
	 djConfig={isDebug:true,
		popup:true,
		parseOnLoad:false,
		locale: 'en-gb',
		baseUrl:'/dojo/dojo/',
		cacheBust: false,
		async:true,
		paths:
		{
			'ttl':'/ttl_comp/ttl',
			'control':'/prmax_control_comp/control',
			'prcommon2':'/prmax_common_comp/prcommon2',
			'dgrid':'/dojo/dgrid',
			"xstyle": "/dojo/xstyle",
			"put-selector": "/dojo/put-selector",
			"dojox":"/dojo/dojox"
		}
	};
	</script>
	<script type="text/javascript" src="/dojo/dojo/dojo.js?version=${prmax['dojoversion']}"></script>
% else:
	<script type="text/javascript" src="/dojo/dojo/dojo.js?version=${prmax['dojoversion']}" data-dojo-config="isDebug:false, parseOnLoad:false, async : 1, cacheBust: true"></script>
% endif
	<script type="text/javascript" >
	PRMAX = {};
	PRCOMMON = {};
	TTL = {};
	//Global definitions
	PRCOMMON.Events = null;
	PRCOMMON.Constants = null;
	TTL.UUID = null ;
	PRCOMMON.utils = {};
	</script>
</head>
<body id="main" class="claro">
	<p id="wait">Please Wait Loading Prmax Control Interface<br/></p>
	<div data-dojo-type="dijit/layout/BorderContainer" data-dojo-props='style:"width:100%;height:100%",gutters:false'>
		<div id="mainframe" data-dojo-type="control/frame" data-dojo-props='"class":"bordered",style:"width:100%;height:100%",region:"center"'></div>
	</div>
<script type="text/javascript" >
// get the ready function
function start_up( parse, BorderContainer, json, UUID, PREVENTS, DataStores,dom, domstyle,frame)
{
	PRCOMMON.utils.uuid = new UUID();
	PRCOMMON.Events = new PREVENTS();
	PRCOMMON.utils.stores = new DataStores();
	PRCOMMON.utils.stores.fetch();

	PRMAX.Settings = json.parse( '${control}' );
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
							"prcommon2/prevents",
							"prcommon2/store/DataStores",
							"dojo/dom",
							"dojo/dom-style",
							"control/frame",
							"dijit/Tree"
],start_up);
	});
}

require(["dojo/ready"], on_ready );

</script>
% if prmax["release"] == True:
<script type="text/javascript" src="/dojo/dojo/prmaxcontrol.js?version=${prmax['dojoversion']}"></script>
% endif
</body>
</html>
