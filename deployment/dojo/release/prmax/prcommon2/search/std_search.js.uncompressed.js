//-----------------------------------------------------------------------------
// Name:    standard.js
// Author:  Chris Hoy
// Purpose: basic search field, This is a standard text field should be overridden
//			for ther fields such as dropdown list etc
// Created: 27/05/2008
//
// To do:
//			1. css settings for each field
//			2. use of table for layout to fixed?

//
//-----------------------------------------------------------------------------
define("prcommon2/search/std_search", [
	"dojo/_base/declare", // declare
	"dojo/request",
	"ttl/utilities2",
	"dojo/topic",
	"dijit/registry",
	"dojo/_base/lang",
	"dojo/dom-style"
	], function(declare, request, utilities2, topic, registry, lang, domstyle ){
 return declare("prcommon2.search.std_search",
	null,{
	commoncontrols:"search", // base name for the setting controls that might be used to control this control ie expand results etc
	dojoAttachEvent: "",
	dojoAttachPoint: "",
	waiRole: "",
	waiState:"",
	name:"",
	value:"",
	keytypeid:"",
	displayname:"",
	testmode:false,
	usepartial:false,
	search:"",
	min:0,
	searchTime:400,
	dointeractive:true,
	constructor: function()
	{
		this._load_call_back = lang.hitch(this,this._load_call);
		this._value = "";
		this._extended = false;
		this.open = false;
		this.searchTimer = null;

		topic.subscribe(PRCOMMON.Events.Search_PartialMatch, lang.hitch(this,this._partial_event));
	},
	_partial_event:function( command )
	{
		if (this.usepartial && command.search==this.search && this._value.length>0)
			this._get_selector (this._value, true ) ;
	},
	_setdisplay:function(value)
	{
		if (value.length==0)
			this.countnode.clear();
		else
			this.countnode.set("value",value);
	},
	// Load the details of a specific customer
	_load_call: function(response, ioArgs)
	{
		if (response.success=="OK")
		{
			if(this._transactionid == response.transactionid )
				this._setdisplay(response.count.toString());
		}
	},
	// Load the  customer into the system
	_send_request_count:function(value)
	{
		if (this.dointeractive)
		{
			// send the request to the server
			var content= this._capture_extended_content({keytypeid:this.keytypeid,fieldname:this.name,value:this._value});

			this._transactionid = PRCOMMON.utils.uuid.createUUID();
			content['transactionid'] = this._transactionid;

			request.post('/search/displaycount',
				utilities2.make_params_ignore({data:content})).
				then (this._load_call_back)
		}

		this.searchTimer = null;
	},
	_get_selector: function(value,force)
	{
		// value not changed
		if (this._value==value && force!=true) return ;
		// setup new value
		// if empty then simply clear
		this._value=value;
		if (this._value.length>this.min)
		{
			if (this.searchTimer)
			{
				clearTimeout ( this.searchTimer);
				this.searchTimer = null;
			}
			this.searchTimer = setTimeout(lang.hitch(this, this._send_request_count,value),this.searchTime);
		}
		else
		{
			this._setdisplay("");
		}

		topic.publish(PRCOMMON.Events.Search_Total, {search:this.search});
	},
	_capture_extended_content:function(stdfields)
	{
		// This need to capture the flags that may be avalible on the current
		// form
		// partial match need to check
		var partial = registry.byId("search_partial");
		var private_only = registry.byId(this.commoncontrols +"private");
		try
		{
			return dojo.mixin(stdfields,{
				partial:partial? partial.checked?2:0:2,
				private_only:private_only? private_only.attr("value"):0
				});
		}
		catch(e) { alert(e); }
	},
	_setExtendedAttr:function(value)
	{
		this._extended = value;
	},
	_getExtendedAttr:function()
	{
		return this._extended;
	},
	_toggle:function()
	{
		this.open = !this.open;
		this._toggle_cascade();
	},
	_toggle_cascade:function()
	{
		domstyle.set (this.selectarea,"display",this.open?"block":"none");
		this.togglectrl.src =  this.open?"/prmax_common_s/images/toclosed.gif":"/prmax_common_s/images/toopen.gif";

		if (this.open) this._focus();
	},
	clear:function()
	{
		this._make_closed();
		if (this.searchTimer)
		{
			clearTimeout ( this.searchTimer);
			this.searchTimer = null;
		}

	},
	_make_closed:function()
	{
		if (this.open==true)
			this._toggle();
	},
	make_open:function()
	{
		this.open=false;
		this._toggle();
	}
});
});





