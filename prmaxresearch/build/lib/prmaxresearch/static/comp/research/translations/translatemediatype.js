//-----------------------------------------------------------------------------
// Name:    translation.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../translations/templates/translatemediatype.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dijit/form/ValidationTextBox"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang, ItemFileReadStore){
return declare("research.translations.translatemediatype",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._load_details_call_back = lang.hitch(this, this._load_details_call);
		this._update_translation_call_back = lang.hitch(this, this._update_translation_call);
		this._frequencies = new ItemFileReadStore ({ url:"/common/lookups?searchtype=prmaxoutlettypes&nofilter=1"});
	},
	postCreate:function()
	{

		this.frequencyid.set("store", this._frequencies);

		this.inherited(arguments);

	},
	load:function( datasourcetranslationid, show_func )
	{
		this._show_func = show_func;
		this.datasourcetranslationid.set("value",datasourcetranslationid);
		request.post('/research/international/translation/get_record',
			utilities2.make_params({data:{datasourcetranslationid:datasourcetranslationid}})).then
			(this._load_details_call_back);
	},
	_load_details_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.frequencyid.set("value", response.data.translation);
			this._show_func("mediatype");
		}
	},
	_update_translation:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		request.post('/research/international/translation/update',
				utilities2.make_params({ data: this.form.get("value")} )).then
				(this._update_translation_call_back);
	},
	_update_translation_call:function(response)
	{
		if (response.success=="OK")
		{
			this._show_func("mediatype",response.data);
		}
	}
});
});
