require({cache:{
'url:prcommon2/search/templates/Circulation.html':"<div class=\"circulation\">\r\n\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\"   class=\"prmaxrowtag\">Circulation</td>\r\n\t\t\t\t<td width=\"5%\" ><img height=\"16px\" width=\"16px\" data-dojo-attach-point=\"togglectrl\" data-dojo-attach-event=\"onclick:_toggle\" src=\"/prmax_common_s/images/toopen.gif\" class=\"toggleselect\"></img>\r\n\t\t\t\t<td align=\"right\" valign=\"top\" ><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td>\r\n\t\t</tr>\r\n\t</table>\r\n\t<div style=\"border 2px solid black\">\r\n\t\t<div data-dojo-attach-point=\"selectarea\" style=\"display:none\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\">\r\n\t\t\t  <tr>\r\n\t\t\t  <td width=\"8%\"><input data-dojo-attach-point=\"node_1\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"1\"' data-dojo-attach-event=\"onClick:check_count\"/></td><td width=\"23%\"><label data-dojo-attach-point=\"node_1_label\" class=\"labeltag\">1-500</label></td>\r\n\t\t\t  <td width=\"8%\"><input data-dojo-attach-point=\"node_2\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"2\"' data-dojo-attach-event=\"onClick:check_count\"/></td><td width=\"26%\"><label data-dojo-attach-point=\"node_2_label\" class=\"labeltag\">501-2500</label></td>\r\n\t\t\t  <td width=\"8%\"><input data-dojo-attach-point=\"node_3\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"3\"' data-dojo-attach-event=\"onClick:check_count\"/></td><td width=\"21%\"><label data-dojo-attach-point=\"node_3_label\" class=\"labeltag\">2501-10k</label></td>\r\n\t\t\t  </tr>\r\n\t\t\t  <tr>\r\n\t\t\t  <td width=\"8%\"><input data-dojo-attach-point=\"node_4\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"4\"' data-dojo-attach-event=\"onClick:check_count\"/></td><td width=\"23%\"><label data-dojo-attach-point=\"node_4_label\" class=\"labeltag\">10001-50k</label></td>\r\n\t\t\t  <td width=\"8%\"><input data-dojo-attach-point=\"node_5\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"5\"' data-dojo-attach-event=\"onClick:check_count\"/></td><td width=\"26%\"><label data-dojo-attach-point=\"node_5_label\" class=\"labeltag\">50001-100k</label></td>\r\n\t\t\t  <td width=\"8%\"><input data-dojo-attach-point=\"node_6\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"6\"' data-dojo-attach-event=\"onClick:check_count\"/></td><td width=\"21%\"><label data-dojo-attach-point=\"node_6_label\" class=\"labeltag\">100001+</label></td>\r\n\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
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
define("prcommon2/search/Circulation", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/Circulation.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"dijit/form/CheckBox",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json){
 return declare("prcommon2.search.Circulation",
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
			this._field_list = [1,2,3,4,5,6];
		},
		postCreate:function()
		{
			for ( var key in this._field_list)
			{
				var record = this._field_list[key];
				domattr.set(this["node_"+record+"_label"], "for", this["node_"+record].id);
			}
		},
		check_count:function()
		{
			this._get_selector(this._get_data());
		},
		// styandard clear function
		clear:function()
		{
			for ( var a in this._field_list)
				this["node_"+this._field_list[a]].set("value",false);
			this._get_selector("");
			this.inherited(arguments);
		},
		_setValueAttr:function( values )
		{
			var open = false;
			this.Clear();
			for ( var key in values.data )
			{
				var record = values.data[key];
				this["node_"+record].set("value",true);
				open = true ;
			}
			this._get_selector(this._getValueAttr());
			if ( open )
				this.make_open();
		},
		_getValueAttr:function()
		{
			return this._get_data();
		},
		_get_data:function()
		{
			var data = Array();
			var offset = 0 ;
			for ( var a in this._field_list)
			{
				if (this["node_"+this._field_list[a]].get("value")!=false)
				{
					data[offset] = parseInt(this._field_list[a]);
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
				return data;
			}
		},
		_focus:function()
		{
			this.node_1.focus();
		}
});
});
