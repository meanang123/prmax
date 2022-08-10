require({cache:{
'url:prcommon2/geographical/templates/Geographical.html':"<div class=\"dojogeographicalPane\" data-dojo-attach-point=\"containerNode\" >\r\n\t<div>\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t\t<tr><td width=\"20%\"   class=\"prmaxrowtag\">${displaytitle}</td>\r\n\t\t\t\t\t<td width=\"5%\" ><img height=\"16px\" width=\"16px\" data-dojo-attach-point=\"togglectrl\" data-dojo-attach-event=\"onclick:_toggle\" src=\"/prmax_common_s/images/toopen.gif\" class=\"toggleselect\"></img></td>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" ><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td>\r\n\t\t\t</tr></table>\r\n\t\t<div style=\"border 2px solid black\">\r\n\t\t\t<div data-dojo-attach-point=\"selectarea\" class=\"prmaxselectmultiple\" style=\"display:none\" >\r\n\t\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t\t\t\t  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"47%\"></td></tr>\r\n\t\t\t\t\t  <tr><td colspan=\"3\">\r\n\t\t\t\t\t\t  <table style=\"width:100%\" class=\"prmaxtable\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t\t\t\t\t\t  <tr>\r\n\t\t\t\t\t\t\t\t  <td data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select</span><input data-dojo-props='\"class\":\"prmaxfocus prmaxinput\",type:\"text\",style:\"width:100px\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"geographical_list_select\" data-dojo-attach-event=\"onkeyup:_geographical_select_func\" /></td>\r\n\t\t\t\t\t\t<td style=\"padding-left:10px\"> <span class=\"prmaxrowtag\" >Filter By</span>\r\n\t\t\t\t\t\t\t\t<input data-dojo-attach-event=\"onClick:_show_no_filter\" data-dojo-attach-point=\"filter_radio_restriction\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"geog_selection\",\"class\":\"prmaxdefault\",checked:\"checked\",type:\"radio\",value:\"-1\"'/><label data-dojo-attach-point=\"filter_radio_restriction_label\" class=\"prmaxlabeltag\" >All</label>\r\n\t\t\t\t\t\t\t\t<input data-dojo-attach-event=\"onClick:_show_all\" data-dojo-attach-point=\"filter_radio_town\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"geog_selection\",\"class\":\"prmaxdefault\",type:\"radio\",value:\"1\"'/><label data-dojo-attach-point=\"filter_radio_town_label\" class=\"prmaxlabeltag\" >Towns</label>\r\n\t\t\t\t\t\t\t\t<input data-dojo-attach-event=\"onClick:_show_all\" data-dojo-attach-point=\"filter_radio_county\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"geog_selection\",\"class\":\"prmaxdefault\",type:\"radio\",value:\"2\"'/><label data-dojo-attach-point=\"filter_radio_county_label\" class=\"prmaxlabeltag\" >Counties</label>\r\n\t\t\t\t\t\t\t\t<input data-dojo-attach-event=\"onClick:_show_all\" data-dojo-attach-point=\"filter_radio_region\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"geog_selection\",\"class\":\"prmaxdefault\",type:\"radio\",value:\"3\"'/><label data-dojo-attach-point=\"filter_radio_region_label\" class=\"prmaxlabeltag\" >Regions</label>\r\n\t\t\t\t\t\t\t\t<input data-dojo-attach-event=\"onClick:_show_all\" data-dojo-attach-point=\"filter_radio_nation\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"geog_selection\",\"class\":\"prmaxdefault\",type:\"radio\",value:\"6\"'/><label data-dojo-attach-point=\"filter_radio_nation_label\" class=\"prmaxlabeltag\" >Nation</label>\r\n\t\t\t\t\t\t</td><td width=\"5%\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_tree_view\">Tree</button></td>\r\n\t\t\t\t\t\t</tr></table>\r\n\t\t\t\t\t</td></tr>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td><select style=\"width:100%\" data-dojo-attach-point=\"geographical_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t\t\t  <td>\r\n\t\t\t\t\t\t\t<button data-dojo-attach-point=\"button_all\" data-dojo-props='\"class\":\"button_add_all\",style:\"padding:0px;margin:0px\",disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:geographical_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t\t\t<button data-dojo-attach-point=\"button_single\" data-dojo-props='\"class\":\"button_add_single\",style:\"padding:0px;margin:0px\",disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:geographical_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t\t\t<button data-dojo-attach-point=\"button_del_all\" data-dojo-props='\"class\":\"button_del_all\",style:\"padding:0px;margin:0px\",disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:geographical_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t\t\t<button data-dojo-attach-point=\"button_del_single\" data-dojo-props='\"class\":\"button_del_single\",style:\"padding:0px;margin:0px\",disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:geographical_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td ><select data-dojo-attach-point=\"geographical_select\" style=\"width:100%\" size=\"${size}\" class=lists\",multiple=\"multiple\" data-dojo-attach-event=\"onchange:geographical_update_selection\"></select></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t </div>\r\n\t<div data-dojo-attach-point=\"geog_tree_dlg\" data-dojo-type=\"dijit/Dialog\" title =\"Geographical Tree View\">\r\n\t\t<div data-dojo-attach-point=\"geog_tree\" data-dojo-type=\"prcommon2/geographical/GeographicalTree\" style=\"width:400px;height:500px\"></div>\r\n\t</div>\r\n\r\n </div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prcommon2/geographical/Geographical", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../geographical/templates/Geographical.html",
	"prcommon2/search/std_search",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"prcommon2/search/SearchCount",
	"dijit/form/TextBox",
	"dijit/form/RadioButton",
	"dijit/form/Button",
	"dijit/Dialog",
	"prcommon2/geographical/GeographicalTree"
	], function(declare, BaseWidgetAMD, template, std_search, request, utilities2, json, ItemFileReadStore, lang, topic, domattr ){
 return declare("prcommon2.geographical.Geographical",
	[BaseWidgetAMD,std_search],{
	templateString: template,
	name:"", // name used for a form integration
	value:"",
	displaytitle:"Coverage",
	title : '',
	search : '',
	size:'7',
	selectonly:false,
	startopen:false,
	cascade:true,
	open:false,
	constructor: function()
	{
		this.disabled = false;
		this._load_selection_call = lang.hitch(this, this._load_selection);
		this._transactionid = null;
		this.selectTimer = null;
	},
		postCreate:function()
		{
			// key
			dojo.connect(this.geographical_list_select.domNode, "onkeyup" ,  lang.hitch(this,this._geographical_select_func));
			dojo.connect(this.geographical_list, "onchange" ,  lang.hitch(this,this.geographical_update_selection));
			dojo.connect(this.geographical_list, "ondblclick" ,  lang.hitch(this,this.geographical_select_dbl));
			dojo.connect(this.geographical_select, "ondblclick" ,  lang.hitch(this,this.geographical_select_delete_dbl));

			domattr.set(this.filter_radio_restriction_label, "for" , this.filter_radio_restriction.id );
			domattr.set(this.filter_radio_town_label, "for" , this.filter_radio_town.id );
			domattr.set(this.filter_radio_county_label, "for" , this.filter_radio_county.id );
			domattr.set(this.filter_radio_region_label, "for" , this.filter_radio_region.id );
			domattr.set(this.filter_radio_nation_label, "for" , this.filter_radio_nation.id );

			if (this.selectonly)
			{
				this.countnode.domNode.style.display ="None";
			}
			if (this.startopen)
			{
				dojo.style(this.togglectrl,"display","none");
				dojo.style(this.selectarea,"display","block");
			}

			topic.subscribe(PRCOMMON.Events.Geographical_Selected, lang.hitch(this,this._geographical_selection_event));
			this.geog_tree.set("dialog", this.geog_tree_dlg);

			this.inherited ( arguments ) ;

		},
		_geographical_selection_event:function( e )
		{
			var addRecord = true ;

			for (var c1=0; c1<this.geographical_select.options.length ;c1++){
				if (this.geographical_select.options[c1].value==e.geographicalarea){
					addRecord = false;
					break;
				}
			}

			if ( addRecord )
			{
				this.geographical_select.options[this.geographical_select.options.length] = new Option(e.geographicalname,e.geographicalid);
				this._get_selector(this._getValueAttr());
			}
		},
		// styandard clear function
		clear:function()
		{
			this._clear_selection_box();
			this._clear_selected_box();
			this.geographical_list_select.set("value","");
			this.filter_radio_restriction.set("checked",true)
			this._get_selector(this._getValueAttr());
			this._selection_options();
			this.inherited(arguments);
		},
		clear_selection:function()
		{
			this._clear_selection_box();
			this.geographical_list_select.set("value","");
			this._get_selector(this._getValueAttr());
			this._selection_options();
		},
		_send_request:function( data )
		{
			this._transactionid = PRCOMMON.utils.uuid.createUUID();

			request.post('/geographical/listbytype',
				utilities2.make_params({ data : {
						word:data,
						filter:this._get_filter(),
						geographicaltypeid:this.geographicaltypeid,
						transactionid: this._transactionid
				}})).then
				( this._load_selection_call );
		},
		_geographical_select_func:function()
		{
			var data = this.geographical_list_select.get("value");
			if (data.length>0)
			{
				if (this.selecttimer)
				{
					clearTimeout ( this.selecttimer);
					this.selecttimer = null;
				}
				this.selecttimer = setTimeout(lang.hitch(this, this._send_request,data),this.searchtime);
			}
			else
			{
				this.selectTimer = null;
				this._clear_selection_box();
				this._selection_options();
			}
		},
		_load_selection:function(response)
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
		_clear_selection_box:function()
		{
			this.geographical_list.options.length=0;
		},
		_get_selector: function(value,force)
		{
			if ( this.keytypeid != "" )
				this.inherited(arguments);
		},
		_clear_selected_box:function()
		{
			this.geographical_select.length=0;
		},
		geographical_update_selection:function()
		{
			this._selection_options();
		},
		geographical_select_dbl:function()
		{
			this.geographical_select_single();
			this._selection_options();
		},
		geographical_select_all:function()
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
					this._get_selector(this._getValueAttr());
				}
			}
			this.geographical_list.options.length = 0 ;
			this.geographicalUpdateSelection();
		},
		geographical_select_single:function()
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
						this._get_selector(this._getValueAttr());
					}
				}
			}
		},
		geographical_remove_all:function()
		{
			this.geographical_select.options.length = 0 ;
			this.geographical_update_selection();
			this._get_selector(this._getValueAttr());
		},
		geographical_select_delete_dbl:function( target )
		{
			console.log("write", target);
			if  ( target != null && target.originalTarget != null && target.originalTarget.index != null )
			{
				this.geographical_select.options[target.originalTarget.index] = null;
				this.geographical_update_selection();
				this._get_selector(this._getValueAttr());
			}
			else
			{
				this.geographical_remove_single();
			}
		},
		geographical_remove_single:function()
		{
			for (var c=0; c<this.geographical_select.options.length ;c++){
				if (this.geographical_select.options[c].selected)
					this.geographical_select.options[c] = null;
			}
			this.geographical_update_selection();
			this._get_selector(this._getValueAttr());

		},
		add_select:function(data)
		{
			this.geographical_select.options[this.geographical_select.options.length] = new Option(data.geographicalname,data.geographicalid);
		},
		_setValueAttr:function(obj)
		{
			var data = obj.data;
			var open = false;
			if ( data == null || data == undefined )
				data = obj;
			this.clear();
			for (var key in data)
			{
				var record = data[key];
				this.geographical_select.options[this.geographical_select.options.length] = new Option(record.geographicalname,record.geographicalid);
				open = true;
			}
			if ( open )
				this.make_open();
			this._extended = false;
			this._get_selector(this._getValueAttr());
		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.geographical_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						geographicalid:parseInt(this.geographical_select.options[c].value),
						geographicalname:this.geographical_select.options[c].text};
				}
				else
				{
					data[c] = parseInt(this.geographical_select.options[c].value);
				}
			}
			var obj = {data:data,cascade:"C"};
			if (this._extended)
			{
				return obj;
			}
			else
			{
				var data = data.length>0?dojo.toJson(obj):"";
				this.value = data;
				return data;
			}
		},
		_getCountAttr:function()
		{
			return this.geographical_select.options.length;
		},
		changeFilter:function()
		{
			this._geographical_select_func();
		},
		_selection_options:function()
		{
			this.button_all.set('disabled',this.geographical_list.length?false:true);
			this.button_single.set('disabled',this.geographical_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.geographical_select.length?false:true);
			this.button_del_single.set('disabled',this.geographical_select.selectedIndex!=-1?false:true);

		},
		_setDisabledAttr:function(values)
		{
			this.disabled = values;
		},
		_getDisabledAttr:function()
		{
			return this.disabled;
		},
		_focus:function()
		{
			this.geographical_list_select.focus();
		},
		_OnFocus:function()
		{
			this.open = true;
			this._toggle_cascade();
		},
		_get_filter:function()
		{
			if (this.filter_radio_restriction.get("checked"))
				return this.filter_radio_restriction.get("value");
			else if ( this.filter_radio_town.get("checked"))
				return this.filter_radio_town.get("value");
			else if ( this.filter_radio_county.get("checked"))
				return this.filter_radio_county.get("value");
			else if ( this.filter_radio_region.get("checked"))
				return this.filter_radio_region.get("value");
			else if ( this.filter_radio_nation.get("checked"))
				return this.filter_radio_nation.get("value");
			return -1;
		},
		_show_all:function()
		{
			var data = this.geographical_list_select.get("value");
			if ( data.length != 0 )
			{
				this._geographical_select_func();
			}
		},
		_show_no_filter:function()
		{
			var data = this.geographical_list_select.get("value");
			if ( data.length != 0 )
			{
				this._geographical_select_func();
			}
			else
			{
				this._clear_selection_box();
				this._selection_options();
			}
		},
		_toggle:function()
		{
			if (this.selectonly== false )
				this.inherited(arguments);
		},
		_tree_view:function()
		{
			this.geog_tree_dlg.show();
		}
});
});





