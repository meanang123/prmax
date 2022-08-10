require({cache:{
'url:research/templates/frame.html':"<div>\r\n\t<div data-dojo-type=\"dojox/layout/ExpandoPane\" data-dojo-props='\"class\":\"bordered\",title:\"Research\",region:\"left\",maxWidth:175,style:\"margin:0px;padding:0px;width:15%;height:100%\"' >\r\n\t\t<div data-dojo-type=\"dojo/data/ItemFileReadStore\" data-dojo-id=\"catStore\" data-dojo-props='url:\"/research/frame/options\"'></div>\r\n\t\t<div data-dojo-type=\"dijit/tree/ForestStoreModel\" data-dojo-id=\"catModel\" query=\"{type:'1'}\" childrenAttrs=\"children\" store=\"catStore\" rootId=\"root\" rootLabel=\"root\"></div>\r\n\t\t<div data-dojo-type=\"dijit/Tree\" data-dojo-props='\"class\":\"bordered\",model:catModel,showRoot:false' data-dojo-attach-event=\"onClick: _SelectNode\" ></div>\r\n</div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"zone\" data-dojo-props='region:\"center\",\"class\":\"bordered\"'></div>\r\n</div>"}});
define("research/frame", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../research/templates/frame.html",
	"dijit/layout/BorderContainer",
	"dojox/collections/Dictionary",
	"dijit/layout/ContentPane",
	"dojox/layout/ExpandoPane",
	"dojo/data/ItemFileReadStore",
	"dijit/tree/ForestStoreModel",
	"dijit/Tree",
	"dijit/layout/StackContainer"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Dictionary, ContentPane ){

 return declare("research.frame",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._windows = new Dictionary();
		this._start_up_call_back = dojo.hitch(this, this._start_up_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_start_up_call:function()
	{
		var widget = new ContentPane({title:this._obj.id.toString(),content:"<div dojoType='"+ this._obj.content[0] + "' style='width:100%;height:100%'></div>"});
		this.zone.addChild ( widget, 0);
		this._windows.add(this._obj.id,  widget.id ) ;
		setTimeout("dijit.byId('"+this.zone.id +"').selectChild('"+widget.id+"');",1);
	},
	_SelectNode:function()
	{
		this._obj = arguments[0];
		if (this._windows.containsKey( this._obj.id) == false )
		{
			var widget = null;

			if (this._obj.type==0)
			{
				require( ["dijit/layout/ContentPane", this._obj.content[0].split('.').join('/')] , this._start_up_call_back);
			}
			else if (this._obj.type==2)
			{
				var widget = new dijit.layout.ContentPane({title:this._obj.id.toString(),href:this._obj.page});

				this.zone.addChild ( widget, 0);
				setTimeout("dijit.byId('"+this.zone.id +"').selectChild('"+widget.id+"');",10);
				this._windows.add(this._obj.id,  widget.id ) ;
			}
		}
		else
		{
			var wid = this._windows.entry(this._obj.id).value;

			this.zone.selectChild ( dijit.byId(wid));
		}
	}
});
});
