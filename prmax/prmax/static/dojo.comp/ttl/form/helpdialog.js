//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.form.helpdialog");

dojo.declare("ttl.form.helpdialog",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "ttl.form","templates/helpdialog.html"),
		constructor: function()
		{
		},
		postCreate:function()
		{
		},
		_Close:function()
		{
			this.tooltipHelpDlg.onCancel();
		},
		destroy:function()
		{
			try
			{
				this.inherited(arguments);
			}
			catch(e){}
		}
	}
);





