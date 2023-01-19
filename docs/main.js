(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MagicaPanel"] = factory();
	else
		root["MagicaPanel"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/base-container.js":
/*!*******************************!*\
  !*** ./src/base-container.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseContainer)
/* harmony export */ });
/* harmony import */ var _panel_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panel-base.js */ "./src/panel-base.js");


/**
 * すべての親となる要素。ツリー上に1つ一番親にのみ利用できる。
 * ウィンドウはこの中しか移動できない。
 */
class BaseContainer extends _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"]
{
    /**
     * @type { BaseContainerOptions }
     */
    static DEFAULT_OPTIONS = {
        type: 'base',
        overflowX: 'scroll',
        overflowY: 'scroll',
    };

    /**
     * すべての親となる要素。
     * @param { HTMLElement }                element   自身を表示するHTML要素
     * @param { BaseContainerOptions }       opts      オプション
     * @param { (StackContainer | Panel)[] } children  子要素(スタックは先頭1のみ・初回起動時の追加のみ許可)
     */
    constructor (element, opts = BaseContainer.DEFAULT_OPTIONS, ...children) {
        super(element, Object.assign(opts, BaseContainer.DEFAULT_OPTIONS, {...opts}), ...BaseContainer.sanitizeChildren(children));

        this.element.classList.add('magica-panel-wrapper');
        if (opts.overflowX === 'scroll') this.element.classList.add('ox-s');
        if (opts.overflowY === 'scroll') this.element.classList.add('oy-s');

        this.inner.className = 'magica-panel-base';
        if (opts.additionalClassNames) this.inner.classList.add(...opts.additionalClassNames);

        this._setResizeEvemt(element);
    }

    /**
     * リサイズイベントを設定します。
     * @param {HTMLElement} elem イベントターゲット
     */
    _setResizeEvemt (elem) {
        this._elemrect = {x: elem.clientWidth, y: elem.clientHeight};
        const dispatcher = () => {
            if (elem.clientWidth !== this._elemrect.x
            || elem.clientHeight !== this._elemrect.y) {
                this._elemrect = {x: elem.clientWidth, y: elem.clientHeight};
                this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: this._elemrect}));
            }
        };

        if (_panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].window.ResizeObserver) {
            const ro = new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].window.ResizeObserver(() => {
                dispatcher();
            });
            ro.observe(elem);
        }
        else {
            const f = () => {
                _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].window.requestAnimationFrame(() => {
                    dispatcher();
                    f();
                });
            };

            f();
        }
    }

    /**
     * 子要素の配列が正しい構成になるように検証・フィルタします。
     *
     * @param { (StackContainer | Panel)[] } children
     */
    static sanitizeChildren (children) {
        const stack = children.find(e => e.opts.type === 'stack');
        const result = [];
        if (stack) result.push(stack);
        result.push(...children.filter(e => e.opts.type === 'panel'));
        return result;
    }

    /**
     * 子要素の移動に追従します。
     */
    childMoveHandler (evt) {
        if (this.opts.overflowX === 'scroll' || this.opts.overflowY === 'scroll') {
            const currentRect = this.element.getClientRects()[0];
            const rects = this.children.map(e => e.element.getClientRects()[0]);
            if (this.opts.overflowX === 'scroll') {
                const maxX = Math.max(...rects.map(e => e.right + this.element.scrollLeft));
                if (currentRect.right < maxX) {
                    this.inner.style.width = `${maxX - this.inner.clientLeft}px`;
                }
                else if (currentRect.right > maxX) {
                    this.inner.style.width = '';
                }
            }

            if (this.opts.overflowY === 'scroll') {
                const maxY = Math.max(...rects.map(e => e.bottom + this.element.scrollTop));
                if (currentRect.bottom < maxY) {
                    this.inner.style.height = `${maxY - this.inner.clientTop}px`;
                }
                else if (currentRect.bottom > maxY) {
                    this.inner.style.height = '';
                }
            }
        }

        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('childrenmove', {detail: {...evt.detail, target: evt.target}}));
    }

    childMovedHandler (evt) {
        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('childrenmoved', {detail: {...evt.detail, target: evt.target}}));
    }

    childMinimizedHandler () {
        // eslint-disable-next-line unicorn/no-array-for-each
        this.children.filter(e => e.element.classList.contains('minimum')).forEach((value, counter) => {
            value.element.style.left = `${value.element.getClientRects()[0].width * counter}px`;
        });
    }

    childNormalizedHandler () {
        // eslint-disable-next-line unicorn/no-array-for-each
        this.children.filter(e => e.element.classList.contains('minimum')).forEach((value, counter) => {
            value.element.style.left = `${value.element.getClientRects()[0].width * counter}px`;
        });
    }
}


/***/ }),

/***/ "./src/panel-base.js":
/*!***************************!*\
  !*** ./src/panel-base.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PanelBase)
/* harmony export */ });
/* harmony import */ var _values_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./values.js */ "./src/values.js");


/**
 * @typedef CoordinationOptions
 *
 * @property { number } x X方向(指定があれば)
 * @property { number } y Y方向(指定があれば)
 */

/**
 * @typedef ResizeableOptions
 *
 * @property { boolean } enable       ユーザ操作の有効・無効
 * @property { boolean } showTitlebar 適用時にタイトルバーを表示するか
 */

/**
 * @typedef PanelOptions
 *
 * @property { 'panel' }                          type                パネル種別
 * @property { CoordinationOptions }              minSize             最小ウィンドウ内コンテンツサイズ(指定があれば)
 * @property { CoordinationOptions }              maxSize             最大ウィンドウ内コンテンツサイズ(指定があれば)
 * @property { CoordinationOptions }              position            初期位置(左上)
 * @property { CoordinationOptions }              defaultSize         初期サイズ(320x240, タイトルバー、ウィンドウ枠線含まず)
 * @property { string | HTMLElement }             title               タイトル
 * @property { boolean }                          closeable           バツボタンを出現させる
 * @property { boolean }                          minimable           最小化ボタンを出現させる
 * @property { ResizeableOptions }                maximum             最大化の挙動
 * @property { 'modal' | 'modaless' | 'topMost' } modal               モーダル表示状態
 * @property { 'scroll' | 'resize' | 'hidden' }   overflowX           内容コンテンツがX軸に溢れた場合
 * @property { 'scroll' | 'resize' | 'hidden' }   overflowY           内容コンテンツがY軸に溢れた場合
 * @property { string }                           additionalClassName パネルに追加で付けるクラス名
 * @property { any[] }                            attributes          任意に指定できる属性
 */

/**
 * @typedef  StackContainerOptions
 *
 * @property { 'stack' }                    type                パネル種別
 * @property { 'vertical' | 'horizontal'  } direction           分割方向
 * @property { string[] }                   template            コレクション各要素の初期サイズ
 * @property { boolean }                    reproportionable    コレクションの比率を操作できるか
 * @property { boolean }                    dockable            コレクションの脱着操作ができるか(ユーザ操作から)
 * @property { number }                     separatorWidth      分割境界線の幅(1～)
 * @property { string }                     additionalClassName パネルに追加で付けるクラス名
 * @property { string | HTMLElement }       panelAddArea        スタック内が空のときに表示されるパネル追加アイコン
 * @property { boolean }                    adjustSize          親要素リサイズ時やコレクションの増減時に自動的に各コレクションをリサイズするか
 * @property { any[] }                      attributes          任意に指定できる属性
 */

/**
 * @typedef BaseContainerOptions
 *
 * @property { 'base' }              type                 パネル種別
 * @property { 'scroll' | 'hidden' } overflowX            内容コンテンツがX軸に溢れた場合
 * @property { 'scroll' | 'hidden' } overflowY            内容コンテンツがY軸に溢れた場合
 * @property { string[] }            additionalClassNames パネルに追加で付けるクラス名
 */

class PanelBase extends EventTarget
{
    static _initialized = false;

    static window;
    static document;
    static CustomEvent;

    /**
     *
     * @param { HTMLElement } element
     * @param { PanelOptions | StackPanelOptions | BaseContainerOptions } opts
     * @param { (PanelBase | HTMLElement)[] } children
     */
    constructor (element, opts, ...children) {
        super();

        this.outer = undefined;
        this._changeParentHandler = ev => {
            this.changeParentHandler(ev);
        };

        this._childMovedHandler = ev => {
            this.childMovedHandler(ev);
        };

        this._childMoveHandler = ev => {
            this.childMoveHandler(ev);
        };

        this._childMinimizedHandler = ev => {
            this.childMinimizedHandler(ev);
        };

        this._childNormalizedHandler = ev => {
            this.childNormalizedHandler(ev);
        };

        this._resizeParentHandler = ev => {
            this.resizeParentHandler(ev);
        };

        this._opts = opts;
        this._element = element;
        // 自身要素を初期化する
        for (const child of Array.from(element.children)) {
            child.remove();
        }

        this._inner = PanelBase.document.createElement('div');
        this._element.append(this._inner);
        this._element.addEventListener('mousedown', () => this.active());
        this._element.addEventListener('touchstart', () => this.active());

        this._children = [];
        for (const child of children) if (child instanceof PanelBase) {
            child.parent = this;
        }

        /**
         * @type { PanelBase | undefined }
         */
        this._parent = undefined;
        if (!PanelBase._initialized) PanelBase.init();
        PanelBase._initialized = true;
    }

    /**
     * @return { PanelOptions | StackPanelOptions | BaseContainerOptions }
     */
    get opts () {
        const {title, ...other} = this._opts;
        const opts = JSON.parse(JSON.stringify(other));
        if (title) opts.title = title;
        return opts;
    }

    get element () {
        return this._element;
    }

    get inner () {
        return this._inner;
    }

    get children () {
        return [...this._children];
    }

    /**
     * UIを構築するための初期化メソッド
     */
    static init () {
        PanelBase.appendStyleElements();
    }

    /**
     * スタイルをヘッダに追加します。
     */
    static appendStyleElements () {
        const style = PanelBase.document.createElement('style');
        style.textContent = _values_js__WEBPACK_IMPORTED_MODULE_0__["default"].style;
        const ref = PanelBase.document.querySelector('style, link[rel="stylesheet"]');
        if (ref) {
            PanelBase.document.head.insertBefore(style, ref);
        }
        else {
            PanelBase.document.head.append(style);
        }
    }

    get parent () {
        return this._parent;
    }

    set parent (val) {
        if (this._parent) {
            this._parent.remove(this);
            this._parent.removeEventListener('resize', this._resizeParentHandler);
            this._parent.removeEventListener('close', this._closeParentHandler);
        }

        this._parent = val;
        if (val) {
            this._parent.append(this);
            this._parent.addEventListener('resize', this._resizeParentHandler);
            this._parent.addEventListener('close', this._closeParentHandler);
            this.dispatchEvent(new PanelBase.CustomEvent('changeparent', {detail: {target: this}}));
        }

        this.changeParentHandler(undefined);
    }

    resizeParentHandler () {
    }

    closeParentHandler () {
        this.close();
    }

    childMoveHandler () {
    }

    childMovedHandler () {
    }

    childMinimizedHandler () {
    }

    childNormalizedHandler () {
    }

    changeParentHandler () {
        this.dispatchEvent(new PanelBase.CustomEvent('changeparent', {detail: {target: this}}));
    }

    remove (val) {
        (val.outer ?? val.element).remove();
        this._children = this._children.filter(e => e !== val);
        val.removeEventListener('move', this._childMoveHandler);
        val.removeEventListener('moved', this._childMovedHandler);
        val.removeEventListener('minimized', this._childMinimizedHandler);
        val.removeEventListener('normalized', this._childNormalizedHandler);
        this.removeEventListener('changeparent', val._changeParentHandler);
    }

    append (val, ref) {
        const next = ref?.nextElementSibling;
        if (next) {
            this._inner.insertBefore(val.outer ?? val.element, next);
            const idx = this.children.map(e => e.element).findIndex(e => e.nextElementSibling === ref);
            this._children.splice(idx + 1, 0, val);
        }
        else {
            this._inner.append(val.outer ?? val.element);
            this._children.push(val);
        }

        val.addEventListener('move', this._childMoveHandler);
        val.addEventListener('moved', this._childMovedHandler);
        val.addEventListener('minimized', this._childMinimizedHandler);
        val.addEventListener('normalized', this._childNormalizedHandler);
        this.addEventListener('changeparent', val._changeParentHandler);
    }

    close () {
        this.parent = undefined;
        for (const child of this.children) if (child instanceof PanelBase) {
            child.close();
        }

        this.dispatchEvent(new PanelBase.CustomEvent('close', {detail: {target: this}}));
    }

    active () {
        if (this._parent) this._parent.modifyZIndex(this);
    }

    modifyZIndex (active) {
        const windows = this._children.filter(e => e.opts.type === 'panel');
        if (windows.includes(active)) {
            const targets = windows.filter(e => e !== active).sort((a, b) => Number(a.element.style.zIndex ?? '0') - Number(b.element.style.zIndex ?? '0'));
            let idx = 0;
            for (; idx < targets.length; idx++) {
                const target = targets[idx];
                target.element.style.zIndex = `${idx}`;
            }

            active.element.style.zIndex = `${idx}`;
        }
    }
}

try {
    PanelBase.window = window;
    PanelBase.document = document;
    PanelBase.CustomEvent = CustomEvent;
    PanelBase.HTMLElement = HTMLElement;
    PanelBase.Image = Image;
}
catch {
    PanelBase.window = undefined;
    PanelBase.document = undefined;
    PanelBase.CustomEvent = undefined;
    PanelBase.HTMLElement = undefined;
    PanelBase.Image = undefined;
}


/***/ }),

/***/ "./src/panel.js":
/*!**********************!*\
  !*** ./src/panel.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Panel)
/* harmony export */ });
/* harmony import */ var _panel_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panel-base.js */ "./src/panel-base.js");
/* harmony import */ var _base_container_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-container.js */ "./src/base-container.js");



/**
 * UIを格納するパネルエリア。ウィンドウ表示・ほかパネルへの格納が可能
 */
class Panel extends _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"]
{
    /**
     * @type { PanelOptions }
     */
    static DEFAULT_OPTIONS = {
        type: 'panel',
        position: {x: 0, y: 0},
        minSize: {x: 120, y: 0},
        defaultSize: {x: 320, y: 240},
        title: '',
        closeable: true,
        autoClose: true,
        minimable: true,
        maximum: {enable: true, showTitlebar: true},
        defaultMode: 'normal',
        modal: 'modaless',
        overflowX: 'scroll',
        overflowY: 'scroll',
        additionalClassName: '',
        attributes: [],
    };

    /**
     * UIを格納するパネルエリア。ウィンドウ・ペイン表示が可能
     *
     * @param { PanelOptions }            opts    オプション
     * @param { HTMLElement | PanelBase } content 内容コンテンツ
     */
    constructor (opts = Panel.DEFAULT_OPTIONS, content) {
        super(_panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div'), Object.assign(opts, Panel.DEFAULT_OPTIONS, {...opts}), content);

        this.element.classList.add('magica-panel-window');
        this.inner.className = 'magica-panel-inner';
        if (opts.overflowX === 'scroll') {
            this._inner.classList.add('ox-s');
        }

        if (opts.overflowY === 'scroll') {
            this._inner.classList.add('oy-s');
        }

        if (opts.defaultMode === 'normal') {
            this._inner.style.width = `${opts.defaultSize.x}px`;
            this._inner.style.height = `${opts.defaultSize.y}px`;
        }

        if (content instanceof _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].HTMLElement) {
            this.inner.append(content);
        }

        // タイトルバーを追加
        const titlebar = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
        if (typeof opts?.title === 'string') {
            const span = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('span');
            span.textContent = opts.title;
            titlebar.append(span);
        }
        else if (typeof opts?.title === 'object' && opts.title instanceof _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].HTMLElement) {
            titlebar.append(opts.title);
        }

        this.titlebar = titlebar;
        this.titlebar.draggable = true;
        this.element.insertBefore(titlebar, this.element.children[0]);

        this.titlebar.classList.add('magica-panel-titlebar');
        if (!this.opts.maximum.showTitlebar) {
            this.titlebar.classList.add('maximum-disable');
        }

        this.titlebar.addEventListener('mousedown', ev => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('touchstart', ev => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('touchmove', ev => {
            this._moveTitlebarHandler(ev);
            ev.preventDefault();
        });

        this.titlebar.addEventListener('touchend', ev => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('drag', ev => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('dragend', ev => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('dragstart', ev => {
            ev.dataTransfer.setDragImage(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].Image(), 0, 0);
            ev.dataTransfer.setData('text/plain', 'panel');
        }, false);

        this._addResizeArea();

        // ボタンエリアを追加
        const buttonarea = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
        buttonarea.classList.add('magica-panel-button-area');
        this.element.append(buttonarea);

        // 閉じるボタンを追加
        const closebutton = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('button');
        closebutton.textContent = '×';
        closebutton.classList.add('magica-panel-button', 'close');
        if (!this.opts.closeable) {
            closebutton.classList.add('deny');
        }

        closebutton.addEventListener('click', () => {
            this.close();
        });

        buttonarea.append(closebutton);

        // 最大化/復元ボタンを追加
        const maximumbutton = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('button');
        maximumbutton.textContent = '❐';
        maximumbutton.classList.add('magica-panel-button', 'maximum');
        maximumbutton.addEventListener('click', () => {
            if (this.element.classList.contains('maximum')) {
                this.normal();
            }
            else {
                this.maximum();
            }
        });

        if (!this.opts.maximum.enable) {
            maximumbutton.classList.add('deny');
        }

        closebutton.before(maximumbutton);

        // 最小化/復元ボタンを追加
        const minimumbutton = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('button');
        minimumbutton.textContent = '-';
        minimumbutton.classList.add('magica-panel-button', 'minimum');
        minimumbutton.addEventListener('click', () => {
            if (this.element.classList.contains('minimum')) {
                this.normal();
            }
            else {
                this.minimum();
            }
        });

        if (!this.opts.minimable) {
            minimumbutton.classList.add('deny');
        }

        maximumbutton.before(minimumbutton);

        // モーダル
        if (this.opts.modal !== 'modaless') {
            this.element.classList.add('topmost');
            minimumbutton.classList.add('deny');
            maximumbutton.classList.add('deny');
        }

        this.element.style.left = `${this.opts.position.x}px`;
        this.element.style.top = `${this.opts.position.y}px`;
        this.adjustWindowPosition();
    }

    _addResizeArea () {
        // リサイズ領域を追加
        this.edges = {};
        for (const target of [['top'], ['bottom'], ['left'], ['right'], ['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']]) {
            const edge = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
            edge.classList.add('magica-panel-edge', ...target);
            this.element.append(edge);
            edge.draggable = 'true';
            edge.addEventListener('mousedown', ev => this._resizeAreaHandler(ev));
            edge.addEventListener('touchstart', ev => this._resizeAreaHandler(ev));
            edge.addEventListener('touchmove', ev => {
                this._resizeAreaHandler(ev);
                ev.preventDefault();
            });

            edge.addEventListener('drag', ev => this._resizeAreaHandler(ev));
            edge.addEventListener('dragstart', ev => ev.dataTransfer.setDragImage(new Image(), 0, 0), false);
            this.edges[target] = edge;
        }
    }

    /***
     * @param { MouseEvent } ev
     */
    _resizeAreaHandler (ev) {
        if (ev.type === 'mousedown' || ev.type === 'touchstart') {
            this._clickstart = {x: ev.pageX ?? ev.touches[0].pageX, y: ev.pageY ?? ev.touches[0].pageY};
            this._startrect = this.element.getClientRects()[0];
        }
        else if (ev.type === 'drag'
        || ev.type === 'touchmove') {
            if ((ev.screenY ?? ev.touches?.[0]?.screenY) === 0) return;

            if (ev.target.classList.contains('top')) {
                let height = this._startrect.height + this._clickstart.y - (ev.pageY ?? ev.touches[0].pageY) - 10;
                height = height <= this.opts.minSize.y? this.opts.minSize.y: height >= (this.opts.maxSize?.y ?? Infinity)? this.opts.maxSize.y: height;
                this.element.style.top = `${this.parent.element.scrollTop + this._startrect.bottom - height - this.titlebar.clientHeight}px`;
                this.inner.style.height = `${height}px`;
            }

            if (ev.target.classList.contains('bottom')) {
                const height = this._startrect.height + (ev.pageY ?? ev.touches[0].pageY) - this._clickstart.y - 10;
                this.inner.style.height = `${height <= this.opts.minSize.y? this.opts.minSize.y: height >= (this.opts.maxSize?.y ?? Infinity)? this.opts.maxSize.y: height}px`;
            }

            if (ev.target.classList.contains('left')) {
                let width = this._startrect.width + this._clickstart.x - (ev.pageX ?? ev.touches[0].pageX) - 10;
                width = width <= this.opts.minSize.x? this.opts.minSize.x: width >= (this.opts.maxSize?.x ?? Infinity)? this.opts.maxSize.x: width;
                this.element.style.left = `${this.parent.element.scrollLeft + this._startrect.right - width}px`;
                this.inner.style.width = `${width}px`;
            }

            if (ev.target.classList.contains('right')) {
                const width = this._startrect.width + (ev.pageX ?? ev.touches[0].pageX) - this._clickstart.x - 10;
                this.inner.style.width = `${width <= this.opts.minSize.x? this.opts.minSize.x: width >= (this.opts.maxSize?.x ?? Infinity)? this.opts.maxSize.x: width}px`;
            }

            this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
        }
    }

    /***
     * @param { MouseEvent } ev
     */
    _moveTitlebarHandler (ev) {
        if ((this.element.classList.contains('maximum') && this.parent instanceof _base_container_js__WEBPACK_IMPORTED_MODULE_1__["default"])
        || this.element.classList.contains('minimum')) {
            return;
        }

        switch (ev.type) {
            case 'touchstart':
            case 'mousedown': {
                const rect = ev.target.getClientRects()[0];
                this._clickstart = {x: ev.offsetX ?? (ev.touches[0].pageX - rect.left), y: ev.offsetY ?? (ev.touches[0].pageY - rect.top)};
                break;
            }

            case 'touchmove': {
                this._latestTouchEv = ev;
            }

            case 'drag': {
                if ((ev.screenY ?? ev.touches?.[0]?.screenY) === 0) return;

                this.element.style.left = `${(this.parent.element.scrollLeft + (ev.pageX ?? ev.touches[0].pageX)) - this._clickstart.x}px`;
                this.element.style.top = `${(this.parent.element.scrollTop + (ev.pageY ?? ev.touches[0].pageY)) - this._clickstart.y}px`;
                this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('move', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
                break;
            }

            case 'touchend': {
                ev = this._latestTouchEv;
            }

            case 'dragend': {
                this.adjustWindowPosition();
                this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('moved', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
                break;
            }
        }
    }

    adjustWindowPosition () {
        const currentRect = this.element.getClientRects()?.[0];
        if (!currentRect || !this.parent) return;
        if (this.parent.inner.clientHeight > this.element.clientHeight
        && (this.parent.inner.clientHeight) < currentRect.bottom) {
            this.element.style.top = `${this.parent.inner.clientHeight - this.element.clientHeight}px`;
        }

        if (this.parent.inner.clientWidth > this.element.clientWidth
        && (this.parent.inner.clientWidth) < currentRect.right) {
            this.element.style.left = `${this.parent.inner.clientWidth - this.element.clientWidth}px`;
        }

        if (currentRect.left < 0) {
            this.element.style.left = '0px';
        }

        if (currentRect.top < 0) {
            this.element.style.top = '0px';
        }
    }

    maximum () {
        this._left = this.element.getClientRects()[0]?.left ?? 0;
        this.element.classList.remove('minimum');
        this.element.classList.add('maximum');
        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
    }

    normal (x) {
        let ratio = 0;
        if (x !== undefined) {
            const rect = this.element.getClientRects()[0];
            ratio = (x - rect.left) / rect.width;
        }

        this.element.classList.remove('minimum');
        this.element.classList.remove('maximum');

        if (x !== undefined) {
            const w = this.element.getClientRects()[0].width;
            if (this._clickstart) {
                this._clickstart.x = w * ratio;
            }

            this.element.style.left = `${Math.round(x - (w * ratio))}px`;
        }
        else if (this._left) {
            this.element.style.left = `${this._left}px`;
        }

        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('normalized', {detail: {target: this}}));
        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
    }

    minimum () {
        this._left = this.element.getClientRects()[0]?.left ?? 0;
        this.element.classList.remove('maximum');
        this.element.classList.add('minimum');
        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('minimized', {detail: {target: this}}));
    }

    resizeParentHandler (_evt) {
        if (!this.element.classList.contains('maximum') && !this.element.classList.contains('minimum')) {
            this.adjustWindowPosition();
        }

        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
    }

    changeParentHandler (evt) {
        super.changeParentHandler(evt);
        if (this.opts.modal === 'modal') {
            this.outer = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
            this.outer.classList.add('magica-panel-modal-blocker');
            this.element.parentElement.insertBefore(this.outer, this.element);
            this.outer.append(this.element);
            const rect = this.element.getClientRects()[0];
            if (rect) {
                this.element.style.left = `calc(50% - ${rect.width / 2}px)`;
                this.element.style.top = `calc(50% - ${rect.height / 2}px)`;
            }
        }

        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
    }
}


/***/ }),

/***/ "./src/stack-container.js":
/*!********************************!*\
  !*** ./src/stack-container.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StackContainer)
/* harmony export */ });
/* harmony import */ var _panel_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panel-base.js */ "./src/panel-base.js");


/**
 * 垂直または水平方向への整列やタブ切り替えによるパネルのスイッチ(3個のうちいずれか1つ)を提供します。
 */
class StackContainer extends _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"]
{
    /**
     * @type { StackContainerOptions }
     */
    static DEFAULT_OPTIONS = {
        type: 'stack',
        direction: 'vertical',
        reproportionable: true,
        dockable: true,
        separatorWidth: 2,
        additionalClassName: '',
        attributes: [],
        template: undefined,
        panelAddArea: undefined,
        adjustSize: true,
    };

    /**
     * UIを格納するパネルエリア。ウィンドウ・ペイン表示が可能
     *
     * @param { StackContainerOptions }      opts    オプション
     * @param { (StackContainer | Panel)[] } children 内容コンテンツ
     */
    constructor (opts = StackContainer.DEFAULT_OPTIONS, ...children) {
        super(_panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div'), Object.assign(opts, StackContainer.DEFAULT_OPTIONS, {...opts}), ...children);

        if (this.opts.adjustSize === false) {
            this.opts.reproportionable = false;
        }

        this._calcGridSize(undefined, undefined, this.opts.template);
        this.element.classList.add('magica-panel-stack-wrapper');
        this.inner.classList.add('magica-panel-stack-inner');
        if (this.opts.direction === 'vertical') {
            this.element.classList.add('vertical');
        }

        if (this.opts.direction === 'horizontal') {
            this.element.classList.add('horizontal');
        }

        if (typeof this.opts.direction === 'object') {
            this.element.classList.add('tab');
        }
        else {
            if (!this.addareas) {
                this.addareas = [];
                this.element.classList.add('empty');
            }

            const addArea = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
            addArea.classList.add('magica-panel-stack-separator', 'empty');
            if (typeof this.opts.panelAddArea === 'object') {
                addArea.append(this.opts.panelAddArea);
            }
            else {
                addArea.textContent = this.opts.panelAddArea ?? this.opts.direction === 'vertical'? '▤' : '▥';
            }

            this.addareas.push(addArea);
            this.element.append(addArea);
        }

        this._movehandler = evt => {
            if (evt.detail.target.opts.modal !== 'modaless') return;

            const mouseY = this.root.element.scrollTop + (evt.detail.ev.pageY ?? evt.detail.ev.touches[0].pageY);
            const mouseX = this.root.element.scrollLeft + (evt.detail.ev.pageX ?? evt.detail.ev.touches[0].pageX);
            const elemRect = this.element.getClientRects()[0];
            if (elemRect.top < mouseY && mouseY < elemRect.bottom
            && elemRect.left < mouseX && mouseX < elemRect.right
            && evt.detail.target.opts.maximum.enable === true && this.opts.dockable === true) {
                this.element.classList.add('hover');
            }
            else {
                this.element.classList.remove('hover');
            }

            for (const addarea of this.addareas) {
                const rect = addarea.getClientRects()[0];
                if (rect && rect.top < mouseY && mouseY < rect.bottom
                && rect.left < mouseX && mouseX < rect.right) {
                    addarea.classList.add('hover');
                }
                else {
                    addarea.classList.remove('hover');
                }
            }
        };

        this._movedhandler = evt => {
            if (evt.detail.target.opts.modal !== 'modaless') return;

            const mouseY = this.root.element.scrollTop + (evt.detail.ev.pageY ?? evt.detail.ev.touches[0].pageY);
            const mouseX = this.root.element.scrollLeft + (evt.detail.ev.pageX ?? evt.detail.ev.touches[0].pageX);
            const elemRect = this.element.getClientRects()[0];
            if (elemRect.top < mouseY && mouseY < elemRect.bottom
            && elemRect.left < mouseX && mouseX < elemRect.right
            && evt.detail.target.opts.maximum.enable === true && this.opts.dockable === true) {
                for (const addarea of this.addareas) {
                    if (evt.detail.target.element.previousElementSibling === addarea.parentElement
                    || evt.detail.target.element.nextElementSibling === addarea.parentElement
                    || evt.detail.target.parent !== this.root) {
                        addarea.classList.remove('hover');
                        continue;
                    }

                    const rect = addarea.getClientRects()[0];
                    if (rect && rect.top < mouseY && mouseY < rect.bottom
                    && rect.left < mouseX && mouseX < rect.right) {
                        this._lastref = this.element.contains(addarea.closest('.magica-panel-stack-inner'))? addarea.parentElement: undefined;
                        this._lastTargetRange = evt.detail.target.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width'];
                        evt.detail.target.parent = this;
                    }

                    addarea.classList.remove('hover');
                }

                this.element.classList.remove('hover');
            }
        };
    }

    get parent () {
        return super.parent;
    }

    set parent (val) {
        super.parent = val;
    }

    changeParentHandler (evt) {
        super.changeParentHandler(evt);
        if (this.root) {
            if (this._root) {
                this._root.removeEventListener('childrenmove', this._movehandler);
                this._root.removeEventListener('childrenmoved', this._movedhandler);
            }

            this.root.addEventListener('childrenmove', this._movehandler);
            this.root.addEventListener('childrenmoved', this._movedhandler);
            this._root = this.root;
        }
    }

    append (val) {
        if (!this.addareas) this.addareas = [];
        if (this.inner.children.length === 0) {
            const sep = this._generateSeparator();
            this.addareas.push(sep.children[0]);
            this.inner.append(sep);
        }

        let ranges = [];
        if (this.element.closest('body')) {
            const windowRange = this._lastTargetRange;
            ranges = this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width'] ?? e.opts?.defaultSize[this.opts.direction === 'vertical'? 'y': 'x'] ?? 100);

            if (this._lastref) {
                const idx = this.children.map(e => e.element).indexOf(this._lastref.previousElementSibling);
                const insertTargetRange = ((ranges[idx] ?? 0) + (ranges[idx + 1] ?? 0)) / 2;
                const insertRange = Math.min(insertTargetRange, windowRange) - this.opts.separatorWidth;
                if (~idx && ranges[idx + 1]) {
                    const [smallIdx, largeIdx] = ranges[idx] > ranges[idx + 1]? [idx + 1, idx]: [idx, idx + 1];
                    const ratio = ranges[smallIdx] / ranges[largeIdx];
                    const smallSize = Math.round(insertRange / 2 * ratio);
                    ranges[smallIdx] -= smallSize;
                    ranges[largeIdx] -= (insertRange - smallSize);
                }
                else if (~idx) {
                    ranges[idx] -= insertRange;
                }
                else {
                    ranges[idx + 1] -= insertRange;
                }

                ranges.splice(idx + 1, 0, insertRange - this.opts.separatorWidth);
            }

            ranges = ranges.map(e => `${e}px`);
        }

        super.append(val, this._lastref);
        if (val.maximum) val.maximum();

        const sep = this._generateSeparator();
        this.addareas.push(sep.children[0]);
        if (val.element.nextElementSibling) {
            this.inner.insertBefore(sep, val.element.nextElementSibling);
        }
        else {
            this.inner.append(sep);
        }

        this.element.classList.remove('empty');
        if (this.element.closest('body') && this.opts.adjustSize) {
            this._calcGridSize(undefined, undefined, ranges.length === 0? undefined: ranges);
        }
    }

    resizeParentHandler () {
        if (!this.element.closest('body')) return;

        let ranges = this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width']).filter(e => e !== undefined);
        const total = ranges.reduce((a, c) => a + c, 0);
        const ratios = ranges.map(e => e / total);
        const currentWidth = this.inner.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width'] - (this.opts.separatorWidth * (this.children.length + 1));
        ranges = ratios.map(e => Math.round(e * currentWidth));
        ranges.pop();
        ranges.push(currentWidth - ranges.reduce((a, c) => a + c, 0));
        ranges = ranges.map(e => `${e}px`);
        if (ranges.length > 0 && this.opts.adjustSize) {
            this._calcGridSize(undefined, undefined, ranges);
        }

        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
    }

    remove (val) {
        let ranges = typeof this._lastTargetRange === 'object'? this._lastTargetRange: this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width']);
        if (ranges) {
            this._lastTargetRange = undefined;
            const idx = this.children.indexOf(val);
            if (!ranges[idx - 1] && ranges[idx + 1]) {
                ranges[idx + 1] += ranges[idx] + this.opts.separatorWidth;
            }
            else if (!ranges[idx + 1] && ranges[idx - 1]) {
                ranges[idx - 1] += ranges[idx] + this.opts.separatorWidth;
            }
            else if (ranges[idx + 1] && ranges[idx - 1]) {
                const [smallIdx, largeIdx] = ranges[idx - 1] > ranges[idx + 1]? [idx + 1, idx - 1]: [idx - 1, idx + 1];
                const ratio = ranges[smallIdx] / ranges[largeIdx];
                const smallSize = Math.round((ranges[idx] + this.opts.separatorWidth) / 2 * ratio);
                ranges[smallIdx] += smallSize;
                ranges[largeIdx] += (ranges[idx] + this.opts.separatorWidth) - smallSize;
            }

            ranges = ranges.filter((_e, i) => i !== idx).map(e => `${e}px`);
        }

        val.element.nextElementSibling.remove();

        super.remove(val);
        if (this.inner.children.length === 1) {
            this.addareas.filter(e => e !== this.inner.children[0].children[0]);
            this.inner.children[0].remove();
            this.element.classList.add('empty');
        }

        if (this.opts.adjustSize) {
            this._calcGridSize(undefined, undefined, ranges?.length === 0? undefined: ranges);
        }
    }

    _calcGridSize (sep, pos, template) {
        const target = this.opts.direction === 'vertical'? 'gridTemplateRows': 'gridTemplateColumns';
        const currentSizes = template ?? this.inner.style[target].split(' ').filter(e => e !== '').filter((_e, i) => i % 2 !== 0);
        if (this.children.length === 0) {
            this.inner.style[target] = '';
            return;
        }

        if (this.children.length === 1) {
            currentSizes[0] = '1fr';
        }

        if (sep && sep.previousElementSibling && sep.nextElementSibling && pos !== undefined) {
            const bros = Array.from(this.inner.children).filter(e => !e.classList.contains('magica-panel-stack-separator'));
            const prevIdx = bros.indexOf(sep.previousElementSibling);
            const nextIdx = bros.indexOf(sep.nextElementSibling);
            const prevRect = sep.previousElementSibling.getClientRects()[0];
            const nextRect = sep.nextElementSibling.getClientRects()[0];

            let prevRange = pos - (this.opts.direction === 'vertical'? prevRect.top: prevRect.left - this.opts.separatorWidth);
            let frFlag = false;
            if (prevRange <= 0 && this.children[prevIdx].opts.minimable) {
                frFlag = true;
                currentSizes[prevIdx] = '0px';
                currentSizes[nextIdx] = `${nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - this.opts.separatorWidth}px`;
            }
            else {
                prevRange = this.children[prevIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] > prevRange ? this.children[prevIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] : prevRange;
            }

            let nextRange = (this.opts.direction === 'vertical'? nextRect.bottom: nextRect.right) - ((this.opts.direction === 'vertical'? prevRect.top: prevRect.left) + prevRange + this.opts.separatorWidth) - this.opts.separatorWidth;
            if (nextRange <= 0 && this.children[nextIdx].opts.minimable && !frFlag) {
                frFlag = true;
                currentSizes[prevIdx] = `${nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - this.opts.separatorWidth}px`;
                currentSizes[nextIdx] = '0px';
            }
            else {
                nextRange = this.children[nextIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] > nextRange ? this.children[nextIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] : nextRange;
                prevRange = nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - nextRange - this.opts.separatorWidth;
            }

            if (!frFlag) {
                if (this.opts.direction === 'vertical') {
                    currentSizes[prevIdx] = `${prevRange}px`;
                    currentSizes[nextIdx] = `${nextRange}px`;
                }
                else if (this.opts.direction === 'horizontal') {
                    currentSizes[prevIdx] = `${prevRange}px`;
                    currentSizes[nextIdx] = `${nextRange}px`;
                }
            }
        }

        for (let idx = 0; idx < this.children.length; idx++) if (currentSizes[idx] === undefined) {
            currentSizes.push('1fr');
        }

        currentSizes.splice(this.children.length);
        this.inner.style[target] = `${this.opts.separatorWidth}px ${currentSizes.join(` ${this.opts.separatorWidth}px `)} ${this.opts.separatorWidth}px`;
    }

    _generateSeparator () {
        const elem = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
        elem.classList.add('magica-panel-stack-separator');
        if (this.opts.reproportionable === false) {
            elem.classList.add('disable');
        }

        elem.style[this.opts.direction === 'vertical'? 'height': 'width'] = `${this.opts.separatorWidth}px`;
        elem.draggable = true;
        const inner = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
        inner.classList.add('magica-panel-stack-separator-droparea');
        elem.append(inner);
        elem.addEventListener('dragstart', ev => {
            ev.dataTransfer.setDragImage(new Image(), 0, 0);
        });

        elem.addEventListener('drag', ev => {
            if (ev.screenY === 0 || this.opts.reproportionable === false) return;

            this._calcGridSize(ev.target, this.opts.direction === 'vertical'? ev.pageY : ev.pageX);
        });

        elem.addEventListener('touchmove', ev => {
            if (ev.touches[0]?.screenY === 0 || this.opts.reproportionable === false) return;

            this._calcGridSize(ev.target, this.opts.direction === 'vertical'? ev.touches[0].pageY : ev.touches[0].pageX);
        });

        return elem;
    }

    /**
     * 子要素の移動に追従します。
     */
    childMoveHandler (evt) {
        this._lastTargetRange = this.children.map(e => e.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width']);
        evt.detail.target.normal((evt.detail.ev.pageX ?? evt.detail.ev.touches[0].pageX));
        evt.detail.target.parent = this.root;
    }

    get root () {
        let parent = this._parent;
        while (parent?.parent !== undefined) {
            parent = parent.parent;
        }

        return parent;
    }
}


/***/ }),

/***/ "./src/values.js":
/*!***********************!*\
  !*** ./src/values.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const style = `
.magica-panel-wrapper {
    overflow-x: hidden;
    overflow-y: hidden;
}

.magica-panel-wrapper.ox-s {
    overflow-x: auto;
}

.magica-panel-wrapper.oy-s {
    overflow-y: auto;
}

.magica-panel-base {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    width: 100%;
    height: 100%;
}

.magica-panel-window {
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px;
    background: midnightblue;
    box-sizing: border-box;
}

.magica-panel-titlebar {
    position: relative;
    height: 1.5rem;
    color: white;
    user-select:none;
    margin-right: calc(2.5rem * 3);
    box-sizing: content-box;
    overflow: hidden;
}

.magica-panel-window.maximum > .magica-panel-titlebar.maximum-disable {
    display: none;
}

.magica-panel-window.maximum > .magica-panel-titlebar.maximum-disable ~ .magica-panel-button-area {
    display: none;
}

.magica-panel-titlebar > * {
    position: absolute;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.magica-panel-inner {
    position: relative;
    background: white;
    padding: 1px;
    overflow-x: hidden;
    overflow-y: hidden;
}

.magica-panel-inner.ox-s {
    overflow-x: auto;
}

.magica-panel-inner.oy-s {
    overflow-y: auto;
}

.magica-panel-edge {
    position: absolute;
    user-select:none;
}

.magica-panel-edge.left {
    top: 0;
    left: 0;
    height: 100%;
    width: 4px;
    cursor: ew-resize;
}

.magica-panel-edge.right {
    top: 0;
    right: 0;
    height: 100%;
    width: 4px;
    cursor: ew-resize;
}

.magica-panel-edge.left:active,
.magica-panel-edge.right:active {
    cursor: ew-resize;
}

.magica-panel-edge.top {
    top: 0;
    left: 0;
    height: 4px;
    width: 100%;
    cursor: ns-resize;
}

.magica-panel-edge.bottom {
    bottom: 0;
    left: 0;
    height: 4px;
    width: 100%;
    cursor: ns-resize;
}

.magica-panel-edge.top:active,
.magica-panel-edge.bottom:active {
    cursor: ns-resize;
}

.magica-panel-edge.top.left,
.magica-panel-edge.top.right,
.magica-panel-edge.bottom.left,
.magica-panel-edge.bottom.right {
    height: 4px;
    width: 4px;
    top: unset;
    left: unset;
    right: unset;
    bottom: unset;
}

.magica-panel-edge.top.left {
    top: 0;
    left: 0;
    cursol: nwse-resize;
}

.magica-panel-edge.top.right {
    top: 0;
    right: 0;
    cursol: nesw-resize;
}

.magica-panel-edge.bottom.left {
    bottom: 0;
    left: 0;
    cursol: nesw-resize;
}

.magica-panel-edge.bottom.right {
    bottom: 0;
    right: 0;
    cursol: nwse-resize;
}

.magica-panel-window.maximum {
    padding: 0px;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
}

.magica-panel-window.maximum .magica-panel-edge {
    display: none;
}

.magica-panel-window.maximum .magica-panel-titlebar {
    height: calc(1.5rem + 4px);
}

.magica-panel-window.maximum > .magica-panel-inner {
    width: calc(100% - 2px) !important;
    height: calc(100% - 1.5rem - 6px) !important;
}

.magica-panel-window.maximum > .magica-panel-titlebar.maximum-disable ~ .magica-panel-inner {
    height: calc(100% - 2px) !important;
}

.magica-panel-window.minimum {
    width: 186px;
    bottom: 0 !important;
    top: unset !important;
}

.magica-panel-window.topmost {
    z-index: 65535 !important;
}

.magica-panel-modal-blocker {
    background: rgba(0,0,0,.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 65535 !important;
}

.magica-panel-window.minimum > .magica-panel-inner {
    display: none;
}

.magica-panel-window.minimum > .magica-panel-edge {
    display: none;
}

.magica-panel-button-area {
    position: absolute;
    top: 0;
    right: 0;
    height: calc(1.5rem + 4px);
    user-select:none;
}

.magica-panel-button {
    color: white;
    height: calc(1.5rem + 4px);
    border: none;
    font-weight: bold;
    width: 2.5rem;
    font-size: 1rem;
    background: midnightblue;
}

.magica-panel-button.deny {
    display: none;
}

.magica-panel-button.close {
    background: #701919;
}
.magica-panel-button.close.onactive {
    background: #e63232;
}

.magica-panel-stack-wrapper {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    z-index: 0;
}

.magica-panel-stack-wrapper.ox-s {
    overflow-x: auto;
}

.magica-panel-stack-wrapper.oy-s {
    overflow-y: auto;
}

.magica-panel-stack-inner {
    width: 100%;
    height: 100%;
    display: grid;
}

.magica-panel-stack-separator {
    background-color: midnightblue;
    color: white;
}

.magica-panel-stack-separator {
    background-color: midnightblue;
    color: white;
    z-index: 100;
    position: relative;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-separator {
    background: midnightblue;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-separator {
    background: midnightblue;
}

.magica-panel-stack-separator.empty {
    position: absolute;
    margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    width: 5rem;
    text-align: center;
    opacity: 0.5;
    user-select: none;
    display: none;
}

.magica-panel-stack-separator-droparea {
    position: absolute;
    display: none;
    background: rgba(25,25,112, 0.3);
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-separator .magica-panel-stack-separator-droparea {
    height: 100%;
    width: 10rem;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-separator .magica-panel-stack-separator-droparea {
    left: -5rem;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-separator:first-of-type .magica-panel-stack-separator-droparea {
    left: 0;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-separator:last-of-type .magica-panel-stack-separator-droparea {
    right: 0;
    left: unset;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-separator .magica-panel-stack-separator-droparea {
    width: 100%;
    height: 10rem;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-separator .magica-panel-stack-separator-droparea {
    top: -5rem;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-separator:first-of-type .magica-panel-stack-separator-droparea {
    top: 0;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-separator:last-of-type .magica-panel-stack-separator-droparea {
    bottom: 0;
    top: unset;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-separator:NOT(.hover):NOT(.disable):NOT(:first-of-type):NOT(:last-of-type):hover {
    cursor: ns-resize;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-separator:NOT(.hover):NOT(.disable):NOT(:first-of-type):NOT(:last-of-type):hover {
    cursor: ew-resize;
}

.magica-panel-stack-wrapper.hover .magica-panel-stack-separator:NOT(.empty) {
    display: block;
}

.magica-panel-stack-wrapper.hover.empty .magica-panel-stack-separator.empty {
    display: block;
}

.magica-panel-stack-wrapper.hover .magica-panel-stack-separator-droparea {
    display: block;
}

.magica-panel-stack-separator.hover {
    opacity: 1;
}

.magica-panel-stack-wrapper.vertical .magica-panel-stack-inner {
    grid-template-columns: 1fr;
}

.magica-panel-stack-wrapper.horizontal .magica-panel-stack-inner {
    grid-template-rows: 1fr;
}

.magica-panel-stack-inner .magica-panel-window.maximum {
    position: relative;
    top: unset !important;
    left unset !important;
    z-index: unset !important;
}

.magica-panel-stack-inner .magica-panel-button.maximum {
    display: none;
}

.magica-panel-stack-inner .magica-panel-button.minimum {
    display: none;
}
`;

const Value = {
    style,
};

Object.freeze(Value);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Value);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseContainer": () => (/* binding */ BaseContainer),
/* harmony export */   "Panel": () => (/* binding */ Panel),
/* harmony export */   "StackContainer": () => (/* binding */ StackContainer),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-container.js */ "./src/base-container.js");
/* harmony import */ var _panel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./panel.js */ "./src/panel.js");
/* harmony import */ var _stack_container_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stack-container.js */ "./src/stack-container.js");




const BaseContainer = _base_container_js__WEBPACK_IMPORTED_MODULE_0__["default"];
const Panel = _panel_js__WEBPACK_IMPORTED_MODULE_1__["default"];
const StackContainer = _stack_container_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    BaseContainer,
    Panel,
    StackContainer,
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsRUFBRTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixrRUFBcUIsWUFBWSxTQUFTLGNBQWM7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLEVBQUU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUpBQXlKO0FBQ3BNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUpBQXlKO0FBQ3BNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pELCtDQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQSwrQ0FBK0MsVUFBVTtBQUN6RCwrQ0FBK0MsVUFBVTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0QkFBNEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLEtBQUssc0JBQXNCLHlCQUF5QixPQUFPLEVBQUUseUJBQXlCO0FBQ3JKO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2RUFBZ0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFQUErRSx5QkFBeUI7QUFDeEc7QUFDQSxzQkFBc0IsNkVBQWdDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsS0FBSyxFQUFDOzs7Ozs7O1VDdllyQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZ0Q7QUFDakI7QUFDbUI7QUFDbEQ7QUFDTyxzQkFBc0IsMERBQWE7QUFDbkMsY0FBYyxpREFBSztBQUNuQix1QkFBdUIsMkRBQWM7QUFDNUMsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvYmFzZS1jb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvcGFuZWwtYmFzZS5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9wYW5lbC5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9zdGFjay1jb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvdmFsdWVzLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTWFnaWNhUGFuZWxcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTWFnaWNhUGFuZWxcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFBhbmVsQmFzZSBmcm9tICcuL3BhbmVsLWJhc2UuanMnO1xyXG5cclxuLyoqXHJcbiAqIOOBmeOBueOBpuOBruimquOBqOOBquOCi+imgee0oOOAguODhOODquODvOS4iuOBqzHjgaTkuIDnlaropqrjgavjga7jgb/liKnnlKjjgafjgY3jgovjgIJcclxuICog44Km44Kj44Oz44OJ44Km44Gv44GT44Gu5Lit44GX44GL56e75YuV44Gn44GN44Gq44GE44CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQ29udGFpbmVyIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBCYXNlQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICAgICAgdHlwZTogJ2Jhc2UnLFxyXG4gICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXHJcbiAgICAgICAgb3ZlcmZsb3dZOiAnc2Nyb2xsJyxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgZnjgbnjgabjga7opqrjgajjgarjgovopoHntKDjgIJcclxuICAgICAqIEBwYXJhbSB7IEhUTUxFbGVtZW50IH0gICAgICAgICAgICAgICAgZWxlbWVudCAgIOiHqui6q+OCkuihqOekuuOBmeOCi0hUTUzopoHntKBcclxuICAgICAqIEBwYXJhbSB7IEJhc2VDb250YWluZXJPcHRpb25zIH0gICAgICAgb3B0cyAgICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgKFN0YWNrQ29udGFpbmVyIHwgUGFuZWwpW10gfSBjaGlsZHJlbiAg5a2Q6KaB57SgKOOCueOCv+ODg+OCr+OBr+WFiOmgrTHjga7jgb/jg7vliJ3lm57otbfli5XmmYLjga7ov73liqDjga7jgb/oqLHlj68pXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChlbGVtZW50LCBvcHRzID0gQmFzZUNvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgT2JqZWN0LmFzc2lnbihvcHRzLCBCYXNlQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgey4uLm9wdHN9KSwgLi4uQmFzZUNvbnRhaW5lci5zYW5pdGl6ZUNoaWxkcmVuKGNoaWxkcmVuKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtd3JhcHBlcicpO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdveC1zJyk7XHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ295LXMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbm5lci5jbGFzc05hbWUgPSAnbWFnaWNhLXBhbmVsLWJhc2UnO1xyXG4gICAgICAgIGlmIChvcHRzLmFkZGl0aW9uYWxDbGFzc05hbWVzKSB0aGlzLmlubmVyLmNsYXNzTGlzdC5hZGQoLi4ub3B0cy5hZGRpdGlvbmFsQ2xhc3NOYW1lcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NldFJlc2l6ZUV2ZW10KGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oq44K144Kk44K644Kk44OZ44Oz44OI44KS6Kit5a6a44GX44G+44GZ44CCXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtIOOCpOODmeODs+ODiOOCv+ODvOOCsuODg+ODiFxyXG4gICAgICovXHJcbiAgICBfc2V0UmVzaXplRXZlbXQgKGVsZW0pIHtcclxuICAgICAgICB0aGlzLl9lbGVtcmVjdCA9IHt4OiBlbGVtLmNsaWVudFdpZHRoLCB5OiBlbGVtLmNsaWVudEhlaWdodH07XHJcbiAgICAgICAgY29uc3QgZGlzcGF0Y2hlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVsZW0uY2xpZW50V2lkdGggIT09IHRoaXMuX2VsZW1yZWN0LnhcclxuICAgICAgICAgICAgfHwgZWxlbS5jbGllbnRIZWlnaHQgIT09IHRoaXMuX2VsZW1yZWN0LnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1yZWN0ID0ge3g6IGVsZW0uY2xpZW50V2lkdGgsIHk6IGVsZW0uY2xpZW50SGVpZ2h0fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB0aGlzLl9lbGVtcmVjdH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChQYW5lbEJhc2Uud2luZG93LlJlc2l6ZU9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvID0gbmV3IFBhbmVsQmFzZS53aW5kb3cuUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcm8ub2JzZXJ2ZShlbGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGYgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBQYW5lbEJhc2Uud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGYoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOBrumFjeWIl+OBjOato+OBl+OBhOani+aIkOOBq+OBquOCi+OCiOOBhuOBq+aknOiovOODu+ODleOCo+ODq+OCv+OBl+OBvuOBmeOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNhbml0aXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBjaGlsZHJlbi5maW5kKGUgPT4gZS5vcHRzLnR5cGUgPT09ICdzdGFjaycpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGlmIChzdGFjaykgcmVzdWx0LnB1c2goc3RhY2spO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmNoaWxkcmVuLmZpbHRlcihlID0+IGUub3B0cy50eXBlID09PSAncGFuZWwnKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOBruenu+WLleOBq+i/veW+k+OBl+OBvuOBmeOAglxyXG4gICAgICovXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgfHwgdGhpcy5vcHRzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdHMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKGUgPT4gZS5yaWdodCArIHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0KSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlY3QucmlnaHQgPCBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke21heFggLSB0aGlzLmlubmVyLmNsaWVudExlZnR9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFJlY3QucmlnaHQgPiBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoZSA9PiBlLmJvdHRvbSArIHRoaXMuZWxlbWVudC5zY3JvbGxUb3ApKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVjdC5ib3R0b20gPCBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHttYXhZIC0gdGhpcy5pbm5lci5jbGllbnRUb3B9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFJlY3QuYm90dG9tID4gbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGlsZHJlbm1vdmUnLCB7ZGV0YWlsOiB7Li4uZXZ0LmRldGFpbCwgdGFyZ2V0OiBldnQudGFyZ2V0fX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVkSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2NoaWxkcmVubW92ZWQnLCB7ZGV0YWlsOiB7Li4uZXZ0LmRldGFpbCwgdGFyZ2V0OiBldnQudGFyZ2V0fX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1pbmltaXplZEhhbmRsZXIgKCkge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLWFycmF5LWZvci1lYWNoXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpLmZvckVhY2goKHZhbHVlLCBjb3VudGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3ZhbHVlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aCAqIGNvdW50ZXJ9cHhgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTm9ybWFsaXplZEhhbmRsZXIgKCkge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLWFycmF5LWZvci1lYWNoXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpLmZvckVhY2goKHZhbHVlLCBjb3VudGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3ZhbHVlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aCAqIGNvdW50ZXJ9cHhgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBWYWx1ZSBmcm9tICcuL3ZhbHVlcy5qcyc7XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQ29vcmRpbmF0aW9uT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyBudW1iZXIgfSB4IFjmlrnlkJEo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBudW1iZXIgfSB5IFnmlrnlkJEo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBSZXNpemVhYmxlT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gZW5hYmxlICAgICAgIOODpuODvOOCtuaTjeS9nOOBruacieWKueODu+eEoeWKuVxyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gc2hvd1RpdGxlYmFyIOmBqeeUqOaZguOBq+OCv+OCpOODiOODq+ODkOODvOOCkuihqOekuuOBmeOCi+OBi1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBQYW5lbE9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ3BhbmVsJyB9ICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlICAgICAgICAgICAgICAgIOODkeODjeODq+eoruWIpVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIG1pblNpemUgICAgICAgICAgICAg5pyA5bCP44Km44Kj44Oz44OJ44Km5YaF44Kz44Oz44OG44Oz44OE44K144Kk44K6KOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBtYXhTaXplICAgICAgICAgICAgIOacgOWkp+OCpuOCo+ODs+ODieOCpuWGheOCs+ODs+ODhuODs+ODhOOCteOCpOOCuijmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgcG9zaXRpb24gICAgICAgICAgICDliJ3mnJ/kvY3nva4o5bem5LiKKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIGRlZmF1bHRTaXplICAgICAgICAg5Yid5pyf44K144Kk44K6KDMyMHgyNDAsIOOCv+OCpOODiOODq+ODkOODvOOAgeOCpuOCo+ODs+ODieOCpuaeoOe3muWQq+OBvuOBmilcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIHwgSFRNTEVsZW1lbnQgfSAgICAgICAgICAgICB0aXRsZSAgICAgICAgICAgICAgIOOCv+OCpOODiOODq1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlYWJsZSAgICAgICAgICAg44OQ44OE44Oc44K/44Oz44KS5Ye654++44GV44Gb44KLXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW1hYmxlICAgICAgICAgICDmnIDlsI/ljJbjg5zjgr/jg7PjgpLlh7rnj77jgZXjgZvjgotcclxuICogQHByb3BlcnR5IHsgUmVzaXplYWJsZU9wdGlvbnMgfSAgICAgICAgICAgICAgICBtYXhpbXVtICAgICAgICAgICAgIOacgOWkp+WMluOBruaMmeWLlVxyXG4gKiBAcHJvcGVydHkgeyAnbW9kYWwnIHwgJ21vZGFsZXNzJyB8ICd0b3BNb3N0JyB9IG1vZGFsICAgICAgICAgICAgICAg44Oi44O844OA44Or6KGo56S654q25oWLXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ3Jlc2l6ZScgfCAnaGlkZGVuJyB9ICAgb3ZlcmZsb3dYICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxY6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ3Jlc2l6ZScgfCAnaGlkZGVuJyB9ICAgb3ZlcmZsb3dZICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxZ6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZSDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICogQHByb3BlcnR5IHsgYW55W10gfSAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzICAgICAgICAgIOS7u+aEj+OBq+aMh+WumuOBp+OBjeOCi+WxnuaAp1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiAgU3RhY2tDb250YWluZXJPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdzdGFjaycgfSAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyAgfSBkaXJlY3Rpb24gICAgICAgICAgIOWIhuWJsuaWueWQkVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlICAgICAgICAgICAg44Kz44Os44Kv44K344On44Oz5ZCE6KaB57Sg44Gu5Yid5pyf44K144Kk44K6XHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgcmVwcm9wb3J0aW9uYWJsZSAgICDjgrPjg6zjgq/jgrfjg6fjg7Pjga7mr5TnjofjgpLmk43kvZzjgafjgY3jgovjgYtcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICBkb2NrYWJsZSAgICAgICAgICAgIOOCs+ODrOOCr+OCt+ODp+ODs+OBruiEseedgOaTjeS9nOOBjOOBp+OBjeOCi+OBiyjjg6bjg7zjgrbmk43kvZzjgYvjgokpXHJcbiAqIEBwcm9wZXJ0eSB7IG51bWJlciB9ICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yV2lkdGggICAgICDliIblibLlooPnlYznt5rjga7luYUoMe+9nilcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIH0gICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lIOODkeODjeODq+OBq+i/veWKoOOBp+S7mOOBkeOCi+OCr+ODqeOCueWQjVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfCBIVE1MRWxlbWVudCB9ICAgICAgIHBhbmVsQWRkQXJlYSAgICAgICAg44K544K/44OD44Kv5YaF44GM56m644Gu44Go44GN44Gr6KGo56S644GV44KM44KL44OR44ON44Or6L+95Yqg44Ki44Kk44Kz44OzXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgYWRqdXN0U2l6ZSAgICAgICAgICDopqropoHntKDjg6rjgrXjgqTjgrrmmYLjgoTjgrPjg6zjgq/jgrfjg6fjg7Pjga7lopfmuJvmmYLjgavoh6rli5XnmoTjgavlkITjgrPjg6zjgq/jgrfjg6fjg7PjgpLjg6rjgrXjgqTjgrrjgZnjgovjgYtcclxuICogQHByb3BlcnR5IHsgYW55W10gfSAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzICAgICAgICAgIOS7u+aEj+OBq+aMh+WumuOBp+OBjeOCi+WxnuaAp1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBCYXNlQ29udGFpbmVyT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyAnYmFzZScgfSAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1ggICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxY6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1kgICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxZ6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZ1tdIH0gICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lcyDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbEJhc2UgZXh0ZW5kcyBFdmVudFRhcmdldFxyXG57XHJcbiAgICBzdGF0aWMgX2luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgc3RhdGljIHdpbmRvdztcclxuICAgIHN0YXRpYyBkb2N1bWVudDtcclxuICAgIHN0YXRpYyBDdXN0b21FdmVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB8IFN0YWNrUGFuZWxPcHRpb25zIHwgQmFzZUNvbnRhaW5lck9wdGlvbnMgfSBvcHRzXHJcbiAgICAgKiBAcGFyYW0geyAoUGFuZWxCYXNlIHwgSFRNTEVsZW1lbnQpW10gfSBjaGlsZHJlblxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm91dGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZVBhcmVudEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTWluaW1pemVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9yZXNpemVQYXJlbnRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVBhcmVudEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIC8vIOiHqui6q+imgee0oOOCkuWIneacn+WMluOBmeOCi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kKHRoaXMuX2lubmVyKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUgeyBQYW5lbEJhc2UgfCB1bmRlZmluZWQgfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoIVBhbmVsQmFzZS5faW5pdGlhbGl6ZWQpIFBhbmVsQmFzZS5pbml0KCk7XHJcbiAgICAgICAgUGFuZWxCYXNlLl9pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHsgUGFuZWxPcHRpb25zIHwgU3RhY2tQYW5lbE9wdGlvbnMgfCBCYXNlQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIGdldCBvcHRzICgpIHtcclxuICAgICAgICBjb25zdCB7dGl0bGUsIC4uLm90aGVyfSA9IHRoaXMuX29wdHM7XHJcbiAgICAgICAgY29uc3Qgb3B0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3RoZXIpKTtcclxuICAgICAgICBpZiAodGl0bGUpIG9wdHMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gb3B0cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZWxlbWVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlubmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qeL56+J44GZ44KL44Gf44KB44Gu5Yid5pyf5YyW44Oh44K944OD44OJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0ICgpIHtcclxuICAgICAgICBQYW5lbEJhc2UuYXBwZW5kU3R5bGVFbGVtZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K544K/44Kk44Or44KS44OY44OD44OA44Gr6L+95Yqg44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhcHBlbmRTdHlsZUVsZW1lbnRzICgpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gVmFsdWUuc3R5bGU7XHJcbiAgICAgICAgY29uc3QgcmVmID0gUGFuZWxCYXNlLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlLCBsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKTtcclxuICAgICAgICBpZiAocmVmKSB7XHJcbiAgICAgICAgICAgIFBhbmVsQmFzZS5kb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShzdHlsZSwgcmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFBhbmVsQmFzZS5kb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhcmVudCAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbG9zZScsIHRoaXMuX2Nsb3NlUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWw7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYXBwZW5kKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIHRoaXMuX2Nsb3NlUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGFuZ2VwYXJlbnQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcih1bmRlZmluZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZUhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1pbmltaXplZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTm9ybWFsaXplZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGFuZ2VwYXJlbnQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUgKHZhbCkge1xyXG4gICAgICAgICh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKGUgPT4gZSAhPT0gdmFsKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQgKHZhbCwgcmVmKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IHJlZj8ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmluc2VydEJlZm9yZSh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQsIG5leHQpO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudCkuZmluZEluZGV4KGUgPT4gZS5uZXh0RWxlbWVudFNpYmxpbmcgPT09IHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnNwbGljZShpZHggKyAxLCAwLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuYXBwZW5kKHZhbC5vdXRlciA/PyB2YWwuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlJywgdGhpcy5fY2hpbGRNb3ZlSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdmVkJywgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtaW5pbWl6ZWQnLCB0aGlzLl9jaGlsZE1pbmltaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdub3JtYWxpemVkJywgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VwYXJlbnQnLCB2YWwuX2NoYW5nZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlICgpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2Nsb3NlJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB0aGlzLl9wYXJlbnQubW9kaWZ5WkluZGV4KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGlmeVpJbmRleCAoYWN0aXZlKSB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93cyA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUub3B0cy50eXBlID09PSAncGFuZWwnKTtcclxuICAgICAgICBpZiAod2luZG93cy5pbmNsdWRlcyhhY3RpdmUpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSB3aW5kb3dzLmZpbHRlcihlID0+IGUgIT09IGFjdGl2ZSkuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEuZWxlbWVudC5zdHlsZS56SW5kZXggPz8gJzAnKSAtIE51bWJlcihiLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykpO1xyXG4gICAgICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICAgICAgZm9yICg7IGlkeCA8IHRhcmdldHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGFyZ2V0c1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gYCR7aWR4fWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZS5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxudHJ5IHtcclxuICAgIFBhbmVsQmFzZS53aW5kb3cgPSB3aW5kb3c7XHJcbiAgICBQYW5lbEJhc2UuZG9jdW1lbnQgPSBkb2N1bWVudDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG4gICAgUGFuZWxCYXNlLkhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuSW1hZ2UgPSBJbWFnZTtcclxufVxyXG5jYXRjaCB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkN1c3RvbUV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkhUTUxFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gdW5kZWZpbmVkO1xyXG59XHJcbiIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuaW1wb3J0IEJhc2VDb250YWluZXIgZnJvbSAnLi9iYXNlLWNvbnRhaW5lci5qcyc7XHJcblxyXG4vKipcclxuICogVUnjgpLmoLzntI3jgZnjgovjg5Hjg43jg6vjgqjjg6rjgqLjgILjgqbjgqPjg7Pjg4njgqbooajnpLrjg7vjgbvjgYvjg5Hjg43jg6vjgbjjga7moLzntI3jgYzlj6/og71cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBQYW5lbE9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdwYW5lbCcsXHJcbiAgICAgICAgcG9zaXRpb246IHt4OiAwLCB5OiAwfSxcclxuICAgICAgICBtaW5TaXplOiB7eDogMTIwLCB5OiAwfSxcclxuICAgICAgICBkZWZhdWx0U2l6ZToge3g6IDMyMCwgeTogMjQwfSxcclxuICAgICAgICB0aXRsZTogJycsXHJcbiAgICAgICAgY2xvc2VhYmxlOiB0cnVlLFxyXG4gICAgICAgIGF1dG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICBtaW5pbWFibGU6IHRydWUsXHJcbiAgICAgICAgbWF4aW11bToge2VuYWJsZTogdHJ1ZSwgc2hvd1RpdGxlYmFyOiB0cnVlfSxcclxuICAgICAgICBkZWZhdWx0TW9kZTogJ25vcm1hbCcsXHJcbiAgICAgICAgbW9kYWw6ICdtb2RhbGVzcycsXHJcbiAgICAgICAgb3ZlcmZsb3dYOiAnc2Nyb2xsJyxcclxuICAgICAgICBvdmVyZmxvd1k6ICdzY3JvbGwnLFxyXG4gICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWU6ICcnLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km44O744Oa44Kk44Oz6KGo56S644GM5Y+v6IO9XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgUGFuZWxPcHRpb25zIH0gICAgICAgICAgICBvcHRzICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfCBQYW5lbEJhc2UgfSBjb250ZW50IOWGheWuueOCs+ODs+ODhuODs+ODhFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3B0cyA9IFBhbmVsLkRFRkFVTFRfT1BUSU9OUywgY29udGVudCkge1xyXG4gICAgICAgIHN1cGVyKFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgT2JqZWN0LmFzc2lnbihvcHRzLCBQYW5lbC5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIGNvbnRlbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXdpbmRvdycpO1xyXG4gICAgICAgIHRoaXMuaW5uZXIuY2xhc3NOYW1lID0gJ21hZ2ljYS1wYW5lbC1pbm5lcic7XHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveC1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmNsYXNzTGlzdC5hZGQoJ295LXMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmRlZmF1bHRNb2RlID09PSAnbm9ybWFsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS53aWR0aCA9IGAke29wdHMuZGVmYXVsdFNpemUueH1weGA7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLnN0eWxlLmhlaWdodCA9IGAke29wdHMuZGVmYXVsdFNpemUueX1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFBhbmVsQmFzZS5IVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCv+OCpOODiOODq+ODkOODvOOCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IHRpdGxlYmFyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cz8udGl0bGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gb3B0cy50aXRsZTtcclxuICAgICAgICAgICAgdGl0bGViYXIuYXBwZW5kKHNwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3B0cz8udGl0bGUgPT09ICdvYmplY3QnICYmIG9wdHMudGl0bGUgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGl0bGViYXIuYXBwZW5kKG9wdHMudGl0bGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhciA9IHRpdGxlYmFyO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRpdGxlYmFyLCB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC10aXRsZWJhcicpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1heGltdW0uc2hvd1RpdGxlYmFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGViYXIuY2xhc3NMaXN0LmFkZCgnbWF4aW11bS1kaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpO1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IFBhbmVsQmFzZS5JbWFnZSgpLCAwLCAwKTtcclxuICAgICAgICAgICAgZXYuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCAncGFuZWwnKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2FkZFJlc2l6ZUFyZWEoKTtcclxuXHJcbiAgICAgICAgLy8g44Oc44K/44Oz44Ko44Oq44Ki44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgYnV0dG9uYXJlYSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBidXR0b25hcmVhLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24tYXJlYScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoYnV0dG9uYXJlYSk7XHJcblxyXG4gICAgICAgIC8vIOmWieOBmOOCi+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IGNsb3NlYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNsb3NlYnV0dG9uLnRleHRDb250ZW50ID0gJ8OXJztcclxuICAgICAgICBjbG9zZWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uJywgJ2Nsb3NlJyk7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdHMuY2xvc2VhYmxlKSB7XHJcbiAgICAgICAgICAgIGNsb3NlYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJ1dHRvbmFyZWEuYXBwZW5kKGNsb3NlYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5aSn5YyWL+W+qeWFg+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IG1heGltdW1idXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi50ZXh0Q29udGVudCA9ICfinZAnO1xyXG4gICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdtYXhpbXVtJyk7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21heGltdW0nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF4aW11bSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1heGltdW0uZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xvc2VidXR0b24uYmVmb3JlKG1heGltdW1idXR0b24pO1xyXG5cclxuICAgICAgICAvLyDmnIDlsI/ljJYv5b6p5YWD44Oc44K/44Oz44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgbWluaW11bWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLnRleHRDb250ZW50ID0gJy0nO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdtaW5pbXVtJyk7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWluaW11bSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1pbmltYWJsZSkge1xyXG4gICAgICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1heGltdW1idXR0b24uYmVmb3JlKG1pbmltdW1idXR0b24pO1xyXG5cclxuICAgICAgICAvLyDjg6Ljg7zjg4Djg6tcclxuICAgICAgICBpZiAodGhpcy5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b3Btb3N0Jyk7XHJcbiAgICAgICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5vcHRzLnBvc2l0aW9uLnh9cHhgO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLm9wdHMucG9zaXRpb24ueX1weGA7XHJcbiAgICAgICAgdGhpcy5hZGp1c3RXaW5kb3dQb3NpdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9hZGRSZXNpemVBcmVhICgpIHtcclxuICAgICAgICAvLyDjg6rjgrXjgqTjgrrpoJjln5/jgpLov73liqBcclxuICAgICAgICB0aGlzLmVkZ2VzID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgW1sndG9wJ10sIFsnYm90dG9tJ10sIFsnbGVmdCddLCBbJ3JpZ2h0J10sIFsndG9wJywgJ2xlZnQnXSwgWyd0b3AnLCAncmlnaHQnXSwgWydib3R0b20nLCAnbGVmdCddLCBbJ2JvdHRvbScsICdyaWdodCddXSkge1xyXG4gICAgICAgICAgICBjb25zdCBlZGdlID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBlZGdlLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1lZGdlJywgLi4udGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChlZGdlKTtcclxuICAgICAgICAgICAgZWRnZS5kcmFnZ2FibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVBcmVhSGFuZGxlcihldik7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4gZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgSW1hZ2UoKSwgMCwgMCksIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5lZGdlc1t0YXJnZXRdID0gZWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9yZXNpemVBcmVhSGFuZGxlciAoZXYpIHtcclxuICAgICAgICBpZiAoZXYudHlwZSA9PT0gJ21vdXNlZG93bicgfHwgZXYudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCwgeTogZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWX07XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0cmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldi50eXBlID09PSAnZHJhZydcclxuICAgICAgICB8fCBldi50eXBlID09PSAndG91Y2htb3ZlJykge1xyXG4gICAgICAgICAgICBpZiAoKGV2LnNjcmVlblkgPz8gZXYudG91Y2hlcz8uWzBdPy5zY3JlZW5ZKSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvcCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fc3RhcnRyZWN0LmhlaWdodCArIHRoaXMuX2NsaWNrc3RhcnQueSAtIChldi5wYWdlWSA/PyBldi50b3VjaGVzWzBdLnBhZ2VZKSAtIDEwO1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxUb3AgKyB0aGlzLl9zdGFydHJlY3QuYm90dG9tIC0gaGVpZ2h0IC0gdGhpcy50aXRsZWJhci5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3N0YXJ0cmVjdC5oZWlnaHQgKyAoZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWSkgLSB0aGlzLl9jbGlja3N0YXJ0LnkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyB0aGlzLl9jbGlja3N0YXJ0LnggLSAoZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggPD0gdGhpcy5vcHRzLm1pblNpemUueD8gdGhpcy5vcHRzLm1pblNpemUueDogd2lkdGggPj0gKHRoaXMub3B0cy5tYXhTaXplPy54ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueDogd2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIHRoaXMuX3N0YXJ0cmVjdC5yaWdodCAtIHdpZHRofXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3N0YXJ0cmVjdC53aWR0aCArIChldi5wYWdlWCA/PyBldi50b3VjaGVzWzBdLnBhZ2VYKSAtIHRoaXMuX2NsaWNrc3RhcnQueCAtIDEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRoIDw9IHRoaXMub3B0cy5taW5TaXplLng/IHRoaXMub3B0cy5taW5TaXplLng6IHdpZHRoID49ICh0aGlzLm9wdHMubWF4U2l6ZT8ueCA/PyBJbmZpbml0eSk/IHRoaXMub3B0cy5tYXhTaXplLng6IHdpZHRofXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKioqXHJcbiAgICAgKiBAcGFyYW0geyBNb3VzZUV2ZW50IH0gZXZcclxuICAgICAqL1xyXG4gICAgX21vdmVUaXRsZWJhckhhbmRsZXIgKGV2KSB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBCYXNlQ29udGFpbmVyKVxyXG4gICAgICAgIHx8IHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAndG91Y2hzdGFydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBldi50YXJnZXQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYub2Zmc2V0WCA/PyAoZXYudG91Y2hlc1swXS5wYWdlWCAtIHJlY3QubGVmdCksIHk6IGV2Lm9mZnNldFkgPz8gKGV2LnRvdWNoZXNbMF0ucGFnZVkgLSByZWN0LnRvcCl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNobW92ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhdGVzdFRvdWNoRXYgPSBldjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAnZHJhZyc6IHtcclxuICAgICAgICAgICAgICAgIGlmICgoZXYuc2NyZWVuWSA/PyBldi50b3VjaGVzPy5bMF0/LnNjcmVlblkpID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgpKSAtIHRoaXMuX2NsaWNrc3RhcnQueH1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7KHRoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVkpKSAtIHRoaXMuX2NsaWNrc3RhcnQueX1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZScsIHtkZXRhaWw6IHtyZWN0OiB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSwgZXYsIHRhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAndG91Y2hlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICBldiA9IHRoaXMuX2xhdGVzdFRvdWNoRXY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZWQnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0V2luZG93UG9zaXRpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXTtcclxuICAgICAgICBpZiAoIWN1cnJlbnRSZWN0IHx8ICF0aGlzLnBhcmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQgPiB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgJiYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCkgPCBjdXJyZW50UmVjdC5ib3R0b20pIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCAtIHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoID4gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgICAgICAgJiYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoKSA8IGN1cnJlbnRSZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50V2lkdGggLSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGh9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRSZWN0LmxlZnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFJlY3QudG9wIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1heGltdW0gKCkge1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXT8ubGVmdCA/PyAwO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21heGltdW0nKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsICh4KSB7XHJcbiAgICAgICAgbGV0IHJhdGlvID0gMDtcclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgcmF0aW8gPSAoeCAtIHJlY3QubGVmdCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21pbmltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF4aW11bScpO1xyXG5cclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHcgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NsaWNrc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQueCA9IHcgKiByYXRpbztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtNYXRoLnJvdW5kKHggLSAodyAqIHJhdGlvKSl9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9sZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5fbGVmdH1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbm9ybWFsaXplZCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBtaW5pbXVtICgpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0/LmxlZnQgPz8gMDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF4aW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21pbmltaXplZCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKF9ldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21heGltdW0nKSAmJiAhdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0V2luZG93UG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBzdXBlci5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2dCk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5tb2RhbCA9PT0gJ21vZGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1tb2RhbC1ibG9ja2VyJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLm91dGVyLCB0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChyZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGBjYWxjKDUwJSAtICR7cmVjdC53aWR0aCAvIDJ9cHgpYDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgY2FsYyg1MCUgLSAke3JlY3QuaGVpZ2h0IC8gMn1weClgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFBhbmVsQmFzZSBmcm9tICcuL3BhbmVsLWJhc2UuanMnO1xyXG5cclxuLyoqXHJcbiAqIOWeguebtOOBvuOBn+OBr+awtOW5s+aWueWQkeOBuOOBruaVtOWIl+OChOOCv+ODluWIh+OCiuabv+OBiOOBq+OCiOOCi+ODkeODjeODq+OBruOCueOCpOODg+ODgSgz5YCL44Gu44GG44Gh44GE44Ga44KM44GLMeOBpCnjgpLmj5DkvpvjgZfjgb7jgZnjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWNrQ29udGFpbmVyIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBTdGFja0NvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdzdGFjaycsXHJcbiAgICAgICAgZGlyZWN0aW9uOiAndmVydGljYWwnLFxyXG4gICAgICAgIHJlcHJvcG9ydGlvbmFibGU6IHRydWUsXHJcbiAgICAgICAgZG9ja2FibGU6IHRydWUsXHJcbiAgICAgICAgc2VwYXJhdG9yV2lkdGg6IDIsXHJcbiAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZTogJycsXHJcbiAgICAgICAgYXR0cmlidXRlczogW10sXHJcbiAgICAgICAgdGVtcGxhdGU6IHVuZGVmaW5lZCxcclxuICAgICAgICBwYW5lbEFkZEFyZWE6IHVuZGVmaW5lZCxcclxuICAgICAgICBhZGp1c3RTaXplOiB0cnVlLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km44O744Oa44Kk44Oz6KGo56S644GM5Y+v6IO9XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgU3RhY2tDb250YWluZXJPcHRpb25zIH0gICAgICBvcHRzICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgKFN0YWNrQ29udGFpbmVyIHwgUGFuZWwpW10gfSBjaGlsZHJlbiDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9wdHMgPSBTdGFja0NvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3VwZXIoUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBPYmplY3QuYXNzaWduKG9wdHMsIFN0YWNrQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgey4uLm9wdHN9KSwgLi4uY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRzLmFkanVzdFNpemUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMub3B0cy50ZW1wbGF0ZSk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyJyk7XHJcbiAgICAgICAgdGhpcy5pbm5lci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2staW5uZXInKTtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvcml6b250YWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3RhYicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZGFyZWFzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYWRkQXJlYSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgYWRkQXJlYS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yJywgJ2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzLnBhbmVsQWRkQXJlYSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGFkZEFyZWEuYXBwZW5kKHRoaXMub3B0cy5wYW5lbEFkZEFyZWEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRkQXJlYS50ZXh0Q29udGVudCA9IHRoaXMub3B0cy5wYW5lbEFkZEFyZWEgPz8gdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ+KWpCcgOiAn4palJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRhcmVhcy5wdXNoKGFkZEFyZWEpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGFkZEFyZWEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbW92ZWhhbmRsZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW91c2VZID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2dC5kZXRhaWwuZXYucGFnZVkgPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VYID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldnQuZGV0YWlsLmV2LnBhZ2VYID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1SZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChlbGVtUmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgZWxlbVJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICYmIGVsZW1SZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgZWxlbVJlY3QucmlnaHRcclxuICAgICAgICAgICAgJiYgZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tYXhpbXVtLmVuYWJsZSA9PT0gdHJ1ZSAmJiB0aGlzLm9wdHMuZG9ja2FibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWRkYXJlYSBvZiB0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gYWRkYXJlYS5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlY3QgJiYgcmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgcmVjdC5ib3R0b21cclxuICAgICAgICAgICAgICAgICYmIHJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCByZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fbW92ZWRoYW5kbGVyID0gZXZ0ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubW9kYWwgIT09ICdtb2RhbGVzcycpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWSA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbFRvcCArIChldnQuZGV0YWlsLmV2LnBhZ2VZID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWCA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbExlZnQgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWCA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVgpO1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAoZWxlbVJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IGVsZW1SZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAmJiBlbGVtUmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IGVsZW1SZWN0LnJpZ2h0XHJcbiAgICAgICAgICAgICYmIGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubWF4aW11bS5lbmFibGUgPT09IHRydWUgJiYgdGhpcy5vcHRzLmRvY2thYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGFyZWEgb2YgdGhpcy5hZGRhcmVhcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPT09IGFkZGFyZWEucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nID09PSBhZGRhcmVhLnBhcmVudEVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB8fCBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgIT09IHRoaXMucm9vdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGFkZGFyZWEuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVjdCAmJiByZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCByZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgICYmIHJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCByZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RyZWYgPSB0aGlzLmVsZW1lbnQuY29udGFpbnMoYWRkYXJlYS5jbG9zZXN0KCcubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyJykpPyBhZGRhcmVhLnBhcmVudEVsZW1lbnQ6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LmRldGFpbC50YXJnZXQucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnBhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcGFyZW50ICh2YWwpIHtcclxuICAgICAgICBzdXBlci5wYXJlbnQgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFyZW50SGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgc3VwZXIuY2hhbmdlUGFyZW50SGFuZGxlcihldnQpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlJywgdGhpcy5fbW92ZWhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmVkJywgdGhpcy5fbW92ZWRoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290LmFkZEV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZScsIHRoaXMuX21vdmVoYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5yb290LmFkZEV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZWQnLCB0aGlzLl9tb3ZlZGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gdGhpcy5yb290O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQgKHZhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5hZGRhcmVhcykgdGhpcy5hZGRhcmVhcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmlubmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZXAgPSB0aGlzLl9nZW5lcmF0ZVNlcGFyYXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goc2VwLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoc2VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5nZXMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSkge1xyXG4gICAgICAgICAgICBjb25zdCB3aW5kb3dSYW5nZSA9IHRoaXMuX2xhc3RUYXJnZXRSYW5nZTtcclxuICAgICAgICAgICAgcmFuZ2VzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddID8/IGUub3B0cz8uZGVmYXVsdFNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddID8/IDEwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGFzdHJlZikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmluZGV4T2YodGhpcy5fbGFzdHJlZi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydFRhcmdldFJhbmdlID0gKChyYW5nZXNbaWR4XSA/PyAwKSArIChyYW5nZXNbaWR4ICsgMV0gPz8gMCkpIC8gMjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydFJhbmdlID0gTWF0aC5taW4oaW5zZXJ0VGFyZ2V0UmFuZ2UsIHdpbmRvd1JhbmdlKSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICh+aWR4ICYmIHJhbmdlc1tpZHggKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzbWFsbElkeCwgbGFyZ2VJZHhdID0gcmFuZ2VzW2lkeF0gPiByYW5nZXNbaWR4ICsgMV0/IFtpZHggKyAxLCBpZHhdOiBbaWR4LCBpZHggKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IHJhbmdlc1tzbWFsbElkeF0gLyByYW5nZXNbbGFyZ2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNtYWxsU2l6ZSA9IE1hdGgucm91bmQoaW5zZXJ0UmFuZ2UgLyAyICogcmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tzbWFsbElkeF0gLT0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tsYXJnZUlkeF0gLT0gKGluc2VydFJhbmdlIC0gc21hbGxTaXplKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKH5pZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZXNbaWR4XSAtPSBpbnNlcnRSYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggKyAxXSAtPSBpbnNlcnRSYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByYW5nZXMuc3BsaWNlKGlkeCArIDEsIDAsIGluc2VydFJhbmdlIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmFwcGVuZCh2YWwsIHRoaXMuX2xhc3RyZWYpO1xyXG4gICAgICAgIGlmICh2YWwubWF4aW11bSkgdmFsLm1heGltdW0oKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VwID0gdGhpcy5fZ2VuZXJhdGVTZXBhcmF0b3IoKTtcclxuICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goc2VwLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICBpZiAodmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuaW5zZXJ0QmVmb3JlKHNlcCwgdmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuYXBwZW5kKHNlcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSAmJiB0aGlzLm9wdHMuYWRqdXN0U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcy5sZW5ndGggPT09IDA/IHVuZGVmaW5lZDogcmFuZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByYW5nZXMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pLmZpbHRlcihlID0+IGUgIT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSByYW5nZXMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCk7XHJcbiAgICAgICAgY29uc3QgcmF0aW9zID0gcmFuZ2VzLm1hcChlID0+IGUgLyB0b3RhbCk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFdpZHRoID0gdGhpcy5pbm5lci5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSAtICh0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGggKiAodGhpcy5jaGlsZHJlbi5sZW5ndGggKyAxKSk7XHJcbiAgICAgICAgcmFuZ2VzID0gcmF0aW9zLm1hcChlID0+IE1hdGgucm91bmQoZSAqIGN1cnJlbnRXaWR0aCkpO1xyXG4gICAgICAgIHJhbmdlcy5wb3AoKTtcclxuICAgICAgICByYW5nZXMucHVzaChjdXJyZW50V2lkdGggLSByYW5nZXMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCkpO1xyXG4gICAgICAgIHJhbmdlcyA9IHJhbmdlcy5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgaWYgKHJhbmdlcy5sZW5ndGggPiAwICYmIHRoaXMub3B0cy5hZGp1c3RTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUgKHZhbCkge1xyXG4gICAgICAgIGxldCByYW5nZXMgPSB0eXBlb2YgdGhpcy5fbGFzdFRhcmdldFJhbmdlID09PSAnb2JqZWN0Jz8gdGhpcy5fbGFzdFRhcmdldFJhbmdlOiB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pO1xyXG4gICAgICAgIGlmIChyYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YodmFsKTtcclxuICAgICAgICAgICAgaWYgKCFyYW5nZXNbaWR4IC0gMV0gJiYgcmFuZ2VzW2lkeCArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbaWR4ICsgMV0gKz0gcmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIXJhbmdlc1tpZHggKyAxXSAmJiByYW5nZXNbaWR4IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggLSAxXSArPSByYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyYW5nZXNbaWR4ICsgMV0gJiYgcmFuZ2VzW2lkeCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbc21hbGxJZHgsIGxhcmdlSWR4XSA9IHJhbmdlc1tpZHggLSAxXSA+IHJhbmdlc1tpZHggKyAxXT8gW2lkeCArIDEsIGlkeCAtIDFdOiBbaWR4IC0gMSwgaWR4ICsgMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IHJhbmdlc1tzbWFsbElkeF0gLyByYW5nZXNbbGFyZ2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc21hbGxTaXplID0gTWF0aC5yb3VuZCgocmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC8gMiAqIHJhdGlvKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tzbWFsbElkeF0gKz0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2xhcmdlSWR4XSArPSAocmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByYW5nZXMgPSByYW5nZXMuZmlsdGVyKChfZSwgaSkgPT4gaSAhPT0gaWR4KS5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbW92ZSh2YWwpO1xyXG4gICAgICAgIGlmICh0aGlzLmlubmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLmZpbHRlcihlID0+IGUgIT09IHRoaXMuaW5uZXIuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmNoaWxkcmVuWzBdLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuYWRqdXN0U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcz8ubGVuZ3RoID09PSAwPyB1bmRlZmluZWQ6IHJhbmdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9jYWxjR3JpZFNpemUgKHNlcCwgcG9zLCB0ZW1wbGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdncmlkVGVtcGxhdGVSb3dzJzogJ2dyaWRUZW1wbGF0ZUNvbHVtbnMnO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTaXplcyA9IHRlbXBsYXRlID8/IHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XS5zcGxpdCgnICcpLmZpbHRlcihlID0+IGUgIT09ICcnKS5maWx0ZXIoKF9lLCBpKSA9PiBpICUgMiAhPT0gMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XSA9ICcnO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY3VycmVudFNpemVzWzBdID0gJzFmcic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VwICYmIHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHNlcC5uZXh0RWxlbWVudFNpYmxpbmcgJiYgcG9zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgYnJvcyA9IEFycmF5LmZyb20odGhpcy5pbm5lci5jaGlsZHJlbikuZmlsdGVyKGUgPT4gIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yJykpO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2SWR4ID0gYnJvcy5pbmRleE9mKHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dElkeCA9IGJyb3MuaW5kZXhPZihzZXAubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldlJlY3QgPSBzZXAucHJldmlvdXNFbGVtZW50U2libGluZy5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0UmVjdCA9IHNlcC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcmV2UmFuZ2UgPSBwb3MgLSAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gcHJldlJlY3QudG9wOiBwcmV2UmVjdC5sZWZ0IC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKTtcclxuICAgICAgICAgICAgbGV0IGZyRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAocHJldlJhbmdlIDw9IDAgJiYgdGhpcy5jaGlsZHJlbltwcmV2SWR4XS5vcHRzLm1pbmltYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgZnJGbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1twcmV2SWR4XSA9ICcwcHgnO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gYCR7bmV4dFJlY3RbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2JvdHRvbSc6ICdyaWdodCddIC0gcHJldlJlY3RbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3RvcCc6ICdsZWZ0J10gLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJldlJhbmdlID0gdGhpcy5jaGlsZHJlbltwcmV2SWR4XS5vcHRzLm1pblNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddID4gcHJldlJhbmdlID8gdGhpcy5jaGlsZHJlbltwcmV2SWR4XS5vcHRzLm1pblNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddIDogcHJldlJhbmdlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV4dFJhbmdlID0gKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IG5leHRSZWN0LmJvdHRvbTogbmV4dFJlY3QucmlnaHQpIC0gKCh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBwcmV2UmVjdC50b3A6IHByZXZSZWN0LmxlZnQpICsgcHJldlJhbmdlICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgaWYgKG5leHRSYW5nZSA8PSAwICYmIHRoaXMuY2hpbGRyZW5bbmV4dElkeF0ub3B0cy5taW5pbWFibGUgJiYgIWZyRmxhZykge1xyXG4gICAgICAgICAgICAgICAgZnJGbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1twcmV2SWR4XSA9IGAke25leHRSZWN0W3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdib3R0b20nOiAncmlnaHQnXSAtIHByZXZSZWN0W3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd0b3AnOiAnbGVmdCddIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4YDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9ICcwcHgnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV4dFJhbmdlID0gdGhpcy5jaGlsZHJlbltuZXh0SWR4XS5vcHRzLm1pblNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddID4gbmV4dFJhbmdlID8gdGhpcy5jaGlsZHJlbltuZXh0SWR4XS5vcHRzLm1pblNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddIDogbmV4dFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgcHJldlJhbmdlID0gbmV4dFJlY3RbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2JvdHRvbSc6ICdyaWdodCddIC0gcHJldlJlY3RbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3RvcCc6ICdsZWZ0J10gLSBuZXh0UmFuZ2UgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZnJGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1twcmV2SWR4XSA9IGAke3ByZXZSYW5nZX1weGA7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gYCR7bmV4dFJhbmdlfXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1twcmV2SWR4XSA9IGAke3ByZXZSYW5nZX1weGA7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gYCR7bmV4dFJhbmdlfXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGlkeCsrKSBpZiAoY3VycmVudFNpemVzW2lkeF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjdXJyZW50U2l6ZXMucHVzaCgnMWZyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50U2l6ZXMuc3BsaWNlKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0gPSBgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHggJHtjdXJyZW50U2l6ZXMuam9pbihgICR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4IGApfSAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICB9XHJcblxyXG4gICAgX2dlbmVyYXRlU2VwYXJhdG9yICgpIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtLnN0eWxlW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSA9IGAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgZWxlbS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IGlubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlubmVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEnKTtcclxuICAgICAgICBlbGVtLmFwcGVuZChpbm5lcik7XHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldi5zY3JlZW5ZID09PSAwIHx8IHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKGV2LnRhcmdldCwgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gZXYucGFnZVkgOiBldi5wYWdlWCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXYudG91Y2hlc1swXT8uc2NyZWVuWSA9PT0gMCB8fCB0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZShldi50YXJnZXQsIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IGV2LnRvdWNoZXNbMF0ucGFnZVkgOiBldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pO1xyXG4gICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0Lm5vcm1hbCgoZXZ0LmRldGFpbC5ldi5wYWdlWCA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVgpKTtcclxuICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgPSB0aGlzLnJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHJvb3QgKCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudD8ucGFyZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc3Qgc3R5bGUgPSBgXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlciB7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYmFzZSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBtaW4td2lkdGg6IDEwMCU7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93IHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXRpdGxlYmFyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGhlaWdodDogMS41cmVtO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxuICAgIG1hcmdpbi1yaWdodDogY2FsYygyLjVyZW0gKiAzKTtcclxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB+IC5tYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC10aXRsZWJhciA+ICoge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgcGFkZGluZzogMXB4O1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UubGVmdCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UucmlnaHQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5sZWZ0OmFjdGl2ZSxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnJpZ2h0OmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tIHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3A6YWN0aXZlLFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tOmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5sZWZ0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLnJpZ2h0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLmxlZnQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ucmlnaHQge1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgdG9wOiB1bnNldDtcclxuICAgIGxlZnQ6IHVuc2V0O1xyXG4gICAgcmlnaHQ6IHVuc2V0O1xyXG4gICAgYm90dG9tOiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5sZWZ0IHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBjdXJzb2w6IG53c2UtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLnJpZ2h0IHtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgY3Vyc29sOiBuZXN3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5sZWZ0IHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBjdXJzb2w6IG5lc3ctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLnJpZ2h0IHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgY3Vyc29sOiBud3NlLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSB7XHJcbiAgICBwYWRkaW5nOiAwcHg7XHJcbiAgICB0b3A6IDAgIWltcG9ydGFudDtcclxuICAgIGxlZnQ6IDAgIWltcG9ydGFudDtcclxuICAgIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSAubWFnaWNhLXBhbmVsLWVkZ2Uge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSAubWFnaWNhLXBhbmVsLXRpdGxlYmFyIHtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICB3aWR0aDogY2FsYygxMDAlIC0gMnB4KSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAxLjVyZW0gLSA2cHgpICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB+IC5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAycHgpICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1pbmltdW0ge1xyXG4gICAgd2lkdGg6IDE4NnB4O1xyXG4gICAgYm90dG9tOiAwICFpbXBvcnRhbnQ7XHJcbiAgICB0b3A6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93LnRvcG1vc3Qge1xyXG4gICAgei1pbmRleDogNjU1MzUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1tb2RhbC1ibG9ja2VyIHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsLjUpO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgei1pbmRleDogNjU1MzUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSA+IC5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSA+IC5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi1hcmVhIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbiB7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgd2lkdGg6IDIuNXJlbTtcclxuICAgIGZvbnQtc2l6ZTogMXJlbTtcclxuICAgIGJhY2tncm91bmQ6IG1pZG5pZ2h0Ymx1ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uZGVueSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5jbG9zZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjNzAxOTE5O1xyXG59XHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmNsb3NlLm9uYWN0aXZlIHtcclxuICAgIGJhY2tncm91bmQ6ICNlNjMyMzI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlciB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHotaW5kZXg6IDA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBtaWRuaWdodGJsdWU7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHotaW5kZXg6IDEwMDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5lbXB0eSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgZm9udC1zaXplOiAzcmVtO1xyXG4gICAgd2lkdGg6IDVyZW07XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1LDI1LDExMiwgMC4zKTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwcmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBsZWZ0OiAtNXJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Zmlyc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBsZWZ0OiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpsYXN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMHJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHRvcDogLTVyZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpmaXJzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHRvcDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmxhc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICB0b3A6IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5ob3Zlcik6Tk9UKC5kaXNhYmxlKTpOT1QoOmZpcnN0LW9mLXR5cGUpOk5PVCg6bGFzdC1vZi10eXBlKTpob3ZlciB7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5ob3Zlcik6Tk9UKC5kaXNhYmxlKTpOT1QoOmZpcnN0LW9mLXR5cGUpOk5PVCg6bGFzdC1vZi10eXBlKTpob3ZlciB7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguZW1wdHkpIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIuZW1wdHkgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuZW1wdHkge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3ZlciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuaG92ZXIge1xyXG4gICAgb3BhY2l0eTogMTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsIC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsIC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0b3A6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICBsZWZ0IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICB6LWluZGV4OiB1bnNldCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtYnV0dG9uLm1heGltdW0ge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLWJ1dHRvbi5taW5pbXVtIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuYDtcclxuXHJcbmNvbnN0IFZhbHVlID0ge1xyXG4gICAgc3R5bGUsXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKFZhbHVlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZhbHVlO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBiYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5pbXBvcnQgcGFuZWwgZnJvbSAnLi9wYW5lbC5qcyc7XHJcbmltcG9ydCBzdGFja0NvbnRhaW5lciBmcm9tICcuL3N0YWNrLWNvbnRhaW5lci5qcyc7XHJcblxyXG5leHBvcnQgY29uc3QgQmFzZUNvbnRhaW5lciA9IGJhc2VDb250YWluZXI7XHJcbmV4cG9ydCBjb25zdCBQYW5lbCA9IHBhbmVsO1xyXG5leHBvcnQgY29uc3QgU3RhY2tDb250YWluZXIgPSBzdGFja0NvbnRhaW5lcjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgQmFzZUNvbnRhaW5lcixcclxuICAgIFBhbmVsLFxyXG4gICAgU3RhY2tDb250YWluZXIsXHJcbn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==