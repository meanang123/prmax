require({cache:{
'url:research/outlets/templates/Profile.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"outletid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Publisher/Broadcaster</td><td><select data-dojo-props='style:\"width:15em\",name:\"publisherid\",autoComplete:true,searchAttr:\"publishername\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"publisherid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Primary Language</td><td><select data-dojo-props='style:\"width:15em\",name:\"language1id\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"language1id\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Other Language</td><td><select data-dojo-props='style:\"width:15em\",name:\"language2id\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"language2id\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Profile</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"editorialprofile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"editorialprofile\",style:\"width:99%;height:99%;overflow:hidden\"'  ></textarea></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_profile\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Readership</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"readership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"readership\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_readership\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">PAMco</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"nrsreadership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"nrsreadership\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_nrsreadership\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">JICREG Readership</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"jicregreadership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"jicregreadership\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_jicreg_readership\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Production Company</td><td><select data-dojo-props='style:\"width:15em\",name:\"productioncompanyid\",autoComplete:true,searchAttr:\"productioncompanydescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"productioncompanyid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Broadcast Times</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"broadcasttimes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"broadcasttimes\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_broadcast\"></button></td></tr>\r\n<!--\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Deadlines</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"deadline\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"deadline\",style:\"width:99%;height:99%\"' ></textarea></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_deadline\"></button></td></tr>\r\n-->\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Web Profile Page</td><td><input data-dojo-attach-point=\"web_profile_link\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"web_profile_link\",type:\"text\",maxlength:\"120\",pattern:dojox.validate.regexp.url,style:\"width:90%\"' /></td></tr>\r\n\t \t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\", style:\"width:100%;height:40px;padding:5px\"' >\r\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_delete\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete Outlet\"'></button></td>\r\n\t\t\t\t<td align=\"left\"><label class=\"prmaxrowtag\">Reason</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\",style:\"width:120px\"'></select></td>\r\n\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_show_old_profile\" data-dojo-type=\"dijit/form/Button\">Show Old Profile</button></td>\r\n\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_update_profile\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"publisher_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publisher Add\"'>\r\n\t\t<div data-dojo-attach-point=\"publisher_add_ctrl\" data-dojo-type=\"prcommon2/publisher/PublisherAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"production_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Production Company\"'>\r\n\t\t<div data-dojo-attach-point=\"production_add_ctrl\" data-dojo-type=\"prcommon2/production/ProductionCompanyAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"outlet_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"outlet_delete_ctrl\" data-dojo-type=\"research/outlets/OutletDelete\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"text_view_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Notes\"'>\r\n\t\t<div data-dojo-attach-point=\"text_view_ctrl\" data-dojo-type=\"prcommon2/common/ExpandedText\" data-dojo-props='style:\"width:600px;height:500px\"'></div>\r\n\t</div>\r\n\r\n\t<form data-dojo-attach-point=\"old_profile_form\" target=\"_newtab\" action=\"/research/admin/outlets/old_profile\" method=\"post\">\r\n\t\t<input type=\"hidden\" name=\"outletid\" data-dojo-attach-point=\"old_profile_outletid\">\r\n\t</form>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutletEditMainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/outlets/Profile", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/Profile.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/circulation/CirculationSourcesAdd",
	"prcommon2/circulation/CirculationDatesAdd",
	"prcommon2/outlet/SelectMultipleOutlets",
	"prcommon2/production/ProductionCompanyAdd",
	"prcommon2/common/ExpandedText"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic,  lang, utilities2, request , domattr, JsonRest, ItemFileReadStore){
 return declare("research.outlets.Profile",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._productioncompanies = new JsonRest( {target:'/research/admin/production/list', labelAttribute:"productioncompanydescriptiion",idProperty:"productioncompanyid"});
		this._publishers = new JsonRest( {target:'/research/admin/publisher/list', labelAttribute:"publishername",idProperty:"publisherid"});

		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);

		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});

	},
		postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.productioncompanyid.set("store", this._productioncompanies);
		this.production_add_ctrl.set("dialog",this.production_add_dlg);

		this.publisher_add_ctrl.set("dialog", this.publisher_add_dlg);
		this.publisherid.set("store", this._publishers);

		this.language1id.set("store", this._languages);
		this.language2id.set("store", this._languages);


		this.inherited(arguments);
	},
	load:function( outletid, outlet ,profile )
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.outletid.set("value", outletid);
		this._outletname = outlet.outlet.outletname;
		domattr.set(this.old_profile_outletid,"value", outletid);

		this.publisherid.set("value", outlet.outlet.publisherid );

		this.language1id.set("value", outlet.languages.language1id);
		this.language2id.set("value", outlet.languages.language2id);

		if (profile.profile)
		{
			this.readership.set("value", profile.profile.readership);
			this.editorialprofile.set("value", profile.profile.editorialprofile);
			this.nrsreadership.set("value", profile.profile.nrsreadership);
			this.jicregreadership.set("value", profile.profile.jicregreadership);
//			this.deadline.set("value", profile.profile.deadline);
			this.broadcasttimes.set("value", profile.profile.broadcasttimes);
			this.productioncompanyid.set("value", profile.profile.productioncompanyid);
			this.web_profile_link.set("value",profile.profile.web_profile_link);
		}
		else
		{
			this.readership.set("value", "");
			this.editorialprofile.set("value", "");
			this.nrsreadership.set("value", "");
			this.jicregreadership.set("value", "");
//			this.deadline.set("value", "");
			this.broadcasttimes.set("value", "");
			this.productioncompanyid.set("value", null);
			this.web_profile_link.set("value","");
		}

		this.savenode.cancel();
	},
	clear:function()
	{
		this.outletid.set("value", -1);
		this.readership.set("value", "");
		this.editorialprofile.set("value", "");
		this.nrsreadership.set("value", "");
		this.jicregreadership.set("value", "");

		this.language1id.set("value", "");
		this.language2id.set("value", "");

		this.productioncompanyid.set("value", null);
		this.web_profile_link.set("value","");

		this.savenode.cancel();
	},
	_update_profile:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		// add the reason code
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/outlets/update_profile',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Profile Updated");
		}
		else
		{
			alert("Problem");
		}
		this.savenode.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_show_old_profile:function()
	{
		this.old_profile_form.submit();
	},
	_new_production_company:function()
	{
		this.production_add_ctrl.clear();
		this.production_add_dlg.show();
	},
	_add_event:function ( publisher)
	{
		this.publisherid.set("value", publisher.publisherid);
	},
	_add_production_event:function ( production )
	{
		this.productioncompanyid.set("value", production.productioncompanyid);
	},
	_new_publisher:function()
	{
		this.publisher_add_ctrl.clear();
		this.publisher_add_dlg.show();
	},
	_delete:function()
	{
			this.outlet_delete_ctrl.load ( this.outletid.get("value"), this._outletname, this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
	},
	_expand_broadcast:function()
	{
		this.text_view_ctrl.show_control( this.broadcasttimes, this.text_view_dlg, "Broadcast Times");
	},
//	_expand_deadline:function()
//	{
//		this.text_view_ctrl.show_control( this.deadline, this.text_view_dlg, "Deadlines");
//	},
	_expand_profile:function()
	{
		this.text_view_ctrl.show_control( this.editorialprofile, this.text_view_dlg, "Editorial Profile");
	},
	_expand_readership:function()
	{
		this.text_view_ctrl.show_control( this.readership, this.text_view_dlg, "Readership");
	},
	_expand_nrsreadership:function()
	{
		this.text_view_ctrl.show_control( this.nrsreadership, this.text_view_dlg, "PAMco");
	},
	_expand_jicreg_readership:function()
	{
		this.text_view_ctrl.show_control( this.jicregreadership, this.text_view_dlg, "JICREG readership");
	}
});
});





