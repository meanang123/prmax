//-----------------------------------------------------------------------------
// Name:    prcommon/clippings/edit
// Author:
// Purpose:
// Created: August 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/edit.html",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/FilteringSelect",
	"dojox/form/BusyButton",
	"dijit/form/TextBox",
	"dijit/form/Form",
	"dijit/form/RadioButton",
	"prcommon2/outlet/OutletSelect"
	], function(declare, BaseWidgetAMD, template, utilities2, topic, request, JsonRestStore, lang, domattr,ItemFileReadStore){
return declare("prcommon2.clippings.edit",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._clients = new JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._liststore = new JsonRestStore({target:"/emails/templates_list_rest", idAttribute:"id"});
		this._statement = new JsonRestStore({target:"/statement/statement_combo_rest", idAttribute:"id"});
		this._clippingtones = new ItemFileReadStore({ url:"/common/lookups?searchtype=clippingtones"});

		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.clientid.set("store",this._clients);
		this.issueid.set("store", this._issues);
		this.clippingstoneid.set("store",this._clippingtones);

		this.emailtemplateid.set("store", this._liststore);
		this.emailtemplateid.set("query", {restrict:"sent",include_no_select:1});

		this.statementid.set("store", this._statement);
		this.statementid.set("query",{include_no_select:1});

		domattr.set(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);

	},
	clear:function()
	{
		this.clippingid.set("value",-1);
		this.clientid.set("value", "-1" );
		this.issueid.set("value", "-1" );
		this.emailtemplateid.set("value","-1");
		this.statementid.set("value","-1");
		this.savebtn.cancel();
	},
	_save:function()
	{
		if (utilities2.form_validator( this.formnode ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		this.savebtn.makeBusy();

		request.post('/clippings/update_clipping',
			utilities2.make_params({ data : this.formnode.get("value")})).
			then(this._update_call_back);
	},
	_update_call:function(response)
	{
		if ( response.success=="OK")
		{
			topic.publish("/clipping/update", response.data);
		}
		else
		{
			alert("Problem");
		}
		this.savebtn.cancel();
	},
	load:function(clipping)
	{
		this.savebtn.cancel();
		this.deletebtn.cancel();
		this.clippingid.set("value",clipping.clippingid);
		this.clientid.set("value", clipping.clientid);
		this.issueid.set("value", clipping.issueid);
		this.clippingstoneid.set("value", clipping.clippingstoneid);
		this.outletid.set("value", clipping.outletid);
		this.outletid.set("Displayvalue", clipping.outletname);
		this.emailtemplateid.set("value", clipping.emailtemplateid);
		this.statementid.set("value", clipping.statementid);

	},
	_delete:function()
	{
		if (confirm("Delete Clipping"))
		{
			this.deletebtn.makeBusy();
			request.post('/clippings/delete_clipping',
				utilities2.make_params({data : {clippingid : this.clippingid.get("value")}})).
				then(this._delete_call_back);
		}
		else
		{
			this.deletebtn.cancel();
		}
	},
	_delete_call:function(response)
	{
		if (response.success=="OK")
		{
			topic.publish("/clipping/deleted", response.data);
		}
		else
		{
			alert("Problem");
		}

		this.deletebtn.cancel();
	}
});
});
