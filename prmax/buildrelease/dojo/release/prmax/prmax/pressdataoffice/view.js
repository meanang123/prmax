/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.pressdataoffice.view"]){dojo._hasResource["prmax.pressdataoffice.view"]=true;dojo.provide("prmax.pressdataoffice.view");dojo.require("ttl.BaseWidget");dojo.require("prcommon.data.DataStores");dojo.require("ttl.uuid");dojo.require("ttl.GridHelpers");dojo.declare("prmax.pressdataoffice.view",[ttl.BaseWidget],{data:"",widgetsInTemplate:true,displayname:"",templateString:"<div>\r\n\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false'>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='href:\"/layout/std_banner\",style:\"width:100%;height:100px;overflow:hidden;margin:0px;padding:0px;background-color:#3397B9\",region:\"top\"'></div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='href:\"/layout/pressdataoffice_start_view\",region:\"center\",style:\"margin:0px;padding:0px\"'></div>\r\n\t</div>\r\n</div>\r\n",resize:function(){this.inherited(arguments);}});}