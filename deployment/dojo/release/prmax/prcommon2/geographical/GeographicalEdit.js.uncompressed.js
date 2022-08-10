require({cache:{
'url:prcommon2/geographical/templates/GeographicalEdit.html':"<div class=\"dojogeographicalPane\" data-dojo-attach-point=\"containerNode\" >\r\n\t<form class=\"prmaxdefault\" data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" onSubmit=\"return false\">\r\n\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Name</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\"name=\"geographicalname\" data-dojo-attach-point=\"geographicalname\" data-dojo-props='trim:true,required:true,maxlength:85,style:\"width:98%\",type:\"text\"' ></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Type</td><td><select data-dojo-attach-point=\"geographicallookuptypeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-attach-event =\"onChange:_type_changed\" data-dojo-props='name:\"geographicallookuptypeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\"' /></td></tr>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"left\" >Parent</td></tr>\r\n\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr ><td colspan=\"3\" ><span class=\"prmaxrowtag\">Select</span><input data-dojo-props='\"class\":\"prmaxfocus prmaxinput\",type:\"text\",style:\"width:200px;padding-bottom:3px\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"geographical_list_select\" /></td></tr>\r\n\t\t<tr><td width=\"46%\"><select style=\"width:100%\" data-dojo-attach-point=\"geographical_list\" size=\"7\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<button class=\"button_add_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_all\" disabled=\"true\" type=\"button\" data-dojo-attach-event=\"onClick:_geographical_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_single\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_geographical_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_geographical_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_geographical_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t<td  width=\"46%\"><select style=\"width:100%\" data-dojo-attach-point=\"geographical_select\" size=\"7\" class=\"lists\" multiple=\"multiple\" data-dojo-attach-event=\"onchange:_geographical_update_selection\"></select></td>\r\n\t\t</tr></table></td></tr>\r\n\t</table>\r\n\t<div data-dojo-attach-point=\"child_view\">\r\n\t\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"left\" >Children</td></tr>\r\n\t\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr ><td colspan=\"3\" ><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" style=\"width:200px;padding-bottom:3px\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"child_list_select\" /></td></tr>\r\n\t\t\t<tr><td width=\"46%\"><select style=\"width:100%\" data-dojo-attach-point=\"child_list\" size=\"7\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<button class=\"button_add_all\"  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"child_btn_all\" disabled=\"true\" type=\"button\" data-dojo-attach-event=\"onClick:_child_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"child_btn_single\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_child_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"child_btn_del_all\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_child_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"child_btn_del_single\" disabled=\"true\" type=\"button\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_child_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t<td  width=\"46%\"><select style=\"width:100%\" data-dojo-attach-point=\"child_select\" size=\"7\" class=\"lists\" multiple=\"multiple\" data-dojo-attach-event=\"onchange:_child_update_selection\"></select></td>\r\n\t\t\t</tr></table></td></tr>\r\n\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t</table>\r\n\t</div>\r\n\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<td align=\"left\"><button  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"transfer\" type=\"button\" data-dojo-attach-event=\"onClick:_transfere\" data-dojo-type=\"dijit/form/Button\" label=\"Show Transfer Coverage\"></button></td>\r\n\t\t<td><class=\"prmaxhidden\" button  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"deletebtn\" type=\"button\" data-dojo-attach-event=\"onClick:_delete\" data-dojo-type=\"dijit/form/Button\" label=\"Delete\"></button></td>\r\n\t\t<td align=\"right\"><button  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"save\" type=\"button\" data-dojo-attach-event=\"onClick:_save\" data-dojo-type=\"dijit/form/Button\" label=\"Save\"></button></td>\r\n\t\t</tr></table></tr></td>\r\n\t</table>\r\n\t</form>\r\n\t<div class=\"prmaxhidden\" data-dojo-attach-point=\"show_transfer\" style=\"padding-top:5px\">\r\n\t\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr><td colspan=\"3\" class=\"prmaxrowdisplaytitle\">Move Coverage to a New Area</td></tr>\r\n\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t\t<tr ><td colspan=\"3\" ><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" style=\"width:200px;padding-bottom:3px\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"transfer_list_select\" /></td></tr>\r\n\t\t<tr><td width=\"46%\"><select style=\"width:100%\" data-dojo-attach-point=\"transfer_list\" size=\"7\" class=\"lists\" ></select></td>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"left\"><button  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"transfer_do\" disabled=\"disabled\" type=\"button\" data-dojo-attach-event=\"onClick:_transfere_do\" data-dojo-type=\"dijit/form/Button\" label=\"Do Transfer Coverage To\"></button></td>\r\n\t\t</tr></table></td></tr>\r\n\r\n </div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prcommon2/geographical/GeographicalEdit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../geographical/templates/GeographicalEdit.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/_base/lang",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json,ItemFileReadStore, topic, domclass,domstyle,lang){
 return declare("prcommon2.geographical.GeographicalEdit",
	[BaseWidgetAMD],{
	templateString:template,
		constructor: function()
		{
			this.geographical_types = new ItemFileReadStore ({ url:"/common/lookups?searchtype=geographicallookuptypes&typesonly=0"});
			this._collect_details_call_back = lang.hitch(this,this._collect_details_call);
			this._add_call_back = lang.hitch(this,this._add_call);
			this._update_call_back = lang.hitch(this,this._update_call);
			this._load_selection_call_back = lang.hitch(this,this._load_selection_call);
			this._load_child_selection_call_back = lang.hitch(this,this._load_child_selection_call);
			this._transfer_selection_call_back= lang.hitch(this,this._transfer_selection_call);
			this._delete_call_back = lang.hitch(this,this._delete_call);
			this._transfer_call_back = lang.hitch(this,this._transfer_call);
			this._geographicalid = -1;
		},
		postCreate:function()
		{
			this.geographicallookuptypeid.set("store",this.geographical_types);
			dojo.connect(this.geographical_list_select.domNode,"onkeyup" ,  lang.hitch(this,this._geographical_select));
			dojo.connect(this.child_list_select.domNode,"onkeyup" ,  lang.hitch(this,this._child_geog_select));

			dojo.connect(this.geographical_list,"onchange" ,  lang.hitch(this,this._geographical_update_selection));
			dojo.connect(this.geographical_list,"ondblclick" ,  lang.hitch(this,this._geographical_select_dbl));
			dojo.connect(this.geographical_select,"ondblclick" ,  lang.hitch(this,this._geographical_select_delete_dbl));
			dojo.connect(this.geographical_select,"onchange" ,  lang.hitch(this,this._geographical_update_selection));

			dojo.connect(this.child_list,"onchange" ,  lang.hitch(this,this._child_update_selection));
			dojo.connect(this.child_list,"ondblclick" ,  lang.hitch(this,this._child_select_dbl));
			dojo.connect(this.child_select,"ondblclick" ,  lang.hitch(this,this._child_select_delete_dbl));
			dojo.connect(this.child_select,"onchange" ,  lang.hitch(this,this._child_update_selection));


			dojo.connect(this.transfer_list_select.domNode,"onkeyup" ,  lang.hitch(this,this._transfer_select));
			dojo.connect(this.transfer_list,"onchange" ,  lang.hitch(this,this._transfer_selection_options));

		},
		_geographical_update_selection:function()
		{
			this._selection_options();
		},
		_child_update_selection:function()
		{
			this._child_selection_options();
		},
		_geographical_select_dbl:function()
		{
			this._geographical_select_single();
			this._selection_options();
		},
		_geographical_select_all:function()
		{
			for (var c=0; c<this.geographical_list.options.length ;c++){
				var option = this.geographical_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.geographical_select.options.length ;c1++){
					if (this.geographical_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.geographical_select.options[this.geographical_select.options.length] = new Option(option.text,option.value);
				}
			}
			this.geographical_list.options.length = 0 ;
			this._geographical_update_selection();
		},
		_geographical_select_single:function()
		{
			for (var c=0; c<this.geographical_list.options.length ;c++){
				var option = this.geographical_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.geographical_select.options.length ;c1++){
						if (this.geographical_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.geographical_select.options[this.geographical_select.options.length] = new Option(option.text,option.value);
					}
				}
			}
			this._geographical_update_selection();
		},
		_geographical_remove_all:function()
		{
			this.geographical_select.options.length = 0 ;
			this._geographical_update_selection();
		},
		_geographical_select_delete_dbl:function( target )
		{
			if  ( target != null && target.originalTarget != null && target.originalTarget.index != null )
			{
				this.geographical_select.options[target.originalTarget.index] = null;
				this._geographical_update_selection();
			}
			else
			{
				this._geographical_remove_single();
			}
		},
		_geographical_remove_single:function()
		{
			for (var c=0; c<this.geographical_select.options.length ;c++){
				if (this.geographical_select.options[c].selected)
					this.geographical_select.options[c] = null;
			}
			this._geographical_update_selection();
		},
		_load_selection_call:function( response )
		{
			if ( this._transactionid == response.transactionid )
			{
				this._clear_selection_box();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.geographical_list.options[this.geographical_list.options.length] = new Option(record[0],record[1]);
				}
				this._selection_options();
			}
		},
		// Child list response selection
		_load_child_selection_call:function( response )
		{
			if ( this._transactionid_child == response.transactionid )
			{
				this._clear_child_selection_box();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.child_list.options[this.child_list.options.length] = new Option(record[0],record[1]);
				}
				this._child_selection_options();
			}
		},
		_geographical_select:function()
		{
			var data = this.geographical_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid = PRCOMMON.utils.uuid.createUUID();
				var fid = parseInt(this.geographicallookuptypeid.get("value"));
				if ( fid == 3 )  fid = 6

				request.post('/geographical/listbytype',
						utilities2.make_params({data: {
							word:data,
							parentonly:1,
							filter:fid,
							transactionid: this._transactionid,
							cascade_region:1,
							extended_mode:true
					}})).
					then( this._load_selection_call_back);
			}
			else
			{
				this._clear_selection_box();
				this._selection_options();
			}
		},
		/* Child List Find */
		_child_geog_select:function()
		{
			var data = this.child_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid_child = PRCOMMON.utils.uuid.createUUID();

				// fix up child for gap
				var fid = parseInt(this.geographicallookuptypeid.get("value"))-1;
				if ( fid == 5 )  fid = 3;

				request.post( '/geographical/listbytype',
					utilities2.make_params({ data :{
							word:data,
							filter:fid,
							transactionid: this._transactionid_child,
							cascade_region:2,
							extended_mode:true}})).
					then( this._load_child_selection_call_back);
			}
			else
			{
				this._clear_child_selection_box();
				this._child_selection_options();
			}

		},
		_collect_details_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				this._make_edit();
				this._geographicalid = response.data.geographical.geographicalid;
				this.geographicalname.set("value", response.data.geographical.geographicalname);
				this.geographicallookuptypeid.set("value", response.data.geographical.geographicallookuptypeid);
				for ( var i=0 ; i <response.data.parents.length; ++i )
				{
					var area = response.data.parents[i];
					this.geographical_select.options[this.geographical_select.options.length] = new Option(area.geographicalname,area.parentgeographicalareaid);
				}
				for ( var i=0 ; i <response.data.children.length; ++i )
				{
					var area = response.data.children[i];
					this.child_select.options[this.child_select.options.length] = new Option(area.geographicalname,area.childgeographicalareaid);
				}
				this._type_changed();
			}
			else
			{
				alert( "Problem getting Details");
			}
		},
		load:function( geographicalid, dialog )
		{
			this._clear();
			this._dialog = dialog;
			this._geographicalid = geographicalid;
			if ( this._geographicalid>0 )
			{
				request.post('/geographical/getdetails',
					utilities2.make_params( {data:{geographicalid:this._geographicalid}})).
					then ( this._collect_details_call_back);
			}
			else
			{
				this._make_new();
			}
		},
		_transfere:function()
		{
			if (domclass.contains(this.show_transfer, "prmaxhidden"))
			{
				domclass.remove(this.show_transfer,"prmaxhidden");
			}
			else{
				domclass.add(this.show_transfer,"prmaxhidden");
			}
		},
		_delete_call:function( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Geographical_Area_Delete, response.data );
			}
			else
			{
				alert("Problem Deleting area");
			}
		},
		_delete:function()
		{
			if ( confirm ("Delete Area") )
			{
				request.post('/geographical/delete_geographical',
					utilities2.make_params( {data:{geographicalid:this._geographicalid}})).
					then (this._delete_call_back);
			}
		},
		_add_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Geographical_Area_Add, response.data);
				alert("Area Added");
				this._dialog.hide();
			}
			else if ( response.success == "OK" )
			{
				alert("Geographical Areas allready Exists");
			}
			else if ( response.success == "DU" )
			{
				alert("Area Already Exists");
			}
			else
			{
				alert("Problem Adding Geographical Area");
			}
		},
		_update_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Geographical_Area_Update, response.data.geographical);
				alert("Updating Geographical Area");
			}
			else if ( response.success == "DU" )
			{
				alert("Area Already Exists");
			}
			else
			{
				alert("Problem Updating Geographical Area");
			}
		},
		_save:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required field filled in");
				throw "N";
			}

			var content = this.form.get("value");
			content["geographicalid"] = this._geographicalid;

			var parents = Array();
			var children = Array();
			for ( var x = 0 ; x < this.geographical_select.options.length; x++ )
				parents[x] = parseInt(this.geographical_select.options[x].value);
			content["parents"] = dojo.toJson(parents)

			for ( var x = 0 ; x < this.child_select.options.length; x++ )
				children[x] = parseInt(this.child_select.options[x].value);
			content["children"] = dojo.toJson(children)

			if ( this._geographicalid == -1 )
				request.post('/geographical/add',
					utilities2.make_params({ data: content})).
					then(this._add_call_back);
			else
			{
				request.post('/geographical/update',
					utilities2.make_params({data: content})).
					then(this._update_call_back);
			}
		},
		_clear:function()
		{
			this.geographicalname.set("value", "");
			this.geographical_select.options.length = 0;
			this.geographical_list.options.length = 0;
			this.child_select.options.length = 0;
			this.child_list.options.length = 0;
			this.geographicallookuptypeid.set("value",1);
			this._clear_selection_box();
			this._selection_options();
			this._clear_child_selection_box();
			this._child_selection_options();
			this._clear_transfer_selection_box();
			this._transfer_selection_options();

			domclass.add(this.show_transfer,"prmaxhidden");

			this.geographicalname.focus();

		},
		_make_new:function()
		{
			domstyle.set( this.transfer.domNode,"display","none");
			domstyle.set( this.deletebtn.domNode,"display","none");
			this.save.set("label","Add");
		},
		_make_edit:function()
		{
			domstyle.set( this.transfer.domNode,"display","");
			domstyle.set( this.deletebtn.domNode,"display","");
			this.save.set("label","Save");

		},
		_clear_selection_box:function()
		{
			this.geographical_list.options.length=0;
		},
		_clear_child_selection_box:function()
		{
			this.child_list.options.length=0;
		},
		_selection_options:function()
		{
			this.button_all.set('disabled',this.geographical_list.length?false:true);
			this.button_single.set('disabled',this.geographical_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.geographical_select.length?false:true);
			this.button_del_single.set('disabled',this.geographical_select.selectedIndex!=-1?false:true);
		},
		_child_selection_options:function()
		{
			this.child_btn_all.set('disabled',this.child_list.length?false:true);
			this.child_btn_single.set('disabled',this.child_list.selectedIndex!=-1?false:true);

			this.child_btn_del_all.set('disabled',this.child_select.length?false:true);
			this.child_btn_del_single.set('disabled',this.child_select.selectedIndex!=-1?false:true);
		},
		_transfer_selection_call:function( response )
		{
			if ( this._transactionid == response.transactionid )
			{
				this._clear_transfer_selection_box();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.transfer_list.options[this.transfer_list.options.length] = new Option(
							record[0] + "(" + record[1] + ")",
							record[1]);
				}
				this._transfer_selection_options();
			}
		},
		_transfer_select:function()
		{
			var data = this.transfer_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid = PRCOMMON.utils.uuid.createUUID();

				request.post('/geographical/listbytype',
					utilities2.make_params({ data: {
							word:data,
							filter:-1,
							transactionid: this._transactionid,
							extended_mode:true}})).
					then( this._transfer_selection_call_back);
			}
			else
			{
				this._clear_transfer_selection_box();
				this._transfer_selection_options();
			}
		},
		_clear_transfer_selection_box:function()
		{
			this.transfer_list.options.length=0;
		},
		_transfer_selection_options:function()
		{
			this.transfer_do.set('disabled', this.transfer_list.selectedIndex!=-1?false:true);
		},
		_transfer_call:function( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Coverage_Moved);
				alert("Coverage Moved");
			}
			else
			{
				alert("Problem Moving Coverage");
			}
		},
		_transfere_do:function()
		{
			if ( confirm ( "Move Coverage to " + this.transfer_list.options[this.transfer_list.selectedIndex].text +"?") )
			{
				request.post('/geographical/move_coverage',
					utilities2.make_params( {data:{
							fromgeographicalid:this._geographicalid,
							togeographicalid: this.transfer_list.options[this.transfer_list.selectedIndex].value
					}})).
					then( this._transfer_call_back);
			}
		},
		_type_changed:function()
		{
			var v = this.geographicallookuptypeid.get("value");

				if ( v == 1 )
					domclass.add( this.child_view ,"prmaxhidden");
				else
					domclass.remove( this.child_view ,"prmaxhidden");
		},
		// Child Buttons
		_child_select_all:function()
		{
			for (var c=0; c<this.child_list.options.length ;c++){
				var option = this.child_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.child_select.options.length ;c1++){
					if (this.child_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.child_select.options[this.child_select.options.length] = new Option(option.text,option.value);
				}
			}
			this.child_list.options.length = 0 ;
			this._child_update_selection();
		},
		_child_select_single:function()
		{
			for (var c=0; c<this.child_list.options.length ;c++){
				var option = this.child_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.child_select.options.length ;c1++){
						if (this.child_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.child_select.options[this.child_select.options.length] = new Option(option.text,option.value);
					}
				}
			}
			this._child_update_selection();
		},
		_child_remove_all:function()
		{
			this.child_select.options.length = 0 ;
			this._child_update_selection();
		},
		_child_select_dbl:function()
		{
			this._child_select_single();
			this._child_selection_options();
		},
		_child_select_delete_dbl:function( target )
		{
			if  ( target != null && target.originalTarget != null && target.originalTarget.index != null )
			{
				this.child_select.options[target.originalTarget.index] = null;
				this._child_update_selection();
			}
			else
			{
				this._child_remove_single();
			}
		},
		_child_remove_single:function()
		{
			for (var c=0; c<this.child_select.options.length ;c++){
				if (this.child_select.options[c].selected)
					this.child_select.options[c] = null;
			}
			this._child_update_selection();
		}
});
});





