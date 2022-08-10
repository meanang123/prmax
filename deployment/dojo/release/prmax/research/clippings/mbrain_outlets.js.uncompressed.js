require({cache:{
'url:research/clippings/templates/mbrain_outlets.html':"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",value:\"-1\",name:\"outletexternallinkid\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletexternallinkid\"/>\r\n\t\t<table width=\"550px\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse\" >\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" width=\"250px\">Outlet</td><td><select data-dojo-props='style:\"width:20em\",name:\"outletid\",autoComplete:true,searchAttr:\"outletname\",required:true,placeHolder:\"No Selection\",pageSize:20' data-dojo-type=\"prcommon2/outlet/OutletSelect\" data-dojo-attach-point=\"outletid\"></select></td></tr>\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mark As Ignored</td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"ignore\" data-dojo-props='name:\"ignore\",type:\"checkbox\",checked:true' ></td> </tr>\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Update\"' data-dojo-attach-event=\"onClick:_update_outlet\" ></button></td></tr>\r\n\t\t</table>\r\n\t\t<br/>\r\n\t</form>\r\n</div>\r\n\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ipcb_outlets.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/clippings/mbrain_outlets", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/mbrain_outlets.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dojo/store/Observable",
	"ttl/store/JsonRest",
	"dojox/data/JsonRestStore",
	"dijit/layout/ContentPane",
	"dijit/form/FilteringSelect",
	"prcommon2/outlet/OutletSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang, ItemFileReadStore,Observable,JsonRest,JsonRestStore,ContentPane){
return declare("research.clippings.mbrain_outlets",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	constructor: function()
	{
		this._load_details_call_back = lang.hitch(this,this._load_details_call);
		this._update_translation_call_back = lang.hitch(this,this._update_translation_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);

	},
	load:function( outletexternallinkid, show_func )
	{
		this._show_func = show_func;
		this.outletexternallinkid.set("value",outletexternallinkid);
		request.post('/research/clippings/get_outlet_trans_record',
			utilities2.make_params({ data: {outletexternallinkid:outletexternallinkid}} )).then
			(this._load_details_call_back);
	},
	_load_details_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._show_func("mbrain_outlets");
			this.outletid.set("value", response.data.outletid);
			this.outletid.set("Displayvalue", response.data.outletname);
			this.ignore.set("checked",response.data.ignore);
		}
	},
	_update_outlet:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		request.post('/research/clippings/update_outlet_trans',
				utilities2.make_params({ data: this.form.get("value")} )).then
				(this._update_translation_call_back);
	},
	_update_translation_call:function(response)
	{
		if (response.success=="OK")
		{
			this._show_func("mbrain_outlets",response.data);
		}
	}
});
});
