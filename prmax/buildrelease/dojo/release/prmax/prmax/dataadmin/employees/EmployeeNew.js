/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.dataadmin.employees.EmployeeNew"]){dojo._hasResource["prmax.dataadmin.employees.EmployeeNew"]=true;dojo.provide("prmax.dataadmin.employees.EmployeeNew");dojo.declare("prmax.dataadmin.employees.EmployeeNew",[dijit._Widget,dijit._Templated,dijit._Container],{displayname:"New Person",widgetsInTemplate:true,templateString:"<div style=\"border: 1px solid black\">\r\n<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" dojoType=\"dijit.form.Form\" onsubmit=\"return false\">\r\n\t<table cellspacing =\"0\" cellpadding=\"0\" width=\"100%\">\r\n\t\t<tr><td class=\"prmaxrowtag\">${displayname}</td><td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Prefix</td><td ><input class=\"prmaxinput\" name=\"prefix\" dojoAttachPoint=\"prefix\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 2em;\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">First Name</td><td ><input class=\"prmaxinput\" name=\"firstname\" dojoAttachPoint=\"firstname\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 5em;\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Surname</td><td><input class=\"prmaxrequired\" name=\"familyname\" dojoAttachPoint=\"familyname\" type=\"text\"  trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width: 12em;\"></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Reason Code</td><td ><select dojoAttachPoint=\"reasoncodeid\" name=\"reasoncodeid\" dojotype =\"dijit.form.FilteringSelect\" searchAttr=\"name\" labelType=\"html\" style=\"width:98%\" class=\"prmaxrequired\"  /></td></tr>\r\n\t\t<tr><td  align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Description</td><td ><div class=\"reasonframe\" ><textarea dojoAttachPoint=\"reason\" name=\"reason\" required=\"true\" dojoType=\"dijit.form.Textarea\" style=\"width:99%;height:80%\" ></textarea></div></td></tr>\r\n\t\t<tr><td colspan=\"2\" align=\"right\" valign=\"bottom\" ><button dojoAttachEvent=\"onClick:_AddContact\" dojoAttachPoint=\"addContactNode\" type=\"button\" dojoType=\"dijit.form.Button\" label=\"Add\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n",constructor:function(){this._AddCallBack=dojo.hitch(this,this._AddCall);this._parentcallback=null;},postCreate:function(){this.reasoncodeid.store=PRCOMMON.utils.stores.Research_Reason_Add_Codes();this.reasoncodeid.set("value",PRCOMMON.utils.stores.Reason_Add_Default);this.inherited(arguments);},_AddContact:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Not all required field filled in");return;}if(confirm("Add Contact?")){dojo.xhrPost(ttl.utilities.makeParams({load:this._AddCallBack,url:"/contacts/research_addnew",content:this.form.get("value")}));}},_AddCall:function(_1){if(_1.success=="OK"){alert("Contact Added");if(this._parentcallback){this._parentcallback(_1.contact);}dojo.publish(PRCOMMON.Events.Person_Added,[_1.contact]);this._ClearAddForm();dojo.publish(PRCOMMON.Events.Dialog_Close,["cont_add"]);}else{alert("Failed");}},_ClearAddForm:function(){this.prefix.set("value","");this.firstname.set("value","");this.familyname.set("value","");this.reasoncodeid.set("value",PRCOMMON.utils.stores.Reason_Add_Default);this.reason.set("value","");},_setCallbackAttr:function(_2){this._parentcallback=_2;},focus:function(){this.familyname.focus();},Disabled:function(_3){this.prefix.set("disabled",_3);this.firstname.set("disabled",_3);this.familyname.set("disabled",_3);this.reasoncodeid.set("disabled",_3);this.reason.set("disabled",_3);}});}