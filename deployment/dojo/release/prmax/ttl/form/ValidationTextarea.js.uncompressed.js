// wrapped by build app
define("ttl/form/ValidationTextarea", ["dijit","dojo","dojox","dojo/require!dijit/form/SimpleTextarea,dijit/form/ValidationTextBox"], function(dijit,dojo,dojox){
dojo.provide("ttl.form.ValidationTextarea");

dojo.require("dijit.form.SimpleTextarea");
dojo.require("dijit.form.ValidationTextBox");

dojo.declare(
  "ttl.form.ValidationTextarea",
  [dijit.form.ValidationTextBox,dijit.form.SimpleTextarea],
  {
		invalidMessage: "This field is required",

		postCreate: function()
		{
			this.inherited(arguments);
		},

		validate: function()
		{
			this.inherited(arguments);
					if (arguments.length==0) this.validate(true);
		},

		onFocus: function()
		{
			if (!this.isValid())
			{
				this.displayMessage(this.getErrorMessage());
			}
		},
		onBlur: function()
		{
			this.validate(false);
		},
		validator: function( value, constraints)
		{
			// summary:
			//	test for constraints.
			// remove the cr characters
			// tags:
			//		protected
			value = value.replace(/[\r\l\n]+/g, ' ');

			return (new RegExp("^(?:" + this.regExpGen(constraints) + ")"+(this.required?"":"?")+"$")).test(value) &&
				(!this.required || !this._isEmpty(value)) &&
				(this._isEmpty(value) || this.parse(value, constraints) !== undefined); // Boolean
		}
});
});
