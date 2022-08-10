/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.search.SearchCount"]){dojo._hasResource["prcommon.search.SearchCount"]=true;dojo.provide("prcommon.search.SearchCount");dojo.require("ttl.BaseWidget");dojo.declare("prcommon.search.SearchCount",[ttl.BaseWidget],{templateString:"<div dojoAttachPoint=\"innerNode\" class=\"prmaxsearchcount\">&nbsp;</div>\r\n",Clear:function(){this.innerNode.innerHTML="&nbsp;";},_getValueAttr:function(){return this.innerNode.innerHTML;},_setValueAttr:function(_1){this.innerNode.innerHTML=_1;}});}