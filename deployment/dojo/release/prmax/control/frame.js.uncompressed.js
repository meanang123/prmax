require({cache:{
'url:control/templates/frame.html':"<div>\r\n\t<div data-dojo-attach-point=\"frame_tabs\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='style:\"width:100%;height:100%\",region:\"center\",gutters:false'>\r\n\t\t<div data-dojo-attach-point=\"frame_tab_m\" data-dojo-type=\"control/admin\" data-dojo-props='gutters:false,title:\"Customers\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"frame_tab_e\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='gutters:false,title:\"Options\",style:\"width:100%;height:100%;overflow: hidden\"' >\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"Options\",region:\"left\",maxWidth:175,style:\"width:15%;height:100%;overflow: hidden\"' >\r\n\t\t\t\t<div data-dojo-type=\"dojo/data/ItemFileReadStore\" data-dojo-id=\"catStore\" data-dojo-props='url:\"/frame/options\"'></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/tree/ForestStoreModel\" data-dojo-id=\"catModel\" query=\"{type:'0'}\" childrenAttrs=\"children\" store=\"catStore\" rootId=\"root\" rootLabel=\"root\"></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/Tree\" data-dojo-props='\"class\":\"bordered\",model:catModel,showRoot:false' data-dojo-attach-event=\"onClick: _select_node\" ></div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"frame_zone\" data-dojo-props='region:\"center\",style:\"border:1px solid black\"'>\r\n\t\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"blank\",style:\"width:100%;height:100%\"'></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
define("control/frame", [
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
