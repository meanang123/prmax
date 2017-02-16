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
dojo.provide("prmax.common.SelectOptions2");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.common.SelectOptions2",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		title:"",
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.common","templates/SelectOptions2.html"),
		constructor: function()
		{
			this._nodes = ["allNode","selectedNode","unselectedNode"];
		},
		startup:function()
		{
			for ( var a in this._nodes)
			{
				this[this._nodes[a]].domNode.firstChild.name = this.id+"_name";
				this[this._nodes[a]].set("name",this.id+"_name");
				this[this._nodes[a]+"Label"].setAttribute("for",this[this._nodes[a]].id);
			}
			dojo.attr(this.titleNode,"innerHTML" , this.title ) ;
			this.inherited(arguments);
		},
		_Click:function()
		{

		},
		_getValueAttr:function()
		{
			console.log("_getValueAttr",this._getData());

			return this._getData();
		},
		_getData:function()
		{
			var ret = "-1";
			for ( var a in this._nodes)
			{
				if (this[this._nodes[a]].checked==true)
				{
					ret = this[this._nodes[a]].value;
					break;
				}
			}
			return ret;
		},
		Clear:function()
		{
				this.allNode.checked = true ;
		},
		setOptions:function(selected)
		{
			console.log("setOptions",selected);
			this.selectedNode.set("disabled",(selected)?false:true);
			this.unselectedNode.set("disabled",(selected)?false:true);
			if (selected)
				this.selectedNode.set("checked",true );
			else
				this.allNode.set("checked",true );
		},
		setModeAll:function()
		{
			this.selectedNode.set("disabled",false);
			this.unselectedNode.set("disabled",false);
			this.allNode.set("checked",true );
		}
	}
);





