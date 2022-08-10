/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.customer.PaymentCollectDetails"]){dojo._hasResource["prmax.customer.PaymentCollectDetails"]=true;dojo.provide("prmax.customer.PaymentCollectDetails");dojo.require("dijit.form.Form");dojo.require("dijit.TitlePane");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.CheckBox");dojo.require("dojox.validate.regexp");dojo.require("dojox.form.BusyButton");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("ttl.BaseWidget");dojo.require("ttl.utilities");dojo.declare("prmax.customer.PaymentCollectDetails",[ttl.BaseWidget],{widgetsInTemplate:true,isprofessional_only:false,termid:-1,cost:1000,companyname:"",advancefeatures:false,templateString:"<div>\r\n\t<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" onSubmit=\"return false;\" dojoType=\"dijit.form.Form\">\r\n\t\t<input class=\"prmaxinput\" dojoAttachPoint=\"nbrofloginsid\" name=\"nbrofloginsid\" type=\"hidden\" dojoType=\"dijit.form.TextBox\"  value=\"1\"/>\r\n\t\t<input class=\"prmaxinput\" dojoAttachPoint=\"isprofessional_field\" name=\"isprofessional\" type=\"hidden\" dojoType=\"dijit.form.TextBox\"  value=\"0\"/>\r\n\t\t<table width=\"100%\" border=\"0\" cellspacing = \"1\" >\r\n\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\" align=\"center\" class=\"prmaxrowdisplaylarge\">Please Confirm Payment Details</td></tr>\r\n\t\t\t<tr><td colspan=\"3\"><hr/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Company Name</td><td width=\"70%\">${companyname}</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Card Holder Surname</td><td  ><input dojoAttachPoint=\"card_surname\" class=\"prmaxrequired\" name=\"surname\" type=\"text\" style=\"width:20em\" maxlength=\"40\" required =\"true\" invalidMessage=\"Please Enter Card Holders Surname\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Card Holder First Name</td><td  ><input class=\"prmaxrequired\" name=\"firstname\" type=\"text\" style=\"width:20em\" maxlength=\"40\" required =\"true\" invalidMessage=\"Please Enter Card Holders First Name\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowdisplaylarge\" colspan=\"2\" align=\"left\">Card Holder's Address</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Address 1 </td><td><input class=\"prmaxrequired\" name=\"address1\" type=\"text\" required=\"true\" invalidMessage=\"Please Enter first line of address\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width:25em\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Address 2 </td><td ><input class=\"prmaxinput\" name=\"address2\" type=\"text\" size=\"40\" maxlength=\"80\" dojoType=\"dijit.form.TextBox\"  style=\"width:25em\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Town</td><td  ><input class=\"prmaxrequired\" name=\"townname\" type=\"text\" size=\"30\" required=\"true\" invalidMessage=\"Please Enter postal Town\" dojoType=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Post Code</td><td  ><input class=\"prmaxrequired\" name=\"postcode\" type=\"text\" style=\"width:10em\" maxlength=\"10\" required =\"true\" invalidMessage=\"Please Enter a post code \" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" >Confirmation Email:</td><td><input class=\"prmaxrequired\" name=\"email\" type=\"text\"  trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" lowercase=\"true\" regExpGen=\"dojox.validate.regexp.emailAddress\" trim=\"true\" invalidMessage=\"invalid email address\" size=\"40\" maxlength=\"80\"/></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"advancefeatures_row_view\"><td class=\"prmaxrowtag\" >Advance Features</td><td  ><input dojoAttachPoint=\"advancefeatures_view\" name=\"advancefeatures\" type=\"checkbox\" dojoType=\"dijit.form.CheckBox\" dojoAttachEvent=\"onChange:_ChangeCost\"/></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"term_view\"><td class=\"prmaxrowtag\">Term</td><td><select dojoAttachPoint=\"payment_start_termid\" class=\"prmaxinput\" name=\"termid\" style=\"width:9em\" dojoType=\"dijit.form.FilteringSelect\" autoComplete=\"true\" searchAttr=\"name\" labelType=\"html\" dojoAttachEvent=\"onChange:_ChangeCost\"></select></td><td></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" >Cost (including Vat)</td><td><input dojoAttachPoint =\"payment_cost\" class=\"prmaxinput\" dojoType=\"dijit.form.TextBox\" readonly=\"readonly\" value=\"£\" /></td></tr>\r\n\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\" align=\"right\"><input class=\"prmaxrowdisplaylarge\" type=\"button\" dojoAttachEvent=\"onClick:_Proceed\" name=\"Proceed\" dojoType=\"dijit.form.Button\" label=\"Continue\" value=\"Proceed\"/></td></tr>\r\n\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<table width=\"100%\" border=\"0\">\r\n\t\t<tr><td  width=\"70%\">&nbsp;</td><td align=\"right\"><input class=\"prmaxbutton\" type=\"button\" dojoAttachEvent=\"onClick:_ProForma\" name=\"proforma\" dojoType=\"dijit.form.Button\" label=\"Send Proforma\" value=\"proforma\"/></td></tr>\r\n\t</table>\r\n</div>\r\n",constructor:function(){this.terms=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=terms"});this._ProformaCallBack=dojo.hitch(this,this._ProformaCall);this._CostCallback=dojo.hitch(this,this._CostCall);},postCreate:function(){this.payment_start_termid.store=this.terms;this.payment_start_termid.set("value",this.termid);this.payment_cost.set("value","£"+this.cost);this.advancefeatures_view.set("checked",this.advancefeatures);if(this.isprofessional_only==true){this.isprofessional_field.set("value",1);dojo.addClass(this.advancefeatures_row_view,"prmaxhidden");dojo.addClass(this.term_view,"prmaxhidden");}this.inherited(arguments);},_CostCall:function(_1){if(_1.success=="OK"){this.payment_cost.set("value","£"+ttl.utilities.round_decimals(_1.data[2]/100,2));}},_ChangeCost:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._CostCallback,url:"/eadmin/cost_modules",content:this.form.get("value")}));},focus:function(){this.card_surname();},_Proceed:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Not all required field filled in");return;}var _2=this.form.get("value");data=dojo.formToQuery(this.form.id);dijit.byId("payment_restart_pane").set("href","/eadmin/payment_confirmation?"+data);},_ProformaCall:function(_3){if(_3.success=="OK"){alert("Pro Forma Invoice Generate and Sent");window.loc="";}else{alert("Problem generating Pro forma ");}},_ProForma:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._ProformaCallBack,url:"/eadmin/proforma",content:this.form.get("value")}));}});}