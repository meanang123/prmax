# -*- coding: utf-8 -*-
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>Prmax</title>
<%include file="../std_header.mak"/>
<style type="text/css"  media="screen" >
<%include file="../std_definitions.css"/>
@import "/static/${prmax['prodpath']}/css/marketing.css?version=${prmax['dojoversion']}";
@import "/static/${prmax['prodpath']}/css/prmax.css?version=${prmax['dojoversion']}";
html, body { width: 100%; height: 100%;overflow: hidden; border: 0; padding: 0; margin: 0;font-family: sans-serif;font-size:9pt}
</style>
<script type="text/javascript" >
<%include file="../std_definitions.js"/>
</script>
<script type="text/javascript" src="/static/${prmax['dojopath']}/dojo/dojo.js?version=${prmax['dojoversion']}"></script>
<script type="text/javascript" src="/static/${prmax['dojopath']}/dojo/prmaxnewcustomer.js?version=${prmax['dojoversion']}"></script>
<script type="text/javascript">
dojo.require("dojox.data.QueryReadStore");
dojo.require("prmax.customer.NewCustomer");
dojo.require("prmax.customer.PaymentCollectDetails");
</script>
</head>
<body class="soria">
<div dojotype="dijit.layout.BorderContainer" style="width:100%;height:100%" >
	<div dojotype="dijit.layout.ContentPane" region="top" style="width:100%;height:80px" >
		<%include file="../marketing/marketing_header_min.html"/>
	</div>
	<div id ="customer_control_pane" dojotype="dijit.layout.ContentPane" region="center" >
		<div dojotype="prmax.customer.NewCustomer" defaultcost="£${cost}" customersourceid="${customersourceid}" style="width:50%;height:100%" ></div>
	</div>
</div>
</body></html>
