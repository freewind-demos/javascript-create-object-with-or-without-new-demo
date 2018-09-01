JavaScript Create Object With or Without "new" Demo
===================================================

> 注意：这个Demo里，我们不考虑ES6中引入的`class`关键字

相对于其他语言而言，JavaScript中的`function`身兼多个作用：

1. 普通意义上的function：像容器一样把多个语句包起来，通过参数和返回值与外界交互
2. 对象构造器：与`new`和`this`配合，产生一个对象，并对其初始化

同时，与面向对象语言中的`this`只指向当前对象不同，JavaScript的`this`也身兼多种可能：

1. 当它所在的函数以普通函数的形式被调用时，它指向调用者
2. 当它所在的函数以“对象构造器”的形式被`new`调用时，它指向当前产生的对象

如果不能清楚的理解这些，那么在JavaScript中，不论是定义对象还是创建对象，都有可能产生混乱。

先从Java说起
--------

在Java（以及其它的很多语言中）就不存在这样的混乱，因为在语法层面分得很清，从根本上避免了这些问题。

### 对象构造器

在Java中，我们如果想创建一个对象，我们需要先定义一个类：

```
public class User {
    public String name;
    public User(String name) {
        this.name = name;
    }
}
```

然后`new`一个对象出来:

```
User user = new User("user")
```

此时我们清楚的知道，这里的`User("user")`对应的是对象构造器`public User(String name) { ... }`，所以前面必须有一个`new`，如果没有则编译是会报错的。
我们同样也非常确定，在class `User`中，`this`指代的就是当前对象。

### 对象工厂方法

我们也可以定义一个方法来创建对象，甚至它可以跟`User`类同名，并且放在`class User`中：

```
public class User {
    public String name;
    public User(String name) {
        this.name = name;
    }
    public static User User(String name) {
        return new User(name);
    }
}
```

此时我们就不需要`new`了：

```
import static demo.User.User;

User user = User("user")
```

此时我们也同样清楚的知道，这里的`User("user")`对应的是`public static User User(String name) { ... }`。
并且在这个方法中，由于它是`static`的，里面不可能使用`this`，否则编译同样会报错。

JavaScript
----------

在不使用`class`的JavaScript中，如果我们希望像Java那样，定义一个“对象构造器”，我们需要使用`function`：

```
function User(name) {
    this.name = name
}
```

注意到里面使用了`this`。但是如同本文开始所说的那样，这里的`this`到底指代的是谁，我们是不确定的，它取决于使用者。

如果使用者如我们所期望的那样，使用`new`来调用：

```
const user = new User("user")
```

则`this`指向的是新生成的对象，并且`user`也将指向这个新生成的对象。

但如果使用者把它当作一个普通的函数：

```
const user = User("user")
```

则`this`指向的将会是调用者。由于这里没有指明调用者，`this`将会是默认的`global`对象。

由于此时`User("user")`是当作普通函数来调用的，并且在`function User`的定义中，没有返回任何值，所以`user`的值将会是`undefined`.

虽然这种调用方法并不是我们所期望的，但是由于JavaScript的语法特性，使得这句代码是完全合法并且不会有执行错误，所以非常具有迷惑性（直到在后面使用`user`对象出错时才可能发现）。

Workaround
----------

可能由于太容易误用，检查和发现问题也不是那么容易，所以有人就想了一个“聪明”的做法：

```
function User(name) {
    if (!(this instanceof User)) {
        return new User(name)
    }
    this.name = name
}
```

在代码中对`this`对象类型判断，如果发现使用者误用，则主动调用正确的代码修正。

这样，不论你是使用

```
const user = new User("user")
```

还是：

```
const user = User("user")
```

都不会报错，而且得到的都是期待的user对象。

但我还是觉得这样的问题，最好应该在语法层面上解决。

### ES6 `class`

好在ES6中有了`class`和`constructor`关键字，我们可以这样写：

```
class User {
    constructor(name) {
        this.name = name;
    }
}
```

只能这样调用：

```
const user = new User("name")
```

如果忘了写`new`，就会得到这样的提示：

```
Cannot call a class as a function
```

从语法层面帮我们避开了问题，太好了。

参看Demo：<https://github.com/freewind-demos/javascript-es6-class-demo>

Run This Demo
-------------

```
brew install nodejs
node hello.js
```

It will print:

```
User { name: 'User1' }
User { name: 'User2' }
```