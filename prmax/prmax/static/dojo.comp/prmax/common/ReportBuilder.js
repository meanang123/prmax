//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.common.ReportBuilder");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.common.ReportBuilder",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.common","templates/ReportBuilder.html"),
		constructor: function()
		{
			// initialise all the setting `
			this._reportid = -1;
			this.maximum = 40;
			this._current = 1;
			this._complete = null;

			// call back functions
			this._OnStartCallBack  = dojo.hitch(this,this._OnStartCall);
			this._OnStatusCallBack= dojo.hitch(this,this._OnStatusCall);
			this._OnGetStatusCallBack = dojo.hitch(this,this._GetReportBuildStatus);
		},

		SetCompleted:function( completed)
		{
			// function used when the report has been created
			this._complete = completed;
		},
		StartNoDialog:function ( inParams )
		{
			// start report builder with no dialog but show the curren instance
			// of the control
			//this.domNode.style.display="block";
			dojo.style(this.domNode,{ display:"block" }); // show
			this._Start( inParams );
		},
		StartDialog:function( inParams )
		{
			dojo.style(this.domNode,{ display:"block" }); // show
			dijit.byId("std_report_dlg").show();
			this._Start( inParams );
		},
		_Start:function( inParams )
		{
			this._Clear();

			if ( inParams.searchtypeid == null )
				inParams.searchtypeid = -1 ;

			this.downloadProgress.update({ maximum: this.maximum, progress:this._current });
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._OnStartCallBack,
					url:"/reports/start",
					content: inParams}));
		},
		_OnStartCall:function(response)
		{
			console.log("_OnStartCall");
			this._reportid = response.reportid;
			this._Wait();
		},
		_Wait:function()
		{
			// do interface
			if (this._reportid == -1)
			{
				// do stop
				dijit.byId("std_report_dlg").hide();
			}
			else
			{
				++this._current;
				if (this._current>this.maximum)
				{
					dijit.byId("std_report_dlg").hide();
				}
				else
				{
					this.downloadProgress.update({ maximum: this.maximum, progress:this._current });
					setTimeout(this._OnGetStatusCallBack,2000);
				}
			}
		},
		_OnStatusCall:function(response)
		{
			if (response.success=="OK")
			{
				if ( response.reportstatusid==0 || response.reportstatusid==1)
				{
					this._Wait();
				}
				else
				{
					dojo.attr(this.reportid, "value", this._reportid);
					dojo.attr(this.reportForm, "action", "/reports/view/" + this._reportid);
					dojo.attr(this.reportForm, "action", "/reports/view/" + this._reportid);
					this.reportForm.submit();
					if (this._complete!=null)
						this._complete();
					dijit.byId("std_report_dlg").hide();
					dojo.style(this.domNode,{ display:"none" }); // show
				}
			}
			else
			{
				this.Stop();
			}
		},
		Stop:function()
		{
			this._Clear();
			dijit.byId("std_report_dlg").hide();
			dojo.style(this.domNode,{ display:"none" }); // show

		},
		_Clear:function()
		{
			this._reportid = -1;
			this._current = 1;
		},
		Clear:function()
		{
			this._Clear();
			this.downloadProgress.update({ maximum: this.maximum, progress:this._current });
		},
		hide:function()
		{
			dojo.style(this.domNode,{ display:"none" }); // hide
		},
		_GetReportBuildStatus:function()
		{
			if (this._reportid != -1 )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._OnStatusCallBack,
						url:"/reports/status",
						content: {reportid:this._reportid}}));
			}
		}
	}
);





