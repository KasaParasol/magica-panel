import test from 'ava';
import {JSDOM} from 'jsdom';

import PanelBase from './panel-base.js';
import BaseContainer from './base-container.js';
import Panel from './panel.js';
import StackContainer from './stack-container.js';

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
<div id="content-a"></div>
<div id="content-b"></div>
<div id="content-c"></div>
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

    window.resizeTo();

    window.HTMLElement.prototype.getClientRects = () => [{
        top: 0,
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight,
    }];

    Object.defineProperty(document.body, 'clientWidth', {
        get () {return window.innerWidth;},
    });

    Object.defineProperty(document.body, 'clientHeight', {
        get () {return window.innerHeight;},
    });

    t.context.data = {window, document, CustomEvent: window.CustomEvent};
});

test('constructor › 初期化できること(引数は格納要素の指定のみ)', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const instance = new BaseContainer(document.body);

    // 初期化できる
    t.is(instance instanceof BaseContainer, true);

    // 第二引数はデフォルトのママ
    for (const key in BaseContainer.DEFAULT_OPTIONS) {
        t.is(instance.opts[key], BaseContainer.DEFAULT_OPTIONS[key]);
    }

    // 子要素はなし
    t.is(instance.children.length, 0);
});

test('constructor › 第二引数は任意に省略できること(プロパティの先のオブジェクト(あれば)は省略不可)', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const instance = new BaseContainer(document.body, {overflowX: 'hidden'});

    t.is(instance.opts.type, 'base');
    t.is(instance.opts.overflowX, 'hidden');
    t.is(instance.opts.overflowY, 'scroll');

    // 子要素はなし
    t.is(instance.children.length, 0);
});

test('constructor › 第三引数(以降)に追加する子要素を指定できる', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const child1 = new Panel();
    const child2 = new Panel();
    const instance = new BaseContainer(document.body, {overflowX: 'hidden'}, child1, child2);

    t.is(instance.opts.type, 'base');
    t.is(instance.opts.overflowX, 'hidden');
    t.is(instance.opts.overflowY, 'scroll');

    t.is(instance.children.length, 2);
    t.is(instance.children[0], child1);
    t.is(instance.children[1], child2);
});

test('constructor › element、innerともにクラスが指定される。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const instance = new BaseContainer(document.body, {overflowX: 'hidden'});

    t.is(instance.element.classList.contains('magica-panel-wrapper'), true);
    t.is(instance.inner.classList.contains('magica-panel-base'), true);
});

test('constructor › opts.overflowX の指定で ox-s クラスを付与を切り替える', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const instanceHidden = new BaseContainer(document.querySelector('#content-a'), {overflowX: 'hidden'});
    const instanceScroll1 = new BaseContainer(document.querySelector('#content-b'), {overflowX: 'scroll'});
    const instanceScroll2 = new BaseContainer(document.querySelector('#content-c'), {});

    t.is(instanceHidden.element.classList.contains('ox-s'), false);
    t.is(instanceScroll1.element.classList.contains('ox-s'), true);
    t.is(instanceScroll2.element.classList.contains('ox-s'), true);
});

test('constructor › opts.overflowY の指定で oy-s クラスを付与を切り替える', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const instanceHidden = new BaseContainer(document.querySelector('#content-a'), {overflowY: 'hidden'});
    const instanceScroll1 = new BaseContainer(document.querySelector('#content-b'), {overflowY: 'scroll'});
    const instanceScroll2 = new BaseContainer(document.querySelector('#content-c'), {});

    t.is(instanceHidden.element.classList.contains('oy-s'), false);
    t.is(instanceScroll1.element.classList.contains('oy-s'), true);
    t.is(instanceScroll2.element.classList.contains('oy-s'), true);
});

test('constructor › opts.additionalClassNames に指定された任意の class を inner へ付与する', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const instance = new BaseContainer(document.querySelector('#content-a'), {additionalClassNames: ['foo', 'bar']});

    t.is(instance.inner.classList.length, 3);
    t.is(instance.inner.classList.contains('magica-panel-base'), true);
    t.is(instance.inner.classList.contains('foo'), true);
    t.is(instance.inner.classList.contains('bar'), true);
});

test('constructor › this._setResizeEvemt を呼び出す', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const old = BaseContainer.prototype._setResizeEvemt;
    let counter = 0;
    BaseContainer.prototype._setResizeEvemt = () => {
        counter++;
    };

    // eslint-disable-next-line no-new
    new BaseContainer(document.querySelector('#content-a'), {additionalClassNames: ['foo', 'bar']});

    BaseContainer.prototype._setResizeEvemt = old;

    t.is(counter, 1);
});

test('constructor › self.sanitizeChildren を呼び出す', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    const child1 = new Panel();
    const child2 = new Panel();

    const old = BaseContainer.sanitizeChildren;
    let counter = 0;
    BaseContainer.sanitizeChildren = arr => {
        counter++;
        t.is(arr.length, 2);
        t.is(arr[0], child1);
        t.is(arr[1], child2);
        return arr;
    };

    // eslint-disable-next-line no-new
    new BaseContainer(document.body, {}, child1, child2);

    BaseContainer.sanitizeChildren = old;

    t.is(counter, 1);
});

test('_setResizeEvemt › ResizeObserver が利用可能である場合、ResizeObserverを利用する', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    let counter = 0;
    PanelBase.window.ResizeObserver = class ResizeObserver {
        constructor (func) {
            this.func = func;
        }

        observe () {
            counter++;
        }
    };

    // eslint-disable-next-line no-new
    new BaseContainer(document.querySelector('#content-a'), {additionalClassNames: ['foo', 'bar']});

    PanelBase.window.ResizeObserver = undefined;

    t.is(counter, 1);
});

test('_setResizeEvemt › ResizeObserver が利用不可である場合、requestAnimationFrameの再起で代用', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    let counter = 0;
    PanelBase.window.ResizeObserver = undefined;
    const old = PanelBase.window.requestAnimationFrame;
    PanelBase.window.requestAnimationFrame = f => {
        counter++;
        if (counter > 10) return;
        f();
    };

    // eslint-disable-next-line no-new
    new BaseContainer(document.querySelector('#content-a'), {additionalClassNames: ['foo', 'bar']});

    PanelBase.window.requestAnimationFrame = old;

    // カウンタが5よりも大きいことで延々再起しているとみなします。
    t.is(counter > 5, true);
});

test('_setResizeEvemt › dispatcher › 縦または横サイズが変更されたとき、this._elemrect を更新して resize イベントを発砲する', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;
    const document = t.context.data.document;

    let counter = 0;
    PanelBase.window.ResizeObserver = undefined;
    const old = PanelBase.window.requestAnimationFrame;
    PanelBase.window.requestAnimationFrame = f => {
        counter++;
        const cache = bc._elemrect;
        if (counter > 10) return;
        if (counter === 3) {
            t.context.data.window.resizeTo(500, t.context.data.window.innerHeight);
        }

        if (counter === 6) {
            t.context.data.window.resizeTo(t.context.data.window.innerWidth, 500);
        }

        f();

        if (counter === 2) {
            t.is(bc._elemrect, cache);
        }

        if (counter === 3) {
            t.not(bc._elemrect, cache);
        }

        if (counter === 5) {
            t.is(bc._elemrect, cache);
        }

        if (counter === 6) {
            t.not(bc._elemrect, cache);
        }
    };

    const old2 = BaseContainer.prototype._setResizeEvemt;
    BaseContainer.prototype._setResizeEvemt = () => {};

    const bc = new BaseContainer(document.body, {additionalClassNames: ['foo', 'bar']});
    let emitCounter = 0;
    bc.addEventListener('resize', ev => {
        emitCounter++;
        t.is(ev.detail.x, t.context.data.window.innerWidth);
        t.is(ev.detail.y, t.context.data.window.innerHeight);
    });

    old2.call(bc, bc.element);

    BaseContainer.prototype._setResizeEvemt = old2;
    PanelBase.window.requestAnimationFrame = old;

    t.is(counter > 6, true);
    t.is(emitCounter, 2);
});

test('sanitizeChildren › 引数に与えられた children の要素内から stack は1つのみ、最初の要素として採用される。', t => {
    PanelBase.window = t.context.data.window;
    PanelBase.document = t.context.data.document;
    PanelBase.CustomEvent = t.context.data.window.CustomEvent;
    PanelBase.HTMLElement = t.context.data.window.HTMLElement;
    PanelBase.Image = t.context.data.window.Image;

    const child1 = new Panel();
    const child2 = new StackContainer();
    const child3 = new Panel();
    const child4 = new StackContainer();
    const child5 = new Panel();

    const result = BaseContainer.sanitizeChildren([
        child1,
        child2,
        child3,
        child4,
        child5,
    ]);

    t.is(result.length, 4);
    t.is(result[0], child2);
    t.is(result[1], child1);
    t.is(result[2], child3);
    t.is(result[3], child5);
});
