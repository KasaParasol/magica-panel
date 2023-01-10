// eslint-disable no-new

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
</body>
</html>
`;

let window;
let document;

test.beforeEach(() => {
    const dom = new JSDOM(html5, {pretendToBeVisual: true});
    window = dom.window;
    document = dom.window.document;

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
    PanelBase.window = window;
    PanelBase.document = window.document;
    PanelBase.CustomEvent = window.CustomEvent;
});

test('constructor › 初期化できること', t => {
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
    const child = new PanelBase(document.querySelector('#content-c'));
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'}, child);

    t.is(instance._children.includes(child), true);
});

test('constructor › 初期化時に子要素が与えられれば、子要素に追加する(複数可)', t => {
    const child1 = new PanelBase(document.querySelector('#content-c'));
    const child2 = new PanelBase(document.querySelector('#content-d'));
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'}, child1, child2);

    t.is(instance._children.includes(child1), true);
    t.is(instance._children.includes(child2), true);
});

test('constructor › 初回初期化時のみ`PanelBase.init()`を呼び出す', t => {
    let couter = 0;

    PanelBase._initialized = false;
    const oldInit = PanelBase.init;
    PanelBase.init = () => {
        couter++;
    };

    new PanelBase(document.querySelector('#content-c'), {});
    new PanelBase(document.querySelector('#content-a'), {});
    t.is(couter, 1);
    PanelBase.init = oldInit;
    PanelBase._initialized = false;
});

test('(get) opts › 得られるオブジェクトはメンバの参照ではない', t => {
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
    const opts = {title: {test: 'foo'}};
    const instance = new PanelBase(document.querySelector('#content-a'), opts);

    const cache = instance.opts;
    t.not(cache, opts);
    t.is(cache.title, opts.title);
});

test('(get) children › 得られるオブジェクトはメンバの参照ではない', t => {
    const child = new PanelBase(document.querySelector('#content-e'), {});
    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'}, child);

    const children = instance.children;
    t.not(children, instance._children);
});

//test('(set) parent › 親要素を`undefine`→`Panel`に変更した際にイベントが付与される', t => {
//    const child = new PanelBase(document.querySelector('#content-e'), {});
//    const instance = new PanelBase(document.querySelector('#content-a'), {test: 'foo'}, child);
//
//    
//});
