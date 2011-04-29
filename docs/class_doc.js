if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

Ext.define('Docs.SourceCodePanel', {
    extend: 'Ext.panel.Panel',

    id: 'doc-source',
    title: 'Source',
    autoScroll: true,
    listeners: {
        activate: function(a,b,c) {
            var self = this;

            var url = req.baseDocURL + '/source/' + req.source,
                idx = url.indexOf('#');
            if (idx) {
                url = url.substr(0, idx);
            }

            Ext.Ajax.request({
                method  : 'GET',
                url     : url + '?plain=1',

                success : function(response, opts) {
                    self.update('<pre class="prettyprint">' + response.responseText + '</pre>');
                    prettyPrint();
                },
                failure : function(response, opts) {
                  console.log('Fail');
                }
            });
        }
    }
});

Ext.define('Docs.OverviewToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    dock: 'top',
    id: 'overview-toolbar',
    cls: 'member-links',
    padding: '3 5',

    items: [],

    initComponent: function() {

        var self = this;
        var members = [
            ['cfgs', 'Configs', 'configs', 'config'],
            ['properties', 'Properties', 'properties', 'property'],
            ['methods', 'Methods', 'methods', 'method'],
            ['events', 'Events', 'events', 'event']
        ];
        this.items = [];

        members.forEach(function(member) {

            if (clsInfo[member[0]] && clsInfo[member[0]].length) {

                var menuItems = [];
                for(var i=0; i< clsInfo[member[0]].length; i++) {
                    var memberName = clsInfo[member[0]][i];
                    menuItems.push({text: memberName, memberName: member[3] + '-' + memberName});
                }

                var butMenu = Ext.create('Ext.menu.Menu', {
                    items: menuItems,
                    plain: true,
                    listeners: {
                        click: function(menu, item) {
                            Ext.getCmp('doc-overview').scrollToEl("a[name=" + item.memberName + "]");
                        }
                    }
                });

                self.items.push({
                    xtype: 'splitbutton',
                    iconCls: 'icon-' + member[3],
                    cls: member[2],
                    text: member[1] + ' <span class="num">' + clsInfo[member[0]].length + '</span>',
                    listeners: {
                        click: function() {
                            Ext.getCmp('doc-overview').scrollToEl("a[name=" + member[2] + "]");
                        }
                    },
                    menu: butMenu
                });
            }
        });

        if (clsInfo.subclasses.length) {
            var menuItems = [];
            for(var i=0; i< clsInfo.subclasses.length; i++) {
                menuItems.push({text: clsInfo.subclasses[i], clsName: clsInfo.subclasses[i]});
            }

            var butMenu = Ext.create('Ext.menu.Menu', {
                items: menuItems,
                plain: true,
                listeners: {
                    click: function(menu, item) {
                        getDocClass(item.clsName);
                    }
                }
            });

            self.items.push({
                xtype: 'button',
                cls: 'subcls',
                iconCls: 'icon-subclass',
                text: 'Sub Classes <span class="num">' + clsInfo.subclasses.length + '</span>',
                menu: butMenu
            });
        }

        self.items = self.items.concat([
            { xtype: 'tbfill' },
            {
                boxLabel: 'Hide inherited',
                boxLabelAlign: 'before',
                xtype: 'checkbox',
                margin: '0 5 0 0',
                padding: '0 0 5 0',
                handler: function(el) {
                    Ext.query('.member.inherited').forEach(function(m) {
                        if(el.checked) {
                            Ext.get(m).setStyle({display: 'none'});
                        } else {
                            Ext.get(m).setStyle({display: 'block'});
                        }
                    });

                    Ext.query('.member.f').forEach(function(m) {
                        Ext.get(m).removeCls('f');
                    });

                    ['cfgs', 'properties', 'methods', 'events'].forEach(function(m) {
                        // If the number of inherited members is the same as the total number of members...
                        if (Ext.query('.m-'+m+' .member').length == Ext.query('.m-'+m+' .member.inherited').length) {
                            var first = Ext.query('.m-'+m)[0];
                            if (first) {
                                if (el.checked) {
                                    Ext.get(Ext.query('.m-'+m)[0]).setStyle({display: 'none'});
                                } else {
                                    Ext.get(Ext.query('.m-'+m)[0]).setStyle({display: 'block'});
                                }
                            }
                        }
                        var t = el.checked ? 'ni' : 'member';
                        var firstMemberEl = Ext.query('.m-'+m+' .member.' + t);
                        if (firstMemberEl.length > 0) {
                            Ext.get(firstMemberEl[0]).addCls('f');
                        }
                    });
                }
            },
            {
                xtype: 'button',
                iconCls: 'expandAllMembers',
                handler: function() {
                    Ext.query('.member').forEach(function(el) {
                        Ext.get(el).addCls('open');
                    });
                }
            },
            {
                xtype: 'button',
                iconCls: 'collapseAllMembers',
                handler: function() {
                    Ext.query('.member').forEach(function(el) {
                        Ext.get(el).removeCls('open');
                    });
                }
            }
        ]);

        this.callParent(arguments);
    }
});

Ext.define('Docs.OverviewPanel', {
    extend: 'Ext.panel.Panel',

    id: 'doc-overview',
    cls: 'doc-tab iScroll',
    title: 'Overview',
    autoScroll: true,

    scrollToEl: function(query) {
        var el = Ext.get(Ext.query(query)[0]);
        if (el) {
            var scrollOffset = el.getY() - 150;
            var docContent = Ext.get(Ext.query('#doc-overview .x-panel-body')[0]);
            var currentScroll = docContent.getScroll()['top'];
            docContent.scrollTo('top', currentScroll + scrollOffset, true);

            var prnt = el.up('.member');
            if (prnt) {
                Ext.get(prnt).addCls('open');
            }
        }
    },

    listeners: {
        afterrender: function(cmp) {
            cmp.el.addListener('click', function(cmp, el) {
                Ext.get(Ext.get(el).up('.member')).toggleCls('open');
            }, this, {
                preventDefault: true,
                delegate: '.expand'
            });
            cmp.el.addListener('click', function(cmp, el) {
                getDocClass(el.rel);
            }, this, {
                preventDefault: true,
                delegate: '.docClass'
            });
            prettyPrint();
        }
    },

    initComponent: function() {
        this.dockedItems = [
            Ext.create('Docs.OverviewToolbar')
        ];

        if (Ext.get('doc-overview-content')) {
            this.contentEl = 'doc-overview-content';
        }

        this.callParent(arguments);
    }
});


Ext.define('Docs.classPanel', {
    extend: 'Ext.tab.Panel',

    id: 'docTabPanel',
    renderTo: 'docContent',
    
    style: 'border-color: #bfbfbf;',
    plain: true,

    // Remember tab scroll position on Webkit
    listeners: {
        beforetabchange: function(tabPanel, newCard, oldCard) {
            oldCard.prevScroll = oldCard.body.getScroll()['top'];
        },
        tabchange: function(tabPanel, newCard, oldCard) {
            if (newCard.prevScroll) {
                newCard.body.scrollTo('top', newCard.prevScroll);
            }
        },
        afterrender: function() {
            resizeWindowFn();
        }
    },

    initComponent: function() {

        this.height = Ext.get('docContent').getHeight() - 55;
        this.items = [ Ext.create('Docs.OverviewPanel') ];
        
        if (!req.standAloneMode) {
            this.items.push(Ext.create('Docs.SourceCodePanel'));
        }

        this.callParent(arguments);
    }
});

var classCache = {};
var getDocClass = function(cls, noHistory) {

    var member,
        hashIdx = cls.indexOf('#');

    if (hashIdx > 0) {
        member = cls.substr(hashIdx + 1);
        cls = cls.substr(0, hashIdx);
    }
    
    if (req.standAloneMode) {
        if (window.location.href.match(/api/)) {
			window.location = cls + '.html';
        } else if (window.location.href.match(/guide/)){
            window.location = '../api/' + cls + '.html';
        } else {
            window.location = 'api/' + cls + '.html';
		}
		return;
    }

    var fullUrl = req.baseDocURL + "/api/" + cls;
    if (!noHistory && window.history && window.history.pushState) {
		window.history.pushState({
			docClass: cls
		},
		'', fullUrl);
	}

    var docTabPanel = Ext.getCmp('docTabPanel');
    if (docTabPanel) {
        Ext.getCmp('docTabPanel').setActiveTab(0);
    }
    
    if(classCache[cls]) {
        showClass(classCache[cls], member);
    } else {
        if (docTabPanel) {
            Ext.getCmp('doc-overview').setLoading(true);
        }
        
        Ext.data.JsonP.request({
            callbackKey: 'docsCallback',
            url     : req.baseDocURL + '/api/' + cls + '/ajax',

            success : function(response, opts) {
                classCache[response.cls] = response;
                showClass(response, member);
            },
            failure : function(response, opts) {
              console.log('Fail');
            }
        });
    }
};

var showClass = function(resp, anchor) {

    var docTabPanel = Ext.getCmp('docTabPanel');

    clsInfo = resp.clsInfo;
    req.docClass = resp.cls;
    req.source = resp.source;

    if (!docTabPanel) {
         Ext.get('docContent').update('');
         Ext.create('Docs.classPanel');
    }
    
    Ext.get('docTabPanel').show();
    var pageContent = Ext.get('pageContent');
    if (pageContent) {
        pageContent.setVisibilityMode(Ext.core.Element.DISPLAY).hide();        
    }

    var docOverviewTab = Ext.getCmp('doc-overview');

    docOverviewTab.update(resp.content);
    docOverviewTab.removeDocked(Ext.getCmp('overview-toolbar'), true);
    docOverviewTab.addDocked(Ext.create('Docs.OverviewToolbar'));
    docOverviewTab.setLoading(false);

    prettyPrint();
    
    var historyItems = Ext.getCmp('historyItems');
    if (historyItems) {
        
        var item = classPackagesStore.getById(resp.cls);

        var menuItem = {
            text: resp.cls
        };
        if (item.data.value.clsType) {
            menuItem.iconCls = 'icon-'+item.data.value.clsType;
        }
        
        historyItems.insert(0, menuItem);
    }
    

    Ext.get('top-block').update(resp.title);
    if (anchor) {
        Ext.getCmp('doc-overview').scrollToEl("a[name=" + anchor + "]");
    } else {
        var docContent = Ext.get(Ext.query('#doc-overview .x-panel-body')[0]);
        docContent.scrollTo('top', 0);
    }
};

var showContent = function(title, html) {
    Ext.getCmp('docTabPanel').hide();
    Ext.get('pageContent').setVisibilityMode(Ext.core.Element.DISPLAY).show().update(html);
};


/**
 * History manager for compliant browsers
 */
if (window.history && window.history.pushState && !req.standAloneMode) {

    // window.addEventListener('hashchange', function(e) {
    //     // console.log('Hash changed')
    // });

    var ignoreInitialHistory = true;

    window.addEventListener('popstate', function(e) {
        e.preventDefault();

        if (ignoreInitialHistory) {
            ignoreInitialHistory = false;
            return false;
        }

        if (e.state && e.state.docClass) {
            getDocClass(e.state.docClass, true);
        }
        return false;
    }, false);
}



// Ext.onReady(function() {
//     
//     Ext.define('Docs.tabBar', {
//         extend: 'Ext.tab.Panel',
//         
//         id: 'tabBar',
//         items: [],
//         renderTo: Ext.getBody(),
//         width: 500,
//         plain: true,
//         tabPosition: 'bottom',
//         // minTabWidth: 50,
//         autoRender: true,
//         listeners: {
//             afterrender: function() {
//                 this.alignTo('top-block', 'tr', [-500, -10])
//             }
//         },
//         
//         initComponent: function() {
//             
//             var me = this;
//             
//             for(var i=0; i< 15; i++) {
//                 this.items.push({
//                     // xtype: 'tab',
//                     title: 'test ' + i
//                     // tabBar: me
//                 })                
//             }
//             
//             this.callParent(arguments);
//         }
//     });
//     
//     Ext.create('Docs.tabBar')
//     
// })