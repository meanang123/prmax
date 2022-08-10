/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.blueboo.view"]){dojo._hasResource["prmax.blueboo.view"]=true;dojo.provide("prmax.blueboo.view");dojo.require("ttl.BaseWidget");dojo.require("prcommon.data.DataStores");dojo.require("ttl.uuid");dojo.require("ttl.GridHelpers");dojo.declare("prmax.blueboo.view",[ttl.BaseWidget],{data:"",widgetsInTemplate:true,displayname:"",templateString:"<div>\r\n\t<div dojoAttachPoint =\"frame\" dojoType=\"dijit.layout.BorderContainer\" style=\"width: 100%; height:100%\" gutters=\"False\">\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" href=\"/layout/std_banner\" style=\"width:100%;overflow:hidden;margin:0px;padding:0px;height:44px;background-color:#336799;\" region=\"top\"></div>\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" href=\"/layout/blueboo_start_view\" region=\"center\"></div>\r\n\t</div>\r\n</div>\r\n",resize:function(){this.inherited(arguments);}});}