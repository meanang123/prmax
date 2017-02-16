//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:  
// Purpose:
// Created: Sept 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../reports/templates/ReportBuilder.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/ProgressBar"],
	function(declare, BaseWidgetAMD, template, utilities2, request, lang, domstyle, domattr, domclass){

 return declare("prcommon2.reports.ReportBuilder",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		// initialise all the setting
		this._reportid = -1;
		this._current = 0;
		this._complete = null;

		// call back functions
		this._on_start_call_back  = lang.hitch(this,this._on_start_call);
		this._on_status_call_back= lang.hitch(this,this._on_status_call);
		this._get_report_build_status_back = lang.hitch(this,this._get_report_build_status);
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	SetCompleted:function( completed)
	{
		this._complete = completed;
	},	
	start:function ( inParams )
	{
		this._start( inParams );
	},
	_start:function( inParams )
	{
		this.clear();

		if ( inParams.searchtypeid == null )
			inParams.searchtypeid = -1 ;

		request.post ("/reports/start",
			utilities2.make_params({ data : inParams})).
			then ( this._on_start_call_back);
	},
	_on_start_call:function(response)
	{
		this._reportid = response.reportid;
		this._wait();
	},
	_wait:function()
	{
		if (this._reportid == -1)
		{
			this._complete(false);
		}
		else
		{
			++this._current;
			if (this._current>300)
			{
				this._complete(false);
			}
			else
			{
				setTimeout(this._get_report_build_status_back,2000);
			}
		}
	},
	_on_status_call:function(response)
	{
		if (response.success=="OK")
		{
			if (response.reportstatusid==0 || response.reportstatusid==1)
			{
				this._wait();
			}
			else
			{
				domattr.set(this.reportid, "value", this._reportid);
				domattr.set(this.reportForm, "action", "/reports/view/" + this._reportid);
				domattr.set(this.cache_buster, "value", new Date());
				this.reportForm.submit();
				this._complete(true);
			}
		}
		else
		{
			this.stop();
		}
	},
	stop:function()
	{
		this.clear();
		this._complete(false);
	},
	clear:function()
	{
		this._reportid = -1;
		this._current = 0;
	},
	_get_report_build_status:function()
	{
		if (this._reportid != -1 )
		{
			request.post("/reports/status",
				utilities2.make_params({ data : {reportid : this._reportid} })).
				then ( this._on_status_call_back );
		}
	}
});
});
