/**
 * @class Ext.Error
 * @private
 * @extends Error

A wrapper class for the native JavaScript Error object that adds a few useful capabilities for handling
errors in an Ext application. When you use Ext.Error to {@link #raise} an error from within any class that
uses the Ext 4 class system, the Error class can automatically add the source class and method from which
the error was raised. It also includes logic to automatically log the eroor to the console, if available, 
with additional metadata about the error. In all cases, the error will always be thrown at the end so that
execution will halt.

Ext.Error also offers a global error {@link #handle handling} method that can be overridden in order to 
handle application-wide errors in a single spot. You can optionally {@link #ignore} errors altogether,
although in a real application it's usually a better idea to override the handling function and perform
logging or some other method of reporting the errors in a way that is meaningful to the application.

At its simplest you can simply raise an error as a simple string from within any code:

#Example usage:#

    Ext.Error.raise('Something bad happened!');
    
If raised from plain JavaScript code, the error will be logged to the console (if available) and the message
displayed. In most cases however you'll be raising errors from within a class, and it may often be useful to add
additional metadata about the error being raised.  The {@link #raise} method can also take a config object.
In this form the `msg` attribute becomes the error description, and any other data added to the config gets
added to the error object and, if the console is available, logged to the console for inspection.

#Example usage:#
 
    Ext.define('Ext.Foo', {
        doSomething: function(option){
            if (someCondition === false) {
                Ext.Error.raise({
                    msg: 'You cannot do that!',
                    option: option,   // whatever was passed into the method
                    'error code': 100 // other arbitrary info
                });
            }
        }
    });

If a console is available (that supports the `console.dir` function) you'll see console output like:

    An error was raised with the following data:
    option:         Object { foo: "bar"}
        foo:        "bar"
    error code:     100
    msg:            "You cannot do that!"
    sourceClass:   "Ext.Foo"
    sourceMethod:  "doSomething"
    
    uncaught exception: You cannot do that!

As you can see, the error will report exactly where it was raised and will include as much information as the 
raising code can usefully provide.

If you want to handle all application errors globally you can simply override the static {@link handle} method
and provide whatever handling logic you need. If the method returns true then the error is considered handled
and will not be thrown to the browser. If anything but true is returned then the error will be thrown normally.

#Example usage:#

    Ext.Error.handle = function(err) {
        if (err.someProperty == 'NotReallyAnError') {
            // maybe log something to the application here if applicable
            return true;
        }
        // any non-true return value (including none) will cause the error to be thrown
    }

 * Create a new Error object
 * @param {Object} config The config object
 * @markdown
 * @author Brian Moeskau <brian@sencha.com>
 * @docauthor Brian Moeskau <brian@sencha.com>
 */
Ext.Error = Ext.extend(Error, {
    statics: {
        /**
         * @property ignore
Static flag that can be used to globally disable error reporting to the browser if set to true
(defaults to false). Note that if you ignore Ext errors it's likely that some other code may fail
and throw a native JavaScript error thereafter, so use with caution. In most cases it will probably
be preferable to supply a custom error {@link #handle handling} function instead.

#Example usage:#

    Ext.Error.ignore = true;

         * @markdown
         * @static
         */
        ignore: false,

        /**
Raise an error that can include additional data and supports automatic console logging if available. 
You can pass a string error message or an object with the `msg` attribute which will be used as the 
error message. The object can contain any other name-value attributes (or objects) to be logged 
along with the error.

Note that after displaying the error message a JavaScript error will ultimately be thrown so that 
execution will halt.

#Example usage:#

    Ext.Error.raise('A simple string error message');

    // or...

    Ext.define('Ext.Foo', {
        doSomething: function(option){
            if (someCondition === false) {
                Ext.Error.raise({
                    msg: 'You cannot do that!',
                    option: option,   // whatever was passed into the method
                    'error code': 100 // other arbitrary info
                });
            }
        }
    });
         * @param {String/Object} err The error message string, or an object containing the 
         * attribute "msg" that will be used as the error message. Any other data included in
         * the object will also be logged to the browser console, if available.
         * @static
         * @markdown
         */
        raise: function(err){
            err = err || {};
            if (Ext.isString(err)) {
                err = { msg: err };
            }

            var method = this.raise.caller;

            if (method) {
                if (method.$name) {
                    err.sourceMethod = method.$name;
                }
                if (method.$owner) {
                    err.sourceClass = method.$owner.$className;
                }
            }

            if (Ext.Error.handle(err) !== true) {
                var global = Ext.global,
                    con = global.console,
                    msg = Ext.Error.prototype.toString.call(err),
                    noConsoleMsg = 'An uncaught error was raised: "' + msg + 
                        '". Use Firebug or Webkit console for additional details.';

                if (con) {
                    if (con.dir) {
                        con.warn('An uncaught error was raised with the following data:');
                        con.dir(err);
                    }
                    else {
                        con.warn(noConsoleMsg);
                    }
                    if (con.error) {
                        con.error(msg);
                    }
                }
                else if (global.alert){
                    global.alert(noConsoleMsg);
                }
                
                throw new Ext.Error(err);
            }
        },

        /**
Globally handle any Ext errors that may be raised, optionally providing custom logic to
handle different errors individually. Return true from the function to bypass throwing the
error to the browser, otherwise the error will be thrown and execution will halt.

#Example usage:#

    Ext.Error.handle = function(err) {
        if (err.someProperty == 'NotReallyAnError') {
            // maybe log something to the application here if applicable
            return true;
        }
        // any non-true return value (including none) will cause the error to be thrown
    }

         * @param {Ext.Error} err The Ext.Error object being raised. It will contain any attributes
         * that were originally raised with it, plus properties about the method and class from which
         * the error originated (if raised from a class that uses the Ext 4 class system).
         * @static
         * @markdown
         */
        handle: function(){
            return Ext.Error.ignore;
        }
    },

    /**
     * @constructor
     * @param {String/Object} config The error message string, or an object containing the 
     * attribute "msg" that will be used as the error message. Any other data included in
     * the object will be applied to the error instance and logged to the browser console, if available.
     */
    constructor: function(config){
        if (Ext.isString(config)) {
            config = { msg: config };
        }
        Ext.apply(this, config);
    },

    /**
Provides a custom string representation of the error object. This is an override of the base JavaScript 
`Object.toString` method, which is useful so that when logged to the browser console, an error object will 
be displayed with a useful message instead of `[object Object]`, the default `toString` result.

The default implementation will include the error message along with the raising class and method, if available,
but this can be overridden with a custom implementation either at the prototype level (for all errors) or on
a particular error instance, if you want to provide a custom description that will show up in the console.
     * @markdown
     * @return {String} The error message. If raised from within the Ext 4 class system, the error message
     * will also include the raising class and method names, if available.
     */
    toString: function(){
        var me = this,
            className = me.className ? me.className  : '',
            methodName = me.methodName ? '.' + me.methodName + '(): ' : '',
            msg = me.msg || '(No description provided)';

        return className + methodName + msg;
    }
});