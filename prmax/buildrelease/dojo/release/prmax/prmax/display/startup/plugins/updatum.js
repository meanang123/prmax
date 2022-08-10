/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.display.startup.plugins.updatum"]){dojo._hasResource["prmax.display.startup.plugins.updatum"]=true;dojo.provide("prmax.display.startup.plugins.updatum");dojo.require("dojox.widget.Portlet");dojo.declare("prmax.display.startup.plugins.updatum",[ttl.BaseWidget],{templateString:dojo.cache("prmax","display/startup/plugins/templates/updatum.html","<div>\r\n\t<div data-dojo-type=\"dojox.widget.Portlet\" data-dojo-attach-point=\"portlet\" data-dojo-props='title:\"Monitoring\", closable:false, style:\"width:100%;height:100%\", toggleable:false, dragRestriction:true'>\r\n\t\t<div data-dojo-attach-point=\"borderCtrl\" data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='style:\"width:100%;height:200px\"'></div>\r\n\t</div>\r\n</div>\r\n"),constructor:function(){},postCreate:function(){this.inherited(arguments);}});}