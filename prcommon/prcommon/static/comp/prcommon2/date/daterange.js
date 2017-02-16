define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../date/templates/daterange.html",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/CheckBox",
	"dijit/form/Select"
	], function(declare, BaseWidgetAMD, template, utilities2, json,lan,domattr,domclass,ItemFileReadStore)
	{
		return declare("prcommon2.date.daterange",
		[BaseWidgetAMD],{
		name:"",
		value:"",
		required:false,
		templateString:template,
		constructor: function()
		{
			this._options = null;
			this._start_date = new Date();
			this._end_date = new Date();
		},
	postCreate:function()
	{
		this.inherited(arguments);

		if ( this.no_select == true)
		{
			this._options = {identifier:"id", label: 'name', items:[
				{id:0,name:"None"},
				{id:1,name:"Before"},
				{id:2,name:"After"},
				{id:3,name:"Between"}
			]};
			this.option.set("store" ,new ItemFileReadStore({data:this._options}));
			this.option.set("value",0);
		}
		else
		{
			this._options = {identifier:"id", label: 'name', items:[
				{id:1,name:"Before"},
				{id:2,name:"After"},
				{id:3,name:"Between"}
			]};
			this.option.set("store",new ItemFileReadStore({data:this._options}));
			this.option.set("value",1);

			if (this.default_value == 0 )
				this.default_value = 1;
		}

		this.from_date_box.set("value", new Date());
		this.to_date_box.set("value", new Date());

		this.option.set("value", this.default_value);

	},
	_option_changed:function()
	{
		switch ( this.option.get("value"))
		{
		default:
		case 0:
			domclass.add(this.from_date_box.domNode,"prmaxhidden");
			domclass.add(this.to_box_label,"prmaxhidden");
			domclass.add(this.to_date_box.domNode,"prmaxhidden");
			break;
		case 1:
		case 2:
			domclass.remove(this.from_date_box.domNode,"prmaxhidden");
			domclass.add(this.to_box_label,"prmaxhidden");
			domclass.add(this.to_date_box.domNode,"prmaxhidden");
			break;
		case 3:
			domclass.remove(this.from_date_box.domNode,"prmaxhidden");
			domclass.remove(this.to_box_label,"prmaxhidden");
			domclass.remove(this.to_date_box.domNode,"prmaxhidden");
			break;
		}
	},
	_date_changed:function()
	{
		if (this.option.get("value") == "3")
		{
		}
	},
	isValid:function()
	{
			return true;
	},
	_getValueAttr:function()
	{
		try
		{
			var tmp = parseInt(this.option.get("value"));
			var option = 0;
			for (var key in this._options.items)
			{
				if ( this._options.items[key].id[0] == tmp )
				{
					option = this._options.items[key].name[0];
					break;
				}
			}

			return json.stringify({
				option:option,
				from_date:utilities2.to_json_date(this.from_date_box.get("value")),
				to_date:utilities2.to_json_date(this.to_date_box.get("value"))
				} );
		}
		catch(e)
		{
			return "";
		}
	},
	_setValueAttr:function( value )
	{
		if ( value == null )
			this.clear();
	},
	clear:function()
	{
		this.option.set("value", this.default_value);
		this.from_date_box.set("value", this._start_date);
		this.to_date_box.set("value", this._end_date);
	},
	set_range_to_week:function()
	{
		this._end_date = new Date();
		this._start_date.setDate (this._end_date.getDate() - 6);
		this.from_date_box.set("value", this._start_date);
		this.to_date_box.set("value", this._end_date);
	},
	set_range_to_last_30_days:function()
	{
		this._end_date = new Date();
		this.option.set("value", 3);
		this._start_date.setDate (this._end_date.getDate() - 30);
		this.from_date_box.set("value", this._start_date);
		this.to_date_box.set("value", this._end_date);
	},
	get_physical_values:function()
	{
		return {
				option:this.option.get("value"),
				from_date: this.from_date_box.get("value"),
				to_date: this.to_date_box.get("value")
				};
	},
	_setIntvalueAttr:function(value)
	{
		this.option.set("value", value.option);
		this.from_date_box.set("value",value.from_date);
		this.to_date_box.set("value",value.to_date);
	}
});
});
