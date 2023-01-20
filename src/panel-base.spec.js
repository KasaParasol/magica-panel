import test from 'ava';
import {JSDOM} from 'jsdom';

import PanelBase from './panel-base.js';

const html5 = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        html, body {
            margin: 0;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="content-a">
        <div id="content-b"></div>
    </div>
    <div id="content-c"></div>
    <div id="content-d"></div>
    <div id="content-e"></div>
    <div id="content-f"></div>
    <div id="content-g"></div>
    <div id="content-h"></div>
</body>
</html>
`;

test.beforeEach(t => {
    const dom = new JSDOM(html5, {pretendToBeVisual: true});
    const window = dom.window;
    const document = dom.window.document;

    window.CustomEvent = class CustomEvent extends Event {
        constructor (type, options) {
            super(type);
            this.detail = options?.detail;
        }
    };

    const resizeEvent = document.createEvent('Event');
    resizeEvent.initEvent('resize', true, true);

    window.resizeTo = (width, height) => {
        window.innerWidth = width || window.innerWidth;
        window.innerHeight = height || window.innerHeight;
        window.dispatchEvent(resizeEvent);
    };

    t.context.data = {window, document, CustomEvent: window.CustomEvent};
});

test('constructor › 初期化できること', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const opts = {test: 'foo'};

    const instance = new PanelBase(document.querySelector('#content-a'), opts);

    // 初期化できる
    t.is(instance instanceof PanelBase, true);

    // 第二引数(オプション)はそのまま`this._opts`に格納される。
    t.is(instance._opts, opts);

    // 初期化時に第一引数に与えられた要素の内容を削除する
    t.falsy(document.querySelector('#content-b'));

    // 初期化時に第一引数に与えられた要素直下にinner要素が生える
    t.is(document.querySelector('#content-a').contains(instance._inner), true);
});

test('constructor › 初期化時に子要素が与えられれば、子要素に追加する', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child = new PanelBase(document.querySelector('#content-c'));
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'}, [], [], child);

    t.is(instance._children.includes(child), true);
});

test('constructor › 初期化時に子要素が与えられれば、子要素に追加する(複数可)', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child1 = new PanelBase(document.querySelector('#content-c'));
    const child2 = new PanelBase(document.querySelector('#content-d'));
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child1, child2);

    t.is(instance._children.includes(child1), true);
    t.is(instance._children.includes(child2), true);
});

test('constructor › 初回初期化時のみ`PanelBase.init()`を呼び出す', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    let couter = 0;

    PanelBase._initialized = false;
    const oldInit = PanelBase.init;
    PanelBase.init = () => {
        couter++;
    };

    // eslint-disable-next-line no-new
    new PanelBase(document.querySelector('#content-c'), {});
    // eslint-disable-next-line no-new
    new PanelBase(document.querySelector('#content-a'), {});
    t.is(couter, 1);
    PanelBase.init = oldInit;
    PanelBase._initialized = false;
});

test('(get) opts › 得られるオブジェクトはメンバの参照ではない', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const opts = {test: 'foo', obj: {test: 'bar'}};
    const instance = new PanelBase(document.querySelector('#content-a'), opts);

    const cache = instance.opts;
    t.not(cache, opts);
    for (const key in cache) {
        if (typeof cache[key] === 'object') {
            t.not(cache[key], opts[key]);
            for (const k in cache[key]) {
                t.is(cache[key][k], opts[key][k]);
            }
        }
        else {
            t.is(cache[key], opts[key]);
        }
    }
});

test('(get) opts › 得られるオブジェクトのtitle要素は参照', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const opts = {title: {test: 'foo'}};
    const instance = new PanelBase(document.querySelector('#content-a'), opts);

    const cache = instance.opts;
    t.not(cache, opts);
    t.is(cache.title, opts.title);
});

test('(get) children › 得られるオブジェクトはメンバの参照ではない', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child);

    const children = instance.children;
    t.not(children, instance._children);
});

test('(set) parent › 親要素を変更した際に`changeparent`イベントが発砲される', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'});

    const emitLog = [];
    child.addEventListener('changeparent', ev => {
        emitLog.push(ev.detail.target);
    });

    child.parent = instance;

    t.is(emitLog[0], child);
});

test('(set) parent › 親要素を`undefine`→`Panel`に変更した際にイベントが付与される、appendが呼び出される。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const addEventListenerLog = [];
    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'});

    const references = [
        {t: 'resize', h: child._resizeParentHandler, that: instance},
        {t: 'close', h: child._closeParentHandler, that: instance},
    ];

    const oldFunc = instance.addEventListener;
    instance.addEventListener = function (t, h) {
        addEventListenerLog.push({t, h, that: this});
        oldFunc.call(this, t, h);
    };

    const appendCache = instance.append;
    const appendLog = [];
    instance.append = function (v) {
        appendLog.push({v, that: this});
        appendCache.call(this, v);
    };

    child.parent = instance;

    for (const ref of references) {
        const target = addEventListenerLog.find(e => e.t === ref.t);

        if (target) {
            t.is(target.h, ref.h);
            t.is(target.that, ref.that);
        }
        else {
            t.fail();
        }
    }

    t.is(appendLog[0].v, child);
    t.is(appendLog[0].that, instance);
});

test('(set) parent › 親要素をに変更した際に既存のイベントが剥がされる、removeが呼び出される。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const removeEventListenerLog = [];
    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child);
    const instance2 = new PanelBase(document.querySelector('#content-f'), {test: 'foo'});

    const references = [
        {t: 'resize', h: child._resizeParentHandler, that: instance},
        {t: 'close', h: child._closeParentHandler, that: instance},
    ];

    const oldFunc = instance.removeEventListener;
    instance.removeEventListener = function (t, h) {
        removeEventListenerLog.push({t, h, that: this});
        oldFunc.call(this, t, h);
    };

    const removeCache = instance.remove;
    const removeLog = [];
    instance.remove = function (v) {
        removeLog.push({v, that: this});
        removeCache.call(this, v);
    };

    child.parent = instance2;

    for (const ref of references) {
        const target = removeEventListenerLog.find(e => e.t === ref.t);

        if (target) {
            t.is(target.h, ref.h);
            t.is(target.that, ref.that);
        }
        else {
            t.fail();
        }
    }

    t.is(removeLog[0].v, child);
    t.is(removeLog[0].that, instance);
});

test('closeParentHandler › closeを呼び出す', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child);

    let counter = 0;
    child.close = () => {
        counter++;
    };

    instance.close();

    t.is(counter, 1);
});

test('remove / append › 親子要素に紐付けられたイベントをすべてappendで有効化され、removeで無効化される。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;
    const window = t.context.data.window;

    let counter = 0;
    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'});
    instance._childMoveHandler = () => {
        counter++;
    };

    instance._childMovedHandler = () => {
        counter++;
    };

    instance._childMinimizedHandler = () => {
        counter++;
    };

    instance._childNormalizedHandler = () => {
        counter++;
    };

    child._changeParentHandler = () => {
        counter++;
    };

    instance.append(child);

    child.dispatchEvent(new window.CustomEvent('move'));
    child.dispatchEvent(new window.CustomEvent('moved'));
    child.dispatchEvent(new window.CustomEvent('minimized'));
    child.dispatchEvent(new window.CustomEvent('normalized'));
    instance.dispatchEvent(new window.CustomEvent('changeparent'));
    t.is(counter, 5);

    instance.remove(child);

    child.dispatchEvent(new window.CustomEvent('move'));
    child.dispatchEvent(new window.CustomEvent('moved'));
    child.dispatchEvent(new window.CustomEvent('minimized'));
    child.dispatchEvent(new window.CustomEvent('normalized'));
    instance.dispatchEvent(new window.CustomEvent('changeparent'));
    t.is(counter, 5);
});

test('remove › 狙った要素のみを削除できる。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child1 = new PanelBase(document.querySelector('#content-f'), {});
    const child2 = new PanelBase(document.querySelector('#content-g'), {});
    const child3 = new PanelBase(document.querySelector('#content-h'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child1, child2, child3);

    instance.remove(child2);

    const ids = instance.children.map(e => e.element.id);

    t.is(ids.join(', '), 'content-f, content-h');
});

test('append › 要素を追加できる。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child1 = new PanelBase(document.querySelector('#content-f'), {});
    const child2 = new PanelBase(document.querySelector('#content-g'), {});
    const child3 = new PanelBase(document.querySelector('#content-h'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'});

    instance.append(child1);
    instance.append(child2);
    instance.append(child3);

    const ids = instance.children.map(e => e.element.id);
    const elems = Array.from(instance.inner.children).map(e => e.id);

    t.is(ids.join(', '), 'content-f, content-g, content-h');
    t.is(elems.join(', '), 'content-f, content-g, content-h');
});

test('append › 要素を挿入できる。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const sepS1 = document.createElement('div');
    const child1 = new PanelBase(document.querySelector('#content-f'), {});
    const sep12 = document.createElement('div');
    const child2 = new PanelBase(document.querySelector('#content-g'), {});
    const sep2L = document.createElement('div');
    const child3 = new PanelBase(document.querySelector('#content-h'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'});

    instance.inner.append(sepS1);
    instance.append(child1);
    instance.inner.append(sep12);
    instance.append(child2);
    instance.inner.append(sep2L);
    instance.append(child3, sep12);

    const ids = instance.children.map(e => e.element.id).filter(e => !!e);
    const elems = Array.from(instance.inner.children).map(e => e.id).filter(e => !!e);

    t.is(ids.join(', '), 'content-f, content-h, content-g');
    t.is(elems.join(', '), 'content-f, content-h, content-g');
});

test('active › 親要素のmodifyZIndexを呼び出す', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child = new PanelBase(document.querySelector('#content-f'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child);

    let counter = 0;
    instance.modifyZIndex = () => {
        counter++;
    };

    child.active();

    t.is(counter, 1);
});

test('modifyZIndex › アクティブとする要素を指定して最前面にできる。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child1 = new PanelBase(document.querySelector('#content-f'), {type: 'panel'});
    const child2 = new PanelBase(document.querySelector('#content-g'), {type: 'panel'});
    const child3 = new PanelBase(document.querySelector('#content-h'), {type: 'panel'});

    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child1, child2, child3);

    instance.modifyZIndex(child2);

    // 特に指定がない場合、子要素の格納降順で表に出る
    const str = instance.children.sort((a, b) => Number(a.element.style.zIndex ?? '0') - Number(b.element.style.zIndex ?? '0')).map(e => e.element.id).join(', ');

    t.is(str, 'content-f, content-h, content-g');
});

test('modifyZIndex › 最前面に指定するとき、他要素の並び順は維持する', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child1 = new PanelBase(document.querySelector('#content-f'), {type: 'panel'});
    const child2 = new PanelBase(document.querySelector('#content-g'), {type: 'panel'});
    const child3 = new PanelBase(document.querySelector('#content-h'), {type: 'panel'});

    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child1, child2, child3);

    instance.modifyZIndex(child1);
    instance.modifyZIndex(child2);

    // 特に指定がない場合、子要素の格納降順で表に出る
    const str = instance.children.sort((a, b) => Number(a.element.style.zIndex ?? '0') - Number(b.element.style.zIndex ?? '0')).map(e => e.element.id).join(', ');

    t.is(str, 'content-h, content-f, content-g');
});

test('modifyZIndex › type が panel でないものは除外', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    const document = t.context.data.document;

    const child1 = new PanelBase(document.querySelector('#content-f'), {type: 'panel'});
    const child2 = new PanelBase(document.querySelector('#content-g'), {type: 'panel'});
    const child3 = new PanelBase(document.querySelector('#content-h'), {type: 'stack'});

    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'},  [], [], child1, child2, child3);

    instance.modifyZIndex(child1);
    instance.modifyZIndex(child2);

    // 特に指定がない場合、子要素の格納降順で表に出る
    const str = instance.children.filter(e => e.element.style.zIndex !== '').map(e => e.element.id).join(', ');

    t.is(str, 'content-f, content-g');
});

