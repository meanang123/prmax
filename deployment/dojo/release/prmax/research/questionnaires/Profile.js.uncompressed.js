require({cache:{
'url:research/questionnaires/templates/Profile.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"researchprojectitemid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Publisher</td><td><select data-dojo-props='style:\"width:15em\",name:\"publisherid\",autoComplete:true,searchAttr:\"publishername\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"publisherid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"publisher_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Publisher Name </td><td data-dojo-attach-point=\"publishername_view\" class=\"prmaxrowemphasise\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Primary Language</td><td><select data-dojo-props='style:\"width:15em\",name:\"language1id\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"language1id\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"language1id_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Other Language</td><td><select data-dojo-props='style:\"width:15em\",name:\"language2id\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"language2id\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"language2id_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Editorial Profile</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"editorialprofile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"editorialprofile\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"editorialprofile_modified\"></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_profile\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Readership/Audience</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"readership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"readership\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"readership_modified\"></div></td><td><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_readership\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">PAMco</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"nrsreadership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"nrsreadership\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"nrsreadership_modified\"></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_nrsreadership\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">JICREG Readership</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"jicregreadership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"jicregreadership\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"jicregreadership_modified\"></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_jicreg_readership\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Production Company</td><td><select data-dojo-props='style:\"width:15em\",name:\"productioncompanyid\",autoComplete:true,searchAttr:\"productioncompanydescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"productioncompanyid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"productioncompanyid_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Broadcast Times</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"broadcasttimes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"broadcasttimes\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"broadcasttimes_modified\"></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_broadcast\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Deadlines</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"deadline\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"deadline\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"deadline_modified\"></div></td><td valign=\"top\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"button\",label:\"Expand\"' data-dojo-attach-event=\"onClick:_expand_deadline\"></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\", style:\"width:100%;height:40px;padding:5px\"' >\r\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_update_profile\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n\r\n\t<div data-dojo-attach-point=\"publisher_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publisher Add\"'>\r\n\t\t<div data-dojo-attach-point=\"publisher_add_ctrl\" data-dojo-type=\"prcommon2/publisher/PublisherAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"production_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Production Company\"'>\r\n\t\t<div data-dojo-attach-point=\"production_add_ctrl\" data-dojo-type=\"prcommon2/production/ProductionCompanyAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"text_view_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Edit\"'>\r\n\t\t<div data-dojo-attach-point=\"text_view_ctrl\" data-dojo-type=\"prcommon2/common/ExpandedText\" data-dojo-props='style:\"width:600px;height:500px\"'></div>\r\n\t</div>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/questionnaires/Profile", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Profile.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/publisher/PublisherAdd",
	"research/questionnaires/UserModified",
	"prcommon2/production/ProductionCompanyAdd",
	"prcommon2/common/ExpandedText"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request , JsonRest, ItemFileReadStore, domattr, domclass){
 return declare("questionnaires.outlets.Profile",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._publishers = new JsonRest( {target:'/research/admin/publisher/list', labelAttribute:"publishername",idProperty:"publisherid"});
		this._productioncompanies = new JsonRest( {target:'/research/admin/production/list', labelAttribute:"productioncompanydescriptiion",idProperty:"productioncompanyid"});

		topic.subscribe(PRCOMMON.Events.Publisher_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Production_Company_Added, lang.hitch(this, this._add_production_event));

		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);

		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});

	},
		postCreate:function()
	{
		this.inherited(arguments);

		this.publisher_add_ctrl.set("dialog", this.publisher_add_dlg);
		this.publisherid.set("store", this._publishers);

		this.productioncompanyid.set("store", this._productioncompanies);
		this.production_add_ctrl.set("dialog",this.production_add_dlg);

		this.language1id.set("store", this._languages);
		this.language2id.set("store", this._languages);

	},
	_reset_fields:function()
	{
		this.readership_modified.clear();
		this.editorialprofile_modified.clear();
		this.publisher_modified.clear();
		this.nrsreadership_modified.clear();
		this.jicregreadership_modified.clear();
		this.productioncompanyid_modified.clear();
		this.deadline_modified.clear();
		this.broadcasttimes_modified.clear();
		this.language1id_modified.clear();
		this.language2id_modified.clear();
		domattr.set(this.publishername_view, "innerHTML", "");

	},
	load:function( projectitem, outlet, user_changes)
	{
		this._reset_fields();

		if (outlet.profile.profile)
		{
			this.readership.set("value", outlet.profile.profile.readership);
			this.editorialprofile.set("value", outlet.profile.profile.editorialprofile);
			this.nrsreadership.set("value", outlet.profile.profile.nrsreadership);
			this.jicregreadership.set("value", outlet.profile.profile.jicregreadership);
			this.productioncompanyid.set("value", outlet.profile.profile.productioncompanyid);
			this.deadline.set("value", outlet.profile.profile.deadline);
			this.broadcasttimes.set("value", outlet.profile.profile.broadcasttimes);
		}
		else
		{
			this.readership.set("value", "");
			this.editorialprofile.set("value","");
			this.nrsreadership.set("value", "");
			this.jicregreadership.set("value", "");
			this.productioncompanyid.set("value", "");
			this.deadline.set("value", "");
			this.broadcasttimes.set("value", "");
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);

		var publisherid_set = false;
		var language1id_set = false;
		var language2id_set = false;


		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 38: // readership
					var readership = "";
					if (outlet.profile.profile)
						readership = outlet.profile.profile.readership;
					this.readership_modified.load(change_record.value, readership, this.readership);
					break;
				case 3: // editorialprofile
					var editorialprofile = "";
					if (outlet.profile.profile)
						editorialprofile = outlet.profile.profile.editorialprofile;
					this.editorialprofile_modified.load(change_record.value, editorialprofile, this.editorialprofile);
					break;
				case 36: // publisher
					this.publisher_modified.load(change_record.value, outlet.outlet.publisherid, this.publisherid);
					publisherid_set = true;
					break;
				case 48:
					this.language1id_modified.load(change_record.value, outlet.languages.language1id, this.language1id);
					language1id_set = true;
					break;
				case 51:
					this.language2id_modified.load(change_record.value, outlet.languages.language2id, this.language2id);
					language2id_set = true;
					break;
				case 100:
					domclass.remove(this.publishername_view,"prmaxhidden");
					domattr.set(this.publishername_view, "innerHTML", change_record.value);
					break
			}
		}

		if (publisherid_set == false )
			this.publisherid.set("value", outlet.outlet.publisherid );
		if ( language1id_set == false )
			this.language1id.set("value", outlet.languages.language1id);
		if (language2id_set == false )
			this.language2id.set("value", outlet.languages.language2id);


		this.savenode.cancel();
	},
	clear:function()
	{
		this.publisherid.set("value", null );
		this.editorialprofile.set("value", "");
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

		var tmp_data = this.form.get("value");

		request.post('/research/admin/projects/user_feed_accept_profile',
				utilities2.make_params({ data : tmp_data })).
				then (this._update_call_back,this._error_call_back);
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
	_add_event:function ( publisher)
	{
		this.publisherid.set("value", publisher.publisherid);
	},
	_new_publisher:function()
	{
		this.publisher_add_ctrl.clear();
		this.publisher_add_dlg.show();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_new_production_company:function()
	{
		this.production_add_ctrl.clear();
		this.production_add_dlg.show();
	},
	_add_production_event:function ( production )
	{
		this.productioncompanyid.set("value", production.productioncompanyid);
	},
	_expand_broadcast:function()
	{
		this.text_view_ctrl.show_control( this.broadcasttimes, this.text_view_dlg, "Broadcast Times");
	},
	_expand_deadline:function()
	{
		this.text_view_ctrl.show_control( this.deadline, this.text_view_dlg, "Deadlines");
	},
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
