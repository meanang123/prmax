/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.messages.view_message"]){dojo._hasResource["prcommon.messages.view_message"]=true;dojo.provide("prcommon.messages.view_message");dojo.require("ttl.BaseWidget");dojo.declare("prcommon.messages.view_message",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div >\r\n\t<div dojotype=\"dijit.layout.BorderContainer\" style=\"width:100%;height:200px;padding:0px;margin:0px;overflow:auto\" >\r\n\t\t<textarea style=\"width:100%;height:200px;padding:0px;margin:0px;\" class=\"prmaxdefault\" dojoType=\"dijit.form.Textarea\" region=\"center\" readonly=\"readonly\" dojoAttachPoint=\"message\"></textarea>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this._LoadCallBack=dojo.hitch(this,this._LoadCall);},postCreate:function(){this.inherited(arguments);},_LoadCall:function(_1){if(_1.success=="OK"){}else{}},Load:function(_2){dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadCallBack,url:"/message/get",content:{messageid:_2}}));}});}