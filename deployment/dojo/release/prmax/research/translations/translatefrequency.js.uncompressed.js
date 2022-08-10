require({cache:{
'url:research/translations/templates/translatefrequency.html':"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",value:\"-1\",name:\"datasourcetranslationid\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"datasourcetranslationid\"/>\r\n\t\t<table width=\"550px\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse\" >\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" width=\"250px\">Frequency</td><td><select data-dojo-props='style:\"width:15em\",name:\"translation\",autoComplete:true,searchAttr:\"name\",required:true,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"frequencyid\"></select></td><tr>\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Update\"' data-dojo-attach-event=\"onClick:_update_translation\" ></button></td></tr>\r\n\t\t</table>\r\n\t\t<br/>\r\n\t</form>\r\n</div>\r\n\r\n"}});
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
define("research/translations/translatefrequency", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../translations/templates/translatefrequency.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dijit/form/ValidationTextBox"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang, ItemFileReadStore){
return declare("research.translations.translatefrequency",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._load_details_call_back = lang.hitch(this, this._load_details_call);
		this._update_translation_call_back = lang.hitch(this, this._update_translation_call);
		this._frequencies = new ItemFileReadStore ({ url:"/common/lookups?searchtype=frequencies&nofilter=1"});
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
			this._show_func("frequency");
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
			this._show_func("frequency",response.data);
		}
	}
});
});
