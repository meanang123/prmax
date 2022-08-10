/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.customer.Preferences"]){dojo._hasResource["prmax.customer.Preferences"]=true;dojo.provide("prmax.customer.Preferences");dojo.require("ttl.BaseWidget");dojo.require("prcommon.search.Countries");dojo.require("dojox.form.PasswordValidator");dojo.require("prcommon.recovery.passwordrecoverydetails");dojo.declare("prmax.customer.Preferences",[ttl.BaseWidget],{widgetsInTemplate:true,parentid:"",templateString:"<div style=\"width:710px;height:540px;overflow:auto;padding:0px;margin:0px\">\r\n\t<div dojoAttachPoint=\"frame\" dojotype=\"dijit.layout.BorderContainer\" style=\"710px;height:540px\" gutters=\"false\" class=\"scrollpanel\">\r\n\t\t<div dojoType=\"dijit.layout.TabContainer\" dojoAttachPoint=\"preferences_view\" region=\"center\">\r\n\t\t\t<div dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"general\" title=\"General Settings\" style=\"height:100%;width:100%;overflow-x:hidden\" class='bordered scrollpanel' >\r\n\t\t\t\t<form dojoAttachPoint=\"generalForm\" onsubmit=\"return false\" dojoType=\"dijit.form.Form\">\r\n\t\t\t\t\t<table width=\"95%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Display Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"displayname\" name=\"displayname\" maxlength=\"40\" trim=\"true\" required=\"true\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email Address</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"email\" name=\"email\" maxlength=\"70\" trim=\"true\" required=\"true\" invalidMessage=\"This must be a valid email address\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.emailAddress\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Select First Row</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"autoselectfirstrecord\" value=\"1\" name=\"autoselectfirstrecord\" dojoType=\"dijit.form.CheckBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Use Partial Match</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"usepartialmatch\" value=\"1\" name=\"usepartialmatch\" dojoType=\"dijit.form.CheckBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Search Append's </td><td><input class=\"prmaxinput\" dojoAttachPoint=\"searchappend\" value=\"1\" name=\"searchappend\" dojoType=\"dijit.form.CheckBox\" /></td></tr>\r\n\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Password Recovery</td><td>\r\n\t\t\t\t\t\t\t<span><input data-dojo-attach-point=\"passwordrecovery\" data-dojo-props=\"'class':'prmaxinput', value:'1', name:'passwordrecovery'\" data-dojo-type=\"dijit.form.CheckBox\" data-dojo-attach-event=\"onChange:_set_recovery\"/></span>\r\n\t\t\t\t\t\t\t<span><button data-dojo-attach-event=\"onClick:_recovery\" data-dojo-attach-point=\"setrecoverydetailsbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"' >Edit</button></span>\r\n\t\t\t\t\t\t\t</td></tr>\r\n\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Reply To Email</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"emailreplyaddress\" name=\"emailreplyaddress\" maxlength=\"70\" trim=\"true\" invalidMessage=\"This must be a valid email address\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.emailAddress\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Default Sort Order</td><td><select class=\"prmaxinput\"  dojoAttachPoint=\"stdview_sortorder\" dojotype =\"dijit.form.FilteringSelect\" name=\"stdview_sortorder\" searchAttr=\"name\" labelType=\"html\" ></select></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">\"Client\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"client_name\" name=\"client_name\" maxlength=\"20\" trim=\"true\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr dojoAttachPoint=\"crm_view_1\" class=\"prmaxhidden\"><td align=\"right\" class=\"prmaxrowtag\">\"Issue\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"issue_description\" name=\"issue_description\" maxlength=\"20\" trim=\"true\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr dojoAttachPoint=\"crm_view_2\" class=\"prmaxhidden\"><td align=\"right\" class=\"prmaxrowtag\">\"Subject\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"crm_subject\" name=\"crm_subject\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr dojoAttachPoint=\"crm_view_3\" class=\"prmaxhidden\"><td align=\"right\" class=\"prmaxrowtag\">\"Outcome\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"crm_outcome\" name=\"crm_outcome\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t\t\t\t<tr dojoAttachPoint=\"crm_view_4\" class=\"prmaxhidden\">\r\n\t\t\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\">\"Engagement\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"crm_engagement\" name=\"crm_engagement\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" />\r\n\t\t\t\t\t\t\t<span align=\"right\" class=\"prmaxrowtag\">Plural</span><span><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"crm_engagement_plural\" name=\"crm_engagement_plural\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></span></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">\"Distribution\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"distribution_description\" name=\"distribution_description\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" />\r\n\t\t\t\t\t\t\t<span align=\"right\" class=\"prmaxrowtag\">Plural</span><span><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"distribution_description_plural\" name=\"distribution_description_plural\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></span></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">\"Briefing Notes\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"briefing_notes_description\" name=\"briefing_notes_description\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">\"Response\" Name</td><td><input  class=\"prmaxinput\" size=\"40\" dojoAttachPoint=\"response_description\" name=\"response_description\" maxlength=\"20\" trim=\"true\" required=\"false\" invalidMessage=\"This cannot be blank\" dojoType=\"dijit.form.ValidationTextBox\" /></span></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Countries</td><td><div data-dojo-props ='style:\"width:99%\",name:\"user_countries\",selectonly:true,startopen:true,preload:false,size:4,displaytitle:\"\"' data-dojo-attach-point=\"user_countries\" data-dojo-type=\"prcommon.search.Countries\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\" disabled=\"disabled\"  dojoAttachPoint=\"general_update\" dojoAttachEvent=\"onClick:_SaveGeneral\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Saving...\" label=\"Update Settings\"></button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t\t<div dojoType=\"dijit.layout.ContentPane\" title=\"Interface Settings\" dojoAttachPoint=\"interface\" style=\"height:100%;width:100%;overflow :auto\" class='bordered scrollpanel' selected=\"true\">\r\n\t\t\t\t<br/>\r\n\t\t\t\t<table width=\"95%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t\t<tr><td width=\"30%\" class=\"prmaxrowtag\">Font Size:</td>\r\n\t\t\t\t\t\t<td width=\"70%\"><select class=\"prmaxinput\" autoComplete=\"true\" name=\"interface_font_size\" dojoAttachPoint=\"interface_font_size\" style=\"width:5em\" dojoType=\"dijit.form.FilteringSelect\">\r\n\t\t\t\t\t\t<option value=\"9\">9</option>\r\n\t\t\t\t\t\t<option value=\"10\">10</option>\r\n\t\t\t\t\t\t<option value=\"11\">11</option>\r\n\t\t\t\t\t\t<option value=\"12\">12</option>\r\n\t\t\t\t\t\t<option value=\"14\">14</option>\r\n\t\t\t\t\t\t<option value=\"18\">18</option>\r\n\t\t\t\t\t\t</select><label class=\"prmaxrowtag\">pt</label>\r\n\t\t\t\t\t</td></tr>\r\n\t\t\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\" disabled=\"disabled\" dojoAttachPoint=\"interface_upd\" dojoAttachEvent=\"onClick:_SaveInterface\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Saving...\" label=\"Update Interface Settings\"></button></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t<div dojoType=\"dijit.layout.ContentPane\" title=\"User Password\" dojoAttachPoint=\"password\" style=\"width:532px\">\r\n\t\t\t\t<br/>\r\n\t\t\t\t<form dojoAttachPoint=\"userpasswordform\"  onsubmit=\"return false\" dojoType=\"dijit.form.Form\">\r\n\t\t\t\t\t<div dojoType=\"dojox.form.PasswordValidator\" name=\"pssw\" class=\"prmaxrowtag\" dojoAttachPoint=\"pssw\">\r\n\t\t\t\t\t\t<table class=\"prmaxtable\" width=\"95%\" >\r\n\t\t\t\t\t\t\t<tr><td width=\"30%\" class=\"prmaxrowtag\">Enter New Password:</td><td width=\"30%\"><input class=\"prmaxinput\" dojoAttachPoint=\"pssw_name\" size=\"20\" maxlength=\"20\" trim=\"true\" dojoType=\"dijit.form.TextBox\" type=\"password\" pwType=\"new\"/></td></tr>\r\n\t\t\t\t\t\t\t<tr><td width=\"30%\" class=\"prmaxrowtag\">Confirm Password:</td><td width=\"30%\"><input class=\"prmaxinput\" dojoAttachPoint=\"pssw_cnfrm\" size=\"20\" maxlength=\"20\" trim=\"true\" dojoType=\"dijit.form.TextBox\" type=\"password\" pwType=\"verify\"/></td></tr>\r\n\t\t\t\t\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\" disabled=\"disabled\" dojoAttachPoint=\"pssw_update\"  dojoAttachEvent=\"onClick:_SavePasswordButton\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Saving...\" label=\"Change Password\"></button></td></tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t\t<div dojoType=\"dijit.layout.ContentPane\" title=\"CC Addresses\" dojoAttachPoint=\"ccaddress\" style=\"width:532px\">\r\n\t\t\t\t<br/>\r\n\t\t\t\t<form dojoAttachPoint=\"ccform\" onsubmit=\"return false\" dojoType=\"dijit.form.Form\">\r\n\t\t\t\t\t<table width=\"95%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t\t\t<tr><td align=\"right\" valign=\"top \"class=\"prmaxrowtag\">CC addresses:</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"ccaddresses\" name=\"ccaddresses\" maxlength=\"200\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width:100%\"/></td></tr></br>\r\n\t\t\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\" dojoAttachPoint=\"cc_update\" dojoAttachEvent=\"onClick:_SaveCC\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Saving...\" label=\"Update CC email addresses\"></button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" style=\"height:34px;padding-top:2px;padding-right:10px\" region=\"bottom\">\r\n\t\t\t<button style=\"float:right\" type=\"button\" class=\"prmaxbutton\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_Close\" label=\"Close\"></button>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"set_passwordrecovery_dialog\" data-dojo-props='title:\"Set Password Recovery\",style:\"width:450px;height:250px\"'>\r\n\t\t\t<div data-dojo-type=\"prcommon.recovery.passwordrecoverydetails\" data-dojo-attach-point=\"set_passwordrecovery_ctrl\"></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this._SavePasswordSaveCall=dojo.hitch(this,this._SavePasswordSave);this._SaveGeneralSaveCall=dojo.hitch(this,this._SaveGeneralSave);this._SaveCCCallBack=dojo.hitch(this,this._SaveCCCall);this._LoadCallBack=dojo.hitch(this,this._Load);this._SaveItfCall=dojo.hitch(this,this._SaveItf);this.store=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=sortorder"});this._extended_security=false;},postCreate:function(){this.inherited(arguments);this.stdview_sortorder.store=this.store;if(PRMAX.utils.settings.crm){dojo.removeClass(this.crm_view_1,"prmaxhidden");dojo.removeClass(this.crm_view_2,"prmaxhidden");dojo.removeClass(this.crm_view_3,"prmaxhidden");dojo.removeClass(this.crm_view_4,"prmaxhidden");}this.Load();},_has_lower_case:function(_1){var i=0;while(i<=_1.length){c=_1.charAt(i);if(c==c.toLowerCase()){return true;}i++;}return false;},_has_upper_case:function(_2){var i=0;while(i<=_2.length){c=_2.charAt(i);if(c==c.toUpperCase()){return true;}i++;}return false;},_has_number:function(_3){var i=0;while(i<=_3.length){c=_3.charAt(i);if(parseInt(c)){return true;}i++;}return false;},_SavePasswordButton:function(){if(ttl.utilities.formValidator(this.userpasswordform)==false){alert("Invalid Password");this.pssw_update.cancel();return false;}var _4=this.pssw.value;if(this._extended_security==true){if(_4.length<8||this._has_lower_case(_4)==false||this._has_upper_case(_4)==false||this._has_number(_4)==false){alert("Please enter a valid password: minimum length 8 characters, at least one character upper case, one character lower case and one digit");this.pssw_update.cancel();return;}}dojo.xhrPost(ttl.utilities.makeParams({load:this._SavePasswordSaveCall,url:"/user/preferences_password_update",content:{pssw_name:_4,pssw_cnfrm:_4}}));},_SavePasswordSave:function(_5){if(_5.success=="OK"){alert("Password Changed");}else{alert("Problem saving password");}this.pssw_update.cancel();},Load:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadCallBack,url:"/user/preferences_get"}));},_Load:function(_6){this.displayname.set("value",_6.data.user.display_name);this.email.set("value",_6.data.user.email_address);this.passwordrecovery.set("checked",_6.data.user.passwordrecovery);this.autoselectfirstrecord.set("value",_6.data.user.autoselectfirstrecord);this.interface_font_size.set("value",_6.data.user.interface_font_size);this.usepartialmatch.set("checked",_6.data.user.usepartialmatch);this.searchappend.set("checked",_6.data.user.searchappend);this.emailreplyaddress.set("value",_6.data.user.emailreplyaddress);this.stdview_sortorder.set("value",_6.data.user.stdview_sortorder);this.user_countries.set("value",_6.data.countries);this.client_name.set("value",_6.data.user.client_name);this.issue_description.set("value",_6.data.user.issue_description);this.crm_outcome.set("value",_6.data.customer.crm_outcome);this.crm_subject.set("value",_6.data.customer.crm_subject);this.crm_engagement.set("value",_6.data.customer.crm_engagement);this.crm_engagement_plural.set("value",_6.data.customer.crm_engagement_plural);this.distribution_description.set("value",_6.data.customer.distribution_description);this.distribution_description_plural.set("value",_6.data.customer.distribution_description_plural);this.briefing_notes_description.set("value",_6.data.customer.briefing_notes_description);this.response_description.set("value",_6.data.customer.response_description);this.general_update.set("disabled",false);this.pssw_update.set("disabled",false);this.interface_upd.set("disabled",false);this.ccaddresses.set("value",_6.data.control.ccaddresses);this.preferences_view.selectChild(this.general);},Clear:function(){this.general_update.cancel();this.pssw_update.cancel();this.interface_upd.cancel();},_SaveGeneral:function(){if(ttl.utilities.formValidator(this.generalForm)==false){alert("Not all required field filled in");this.general_update.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SaveGeneralSaveCall,url:"/user/preferences_general_update",content:this.generalForm.get("value")}));},_SaveCC:function(){var _7=this.ccaddresses.get("value").split(",");var _8=true;for(var i=0;i<=_7.length-1;i++){if(_7[i].trim()){if(!this._validateEmail(_7[i])){_8=false;}}}if(!_8){alert("Please enter valid email addresses");this.cc_update.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SaveCCCallBack,url:"/user/preferences_cc_update",content:this.ccform.get("value")}));},_validateEmail:function(_9){var _a=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;if(!_a.test(_9)){return false;}return true;},_SaveCCCall:function(_b){if(_b.success=="OK"){alert("CC email addresses updated");PRMAX.utils.settings.ccaddresses=this.ccaddresses.get("value");dojo.publish("/usersettings/ccaddresses",[_b.data]);}else{alert("Problem updating CC email addresses");}this.cc_update.cancel();},_SaveGeneralSave:function(_c){if(_c.success=="OK"){PRMAX.utils.settings.passwordrecovery=this.passwordrecovery.get("checked");PRMAX.utils.settings.autoselectfirstrecord=this.autoselectfirstrecord.get("value");PRMAX.utils.settings.usepartialmatch=this.usepartialmatch.get("checked");PRMAX.utils.settings.searchappend=this.searchappend.get("checked");PRMAX.utils.settings.emailreplyaddress=this.emailreplyaddress.get("value");PRMAX.utils.settings.stdview_sortorder=this.stdview_sortorder.get("value");PRMAX.utils.settings.client_name=this.client_name.get("value");PRMAX.utils.settings.issue_description=this.issue_description.get("value");PRMAX.utils.settings.crm_outcome=this.crm_outcome.get("value");PRMAX.utils.settings.crm_subject=this.crm_subject.get("value");PRMAX.utils.settings.crm_engagement=this.crm_engagement.get("value");PRMAX.utils.settings.crm_engagement_plural=this.crm_engagement_plural.get("value");PRMAX.utils.settings.distribution_description=this.distribution_description.get("value");PRMAX.utils.settings.distribution_description_plural=this.distribution_description_plural.get("value");PRMAX.utils.settings.briefing_notes_description=this.briefing_notes_description.get("value");PRMAX.utils.settings.response_description=this.response_description.get("value");dojo.publish("/update/engagement_label");dojo.publish("/update/distribution_label");alert("Settings Saved");}else{alert("Problem saving settings");}this.general_update.cancel();},_SaveInterface:function(){var _d=this.interface_font_size.get("value");if(_d==null||_d==undefined||_d==""){alert("Invalid Font Size");this.interface_font_size.focus();this.interface_upd.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SaveItfCall,url:"/user/preferences_itf_update",content:{interface_font_size:_d}}));},_SaveItf:function(_e){if(_e.success=="OK"){alert("Interface Settings Saved, Interface will now reload");this.Clear();window.location.reload(true);}else{alert("Problem saving interface settings");}},_Close:function(){dojo.publish(PRCOMMON.Events.Dialog_Close,["preferences"]);},resize:function(){this.frame.resize(arguments[0]);},_recovery:function(){if(this.passwordrecovery.get("checked")){this.set_passwordrecovery_dialog.show();this.set_passwordrecovery_ctrl.load(this.set_passwordrecovery_dialog,false);}},_set_recovery:function(){if(this.passwordrecovery.get("checked")){dojo.removeClass(this.setrecoverydetailsbtn.domNode,"prmaxhidden");}else{dojo.addClass(this.setrecoverydetailsbtn.domNode,"prmaxhidden");}}});}