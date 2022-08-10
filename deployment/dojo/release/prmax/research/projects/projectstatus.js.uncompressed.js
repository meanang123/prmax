require({cache:{
'url:research/projects/templates/projectstatus.html':"<div data-dojo-attach-point=\"containerNode\">\r\n    <div class=\"dojolanguagesPane\" >\r\n        <div data-dojo-attach-point=\"selectarea\" class=\"prmaxselectmultiple\" >\r\n            <table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n                  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n                  <tr><td colspan=\"3\">\r\n                      <table style=\"width:100%\" class=\"prmaxtable\" >\r\n                            <tr>\r\n                            <td width=\"40%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select</span><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxfocus prmaxinput\",type:\"text\",style:\"width:150px\"' data-dojo-attach-point=\"projectstatus_list_select\" data-dojo-attach-event=\"onkeyup:projectstatusSelect\" /></td>\r\n                            </tr>\r\n                      </table>\r\n                      </td></tr>\r\n                      <tr><td ><select style=\"width:100%\" data-dojo-attach-point=\"projectstatus_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n                  <td>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_add_all\"' data-dojo-attach-point=\"button_all\" data-dojo-attach-event=\"onClick:projectstatusSelectAll\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_add_single\"' data-dojo-attach-point=\"button_single\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:projectstatusSelectSingle\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_del_all\"' data-dojo-attach-point=\"button_del_all\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:projectstatusRemoveAll\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_del_single\"' data-dojo-attach-point=\"button_del_single\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:projectstatusRemoveSingle\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n                  <td ><select style=\"width:100%\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" data-dojo-attach-point=\"projectstatus_select\" data-dojo-attach-event=\"onChange:projectstatusUpdateSelection\" data-dojo-props='required:true, \"class\":\"prmaxrequired\"' ></select></td>\r\n            </tr>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    projectstatus.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Nov 2019
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/projects/projectstatus", [
    "dojo/_base/declare", // declare
    "ttl/BaseWidgetAMD",
    "dojo/text!../projects/templates/projectstatus.html",
    "ttl/utilities2",
    "dojo/topic",
    "dojo/request",
    "dojo/json",    
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/data/ItemFileReadStore",	
    "dojo/data/ItemFileWriteStore",	
    "ttl/store/JsonRest",
    "dojo/store/Observable",
    "dojo/on",
    ],
    function(declare, BaseWidgetAMD, template, utilities2, topic, request, json, lang, domstyle, domattr, domclass, ItemFileReadStore, ItemFileWriteStore, JsonRest, Observable, on){

 return declare("research.projects.projectstatus",
    [BaseWidgetAMD],{
    templateString: template,
    name:"",
    value:"",
    search : '',
    size:'7',
    testmode:false,
    selectonly:false,
    startopen:false,
    preload:true,
    restrict:1,
    widgetsInTemplate: true,
    constructor: function()
    {
        this.disabled = false;
        this._extended = false;
        this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
        
        this.interestTimer = null;
    },
    postCreate:function()
    {
        on(this.projectstatus_list_select.domNode,"keyup" ,  lang.hitch(this,this.projectstatusSelect));
        on(this.projectstatus_list,"change" ,  lang.hitch(this,this.projectstatusUpdateSelection));
        on(this.projectstatus_list,"dblclick" ,  lang.hitch(this,this.projectstatusSelectDbl));

        if (this.preload)
        {
            this._Send_Request("*");
        }
        
        this.inherited(arguments);
    },
    Clear:function()
    {
        this._ClearSelectionBox();
        this._ClearSelectedBox();
        this.projectstatus_list_select.set("value","");
        this._Get(this._getValueAttr());
        this._SelectionOptions();

        this.inherited(arguments);
    },
    _Send_Request:function( data )
    {
        request.post('/research/admin/projects/listuserselection_projectstatus',
            utilities2.make_params({data: {word: data}})).
            then( this._LoadSelectionCall);
    },
    projectstatusSelect:function( p1, defaultvalue )
    {
        var data = this.projectstatus_list_select.get("value");
        if (data.length>0)
        {
            if (this.interestTimer)    
            {
                clearTimeout ( this.interestTimer);
                this.interestTimer = null;                
            }
            this.interestTimer = setTimeout(dojo.hitch(this, this._Send_Request,data),this.searchTime);
        }
        else
        {
            if (this.interestTimer) 
            {
                clearTimeout ( this.interestTimer);
                this.interestTimer = null;                
            }
            this._ClearSelectionBox();
            this._SelectionOptions();
        }
    },
    _LoadSelection:function(response)
    {
        this._ClearSelectionBox();
        for ( var i=0 ; i <response.data.length; ++i )
        {
            var record = response.data[i];
            this.projectstatus_list.options[this.projectstatus_list.options.length] = new Option(record.researchprojectstatusdescription,record.researchprojectstatusid);
        }
        this._SelectionOptions();
    },
    _ClearSelectionBox:function()
    {
        this.projectstatus_list.options.length=0;
    },
    _ClearSelectedBox:function()
    {
        this.projectstatus_select.length=0;
    },
    projectstatusUpdateSelection:function()
    {
        this._SelectionOptions();
    },
    projectstatusSelectDbl:function()
    {
        this.projectstatusSelectSingle();
        this._SelectionOptions();
    },
    projectstatusSelectAll:function()
    {
        for (var c=0; c<this.projectstatus_list.options.length ;c++){
            var option = this.projectstatus_list.options[c];
            var addRecord = true;
            for (var c1=0; c1<this.projectstatus_select.options.length ;c1++){
                if (this.projectstatus_select.options[c1].value==option.value){
                    addRecord = false;
                    break;
                }
            }
            if ( addRecord ) {
                this.projectstatus_select.options[this.projectstatus_select.options.length] = new Option(option.text,option.value);
            }
        }
        this._Get(this._getValueAttr());
        this.projectstatus_list.options.length = 0 ;
        this.projectstatusUpdateSelection();
    },
    projectstatusSelectSingle:function()
    {
        for (var c=0; c<this.projectstatus_list.options.length ;c++){
            var option = this.projectstatus_list.options[c];
            if (option.selected) {
                option.selected=false;
                var addRecord = true;
                for (var c1=0; c1<this.projectstatus_select.options.length ;c1++){
                    if (this.projectstatus_select.options[c1].value==option.value){
                        addRecord = false;
                        break;
                    }
                }
                if ( addRecord ) {
                    this.projectstatus_select.options[this.projectstatus_select.options.length] = new Option(option.text,option.value);
                    this._Get(this._getValueAttr());
                }
            }
        }
    },
    projectstatusRemoveAll:function()
    {
        this.projectstatus_select.options.length = 0 ;
        this.projectstatusUpdateSelection();
        this._Get(this._getValueAttr());
    },
    projectstatusRemoveSingle:function()
    {
        for (var c=0; c<this.projectstatus_select.options.length ;c++){
            if (this.projectstatus_select.options[c].selected)
                this.projectstatus_select.options[c] = null;
        }
        this.projectstatusUpdateSelection();
        this._Get(this._getValueAttr());
    },
    addSelect:function(data)
    {
        this.projectstatus_select.options[this.projectstatus_select.options.length] = new Option(data.researchprojectstatusdescription,data.researchprojectstatusid);
    },
    _setValueAttr:function(values)
    {
        this.Clear();
        if (values != null)
        {
            var data = values.data;
            var open = false;
            if ( data == null || data == undefined )
                data = values;
            for (var key in data)
            {
                var record = data[key];
                this.projectstatus_select.options[this.projectstatus_select.options.length] = new Option(record.researchprojectstatusdescription,record.researchprojectstatusid);
                opne = true;
            }
            if ( open )
                this.MakeOpen();
            this._Get(this._getValueAttr());
        }
    },
    _getValueAttr:function()
    {
        var data = Array();
        for (var c=0; c<this.projectstatus_select.options.length ;c++)
        {
            if (this._extended)
            {
                data[c] = {
                    researchprojectstatusid:parseInt(this.projectstatus_select.options[c].value),
                    researchprojectstatusdescription:this.projectstatus_select.options[c].text
                    };
            }
            else
            {
                data[c] = parseInt(this.projectstatus_select.options[c].value);
            }
        }
        var obj = {data:data};
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
        return this.projectstatus_select.options.length;
    },
    _setExtendedAttr:function(value)
    {
        this._extended = value
    },
    _SelectionOptions:function()
    {
        this.button_all.set('disabled',this.projectstatus_list.length?false:true);
        this.button_single.set('disabled',this.projectstatus_list.selectedIndex!=-1?false:true);

        this.button_del_all.set('disabled',this.projectstatus_select.length?false:true);
        this.button_del_single.set('disabled',this.projectstatus_select.selectedIndex!=-1?false:true);
    },
    _up_down:function()
    {
        var upvalue = true ;
        var downvalue = true ;

        if (this.projectstatus_select.options.length>1 && this.projectstatus_select.selectedIndex != -1 )
        {
            if  (this.projectstatus_select.selectedIndex>0)
                upvalue = false ;

            if  (this.projectstatus_select.selectedIndex<this.projectstatus_select.options.length - 1 )
                downvalue = false;
        }
    },        
    _setDisabledAttr:function(values)
    {
        this.disabled = values;
    },
    _getDisabledAttr:function()
    {
        return this.disabled;
    },
    _Get:function()
    {
        if (this.selectonly==false)
            this.inherited(arguments);
    },
    _focus:function()
    {
        this.projectstatus_list_select.focus();
    },
    _change_filter:function()
    {
        var data = this.projectstatus_list_select.get("value");

        if ( data.length == 0)
        data = "*";

        this.projectstatusSelect(null, data );
    },
    isValid:function()
    {
        var res_selected  = this.projectstatus_select.value;
        if ( (res_selected == null || res_selected == ""))
        {
            return false;
        }
        else
            return true;
    }
});
});
