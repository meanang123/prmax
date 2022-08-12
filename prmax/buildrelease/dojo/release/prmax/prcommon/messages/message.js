/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.messages.message"]){dojo._hasResource["prcommon.messages.message"]=true;dojo.provide("prcommon.messages.message");dojo.require("ttl.BaseWidget");dojo.require("prcommon.messages.selectdestination");dojo.declare("prcommon.messages.message",[ttl.BaseWidget],{widgetsInTemplate:true,messagedefaultvalue:2,templateString:"<div >\r\n\t<form  onsubmit=\"return false\" dojoType=\"dijit.form.Form\" dojoAttachPoint=\"formNode\">\r\n\t\t<input name=\"parentmessageid\" dojoAttachPoint=\"parentmessageid\" type=\"hidden\" dojoType=\"dijit.form.TextBox\" value=\"-1\" ></input>\r\n\t\t<div dojoAttachPoint=\"to_address\"  class=\"prmaxhidden\">\r\n\t\t<table class=\"prmaxtable\" width=\"600px\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" style=\"width:15%\">To</td><td>\r\n\t\t\t<input name=\"toaddress\" dojoAttachPoint=\"toaddress\" type=\"hidden\" dojoType=\"dijit.form.TextBox\" ></input>\r\n\t\t\t<input  dojoAttachPoint=\"toaddress_display\" type=\"text\" readonly=\"readonly\" dojoType=\"dijit.form.TextBox\" ></input>\r\n\t\t\t<button  type=\"button\" dojoAttachEvent=\"onClick:_ToButton\"  dojoType=\"dijit.form.Button\" >To ...</button>\r\n\t\t\t</td></tr></table></div>\r\n\t\t</table>\r\n\t\t<table class=\"prmaxtable\" width=\"600px\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" style=\"width:15%\">Subject</td><td><input class=\"prmaxrequired\" name=\"subject\" dojoAttachPoint=\"subject\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width:100%\" invalidMessage=\"Subject Required\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Category</td><td>\r\n\t\t\t\t<select name=\"messagetypeid\" dojoAttachPoint=\"messagetypeid\" autoComplete=\"true\" searchAttr=\"name\" labelAttr=\"name\" dojoType=\"dijit.form.FilteringSelect\" pageSize=\"20\" required=\"true\" labelType=\"html\">/select>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td valign=\"top\" align=\"right\" class=\"prmaxrowtag\" >Message</td><td>\r\n\t\t\t<div dojotype=\"dijit.layout.BorderContainer\" style=\"width:100%;height:200px;padding:0px;margin:0px;overflow:auto\" >\r\n\t\t\t\t<textarea style=\"width:100%;height:200px;padding:0px;margin:0px;\" name=\"message\" class=\"prmaxdefault\" dojoType=\"dijit.form.Textarea\" region=\"center\" required=\"true\" dojoAttachPoint=\"message\"></textarea>\r\n\t\t\t</div>\r\n\t\t\t</td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<div dojoType=\"prcommon.messages.selectdestination\" dojoAttachPoint=\"select_user_dlg\"></div>\r\n</div>\r\n",constructor:function(){this._SaveCallBack=dojo.hitch(this,this._SaveCall);},postCreate:function(){this.messagetypeid.store=PRCOMMON.utils.stores.MessageTypes();this.messagetypeid.set("value",this.messagedefaultvalue);this.inherited(arguments);},focus:function(){this.subject.focus();},Valid:function(_1){if(ttl.utilities.formValidator(this.formNode)==false){alert("Not all required field filled in");return false;}if(this.message.get("value").length==0){alert("No Message Specified");return false;}return true;},_SaveCall:function(_2){if(_2.success=="OK"){alert("Message Sent");dojo.publish(PRCOMMON.Events.Message_Sent,[_2.data]);dojo.publish(PRCOMMON.Events.Dialog_Close,["mess_close"]);}else{alert("Problem changing Settings");}},Send:function(){if(this.Valid()==false){return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SaveCallBack,url:"/message/add",content:this.formNode.attr("value")}));},Clear:function(){this.messagetypeid.set("value",this.messagedefaultvalue);this.message.set("value","");this.subject.set("value","");this.parentmessageid.set("value",-1);},_ToButton:function(){this.select_user_dlg.show();}});}