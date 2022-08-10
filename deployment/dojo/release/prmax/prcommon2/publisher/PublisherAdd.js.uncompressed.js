require({cache:{
'url:prcommon2/publisher/templates/PublisherAdd.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"publisherid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"publisherid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\" width=\"400px\">\r\n\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Publisher</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"publishername\",type:\"text\",trim:true,required:true,style:\"width:90%\",placeHolder:\"Publisher Name\"'  data-dojo-attach-point=\"publishername\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td><td colspan=\"2\"><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"www\",type:\"text\",maxlength:\"120\",pattern:dojox.validate.regexp.url,style:\"width:90%\"' /></td></tr>\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td width=\"33%\" align=\"left\" data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t<td width=\"33%\" data-dojo-attach-point=\"delete_button\" class=\"pprhidden\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"' data-dojo-attach-event=\"onClick:_delete\"></button></td>\r\n\t\t\t<td width=\"33%\" align=\"right\"><button data-dojo-attach-event=\"onClick:_add_publisher\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td>\r\n\t\t\t</tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    PublisherAdd
// Author:  Chris Hoy
// Purpose:
// Created: 08/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/publisher/PublisherAdd", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../publisher/templates/PublisherAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dojox/validate/regexp",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, topic ){
 return declare("prcommon2.publisher.PublisherAdd",
	[BaseWidgetAMD],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
		this._dialog = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_add_publisher:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		if (this.mode == "add")
		{
			if ( confirm("Add Publisher?"))
			{
				request.post('/research/admin/publisher/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Publisher?"))
			{
				request.post('/research/admin/publisher/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		console.log(response);

		if (response.success=="OK")
		{
			alert("Publisher Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Publisher_Added, response.data.publisher);
		}
		else if ( response.success == "DU")
		{
			alert("Publisher Alread Exists");
			this.publishername.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	_update_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Publisher Updated");
			topic.publish(PRCOMMON.Events.Publisher_Update, response.data.publisher);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Publisher Already Exists");
			this.publishername.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.publishername.set("value","");
		this.publisherid.set("value",-1);
		this.www.set("value","");
		this.savenode.cancel();

	},
	focus:function()
	{
		this.publishername.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( publisherid)
	{
		this.clear();

		request.post('/research/admin/publisher/get',
				utilities2.make_params({ data : {publisherid:publisherid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response)
	{
		if ( response.success == "OK")
		{
			this.publishername.set("value", response.data.publisher.publishername);
			this.publisherid.set("value", response.data.publisher.publisherid);
			this.www.set("value", response.data.publisher.www);
			if ( response.data.inuse==false )
				domclass.remove(this.delete_button,"prmaxhidden");
			else
				domclass.add(this.delete_button,"prmaxhidden");
			this._dialog.show();
		}
		else
		{
			alert("Problem");
		}
	},
	_close:function()
	{
		if ( this._dialog)
			this._dialog.hide();
	},
	_delete:function()
	{
			if ( confirm("Delete Publisher?"))
			{
				request.post('/research/admin/publisher/delete',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._delete_call_back);
			}
	},
	_delete_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Publisher Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Publisher_Deleted, this.publisherid.get("value"));
		}
		else
		{
				alert("Problem Delting Publisher");
		}
	}
});
});
