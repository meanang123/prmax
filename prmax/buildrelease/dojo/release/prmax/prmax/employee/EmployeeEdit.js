/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.employee.EmployeeEdit"]){dojo._hasResource["prmax.employee.EmployeeEdit"]=true;dojo.provide("prmax.employee.EmployeeEdit");dojo.require("prcommon.interests.Interests");dojo.require("ttl.utilities");dojo.require("dojox.data.JsonRestStore");dojo.declare("prmax.employee.EmployeeEdit",[ttl.BaseWidget],{parentcontrol:"",employeeid:-1,outletid:-1,addsession:false,widgetsInTemplate:true,startuploaded:0,templateString:"<div>\r\n\t<form class=\"prmaxdefault\" dojoAttachPoint=\"formNode\" dojoType=\"dijit.form.Form\" onSubmit=\"return false\">\r\n\t\t<input name=\"outletid\" dojoAttachPoint=\"outletidNode\" type=\"hidden\" dojoType=\"dijit.form.TextBox\"></input>\r\n\t\t<input name=\"employeeid\" dojoAttachPoint=\"employeeidNode\" type=\"hidden\" dojoType=\"dijit.form.TextBox\"></input>\r\n\t\t<table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"1\" cellpadding=\"1\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Contact Title</td><td><input class=\"prmaxinput\" name=\"prefix\" dojoAttachPoint=\"prefix\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 2em;\" ></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">First Name</td><td><input class=\"prmaxinput\" name=\"firstname\" dojoAttachPoint=\"firstname\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 5em;\" ></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Surname</td><td><input class=\"prmaxinput\" name=\"familyname\" dojoAttachPoint=\"familyname\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 12em;\"></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Job Title:</td><td><input class=\"prmaxrequired\" name=\"job_title\" type=\"text\" dojoAttachPoint=\"job_title\"  maxlength=\"80\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Email:</td><td ><input class=\"prmaxinput\" name=\"email\" dojoAttachPoint=\"email\" type=\"text\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.emailAddress\" trim=\"true\" invalidMessage=\"invalid email address\" size=\"20\" maxlength=\"70\"></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Tel:</td><td><input class=\"prmaxinput\" name=\"tel\" type=\"text\" dojoAttachPoint=\"tel\" size=\"25\" maxlength=\"40\" dojoType=\"dijit.form.TextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Fax:</td><td><input class=\"prmaxinput\" name=\"fax\" type=\"text\" dojoAttachPoint=\"fax\" size=\"25\" maxlength=\"40\" dojoType=\"dijit.form.TextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Mobile:</td><td><input class=\"prmaxinput\" name=\"mobile\" type=\"text\" dojoAttachPoint=\"mobile\" size=\"25\" maxlength=\"40\" dojoType=\"dijit.form.TextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Twitter</td><td><input dojoAttachPoint=\"twitter\" class=\"prmaxinput\" name=\"twitter\" type=\"text\" maxlength=\"80\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.url\" trim=\"true\" style=\"width:90%\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Facebook</td><td><input dojoAttachPoint=\"facebook\" class=\"prmaxinput\" name=\"facebook\" type=\"text\" maxlength=\"80\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.url\"  trim=\"true\" style=\"width:90%\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Linkedin</td><td><input dojoAttachPoint=\"linkedin\" class=\"prmaxinput\" name=\"linkedin\" type=\"text\" maxlength=\"80\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.url\" trim=\"true\" style=\"width:90%\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Instagram</td><td><input dojoAttachPoint=\"instagram\" class=\"prmaxinput\" name=\"instagram\" type=\"text\" maxlength=\"80\" dojoType=\"dijit.form.ValidationTextBox\" regExpGen=\"dojox.validate.regexp.url\" trim=\"true\" style=\"width:90%\" /></td></tr>\r\n\r\n\t\t\t<tr><td colspan=\"2\"><div displaytitle=\"Interests:\" dojoType=\"prcommon.interests.Interests\"  restrict=\"0\" dojoAttachPoint=\"interests\" size=\"6\" name=\"interests\" startopen=\"true\" selectonly=\"true\" nofilter=\"true\" keytypeid=\"1\" interesttypeid=\"1\" ></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\">Profile</td><td><div class=\"dialogprofileframe\" ><textarea dojoAttachPoint=\"profile\" name=\"profile\" class=\"dijitTextarea\" dojoType=\"dijit.form.Textarea\"  style=\"width:99%;height:99%\" ></textarea></div></td></tr>\r\n\t\t\t<tr><td ><button type=\"button\" dojoType=\"dijit.form.Button\" label=\"Close\" dojoAttachEvent=\"onClick:_Close\"></button></td>\r\n\t\t\t\t\t<td colspan=\"3\" align=\"right\"><button disabled=\"disabled\" dojoAttachEvent=\"onClick:_Submit\" dojoAttachPoint=\"saveNode\" dojoType=\"dojox.form.BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this._SavedCall=dojo.hitch(this,this._Saved);this._LoadCall=dojo.hitch(this,this._Load);this._jobroles=new dojox.data.JsonRestStore({target:"/roles/job_roles_select",idAttribute:"prmaxroleid"});},_Saved:function(_1){if(_1.success=="OK"){if(this.employeeidNode.get("value")==-1){this.employeeidNode.set("value",_1.employee.employeeid);dojo.publish(PRCOMMON.Events.Employee_Add,[_1.employee]);if(_1.session){dojo.publish(PRCOMMON.Events.SearchSession_Added,[_1.session,_1.count]);}alert("Contact added");this._Close();}else{dojo.publish(PRCOMMON.Events.Employee_Updated,[_1.employee,_1.searchsessionid]);alert("Employee updated");this._Close();}}else{alert("Problem");}this.saveNode.cancel();},postCreate:function(){dojo.connect(this.formNode,"onSubmit",dojo.hitch(this,this._Save));this.inherited(arguments);},startup:function(){if(this.startuploaded==0){this.startuploaded=1;this.outletidNode.set("value",this.outletid);this.employeeidNode.set("value",this.employeeid);if(this.employeeid!=-1){this.Load();}else{this.saveNode.set("disabled",false);this.interests.clear_private();}}this.inherited(arguments);},Load:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadCall,url:"/employees/getedit",content:{employeeid:this.employeeid}}));},_Load:function(_2){this.employeeidNode.set("value",_2.data.employee.employeeid);this.job_title.set("value",_2.data.employee.job_title);this.email.set("value",_2.data.comm.email);this.tel.set("value",_2.data.comm.tel);this.fax.set("value",_2.data.comm.fax);this.mobile.set("value",_2.data.comm.mobile);this.twitter.set("value",_2.data.comm.twitter);this.facebook.set("value",_2.data.comm.facebook);this.linkedin.set("value",_2.data.comm.linkedin);this.instagram.set("value",_2.data.comm.instagram);this.interests.set("value",_2.data.interests);this.profile.set("value",_2.data.employee.profile);this.prefix.set("value",_2.data.contact.prefix);this.firstname.set("value",_2.data.contact.firstname);this.familyname.set("value",_2.data.contact.familyname);this.saveNode.set("disabled",false);this.job_title.focus();},_Submit:function(){this.formNode.submit();},_Save:function(_3){if(ttl.utilities.formValidator(this.formNode)==false){alert("Not all required field filled in");this.saveNode.cancel();return;}var _4=this.formNode.get("value");if(this.addsession){_4["addsession"]=1;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SavedCall,url:"/employees/addnew",content:_4}));},Clear:function(){this.employeeidNode.set("value",-1);this.prefix.set("value","");this.firstname.set("value","");this.familyname.set("value","");this.job_title.set("value","");this.email.set("value","");this.tel.set("value","");this.fax.set("value","");this.mobile.set("value","");this.interests.set("value","");this.profile.set("value","");this.prefix.set("value","");this.firstname.set("value","");this.familyname.set("value","");this.linkedin.set("value","");this.twitter.set("value","");this.facebook.set("value","");this.instagram.set("value","");},_Close:function(){PRMAX.search.largeDialog.hide();}});}