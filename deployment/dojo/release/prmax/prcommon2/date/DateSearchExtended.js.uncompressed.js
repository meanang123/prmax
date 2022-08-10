require({cache:{
'url:prcommon2/date/templates/DateSearchExtended.html':"<div>\r\n\t<table style=\"width:99%;border-style:collapsed\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\" ><span class=\"prmaxrowtag\">${displayname}</span></td>\r\n\t\t\t<td width=\"70%\" >\r\n\t\t\t\t<select data-dojo-type=\"dijit/form/ComboBox\" data-dojo-props='style:\"width:8em\",autocomplete:false,value:\"No Selection\"' data-dojo-attach-point=\"option\" data-dojo-attach-event=\"onChange:_option_changed\">\r\n\t\t\t\t\t\t<option>No Selection</option>\r\n\t\t\t\t\t\t<option>Before</option>\r\n\t\t\t\t\t\t<option>After</option>\r\n\t\t\t\t\t\t<option>Between</option>\r\n\t\t\t\t</select>\r\n\t\t\t\t<input data-dojo-attach-point=\"from_date_box\" data-dojo-props='\"class\":\"prmaxbutton prmaxhidden\",type:\"text\",style:\"width:6em\"' data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-attach-event=\"onChange:_date_changed\">\r\n\t\t\t\t<label data-dojo-attach-point=\"to_box_label\" class=\"prmaxhidden\"> and </label><input data-dojo-attach-point=\"to_date_box\" data-dojo-props='\"class\":\"prmaxbutton prmaxhidden\",type:\"text\",style:\"width:6em\" '  data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-attach-event=\"onChange:_date_changed\" >\r\n\t\t\t\t<input data-dojo-attach-point=\"month_checkbox\" data-data-props='type:\"checkbox\",checked:\"checked\",value:\"1\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onChange:_date_changed\" ><label data-dojo-attach-point=\"label_box\" checked >Include Months</label>\r\n\t\t\t</td>\r\n\t\t\t<td width=\"10%\" align=\"right\"><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prcommon.date.DateSearchExtended
// Author:  Chris Hoy
// Purpose:
// Created: 07/12/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define("prcommon2/date/DateSearchExtended", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../date/templates/DateSearchExtended.html",
	"ttl/utilities2",
	"dojo/json",
	"prcommon2/search/std_search",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/CheckBox",
	"prcommon2/search/SearchCount",
	"dijit/form/ComboBox"
	], function(declare, BaseWidgetAMD, template, utilities2, json,std_search,domattr,domclass)
	{
 return declare("prcommon2.date.DateSearchExtended",
	[BaseWidgetAMD,std_search],{
	noselection:"No Selection",
	name:"",
	value:"",
	required:false,
	templateString: template,
	postCreate:function()
	{
		this.from_date_box.set("value", new Date());
		this.to_date_box.set("value", new Date());
		this.inherited(arguments);
	},
	_get_data:function()
	{
		var value = this.option.get("value");
		if (value != this.noselection)
		{
			return json.stringify(
			{
				option : value,
				from_date: utilities2.to_json_date ( this.from_date_box.get("value")),
				to_date: utilities2.to_json_date ( this.to_date_box.get("value")),
				month : this.month_checkbox.get("value")
			})
		}
		return "";
	},
	_default_settings:function()
	{
		this.option.set("value", this.noselection);
		this.from_date_box.set("value", new Date());
		this.to_date_box.set("value", new Date());
		this.month_checkbox.set("checked",true);
	},
	_setValueAttr:function( value )
	{
		if ( value == null || value === "" )
		{
			this._default_settings();
		}
		else
		{
			obj = json.parse ( value ) ;
			try
			{
				this.option.set("value", obj.option);
				this.from_date_box.set("value", utilities2.from_json_date( obj.from_date) );
				this.to_date_box.set("value", utilities2.from_json_date( obj.to_date) );
				this.month_checkbox.set("checked",obj.month );
			}
			catch (e )
			{
				this._default_settings();
			}
		}

		this._show_options();
		this._get_selector(this._get_data());

	},
	_getValueAttr:function()
	{
		return this._get_data();
	},
	_option_changed:function()
	{
		this._show_options();
		this._get_selector(this._get_data());
	},
	_show_options:function()
	{
		var show_from = false;
		var show_to = false;

		switch ( this.option.get("value") )
		{
			case this.noselection :
				break;
			case "After":
				show_from = true;
				break;
			case "Before":
				show_from = true;
				break;
			case "Between" :
				show_from = true;
				show_to = true ;
				break;
		}

		if (show_from)
			dojo.removeClass(this.from_date_box.domNode,"prmaxhidden");
		else
			dojo.addClass(this.from_date_box.domNode,"prmaxhidden");
		if (show_to)
		{
			domclass.remove(this.to_date_box.domNode,"prmaxhidden");
			domclass.remove(this.to_box_label,"prmaxhidden");
		}
		else
		{
			domclass.add(this.to_date_box.domNode,"prmaxhidden");
			domclass.add(this.to_box_label,"prmaxhidden");
		}
	},
	_date_changed:function()
	{
		this._get_selector(this._get_data());
	},
	clear:function()
	{
		this._setValueAttr(null);
	}
});
});
