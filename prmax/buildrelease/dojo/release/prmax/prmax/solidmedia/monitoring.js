/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.solidmedia.monitoring"]){dojo._hasResource["prmax.solidmedia.monitoring"]=true;dojo.provide("prmax.solidmedia.monitoring");dojo.declare("prmax.solidmedia.monitoring",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='gutters:false,style:\"width:100%;height:100%\"' >\r\n\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='region:\"top\",style:\"height:42px;width:100%;overflow:hidden\"'></div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\",splitter:true'></div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){},postCreate:function(){this.inherited(arguments);},resize:function(){this.frame.resize(arguments[0]);}});}