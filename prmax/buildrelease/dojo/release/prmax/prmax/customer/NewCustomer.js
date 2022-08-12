/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.customer.NewCustomer"]){dojo._hasResource["prmax.customer.NewCustomer"]=true;dojo.provide("prmax.customer.NewCustomer");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.require("dijit.form.Form");dojo.require("dijit.TitlePane");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.CheckBox");dojo.require("dojox.validate.regexp");dojo.require("dojox.form.BusyButton");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("ttl.utilities");dojo.require("dojox.form.PasswordValidator");dojo.require("ttl.BaseWidget");dojo.declare("prmax.customer.NewCustomer",[ttl.BaseWidget],{widgetsInTemplate:true,customersourceid:5,professional_only:false,defaultcost:"Please ring for price",templateString:"<div>\r\n\t<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" onsubmit=\"return false\" dojoType=\"dijit.form.Form\">\r\n\t<input name=\"nbrofloginsid\" dojoAttachPoint=\"nbroflogins\" type=\"hidden\" value=\"1\" dojoType=\"dijit.form.TextBox\" >\r\n\t<input name=\"customersourceid\" dojoAttachPoint=\"field_customersourceid\" type=\"hidden\" value=\"5\" dojoType=\"dijit.form.TextBox\" >\r\n\t<input name=\"isprofessional\" dojoAttachPoint=\"field_isprofessional\" type=\"hidden\" value=\"0\" dojoType=\"dijit.form.TextBox\" >\r\n\r\n\t\t<table class=\"prmaxtable\" width=\"800px\"  border=\"0\" style=\"margin-left:100px\">\r\n\t\t\t<tr><td class=\"prmaxrowdisplaylarge\" align=\"center\" colspan=\"2\">Account Details</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Title</td><td><input class=\"prmaxinput\" name=\"contact_title\" dojoAttachPoint=\"contact_title\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 2em;\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >First Name</td><td><input class=\"prmaxrequired\" name=\"contact_firstname\" dojoAttachPoint=\"contact_firstname\" type=\"text\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width: 8em;\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Surname</td><td><input class=\"prmaxrequired\" name=\"contact_surname\" dojoAttachPoint=\"contact_surname\" type=\"text\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width: 12em;\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Job Title</td><td width=\"70%\"><input class=\"prmaxinput\" dojoAttachPoint=\"contactjobtitle\" name=\"contactjobtitle\" type=\"text\" trim=\"true\" maxlength=\"80\"  dojoType=\"dijit.form.TextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Business Name</td><td width=\"70%\"><input class=\"prmaxrequired\" dojoAttachPoint=\"customername\" name=\"customername\" type=\"text\" trim=\"true\" required=\"true\" maxlength=\"80\" invalidMessage=\"Please Enter the name of the business\" dojoType=\"dijit.form.ValidationTextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Email:</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"email\" name=\"email\" type=\"text\" size=\"40\" maxlength=\"80\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" lowercase=\"true\" regExpGen=\"dojox.validate.regexp.emailAddress\" trim=\"true\" invalidMessage=\"invalid email address\" size=\"40\" maxlength=\"70\"/></td></tr>\r\n\t\t\t<tr ><td colspan=\"2\">\r\n\t\t\t\t<div dojoType=\"dojox.form.PasswordValidator\" name=\"password\" class=\"prmaxrowtag\" dojoAttachPoint=\"password\">\r\n\t\t\t\t\t<table class=\"prmaxtable\" width=\"100%\" >\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"30%\">Password:</td><td><input class=\"prmaxrequired\" type=\"password\" pwType=\"new\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Verify:</td><td><input class=\"prmaxrequired\" type=\"password\" pwType=\"verify\" /></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Address:</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"address1\" name=\"address1\" type=\"text\" size=\"40\" required=\"true\" invalidMessage=\"Please Enter first line of address\" dojoType=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Address 2:</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"address2\" name=\"address2\" type=\"text\" size=\"40\" maxlength=\"80\" dojoType=\"dijit.form.TextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Town</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"townname\" name=\"townname\" type=\"text\" size=\"30\" dojoType=\"dijit.form.TextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >County</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"county\" name=\"county\" type=\"text\" dojoType=\"dijit.form.TextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Postcode:</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"postcode\" name=\"postcode\" type=\"text\" style=\"width:10em\" maxlength=\"10\" required =\"true\" invalidMessage=\"Please Enter a post code \" dojoType=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Country</td><td>\r\n\t\t\t<select class=\"prmaxinput\" name=\"countryid\" dojoAttachPoint=\"countryid\" style=\"width:15em\" dojoAttachEvent=\"onChange:_ShowVat\" dojoType=\"dijit.form.FilteringSelect\" autoComplete=\"true\"></select>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr class=\"prmaxhidden\" dojoAttachPoint=\"vatnumber_view\"><td align=\"right\" class=\"prmaxrowtag\" >Vat No</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"vatnumber\" trim=\"true\" name=\"vatnumber\" type=\"text\" size=\"25\" maxlength=\"40\" dojoType=\"dijit.form.TextBox\" /></td></tr>\r\n\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Tel:</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"tel\" name=\"tel\" type=\"text\" size=\"25\" maxlength=\"40\" required =\"true\" invalidMessage=\"Please enter a contact telephone number\" dojoType=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"term_row_view\"><td align=\"right\" class=\"prmaxrowtag\" >Term</td><td><select class=\"prmaxinput\" name=\"termid\" dojoAttachPoint=\"term\" style=\"width:9em\" dojoAttachEvent=\"onChange:_TermChanged\" dojoType=\"dijit.form.FilteringSelect\" autoComplete=\"true\"></select></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"features_row_view\"><td align=\"right\" class=\"prmaxrowtag\" >Features</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"advancefeatures\" dojoType=\"dijit.form.CheckBox\" name=\"advancefeatures\" value=\"1\" dojoAttachEvent=\"onChange:_ModuleChanged\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Cost (excluding VAT)</td><td><input class=\"prmaxinput\" dojoAttachPoint=\"cost\" dojoType=\"dijit.form.TextBox\" value=\"${defaultcost}\" readonly=\"readonly\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\" align=\"left\"><label dojoAttachPoint=\"tclabel\">I Agree to the Terms and Conditions</label>&nbsp;<input class=\"prmaxinput\" dojoAttachPoint=\"tcaccept\" dojoType=\"dijit.form.CheckBox\" name=\"tcaccept\"/>&nbsp;&nbsp;<a href=\"/static/rel/html/tc.pdf\" target=\"_newtab\">View  Terms and Conditions<a/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button style=\"float:right\" dojoAttachPoint=\"saveNode\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Creating...\" dojoAttachEvent=\"onClick:_CustomerSave\" label=\"Create Account\" class=\"prmaxbutton\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n\r\n",constructor:function(){this._SavedCallBack=dojo.hitch(this,this._Saved);this._CostCallBack=dojo.hitch(this,this._ShowCost);this._getModelItemCall=dojo.hitch(this,this._getModelItem);this._payment=false;this._vatrequired=false;this.termmodel=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=terms"});this.termmodel.fetch();this.countries=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=countries"});this.countries.fetch();},postCreate:function(){this.nbroflogins.set("value",1);this.term.store=this.termmodel;this.term.set("value",4);this.countryid.store=this.countries;this.countryid.set("value",1);this.field_customersourceid.set("value",this.customersourceid);if(this.professional_only==true){dojo.addClass(this.term_row_view,"prmaxhidden");dojo.addClass(this.features_row_view,"prmaxhidden");}dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._onCustomerSubmit));this.inherited(arguments);},startup:function(){this.contact_title.focus();this.inherited(arguments);},_Saved:function(_1){if(_1.success=="OK"){dijit.byId("customer_control_pane").set("href",_1.page);return;}if(_1.success=="DU"){alert(_1.message);}this.saveNode.cancel();},_CustomerSave:function(){this.form.submit();},_onCustomerSubmit:function(){try{if(this.tcaccept.get("checked")==false){alert("T & C not accepted, Please accept before continuing");this.saveNode.cancel();return;}if(this._payment==false){alert("Cost for required options unknown Please ring");this.saveNode.cancel();return;}if(this.password._inputWidgets[1].get("value").length<6){alert("Password not long enough miminum length is 6 characters");this.saveNode.cancel();this.password.focus();return;}if(ttl.utilities.formValidator(this.form)==false){alert("Not all required fields filled in");this.saveNode.cancel();return;}if(this._vatrequired==true&&this.vatnumber.get("value").length==0){alert("Vat number required");this.saveNode.cancel();this.vatnumber.focus();return;}var _2=this.form.get("value");_2["password"]=this.password.value;dojo.xhrPost(ttl.utilities.makeParams({load:this._SavedCallBack,url:"/eadmin/new",content:_2}));}catch(e){alert(e);}},_LoginChanged:function(){this._GetCost();},_TermChanged:function(){this._GetCost();},_ModuleChanged:function(){this._GetCost();},_ShowCost:function(_3){if(_3.success=="OK"){if(_3.data[1].length>0){this.cost.set("value",_3.data[1]);this._payment=false;}else{this._payment=true;this.cost.set("value","£"+ttl.utilities.round_decimals(_3.data[0]/100,2)+" excluding vat");}}},_GetCost:function(){var _4={termid:this.term.get("value"),nbrofloginsid:this.nbroflogins.get("value"),isprofessional:0};if(this.professional_only==true){_4["isprofessional"]=1;}if(this.advancefeatures.get("checked")){_4["advancefeatures"]=1;}dojo.xhrPost(ttl.utilities.makeParams({load:this._CostCallBack,url:"/eadmin/cost",content:_4}));},_getModelItem:function(){if(arguments[0].vatnbrequired[0]==true){this._vatrequired=true;dojo.removeClass(this.vatnumber_view,"prmaxhidden");this.vatnumber.focus();}else{dojo.addClass(this.vatnumber_view,"prmaxhidden");this._vatrequired=false;}},_ShowVat:function(){this.countries.fetchItemByIdentity({identity:this.countryid.get("value"),onItem:this._getModelItemCall});}});}