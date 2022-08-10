/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.support.ResetAndSend"]){dojo._hasResource["prmax.iadmin.support.ResetAndSend"]=true;dojo.provide("prmax.iadmin.support.ResetAndSend");dojo.declare("prmax.iadmin.support.ResetAndSend",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-type=\"dijit.form.Form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"iuserid\"' data-dojo-attach-point=\"iuserid\" data-dojo-type=\"dijit.form.TextBox\" ></input>\r\n\t\t<table class=\"prmaxtable\" width=\"500px\"  border=\"0\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Display Name</td><td data-dojo-attach-point=\"displayname\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Email To:</td><td><input data-dojo-attach-point=\"email\" data-dojo-props='name:\"email\",type:\"text\",maxlength:80,trim:true,regExpGen:dojox.validate.regexp.emailAddress,required:true,invalidMessage:\"invalid email address\"' data-dojo-type=\"dijit.form.ValidationTextBox\" /></td>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Password</td><td><input data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"password\",type:\"text\",size:\"40\",maxlength:\"40\",trim:true,required:true' data-dojo-attach-point=\"password\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Full Details</td><td><input data-dojo-attach-point=\"fulldetails\" data-dojo-props='value:\"false\",name:\"fulldetails\",type:\"checkBox\"' data-dojo-type=\"dijit.form.CheckBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-point=\"updbtn\" data-dojo-type=\"dojox.form.BusyButton\" data-dojo-props='busyLabel:\"Please Wait...\",label:\"Send Details\",\"class\":\"prmaxbutton\"' data-dojo-attach-event=\"onClick:_update\" ></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n\r\n",constructor:function(){this._updated_call_back=dojo.hitch(this,this._update_call);this._loaded_call_back=dojo.hitch(this,this._loaded_call);},load:function(_1,_2){this.updbtn.cancel();this.iuserid.set("value",_1);this.email.set("value","");this.password.set("value","");this._dialog=_2;dojo.xhrPost(ttl.utilities.makeParams({load:this._loaded_call_back,url:"/iadmin/get_user_internal",content:{iuserid:_1}}));},_loaded_call:function(_3){if(_3.success=="OK"){dojo.attr(this.displayname,"innerHTML",_3.data.display_name+" | "+_3.data.user_name);this.email.set("value",_3.data.user_name);this._dialog.show();}else{alert("Problem Loading User Details");}},_updated_call:function(_4){if(_4.success=="OK"){if(this._dialog){this._dialog.hide();}}else{if(_4.message){alert(_4.message);}else{alert("Problem Upating");}}this.updbtn.cancel();},_update:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Missing Data");this.updbtn.cancel();return false;}dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._updated_call_back),url:"/iadmin/send_login_details",content:this.form.get("value")}));},_update_call:function(_5){if(_5.success=="OK"){alert("Email Sent");}else{alert("problem Sending Email");}this.updbtn.cancel();}});}