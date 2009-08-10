/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
var TreeTest = function(){
    // shorthand
    var Tree = Ext.tree;
    
    return {
        init : function(){
            // yui-ext tree
            var tree = new Tree.TreePanel({
                animate:true, 
                autoScroll:true,
                loader: new Tree.TreeLoader({dataUrl:'get-nodes.php'}),
                enableDD:true,
                containerScroll: true,
                border: false,
                dropConfig: {appendOnly:true}
            });
            
            // add a tree sorter in folder mode
            new Tree.TreeSorter(tree, {folderSort:true});
            
            // set the root node
            var root = new Tree.AsyncTreeNode({
                text: 'Ext JS', 
                draggable:false, // disable root node dragging
                id:'src'
            });
            tree.setRootNode(root);
            
            // render the tree
            tree.render('tree');
            
            root.expand(false, /*no anim*/ false);
            
            //-------------------------------------------------------------
            
            // YUI tree            
            var tree2 = new Tree.TreePanel({
                animate:true,
                autoScroll:true,
                //rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl:'get-nodes.php',
                    baseParams: {lib:'yui'} // custom http params
                }),
                containerScroll: true,
                border: false,
                enableDD:true,
                dropConfig: {appendOnly:true}
            });
            
            // add a tree sorter in folder mode
            new Tree.TreeSorter(tree2, {folderSort:true});
            
            // add the root node
            var root2 = new Tree.AsyncTreeNode({
                text: 'My Files', 
                draggable:false, 
                id:'yui'
            });
            tree2.setRootNode(root2);
            tree2.render('tree2');
            
            root2.expand(false, /*no anim*/ false);
        }
    };
}();

Ext.EventManager.onDocumentReady(TreeTest.init, TreeTest, true);