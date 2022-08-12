// wrapped by build app
define("ttl/Select", ["dijit","dojo","dojox","dojo/require!dijit/form/_FormWidget"], function(dijit,dojo,dojox){
dojo.provide("ttl.Select");

dojo.require("dijit.form._FormWidget");

dojo.declare("ttl.Select",dijit.form._FormWidget,{
        // summary: Wrapper for a native select element to
        //            interact with dijit.form.Form

        // size: Number
        //            Number of elements to display on a page
        //            NOTE: may be removed in version 2.0, since elements may have variable height;
        //            set the size via style="..." or CSS class names instead.
        size: 1,
       
        templateString: "<select dojoAttachPoint='containerNode,focusNode' dojoAttachEvent='onchange: _onChange'></select>",

        attributeMap: dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap),
                {size:"focusNode"}),

        addSelected: function(/* dijit.form.Select */select){
                // summary: Move the selected nodes af an passed Select widget
                //                  instance to this Select widget.
                //
                // example:
                // |    // move all the selected values from "bar" to "foo"
                // |    dijit.byId("foo").addSelected(dijit.byId("bar"));
               
                select.getSelected().forEach(function(n){
                        this.containerNode.appendChild(n);
                },this);
        },
                                       
        getSelected: function(){
                // summary: Access the NodeList of the selected options directly
                return dojo.query("option",this.containerNode).filter(function(n){
                        return n.selected; // Boolean
                });
        },
       
        _getValueDeprecated: false, // remove when _FormWidget:_getValueDeprecated is removed in 2.0
        getValue: function(){
                // summary: Returns an array of the selected options' values
                return this.getSelected().map(function(n){
                        return n.value;
                });
        },
       
        _multiValue: false, // for Form
        setValue: function(/* Array */values){
                // summary: Set the value(s) of this Select based on passed values
                dojo.query("option",this.containerNode).forEach(function(n){
                        n.selected = (dojo.indexOf(values,n.value) != -1);
                });
        },
               
        invertSelection: function(onChange){
                // summary: Invert the selection
                // onChange: Boolean
                //            If null, onChange is not fired.
                dojo.query("option",this.containerNode).forEach(function(n){
                        n.selected = !n.selected;
                });
                this._handleOnChange(this.getValue(), onChange==true);
        },

        _onChange: function(/*Event*/ e){
                this._handleOnChange(this.getValue(), true);
        },
       
        // for layout widgets:
        resize: function(/* Object */size){
                if(size){
                        dojo.marginBox(this.domNode, size);
                }
        },
       
        postCreate: function(){
                this._onChange();
        }
});
});