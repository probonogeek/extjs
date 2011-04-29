describe("Ext", function() {

    describe("Ext.apply", function() {
        var origin, o;

        beforeEach(function() {
            origin = {
                name: 'value',
                something: 'cool',
                items: [1,2,3],
                method: function() {
                    this.myMethodCalled = true;
                },
                toString: function() {
                    this.myToStringCalled = true;
                }
            };
        });

        it("should copy normal properties", function() {
            Ext.apply(origin, {
                name: 'newName',
                items: [4,5,6],
                otherThing: 'not cool',
                isCool: false
            });

            expect(origin.name).toEqual('newName');
            expect(origin.items).toEqual([4,5,6]);
            expect(origin.something).toEqual('cool');
            expect(origin.otherThing).toEqual('not cool');
            expect(origin.isCool).toEqual(false);
        });

        it("should copy functions", function() {
            Ext.apply(origin, {
                method: function() {
                    this.newMethodCalled = true;
                }
            });

            origin.method();

            expect(origin.myMethodCalled).not.toBeDefined();
            expect(origin.newMethodCalled).toBeTruthy();
        });

        it("should copy non-enumerables", function() {
            Ext.apply(origin, {
                toString: function() {
                    this.newToStringCalled = true;
                }
            });

            origin.toString();

            expect(origin.myToStringCalled).not.toBeDefined();
            expect(origin.newToStringCalled).toBeTruthy();
        });

        it("should apply properties and return an object", function() {
            o = Ext.apply({}, {
                foo: 1,
                bar: 2
            });

            expect(o).toEqual({
                foo: 1,
                bar: 2
            });
        });

        it("should change the reference of the object", function() {
            o = {};
            Ext.apply(o, {
                opt1: 'x',
                opt2: 'y'
            });

            expect(o).toEqual({
                opt1: 'x',
                opt2: 'y'
            });
        });

        it("should overwrite properties", function() {
            o = Ext.apply({
                foo: 1,
                baz: 4
            }, {
                foo: 2,
                bar: 3
            });

            expect(o).toEqual({
                foo: 2,
                bar: 3,
                baz: 4
            });
        });

        it("should use default", function() {
            o = {};

            Ext.apply(o, {
                foo: 'new',
                exist: true
            }, {
                foo: 'old',
                def: true
            });

            expect(o).toEqual({
                foo: 'new',
                def: true,
                exist: true
            });
        });

        it("should override all defaults", function() {
            o = Ext.apply({}, {
                foo: 'foo',
                bar: 'bar'
            }, {
                foo: 'oldFoo',
                bar: 'oldBar'
            });

            expect(o).toEqual( {
                foo: 'foo',
                bar: 'bar'
            });
        });

        it("should return null if null is passed as first argument", function() {
           expect(Ext.apply(null, {})).toBeNull();
        });

        it("should return the object if second argument is no defined", function() {
            o = {
                foo: 1
            };
            expect(Ext.apply(o)).toEqual(o);
        });

        it("should override valueOf", function() {
            o = Ext.apply({}, {valueOf: 1});

            expect(o.valueOf).toEqual(1);
        });

        it("should override toString", function() {
            o = Ext.apply({}, {toString: 3});

            expect(o.toString).toEqual(3);

        });
    });

    describe("Ext.applyIf", function(){
        var o;

        it("should apply properties and return an object with an empty destination object", function() {
            o = Ext.applyIf({}, {
                foo: 'foo',
                bar: 'bar'
            });

            expect(o).toEqual( {
                foo: 'foo',
                bar: 'bar'
            });
        });

        it("should not override default properties", function() {
            o = Ext.applyIf({
                foo: 'foo'
            }, {
                foo: 'oldFoo'
            });

            expect(o).toEqual({
                foo: 'foo'
            });
        });

        it("should not override default properties with mixing properties", function() {
            o = Ext.applyIf({
                foo: 1,
                bar: 2
            }, {
                bar: 3,
                baz: 4
            });

            expect(o).toEqual({
                foo: 1,
                bar: 2,
                baz: 4
            });
        });

          it("should change the reference of the object", function() {
            o = {};
            Ext.applyIf(o, {
                foo: 2
            }, {
                foo: 1
            });

            expect(o).toEqual({
                foo: 2
            });
        });

        it("should return null if null is passed as first argument", function() {
           expect(Ext.applyIf(null, {})).toBeNull();
        });

        it("should return the object if second argument is no defined", function() {
            o = {
                foo: 1
            };

            expect(Ext.applyIf(o)).toEqual(o);
        });
    });


    describe("Ext.extend", function() {
        var Dude, Awesome, david;

        beforeEach(function() {
            Dude = Ext.extend(Object, {
                constructor: function(config){
                    Ext.apply(this, config);
                    this.isBadass = false;
                }
            });

            Awesome = Ext.extend(Dude, {
                constructor: function(){
                    Awesome.superclass.constructor.apply(this, arguments);
                    this.isBadass = true;
                }
            });

            david = new Awesome({
                davis: 'isAwesome'
            });
        });

        it("should throw an error if superclass isn't defined", function() {
            expect(function() {
                Ext.extend(undefined, {});
            }).toRaiseExtError("Attempting to extend from a class which has not been loaded on the page.");
        });

        it("should create a superclass that return the original classe", function() {
            expect(david.superclass).toEqual(Dude.prototype);
        });

        it("should add override method", function() {
            expect(typeof david.override === 'function').toBe(true);
        });

        it("should override redefined methods", function() {
            expect(david.isBadass).toBe(true);
        });

        it("should keep new properties", function() {
            expect(david.davis).toEqual('isAwesome');
        });
    });

    describe("Ext.override", function(){
        var Dude,
            extApplySpy;

        beforeEach(function(){
            Dude = function(){}; // avoid to directly override Object class
            extApplySpy = spyOn(Ext, "apply");
        });

        it("should apply override", function(){
            var override = {foo: true};

            Ext.override(Dude, override);

            expect(extApplySpy).toHaveBeenCalledWith(Dude.prototype, override);
        });
    });

    describe("Ext.typeOf", function() {
        it("should return null", function() {
            expect(Ext.typeOf(null)).toEqual('null');
        });
        it("should return undefined", function() {
            expect(Ext.typeOf(undefined)).toEqual('undefined');
        });
        it("should return undefined", function() {
            expect(Ext.typeOf(window.someWeirdPropertyThatDoesntExist)).toEqual('undefined');
        });
        it("should return string", function() {
            expect(Ext.typeOf('')).toEqual('string');
        });
        it("should return string", function() {
            expect(Ext.typeOf('something')).toEqual('string');
        });
        it("should return string", function() {
            expect(Ext.typeOf('1.2')).toEqual('string');
        });
        it("should return number", function() {
            expect(Ext.typeOf(1)).toEqual('number');
        });
        it("should return number", function() {
            expect(Ext.typeOf(1.2)).toEqual('number');
        });
        it("should return boolean", function() {
            expect(Ext.typeOf(true)).toEqual('boolean');
        });
        it("should return boolean", function() {
            expect(Ext.typeOf(false)).toEqual('boolean');
        });
        it("should return array", function() {
            expect(Ext.typeOf([1,2,3])).toEqual('array');
        });
        it("should return array", function() {
            expect(Ext.typeOf(new Array(1,2,3))).toEqual('array');
        });
        it("should return function 1", function() {
            expect(Ext.typeOf(function(){})).toEqual('function');
        });
        // Don't run this test in IE
        if (typeof alert === 'function') {
            it("should return function 2", function() {
                expect(Ext.typeOf(prompt)).toEqual('function');
            });
        }
        it("should return function 3", function() {
            expect(Ext.typeOf(new Function())).toEqual('function');
        });
        it("should return regexp 1", function() {
            expect(Ext.typeOf(/test/)).toEqual('regexp');
        });
        it("should return regexp 2", function() {
            expect(Ext.typeOf(new RegExp('test'))).toEqual('regexp');
        });
        it("should return date", function() {
            expect(Ext.typeOf(new Date())).toEqual('date');
        });
        it("should return textnode", function() {
            expect(Ext.typeOf(document.createTextNode('tada'))).toEqual('textnode');
        });
        it("should return whitespace", function() {
            expect(Ext.typeOf(document.createTextNode(' '))).toEqual('whitespace');
        });
        it("should return whitespace", function() {
            expect(Ext.typeOf(document.createTextNode('         '))).toEqual('whitespace');
        });
        it("should return element", function() {
            expect(Ext.typeOf(document.getElementsByTagName('body')[0])).toEqual('element');
        });
        it("should return element", function() {
            expect(Ext.typeOf(document.createElement('button'))).toEqual('element');
        });
        it("should return element", function() {
            expect(Ext.typeOf(new Image())).toEqual('element');
        });
        it("should return object 1", function() {
            expect(Ext.typeOf({some: 'stuff'})).toEqual('object');
        });
        it("should return object 2", function() {
            expect(Ext.typeOf(new Object())).toEqual('object');
        });
        it("should return object 3", function() {
            expect(Ext.typeOf(window)).toEqual('object');
        });
        it("should return boolean", function() {
            expect(Ext.typeOf(new Boolean(true))).toEqual('boolean');
        });
        it("should return number", function() {
            expect(Ext.typeOf(new Number(1.2))).toEqual('number');
        });
    });

    describe("Ext.isIterable", function() {
        it("should return true with empty array", function() {
            expect(Ext.isIterable([])).toBe(true);
        });

        it("should return true with filled array", function() {
            expect(Ext.isIterable([1, 2, 3, 4])).toBe(true);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isIterable(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isIterable(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isIterable("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isIterable("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isIterable(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isIterable(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isIterable(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isIterable(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isIterable({})).toBe(false);
        });

        it("should return true with node list", function() {
            expect(Ext.isIterable(document.getElementsByTagName('body'))).toBe(true);
        });

        it("should return true with html collection", function() {
            expect(Ext.isIterable(document.images)).toBe(true);
        });
    });

    describe("Ext.isArray", function() {
        it("should return true with empty array", function() {
            expect(Ext.isArray([])).toBe(true);
        });

        it("should return true with filled array", function() {
            expect(Ext.isArray([1, 2, 3, 4])).toBe(true);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isArray(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isArray(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isArray("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isArray("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isArray(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isArray(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isArray(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isArray(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isArray({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isArray(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return false with custom class that has a length property", function() {
            var C = Ext.extend(Object, {
                length: 1
            });
            expect(Ext.isArray(new C())).toBe(false);
        });

        //it("should return false with element", function() {
        //    expect(Ext.isElement(Ext.getBody().dom)).toBe(false);
        //});
    });

    describe("Ext.isBoolean", function() {
        it("should return false with empty array", function() {
            expect(Ext.isBoolean([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isBoolean([1, 2, 3, 4])).toBe(false);
        });

        it("should return true with boolean true", function() {
            expect(Ext.isBoolean(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(Ext.isBoolean(false)).toBe(true);
        });

        it("should return false with string", function() {
            expect(Ext.isBoolean("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isBoolean("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isBoolean(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isBoolean(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isBoolean(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isBoolean(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isBoolean({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isBoolean(document.getElementsByTagName('body'))).toBe(false);
        });

        //it("should return false with element", function() {
        //    expect(Ext.isElement(Ext.getBody().dom)).toBe(false);
        //});
    });

    describe("Ext.isDate", function() {
        it("should return false with empty array", function() {
            expect(Ext.isDate([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isDate([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isDate(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isDate(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isDate("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isDate("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isDate(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isDate(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isDate(undefined)).toBe(false);
        });

        it("should return true with date", function() {
            expect(Ext.isDate(new Date())).toBe(true);
        });

        it("should return false with empty object", function() {
            expect(Ext.isDate({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isDate(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return false with element", function() {
            expect(Ext.isDate(Ext.getBody().dom)).toBe(false);
        });
    });

    describe("Ext.isDefined", function() {
        it("should return true with empty array", function() {
            expect(Ext.isDefined([])).toBe(true);
        });

        it("should return true with filled array", function() {
            expect(Ext.isDefined([1, 2, 3, 4])).toBe(true);
        });

        it("should return true with boolean true", function() {
            expect(Ext.isDefined(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(Ext.isDefined(false)).toBe(true);
        });

        it("should return true with string", function() {
            expect(Ext.isDefined("foo")).toBe(true);
        });

        it("should return true with empty string", function() {
            expect(Ext.isDefined("")).toBe(true);
        });

        it("should return true with number", function() {
            expect(Ext.isDefined(1)).toBe(true);
        });

        it("should return true with null", function() {
            expect(Ext.isDefined(null)).toBe(true);
        });

        it("should return false with undefined", function() {
            expect(Ext.isDefined(undefined)).toBe(false);
        });

        it("should return true with date", function() {
            expect(Ext.isDefined(new Date())).toBe(true);
        });

        it("should return true with empty object", function() {
            expect(Ext.isDefined({})).toBe(true);
        });

        it("should return true with node list", function() {
            expect(Ext.isDefined(document.getElementsByTagName('body'))).toBe(true);
        });

        //it("should return true with element", function() {
        //    expect(Ext.isElement(Ext.getBody().dom)).toBe(true);
        //});
    });

    describe("Ext.isElement", function() {
        it("should return false with empty array", function() {
            expect(Ext.isElement([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isElement([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isElement(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isElement(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isElement("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isElement("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isElement(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isElement(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isElement(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isElement(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isElement({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isElement(document.getElementsByTagName('body'))).toBe(false);
        });

        //it("should return true with element", function() {
        //    expect(Ext.isElement(Ext.getBody().dom)).toBe(true);
        //});

        //it("should return false with Ext.core.Element", function() {
        //    expect(Ext.isElement(Ext.getBody().dom)).toBe(true);
        //});
    });

    describe("Ext.isEmpty", function() {
        it("should return true with empty array", function() {
            expect(Ext.isEmpty([])).toBe(true);
        });

        it("should return false with filled array", function() {
            expect(Ext.isEmpty([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isEmpty(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isEmpty(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isEmpty("foo")).toBe(false);
        });

        it("should return true with empty string", function() {
            expect(Ext.isEmpty("")).toBe(true);
        });

        it("should return true with empty string with allowBlank", function() {
            expect(Ext.isEmpty("", true)).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isEmpty(1)).toBe(false);
        });

        it("should return true with null", function() {
            expect(Ext.isEmpty(null)).toBe(true);
        });

        it("should return true with undefined", function() {
            expect(Ext.isEmpty(undefined)).toBe(true);
        });

        it("should return false with date", function() {
            expect(Ext.isEmpty(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isEmpty({})).toBe(false);
        });
    });

    describe("Ext.isFunction", function() {
        beforeEach(function() {
            // add global variable in whitelist
            addGlobal("ExtSandbox1");
        });

        it("should return true with anonymous function", function() {
            expect(Ext.isFunction(function(){})).toBe(true);
        });

        it("should return true with new Function syntax", function() {
            expect(Ext.isFunction(Ext.functionFactory('return "";'))).toBe(true);
        });

        it("should return true with static function", function() {
            expect(Ext.isFunction(Ext.emptyFn)).toBe(true);
        });

        it("should return true with instance function", function() {
            var stupidClass = function() {},
                testObject;
            stupidClass.prototype.testMe = function() {};
            testObject = new stupidClass();

            expect(Ext.isFunction(testObject.testMe)).toBe(true);
        });

        it("should return true with function on object", function() {
            var o = {
                fn: function() {
                }
            };

            expect(Ext.isFunction(o.fn)).toBe(true);
        });

        it("should return false with empty array", function() {
            expect(Ext.isFunction([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isFunction([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isFunction(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isFunction(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isFunction("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isFunction("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isFunction(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isFunction(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isFunction(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isFunction(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isFunction({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isFunction(document.getElementsByTagName('body'))).toBe(false);
        });
    });

    describe("Ext.isNumber", function() {
        it("should return true with zero", function() {
            expect(Ext.isNumber(0)).toBe(true);
        });

        it("should return true with non zero", function() {
            expect(Ext.isNumber(4)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(Ext.isNumber(-3)).toBe(true);
        });

        it("should return true with float", function() {
            expect(Ext.isNumber(1.75)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(Ext.isNumber(-4.75)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(Ext.isNumber(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Number.MIN_VALUE", function() {
            expect(Ext.isNumber(Number.MIN_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(Ext.isNumber(Math.PI)).toBe(true);
        });

        it("should return true with Number() contructor", function() {
            expect(Ext.isNumber(Number('3.1'))).toBe(true);
        });

        it("should return false with NaN", function() {
            expect(Ext.isNumber(Number.NaN)).toBe(false);
        });

        it("should return false with Number.POSITIVE_INFINITY", function() {
            expect(Ext.isNumber(Number.POSITIVE_INFINITY)).toBe(false);
        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {
            expect(Ext.isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
        });

        it("should return false with empty array", function() {
            expect(Ext.isNumber([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isNumber([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isNumber(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isNumber(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isNumber("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isNumber("")).toBe(false);
        });

        it("should return false with string containing a number", function() {
            expect(Ext.isNumber("1.0")).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isNumber(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isNumber(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isNumber({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isNumber(document.getElementsByTagName('body'))).toBe(false);
        });
    });

    describe("Ext.isObject", function() {
        it("should return false with empty array", function() {
            expect(Ext.isObject([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isObject([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isObject(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isObject(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isObject("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isObject("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isObject(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isObject(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isObject(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isObject(new Date())).toBe(false);
        });

        it("should return true with empty object", function() {
            expect(Ext.isObject({})).toBe(true);
        });

        it("should return false with a DOM node", function() {
            expect(Ext.isObject(document.body)).toBe(false);
        });

        it("should return false with a Text node", function() {
            expect(Ext.isObject(document.createTextNode('test'))).toBe(false);
        });

        it("should return true with object with properties", function() {
            expect(Ext.isObject({
                foo: 1
            })).toBe(true);
        });

        it("should return true with object instance", function() {
            var stupidClass = function() {};

            expect(Ext.isObject(new stupidClass())).toBe(true);
        });

        it("should return true with new Object syntax", function() {
            expect(Ext.isObject(new Object())).toBe(true);
        });

        it("should return false with dom element", function() {
            expect(Ext.isObject(document.body)).toBe(false);
        });
    });

    describe("Ext.isPrimitive", function() {
        it("should return true with integer", function() {
            expect(Ext.isPrimitive(1)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(Ext.isPrimitive(-21)).toBe(true);
        });

        it("should return true with float", function() {
            expect(Ext.isPrimitive(2.1)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(Ext.isPrimitive(-12.1)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(Ext.isPrimitive(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(Ext.isPrimitive(Math.PI)).toBe(true);
        });

        it("should return true with empty string", function() {
            expect(Ext.isPrimitive("")).toBe(true);
        });

        it("should return true with non empty string", function() {
            expect(Ext.isPrimitive("foo")).toBe(true);
        });

        it("should return true with boolean true", function() {
            expect(Ext.isPrimitive(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(Ext.isPrimitive(false)).toBe(true);
        });

        it("should return false with null", function() {
            expect(Ext.isPrimitive(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isPrimitive(undefined)).toBe(false);
        });

        it("should return false with object", function() {
            expect(Ext.isPrimitive({})).toBe(false);
        });

        it("should return false with object instance", function() {
            var stupidClass = function() {};
            expect(Ext.isPrimitive(new stupidClass())).toBe(false);
        });

        it("should return false with array", function() {
            expect(Ext.isPrimitive([])).toBe(false);
        });
    });

    describe("Ext.isString", function() {
        it("should return true with empty string", function() {
            expect(Ext.isString("")).toBe(true);
        });

        it("should return true with non empty string", function() {
            expect(Ext.isString("foo")).toBe(true);
        });

        it("should return true with String() syntax", function() {
            expect(Ext.isString(String(""))).toBe(true);
        });

        it("should return false with new String() syntax", function() { //should return an object that wraps the primitive
            expect(Ext.isString(new String(""))).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isString(1)).toBe(false);
        });

        it("should return false with boolean", function() {
            expect(Ext.isString(true)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isString(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isString(undefined)).toBe(false);
        });

        it("should return false with array", function() {
            expect(Ext.isString([])).toBe(false);
        });

        it("should return false with object", function() {
            expect(Ext.isString({})).toBe(false);
        });
    });

    describe("Ext.namespace", function() {
        var w = window;

        it("should have an alias named ns", function() {
            expect(Ext.ns).toEqual(Ext.namespace);
        });

        it("should create a single top level namespace", function() {
            Ext.namespace('FooTest1');

            expect(w.FooTest1).toBeDefined();

            if (jasmine.browser.isIE6 || jasmine.browser.isIE7 || jasmine.browser.isIE8) {
                w.FooTest1 = undefined;
            } else {
                delete w.FooTest1;
            }
        });

        it("should create multiple top level namespace", function() {
            Ext.namespace('FooTest2', 'FooTest3', 'FooTest4');

            expect(w.FooTest2).toBeDefined();
            expect(w.FooTest3).toBeDefined();
            expect(w.FooTest4).toBeDefined();

            if (jasmine.browser.isIE6 || jasmine.browser.isIE7 || jasmine.browser.isIE8) {
                w.FooTest2 = undefined;
                w.FooTest3 = undefined;
                w.FooTest4 = undefined;
            } else {
                delete w.FooTest2;
                delete w.FooTest3;
                delete w.FooTest4;
            }
        });

        it("should create a chain of namespaces, starting from a top level", function() {
            Ext.namespace('FooTest5', 'FooTest5.ns1', 'FooTest5.ns1.ns2', 'FooTest5.ns1.ns2.ns3');

            expect(w.FooTest5).toBeDefined();
            expect(w.FooTest5.ns1).toBeDefined();
            expect(w.FooTest5.ns1.ns2).toBeDefined();
            expect(w.FooTest5.ns1.ns2.ns3).toBeDefined();

            if (jasmine.browser.isIE6 || jasmine.browser.isIE7 || jasmine.browser.isIE8) {
                w.FooTest5 = undefined;
            } else {
                delete w.FooTest5;
            }
        });

        it("should create lower level namespaces without first defining the top level", function() {
            Ext.namespace('FooTest6.ns1', 'FooTest7.ns2');

            expect(w.FooTest6).toBeDefined();
            expect(w.FooTest6.ns1).toBeDefined();
            expect(w.FooTest7).toBeDefined();
            expect(w.FooTest7.ns2).toBeDefined();

            if (jasmine.browser.isIE6 || jasmine.browser.isIE7 || jasmine.browser.isIE8) {
                w.FooTest6 = undefined;
                w.FooTest7 = undefined;
            } else {
                delete w.FooTest6;
                delete w.FooTest7;
            }
        });

        it("should create a lower level namespace without defining the middle level", function() {
            Ext.namespace('FooTest8', 'FooTest8.ns1.ns2');

            expect(w.FooTest8).toBeDefined();
            expect(w.FooTest8.ns1).toBeDefined();
            expect(w.FooTest8.ns1.ns2).toBeDefined();

            if (jasmine.browser.isIE6 || jasmine.browser.isIE7 || jasmine.browser.isIE8) {
                w.FooTest8 = undefined;
            } else {
                delete w.FooTest8;
            }
        });

        it ("should not overwritte existing namespace", function() {
            Ext.namespace('FooTest9');

            FooTest9.prop1 = 'foo';

            Ext.namespace('FooTest9');

            expect(FooTest9.prop1).toEqual("foo");

            if (jasmine.browser.isIE6 || jasmine.browser.isIE7 || jasmine.browser.isIE8) {
                w.FooTest9 = undefined;
            } else {
                delete w.FooTest9;
            }
        });
    });


});
