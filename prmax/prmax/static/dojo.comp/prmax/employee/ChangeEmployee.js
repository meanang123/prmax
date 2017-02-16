//-----------------------------------------------------------------------------
// Name:    prmax.employee.ChangeEmployee
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.employee.ChangeEmployee");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("prcommon.interests.Interests");
dojo.require("ttl.utilities");


dojo.declare("prmax.employee.ChangeEmployee",
	[ ttl.BaseWidget ],
	{
	outletid:-1,
	employeeid:-1,
	current:"",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.employee","templates/ChangeEmployee.html"),
	constructor: function() {
		this._LoadCall= dojo.hitch(this,this._Load);
	},
	startup: function ()
	{
	// add call to load details
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCall,
			url:'/employees/listcombo',
			content: {
				outletid:this.outletid,
				limit:10000,
				offset:0}
		}));
		this.inherited(arguments);
	},
	_Load:function(response)
	{
		for ( var key in response.items)
		{
			var data = response.items[key];
			this.select.options[this.select.options.length] = new Option(data.contactname,data.employeeid);
			if (data.employeeid==this.employeeid)
			{
				this.select.options[this.select.options.length-1].selected = true;
			}
		}
		this.saveNode.set("disabled",false);
	},
	_Saved:function(respsone,data)
	{
		this.saveNode.set('disabled',false);
	},
	Load:function()
	{
	},
	Save:function()
	{
	},
	Clear:function()
	{
	}
	});
