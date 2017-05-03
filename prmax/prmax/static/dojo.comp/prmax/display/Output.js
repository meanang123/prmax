dojo.provide("prmax.display.Output");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.display.Output",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		selection :-1,
		templatePath: dojo.moduleUrl( "prmax.display","templates/Output.html"),
	constructor: function() {
		this._reportlist = new dojox.data.QueryReadStore(
		{	url:"/reports/reporttemplates?reportsourceid=2",
			onError:ttl.utilities.globalerrorchecker
		});
		csv_typeid=(PRMAX.utils.settings.customertypeid==18)?10:3;
		this._csvlist = new dojo.data.ItemFileReadStore ( { url:"/reports/reporttemplates?reportsourceid="+csv_typeid});
		this._labellist = new dojox.data.QueryReadStore(
		{	url:"/common/lookups?searchtype=labels",
			onError:ttl.utilities.globalerrorchecker
		});

		this._completecall = dojo.hitch(this,this._complete);
		this._csvcompletecall = dojo.hitch(this,this._csvcomplete);
		this._labelcompletecall = dojo.hitch(this,this._labelcomplete);
	},
	postCreate:function()
	{
		this.reportTemplateNode.store = this._reportlist;
		this.csvTemplateNode.store = this._csvlist;
		this.labelTemplateNode.store = this._labellist;

		dojo.connect(this.formNode,"onSubmit",dojo.hitch(this,this._Submit));
		dojo.connect(this.csvFormNode,"onSubmit",dojo.hitch(this,this._csvSubmit));
		dojo.connect(this.labelFormNode,"onSubmit",dojo.hitch(this,this._labelSubmit));
		this.selectionNode.setOptions(this.selection);
		this.csvSelectionNode.setOptions(this.selection);
		this.labelSelectionNode.setOptions(this.selection);

		this.csvTemplateNode.set("value",4);

		this.inherited(arguments);
	},
		startup:function()
	{
		this.inherited(arguments);

		if (PRMAX.utils.settings.no_export == true )
		{
			this.excelview.controlButton.domNode.style.display = "none";
			this.tabcont.selectChild(this.reports);
		}
	},
	_report:function()
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			this.reportButtonNode.cancel();
			return;
		}
		dojo.addClass( this.report_notshown, "prmaxhidden");
		this.formNode.submit();
	},
	_csvreport:function()
	{
		if ( ttl.utilities.formValidator(this.csvFormNode)==false)
		{
			alert("Not all required field filled in");
			this.csvReportButtonNode.cancel();
			return;
		}
		dojo.addClass( this.csv_notshown, "prmaxhidden");
		this.csvFormNode.submit();
	},
	_Submit:function()
	{
		var content = this.formNode.get("value");

		console.log("content", content)

		content['reportoutputtypeid']=0;
		content['sortorder'] = PRMAX.search.getSortIndex();
		content['searchtypeid'] = 1;

		this.reportNode.SetCompleted(this._completecall);
		this.reportNode.StartNoDialog(content);
	},
	_csvSubmit:function()
	{
		var content = this.csvFormNode.get("value");

		//content['reporttemplateid'] = 4 ;
		content['reportoutputtypeid']=2;
		content['sortorder'] = PRMAX.search.getSortIndex();
		content['searchtypeid'] = 1;

		console.log ( content ) ;

		this.csvReportNode.SetCompleted(this._csvcompletecall);
		this.csvReportNode.StartNoDialog(content);
	},
	_complete:function()
	{
		// need to close dialog
		PRMAX.search.stdDialog.hide();
		this.reportButtonNode.cancel();
		dojo.removeClass( this.report_notshown, "prmaxhidden");
		dojo.attr(this.report_link, "href", "/reports/viewpdf?reportid="+ this.reportNode.reportid.value);
		console.log("_complete");
		this.reportNode.hide();
	},
	_csvcomplete:function()
	{
		// need to close dialog
		PRMAX.search.stdDialog.hide();
		this.csvReportButtonNode.cancel();
		dojo.removeClass( this.csv_notshown, "prmaxhidden");
		dojo.attr(this.csv_link, "href", "/reports/viewcsv?reportid="+ this.csvReportNode.reportid.value);
		this.csvReportNode.hide();
	},
	_labelcomplete:function()
	{
		// need to close dialog
		PRMAX.search.stdDialog.hide();
		this.labelReportButtonNode.cancel();
		dojo.removeClass( this.label_notshown, "prmaxhidden");
		dojo.attr(this.label_link, "href", "/reports/viewpdf?reportid="+ this.labelReportNode.reportid.value);
		this.labelReportNode.hide();
	},

	Clear:function(selected_rows)
	{
		this.csvReportButtonNode.cancel();
		this.csvSelectionNode.setOptions(selected_rows);
		this.csvReportNode.Stop();

		this.labelReportButtonNode.cancel();
		this.labelReportNode.Stop();
		this.labelSelectionNode.setOptions(selected_rows);

		this.reportButtonNode.cancel();
		this.reportNode.Stop();
		this.selectionNode.setOptions(selected_rows);
	},
	resize:function()
	{
		this.tabcont.resize(arguments[0]);
	},
	// Labels
	//
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

		dojo.addClass( this.label_notshown, "prmaxhidden");
		this.labelFormNode.submit();
	},
	_labelSubmit:function()
	{

		var content = this.labelFormNode.get("value");

		content['reporttemplateid'] = 0 ;
		content['reportoutputtypeid']=3;
		content['sortorder'] = PRMAX.search.getSortIndex();
		content['searchtypeid'] = 1;

		this.labelReportNode.SetCompleted(this._labelcompletecall);
		this.labelReportNode.StartNoDialog(content);
	}
});
