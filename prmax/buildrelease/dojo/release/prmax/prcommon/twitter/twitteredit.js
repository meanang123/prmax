/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.twitter.twitteredit"]){dojo._hasResource["prcommon.twitter.twitteredit"]=true;dojo.provide("prcommon.twitter.twitteredit");dojo.require("ttl.BaseWidget");dojo.declare("prcommon.twitter.twitteredit",[ttl.BaseWidget],{name:"",value:"",widgetsInTemplate:true,templateString:"<div>\r\n\t<input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"display\" data-dojo-props='type:\"text\",style:\"width:90%;trim:true'/>\r\n</div>\r\n",constructor:function(){this.inherited(arguments);},postCreate:function(){this.inherited(arguments);},Clear:function(){},_focus:function(){},isValid:function(_1){},_setValueAttr:function(_2){this.display.set("value",_2);},_getValueAttr:function(){return this.display.get("value");},_getNameAttr:function(){return this.name;},_View:function(){}});}