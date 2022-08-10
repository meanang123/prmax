require({cache:{
'url:prcommon2/production/templates/ProductionCompanyAdd.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"productioncompanyid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"productioncompanyid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\" width=\"400px\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Production Company</td><td colspan=\"2\" ><input data-dojo-props='\"class\":\"prmaxinput\",name:\"productioncompanydescription\",type:\"text\",trim:true,required:true,style:\"width:90%\",placeHolder:\"Circulation Dates\"'  data-dojo-attach-point=\"productioncompanydescription\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td align=\"left\" data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t<td data-dojo-attach-point=\"delete_button\" class=\"prmaxhidden\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"' data-dojo-attach-event=\"onClick:_delete\"></button></td>\r\n\t\t\t<td align=\"right\"><button data-dojo-attach-event=\"onClick:_add_dates\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ProductionCompanyAdd
// Author:  Chris Hoy
// Purpose:
// Created: 08/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/production/ProductionCompanyAdd", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../production/templates/ProductionCompanyAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, topic ){
 return declare("prcommon2.production.ProductionCompanyAdd",
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
	_add_dates:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		if (this.mode == "add")
		{
			if ( confirm("Add Production Company?"))
			{
				request.post('/research/admin/production/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Production Company?"))
			{
				request.post('/research/admin/production/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Production Company Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Production_Company_Added, response.data.productioncompany);
		}
		else if ( response.success == "DU")
		{
			alert("Production Company Already Exists");
			this.productioncompanydescription.focus();
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
			alert("Production Company Updated");
			topic.publish(PRCOMMON.Events.Production_Company_Update, response.data.productioncompany);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Production Company Already Exists");
			this.productioncompanydescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.productioncompanydescription.set("value","");
		this.productioncompanyid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.productioncompanydescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( productioncompanyid)
	{
		this.clear();

		request.post('/research/admin/production/get',
				utilities2.make_params({ data : {productioncompanyid:productioncompanyid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.productioncompanydescription.set("value", response.data.productioncompany.productioncompanydescription);
			this.productioncompanyid.set("value", response.data.productioncompany.productioncompanyid);
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
			if ( confirm("Delete Production Company?"))
			{
				request.post('/research/admin/production/delete',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._delete_call_back);
			}
	},
	_delete_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Production Company Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Production_Company_Deleted, this.productioncompanyid.get("value"));
		}
		else
		{
				alert("Problem Deleting Production Company");
		}
	}});
});
