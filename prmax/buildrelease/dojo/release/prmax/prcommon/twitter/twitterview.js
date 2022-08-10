/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.twitter.twitterview"]){dojo._hasResource["prcommon.twitter.twitterview"]=true;dojo.provide("prcommon.twitter.twitterview");dojo.require("dojo.io.script");dojo.require("ttl.BaseWidget");dojo.declare("prcommon.twitter.twitterview",[ttl.BaseWidget],{tweetSearchUrl:"http://search.twitter.com/search.json",twitterName:"",tweetCount:5,widgetsInTemplate:true,templateString:"<div class=\"twitterview\" >\r\n<p style=\"padding-left:15px\"><a data-dojo-attach-point=\"employee_display_twitter\" target=\"blank\">Show Tweets</a>\r\n</p>\r\n</div>\r\n",constructor:function(){},_setTwitternameAttr:function(_1){this.twitterName=_1;dojo.attr(this.employee_display_twitter,"href",_1);},Clear:function(){},Load:function(){}});}