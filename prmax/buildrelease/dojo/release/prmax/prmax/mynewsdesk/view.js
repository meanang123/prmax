/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.mynewsdesk.view"]){dojo._hasResource["prmax.mynewsdesk.view"]=true;dojo.provide("prmax.mynewsdesk.view");dojo.require("ttl.BaseWidget");dojo.require("prcommon.data.DataStores");dojo.require("ttl.uuid");dojo.require("ttl.GridHelpers");dojo.declare("prmax.mynewsdesk.view",[ttl.BaseWidget],{data:"",widgetsInTemplate:true,displayname:"",templateString:"<div>\r\n\t<div data-dojo-attach-point =\"frame\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false'>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='href:\"/layout/std_banner\",style:\"width:100%;overflow:hidden;margin:0px;padding:0px;height:44px;background-color: black !important;\",region:\"top\"'></div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='href:\"/layout/mynewsdesk_start_view\",region:\"center\"'></div>\r\n\t</div>\r\n\t<div style=\"position:absolute;bottom:4px;right:45%;\"><i style=\"color:grey\">by&nbsp;</i><img height=\"15px\" src=\"/static/images/mynewsdesk/mynewsdesk_logo_grey.png\"></img></div>\r\n</div>\r\n",resize:function(){this.inherited(arguments);}});}