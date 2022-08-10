require({cache:{
'url:prcommon2/clippings/templates/add_server.html':"<div>\r\n    <form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n        <input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"customerid\" data-dojo-props='\"class\":\"prmaxhidden\", name:\"customerid\",type:\"text\"'/>\r\n        <table width=\"100%\" class=\"prmaxtable\">\r\n            <tr><td align=\"right\"  width=\"30%\" class=\"prmaxrowtag\">From:</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"fromemailaddress\" data-dojo-props='pattern:dojox.validate.regexp.emailAddress,required:true,name:\"fromemailaddress\",type:\"text\",style:\"width:24em\",placeHolder:\"Email address of Sender\"'></td></tr>\r\n            <tr><td align=\"right\" width=\"30%\" class=\"prmaxrowtag\">Server Type:</td><td><select data-dojo-props='name:\"servertypeid\",autoComplete:true,labelType:\"html\",style:\"width:10em\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"servertypeid\" data-dojo-attach-event=\"onChange:_server_type\"></select></td></tr>\r\n            <tr><td align=\"right\" width=\"30%\" class=\"prmaxrowtag\">Username:</td><td><input data-dojo-props='\"class\":\"prmaxinput\",trim:true,name:\"username\",type:\"text\",required:true,placeHolder:\"Email server login name\"' data-dojo-attach-point=\"username\" data-dojo-type=\"dijit.form.ValidationTextBox\" ></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"url_view\" class=\"prmaxhidden\"><td align=\"right\" width=\"30%\" class=\"prmaxrowtag\">Host:</td><td><input data-dojo-props='\"class\":\"prmaxinput\",pattern:dojox.validate.regexp.url,trim:true,name:\"host\",type:\"text\",required:false' data-dojo-attach-point=\"host\" data-dojo-type=\"dijit.form.ValidationTextBox\" ></td></tr>\r\n            <tr>\r\n\t\t\t\t<td colspan=\"2\">\r\n\t\t\t\t\t<div data-dojo-type=\"dojox.form.PasswordValidator\" name=\"password\" class=\"prmaxrowtag\" data-dojo-attach-point=\"password\">\r\n\t\t\t\t\t\t<table class=\"prmaxtable\" width=\"100%\" >\r\n                        \t<tr><td align=\"right\" width=\"31%\" class=\"prmaxrowtag\">Password:</td><td><input class=\"prmaxrequired\" type=\"password\" pwType=\"new\" /></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" width=\"31%\" class=\"prmaxrowtag\" >Verify:</td><td><input class=\"prmaxrequired\" type=\"password\" pwType=\"verify\" /></td></tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td><br/></td></tr>\r\n            <tr>\r\n\t\t\t\t<td class=\"prmaxrowtag\" align=\"left\"><button data-dojo-attach-event=\"onClick:_send_test\" data-dojo-attach-point=\"sendtestbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait...\",label:\"Send Test Email\"'></button></td>\r\n            \t<td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button></td>\r\n            </tr>\r\n        </table>\r\n    </form>\r\n</div>\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:
// Purpose:
// Created: Sept 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/add_server", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/add_server.html",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dojox/form/PasswordValidator"
	],
	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore,ContentPane){

 return declare("prcommon2.clippings.add_server",
	[BaseWidgetAMD,ContentPane],{
	templateString:template,
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this,this._save_call);
		this._send_test_call_back = dojo.hitch(this,this._send_test_call);

		this._servertypes = new ItemFileReadStore({ url:"/common/lookups?searchtype=servertypes"});
		this._customerid = PRMAX.utils.settings.cid;
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.servertypeid.set("store",this._servertypes);
	},
	load:function ( dialog, customerid)
	{
		this._dialog = dialog;
		this.customerid.set("value", customerid);
	},
	_save:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		var data = this.form.get("value");

		request.post("/customeremailserver/add",
				utilities2.make_params({ data : data})).
				then(this._save_call_back);
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Email Server Added");
			this.savebtn.cancel();
			this._dialog.hide();
			topic.publish('customeremailserver/add', [response.data]);
		}
		else
		{
			alert("Problem Adding Email Server");
		}
		this.savebtn.cancel();
	},
	_send_test:function()
	{

		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.sendtestbtn.cancel();
			return false;
		}

		var data = {};
		data['customerid'] = this._customerid;
		data['fromemailaddress'] = this.fromemailaddress.get("value");
		data['host'] = this.servertypeid.get("value");
//		data['hostname'] = this.servertypeid.get("name");
		data['username'] = this.username.get("value");
		data['password'] = this.password.get("value");
		data['hostname'] = this.host.get("value");

		request.post("/emails/email_test_server",
				utilities2.make_params({ data : data})).
				then(this._send_test_call_back);

	},
	_send_test_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Test email has been sent");
			this.sendtestbtn.cancel();
		}
		else
		{
			alert("Problem Sending Test Email");
		}
		this.sendtestbtn.cancel();
	},
	_server_type:function()
	{
		this._change_view();
	},
	_change_view:function()
	{
		var sid = parseInt(this.servertypeid.get("value"));

		if (sid == 6)
		{
			domclass.remove(this.url_view,"prmaxhidden");
			this.host.set("required",true);
		}
		else
		{
			domclass.add(this.url_view,"prmaxhidden");
			this.host.set("required",false);
		}
	}
});
});
