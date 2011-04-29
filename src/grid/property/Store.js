/**
 * @class Ext.grid.property.Store
 * @extends Ext.data.Store
 * A custom {@link Ext.data.Store} for the {@link Ext.grid.property.Grid}. This class handles the mapping
 * between the custom data source objects supported by the grid and the {@link Ext.grid.property.Property} format
 * used by the {@link Ext.data.Store} base class.
 * @constructor
 * @param {Ext.grid.Grid} grid The grid this store will be bound to
 * @param {Object} source The source data config object
 */
Ext.define('Ext.grid.property.Store', {

    extend: 'Ext.data.Store',

    alternateClassName: 'Ext.grid.PropertyStore',

    uses: ['Ext.data.reader.Reader', 'Ext.data.proxy.Proxy', 'Ext.data.ResultSet', 'Ext.grid.property.Property'],

    constructor : function(grid, source){
        this.grid = grid;
        this.source = source;
        this.callParent([{
            data: source,
            model: Ext.grid.property.Property,
            proxy: this.getProxy()
        }]);
    },

    // Return a singleton, customized Proxy object which configures itself with a custom Reader
    getProxy: function() {
        if (!this.proxy) {
            Ext.grid.property.Store.prototype.proxy = Ext.create('Ext.data.proxy.Memory', {
                model: Ext.grid.property.Property,
                reader: this.getReader()
            });
        }
        return this.proxy;
    },

    // Return a singleton, customized Reader object which reads Ext.grid.property.Property records from an object.
    getReader: function() {
        if (!this.reader) {
            Ext.grid.property.Store.prototype.reader = Ext.create('Ext.data.reader.Reader', {
                model: Ext.grid.property.Property,

                buildExtractors: Ext.emptyFn,

                read: function(dataObject) {
                    return this.readRecords(dataObject);
                },

                readRecords: function(dataObject) {
                    var val,
                        result = {
                            records: [],
                            success: true
                        };

                    for (var propName in dataObject) {
                        val = dataObject[propName];
                        if (dataObject.hasOwnProperty(propName) && this.isEditableValue(val)) {
                            result.records.push(new Ext.grid.property.Property({
                                name: propName,
                                value: val
                            }, propName));
                        }
                    }
                    result.total = result.count = result.records.length;
                    return Ext.create('Ext.data.ResultSet', result);
                },

                // private
                isEditableValue: function(val){
                    return Ext.isPrimitive(val) || Ext.isDate(val);
                }
            });
        }
        return this.reader;
    },

    // protected - should only be called by the grid.  Use grid.setSource instead.
    setSource : function(dataObject) {
        var me = this;

        me.source = dataObject;
        me.suspendEvents();
        me.removeAll();
        me.proxy.data = dataObject;
        me.load();
        me.resumeEvents();
        me.fireEvent('datachanged', me);
    },

    // private
    getProperty : function(row) {
       return Ext.isNumber(row) ? this.store.getAt(row) : this.store.getById(row);
    },

    // private
    setValue : function(prop, value, create){
        var r = this.getRec(prop);
        if (r) {
            r.set('value', value);
            this.source[prop] = value;
        } else if (create) {
            // only create if specified.
            this.source[prop] = value;
            r = new Ext.grid.property.Property({name: prop, value: value}, prop);
            this.store.add(r);
        }
    },

    // private
    remove : function(prop) {
        var r = this.getRec(prop);
        if(r) {
            this.store.remove(r);
            delete this.source[prop];
        }
    },

    // private
    getRec : function(prop) {
        return this.store.getById(prop);
    },

    // protected - should only be called by the grid.  Use grid.getSource instead.
    getSource : function() {
        return this.source;
    }
});