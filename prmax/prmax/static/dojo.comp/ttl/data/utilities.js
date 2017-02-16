//-----------------------------------------------------------------------------
// Name:    data.utilities.js
// Author:  Chris Hoy
// Purpose: Common function what would be used by any dojo based web site
// Created: 04/01/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("ttl.data.utilities");

//open a new popup window used for reports
ttl.data.utilities.isIndividual = function ( outlettypeid )
{
	console.log("outlettypeid",outlettypeid);
	return (outlettypeid==19||outlettypeid==41)?true:false;
}
