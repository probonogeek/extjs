/**
 * @class Ext.toolbar.Fill
 * @extends Ext.Component
 * A non-rendering placeholder item which instructs the Toolbar's Layout to begin using
 * the right-justified button container.
 *
 * {@img Ext.toolbar.Fill/Ext.toolbar.Fill.png Toolbar Fill}
 * Example usage:
<pre><code>
    Ext.create('Ext.panel.Panel', {
        title: 'Toolbar Fill Example',
        width: 300,
        height: 200,
        tbar : [
            'Item 1',
            {xtype: 'tbfill'}, // or '->'
            'Item 2'
        ],
        renderTo: Ext.getBody()
    });
</code></pre>
 * @constructor
 * Creates a new Fill
 * @xtype tbfill
 */
Ext.define('Ext.toolbar.Fill', {
    extend: 'Ext.Component',
    alias: 'widget.tbfill',
    alternateClassName: 'Ext.Toolbar.Fill',
    isFill : true,
    flex: 1
});