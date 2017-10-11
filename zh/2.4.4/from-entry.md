# 从入口开始

## Vue 的 packages

 ┌───────────────────────────────────┐   ┌────────────────────────────────────┐
 │              runtime              │   │          entry-runtime.js          │
 │src/platforms/web/runtime/index.js │──▶│ src/platforms/web/entry-runtime.js │
 └───────────────────────────────────┘   └────────────────────────────────────┘
                   │
                   │     ┌────────────────────────────────────────────────────┐
                   │     │            entry-runtime-with-compiler             │
                   ├────▶│  src/platforms/web/entry-runtime-with-compiler.js  │
                   │     └────────────────────────────────────────────────────┘
                   │
┌────────────────────────────────────┐   ┌────────────────────────────────────┐
│              compiler              │   │         entry-compiler.js          │
│src/platforms/web/compiler/index.js │──▶│src/platforms/web/entry-compiler.js │
└────────────────────────────────────┘   └────────────────────────────────────┘

┌────────────────────────────────────┐
│          server renderer           │
│             src/server             │
└────────────────────────────────────┘
                   │             ┌────────────────────────────────────────────┐
                   │             │       entry-server-basic-renderer.js       │
                   ├────────────▶│ src/platforms/web/entry-basic-renderer.js  │
                   │             └────────────────────────────────────────────┘
                   │
                   │             ┌────────────────────────────────────────────┐
                   │             │          entry-server-renderer.js          │
                   └────────────▶│ src/platforms/web/entry-server-renderer.js │
                                 └────────────────────────────────────────────┘

## Vue 的

从源码上来说，Vue.js 的入口在 `src/platform` 下，包括

- runtime
- runtime+compiler
- server

这其中的每一个文件，都是 rollup 对 Vue 进行打包的 entry。

从 API 的角度来说，Vue 的入口是当用户以各种手段引入 Vue 库时，Vue 向用户暴露的
`Vue` 对象。

这个对象是 Vue 框架的起点，包括 Vue 的各种 API，并提供了初始化 Vue Component 以
及将其挂载上 DOM 的方法。

本文使用的是 Vue.js 2.4.4 版本，调试时使用的是

## Vue 的加载过程

Vue 的加载过程包括：

- 定义 `function Vue (options)`
- 加载 mixins
- 加载 globalApi
- 加载 platform 上的 config

### 加载 mixins

```
  +----------------------------+
  |   function Vue (options)   |
  | src/core/instance/index.js |
  +----------------------------+
                 |
                 |
                 |      +------------------------------+
                 |      |          initMixin           |
                 +----->|  src/core/instance/init.js   |
                 |      +------------------------------+
                 |
                 |      +------------------------------+
                 |      |          stateMixin          |
                 +----->|  src/core/instance/state.js  |
                 |      +------------------------------+
                 |
                 |      +------------------------------+
                 |      |         eventsMixin          |
 load mixins     +----->| src/core/instance/events.js  |
                 |      +------------------------------+
                 |
                 |      +------------------------------+
                 |      |        lifecycleMixin        |
                 +----->|src/core/instance/lifecycle.js|
                 |      +------------------------------+
                 |
                 |      +------------------------------+
                 |      |         renderMixin          |
                 +----->| src/core/instance/render.js  |
                        +------------------------------+
```

Vue instance 是一段很短的 object constructor:

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

随后，Vue 通过 mixin 的方式，在 Vue instance 的 prototype 上定义 Vue component
所需的各种方法。

- `initMixin`
  - `Vue.prototype._init`
- `stateMixin`
  - `Vue.prototype.$data`
  - `Vue.prototype.$props`
  - `Vue.prototype.$set`
  - `Vue.prototype.$delete`
  - `Vue.prototype.$watch`
- `eventsMixin`
  - `Vue.prototype.$on`
  - `Vue.prototype.$once`
  - `Vue.prototype.$off`
  - `Vue.prototype.$emit`
- `lifecycleMixin`
  - `Vue.prototype._update`
  - `Vue.prototype.$forceUpdate`
  - `Vue.prototype.$destroy`
- `renderMixin`
  - `Vue.prototype.$nextTick`
  - `Vue.prototype._render`
  - internal render helpers

### `initGlobalAPI`

- `Vue.config`
  - `Vue.config.set`
  - `Vue.config.get`
- `Vue.util`
  - `Vue.util.warn`
  - `Vue.util.extend`
  - `Vue.util.mergeOptions`
  - `Vue.util.defineReactive`
  - `Vue.options`
    - assets type in `Vue.options`
    - `Vue.options._base`
- `Vue.use`
- `Vue.mixin`
- `Vue.extend`
- `Vue.components`
- `Vue.directive`
- `Vue.filter`
