require({cache:{
'url:research/translations/templates/basicedit.html':"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",value:\"-1\",name:\"datasourcetranslationid\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"datasourcetranslationid\"/>\r\n\t\t<table width=\"550px\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse\" >\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" width=\"250px\" >Translation</td><td><input data-dojo-props='style:\"width:300px\",\"class\":\"prmaxrequired\",name:\"translation\",type:\"text\",trim:true,required:true' data-dojo-attach-point=\"translation\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Update\"' data-dojo-attach-event=\"onClick:_update_translation\" ></button></td></tr>\r\n\t\t</table>\r\n\t\t<br/>\r\n\t</form>\r\n</div>\r\n\r\n"}});
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
define("research/translations/basicedit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../translations/templates/basicedit.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dijit/form/ValidationTextBox"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang ){
return declare("research.translations.basicedit",
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
			this.translation.set("value", response.data.translation);
			this._show_func("basic");
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
			this._show_func("basic",response.data);
		}
	}
});
});
