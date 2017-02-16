//-----------------------------------------------------------------------------
// Name:    prcommon.display.panel
// Author:  Chris Hoy
// Purpose: Simple toggle display area for data
// Created: 14/01/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.display.panel");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.display.panel",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	displaytitle:"Keywords",
	templatePath: dojo.moduleUrl( "prcommon.display","templates/panel.html"),
	_setValueAttr:function(value)
	{
		dojo.attr(this.inner_panel,"innerHTML", value );
		if ( value === "" )
			this.Close();
	},
	_Expand:function()
	{
		var newmode = dojo.style(this.inner_panel,"display")=="block"? "none":"block";
		dojo.style(this.inner_panel,"display",newmode);
		this._SetToggleBtn(newmode);
	},
	Close:function()
	{
		dojo.style(this.inner_panel,"display","none");
		this._SetToggleBtn("none");
	},
	_SetToggleBtn:function (newmode)
	{
		this.tglbtn.src =  newmode=="block"?"/static/images/toclosed.gif":"/static/images/toopen.gif";
	}
});