require({cache:{
'url:prmaxquestionnaires/pages/templates/Journalists.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:50%;height:100%\",splitter:true,region:\"left\",gutters:true'>\r\n\t\t<div data-dojo-attach-point=\"outlet_contact_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='splitter:false,region:\"center\"'></div>\r\n\t\t<div data-dojo-props='region:\"bottom\",style:\"width:100%;height:44px\"' data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t\t\t<table style=\"width:100%;border-collapse:collapse;\" border=\"0\">\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_show_add\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Add Journalist\"'></button></td>\r\n\t\t\t\t\t\t<td><p>Click on a name to edit the details of the journalist</p></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"contact_edit_container\" data-dojo-props='region:\"center\",splitter:true' >\r\n\t\t<div data-dojo-props='title:\"blank_cont_view\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" ></div>\r\n\t\t<div data-dojo-props='title:\"contact_edit\"' data-dojo-attach-point=\"contact_edit_view\" data-dojo-type=\"dijit/layout/BorderContainer\">\r\n\t\t\t<div data-dojo-props='title:\"contact_edit\",\"class\":\"scrollpanel\",region:\"center\"' data-dojo-attach-point=\"contact_edit\" data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t\t\t<input data-dojo-props='type:\"hidden\",name:\"objectid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"objectid\">\r\n\t\t\t\t\t<input data-dojo-props='type:\"hidden\",name:\"questionnaireid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"questionnaireid\">\r\n\t\t\t\t\t<input data-dojo-props='type:\"hidden\",name:\"typeid\",value:\"E\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"typeid\">\r\n\t\t\t\t\t<p class=\"prmaxrowdisplaylarge\" style=\"text-align:center\" data-dojo-attach-point=\"contact_mode\"></p>\r\n\t\t\t\t\t<table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"1\" cellpadding=\"1\" border=\"0\">\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Contact</td>\r\n\t\t\t\t\t\t\t<td>\r\n\t\t\t\t\t\t\t\t<table style=\"width:99%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" width=\"50px\" >Prefix</td><td class=\"prmaxrowtag\" width=\"120px\" >First</td>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<td class=\"prmaxrowtag\">Surname</td>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 2em\",\"class\":\"prmaxinput\",name:\"prefix\"' data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t\t\t\t<td><input data-dojo-props= '\"class\":\"prmaxinput\",name:\"firstname\",style:\"width: 5em;\",type:\"text\",trim:true' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t\t\t\t<td><input data-dojo-attach-point=\"familyname\" data-dojo-props='name:\"familyname\", type:\"text\", trim:true, required:\"true\",style:\"width: 18em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td>\r\n\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"job_title\",type:\"text\",maxlength:80,trim:true,required:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Direct Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",size:25,maxlength:40' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",size:25,maxlength:40' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"mobile\",type:\"text\",size:25,maxlength:40' data-dojo-attach-point=\"mobile\" data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td ><input data-dojo-attach-point=\"email\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:90%\",maxlength:70'></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",type:\"text\",maxlength:80,trim:true,style:\"width:70%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Different Address</td><td><input data-dojo-props='name:\"alt_address\",type:\"checkbox\"' data-dojo-attach-point=\"no_address\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_address_show\" /><p style=\"display:inline;padding:0px;margin:0px\">&nbsp;(If a journalist has a different address to the outlet tick the box)</p></td></tr>\r\n\t\t\t\t\t\t<tr data-dojo-attach-point=\"addr1\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address1\",type:\"text\",trim:true,invalidMessage:\"Please enter address\",style:\"width:90%\"'></input></td></tr>\r\n\t\t\t\t\t\t<tr data-dojo-attach-point=\"addr2\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:90%\"'></input></td></tr>\r\n\t\t\t\t\t\t<tr data-dojo-attach-point=\"addr3\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td></tr>\r\n\t\t\t\t\t\t<tr data-dojo-attach-point=\"addr4\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td></tr>\r\n\t\t\t\t\t\t<tr data-dojo-attach-point=\"addr5\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" >Writes about&nbsp;</td><td data-dojo-attach-point=\"interests_org\"></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" valign=\"top\" >Update Writes about - In the box below please add, amend or request deletion of the areas of interest.</td></tr>\r\n\t\t\t\t\t\t<tr><td></td><td><div class=\"fixedsmalltextframe\" ><textarea data-dojo-attach-point=\"interests\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"interests\",style:\"width:99%;height:99%\",placeHolder:\"add, amend or request deletion of the areas of interest\"'  ></textarea></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-props='region:\"bottom\",style:\"width:100%;height:50px\"' data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t\t\t<table style=\"width:100%;border-collapse:collapse;\" border=\"0\">\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-point=\"removebtn\" data-dojo-attach-event=\"onClick:_remove_contact\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Removing Journalist...\",label:\"Remove Journalist\"'></button></td>\r\n\t\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"updatebtn\" data-dojo-attach-event=\"onClick:_save_contact\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving ...\",label:\"Save Journalist\"'></button></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutletEdit.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prmaxquestionnaires/pages/Journalists", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/Journalists.html",
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
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic, domattr, domclass ){
 return declare("prmaxquestionnaires.pages.Journalists",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.outlet_contact_model = new Observable( new JsonRest( {target:'/questionnaire/journalists', idProperty:"key"}));

		topic.subscribe(PRCOMMON.Events.Employee_Add, lang.hitch(this,this._employee_add_event));
		topic.subscribe(PRCOMMON.Events.Employee_Updated, lang.hitch(this,this._employee_update_event));
		this._load_call_back = lang.hitch(this,this._load_call);
		this._save_call_back = lang.hitch ( this , this._save_call );
		this._remove_call_back = lang.hitch ( this , this._remove_call );
		this._error_handler_call_back = lang.hitch(this,this._error_handler);
		this._add_call_back = lang.hitch(this,this._add_call);
		this._firsttime = true;
		this._has_address_old = null;
		this._has_address_new = null;
		
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Contact', className:"standard",field:"contactname"},
			{label: 'Job Title', className:"standard",field:"job_title"}
		];

		this.outlet_contact_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.outlet_contact_model,
			query: {outletid: PRMAX.questionnaire.outlet.outlet.outletid,
			researchprojectitemid: PRMAX.questionnaire.questionnaireid }
		});

		this.outlet_contact_grid_view.set("content", this.outlet_contact_grid);
		this.outlet_contact_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.outlet_contact_grid.on("dgrid-refresh-complete", lang.hitch(this,this._first_time_call));

		this.questionnaireid.set("value", PRMAX.questionnaire.questionnaireid );

		this.inherited(arguments);
	},
	_first_time_call:function( evt )
	{
		if ( this._firsttime==true)
		{
			if (evt.results.results && evt.results.results[0].length>0)
			{
				this.outlet_contact_grid.select(this.outlet_contact_grid.row(evt.results.results[0][0].key));
				this._post_load_request( evt.results.results[0][0] );
			}
			this._firsttime = false;
		}
	},
	_on_cell_call : function(e)
	{
		var cell = this.outlet_contact_grid.cell(e);

		if (cell.row)
			this._post_load_request( cell.row.data);
	},
	_post_load_request:function( data )
	{
		request.post('/questionnaire/get_journalist',
			utilities2.make_params({ data : {
				objectid:data.objectid,
				questionnaireid : this.questionnaireid.get("value"),
				typeid: data.typeid
				}})).
			then (this._load_call_back,this._error_handler_call_back);
	},
	_load_call:function( response)
	{
		if ( response.success == "OK")
		{
			domattr.set(this.contact_mode,"innerHTML","");
			this.objectid.set("value", response.data.objectid);
		  this.prefix.set("value", response.data.prefix);
		  this.firstname.set("value", response.data.firstname);
		  this.familyname.set("value", response.data.familyname);
		  this.job_title.set("value", response.data.job_title);
		  this.tel.set("value", response.data.tel);
		  this.fax.set("value", response.data.fax);
		  this.mobile.set("value", response.data.mobile);
		  this.email.set("value", response.data.email);
		  this.twitter.set("value", response.data.twitter);
		  this.facebook.set("value", response.data.facebook);
		  this.linkedin.set("value", response.data.linkedin);
		  this.instagram.set("value", response.data.instagram);
			this.interests.set("value", response.data.interests);
			domattr.set(this.interests_org,"innerHTML",response.data.interests_org);
			this.typeid.set("value", response.data.typeid);

			if (response.data.alt_address == false)
			{
				this.no_address.set("checked",false) ;
				this._has_address_old = false;
				this._address_show_do ( false ) ;
				this.address1.set("value","");
				this.address2.set("value","");
				this.townname.set("value","");
				this.county.set("value","");
				this.postcode.set("value","");
			}
			else
			{
				this.no_address.set("checked", true) ;
				this._has_address_old = true;
				this._address_show_do ( true ) ;
				this.address1.set("value",response.data.address1);
				this.address2.set("value",response.data.address2);
				this.townname.set("value",response.data.townname);
				this.county.set("value",response.data.county);
				this.postcode.set("value",response.data.postcode);
			}
			this.updatebtn.cancel();
			this.removebtn.cancel();
			domclass.remove(this.removebtn.domNode,"prmaxhidden");
			this.contact_edit_container.selectChild(this.contact_edit_view);
		}
	},
	_employee_update_event:function ( employee )
	{
		this.outlet_contact_model.put ( employee);
	},
	_employee_add_event:function ( employee )
	{
		this.outlet_contact_model.add(employee);
	},
	_show_add:function()
	{
		domattr.set(this.contact_mode,"innerHTML","Add New Journalist");
		this.objectid.set("value", -1);
		this.prefix.set("value", "");
		this.firstname.set("value", "");
		this.familyname.set("value", "");
		this.job_title.set("value", "");
		this.tel.set("value", "");
		this.fax.set("value", "");
		this.mobile.set("value", "");
		this.email.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.linkedin.set("value", "");
		this.instagram.set("value", "");
		this.no_address.set("checked", false) ;
		this._address_show_do ( false ) ;
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.interests.set("value","");
		domattr.set(this.interests_org,"innerHTML","");

		this.updatebtn.cancel();
		domclass.add(this.removebtn.domNode,"prmaxhidden");
		this.contact_edit_container.selectChild(this.contact_edit_view);
		this.outlet_contact_grid.clearSelection();
	},
	_save_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if (	this.objectid.get("value") == -1)
		{
			request.post('/questionnaire/add_contact',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._add_call_back,this._error_handler_call_back);
		}
		else
		{
			request.post('/questionnaire/update_contact',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._save_call_back,this._error_handler_call_back);
		}
	},
	_add_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.outlet_contact_model.add( response.data );
			this.objectid.set("value", response.data.objectid);
			this.typeid.set("value", response.data.typeid);
			domclass.remove(this.removebtn.domNode,"prmaxhidden");
			domattr.set(this.contact_mode,"innerHTML","");
			this.outlet_contact_grid.select( response.data );
			alert("Journalist Added");
		}
		else
		{
			alert("Problem applying changes");
		}
		this.updatebtn.cancel();
		this.removebtn.cancel();
	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Journalist Updated");
			this.outlet_contact_model.put ( response.data );
			this.outlet_contact_grid.select( response.data );
		}
		else
		{
			alert("Problem applying changes");
		}
		this.updatebtn.cancel();
		this.removebtn.cancel();
	},
	_remove_contact:function()
	{
		if ( confirm ("Delete Journalist"))
		{
			request.post('/questionnaire/delete_contact',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._remove_call_back,this._error_handler_call_back);
		}
		else
		{
			throw "N";
		}
	},
	_remove_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.outlet_contact_model.remove( response.data.key );
			this.contact_edit_container.selectChild(this.blank_cont_view);
			alert("Journalist Removed");
			var tmp = Object.keys(this.outlet_contact_grid._rowIdToObject);
			if (tmp.length)
			{
				this.outlet_contact_grid.select(this.outlet_contact_grid._rowIdToObject[tmp[0]]);
				this._post_load_request( this.outlet_contact_grid._rowIdToObject[tmp[0]] );
			}
		}
		else
		{
			alert("Problem Removing Journalist");
		}

		this.removebtn.cancel();

	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		this.updatebtn.cancel();
		this.removebtn.cancel();
	},
	_address_show:function()
	{
		this._address_show_do ( this.no_address.get("checked") ) ;
		if (this.no_address.get('checked'))
		{
			this._has_address_old = false;
			this._has_address_new = true;
		}
		else
		{
			this._has_address_old = true;
			this._has_address_new = false;	
		}		
	},
	_address_show_do:function ( show_it )
	{
		var _HidFields = ["addr1","addr2","addr3","addr4","addr5"];

		if ( show_it == false )
		{
			for ( var key in _HidFields )
				domclass.add(this[_HidFields[key]], "prmaxhidden");
		}
		else
		{
			for ( var key in _HidFields )
				domclass.remove(this[_HidFields[key]], "prmaxhidden");
		}
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		page_ctrl();
		throw "N";
	}
});
});


