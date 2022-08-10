require({cache:{
'url:research/translations/templates/translateclassification.html':"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",value:\"-1\",name:\"datasourcetranslationid\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"datasourcetranslationid\"/>\r\n\t\t<table width=\"700px\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse\" >\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" width=\"150px\">Media Type</td><td><select data-dojo-props='style:\"width:15em\",name:\"translation\",autoComplete:true,searchAttr:\"name\",required:true,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"outlettypeid\"></select></td><tr>\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Interest</td><td><div data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-attach-point=\"interests\" data-dojo-props='name:\"interests\",selectonly:true,size:6,displaytitle:\"\",startopen:true,restrict:0,keytypeid:6,title:\"Select\"'></div></td><tr>\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Update\"' data-dojo-attach-event=\"onClick:_update_translation\" ></button></td></tr>\r\n\t\t</table>\r\n\t\t<br/>\r\n\t</form>\r\n</div>\r\n\r\n"}});
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
define("research/translations/translateclassification", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../translations/templates/translateclassification.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dojo/json",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang, ItemFileReadStore,json){
return declare("research.translations.translateclassification",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._load_details_call_back = lang.hitch(this, this._load_details_call);
		this._update_translation_call_back = lang.hitch(this, this._update_translation_call);
		this._outlettypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=prmaxoutlettypes&nofilter=1"});
	},
	postCreate:function()
	{
		this.outlettypeid.set("store", this._outlettypes);
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
			this.outlettypeid.set("value", response.data.translation);
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

		formdata["extended_translation"] = json.stringify(tmp["data"]);

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
