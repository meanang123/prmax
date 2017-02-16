dojo.provide("prmax.lists.projectfilter");

dojo.require("dijit.form._FormWidget");

dojo.declare("prmax.lists.projectfilter",dijit.form._FormWidget,{
        // summary: Wrapper for a native select element to
        //            interact with dijit.form.Form
        
	attributeMap: dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap), {
		label: {node: "containerNode", type: "innerHTML" },
		iconClass: {node: "iconNode", type: "class" }
	}),
       
        templateString: "<div dojoType='dijit.form.FilteringSelect' dojoAttachPoint='containerNode' ></div>",
        // for layout widgets:
        resize: function(/* Object */size){
        }
});