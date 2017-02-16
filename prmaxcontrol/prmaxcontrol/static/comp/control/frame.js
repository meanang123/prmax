define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../control/templates/frame.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojox/collections/Dictionary",
	"dijit/layout/ContentPane",
	"dijit/registry",
	"dijit/layout/StackContainer",
	"dijit/layout/TabContainer",
	"dojo/data/ItemFileReadStore",
	"dijit/tree/ForestStoreModel",
	"dijit/Tree",
	"control/admin"
	], function(declare, BaseWidgetAMD, template, BorderContainer, lang, Dictionary,ContentPane,registry){

 return declare("control.frame",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._windows = new Dictionary();
		this._start_up_call_back = lang.hitch(this, this._start_up_call);
	},
	_select_node:function()
	{
		this._obj = arguments[0];
		if (this._windows.containsKey( this._obj.id) == false )
		{
			if (this._obj.type==2)
			{
				require( ["dijit/layout/ContentPane", this._obj.content[0].split('.').join('/')] , this._start_up_call_back);
			}
			else if (this._obj.type==0)
			{
				this._widget = new ContentPane({title:this._obj.name.toString(),href:this._obj.content[0]});

				this.frame_zone.addChild ( this._widget, 0);
				setTimeout(lang.hitch(this, this._select_child_call),10);
				this._windows.add(this._obj.id,  this._widget.id );
			}
		}
		else
		{
			var wid = this._windows.entry(this._obj.id).value;

			this.frame_zone.selectChild(registry.byId(wid));
		}
	},
	_start_up_call:function(ContentPane, WidgetToBuild)
	{
		this._widget = new WidgetToBuild();
		this.frame_zone.addChild ( this._widget, 0);
		this._windows.add(this._obj.id,  this._widget.id ) ;

		setTimeout(lang.hitch(this, this._select_child_call),10);
	},
	_select_child_call:function()
	{
		this.frame_zone.selectChild(this._widget.id);
	}
});
});
