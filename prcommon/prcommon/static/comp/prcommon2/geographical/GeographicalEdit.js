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
define([
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
			domclass.add(this.show_transfer,"prmaxhidden");
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





