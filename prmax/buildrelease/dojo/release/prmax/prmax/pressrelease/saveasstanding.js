/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.pressrelease.saveasstanding"]){dojo._hasResource["prmax.pressrelease.saveasstanding"]=true;dojo.provide("prmax.pressrelease.saveasstanding");dojo.declare("prmax.pressrelease.saveasstanding",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div style=\"width:350px;padding:20px\">\r\n\t\t<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" dojoType=\"dijit.form.Form\" onsubmit=\"return false\">\r\n\t\t\t<input type=\"hidden\" name=\"emailtemplateid\" value=\"\" dojoType=\"dijit.form.TextBox\" dojoAttachPoint=\"emailtemplateid\"/>\r\n\t\t\t<table class=\"prmaxtable\" cellpadding=\"0\" cellspacing =\"0\">\r\n\t\t\t\t<tr><td class=\"prmaxlabeltag\" >New Media List</label></td><td><input dojoType=\"dijit.form.ValidationTextBox\" name=\"listname\" dojoAttachPoint=\"listname\" required=\"true\" trim=\"true\" maxlength=\"45\" promptMessage=\"Enter Media List Name\" type=\"text\" ></td></tr>\r\n\t\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"left\"><button class=\"prmaxbutton\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_Cancel\" type=\"button\" >Cancel</button></td>\r\n\t\t\t\t\t<td align=\"right\"><button class=\"prmaxbutton\" dojoAttachEvent=\"onClick:_Save\" dojoAttachPoint=\"saveNode\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Creating...\" label=\"Create\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this._SavedCall=dojo.hitch(this,this._Saved);},postCreate:function(){dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._SubmitAdd));this.inherited(arguments);},_Cancel:function(){this._Clear();this.hide();},_Save:function(){this.form.submit();},_SubmitAdd:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Not all required field filled in");this.saveNode.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SavedCall,url:"/emails/templates_save_as_standing",content:this.form.get("value")}));},_Saved:function(_1){if(_1.success=="OK"){dojo.publish(PRCOMMON.Events.List_Add,[_1.data]);this.hide();this._Clear();}else{if(_1.success=="DU"){alert("Media List Already Exists");this.listname.focus();}else{if(_1.success=="VF"){alert("Media List: "+_1.error_message[0][1]);this.listname.focus();}else{alert("Problem with Media List");this.listname.focus();}}}this.saveNode.cancel();},_Clear:function(){this.listname.set("value",null);this.emailtemplateid.set("value","");this.saveNode.cancel();},Load:function(_2,_3){this.emailtemplateid.set("value",_3);this._dlg=_2;},hide:function(){this._dlg.hide();}});}