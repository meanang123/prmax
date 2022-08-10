/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.ai.view"]){dojo._hasResource["prmax.ai.view"]=true;dojo.provide("prmax.ai.view");dojo.declare("prmax.ai.view",[dijit._Widget,dijit._Templated,dijit._Container],{data:"",widgetsInTemplate:true,displayname:"",templateString:"<div>\r\n\t<div dojoAttachPoint =\"frame\" dojoType=\"dijit.layout.BorderContainer\" style=\"width: 100%; height:100%\" gutters=\"False\">\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" href=\"/layout/std_banner\" style=\"width:100%;overflow:hidden;margin:0px;padding:0px;height:44px\" region=\"top\" gutters=\"False\"></div>\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" href=\"/layout/ai_start_view\" region=\"center\" gutters=\"False\"></div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){},postCreate:function(){this.inherited(arguments);},resize:function(){this.inherited(arguments);}});}