
Ext.define('Docs.ClassTree', {
    extend: 'Ext.tree.Panel',

    id: 'treePanelCmp',
    cls: 'iScroll',
    renderTo: 'treePanel',
    folderSort: true,
    useArrows: true,

    height: Ext.core.Element.getViewportHeight() - 170,
    border: false,
    bodyBorder: false,
    padding: '0 0 0 20',

    // dockedItems: [
    //     {
    //         xtype: 'container',
    //         layout: 'hbox',
    //         dock: 'top',
    //         margin: '0 0 10 0',
    //         items: [
    //             {
    //                 xtype: 'button',
    //                 text: 'Favorites',
    //                 clickEvent: 'mouseover',
    //                 iconCls: 'icon-fav',
    //                 baseCls: 'historyBut',
    //                 margin: '0 10 0 0',
    //                 menu: {
    //                     plain: true,
    //                     items: [],
    //                     listeners: {
    //                         click: function(menu, item) {
    //                             if (item) {
    //                                 getDocClass(item.text)
    //                             }
    //                         }
    //                     }
    //                 }
    //             },
    //             {
    //                 xtype: 'button',
    //                 text: 'History',
    //                 iconCls: 'icon-hist',
    //                 clickEvent: 'mouseover',
    //                 baseCls: 'historyBut',
    //                 menu: {
    //                     id: 'historyItems',
    //                     plain: true,
    //                     items: [
    //                         { text: 'Ext.button.Button', iconCls: 'icon-class' }
    //                     ],
    //                     listeners: {
    //                         click: function(menu, item) {
    //                             if (item) {
    //                                 getDocClass(item.text)
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         ]
    //     }
    // ],

    listeners: {
		itemclick: function(view, node) {
		    
		    var clsName = node.raw ? node.raw.clsName : node.data.clsName;
		    
		    if (clsName) {
                getDocClass(clsName)
		    } else if (!node.isLeaf()){
			    if (node.isExpanded()) {
				    node.collapse(false);
			    } else{
				    node.expand(false);
			    }
			}
		},
		render: function() {
		    var self = this;
		    setTimeout(function() {
                self.selectCurrentClass()
		    }, 500)
		}
	},

	selectCurrentClass: function() {

	    var treePanel = Ext.getCmp('treePanelCmp');

		if (req.docClass != 'undefined') {

			var classNode = Ext.getCmp('treePanelCmp').getRootNode().findChildBy(function(n){
			    return req.docClass == n.raw.clsName;
			}, null, true);

			if (classNode) {
				treePanel.getSelectionModel().select(classNode);
				classNode.bubble(function(n){
				    n.expand()
				});
			}
		}
	}
});


Ext.define('CouchView', {
    extend: 'Ext.data.Model',
    fields: [ 'id', 'key', 'value' ]
});

var convert = function(classes) {
	var tree = {},
		nodes = [],
		id = 0;

		c = classes;

	classes.keys.forEach(function(cls) {

		var parts = cls.split('.'),
			prevObject = tree;

		var stitchedParts = [];
		for (var i = 0; i < parts.length; i++) {
			if (i > 0 && parts[i + 1]  && parts[i + 1][0] && parts[i][0] && parts[i][0].match(/^[A-Z]/) && parts[i + 1][0].match(/^[A-Z]/)) {
				var n = parts.splice(i, 2).join('.');
				parts.splice(i, 0, n);
			}
		}

		parts.forEach(function(part) {
			if (!prevObject[part]) {
				prevObject[part] = {};
			}

			prevObject = prevObject[part];
		});
	});

	function handleTree(cls, tree) {
		var innerNodes = [];

        var treeKeys = [];
        for (var key in tree) treeKeys.push(key);

		treeKeys.forEach(function(key) {
			innerNodes.push({
				id: id++,
				text: key
			});
			innerNodes[innerNodes.length - 1].allowDrop = false;
			var clsName = (cls ? (cls + ".") : "") + key;
			var clsData = classes.get(clsName);

			var subTreeKeys = [];
            for (var k2 in tree[key]) subTreeKeys.push(k2);
			if (subTreeKeys.length) {
				innerNodes[innerNodes.length - 1].children = handleTree(clsName, tree[key]);
				innerNodes[innerNodes.length - 1].allowDrag = false;
                innerNodes[innerNodes.length - 1].iconCls = 'icon-pkg';
                if(clsData) {
                    innerNodes[innerNodes.length - 1].clsName = clsName;
                    innerNodes[innerNodes.length - 1].text = innerNodes[innerNodes.length - 1].text + '<a rel="'+clsName+'" class="fav"></a>';
                    innerNodes[innerNodes.length - 1].iconCls = 'icon-' + clsData.data.value.clsType;
                }
			} else {
				if(clsData) {
                    innerNodes[innerNodes.length - 1].iconCls = 'icon-' + clsData.data.value.clsType;
				}

                innerNodes[innerNodes.length - 1].text = innerNodes[innerNodes.length - 1].text + '<a rel="'+clsName+'" class="fav"></a>';
				innerNodes[innerNodes.length - 1].leaf = true;
				innerNodes[innerNodes.length - 1].clsName = clsName;
			}
		});

		return innerNodes;
	}

	return handleTree(null, tree);
};

var classPackagesStore;

var resizeWindows;
var resizeWindowFn = function() {
    
    var treePanelCmp = Ext.getCmp('treePanelCmp'),
        docTabPanel = Ext.getCmp('docTabPanel'),
        container = Ext.get('container'),
        viewportHeight = Ext.core.Element.getViewportHeight(),
        viewportWidth = Ext.core.Element.getViewportWidth();

    if (Ext.get('notice')) {
        viewportHeight = viewportHeight - 40;
    }

    container.setStyle({position: 'absolute', height: String(viewportHeight - 40) + 'px', width: String(viewportWidth - 280) + 'px'})
    
    if (treePanelCmp) {
        treePanelCmp.setHeight(viewportHeight - 140);
    } else {
        Ext.get('docContent').setHeight(viewportHeight - 90);
    }

    if (docTabPanel) {
        docTabPanel.setHeight(viewportHeight - 125);
    }
    
    resizeWindows = null;
};

// Resize the main window and tree on resize
Ext.onReady(function() {

    resizeWindowFn();
    
    window.onresize = function() {
        if(!resizeWindows) {
            resizeWindows = setTimeout(resizeWindowFn, 100);
        }
    };
    
    if (req.standAloneMode) {
        if (window.location.href.match(/api/)) {
			req.baseDocURL = '../';
        } else if (window.location.href.match(/guide/)){
			req.baseDocURL = '../';
		}
    }

    classPackagesStore = new Ext.data.Store({
        model: 'CouchView',
        proxy: {
            type: 'jsonp',
            callbackParam: 'callback',
            url : req.baseDocURL + '/classes.json',
            reader: {
                type: 'json',
                root: 'rows'
            }
        },
        autoLoad: true,
        listeners: {
            load: function() {
                var nodes = convert(this.data)[0];
                nodes.expanded = true;
                Ext.create('Docs.ClassTree', {
                    root: nodes
                });
            }
        }
    });
    
});