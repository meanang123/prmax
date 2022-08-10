/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.PaneSimple"]){dojo._hasResource["ttl.PaneSimple"]=true;dojo.provide("ttl.PaneSimple");dojo.require("dijit.layout.ContentPane");dojo.declare("ttl.PaneSimple",[dijit.layout.ContentPane,dijit._Templated,dijit._Contained],{templateString:"<div class='ttlPaneSimple'>\r\n\t<div dojoAttachPoint=\"titleBoxNode\" class='ttlPaneSimpleTitle'>\r\n\t\t<div dojoAttachPoint='titleTextNode' class='ttlPaneSimpleText'>${title}</div>\r\n\t</div>\r\n\t\t<div dojoAttachPoint='containerNode' class='ttlPaneSimpleBody ${mode}'></div>\r\n</div>\r\n",mode:"expanded",postCreate:function(){this.inherited("postCreate",arguments);},startup:function(){this.inherited("startup",arguments);var h=parseInt(this.domNode.style.height.replace("px",""));var c=dojo.coords(this.titleBoxNode);if(c.h==0){c.h=30;}this.containerNode.style.height=h-c.h+"px";this.inherited(arguments);},resize:function(c){}});}