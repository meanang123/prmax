//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.ClippingsType
// Author:  
// Purpose:
// Created: June 2016
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.clippingstype");

dojo.require("ttl.BaseWidget");

// Main control
dojo.declare("prcommon.clippings.clippingstype",
    [ ttl.BaseWidget],
    {
        name:"",		// name used for a form integration
        value:"",
        displaytitle : 'clippingstype',
        search : '',
        size:'7',
        testmode:false,
        selectonly:false,
        startopen:false,
        preload:true,
        interesttypeid:1,
        restrict:1,
        widgetsInTemplate: true,
        templatePath: dojo.moduleUrl( "prcommon.clippings","templates/clippingstype.html"),
        constructor: function()
        {
            this.disabled = false;
            this._extended = false;
            this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
            
            this.interestTimer = null;
        },
        postCreate:function()
        {
            // key
            dojo.connect(this.clippingstype_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this.clippingsTypeSelect));
            dojo.connect(this.clippingstype_list,"onchange" ,  dojo.hitch(this,this.clippingsTypeUpdateSelection));
            dojo.connect(this.clippingstype_list,"ondblclick" ,  dojo.hitch(this,this.clippingsTypeSelectDbl));

            if (this.preload)
            {
                this._Send_Request("*");
            }
            
            this.inherited(arguments);
        },
        
        // styandard clear function
        Clear:function()
        {
            this._ClearSelectionBox();
            this._ClearSelectedBox();
            this.clippingstype_list_select.set("value","");
            this._Get(this._getValueAttr());
            this._SelectionOptions();

            this.inherited(arguments);
        },
        
        _Send_Request:function( data )
        {
        
            dojo.xhrPost(
                ttl.utilities.makeParams({
                    load: this._LoadSelectionCall,
                    url:'/clippingstypes/listuserselection',
                    content:{ word:data}}));
        },
        clippingsTypeSelect:function( p1, defaultvalue )
        {
            var data = this.clippingstype_list_select.get("value");
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
                this.clippingstype_list.options[this.clippingstype_list.options.length] = new Option(record.clippingstypedescription,record.clippingstypeid);
            }
            this._SelectionOptions();
        },
        _ClearSelectionBox:function()
        {
            this.clippingstype_list.options.length=0;
        },
        _ClearSelectedBox:function()
        {
            this.clippingstype_select.length=0;
        },
        clippingsTypeUpdateSelection:function()
        {
            this._SelectionOptions();
        },
        clippingsTypeSelectDbl:function()
        {
            this.clippingsTypeSelectSingle();
            this._SelectionOptions();
        },
        clippingsTypeSelectAll:function()
        {
            for (var c=0; c<this.clippingstype_list.options.length ;c++){
                var option = this.clippingstype_list.options[c];
                var addRecord = true;
                for (var c1=0; c1<this.clippingstype_select.options.length ;c1++){
                    if (this.clippingstype_select.options[c1].value==option.value){
                        addRecord = false;
                        break;
                    }
                }
                if ( addRecord ) {
                    this.clippingstype_select.options[this.clippingstype_select.options.length] = new Option(option.text,option.value);
                }
            }
            this._Get(this._getValueAttr());
            this.clippingstype_list.options.length = 0 ;
            this.clippingUpdateSelection();
        },
        clippingsTypeSelectSingle:function()
        {
            for (var c=0; c<this.clippingstype_list.options.length ;c++){
                var option = this.clippingstype_list.options[c];
                if (option.selected) {
                    option.selected=false;
                    var addRecord = true;
                    for (var c1=0; c1<this.clippingstype_select.options.length ;c1++){
                        if (this.clippingstype_select.options[c1].value==option.value){
                            addRecord = false;
                            break;
                        }
                    }
                    if ( addRecord ) {
                        this.clippingstype_select.options[this.clippingstype_select.options.length] = new Option(option.text,option.value);
                        this._Get(this._getValueAttr());
                    }
                }
            }
        },
        clippingsTypeRemoveAll:function()
        {
            this.clippingstype_select.options.length = 0 ;
            this.clippingsTypeUpdateSelection();
            this._Get(this._getValueAttr());
        },
        clippingsTypeRemoveSingle:function()
        {
            for (var c=0; c<this.clippingstype_select.options.length ;c++){
                if (this.clippingstype_select.options[c].selected)
                    this.clippingstype_select.options[c] = null;
            }
            this.clippingsTypeUpdateSelection();
            this._Get(this._getValueAttr());

        },
        addSelect:function(data)
        {
            this.clippingstype_select.options[this.clippingstype_select.options.length] = new Option(data.clippingstypedescription,data.clippingstypeid);
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
                    this.clippingstype_select.options[this.clippingstype_select.options.length] = new Option(record.clippingstypedescription,record.clippingstypeid);
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
            for (var c=0; c<this.clippingstype_select.options.length ;c++)
            {
                if (this._extended)
                {
                    data[c] = {
                        clippingstypeid:parseInt(this.clippingstype_select.options[c].value),
                        clippingstypedescription:this.clippingstype_select.options[c].text
                        };
                }
                else
                {
                    data[c] = parseInt(this.clippingstype_select.options[c].value);
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
            return this.clippingstype_select.options.length;
        },
        _setExtendedAttr:function(value)
        {
            this._extended = value
        },
//        _change_filter:function()
//        {
//            this.clippingsTypeSelect();
//        },
        _SelectionOptions:function()
        {
            this.button_all.set('disabled',this.clippingstype_list.length?false:true);
            this.button_single.set('disabled',this.clippingstype_list.selectedIndex!=-1?false:true);

            this.button_del_all.set('disabled',this.clippingstype_select.length?false:true);
            this.button_del_single.set('disabled',this.clippingstype_select.selectedIndex!=-1?false:true);
        },
        _up_down:function()
        {
            var upvalue = true ;
            var downvalue = true ;

            if (this.clippingstype_select.options.length>1 && this.clippingstype_select.selectedIndex != -1 )
            {
                if  (this.clippingstype_select.selectedIndex>0)
                    upvalue = false ;

                if  (this.clippingstype_select.selectedIndex<this.clippingstype_select.options.length - 1 )
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
            this.clippingstype_list_select.focus();
        },
        _change_filter:function()
        {
            var data = this.clippingstype_list_select.get("value");

            if ( data.length == 0)
            data = "*";

            this.clippingsTypeSelect(null, data );
        },
        isValid:function()
        {
            var cliptype_selected  = this.clippingstype_select.value;
            if ( (cliptype_selected == null || cliptype_selected == ""))
            {
                return false;
            }
            else
                return true;
        }
});





