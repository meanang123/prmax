//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.freelance.FreelanceChanges");

dojo.declare("prmax.dataadmin.freelance.FreelanceChanges",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.freelance","templates/FreelanceChange.html"),
		constructor: function()
		{
			this.inherited(arguments);
		},
		postCreate:function()
		{
			this.inherited(arguments);
			this.freelance_change_grid.set("structure",this.freelance_change_view);
			this.freelance_accept_grid.set("structure",this.freelance_accept_view);
			this.inherited(arguments);
		},
		freelance_change_view:{
			cells: [[
				{name: 'Freelance',width: "200px",field:"contactname"},
				{name: 'When',width: "100px",field:"created"},
				{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl},
			]]
		},
		freelance_accept_view:{
			cells: [[
				{name: 'Item',width: "200px",field:"contactname"},
				{name: 'Action',width: "100px",field:"created"},
				{name: 'Data',width: "200px",field:"data"},
				{name: "Accept",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl},
			]]
		}
	}
);





