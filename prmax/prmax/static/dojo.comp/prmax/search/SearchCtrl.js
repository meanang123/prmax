//-----------------------------------------------------------------------------
// Name:    prmax.search.SearchCtrl
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.search.SearchCtrl");

dojo.require("prcommon.search.Countries");

dojo.declare("prmax.search.SearchCtrl", null, {
	constructor: function() {
		this.advance_mode = 0 ;
		this.mode_append_search=1;
		this.mode_new_search=0;
		this.search_forms = ["std_search_employee_form","std_search_freelance_form","std_search_outlet_form","std_search_quick_form","std_search_mps_form", "std_search_advance_form","std_search_crm_form"];
		this.search_tabs = ["std_search_employee","std_search_freelance","std_search_outlet","std_search_quick","std_search_mps", "std_search_advance","std_search_crm"];
		this.mode = PRMAX.utils.settings.searchappend;

		dojo.subscribe(PRCOMMON.Events.Search_Total, dojo.hitch(this,this._SearchCountEvent));
		this._SearchCountCallBack = dojo.hitch(this,this._SearchCount);
	},
	onLoadSearchControl:function()
	{
		dojo.connect(dijit.byId("std_search_clear"),"onClick", dojo.hitch(this,this.Clear));
		dojo.connect(dijit.byId("std_search_search"),"_onClick", dojo.hitch(this,this.doSearch));
		dojo.connect(dijit.byId("std_search_last"),"onClick", dojo.hitch(this,this._LoadCriteria));

		this._LoadCallBack = dojo.hitch(this,this._Results);
		this.tabContainer = dijit.byId("std_search_tabcontainer");
		this.search_dialog = dijit.byId("search_dialog");
		this._search_cancel = dijit.byId("std_search_search");
		this._search_append = dijit.byId("search_append");
		this._search_partial = dijit.byId("search_partial");
		this._std_search_search = dijit.byId("std_search_search");

		dojo.connect(this._search_append,"onClick", dojo.hitch(this,this._ChangeMode));
		//dojo.connect(this._search_partial,"onClick", dojo.hitch(this,this._PartialMatch));
		dojo.connect(dijit.byId("std_search_total_button"),"onClick", dojo.hitch(this,this._SearchFindActualTotal));
		this.SetAppendMode();

		for ( var key = 1 ; key< 6 ; key++ )
		{
			var button = ttl.utilities.getTabButton(this.tabContainer,key);
			dojo.subscribe(this.tabContainer.id+"-selectChild", dojo.hitch(this,this.onSelectTab));
		}

		for ( var key in this.search_tabs )
		{
			var name = this.search_tabs[key];
			dojo.connect( dijit.byId(name),"onLoad", dojo.hitch(this,this._Test,name));
		}
	},
	_Test:function( name )
	{
		dojo.connect( dijit.byId(name + "_form"),"onSubmit",dojo.hitch(this,this._Submit,name));
	},
	_Submit:function( mouse, name )
	{
		this._std_search_search.makeBusy();
		try
		{
			this.doSearch ( name ) ;
		}
		finally
		{
			this._std_search_search.cancel();
		}
	},
	_LoadCriteria:function()
	{
		console.log("_LoadCriteria", this.content);

		this.Clear();
		var form = dijit.byId(this.tabContainer.selectedChildWidget.id+"_form");
		form.setExtendedMode(false);
		form.set("value",this.content);
		form.setExtendedMode(false);
	},
	_SaveCriteria:function()
	{
		var form = dijit.byId(this.tabContainer.selectedChildWidget.id+"_form");

		form.setExtendedMode(true);
		try
		{
			this.content = form.get("value");
			console.log("_SaveCriteria", this.content);
		}
		finally
		{
			form.setExtendedMode(false);
		}
	},
	_PartialMatch:function()
	{
		// partial match flag chnaged need to update found value
		var command  = {
			partial:this._search_partial.get("value"),
			search: this.tabContainer.selectedChildWidget.id};

		dojo.publish(PRCOMMON.Events.Search_PartialMatch, [command] );
	},
	_ChangeMode:function()
	{
		this.mode = this._search_append.get("checked")? this.mode_append_search:this.mode_new_search;
		console.log(this.mode);
		this._setTitle();
	},
	SetAppendMode:function()
	{
		this._search_append.set("checked",this.mode==this.mode_new_search?false:true);
		this._setTitle();
	},
	Clear:function()
	{
		this._search_cancel.cancel();
		for(var key in this.search_forms)
		{
			var form = dijit.byId(this.search_forms[key]);
			if (form)
			{
				dojo.every(form.getDescendants(),
					function(widget){
						if ( widget.Clear != null)
						{
							widget.Clear();
						}
						return true;
	 				});
			}
			//dijit.byId("search_total_count").set("value","&nbsp;");
			//this._search_partial.set("checked",PRMAX.utils.settings.usepartialmatch);
			this.mode = PRMAX.utils.settings.searchappend;
			this._search_append.set("checked",this.mode);
		}
	},
	_Results:function(response)
	{
		if ( response.success == "FA"  )
		{
			alert("No Result Found");
			this._search_cancel.cancel();
			return ;
		}
		ttl.utilities.showMessageStd("Please Wait Loading Page ..............",1000);
		dojo.publish(PRCOMMON.Events.SearchSession_Changed , [response.data,this.mode,this.advance_mode]);
		this._SaveCriteria();

		if ( response.data.total == 0)
		{
			alert("No Result Found");
		}
		else
		{
			this.search_dialog.hide();
		}
		this._search_cancel.cancel();
	},
	doSearchError:function()
	{
		ttl.utilities.errorchecker(arguments);
		this._search_cancel.cancel();
	},
	doSearch:function( )
	{
		this._Search(this.tabContainer.selectedChildWidget.id+"_form");
	},
	_Search:function( fname )
	{
		var form = dijit.byId( fname ) ;

		form.setExtendedMode(false);
		var content = form.get("value");
		var partial = dijit.byId("search_partial");

		console.log("doSearch",content);

		if ( this._IsEmpty(content) == true )
		{
			alert("No Search Criteria Specified");
			this._search_cancel.cancel();
			return ;
		}
		else
		{
			// This is a special case for
			if ( fname=="std_search_outlet_form")
			{
				var field = dijit.byId(  "search_outlet_roles" ) ;
				if ( field != null && field.get("value").length>0 && field.get("IsDefault") == true && this._SearchCriteriaCount(content) == 1 )
				{
					alert("This search will return all outlets. Please select another criteria e.g. Media Channel");
					this._search_cancel.cancel();
					return ;
				}
			}
		}

		content['mode'] = this.mode?0:1;
		content['search_partial'] = partial? partial.checked?2:0:2;

		ttl.utilities.showMessageStd("Searching ..............",1000);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadCallBack,
						url:'/search/dosearch',
						content: content
						}));
	},
	// Determines if a search is empty
	_IsEmpty:function( content )
	{
		var search_type = content["search_type"];

		for(var item in content)
		{
			if (item.indexOf(search_type)!=-1)
			{
				if (content[item].length!=0)
				{
					return false;
				}
			}
		}
		return true;
	},
	_SearchCriteriaCount:function( content )
	{
		var search_type = content["search_type"];
		var retcount = 0;

		for(var item in content)
		{
			if (item.indexOf(search_type)!=-1)
			{
				if (content[item].length!=0)
					retcount += 1;
			}
		}
		return retcount;
	},


	_show:function()
	{
		this.focus();
	},
	show_search_form:function(mode)
	{
		if ( this.search_dialog == undefined )
		{
			var node = document.createElement("div");
			var href = "/layout/std_search";
			if (mode != null) href = href += "?mode=features";
			document.body.appendChild(node);
			var ww = new dijit.Dialog({	id:"search_dialog",
				href:href,
				title:"Search",
				style:"width:700px;height:500px;overflow:hidden",
				onLoad: dojo.hitch(this,this.onLoadSearchControl),
				onDownloadError:function(response)
					{
						ttl.utilities.errorchecker(response);
						return this.errorMessage;
					}
				},
				node);
			this.search_dialog = dijit.byId("search_dialog");
			dojo.connect(this.search_dialog,"show", dojo.hitch(this.search_dialog, this._show));
		}
		else
		{
			this.SetAppendMode();
			this.Clear();
		}

		return this.search_dialog;
	},
	_setTitle: function()
	{
		var ret ="Search ";

		if (this.mode==this.mode_new_search)
			ret+=" New List";
		else
			ret+=" Append to List";

		this.search_dialog.titleNode.innerHTML = ret;
	},
	_SearchCountEvent:function( params )
	{
	},
	_SearchFindActualTotal:function()
	{
		var form = dijit.byId(this.tabContainer.selectedChildWidget.id+"_form");

		form.setExtendedMode(false);
		var content = form.get("value");
		content['mode'] = this.mode==1?0:1;

		if (this._IsEmpty(content))
		{
			//dijit.byId("search_total_count").set("value","&nbsp;");
			return;
		}

		// need to check that their is actually search critieria
		var partial = dijit.byId("search_partial")
		content['search_partial'] = partial? partial.checked?2:0:0;

		this._search_transaction = PRCOMMON.utils.uuid.createUUID();
		content['transaction' ]  = this._search_transaction;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SearchCountCallBack,
				url:'/search/dosearchcount',
				content: content
		}));
	},
	_SearchCount:function ( response )
	{
		//if ( response.success=="OK" && this._search_transaction == response.transaction )
		//	dijit.byId("search_total_count").set("value",response.count);
	},
	startup_fields : {"std_search_quick":"std_search_quick_outletname",
		"std_search_outlet":"std_search_outlet_outlet_name",
		"std_search_mps":"std_search_mps_name",
		"std_search_freelance":"std_search_freelance_name",
		"std_search_employee":"std_search_employee_name_ext"
	},
	onSelectTab:function(button)
	{
		if (this.startup_fields[button.id] !== null && this.startup_fields[button.id] != undefined )
			dijit.byId(this.startup_fields[button.id]).focus();
	},
	focus:function()
	{
		console.log("focus", this.tabContainer.selectedChildWidget.id ) ;

		switch ( this.tabContainer.selectedChildWidget.id )
		{
		case "std_search_quick" :
			dijit.byId("std_search_quick_outletname").focus();
			break;
		case "std_search_outlet":
			console.log("focus here");
			dijit.byId("std_search_outlet_outlet_name").focus();
			console.log("focus here 2");
			break;
		case "std_search_employee":
			dijit.byId("std_search_employee_name_ext").focus();
			break;
		case "std_search_freelance":
			dijit.byId("std_search_freelance_name").focus();
			break;
		}
	},
	StartUpAdvance:function()
	{
		try {
			this.tabContainer.selectChild ( dijit.byId("std_search_advance") );
			}
		catch(e) {}
	},
	_setAdvanceModeAttr:function( mode )
	{
		this.advance_mode = mode ;
	},
	_getAdvanceModeAttr:function( )
	{
		return this.advance_mode;
	}

});
