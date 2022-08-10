/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.Splash"]){dojo._hasResource["ttl.Splash"]=true;dojo.provide("ttl.Splash");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.declare("ttl.Splash",[dijit._Widget,dijit._Templated,dijit._Container],{templateString:"<div class=\"Progress\"><span class=\"Title\">Loading . . .</span><br>\r\n  <span class=\"ProgressMsg\"><img src=\"/static/images/loading.gif\"/></span>\r\n</div>\r\n",constructor:function(){},postCreate:function(){this.inherited("postCreate",arguments);},startup:function(){}});}