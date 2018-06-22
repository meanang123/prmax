<title>Prmax Ltd</title>
<link rel="shortcut icon" type="image/x-icon" href="/prmaxtouch_s/images/prmax.ico"/>
<%include file="/prmaxtouch/templates/common/meta_standard.mak"/>
<style type="text/css" media="screen">
	@import "/dojo/dijit/themes/claro/claro.css?version=${prmax['dojoversion']}";
	@import "/prmaxtouch_s/css/font-awesome-5.0.6/css/fontawesome-all.css?version=${prmax['dojoversion']}";
	@import "/prmaxtouch_s/css/prmaxtouch.css?version=${prmax['dojoversion']}";
</style>
% if prmax["release"] == False:
	<script type="text/javascript">
		djConfig = {
			isDebug:true,
			popup:true,
			locale: 'en-gb',
			parseOnLoad:false,
			baseUrl:'/dojo/dojo/',
			cacheBust: true,
			paths: {
				'ttl':'/ttl_comp/ttl',
				'prmaxtouch':'/prmaxtouch_comp/prmaxtouch',
				"xstyle": "/dojo/xstyle",
				"put-selector": "/dojo/put-selector",
				"dojox":"/dojo/dojox"
			}
		};
	</script>
	<script type="text/javascript" src="/dojo/dojo/dojo.js?version=${prmax['dojoversion']}"></script>
% else:
	<script type="text/javascript" src="/dojo/dojo/dojomin.js?version=${prmax['dojoversion']}" data-dojo-config="locale:'en-gb',isDebug:false,parseOnLoad:false,async:true,cacheBust:true,baseUrl:'/dojo/dojo/'"></script>
% endif

