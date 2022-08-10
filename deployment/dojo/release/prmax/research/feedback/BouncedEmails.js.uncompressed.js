require({cache:{
'url:research/feedback/templates/BouncedEmails.html':"<div>\r\n\t\t<div  data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props=\"region:'left',splitter:true,'class':'bordered',style:'height:100%;width:40%',gutters:false\">\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:42px;width:100%;overflow:hidden\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t\t\t<div data-dojo-attach-event=\"onClick:_refresh\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxCommonRefresh\"'><span>Refresh</span></div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" data-dojo-props='title:\"Filter By\"' data-dojo-attach-event=\"execute:_execute\">\r\n\t\t\t\t\t\t\t<table>\r\n\t\t\t\t\t\t\t\t<tr><td><label>Exclude Auto Reply</label></td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"autoreply\" data-dojo-props='type:\"checkbox\",name:\"autoreply\"' ></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td><label>Outlet Name</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletname\" data-dojo-props='type:\"text\",name:\"outletname\"' ></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td><label>Email Address</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"emailaddress\" data-dojo-props='type:\"text\",name:\"emailaddress\"' ></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td><label>Customer</label></td><td><select data-dojo-attach-point=\"customers\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"icustomerid\",autoComplete:true,searchAttr:\"customername\",labelType:\"html\"' ></select></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td><label>Top 50 PRmax</label></td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"top50\" data-dojo-props='type:\"checkbox\",name:\"top50\"' ></td></tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter by</button></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"result_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"'></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"tabcont\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props=\"region:'center',splitter:true,'class':'bordered'\">\r\n\t\t\t<div data-dojo-attach-point=\"msg_basic_display\"  data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props=\"title:'Message',style:'height:100%;width:100%;overflow :auto','class':'bordered scrollpane',selected:'selected'\"></div>\r\n\t\t\t<div data-dojo-attach-point=\"msg_display\"  data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props=\"title:'Original',style:'height:100%;width:100%;overflow :auto','class':'bordered scrollpanel'\"></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props=\"preload:false,title:'Details','class':'bordered'\">\r\n\t\t\t\t<div title=\"blank\" data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\" selected class=\"bordered\"></div>\r\n\t\t\t\t<div title=\"outlet\" data-dojo-attach-point=\"outletedit\" data-dojo-type=\"research/outlets/OutletEdit\" data-dojo-props='style:\"width:100%;height:100%\",\"class\":\"bordered\"'></div>\r\n\t\t\t\t<div title=\"freelance\" data-dojo-attach-point=\"freelanceedit\" data-dojo-type=\"research/freelance/FreelanceEdit\" data-dojo-props='style:\"width:100%;height:100%\",\"class\":\"bordered\"'></div>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"isprivate\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\",\"class\":\"bordered\",title:\"isprivate\"'></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t<div data-dojo-attach-point=\"completed_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Bounced Email Completed\"'>\r\n\t\t<div data-dojo-attach-point=\"completed_ctrl\" data-dojo-type=\"research/feedback/Completed\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    BouncedEmails.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/06/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/feedback/BouncedEmails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../feedback/templates/BouncedEmails.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"research/outlets/OutletEdit",
	"research/freelance/FreelanceEdit",
	"dijit/Dialog",
		"research/feedback/Completed"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic ){
 return declare("research.feedback.BouncedEmails",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	mainViewString:"/display/outletmain?outletid=${outletid}",
	constructor: function()
	{
		this.results =  new Observable( new JsonRest( {target:'/research/admin/bemails/list_rest', idProperty:"bounceddistributionid"}));
		this._message_load_call_back = dojo.hitch (this, this._message_load_call );
		this._load_call_back = dojo.hitch(this, this._load_call);
		this._completed_call_back = dojo.hitch(this, this._completed_call);

		this.customer_front_id_data =  new Observable( new JsonRest( {target:'/research/admin/customers_combo', idProperty:"icustomerid"}));
		topic.subscribe(PRCOMMON.Events.BouncedEmail_Completed, lang.hitch(this,this._completed_event));
	},
	_completed_event:function( bounceddistributionid )
	{
		this.results.remove( bounceddistributionid);
		this.clear();
	},
	_completed_call:function ( responce )
	{
		if ( responce.success == "OK")
		{
			this.results.remove( this._row.bounceddistributionid );
			this.clear();
			alert("Email marked as Ignored");
		}
		else
		{
			alert("Problem");
		}
	},
	clear:function()
	{
		this.controls.selectChild( this.blank );
		this.msg_display.set("content","");
		this.msg_basic_display.set("content","");
		this.completed_dlg.hide();
	},
	postCreate:function()
	{
		var cells =
		[
			{label: " ",className:"grid-field-image-view",formatter:utilities2.format_row_ctrl},
			{label: " ",className:"grid-field-image-view",formatter:utilities2.delete_row_ctrl},
			{label: 'Source',className:"dgrid-column-status-small",field:"sourcename"},
			{label: 'Date',className:"dgrid-column-date-small",field:"createdate_display"},
			{label: 'Outlet Name',className: "dgrid-column-address-short",field:"outletname"},
			{label: 'Name', className:"dgrid-column-address-short",field:"contactname"},
			{label: 'Job title',className: "dgrid-column-address-short",field:"job_title"},
			{label: 'Subject',className: "dgrid-column-address-short",field:"subject"},
			{label: 'Sent Customer',className: "dgrid-column-address-short",field:"customername"},
			{label: 'Owner',className:"dgrid-column-address-short",field:"ownercustomername"}
		];

		this.result_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.results
		});

		this.result_grid_view.set("content", this.result_grid);
		this.result_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.customers.set("store",this.customer_front_id_data);

		this.inherited(arguments);
	},
	_on_cell_call : function(e)
	{
		var cell = this.result_grid.cell(e);

		if ( cell == null || cell.row == null) return ;

		this._row = cell.row.data;
		this._e = e;

		if ( cell.column.id == "0")
		{
			this.completed_ctrl.load ( this._row.bounceddistributionid);
			this.completed_dlg.show();
		}
		else if ( cell.column.id == "1" )
		{
			if ( confirm("Mark as Ignore"))
			{
				request.post('/research/admin/bemails/mark_as_ignore',
					utilities2.make_params({ data : {bounceddistributionid:this._row.bounceddistributionid}})).then
					( this._completed_call_back );
			}
		}
		else
		{
			request.post('/research/admin/bemails/get_and_lock',
				utilities2.make_params({ data: {bounceddistributionid:this._row.bounceddistributionid}})).then
				(this._load_call_back);
		}
	},
	_load_call:function ( responce )
	{
		if ( responce.success == "OK" )
		{
			this._load_details();
		}
		else if ( responce.success == "LO" )
		{
			alert("This record is locked by " + responce.lock.username ) ;
		}
		else
		{
			alert("Problem accessing record");
		}
	},
	_load_details:function()
	{
		if ( this._row.owneroutletid != -1 || this._row.owneremployeeid != -1 )
		{
			this.isprivate.set("href",dojo.string.substitute(this.mainViewString,{outletid:this._row.outletid}));
			this.controls.selectChild ( this.isprivate );
		}
		else if ( this._row.prmax_outlettypeid == 42 )
		{
			this.controls.selectChild ( this.freelanceedit);
			this.freelanceedit.Load ( this._row.outletid );
		}
		else if ( this._row.prmax_outlettypeid != null )
		{
			this.controls.selectChild ( this.outletedit);
			this.outletedit.load ( this._row.outletid );
		}
		else
		{
			this.controls.selectChild ( this.blank);
		}
		this.tabcont.selectChild ( this.msg_basic_display ) ;
		this.msg_basic_display.set("href",dojo.string.substitute(this.MsgBasicView,{bounceddistributionid:this._row.bounceddistributionid}));
		this.msg_display.set("href",dojo.string.substitute(this.MsgView,{bounceddistributionid:this._row.bounceddistributionid}));
	},
	MsgView:"/research/admin/bemails/msg_display?bounceddistributionid=${bounceddistributionid}",
	MsgBasicView:"/research/admin/bemails/msg_basic_display?bounceddistributionid=${bounceddistributionid}",
	_message_load_call:function ( responce )
	{

	},
	_refresh:function()
	{
		this._clear_filter();
	},
	_clear_filter:function()
	{
		this.autoreply.set("checked", false);
		this.outletname.set("value","");
		this.emailaddress.set("value","");
		this.customers.set("value",null);
		this.result_grid.set("query", filter );
	},
	_execute:function()
	{
		var filter = {};

		if (arguments[0].autoreply == "on")
			filter["autoreply"] = true;
		if (arguments[0].top50 == "on")
			filter["top50"] = true;
		if ( arguments[0].outletname.length > 0 )
			filter["outletname"] = arguments[0].outletname;
		if ( arguments[0].emailaddress.length > 0 )
			filter["emailaddress"] = arguments[0].emailaddress;
		if ( arguments[0].icustomerid > 0 )
			filter["icustomerid"] = arguments[0].icustomerid;

		this.result_grid.set("query", filter);
		this.clear();
	}
});
});





