/**
 * The application header displayed at the top of the viewport
 * @extends Ext.Component
 */
Ext.define('Books.view.Header', {
    alias: 'widget.header',
    extend: 'Ext.Component',
    
    initComponent: function() {
        Ext.applyIf(this, {
            dock: 'top',
            html: 'Loading Nested Data Example',
            cls: 'app-header',
            border: false
        });
                
        this.callParent(arguments);
    }
});