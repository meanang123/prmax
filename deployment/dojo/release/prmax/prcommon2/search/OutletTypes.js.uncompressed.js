require({cache:{
'url:prcommon2/search/templates/OutletTypes.html':"<div class=\"outlettype\">\r\n\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\"   class=\"prmaxrowtag\">Media Type</td>\r\n\t\t\t\t<td width=\"5%\" ><img height=\"16px\" width=\"16px\" data-dojo-attach-point=\"togglectrl\" data-dojo-attach-event=\"onclick:_toggle\" src=\"/prmax_common_s/images/toopen.gif\" class=\"toggleselect\"></img>\r\n\t\t\t\t<td align=\"right\" valign=\"top\" ><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td>\r\n\t\t</tr>\r\n\t</table>\r\n\t<div style=\"border 2px solid black\">\r\n\t\t<div data-dojo-attach-point=\"selectarea\" style=\"display:none\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t <td width=\"2%\"><input data-dojo-attach-point=\"node1\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:1' /></td><td width=\"8%\"><label data-dojo-attach-point=\"node1label\" class=\"labeltag\" >National Newspapers</label></td>\r\n\t\t\t\t\t<td width=\"2%\"><input data-dojo-attach-point=\"node2\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:2' /></td><td width=\"8%\"><label data-dojo-attach-point=\"node2label\" class=\"labeltag\" >Regional Newspapers</label></td>\r\n\t\t\t\t\t<td width=\"2%\"><input data-dojo-attach-point=\"node4\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:4' /></td><td width=\"8%\"><label data-dojo-attach-point=\"node4label\" class=\"labeltag\" >B2B Magazines</label></td>\r\n\t\t\t\t\t<td width=\"2%\"><input data-dojo-attach-point=\"node5\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:5' /></td><td width=\"8%\"><label data-dojo-attach-point=\"node5label\" class=\"labeltag\" >Consumer Magazines</label></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t  <td width=\"2%\"><input data-dojo-attach-point=\"node6\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:6'  /></td><td width=\"8%\"><label class=\"labeltag\" data-dojo-attach-point=\"node6label\" >Radio</label></td>\r\n\t\t\t\t  <td width=\"2%\"><input data-dojo-attach-point=\"node7\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:7'  /></td><td width=\"8%\"><label class=\"labeltag\" data-dojo-attach-point=\"node7label\" >Tv</label></td>\r\n\t\t\t\t  <td width=\"2%\"><input data-dojo-attach-point=\"node8\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:8'  /></td><td width=\"8%\"><label class=\"labeltag\" data-dojo-attach-point=\"node8label\" >New Media</label></td>\r\n\t\t\t\t  <td width=\"2%\"><input data-dojo-attach-point=\"node9\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:9'  /></td><td width=\"8%\"><label class=\"labeltag\" data-dojo-attach-point=\"node9label\" >Other</label></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td width=\"2%\"><input data-dojo-attach-point=\"node11\" data-dojo-attach-event=\"onClick:outlet_select\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:1'  /></td><td width=\"8%\"><label class=\"labeltag\" data-dojo-attach-point=\"node11label\" >Other Newspapers</label></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prcommon2/search/OutletTypes", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/OutletTypes.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"prcommon2/search/SearchCount",
	"dijit/form/CheckBox"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json){
 return declare("prcommon2.search.OutletTypes",
	[BaseWidgetAMD,std_search],{
	templateString:template,
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'9',
		testmode:false,
		constructor: function()
		{
			this._field_list = [1,2,4,5,6,7,8,9,11];
			this._values = "";
		},
		postCreate:function()
		{
			for ( var key in this._field_list)
			{
				var record = this._field_list[key];
				domattr.set(this["node"+record+"label"], "for", this["node"+record].id);
			}
		},
		// styandard clear function
		clear:function()
		{
			for ( var a in this._field_list)
				this["node"+this._field_list[a]].set("value",false);
			this._get_selector(this._get_data());

			this.inherited(arguments);

		},
		_setValueAttr:function(values)
		{
			var open = false ;
			this.clear();
			for ( var key in values.data )
			{
				var record = values.data[key];
				this["node"+record].set("value",true);
				open = true ;
			}

			this._get_selector(this._get_data());
			if ( open )
				this.make_open();
		},
		_getValueAttr:function()
		{
			return this._get_data();
		},
		outlet_select:function()
		{
			var cvalue = this.value;

			this._get_selector(this._get_data());

		},
		_get_data:function()
		{
			var data = Array();
			var offset = 0 ;
			for ( var a in this._field_list)
			{
				if (this["node"+this._field_list[a]].get("value")!=false)
				{
					data[offset] = this._field_list[a];
					++offset;
				}
			}
			if (this._extended)
			{
				return {data:data};
			}
			else
			{
				var data = offset>0?json.stringify(data):"";
				this.value = data;
				return data ;
			}
		},
		_focus:function()
		{
			this.node1.focus();
		}
});
});





