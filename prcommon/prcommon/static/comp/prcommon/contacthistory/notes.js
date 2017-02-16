//-----------------------------------------------------------------------------
// Name:    prcommon.contracthistory.notes
// Author:  Chris Hoy
// Purpose:
// Created: 01/11/2013
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.contacthistory.notes");


dojo.declare("prcommon.contacthistory.notes", null,
{
	constructor: function()
	{
	},
	show_notes:function(outletid)
	{
		dojo.publish ( PRCOMMON.Events.Edit_Notes , [ outletid ]);

	}
});
