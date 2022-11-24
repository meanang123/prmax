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
	"dojo/text!../translations/templates/translateinterests.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dojo/json",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang, ItemFileReadStore,json){
return declare("research.translations.translateinterests",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._load_details_call_back = lang.hitch(this, this._load_details_call);
		this._update_translation_call_back = lang.hitch(this, this._update_translation_call);
	},
	postCreate:function()
	{

		this.inherited(arguments);

	},
	load:function( datasourcetranslationid, show_func )
	{
		this._show_func = show_func;
		this.datasourcetranslationid.set("value",datasourcetranslationid);
		request.post('/research/international/translation/get_record',
			utilities2.make_params({ data: {datasourcetranslationid:datasourcetranslationid}} )).then
			(this._load_details_call_back);
	},
	_load_details_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.interests.set("value", response.data.interests);
			this._show_func("classification");
		}
	},
	_update_translation:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		var tmp = json.parse(this.interests.get("value"));
		var formdata = this.form.get("value");

		formdata["translation"] = json.stringify(tmp["data"]);

		request.post('/research/international/translation/update',
				utilities2.make_params({ data: formdata } )).then
				(this._update_translation_call_back);
	},
	_update_translation_call:function(response)
	{
		if (response.success=="OK")
		{
			this._show_func("classification",response.data);
		}
	}
});
});
