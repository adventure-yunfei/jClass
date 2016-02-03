# jClass
A small but powerful javascript Class system implementation

# Function
To provide a javascript Class combined with single-inheritance and multiple-mixins.

# Core API
Declare:
```javascript
jClass.declare(SuperClass/**<Function>*/, mixins/**<Array.<plain object>>*/, props/**<plain object>*/)
```
Mixin:
```javascript
jClass.mixin(target/**<object>*/, mixins/**<Array>*/);
```
Keywords:

* `this.$super` Call super function inside overridden func
* `$constructor` Prop key which define constructor function (which is called on creating new class instance)

# Usage
#### Declare a Base class
```javascript
var BaseClass = jClass.declare(null, null, {
        $constructor: function () {
            console.log('Base constructor');
        },
        propA: 'valueA',
        func: function () {
            console.log('Base func');
        }
    });
```
#### Define mixin (which is just a plain object) and call super func 
```javascript
var mx = { func: function (argv) {
        this.$super();
        console.log('mx func with arg value as "' + argv + '"');
    }}
```
#### Inherit existed class and mixin
```javascript
var SubClass = jClass.declare(BaseClass, [ mx ], {
        $constructor: function () {
            this.$super(/**may change any arguments here*/);
            console.log('Sub constructor');
        },
        func: function () {
            this.$super('hello');
            console.log('Sub func');
        }
    };
```
#### Instantiation
```javascript
var subInstance = new SubClass();
// produce console log ==>
//    Base constructor
//    Sub constructor
subInstance.func();
// produce console log ==>
//    Base func
//    mx func with arg value as "hello"
//    Sub func
```
