//-----------------------------------------------------------------------------
// Name:    prcommon/clippings/edit_private
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
	"dojo/text!../clippings/templates/edit_private.html",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-class",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dijit/form/Select",
	"dojox/validate/regexp",
	"prcommon2/outlet/OutletSelect"
	], function(declare, BaseWidgetAMD, template, ContentPane, BorderContainer, utilities2, topic, request, JsonRestStore, lang, domattr,ItemFileReadStore,domclass){
return declare("prcommon2.clippings.edit_private",
	[BaseWidgetAMD],{
	templateString: template,
	mode:"add",
	gutters:false,
	constructor: function()
	{
		this._clients = new JsonRestStore({target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._clippingtypes = new ItemFileReadStore({ url:"/common/lookups?searchtype=clippingstypes"});
		this._clippingtones = new ItemFileReadStore({ url:"/common/lookups?searchtype=clippingtones"});
		this._liststore = new JsonRestStore({target:"/emails/templates_list_rest", idAttribute:"id"});
		this._statement = new JsonRestStore({target:"/statement/statement_combo_rest", idAttribute:"id"});


		this._change_client_enabled=true;

		this._save_call_back = lang.hitch(this, this._save_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.clientid.set("store",this._clients);
		this.issueid.set("store", this._issues);
		this.clippingstypeid.set("store",this._clippingtypes);
		this.clippingstoneid.set("store",this._clippingtones);

		domattr.set(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);

		this.emailtemplateid.set("store", this._liststore);
		this.emailtemplateid.set("query", {restrict:"sent",include_no_select:1});

		this.statementid.set("store", this._statement);
		this.statementid.set("query",{include_no_select:1});

		if (PRMAX.utils.settings.crm == true )
		{
			domclass.remove(this.statement_1,"prmaxhidden");
			domclass.remove(this.statementid.domNode,"prmaxhidden");
		}
	},
	_clear:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.clippingid.set("value",-1);
		this._change_client_enabled = false;
		this.clientid.set("value", null );
		this.issueid.set("value", null );
		this._change_client_enabled = true;
		this.outletid.set("value", null);
		this.outletid.set("displayvalue", "");
		this.clip_source_date.set("value", new Date());
		this.clip_title.set("value", "");
		this.clip_abstract.set("value", "");
		this.clip_source_page.set("value", "");
		this.clip_article_size.set("value", 0);
		this.clip_words.set("value", 0);
		this.clip_circulation.set("value", 0);
		this.clip_readership.set("value", 0);
		this.clip_disrate.set("value", 0.00);
		this.clip_text.set("value", "");
		this.clippingstypeid.set("value", 3);
		this.clippingstoneid.set("value",3);
		this.clip_link.set("value", "");
		this.emailtemplateid.set("value",null);
		this.statementid.set("value", null);

		domattr.set(this.heading_text,"innerHTML","Add Private Clipping");
		domclass.add(this.deletebtn.domNode,"prmaxhidden");
		domclass.remove(this.clearbtn.domNode,"prmaxhidden");

		this.savebtn.cancel();
		this.deletebtn.cancel();
	},
	_save:function()
	{
		if (utilities2.form_validator(this.formnode) == false)
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		var content = this.formnode.get("value") ;
		var command = (this.mode == "add") ? '/clippings/private_clipping_add' : '/clippings/private_clipping_update';

		content["clip_source_date"] = utilities2.to_json_date(this.clip_source_date.get("value"));

		this.savebtn.makeBusy();

		request.post(command,
			utilities2.make_params({data : content})).
			then(this._save_call_back);
	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			if (this.mode == "edit")
			{
				topic.publish("/clipping/update", response.data);
				alert("Clipping Update");
			}
			else
			{
				topic.publish("/clipping/private_add", response.data);
				alert("Clipping Added");
				this.clear();
			}
		}
		else
		{
			alert("Problem");
		}

		this.savebtn.cancel();
	},
	load:function(clipping, dialog)
	{
		this._dialog = dialog;
		domattr.set(this.heading_text,"innerHTML","Update Private Clipping");

		request.post('/clippings/private_clipping_get_for_edit',
			utilities2.make_params({data : {clippingid:clipping.clippingid}})).
			then(this._load_call_back);
	},
	_load_call:function(response)
	{
		if (response.success=="OK")
		{
			with (response)
			{
				this.clippingid.set("value",data.clippingid);
				this._change_client_enabled = false;
				this.clientid.set("value", data.clientid);
				this.issueid.set("value", data.issueid);
				this.outletid.set("value", data.outletid);
				this.outletid.set("displayvalue", data.outletname);
				this.clip_source_date.set("value", utilities2.from_object_date(data.clip_source_date));
				this.clip_title.set("value", data.clip_title);
				this.clip_abstract.set("value", data.clip_abstract);
				this.clip_source_page.set("value", data.clip_source_page);
				this.clip_article_size.set("value", data.clip_article_size);
				this.clip_words.set("value", data.clip_words);
				this.clip_circulation.set("value", data.clip_circulation);
				this.clip_readership.set("value", data.clip_readership);
				this.clip_disrate.set("value", data.clip_disrate);
				this.clip_text.set("value", data.clip_text);
				this.clippingstypeid.set("value", data.clippingstypeid);
				this.clippingstoneid.set("value", data.clippingstoneid);
				this.clip_link.set("value",data.clip_link);
				this.statementid.set("value", data.statementid);
				this.emailtemplateid.set("value", data.emailtemplateid);

				this._do_swap_view(data.clippingstypeid);

				domclass.remove(this.deletebtn.domNode,"prmaxhidden");
				domclass.add(this.clearbtn.domNode,"prmaxhidden");

			}

			this.savebtn.cancel();
			if (this._dialog)
				this._dialog.show();
		}
		else
		{
			alert("Problem");
		}
	},
	resize:function()
	{
		var tmp = lang.clone(arguments[0]);

		if (tmp.w > 600)
			tmp.w = 600;

		this.frame.resize(tmp);
		this.inherited(arguments);
	},
	_swap_view:function()
	{
		this._do_swap_view(this.clippingstypeid.get("value"));
	},
	_do_swap_view:function(typeid)
	{
		switch(typeid)
		{
		case "1":
		case 1:
			domclass.remove(this.print_view,"prmaxhidden");
			break;
		default:
			domclass.add(this.print_view,"prmaxhidden");
			break;
		}
	},
	_client_change:function()
	{
		var clientid = this.clientid.get("value");
		if (clientid == undefined)
			clientid = -1;

		this.issueid.set("query",{ clientid: clientid});
		if (this._change_client_enabled==true)
		{
			this.issueid.set("value",null);
		}

		this._change_client_enabled = true ;

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
