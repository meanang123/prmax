<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<style type="text/css" media="screen" >
<%include file="std_definitions.css"/>
html, body { width: 100%; height: 100%;overflow: hidden; border: 0; padding: 0; margin: 0;font-family: sans-serif;font-size:${prmax.user.interface_font_size}pt}
</style>
<title>PRmax Main</title>
<%include file="std_header.mak"/>
<script type="text/javascript" >
<%include file="std_definitions.js"/>
</script>
<script type="text/javascript" src="/static/${prmax['dojopath']}/dojo/dojo.js?version=${prmax['dojoversion']}"></script>
<script type="text/javascript" src="/static/${prmax['dojopath']}/dojo/prmaxstartup.js?version=${prmax['dojoversion']}"></script>
<script type="text/javascript" >
% if not prmax['release']:
dojo.require("prmax.pressrelease.seo.customer.view");
% endif
PRMAX.utils.settings = dojo.fromJson( '${tg.identity.user.get_json_settings()}' );
PRMAX.utils.fieldControl = {};
</script>
</head>
<body class="soria">
<div data-dojo-type="prmax.pressrelease.seo.customer.view" data-dojo-props='style:"width:100%;height:100%",displayname:"${tg.identity.user.get_display_info()} | ${prmax['build']}"'></div>
% if prmax['release']:
<script type="text/javascript" src="/static/${prmax['dojopath']}/dojo/prmaxseoodojo.js?version=${prmax['dojoversion']}"></script>
% endif
</body></html>