require({cache:{
'url:research/questionnaires/templates/SendSingle.html':"<div>\r\n\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" onsubmit=\"return false;\">\r\n\t<input data-dojo-attach-point=\"objecttypeid\" data-dojo-props='name:\"objecttypeid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\">\r\n\t<input data-dojo-attach-point=\"objectid\" data-dojo-props='name:\"objectid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\">\r\n\t\t<table width=\"700px\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">To Name</td><td>\r\n\t\t\t<input data-dojo-attach-point=\"toname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"toname\",type:\"text\",style:\"width:15em\",required:true'></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">To Email</td><td><input data-dojo-attach-point=\"toemail\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"toemail\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:20,style:\"width:90%\",required:true'></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Subject</td><td><input data-dojo-attach-point=\"subject\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"subject\",type:\"text\",trim:true,style:\"width:90%\",required:true'></td></tr>\r\n\t\t\t<tr><td align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Body</td><td><div class=\"stdframe\" style=\"height:200px;overflow:hidden\"><textarea data-dojo-attach-point=\"body\"  data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"body\",style:\"height:300px\"'></textarea></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Reason</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:15em\",\"class\":\"prmaxrequired\"' /></td></tr>\r\n\t\t\t<tr><td align=\"left\"><button data-dojo-attach-event=\"onClick:_close\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"'></button></td>\r\n\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"sendemail\" data-dojo-attach-event=\"onClick:_send\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busyLabel:\"Please Wait Sending...\",type:\"button\",label:\"Send Email\"'></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.questionnaires.SendSingle.js
// Author:  Chris Hoy
// Purpose:
// Created: 29/03/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/questionnaires/SendSingle", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/SendSingle.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr ,domclass){
 return declare("research.questionnaires.SendSingle",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._send_call_back = dojo.hitch(this, this._send_call );
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	_send:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		request.post('/research/admin/send_questionnaire',
			utilities2.make_params({data:this.form.get("value")})).then
			( this._send_call_back);
	},
	_send_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Questionnaire Sent");
			this._dialog.hide();
		}
		else
		{

			alert("Problem Sending Questionnaire");
			this.sendemail.cancel();
		}
	},
	_close:function()
	{
		this._dialog.hide();
	},
	load:function( objectid , objecttypeid, emailaddress, name, dialog )
	{
		this._clear();
		this.objecttypeid.set("value",objecttypeid);
		this.objectid.set("value",objectid);
		this.toemail.set("value",emailaddress);
		this.toname.set("value", name);
		this._dialog = dialog;
		this._dialog.show();
	},
	_clear:function()
	{
		this.sendemail.cancel();
		this.objecttypeid.set("value",-1);
		this.objectid.set("value",-1);
		this.toname.set("value","");
		this.toemail.set("value","");
		this.subject.set("value","");
		this.body.set("value","");
	}
});
});





