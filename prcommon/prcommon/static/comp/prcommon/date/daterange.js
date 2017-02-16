dojo.provide("prcommon.date.daterange");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.date.daterange",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	name:"",
	value:"",
	no_select:true,
	templatePath: dojo.moduleUrl( "prcommon.date","templates/daterange.html"),
	default_value:0,
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
			this.option.store = new dojo.data.ItemFileReadStore({data:this._options});
			this.option.set("value",0);
		}
		else
		{
			this._options = {identifier:"id", label: 'name', items:[
				{id:1,name:"Before"},
				{id:2,name:"After"},
				{id:3,name:"Between"}
			]};
			this.option.store = new dojo.data.ItemFileReadStore({data:this._options});
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
		case "0":
			dojo.addClass(this.from_date_box.domNode,"prmaxhidden");
			dojo.addClass(this.to_box_label,"prmaxhidden");
			dojo.addClass(this.to_date_box.domNode,"prmaxhidden");
			break;
		case "1":
		case "2":
			dojo.removeClass(this.from_date_box.domNode,"prmaxhidden");
			dojo.addClass(this.to_box_label,"prmaxhidden");
			dojo.addClass(this.to_date_box.domNode,"prmaxhidden");
			break;
		case "3":
			dojo.removeClass(this.from_date_box.domNode,"prmaxhidden");
			dojo.removeClass(this.to_box_label,"prmaxhidden");
			dojo.removeClass(this.to_date_box.domNode,"prmaxhidden");
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

			return dojo.toJson( {
				option: option,
				from_date: ttl.utilities.toJsonDate(this.from_date_box.get("value")),
				to_date: ttl.utilities.toJsonDate(this.to_date_box.get("value"))
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
	}
});
