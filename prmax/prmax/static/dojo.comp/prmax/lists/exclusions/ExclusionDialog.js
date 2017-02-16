//-----------------------------------------------------------------------------
// Name:    prmax.lists.exclusion.ExclusionDialog
// Author:  Chris Hoy
// Purpose:
// Created: 30/06/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.exclusions.ExclusionDialog");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.lists.exclusions.ExclusionDialog",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists.exclusions","templates/ExclusionDialog.html"),
	constructor: function()
	{
		this._SubmittedCallBack = dojo.hitch ( this, this._SubmittedCall ) ;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		//dojo.attr(this.l_all,"for" , this.c_all.id);
		//dojo.attr(this.l_emp,"for" , this.c_emp.id);
		//dojo.attr(this.l_out,"for" , this.c_out.id);
	},
	_SubmittedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			dojo.publish(PRCOMMON.Events.SearchSession_Changed, [response.data] );
			dojo.publish(PRCOMMON.Events.Display_Clear,[false]);
			this.dlg_ctrl.hide();
		}
		else
		{
			alert("Problem Removeign Exclustion List");
		}
		this.saveNode.cancel();
	},
	ShowDlg:function()
	{
		this.saveNode.cancel();
		this.c_all.set("checked",true);
		this.dlg_ctrl.show();
	},
	_SubmitForm:function()
	{
		if ( confirm("Remove Exclusions from selection"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SubmittedCallBack,
					url:'/search/exclusion',
					content: this.form.get("value")}));
		}
		else
		{
			this.saveNode.cancel();
		}
	},
	_Close:function()
	{
		this.dlg_ctrl.hide();
	}
});
