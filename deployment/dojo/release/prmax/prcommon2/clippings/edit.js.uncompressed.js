require({cache:{
'url:prcommon2/clippings/templates/edit.html':"<div>\r\n\t<form data-dojo-attach-point=\"formnode\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"common_prmax_layout prmaxdefault\",\"onSubmit\":\"return false\"'>\r\n\t\t<input data-dojo-attach-point=\"clippingid\" data-dojo-props='value:\"\",name:\"clippingid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t<label data-dojo-attach-point=\"client_label_1\" class=\"label_align_r label_tag label_size_1\">Client</label><select data-dojo-props='name:\"clientid\",autoComplete:true,searchAttr:\"clientname\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"clientid\" data-dojo-attach-event=\"onChange:_client_change\"></select><br/>\r\n\t\t<label data-dojo-attach-point=\"issue_label_1\" class=\"label_align_r label_tag label_size_1\">Issue</label><select data-dojo-props='name:\"issueid\",autoComplete:true,searchAttr:\"name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"issueid\" ></select><br/>\r\n\t\t<label class=\"label_align_r label_tag label_size_1\">Release</label><select data-dojo-props='name:\"emailtemplateid\",autoComplete:true,searchAttr:\"emailtemplatename\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"emailtemplateid\" ></select><br/>\r\n\t\t<label class=\"label_align_r label_tag label_size_1\">Tone</label><select data-dojo-props='name:\"clippingstoneid\",autoComplete:true,labelType:\"html\",style:\"width:10em\",value:3' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"clippingstoneid\" ></select><br/>\r\n\t\t<label class=\"label_align_r label_tag label_size_1\">Outlet</label><div data-dojo-props='name:\"outletid\",placeHolder:\"Select outlet if required\",required:false,source_url:\"/search2/list_rest\"' data-dojo-type=\"prcommon2/outlet/OutletSelect\" data-dojo-attach-point=\"outletid\"></div><br/>\r\n\t\t<label data-dojo-attach-point=\"statement_1\" class=\"label_align_r label_tag label_size_1 prmaxhidden\">Statement</label><select data-dojo-props='name:\"statementid\",autoComplete:true,searchAttr:\"statementdescription\",labelType:\"html\",\"class\":\"prmaxhidden\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"statementid\" ></select><br/>\r\n\t\t<br/>\r\n\t\t<button data-dojo-attach-event=\"onClick:_delete\" data-dojo-attach-point=\"deletebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Deleting...\",label:\"Delete Clipping\",\"class\":\"btnleft\"'></button>\r\n\t\t<button data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\",\"class\":\"btnleft\",style:\"padding-left:130px\"'></button>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prcommon/clippings/edit
// Author:
// Purpose:
// Created: August 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/edit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/edit.html",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/FilteringSelect",
	"dojox/form/BusyButton",
	"dijit/form/TextBox",
	"dijit/form/Form",
	"dijit/form/RadioButton",
	"prcommon2/outlet/OutletSelect"
	], function(declare, BaseWidgetAMD, template, utilities2, topic, request, JsonRestStore, lang, domattr, domclass, ItemFileReadStore){
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

		this._change_client_enabled=true;

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

		if (PRMAX.utils.settings.crm == true )
		{
			domclass.remove(this.statement_1,"prmaxhidden");
			domclass.remove(this.statementid.domNode,"prmaxhidden");

		}

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
		this._change_client_enabled = false;
		this.clientid.set("value", clipping.clientid);
		this.issueid.set("value", clipping.issueid);
		this._change_client_enabled = true;
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
	}
});
});
