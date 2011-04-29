/**
 * @class Ext.tip.QuickTipManager
 * <p>Provides attractive and customizable tooltips for any element. The QuickTips
 * singleton is used to configure and manage tooltips globally for multiple elements
 * in a generic manner.  To create individual tooltips with maximum customizability,
 * you should consider either {@link Ext.tip.Tip} or {@link Ext.tip.ToolTip}.</p>
 * <p>Quicktips can be configured via tag attributes directly in markup, or by
 * registering quick tips programmatically via the {@link #register} method.</p>
 * <p>The singleton's instance of {@link Ext.tip.QuickTip} is available via
 * {@link #getQuickTip}, and supports all the methods, and all the all the
 * configuration properties of Ext.tip.QuickTip. These settings will apply to all
 * tooltips shown by the singleton.</p>
 * <p>Below is the summary of the configuration properties which can be used.
 * For detailed descriptions see the config options for the {@link Ext.tip.QuickTip QuickTip} class</p>
 * <p><b>QuickTips singleton configs (all are optional)</b></p>
 * <div class="mdetail-params"><ul><li>dismissDelay</li>
 * <li>hideDelay</li>
 * <li>maxWidth</li>
 * <li>minWidth</li>
 * <li>showDelay</li>
 * <li>trackMouse</li></ul></div>
 * <p><b>Target element configs (optional unless otherwise noted)</b></p>
 * <div class="mdetail-params"><ul><li>autoHide</li>
 * <li>cls</li>
 * <li>dismissDelay (overrides singleton value)</li>
 * <li>target (required)</li>
 * <li>text (required)</li>
 * <li>title</li>
 * <li>width</li></ul></div>
 * <p>Here is an example showing how some of these config options could be used:</p>
 *
 * {@img Ext.tip.QuickTipManager/Ext.tip.QuickTipManager.png Ext.tip.QuickTipManager component}
 *
 * ## Code
 *    // Init the singleton.  Any tag-based quick tips will start working.
 *    Ext.tip.QuickTipManager.init();
 *    
 *    // Apply a set of config properties to the singleton
 *    Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
 *        maxWidth: 200,
 *        minWidth: 100,
 *        showDelay: 50      // Show 50ms after entering target
 *    });
 *    
 *    // Create a small panel to add a quick tip to
 *    Ext.create('Ext.container.Container', {
 *        id: 'quickTipContainer',
 *        width: 200,
 *        height: 150,
 *        style: {
 *            backgroundColor:'#000000'
 *        },
 *        renderTo: Ext.getBody()
 *    });
 *
 *    
 *    // Manually register a quick tip for a specific element
 *    Ext.tip.QuickTipManager.register({
 *        target: 'quickTipContainer',
 *        title: 'My Tooltip',
 *        text: 'This tooltip was added in code',
 *        width: 100,
 *        dismissDelay: 10000 // Hide after 10 seconds hover
 *    });
</code></pre>
 * <p>To register a quick tip in markup, you simply add one or more of the valid QuickTip attributes prefixed with
 * the <b>ext:</b> namespace.  The HTML element itself is automatically set as the quick tip target. Here is the summary
 * of supported attributes (optional unless otherwise noted):</p>
 * <ul><li><b>hide</b>: Specifying "user" is equivalent to setting autoHide = false.  Any other value will be the
 * same as autoHide = true.</li>
 * <li><b>qclass</b>: A CSS class to be applied to the quick tip (equivalent to the 'cls' target element config).</li>
 * <li><b>qtip (required)</b>: The quick tip text (equivalent to the 'text' target element config).</li>
 * <li><b>qtitle</b>: The quick tip title (equivalent to the 'title' target element config).</li>
 * <li><b>qwidth</b>: The quick tip width (equivalent to the 'width' target element config).</li></ul>
 * <p>Here is an example of configuring an HTML element to display a tooltip from markup:</p>
 * <pre><code>
// Add a quick tip to an HTML button
&lt;input type="button" value="OK" ext:qtitle="OK Button" ext:qwidth="100"
     data-qtip="This is a quick tip from markup!">&lt;/input>
</code></pre>
 * @singleton
 */
Ext.define('Ext.tip.QuickTipManager', function() {
    var tip,
        disabled = false;

    return {
        requires: ['Ext.tip.QuickTip'],
        singleton: true,
        alternateClassName: 'Ext.QuickTips',
        /**
         * Initialize the global QuickTips instance and prepare any quick tips.
         * @param {Boolean} autoRender True to render the QuickTips container immediately to preload images. (Defaults to true) 
         */
        init : function(autoRender){
            if (!tip) {
                if (!Ext.isReady) {
                    Ext.onReady(function(){
                        Ext.tip.QuickTipManager.init(autoRender);
                    });
                    return;
                }
                tip = Ext.create('Ext.tip.QuickTip', {
                    disabled: disabled,
                    renderTo: autoRender !== false ? document.body : undefined
                });
            }
        },

        /**
         * Destroy the QuickTips instance.
         */
        destroy: function() {
            if (tip) {
                var undef;
                tip.destroy();
                tip = undef;
            }
        },

        // Protected method called by the dd classes
        ddDisable : function(){
            // don't disable it if we don't need to
            if(tip && !disabled){
                tip.disable();
            }
        },

        // Protected method called by the dd classes
        ddEnable : function(){
            // only enable it if it hasn't been disabled
            if(tip && !disabled){
                tip.enable();
            }
        },

        /**
         * Enable quick tips globally.
         */
        enable : function(){
            if(tip){
                tip.enable();
            }
            disabled = false;
        },

        /**
         * Disable quick tips globally.
         */
        disable : function(){
            if(tip){
                tip.disable();
            }
            disabled = true;
        },

        /**
         * Returns true if quick tips are enabled, else false.
         * @return {Boolean}
         */
        isEnabled : function(){
            return tip !== undefined && !tip.disabled;
        },

        /**
         * Gets the single {@link Ext.tip.QuickTip QuickTip} instance used to show tips from all registered elements.
         * @return {Ext.tip.QuickTip}
         */
        getQuickTip : function(){
            return tip;
        },

        /**
         * Configures a new quick tip instance and assigns it to a target element.  See
         * {@link Ext.tip.QuickTip#register} for details.
         * @param {Object} config The config object
         */
        register : function(){
            tip.register.apply(tip, arguments);
        },

        /**
         * Removes any registered quick tip from the target element and destroys it.
         * @param {String/HTMLElement/Element} el The element from which the quick tip is to be removed.
         */
        unregister : function(){
            tip.unregister.apply(tip, arguments);
        },

        /**
         * Alias of {@link #register}.
         * @param {Object} config The config object
         */
        tips : function(){
            tip.register.apply(tip, arguments);
        }
    };
}());