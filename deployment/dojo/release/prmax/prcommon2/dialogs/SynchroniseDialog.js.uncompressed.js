require({cache:{
'url:prcommon2/dialogs/templates/SynchroniseDialog.html':"<div>\r\n\t<table data-dojo-attach-point=\"waitbar\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr><td align=\"left\" valign=\"middle\" style=\"padding:0px 3px;width:100%;vertical-align:middle\" class=\"square_button_red\">\r\n\t\t\t<button data-dojo-props='type:\"button\",title:\"Cancel\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:stop\" data-dojo-attach-point=\"cancelbtn\"><i class=\"fa fa-times fa-lg\"></i>&nbsp;&nbsp;Cancel</button>\r\n\t\t</td>\r\n\t\t<td align=\"right\" valign=\"middle\" style=\"padding:5px 3px;vertical-align:'middle'\">\r\n\t\t\t<i class=\"fa fa-spinner fa-2x fa-pulse\" style=\"color:#4296d0\"></i>\r\n\t\t</td><td width=\"180px\" nowrap valign=\"middle\" style=\"padding: 6px 8px 6px 4px;vertical-align:'middle';\">\r\n\t\t\tPlease wait while synchronise series members...\r\n\t\t</td></tr>\r\n\t</table>\r\n</div>\r\n\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    BusyDialog.js
// Author:  
// Purpose:
// Created: 13/04/2017
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/dialogs/SynchroniseDialog", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../dialogs/templates/SynchroniseDialog.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/ProgressBar"],
	function(declare, BaseWidgetAMD, template, utilities2, request, lang, domstyle, domattr, domclass){

 return declare("prcommon2.dialogs.SynchroniseDialog",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		// initialise all the setting
		this._processqueueid = -1;
		this._current = 0;
		this._complete = null;
		this._outletid = '';

		// call back functions
		this._on_start_call_back  = lang.hitch(this,this._on_start_call);
		this._on_status_call_back= lang.hitch(this,this._on_status_call);
		this._get_processqueue_status_back = lang.hitch(this,this._get_processqueue_status);
		
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
		if (inParams['outletid'])
		{
			this._outletid = inParams['outletid'];		
		}
		this._start( inParams );
	},
	
	_start:function( inParams )
	{

		request.post ("/synchronise/start",
			utilities2.make_params({ data : inParams})).
			then ( this._on_start_call_back);

	},
	_on_start_call:function(response)
	{
		this._processqueueid = response.processqueueid;
		this._wait();
	},
	_wait:function()
	{
		if (this._processqueueid == -1)
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
				setTimeout(this._get_processqueue_status_back,2000);
			}
		}
	},

	_on_status_call:function(response)
	{
		if (response.success=="OK")
		{
			if (response.data.statusid==1 || response.data.statusid==2)
			{
				this._wait();
			}
			else
			{
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
		this._processqueueid = -1;
		this._current = 0;
	},
	_get_processqueue_status:function()
	{
		if (this._processqueueid != -1 )
		{
			request.post("/synchronise/status",
				utilities2.make_params({ data : {processqueueid : this._processqueueid, outletid:this._outletid} })).
				then ( this._on_status_call_back );
		}
	}	
});
});
