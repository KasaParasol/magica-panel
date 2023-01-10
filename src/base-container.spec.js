import test from 'ava';
import {JSDOM} from 'jsdom';

import PanelBase from './panel-base.js';
import BaseContainer from './base-container.js';

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

    PanelBase._initialized = false;
    PanelBase.window = window;
    PanelBase.document = window.document;
    PanelBase.CustomEvent = window.CustomEvent;
});

test('constructor › 初期化できること(引数は格納要素の指定のみ)', t => {
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
