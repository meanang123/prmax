/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.dataadmin.employees.PersonDelete"]){dojo._hasResource["prmax.dataadmin.employees.PersonDelete"]=true;dojo.provide("prmax.dataadmin.employees.PersonDelete");dojo.declare("prmax.dataadmin.employees.PersonDelete",[prcommon.search.std_search,dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,templateString:"<div style=\"width:400px\" >\r\n\t<form  class=\"prmaxdefault\" dojoAttachPoint=\"form\" dojoType=\"dijit.form.Form\" onsubmit=\"return false;\">\r\n\t\t<input dojoAttachPoint=\"contactid\" name=\"contactid\" type=\"hidden\" dojoType=\"dijit.form.TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" dojoAttachPoint=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" dojoAttachPoint=\"header\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td >\r\n\t\t\t<select dojoAttachPoint=\"reasoncodes\" name=\"reasoncodeid\" dojotype =\"dijit.form.FilteringSelect\" searchAttr=\"name\" labelType=\"html\" style=\"width:98%\" class=\"prmaxrequired\"/>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td  align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td  ><div class=\"reasonframe\" ><textarea dojoAttachPoint=\"reason\" name=\"reason\" class=\"prmaxrowtag\" required=\"true\" dojoType=\"dijit.form.Textarea\" style=\"width:99%;height:80%;\"></textarea></div></td></tr>\r\n\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"2\" align=\"right\"><button dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Delete Person...\"  dojoAttachPoint=\"deleteBtn\" dojoAttachEvent=\"onClick:_DeleteSubmit\" label=\"Delete Person\" type=\"button\" ></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this._DeletedContactCallBack=dojo.hitch(this,this._DeletedContactCall);},postCreate:function(){this.reasoncodes.store=PRCOMMON.utils.stores.Research_Reason_Del_Codes();this.inherited(arguments);},_DeleteSubmit:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Not all required fields filled in");this.deleteBtn.cancel();return;}if(this.reason.get("value").length==0){alert("No Description Given");this.reason.focus();return;}if(confirm("Delete "+dojo.attr(this.heading,"innerHTML")+" ?")){dojo.xhrPost(ttl.utilities.makeParams({load:this._DeletedContactCallBack,url:"/contacts/research_person_delete",content:this.form.get("value")}));}},_DeletedContactCall:function(_1){if(_1.success=="OK"){dojo.publish(PRCOMMON.Events.Person_Delete,[_1.contact]);alert("Person Deleted");this.Clear();dojo.publish(PRCOMMON.Events.Dialog_Close,["per_del"]);}else{alert("Problem Deleteing Person");this.deleteBtn.cancel();}},Clear:function(){this.contactid.set("value",-1);this.reasoncodes.set("value",null);this.reason.set("value","");this.deleteBtn.cancel();},Load:function(_2,_3){this.contactid.set("value",_2);dojo.attr(this.heading,"innerHTML",_3);this.reasoncodes.set("value",null);this.reason.set("value","");this.reason.focus();},focus:function(){this.reason.focus();}});}