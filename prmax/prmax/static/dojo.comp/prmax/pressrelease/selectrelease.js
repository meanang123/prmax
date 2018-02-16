//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.selectrelease
// Author:  Chris Hoy
// Purpose: TO select an existing press release and then start the release send wizard
// Created: 09/03/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.selectrelease");

dojo.declare("prmax.pressrelease.selectrelease",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/selectrelease.html"),
	constructor: function()
	{
		this.model = new dojox.data.QueryReadStore (
			{url:'/emails/templates_list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
		});
		dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
	},
	postCreate:function()
	{
		this.template.store = this.model;
		dojo.attr(this.distrbtn, 'label', 'New ' + PRMAX.utils.settings.distribution_description);
		dojo.attr(this.distr_label, 'innerHTML', PRMAX.utils.settings.distribution_description);
		dojo.attr(this.dlg, 'title', 'Select ' + PRMAX.utils.settings.distribution_description);

		this.inherited(arguments);
	},
	_UpdateDistributionLabelEvent:function()
	{
		dojo.attr(this.distrbtn, 'label', 'New ' + PRMAX.utils.settings.distribution_description);
		dojo.attr(this.distr_label, 'innerHTML', PRMAX.utils.settings.distribution_description);
		dojo.attr(this.dlg, 'title', 'Select ' + PRMAX.utils.settings.distribution_description);
	},
	_Cancel:function()
	{
		this.hide();
	},
	_Open:function()
	{
		this._add();
	},
	_add:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}
		dojo.publish(PRCOMMON.Events.PressReleaseStart, [{emailtemplateid:this.template.get("value")}]) ;
		this.hide();
		this._Clear();
	},
	_Clear:function()
	{
		this.template.set("value",null);
		this.saveNode.cancel();
	},
	show:function()
	{
		this._Clear();
		this.dlg.show();
	},
	hide:function()
	{
		this.dlg.hide();
		this._Clear();
	},
	_new_release:function()
	{
		this.dlg.hide();
		dijit.byId("std_banner_control").ShowNewPressRelease();
	}
});
