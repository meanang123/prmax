require({cache:{
'url:research/projects/templates/create.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:150px;width:100%\"'>\r\n\t\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-event='onsubmit:_ReturnFalse' data-dojo-attach-point=\"form\">\r\n\t\t\t<table width=\"550px\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse\" >\r\n\t\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" width=\"250px\" >Name:</td><td colspan=\"2\"><input data-dojo-props='style:\"width:300px\",\"class\":\"prmaxrequired\",name:\"researchprojectname\",type:\"text\",maxlength:\"80\",trim:true,required:true' data-dojo-attach-point=\"researchprojectname\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">User:</td><td colspan=\"2\"><select data-dojo-attach-point=\"iuserid\" data-dojo-props='name:\"iuserid\",autoComplete:\"true\",style:\"width:15em\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\"></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Is Monthly</td><td colspan=\"2\"><input data-dojo-attach-point=\"ismonthly\" data-dojo-props='name:\"ismonthly\",type:\"checkbox\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onChange:_is_monthly\"></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"start_date_view\" class=\"prmaxhidden\"><td class=\"prmaxrowtag\" align=\"right\">Start Date</td><td><input data-dojo-attach-point=\"startdate\" data-dojo-ptops='type:\"text\",name:\"startdate\",required:false,style:\"width:10em\"' data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Questionnaire Completion Date</td><td><input data-dojo-attach-point=\"questionnaire_completion\" data-dojo-ptops='type:\"text\",name:\"questionnaire_completion\",required:true,style:\"width:10em\"' data-dojo-type=\"dijit/form/DateTextBox\" ></td><td align=\"right\"><button data-dojo-attach-event=\"onClick:_create\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxbuttonlarge\",label:\"Create Projects\"' ></button></td></tr>\r\n\t\t\t</table>\r\n\t\t\t<br/>\r\n\t\t</div>\r\n\t</form>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='gutters:false,region:\"left\",style:\"width:50%;height:100%\"'>\r\n\t\t<div data-dojo-attach-point=\"tabcont\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='title:\"Search\",style:\"width:100%;height:100%;overflow:hidden\",gutters:false'>\r\n\t\t\t\t<div data-dojo-attach-point=\"search_tabcont\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"search_tab_outlet\" data-dojo-type=\"prcommon2/search/OutletSearch\" data-dojo-props='style:\"height:100%;overflow:auto;overflow-x:hidden\",\"class\":\"scrollpanel\",title:\"Outlet\"'></div>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"search_tab_freelance\" data-dojo-type=\"prcommon2/search/FreelanceSearch\" data-dojo-props='style:\"height:100%;overflow:auto;overflow-x:hidden\",\"class\":\"scrollpanel\",title:\"Freelance\"'></div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:15%;padding-top:10px\"'>\r\n\t\t\t\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse;\" >\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_clear_search\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Results\"' ></button></td>\r\n\t\t\t\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_clear_search_criteria\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Criteria\"' ></button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"searchbutton\" data-dojo-attach-event=\"onClick:_search\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",iconClass:\"dijitPrmaxIcon dijitPrmaxIconSearch\",busyLabel:\"Searching...\",label:\"Search\"'></button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"height:100%;width:100%\",title:\"Generate a  Monthly Sets\",\"class\":\"common_prmax_layout\"'>\r\n\t\t\t\t<br/>\r\n\t\t\t\t<label class=\"label_1\">Month</label><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"month\" data-dojo-props='name:\"month\",autoComplete:true,searchAttr:\"name\",required:true,labelType:\"html\"'></select>\r\n\t\t\t\t<button data-dojo-attach-point=\"search_monthly\" data-dojo-attach-event=\"onClick:_search_monthly\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Build Monthly\"' ></button><br/><br/>\r\n\t\t\t\t<button data-dojo-attach-event=\"onClick:_clear_search\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Results\"'></button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='gutters:false,region:\"center\",splitter:true'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='region:\"top\",style:\"height:40px;width:100%;padding:0px;margin:0px\"'>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true'></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    create.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/projects/create", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/create.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/date",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DateTextBox" ,
	"prcommon2/search/OutletSearch",
	"prcommon2/search/FreelanceSearch"
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, topic,  lang, ItemFileReadStore, Grid, JsonRest, Observable, DojoDate, domclass ){
 return declare("research.projects.create",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._load_call_back = lang.hitch(this, this._load_call ) ;
		this._add_call_back = lang.hitch(this, this._add_call ) ;
		this._clear_search_call_back = lang.hitch(this,this._clear_search_call);
		this._search_monthly_call_back = lang.hitch(this, this._search_monthly_call);
		this._delete_search_row_call_back = lang.hitch(this,this._delete_search_row_call);

		this._users = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});
		this.model =  new Observable( new JsonRest( {target:'/search/list_rest?searchtypeid=5&research=1', idProperty:"sessionsearchid"}));
		this._months = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=months"});
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.iuserid.set("store",this._users);
		this.iuserid.set("value", -1);
		this.startdate.set("value",new Date());
		this.questionnaire_completion.set("value", DojoDate.add(new Date(),"month",1));
		this.month.set("store",this._months);
		this.month.set("value",1);


		var cells =
		[
		{label: '  ', className:"grid-field-image-view", field:"sessionsearchid",formatter:utilities2.format_row_ctrl},
		{label: 'Name',className:"standard",field:"outletname"},
		{label: 'Contact',className:"standard",field:"contactname"},
		{label: 'Desk',className:"standard",field:"deskname"},
		{label: 'Source',className:"dgrid-column-type-small",field:"sourcename"},
		{label: 'Id', className:"dgrid-column-nbr-right",field:"outletid"}
		];

		this.grid = new Grid({
			columns: cells,
			selectionMode: "none",
			store: this.model
		});

		this.grid_view.set("content", this.grid);
		this.grid.on(".dgrid-row:click",lang.hitch(this,this._on_cell_call));
	},
	_on_cell_call:function(e)
	{
		var cell = this.grid.cell(e);

		if ( cell.column.id == "0" )
		{
			if ( confirm("Remove from results?"))
			{
				request.post('/search/delete_session_row',
					utilities2.make_params({data:{searchtypeid: 5, sessionsearchid:cell.row.data.sessionsearchid}})).then
					(this._delete_search_row_call_back);
			}
		}
	},
	_delete_search_row_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.model.remove( response.sessionsearchid);
		}
	},
	_clear_search_call:function( response )
	{
		this.grid.set("query",{});
	},
	_clear_search:function()
	{
		request.post('/search/sessionclear',
			utilities2.make_params({data:{searchtypeid: 5}})).then
				(this._clear_search_call_back);
	},
	_clear_search_results:function( response )
	{
		if ( response.success == "OK")
		{
			this._load_call();
		}
	},
	_is_empty:function( content )
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
	_get_form:function()
	{
		var form = null;

		dojo.every(this.search_tabcont.selectedChildWidget.getChildren(),
			function(widget)
			{
				if ( widget.formid != null)
					form = widget;
			});
		return form;
	},
	_search:function( )
	{
		var form = this._get_form();

		form.setExtendedMode(false);
		var content = form.get("value");

		content['mode'] = 0;
		content['search_partial'] = 2
		content['searchtypeid'] = 5

		request.post('/search/dosearch',
			utilities2.make_params( {data:content})).then
			(this._load_call_back);
	},
	_load_call:function( response )
	{
		this.searchbutton.cancel();
		this.grid.set("query",{});
	},
	_clear:function()
	{
		this.grid.set("query",{});
		this.iuserid.set("value", -1 ) ;
		this.researchprojectname.set("value","");
		this.startdate.set("value",new Date());
		this.questionnaire_completion.set("value", DojoDate.add(new Date(),"month",1));
		this.ismonthly.set("checked",false);

		this.researchprojectname.focus();
	},
	_add_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Project Added");
			topic.publish("/project/add",response.data);
			this._clear();

		}
		else if ( response.success == "DU")
		{
			alert("Project Already Exists");
			this.researchprojectname.focus();
		}
		else
		{
			alert("Problem adding Project");
			this.researchprojectname.focus();
		}
	},
	_create:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.searchbutton.cancel();
			throw "N";
		}

		var tmp = this.form.get("value");

		if (this.ismonthly.get("checked"))
			tmp["startdate"] = utilities2.to_json_date(this.startdate.get("value"));

		tmp["questionnaire_completion"] = utilities2.to_json_date(this.questionnaire_completion.get("value"));

		if ( confirm("Add Project"))
		{
				request.post('/research/admin/projects/projects_add',
				utilities2.make_params({data:tmp})).then
				(this._add_call_back);
		}
	},
	_search_monthly:function()
	{
		request.post('/research/admin/projects/generate_monthly',
			utilities2.make_params( {data:{month:this.month.get("value")}})).then
			(this._search_monthly_call_back);
	},
	_search_monthly_call:function( response)
	{
		if ( response.success == "OK")
		{
			this.ismonthly.set("checked",true);
			this.iuserid.set("value", -1);
			var today = new Date();
			this.researchprojectname.set("value", "Monthly Build " + today.getDate() + "/" + (today.getMonth()+1) + "/" + (today.getFullYear()-2000));
			this._load_call( response);
		}
		else
		{
			alert("Problem Building");
		}
	},
	_clear_search_criteria:function()
	{
		this.search_tab_outlet.clear();
		this.search_tab_freelance.clear();
	},
	_is_monthly:function()
	{
		if ( this.ismonthly.get("checked"))
		{
			domclass.remove(this.start_date_view,"prmaxhidden");
			this.startdate.set("required",true);
		}
		else
		{
			domclass.add(this.start_date_view,"prmaxhidden");
			this.startdate.set("required",false);
		}
	}
});
});





