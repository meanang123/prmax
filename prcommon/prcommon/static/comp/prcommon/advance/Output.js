//-----------------------------------------------------------------------------
// Name:    Output.js
// Author:  Chris Hoy
// Purpose:	Options to output stuff
// Created: 30/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.advance.Output");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.advance.Output",
	[ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prcommon.advance","templates/Output.html"),
	constructor: function() {
		this._reportlist = new dojo.data.ItemFileReadStore( { url:"/reports/reporttemplates?reportsourceid=6"});
		this._labellist = new dojo.data.ItemFileReadStore( {url:"/common/lookups?searchtype=labels" });
		this._csvlist = new dojo.data.ItemFileReadStore( { url:"/reports/reporttemplates?reportsourceid=7"});

		this._completecall = dojo.hitch(this,this._complete);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.reportTemplateNode.store = this._reportlist;
		this.labelTemplateNode.store = this._labellist;
		this.csvTemplateNode.store = this._csvlist;
	},
	startup:function()
	{
		this.inherited(arguments);

		if (PRMAX.utils.settings.no_export == true )
			this.excelview.controlButton.domNode.style.display = "none";
	},
	Load:function( advancefeatureslistid, selection )
	{
		this.Clear();
		this.selectionNode.setOptions(selection);
		this.labelSelectionNode.setOptions(selection);
		this.csvSelectionNode.setOptions(selection);
		this.advancefeatureslistid_1.set("value",advancefeatureslistid);
		this.advancefeatureslistid_2.set("value",advancefeatureslistid);
		this.advancefeatureslistid_3.set("value",advancefeatureslistid);
	},
	_report:function()
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			this.reportButtonNode.cancel();
			return;
		}

		var content = this.formNode.get("value");

		content['reportoutputtypeid']=0;
		content['sortorder'] = 1;

		this.reportNode.SetCompleted(this._completecall);
		this.reportNode.StartNoDialog(content);
	},
	_complete:function()
	{
		// need to close dialog
		dojo.publish(PRCOMMON.Events.Dialog_Close,["adv_out"]);
		this.labelReportButtonNode.cancel();
		this.labelReportNode.hide();
		this.reportButtonNode.cancel();
		this.reportNode.hide();
	},

	Clear:function(selected_rows)
	{
		this.labelReportButtonNode.cancel();
		this.reportButtonNode.cancel();
		this.csvReportButtonNode.cancel();

		this.labelReportNode.Stop();
		this.labelSelectionNode.setOptions(selected_rows);

		this.reportNode.Stop();
		this.selectionNode.setOptions(selected_rows);

		this.csvReportNode.Stop();
		this.csvSelectionNode.setOptions(selected_rows);


	},
	resize:function()
	{
		this.tabcont.resize(arguments[0]);
	},
	// Labels
	_labelreport:function()
	{
		if ( ttl.utilities.formValidator(this.labelFormNode)==false)
		{
			alert("Not all required field filled in");
			this.labelReportButtonNode.cancel();
			return;
		}
		if (ttl.utilities.testPopUpBlocker()==true)
		{
			alert("Pop-up blocked");
			this.labelReportButtonNode.cancel();
			return;
		}

		var content = this.labelFormNode.get("value");

		content['reporttemplateid'] = 0 ;
		content['reportoutputtypeid'] = 3;
		content['sortorder'] = PRMAX.search.getSortIndex();
		content['searchtypeid'] = 10;

		this.labelReportNode.SetCompleted(this._completecall);
		this.labelReportNode.StartNoDialog(content);
	},
	_csvreport:function()
	{
		if ( ttl.utilities.formValidator(this.csvFormNode)==false)
		{
			alert("Not all required field filled in");
			this.csvReportButtonNode.cancel();
			return;
		}
		var content = this.csvFormNode.get("value");

		content['reportoutputtypeid']=2;
		content['sortorder'] = PRMAX.search.getSortIndex();
		content['searchtypeid'] = 10;

		this.csvReportNode.SetCompleted(this._completecall);
		this.csvReportNode.StartNoDialog(content);
	}
});
