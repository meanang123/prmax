require({cache:{
'url:research/projects/templates/researchers.html':"<div data-dojo-attach-point=\"containerNode\" >\r\n    <table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n        <tr><td width=\"20%\" class=\"prmaxrowtag\">Researchers</td>\r\n        </tr>\r\n    </table>\r\n    <div class=\"dojolanguagesPane\" >\r\n        <div data-dojo-attach-point=\"selectarea\" >\r\n            <table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n                  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n                  <tr><td colspan=\"3\">\r\n                      <table style=\"width:100%\" class=\"prmaxtable\" >\r\n                            <tr>\r\n                            <td width=\"40%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select</span><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxfocus prmaxinput\",type:\"text\",style:\"width:60%\"' data-dojo-attach-point=\"researchers_list_select\" data-dojo-attach-event=\"onkeyup:researchersSelect\" /></td>\r\n                            </tr>\r\n                      </table>\r\n                      </td></tr>\r\n                      <tr><td ><select style=\"width:100%\" data-dojo-attach-point=\"researchers_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n                  <td>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_add_all\"' data-dojo-attach-point=\"button_all\" data-dojo-attach-event=\"onClick:researchersSelectAll\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_add_single\"' data-dojo-attach-point=\"button_single\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:researchersSelectSingle\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_del_all\"' data-dojo-attach-point=\"button_del_all\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:researchersRemoveAll\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n                  <button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_del_single\"' data-dojo-attach-point=\"button_del_single\" data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:researchersRemoveSingle\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n                  <td ><select style=\"width:100%\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" data-dojo-attach-point=\"researchers_select\" data-dojo-attach-event=\"onChange:researchersUpdateSelection\" data-dojo-props='required:true, \"class\":\"prmaxrequired\"' ></select></td>\r\n            </tr>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    researchers.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Oct 2019
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/projects/researchers", [
    "dojo/_base/declare", // declare
    "ttl/BaseWidgetAMD",
    "dojo/text!../projects/templates/researchers.html",
    "dijit/layout/BorderContainer",
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
    function(declare, BaseWidgetAMD, template, BorderContainer, utilities2, topic, request, json, lang, domstyle, domattr, domclass, ItemFileReadStore, ItemFileWriteStore, JsonRest, Observable, on){

 return declare("research.projects.researchers",
    [BaseWidgetAMD, BorderContainer],{
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
        on(this.researchers_list_select.domNode,"keyup" ,  lang.hitch(this,this.researchersSelect));
        on(this.researchers_list,"change" ,  lang.hitch(this,this.researchersUpdateSelection));
        on(this.researchers_list,"dblclick" ,  lang.hitch(this,this.researchersSelectDbl));

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
        this.researchers_list_select.set("value","");
        this._Get(this._getValueAttr());
        this._SelectionOptions();

        this.inherited(arguments);
    },
    _Send_Request:function( data )
    {
        request.post('/research/admin/user/listuserselection_researchers',
            utilities2.make_params({data: {word: data}})).
            then( this._LoadSelectionCall);
    },
    researchersSelect:function( p1, defaultvalue )
    {
        var data = this.researchers_list_select.get("value");
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
            this.researchers_list.options[this.researchers_list.options.length] = new Option(record.user_name,record.user_id);
        }
        this._SelectionOptions();
    },
    _ClearSelectionBox:function()
    {
        this.researchers_list.options.length=0;
    },
    _ClearSelectedBox:function()
    {
        this.researchers_select.length=0;
    },
    researchersUpdateSelection:function()
    {
        this._SelectionOptions();
    },
    researchersSelectDbl:function()
    {
        this.researchersSelectSingle();
        this._SelectionOptions();
    },
    researchersSelectAll:function()
    {
        for (var c=0; c<this.researchers_list.options.length ;c++){
            var option = this.researchers_list.options[c];
            var addRecord = true;
            for (var c1=0; c1<this.researchers_select.options.length ;c1++){
                if (this.researchers_select.options[c1].value==option.value){
                    addRecord = false;
                    break;
                }
            }
            if ( addRecord ) {
                this.researchers_select.options[this.researchers_select.options.length] = new Option(option.text,option.value);
            }
        }
        this._Get(this._getValueAttr());
        this.researchers_list.options.length = 0 ;
        this.researchersUpdateSelection();
    },
    researchersSelectSingle:function()
    {
        for (var c=0; c<this.researchers_list.options.length ;c++){
            var option = this.researchers_list.options[c];
            if (option.selected) {
                option.selected=false;
                var addRecord = true;
                for (var c1=0; c1<this.researchers_select.options.length ;c1++){
                    if (this.researchers_select.options[c1].value==option.value){
                        addRecord = false;
                        break;
                    }
                }
                if ( addRecord ) {
                    this.researchers_select.options[this.researchers_select.options.length] = new Option(option.text,option.value);
                    this._Get(this._getValueAttr());
                }
            }
        }
    },
    researchersRemoveAll:function()
    {
        this.researchers_select.options.length = 0 ;
        this.researchersUpdateSelection();
        this._Get(this._getValueAttr());
    },
    researchersRemoveSingle:function()
    {
        for (var c=0; c<this.researchers_select.options.length ;c++){
            if (this.researchers_select.options[c].selected)
                this.researchers_select.options[c] = null;
        }
        this.researchersUpdateSelection();
        this._Get(this._getValueAttr());
    },
    addSelect:function(data)
    {
        this.researchers_select.options[this.researchers_select.options.length] = new Option(data.user_name,data.user_id);
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
                this.researchers_select.options[this.researchers_select.options.length] = new Option(record.user_name,record.user_id);
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
        for (var c=0; c<this.researchers_select.options.length ;c++)
        {
            if (this._extended)
            {
                data[c] = {
                    user_id:parseInt(this.researchers_select.options[c].value),
                    user_name:this.researchers_select.options[c].text
                    };
            }
            else
            {
                data[c] = parseInt(this.researchers_select.options[c].value);
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
        return this.researchers_select.options.length;
    },
    _setExtendedAttr:function(value)
    {
        this._extended = value
    },
    _SelectionOptions:function()
    {
        this.button_all.set('disabled',this.researchers_list.length?false:true);
        this.button_single.set('disabled',this.researchers_list.selectedIndex!=-1?false:true);

        this.button_del_all.set('disabled',this.researchers_select.length?false:true);
        this.button_del_single.set('disabled',this.researchers_select.selectedIndex!=-1?false:true);
    },
    _up_down:function()
    {
        var upvalue = true ;
        var downvalue = true ;

        if (this.researchers_select.options.length>1 && this.researchers_select.selectedIndex != -1 )
        {
            if  (this.researchers_select.selectedIndex>0)
                upvalue = false ;

            if  (this.researchers_select.selectedIndex<this.researchers_select.options.length - 1 )
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
        this.researchers_list_select.focus();
    },
    _change_filter:function()
    {
        var data = this.researchers_list_select.get("value");

        if ( data.length == 0)
        data = "*";

        this.researchersSelect(null, data );
    },
    isValid:function()
    {
        var res_selected  = this.researchers_select.value;
        if ( (res_selected == null || res_selected == ""))
        {
            return false;
        }
        else
            return true;
    }
});
});
