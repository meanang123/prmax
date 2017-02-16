# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
<head>
	<title>Prmax Questionnaire</title>
	<link rel="shortcut icon" type="image/x-icon" href="/prmax_common_s/images/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="author" content="Chris Hoy"/>
	<meta name="COPYRIGHT" content="PRMax V${prmax['dojoversion']} ${prmax['copyright']}"/>
	<meta name="ROBOTS" content="NOINDEX"/>
	<style type="text/css"  media="screen" >
		@import "/dojo/dijit/themes/claro/claro.css?version=${prmax['dojoversion']}";
		@import "/prmax_common_s/css/prcommon.css?version=${prmax['dojoversion']}";
		@import "/prmax_questionnaires_s/css/prmaxquestionnaires.css?version=${prmax['dojoversion']}";
	html, body { width: 100%; height: 100%;overflow: hidden; border: 0; padding: 0; margin: 0;font-family: sans-serif;font-size:10pt}
	</style>
% if prmax["release"] == False:
	<script type="text/javascript" >
	 djConfig={isDebug:true,
		popup:true,
		parseOnLoad:false,
		baseUrl:'/dojo/dojo/',
		cacheBust: true,
		modulePaths:
		{
			'ttl':'/ttl_comp/ttl',
			'prmaxquestionnaires':'/prmax_questionnaires_comp/prmaxquestionnaires',
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
	PRCOMMON.utils = {};
	</script>
</head>
<body id="main" class="claro">
	<p id="wait">Please Wait Loading Questionnaire<br/></p>
	<div data-dojo-type="dijit/layout/BorderContainer" data-dojo-props='style:"width:100%;height:100%",gutters:false'>
%if outlet.is_freelance():
	<div id="mainframe" data-dojo-type="prmaxquestionnaires/main/freelanceframe" data-dojo-props='"class":"bordered",style:"width:100%;height:100%",region:"center",questionnaireid:${questionnaireid}'></div>
%elif questionnaire.outletdeskid:
	<div id="mainframe" data-dojo-type="prmaxquestionnaires/main/deskframe" data-dojo-props='"class":"bordered",style:"width:100%;height:100%",region:"center",questionnaireid:${questionnaireid}'></div>
%else:
	<div id="mainframe" data-dojo-type="prmaxquestionnaires/main/frame" data-dojo-props='"class":"bordered",style:"width:100%;height:100%",region:"center",questionnaireid:${questionnaireid}'></div>
%endif
	</div>
<script type="text/javascript" >
// get the ready function
function start_up( parse, frame, frame2, frame3, BorderContainer, PREVENTS, DataStores, UUID, utilities2, request, lang, domstyle, dom)
{
	PRCOMMON.utils.uuid = new UUID();
	PRCOMMON.utils.stores = new DataStores();
	PRCOMMON.utils.stores.fetch();
	PRCOMMON.Events = new PREVENTS();

	request.post('/questionnaire/get_details',
			utilities2.make_params({ data : {questionnaireid:${questionnaireid}}})).
			then ( function do_complete( response )
			{
				PRMAX.questionnaire = response.data;
				PRMAX.Settings = PRMAX.questionnaire.control;

				parse.parse( dom.byId("main"));
				domstyle.set(dom.byId("wait"),"display", "none");
			});
}

function on_ready(ready)
{
	ready( function(){
		require(["dojo/parser",
		"prmaxquestionnaires/main/frame",
		"prmaxquestionnaires/main/freelanceframe",
		"prmaxquestionnaires/main/deskframe",
		"dijit/layout/BorderContainer",
		"prcommon2/prevents",
		"prmaxquestionnaires/store/DataStores",
		"ttl/Amduuid",
		"ttl/utilities2",
		"dojo/request",
		"dojo/_base/lang",
		"dojo/dom-style",
		"dojo/dom"
	],start_up);
	});
}

require(["dojo/ready"], on_ready );

</script>
% if prmax["release"] == True:
<script type="text/javascript" src="/dojo/dojo/prmaxquestionnaires.js?version=${prmax['dojoversion']}"></script>
% endif
</body>
</html>
