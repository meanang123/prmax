/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.customer.RequestDemo"]){dojo._hasResource["prmax.customer.RequestDemo"]=true;dojo.provide("prmax.customer.RequestDemo");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.require("dijit.form.Form");dojo.require("dijit.TitlePane");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.CheckBox");dojo.require("dojox.validate.regexp");dojo.require("dojox.form.BusyButton");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("ttl.utilities");dojo.declare("prmax.customer.RequestDemo",[dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,customertypeid:20,customersourceid:5,templateString:"<div class=\"requestdemo\">\r\n\t<div class=\"infozone\">\r\n\t<p>Register here for your free trial of PRmax. There's no cost and no obligation.</p>\r\n\t<p>With our software you will benefit from full search and list-building functionality, access to the entire UK media and expert technical support.</p>\r\n\t<p>We always welcome your detailed feedback.</p>\r\n\t<p>So, start searching the media and creating target lists now - it's FREE!</p>\r\n\t<br/>\r\n\t<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" dojoType=\"dijit.form.Form\" method=\"post\" action=\"/eadmin/demorequestsubmitted\" dojoAttachEvent=\"onSubmit:_do_submit\">\r\n\t\t<input name=\"customertypeid\" dojoAttachPoint=\"field_customertypeid\" type=\"hidden\" dojoType=\"dijit.form.TextBox\" value=\"20\" >\r\n\t\t<input name=\"customersourceid\" dojoAttachPoint=\"field_customersourceid\" type=\"hidden\" dojoType=\"dijit.form.TextBox\" value=\"5\" >\r\n\t\t<table class=\"prmaxtable\" width=\"100%\" border=\"0\" style=\"maring:right\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" width=\"200px\">Contact Title</td><td><input class=\"prmaxinput\" name=\"contact_title\" dojoAttachPoint=\"contact_title\" type=\"text\" trim=\"true\" dojoType=\"dijit.form.TextBox\" style=\"width: 2em;\" ></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Contact First Name</td><td><input class=\"prmaxrequired\" name=\"contact_firstname\" dojoAttachPoint=\"contact_firstname\" type=\"text\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width: 8em;\" ></input><td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Contact Surname</td><td><input class=\"prmaxrequired\" name=\"contact_surname\" dojoAttachPoint=\"contact_surname\" type=\"text\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width: 12em;\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Job Title</td><td width=\"70%\"><input class=\"prmaxinput\" dojoAttachPoint=\"contactjobtitle\" name=\"job_title\" type=\"text\" trim=\"true\" maxlength=\"80\"  dojoType=\"dijit.form.TextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Business Name</td><td width=\"70%\"><input class=\"prmaxrequired\" dojoAttachPoint=\"customername\" name=\"customername\" type=\"text\" trim=\"true\" required=\"true\" maxlength=\"80\" invalidMessage=\"Please Enter the name of the business\" dojoType=\"dijit.form.ValidationTextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Email:</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"email\" name=\"email\" type=\"text\" maxlength=\"80\" trim=\"true\" required=\"true\" dojoType=\"dijit.form.ValidationTextBox\" lowercase=\"true\" regExpGen=\"dojox.validate.regexp.emailAddress\" trim=\"true\" invalidMessage=\"invalid email address\" size=\"40\" maxlength=\"70\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Tel:</td><td><input class=\"prmaxrequired\" dojoAttachPoint=\"tel\" name=\"telephone\" type=\"text\" maxlength=\"40\" dojoType=\"dijit.form.ValidationTextBox\" required =\"true\" invalidMessage=\"Please Enter a telephone number\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\" align=\"left\"><label dojoAttachPoint=\"tclabel\">I Agree to the Terms and Conditions</label>&nbsp;<input class=\"prmaxinput\" dojoAttachPoint=\"tcaccept\" dojoType=\"dijit.form.CheckBox\" name=\"tcaccept\"/>&nbsp;&nbsp;<a href=\"/static/rel/html/tc.pdf\" target=\"_newtab\">View  Terms and Conditions<a/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button style=\"float:right\" type=\"button\" dojoAttachEvent=\"onClick:_CustomerSave\" dojoAttachPoint=\"saveNode\" dojoType=\"dijit.form.Button\" label=\"Request Trial\" class=\"prmaxbutton\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t</div>\r\n</div>\r\n\r\n\r\n",constructor:function(){},postCreate:function(){this.field_customertypeid.set("value",this.customertypeid);this.field_customersourceid.set("value",this.customersourceid);this.inherited(arguments);},startup:function(){this.contact_title.focus();this.inherited(arguments);},_CustomerSave:function(){if(this.tcaccept.get("checked")==false){alert("T & C not accepted, Please accept before continuing");return false;}if(ttl.utilities.formValidator(this.form)==false){alert("Not all required field filled in");return false;}this.form.domNode.submit();},_do_submit:function(){return true;}});}