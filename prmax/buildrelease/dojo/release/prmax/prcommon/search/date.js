if(!dojo._hasResource["prcommon.search.date"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["prcommon.search.date"] = true;
//-----------------------------------------------------------------------------
// Name:    date.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.date");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.search.date",
	[ ttl.BaseWidget],
	name:"",
	templateString:"<div>\r\n    <table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"1\">\r\n       <tr><td class=\"prmaxrowtag\">Selection</td><td><select dojoAttachPoint=\"selectionid\" dojoAttachEvent=\"onChange:_Selection\"></select></td></tr>\r\n    </table>\r\n    <div>\r\n        <div class=\"prmaxhidden\" dojoAttachPoint=\"from_date_view\" style=\"display:inline\"><input type=\"text\"  dojoAttachPoint=\"from_date_value\" dojoType=\"dijit.form.DateTextBox\" /></div>\r\n        <div class=\"prmaxhidden\" dojoAttachPoint=\"to_date_view\" style=\"display:inline\"><input type=\"text\"  dojoAttachPoint=\"to_date_value\" dojoType=\"dijit.form.DateTextBox\" /></div>\r\n     </div>\r\n</div>\r\n",
	postCreate:function()
	{
		this.inherited(arguments);
		this.to_date_value.attr("value", new Date());
		this.from_date_value.attr("value", new Date());
	},
	_getValueAttr:function()
	{
		return this._getData();
	},
	_getData:function()
	{
		return dojo.toJson(
		{
			selectionid:this.selectionid.attr("value"),
			to_date_value : ttl.utilities.toJsonDate ( this.to_date_value.attr("value")),
			from_date_value : ttl.utilities.toJsonDate ( this.from_date_value.attr("value"))
		});
	}
);






}
