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
    };

    /**
     * UIを格納するパネルエリア。ウィンドウ・ペイン表示が可能
     *
     * @param { StackContainerOptions }      opts    オプション
     * @param { (StackContainer | Panel)[] } children 内容コンテンツ
     */
    constructor (opts = StackContainer.DEFAULT_OPTIONS, ...children) {
        super(_panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div'), Object.assign(opts, StackContainer.DEFAULT_OPTIONS, {...opts}), ...children);

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
        if (this.element.closest('body')) {
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
        if (ranges.length > 0) {
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

        this._calcGridSize(undefined, undefined, ranges?.length === 0? undefined: ranges);
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

            if (this.opts.direction === 'vertical') {
                currentSizes[prevIdx] = `${pos - prevRect.top - 1}px`;
                currentSizes[nextIdx] = `${nextRect.bottom - pos - 1}px`;
            }
            else if (this.opts.direction === 'horizontal') {
                currentSizes[prevIdx] = `${pos - prevRect.left - 1}px`;
                currentSizes[nextIdx] = `${nextRect.right - pos - 1}px`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxFQUFFO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGtFQUFxQixZQUFZLFNBQVMsY0FBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyx1QkFBdUI7QUFDbEUsMkNBQTJDLDBCQUEwQjtBQUNyRTtBQUNBO0FBQ0EsMkNBQTJDLHdCQUF3QjtBQUNuRSwyQ0FBMkMseUJBQXlCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0QkFBNEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLEtBQUssc0JBQXNCLHlCQUF5QixPQUFPLEVBQUUseUJBQXlCO0FBQ3JKO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2RUFBZ0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFQUErRSx5QkFBeUI7QUFDeEc7QUFDQSxzQkFBc0IsNkVBQWdDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsS0FBSyxFQUFDOzs7Ozs7O1VDdllyQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZ0Q7QUFDakI7QUFDbUI7QUFDbEQ7QUFDTyxzQkFBc0IsMERBQWE7QUFDbkMsY0FBYyxpREFBSztBQUNuQix1QkFBdUIsMkRBQWM7QUFDNUMsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvYmFzZS1jb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvcGFuZWwtYmFzZS5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9wYW5lbC5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9zdGFjay1jb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvdmFsdWVzLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTWFnaWNhUGFuZWxcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTWFnaWNhUGFuZWxcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFBhbmVsQmFzZSBmcm9tICcuL3BhbmVsLWJhc2UuanMnO1xyXG5cclxuLyoqXHJcbiAqIOOBmeOBueOBpuOBruimquOBqOOBquOCi+imgee0oOOAguODhOODquODvOS4iuOBqzHjgaTkuIDnlaropqrjgavjga7jgb/liKnnlKjjgafjgY3jgovjgIJcclxuICog44Km44Kj44Oz44OJ44Km44Gv44GT44Gu5Lit44GX44GL56e75YuV44Gn44GN44Gq44GE44CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQ29udGFpbmVyIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBCYXNlQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICAgICAgdHlwZTogJ2Jhc2UnLFxyXG4gICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXHJcbiAgICAgICAgb3ZlcmZsb3dZOiAnc2Nyb2xsJyxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgZnjgbnjgabjga7opqrjgajjgarjgovopoHntKDjgIJcclxuICAgICAqIEBwYXJhbSB7IEhUTUxFbGVtZW50IH0gICAgICAgICAgICAgICAgZWxlbWVudCAgIOiHqui6q+OCkuihqOekuuOBmeOCi0hUTUzopoHntKBcclxuICAgICAqIEBwYXJhbSB7IEJhc2VDb250YWluZXJPcHRpb25zIH0gICAgICAgb3B0cyAgICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgKFN0YWNrQ29udGFpbmVyIHwgUGFuZWwpW10gfSBjaGlsZHJlbiAg5a2Q6KaB57SgKOOCueOCv+ODg+OCr+OBr+WFiOmgrTHjga7jgb/jg7vliJ3lm57otbfli5XmmYLjga7ov73liqDjga7jgb/oqLHlj68pXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChlbGVtZW50LCBvcHRzID0gQmFzZUNvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgT2JqZWN0LmFzc2lnbihvcHRzLCBCYXNlQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgey4uLm9wdHN9KSwgLi4uQmFzZUNvbnRhaW5lci5zYW5pdGl6ZUNoaWxkcmVuKGNoaWxkcmVuKSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtd3JhcHBlcicpO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdveC1zJyk7XHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ295LXMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbm5lci5jbGFzc05hbWUgPSAnbWFnaWNhLXBhbmVsLWJhc2UnO1xyXG4gICAgICAgIGlmIChvcHRzLmFkZGl0aW9uYWxDbGFzc05hbWVzKSB0aGlzLmlubmVyLmNsYXNzTGlzdC5hZGQoLi4ub3B0cy5hZGRpdGlvbmFsQ2xhc3NOYW1lcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NldFJlc2l6ZUV2ZW10KGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oq44K144Kk44K644Kk44OZ44Oz44OI44KS6Kit5a6a44GX44G+44GZ44CCXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtIOOCpOODmeODs+ODiOOCv+ODvOOCsuODg+ODiFxyXG4gICAgICovXHJcbiAgICBfc2V0UmVzaXplRXZlbXQgKGVsZW0pIHtcclxuICAgICAgICB0aGlzLl9lbGVtcmVjdCA9IHt4OiBlbGVtLmNsaWVudFdpZHRoLCB5OiBlbGVtLmNsaWVudEhlaWdodH07XHJcbiAgICAgICAgY29uc3QgZGlzcGF0Y2hlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVsZW0uY2xpZW50V2lkdGggIT09IHRoaXMuX2VsZW1yZWN0LnhcclxuICAgICAgICAgICAgfHwgZWxlbS5jbGllbnRIZWlnaHQgIT09IHRoaXMuX2VsZW1yZWN0LnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1yZWN0ID0ge3g6IGVsZW0uY2xpZW50V2lkdGgsIHk6IGVsZW0uY2xpZW50SGVpZ2h0fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB0aGlzLl9lbGVtcmVjdH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChQYW5lbEJhc2Uud2luZG93LlJlc2l6ZU9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvID0gbmV3IFBhbmVsQmFzZS53aW5kb3cuUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcm8ub2JzZXJ2ZShlbGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGYgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBQYW5lbEJhc2Uud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGYoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOBrumFjeWIl+OBjOato+OBl+OBhOani+aIkOOBq+OBquOCi+OCiOOBhuOBq+aknOiovOODu+ODleOCo+ODq+OCv+OBl+OBvuOBmeOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNhbml0aXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBjaGlsZHJlbi5maW5kKGUgPT4gZS5vcHRzLnR5cGUgPT09ICdzdGFjaycpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGlmIChzdGFjaykgcmVzdWx0LnB1c2goc3RhY2spO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmNoaWxkcmVuLmZpbHRlcihlID0+IGUub3B0cy50eXBlID09PSAncGFuZWwnKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOBruenu+WLleOBq+i/veW+k+OBl+OBvuOBmeOAglxyXG4gICAgICovXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgfHwgdGhpcy5vcHRzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdHMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKGUgPT4gZS5yaWdodCArIHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0KSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlY3QucmlnaHQgPCBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke21heFggLSB0aGlzLmlubmVyLmNsaWVudExlZnR9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFJlY3QucmlnaHQgPiBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoZSA9PiBlLmJvdHRvbSArIHRoaXMuZWxlbWVudC5zY3JvbGxUb3ApKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVjdC5ib3R0b20gPCBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHttYXhZIC0gdGhpcy5pbm5lci5jbGllbnRUb3B9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFJlY3QuYm90dG9tID4gbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGlsZHJlbm1vdmUnLCB7ZGV0YWlsOiB7Li4uZXZ0LmRldGFpbCwgdGFyZ2V0OiBldnQudGFyZ2V0fX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVkSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2NoaWxkcmVubW92ZWQnLCB7ZGV0YWlsOiB7Li4uZXZ0LmRldGFpbCwgdGFyZ2V0OiBldnQudGFyZ2V0fX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1pbmltaXplZEhhbmRsZXIgKCkge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLWFycmF5LWZvci1lYWNoXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpLmZvckVhY2goKHZhbHVlLCBjb3VudGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3ZhbHVlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aCAqIGNvdW50ZXJ9cHhgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTm9ybWFsaXplZEhhbmRsZXIgKCkge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLWFycmF5LWZvci1lYWNoXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpLmZvckVhY2goKHZhbHVlLCBjb3VudGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3ZhbHVlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aCAqIGNvdW50ZXJ9cHhgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBWYWx1ZSBmcm9tICcuL3ZhbHVlcy5qcyc7XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQ29vcmRpbmF0aW9uT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyBudW1iZXIgfSB4IFjmlrnlkJEo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBudW1iZXIgfSB5IFnmlrnlkJEo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBSZXNpemVhYmxlT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gZW5hYmxlICAgICAgIOODpuODvOOCtuaTjeS9nOOBruacieWKueODu+eEoeWKuVxyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gc2hvd1RpdGxlYmFyIOmBqeeUqOaZguOBq+OCv+OCpOODiOODq+ODkOODvOOCkuihqOekuuOBmeOCi+OBi1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBQYW5lbE9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ3BhbmVsJyB9ICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlICAgICAgICAgICAgICAgIOODkeODjeODq+eoruWIpVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIG1pblNpemUgICAgICAgICAgICAg5pyA5bCP44Km44Kj44Oz44OJ44Km5YaF44Kz44Oz44OG44Oz44OE44K144Kk44K6KOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBtYXhTaXplICAgICAgICAgICAgIOacgOWkp+OCpuOCo+ODs+ODieOCpuWGheOCs+ODs+ODhuODs+ODhOOCteOCpOOCuijmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgcG9zaXRpb24gICAgICAgICAgICDliJ3mnJ/kvY3nva4o5bem5LiKKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIGRlZmF1bHRTaXplICAgICAgICAg5Yid5pyf44K144Kk44K6KDMyMHgyNDAsIOOCv+OCpOODiOODq+ODkOODvOOAgeOCpuOCo+ODs+ODieOCpuaeoOe3muWQq+OBvuOBmilcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIHwgSFRNTEVsZW1lbnQgfSAgICAgICAgICAgICB0aXRsZSAgICAgICAgICAgICAgIOOCv+OCpOODiOODq1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlYWJsZSAgICAgICAgICAg44OQ44OE44Oc44K/44Oz44KS5Ye654++44GV44Gb44KLXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW1hYmxlICAgICAgICAgICDmnIDlsI/ljJbjg5zjgr/jg7PjgpLlh7rnj77jgZXjgZvjgotcclxuICogQHByb3BlcnR5IHsgUmVzaXplYWJsZU9wdGlvbnMgfSAgICAgICAgICAgICAgICBtYXhpbXVtICAgICAgICAgICAgIOacgOWkp+WMluOBruaMmeWLlVxyXG4gKiBAcHJvcGVydHkgeyAnbW9kYWwnIHwgJ21vZGFsZXNzJyB8ICd0b3BNb3N0JyB9IG1vZGFsICAgICAgICAgICAgICAg44Oi44O844OA44Or6KGo56S654q25oWLXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ3Jlc2l6ZScgfCAnaGlkZGVuJyB9ICAgb3ZlcmZsb3dYICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxY6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ3Jlc2l6ZScgfCAnaGlkZGVuJyB9ICAgb3ZlcmZsb3dZICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxZ6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZSDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICogQHByb3BlcnR5IHsgYW55W10gfSAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzICAgICAgICAgIOS7u+aEj+OBq+aMh+WumuOBp+OBjeOCi+WxnuaAp1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiAgU3RhY2tDb250YWluZXJPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdzdGFjaycgfSAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyAgfSBkaXJlY3Rpb24gICAgICAgICAgIOWIhuWJsuaWueWQkVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlICAgICAgICAgICAg44Kz44Os44Kv44K344On44Oz5ZCE6KaB57Sg44Gu5Yid5pyf44K144Kk44K6XHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgcmVwcm9wb3J0aW9uYWJsZSAgICDjgrPjg6zjgq/jgrfjg6fjg7Pjga7mr5TnjofjgpLmk43kvZzjgafjgY3jgovjgYtcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICBkb2NrYWJsZSAgICAgICAgICAgIOOCs+ODrOOCr+OCt+ODp+ODs+OBruiEseedgOaTjeS9nOOBjOOBp+OBjeOCi+OBiyjjg6bjg7zjgrbmk43kvZzjgYvjgokpXHJcbiAqIEBwcm9wZXJ0eSB7IG51bWJlciB9ICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yV2lkdGggICAgICDliIblibLlooPnlYznt5rjga7luYUoMe+9nilcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIH0gICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lIOODkeODjeODq+OBq+i/veWKoOOBp+S7mOOBkeOCi+OCr+ODqeOCueWQjVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfCBIVE1MRWxlbWVudCB9ICAgICAgIHBhbmVsQWRkQXJlYSAgICAgICAg44K544K/44OD44Kv5YaF44GM56m644Gu44Go44GN44Gr6KGo56S644GV44KM44KL44OR44ON44Or6L+95Yqg44Ki44Kk44Kz44OzXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQmFzZUNvbnRhaW5lck9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ2Jhc2UnIH0gICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAgIOODkeODjeODq+eoruWIpVxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdoaWRkZW4nIH0gb3ZlcmZsb3dYICAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdoaWRkZW4nIH0gb3ZlcmZsb3dZICAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZXMg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxCYXNlIGV4dGVuZHMgRXZlbnRUYXJnZXRcclxue1xyXG4gICAgc3RhdGljIF9pbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICAgIHN0YXRpYyB3aW5kb3c7XHJcbiAgICBzdGF0aWMgZG9jdW1lbnQ7XHJcbiAgICBzdGF0aWMgQ3VzdG9tRXZlbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0geyBQYW5lbE9wdGlvbnMgfCBTdGFja1BhbmVsT3B0aW9ucyB8IEJhc2VDb250YWluZXJPcHRpb25zIH0gb3B0c1xyXG4gICAgICogQHBhcmFtIHsgKFBhbmVsQmFzZSB8IEhUTUxFbGVtZW50KVtdIH0gY2hpbGRyZW5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGVsZW1lbnQsIG9wdHMsIC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9jaGFuZ2VQYXJlbnRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBhcmVudEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTW92ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZE1vdmVIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTW92ZUhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTWluaW1pemVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE1pbmltaXplZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGROb3JtYWxpemVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVzaXplUGFyZW50SGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVQYXJlbnRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9vcHRzID0gb3B0cztcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAvLyDoh6rouqvopoHntKDjgpLliJ3mnJ/ljJbjgZnjgotcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgY2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pbm5lciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZCh0aGlzLl9pbm5lcik7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB0aGlzLmFjdGl2ZSgpKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB0aGlzLmFjdGl2ZSgpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQYW5lbEJhc2UpIHtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEB0eXBlIHsgUGFuZWxCYXNlIHwgdW5kZWZpbmVkIH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKCFQYW5lbEJhc2UuX2luaXRpYWxpemVkKSBQYW5lbEJhc2UuaW5pdCgpO1xyXG4gICAgICAgIFBhbmVsQmFzZS5faW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybiB7IFBhbmVsT3B0aW9ucyB8IFN0YWNrUGFuZWxPcHRpb25zIHwgQmFzZUNvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3B0cyAoKSB7XHJcbiAgICAgICAgY29uc3Qge3RpdGxlLCAuLi5vdGhlcn0gPSB0aGlzLl9vcHRzO1xyXG4gICAgICAgIGNvbnN0IG9wdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG90aGVyKSk7XHJcbiAgICAgICAgaWYgKHRpdGxlKSBvcHRzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgcmV0dXJuIG9wdHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVsZW1lbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbm5lciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjaGlsZHJlbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLl9jaGlsZHJlbl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuani+evieOBmeOCi+OBn+OCgeOBruWIneacn+WMluODoeOCveODg+ODiVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdCAoKSB7XHJcbiAgICAgICAgUGFuZWxCYXNlLmFwcGVuZFN0eWxlRWxlbWVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCueOCv+OCpOODq+OCkuODmOODg+ODgOOBq+i/veWKoOOBl+OBvuOBmeOAglxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXBwZW5kU3R5bGVFbGVtZW50cyAoKSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IFZhbHVlLnN0eWxlO1xyXG4gICAgICAgIGNvbnN0IHJlZiA9IFBhbmVsQmFzZS5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZSwgbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJyk7XHJcbiAgICAgICAgaWYgKHJlZikge1xyXG4gICAgICAgICAgICBQYW5lbEJhc2UuZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIHJlZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBQYW5lbEJhc2UuZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsO1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFwcGVuZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hhbmdlcGFyZW50Jywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVBhcmVudEhhbmRsZXIodW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVkSGFuZGxlciAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hhbmdlcGFyZW50Jywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICh2YWwpIHtcclxuICAgICAgICAodmFsLm91dGVyID8/IHZhbC5lbGVtZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUgIT09IHZhbCk7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdmUnLCB0aGlzLl9jaGlsZE1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZWQnLCB0aGlzLl9jaGlsZE1vdmVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21pbmltaXplZCcsIHRoaXMuX2NoaWxkTWluaW1pemVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ25vcm1hbGl6ZWQnLCB0aGlzLl9jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZXBhcmVudCcsIHZhbC5fY2hhbmdlUGFyZW50SGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kICh2YWwsIHJlZikge1xyXG4gICAgICAgIGNvbnN0IG5leHQgPSByZWY/Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5pbnNlcnRCZWZvcmUodmFsLm91dGVyID8/IHZhbC5lbGVtZW50LCBuZXh0KTtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmZpbmRJbmRleChlID0+IGUubmV4dEVsZW1lbnRTaWJsaW5nID09PSByZWYpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoaWR4ICsgMSwgMCwgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmFwcGVuZCh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSAoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQYW5lbEJhc2UpIHtcclxuICAgICAgICAgICAgY2hpbGQuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjbG9zZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkgdGhpcy5fcGFyZW50Lm1vZGlmeVpJbmRleCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RpZnlaSW5kZXggKGFjdGl2ZSkge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLl9jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJyk7XHJcbiAgICAgICAgaWYgKHdpbmRvd3MuaW5jbHVkZXMoYWN0aXZlKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRzID0gd2luZG93cy5maWx0ZXIoZSA9PiBlICE9PSBhY3RpdmUpLnNvcnQoKGEsIGIpID0+IE51bWJlcihhLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykgLSBOdW1iZXIoYi5lbGVtZW50LnN0eWxlLnpJbmRleCA/PyAnMCcpKTtcclxuICAgICAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoOyBpZHggPCB0YXJnZXRzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldHNbaWR4XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhY3RpdmUuZWxlbWVudC5zdHlsZS56SW5kZXggPSBgJHtpZHh9YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbnRyeSB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gd2luZG93O1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gZG9jdW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50O1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gSW1hZ2U7XHJcbn1cclxuY2F0Y2gge1xyXG4gICAgUGFuZWxCYXNlLndpbmRvdyA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5kb2N1bWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5JbWFnZSA9IHVuZGVmaW5lZDtcclxufVxyXG4iLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcbmltcG9ydCBCYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5cclxuLyoqXHJcbiAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km6KGo56S644O744G744GL44OR44ON44Or44G444Gu5qC857SN44GM5Y+v6IO9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgUGFuZWxPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAncGFuZWwnLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7eDogMCwgeTogMH0sXHJcbiAgICAgICAgbWluU2l6ZToge3g6IDEyMCwgeTogMH0sXHJcbiAgICAgICAgZGVmYXVsdFNpemU6IHt4OiAzMjAsIHk6IDI0MH0sXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIGNsb3NlYWJsZTogdHJ1ZSxcclxuICAgICAgICBhdXRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgbWluaW1hYmxlOiB0cnVlLFxyXG4gICAgICAgIG1heGltdW06IHtlbmFibGU6IHRydWUsIHNob3dUaXRsZWJhcjogdHJ1ZX0sXHJcbiAgICAgICAgZGVmYXVsdE1vZGU6ICdub3JtYWwnLFxyXG4gICAgICAgIG1vZGFsOiAnbW9kYWxlc3MnLFxyXG4gICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXHJcbiAgICAgICAgb3ZlcmZsb3dZOiAnc2Nyb2xsJyxcclxuICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lOiAnJyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuagvOe0jeOBmeOCi+ODkeODjeODq+OCqOODquOCouOAguOCpuOCo+ODs+ODieOCpuODu+ODmuOCpOODs+ihqOekuuOBjOWPr+iDvVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB9ICAgICAgICAgICAgb3B0cyAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IEhUTUxFbGVtZW50IHwgUGFuZWxCYXNlIH0gY29udGVudCDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9wdHMgPSBQYW5lbC5ERUZBVUxUX09QVElPTlMsIGNvbnRlbnQpIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgUGFuZWwuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC13aW5kb3cnKTtcclxuICAgICAgICB0aGlzLmlubmVyLmNsYXNzTmFtZSA9ICdtYWdpY2EtcGFuZWwtaW5uZXInO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuY2xhc3NMaXN0LmFkZCgnb3gtcycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveS1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5kZWZhdWx0TW9kZSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuc3R5bGUud2lkdGggPSBgJHtvcHRzLmRlZmF1bHRTaXplLnh9cHhgO1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtvcHRzLmRlZmF1bHRTaXplLnl9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgr/jgqTjg4jjg6vjg5Djg7zjgpLov73liqBcclxuICAgICAgICBjb25zdCB0aXRsZWJhciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IG9wdHMudGl0bGU7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChzcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnb2JqZWN0JyAmJiBvcHRzLnRpdGxlIGluc3RhbmNlb2YgUGFuZWxCYXNlLkhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChvcHRzLnRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGViYXIgPSB0aXRsZWJhcjtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZSh0aXRsZWJhciwgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtdGl0bGViYXInKTtcclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLnNob3dUaXRsZWJhcikge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21heGltdW0tZGlzYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4ge1xyXG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5ldyBQYW5lbEJhc2UuSW1hZ2UoKSwgMCwgMCk7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgJ3BhbmVsJyk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9hZGRSZXNpemVBcmVhKCk7XHJcblxyXG4gICAgICAgIC8vIOODnOOCv+ODs+OCqOODquOCouOCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbmFyZWEgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgYnV0dG9uYXJlYS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGJ1dHRvbmFyZWEpO1xyXG5cclxuICAgICAgICAvLyDplonjgZjjgovjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBjbG9zZWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjbG9zZWJ1dHRvbi50ZXh0Q29udGVudCA9ICfDlyc7XHJcbiAgICAgICAgY2xvc2VidXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdjbG9zZScpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLmNsb3NlYWJsZSkge1xyXG4gICAgICAgICAgICBjbG9zZWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBidXR0b25hcmVhLmFwcGVuZChjbG9zZWJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vIOacgOWkp+WMli/lvqnlhYPjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBtYXhpbXVtYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIG1heGltdW1idXR0b24udGV4dENvbnRlbnQgPSAn4p2QJztcclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnbWF4aW11bScpO1xyXG4gICAgICAgIG1heGltdW1idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1heGltdW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLmVuYWJsZSkge1xyXG4gICAgICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlYnV0dG9uLmJlZm9yZShtYXhpbXVtYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5bCP5YyWL+W+qeWFg+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IG1pbmltdW1idXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi50ZXh0Q29udGVudCA9ICctJztcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnbWluaW11bScpO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmltdW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5taW5pbWFibGUpIHtcclxuICAgICAgICAgICAgbWluaW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmJlZm9yZShtaW5pbXVtYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g44Oi44O844OA44OrXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndG9wbW9zdCcpO1xyXG4gICAgICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICAgICAgbWF4aW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMub3B0cy5wb3NpdGlvbi54fXB4YDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5vcHRzLnBvc2l0aW9uLnl9cHhgO1xyXG4gICAgICAgIHRoaXMuYWRqdXN0V2luZG93UG9zaXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBfYWRkUmVzaXplQXJlYSAoKSB7XHJcbiAgICAgICAgLy8g44Oq44K144Kk44K66aCY5Z+f44KS6L+95YqgXHJcbiAgICAgICAgdGhpcy5lZGdlcyA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIFtbJ3RvcCddLCBbJ2JvdHRvbSddLCBbJ2xlZnQnXSwgWydyaWdodCddLCBbJ3RvcCcsICdsZWZ0J10sIFsndG9wJywgJ3JpZ2h0J10sIFsnYm90dG9tJywgJ2xlZnQnXSwgWydib3R0b20nLCAncmlnaHQnXV0pIHtcclxuICAgICAgICAgICAgY29uc3QgZWRnZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgZWRnZS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtZWRnZScsIC4uLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoZWRnZSk7XHJcbiAgICAgICAgICAgIGVkZ2UuZHJhZ2dhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpO1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB0aGlzLl9yZXNpemVBcmVhSGFuZGxlcihldikpO1xyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGV2ID0+IGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRnZXNbdGFyZ2V0XSA9IGVkZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKipcclxuICAgICAqIEBwYXJhbSB7IE1vdXNlRXZlbnQgfSBldlxyXG4gICAgICovXHJcbiAgICBfcmVzaXplQXJlYUhhbmRsZXIgKGV2KSB7XHJcbiAgICAgICAgaWYgKGV2LnR5cGUgPT09ICdtb3VzZWRvd24nIHx8IGV2LnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xyXG4gICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0ID0ge3g6IGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgsIHk6IGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVl9O1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXYudHlwZSA9PT0gJ2RyYWcnXHJcbiAgICAgICAgfHwgZXYudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcclxuICAgICAgICAgICAgaWYgKChldi5zY3JlZW5ZID8/IGV2LnRvdWNoZXM/LlswXT8uc2NyZWVuWSkgPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b3AnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX3N0YXJ0cmVjdC5oZWlnaHQgKyB0aGlzLl9jbGlja3N0YXJ0LnkgLSAoZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWSkgLSAxMDtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCA8PSB0aGlzLm9wdHMubWluU2l6ZS55PyB0aGlzLm9wdHMubWluU2l6ZS55OiBoZWlnaHQgPj0gKHRoaXMub3B0cy5tYXhTaXplPy55ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueTogaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsVG9wICsgdGhpcy5fc3RhcnRyZWN0LmJvdHRvbSAtIGhlaWdodCAtIHRoaXMudGl0bGViYXIuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2JvdHRvbScpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9zdGFydHJlY3QuaGVpZ2h0ICsgKGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVkpIC0gdGhpcy5fY2xpY2tzdGFydC55IC0gMTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodCA8PSB0aGlzLm9wdHMubWluU2l6ZS55PyB0aGlzLm9wdHMubWluU2l6ZS55OiBoZWlnaHQgPj0gKHRoaXMub3B0cy5tYXhTaXplPy55ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueTogaGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fc3RhcnRyZWN0LndpZHRoICsgdGhpcy5fY2xpY2tzdGFydC54IC0gKGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgpIC0gMTA7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHdpZHRoIDw9IHRoaXMub3B0cy5taW5TaXplLng/IHRoaXMub3B0cy5taW5TaXplLng6IHdpZHRoID49ICh0aGlzLm9wdHMubWF4U2l6ZT8ueCA/PyBJbmZpbml0eSk/IHRoaXMub3B0cy5tYXhTaXplLng6IHdpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt0aGlzLnBhcmVudC5lbGVtZW50LnNjcm9sbExlZnQgKyB0aGlzLl9zdGFydHJlY3QucmlnaHQgLSB3aWR0aH1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyAoZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCkgLSB0aGlzLl9jbGlja3N0YXJ0LnggLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aCA8PSB0aGlzLm9wdHMubWluU2l6ZS54PyB0aGlzLm9wdHMubWluU2l6ZS54OiB3aWR0aCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnggPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS54OiB3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9tb3ZlVGl0bGViYXJIYW5kbGVyIChldikge1xyXG4gICAgICAgIGlmICgodGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF4aW11bScpICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgQmFzZUNvbnRhaW5lcilcclxuICAgICAgICB8fCB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChldi50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gZXYudGFyZ2V0LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0ID0ge3g6IGV2Lm9mZnNldFggPz8gKGV2LnRvdWNoZXNbMF0ucGFnZVggLSByZWN0LmxlZnQpLCB5OiBldi5vZmZzZXRZID8/IChldi50b3VjaGVzWzBdLnBhZ2VZIC0gcmVjdC50b3ApfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICd0b3VjaG1vdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXRlc3RUb3VjaEV2ID0gZXY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWcnOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGV2LnNjcmVlblkgPz8gZXYudG91Y2hlcz8uWzBdPy5zY3JlZW5ZKSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7KHRoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldi5wYWdlWCA/PyBldi50b3VjaGVzWzBdLnBhZ2VYKSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnh9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAkeyh0aGlzLnBhcmVudC5lbGVtZW50LnNjcm9sbFRvcCArIChldi5wYWdlWSA/PyBldi50b3VjaGVzWzBdLnBhZ2VZKSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnl9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21vdmUnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoZW5kJzoge1xyXG4gICAgICAgICAgICAgICAgZXYgPSB0aGlzLl9sYXRlc3RUb3VjaEV2O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICdkcmFnZW5kJzoge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGp1c3RXaW5kb3dQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21vdmVkJywge2RldGFpbDoge3JlY3Q6IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdLCBldiwgdGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFdpbmRvd1Bvc2l0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF07XHJcbiAgICAgICAgaWYgKCFjdXJyZW50UmVjdCB8fCAhdGhpcy5wYXJlbnQpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50SGVpZ2h0ID4gdGhpcy5lbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgICAgICYmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQpIDwgY3VycmVudFJlY3QuYm90dG9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQgLSB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCA+IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aFxyXG4gICAgICAgICYmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCkgPCBjdXJyZW50UmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoIC0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRofXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UmVjdC5sZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnRvcCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtYXhpbXVtICgpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0/LmxlZnQgPz8gMDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXhpbXVtJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vcm1hbCAoeCkge1xyXG4gICAgICAgIGxldCByYXRpbyA9IDA7XHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIHJhdGlvID0gKHggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21heGltdW0nKTtcclxuXHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCB3ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jbGlja3N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0LnggPSB3ICogcmF0aW87XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5yb3VuZCh4IC0gKHcgKiByYXRpbykpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMuX2xlZnR9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ25vcm1hbGl6ZWQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWluaW11bSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdPy5sZWZ0ID8/IDA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21heGltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdtaW5pbWl6ZWQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyIChfZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFyZW50SGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgc3VwZXIuY2hhbmdlUGFyZW50SGFuZGxlcihldnQpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMubW9kYWwgPT09ICdtb2RhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5vdXRlciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdGhpcy5vdXRlci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtbW9kYWwtYmxvY2tlcicpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5vdXRlciwgdGhpcy5lbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5vdXRlci5hcHBlbmQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAocmVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgY2FsYyg1MCUgLSAke3JlY3Qud2lkdGggLyAyfXB4KWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYGNhbGMoNTAlIC0gJHtyZWN0LmhlaWdodCAvIDJ9cHgpYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDlnoLnm7Tjgb7jgZ/jga/msLTlubPmlrnlkJHjgbjjga7mlbTliJfjgoTjgr/jg5bliIfjgormm7/jgYjjgavjgojjgovjg5Hjg43jg6vjga7jgrnjgqTjg4Pjg4EoM+WAi+OBruOBhuOBoeOBhOOBmuOCjOOBizHjgaQp44KS5o+Q5L6b44GX44G+44GZ44CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFja0NvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgU3RhY2tDb250YWluZXJPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAnc3RhY2snLFxyXG4gICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICByZXByb3BvcnRpb25hYmxlOiB0cnVlLFxyXG4gICAgICAgIGRvY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIHNlcGFyYXRvcldpZHRoOiAyLFxyXG4gICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWU6ICcnLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxyXG4gICAgICAgIHRlbXBsYXRlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcGFuZWxBZGRBcmVhOiB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVUnjgpLmoLzntI3jgZnjgovjg5Hjg43jg6vjgqjjg6rjgqLjgILjgqbjgqPjg7Pjg4njgqbjg7vjg5rjgqTjg7PooajnpLrjgYzlj6/og71cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBTdGFja0NvbnRhaW5lck9wdGlvbnMgfSAgICAgIG9wdHMgICAg44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuIOWGheWuueOCs+ODs+ODhuODs+ODhFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3B0cyA9IFN0YWNrQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgU3RhY2tDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCAuLi5jaGlsZHJlbik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcy5vcHRzLnRlbXBsYXRlKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXInKTtcclxuICAgICAgICB0aGlzLmlubmVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1pbm5lcicpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaG9yaXpvbnRhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndGFiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhZGRBcmVhID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBhZGRBcmVhLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InLCAnZW1wdHknKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMucGFuZWxBZGRBcmVhID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgYWRkQXJlYS5hcHBlbmQodGhpcy5vcHRzLnBhbmVsQWRkQXJlYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBcmVhLnRleHRDb250ZW50ID0gdGhpcy5vcHRzLnBhbmVsQWRkQXJlYSA/PyB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAn4pakJyA6ICfilqUnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goYWRkQXJlYSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoYWRkQXJlYSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tb3ZlaGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVkgPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxUb3AgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWSA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVkpO1xyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVggPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2dC5kZXRhaWwuZXYucGFnZVggPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbVJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1SZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCBlbGVtUmVjdC5ib3R0b21cclxuICAgICAgICAgICAgJiYgZWxlbVJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCBlbGVtUmVjdC5yaWdodFxyXG4gICAgICAgICAgICAmJiBldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1heGltdW0uZW5hYmxlID09PSB0cnVlICYmIHRoaXMub3B0cy5kb2NrYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBhZGRhcmVhIG9mIHRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBhZGRhcmVhLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocmVjdCAmJiByZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCByZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAgICAgJiYgcmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IHJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9tb3ZlZGhhbmRsZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW91c2VZID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2dC5kZXRhaWwuZXYucGFnZVkgPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VYID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldnQuZGV0YWlsLmV2LnBhZ2VYID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1SZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChlbGVtUmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgZWxlbVJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICYmIGVsZW1SZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgZWxlbVJlY3QucmlnaHRcclxuICAgICAgICAgICAgJiYgZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tYXhpbXVtLmVuYWJsZSA9PT0gdHJ1ZSAmJiB0aGlzLm9wdHMuZG9ja2FibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYWRkYXJlYSBvZiB0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZyA9PT0gYWRkYXJlYS5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcgPT09IGFkZGFyZWEucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCAhPT0gdGhpcy5yb290KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gYWRkYXJlYS5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWN0ICYmIHJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IHJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IHJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdHJlZiA9IHRoaXMuZWxlbWVudC5jb250YWlucyhhZGRhcmVhLmNsb3Nlc3QoJy5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXInKSk/IGFkZGFyZWEucGFyZW50RWxlbWVudDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSBldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIucGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIHN1cGVyLnBhcmVudCA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBzdXBlci5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2dCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmUnLCB0aGlzLl9tb3ZlaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZWQnLCB0aGlzLl9tb3ZlZGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlJywgdGhpcy5fbW92ZWhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlZCcsIHRoaXMuX21vdmVkaGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZCAodmFsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFkZGFyZWFzKSB0aGlzLmFkZGFyZWFzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuaW5uZXIuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlcCA9IHRoaXMuX2dlbmVyYXRlU2VwYXJhdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChzZXAuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChzZXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvd1JhbmdlID0gdGhpcy5fbGFzdFRhcmdldFJhbmdlO1xyXG4gICAgICAgICAgICByYW5nZXMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gPz8gZS5vcHRzPy5kZWZhdWx0U2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gPz8gMTAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0cmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudCkuaW5kZXhPZih0aGlzLl9sYXN0cmVmLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0VGFyZ2V0UmFuZ2UgPSAoKHJhbmdlc1tpZHhdID8/IDApICsgKHJhbmdlc1tpZHggKyAxXSA/PyAwKSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0UmFuZ2UgPSBNYXRoLm1pbihpbnNlcnRUYXJnZXRSYW5nZSwgd2luZG93UmFuZ2UpIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKH5pZHggJiYgcmFuZ2VzW2lkeCArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW3NtYWxsSWR4LCBsYXJnZUlkeF0gPSByYW5nZXNbaWR4XSA+IHJhbmdlc1tpZHggKyAxXT8gW2lkeCArIDEsIGlkeF06IFtpZHgsIGlkeCArIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gcmFuZ2VzW3NtYWxsSWR4XSAvIHJhbmdlc1tsYXJnZUlkeF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc21hbGxTaXplID0gTWF0aC5yb3VuZChpbnNlcnRSYW5nZSAvIDIgKiByYXRpbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW3NtYWxsSWR4XSAtPSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2xhcmdlSWR4XSAtPSAoaW5zZXJ0UmFuZ2UgLSBzbWFsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAofmlkeCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tpZHhdIC09IGluc2VydFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCArIDFdIC09IGluc2VydFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJhbmdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgaW5zZXJ0UmFuZ2UgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByYW5nZXMgPSByYW5nZXMubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuYXBwZW5kKHZhbCwgdGhpcy5fbGFzdHJlZik7XHJcbiAgICAgICAgaWYgKHZhbC5tYXhpbXVtKSB2YWwubWF4aW11bSgpO1xyXG5cclxuICAgICAgICBjb25zdCBzZXAgPSB0aGlzLl9nZW5lcmF0ZVNlcGFyYXRvcigpO1xyXG4gICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChzZXAuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIGlmICh2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5pbnNlcnRCZWZvcmUoc2VwLCB2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoc2VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzLmxlbmd0aCA9PT0gMD8gdW5kZWZpbmVkOiByYW5nZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbG9zZXN0KCdib2R5JykpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXT8uW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSkuZmlsdGVyKGUgPT4gZSAhPT0gdW5kZWZpbmVkKTtcclxuICAgICAgICBjb25zdCB0b3RhbCA9IHJhbmdlcy5yZWR1Y2UoKGEsIGMpID0+IGEgKyBjLCAwKTtcclxuICAgICAgICBjb25zdCByYXRpb3MgPSByYW5nZXMubWFwKGUgPT4gZSAvIHRvdGFsKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50V2lkdGggPSB0aGlzLmlubmVyLmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddIC0gKHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCAqICh0aGlzLmNoaWxkcmVuLmxlbmd0aCArIDEpKTtcclxuICAgICAgICByYW5nZXMgPSByYXRpb3MubWFwKGUgPT4gTWF0aC5yb3VuZChlICogY3VycmVudFdpZHRoKSk7XHJcbiAgICAgICAgcmFuZ2VzLnBvcCgpO1xyXG4gICAgICAgIHJhbmdlcy5wdXNoKGN1cnJlbnRXaWR0aCAtIHJhbmdlcy5yZWR1Y2UoKGEsIGMpID0+IGEgKyBjLCAwKSk7XHJcbiAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICBpZiAocmFuZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCByYW5nZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZSAodmFsKSB7XHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IHR5cGVvZiB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPT09ICdvYmplY3QnPyB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2U6IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXT8uW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSk7XHJcbiAgICAgICAgaWYgKHJhbmdlcykge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZih2YWwpO1xyXG4gICAgICAgICAgICBpZiAoIXJhbmdlc1tpZHggLSAxXSAmJiByYW5nZXNbaWR4ICsgMV0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggKyAxXSArPSByYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghcmFuZ2VzW2lkeCArIDFdICYmIHJhbmdlc1tpZHggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCAtIDFdICs9IHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJhbmdlc1tpZHggKyAxXSAmJiByYW5nZXNbaWR4IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtzbWFsbElkeCwgbGFyZ2VJZHhdID0gcmFuZ2VzW2lkeCAtIDFdID4gcmFuZ2VzW2lkeCArIDFdPyBbaWR4ICsgMSwgaWR4IC0gMV06IFtpZHggLSAxLCBpZHggKyAxXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gcmFuZ2VzW3NtYWxsSWR4XSAvIHJhbmdlc1tsYXJnZUlkeF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzbWFsbFNpemUgPSBNYXRoLnJvdW5kKChyYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCkgLyAyICogcmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW3NtYWxsSWR4XSArPSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbbGFyZ2VJZHhdICs9IChyYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCkgLSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJhbmdlcyA9IHJhbmdlcy5maWx0ZXIoKF9lLCBpKSA9PiBpICE9PSBpZHgpLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbC5lbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVtb3ZlKHZhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5uZXIuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMuZmlsdGVyKGUgPT4gZSAhPT0gdGhpcy5pbm5lci5jaGlsZHJlblswXS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuY2hpbGRyZW5bMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCByYW5nZXM/Lmxlbmd0aCA9PT0gMD8gdW5kZWZpbmVkOiByYW5nZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIF9jYWxjR3JpZFNpemUgKHNlcCwgcG9zLCB0ZW1wbGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdncmlkVGVtcGxhdGVSb3dzJzogJ2dyaWRUZW1wbGF0ZUNvbHVtbnMnO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTaXplcyA9IHRlbXBsYXRlID8/IHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XS5zcGxpdCgnICcpLmZpbHRlcihlID0+IGUgIT09ICcnKS5maWx0ZXIoKF9lLCBpKSA9PiBpICUgMiAhPT0gMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XSA9ICcnO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY3VycmVudFNpemVzWzBdID0gJzFmcic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VwICYmIHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHNlcC5uZXh0RWxlbWVudFNpYmxpbmcgJiYgcG9zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgYnJvcyA9IEFycmF5LmZyb20odGhpcy5pbm5lci5jaGlsZHJlbikuZmlsdGVyKGUgPT4gIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yJykpO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2SWR4ID0gYnJvcy5pbmRleE9mKHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dElkeCA9IGJyb3MuaW5kZXhPZihzZXAubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldlJlY3QgPSBzZXAucHJldmlvdXNFbGVtZW50U2libGluZy5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0UmVjdCA9IHNlcC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSBgJHtwb3MgLSBwcmV2UmVjdC50b3AgLSAxfXB4YDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9IGAke25leHRSZWN0LmJvdHRvbSAtIHBvcyAtIDF9cHhgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cG9zIC0gcHJldlJlY3QubGVmdCAtIDF9cHhgO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gYCR7bmV4dFJlY3QucmlnaHQgLSBwb3MgLSAxfXB4YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGlkeCsrKSBpZiAoY3VycmVudFNpemVzW2lkeF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjdXJyZW50U2l6ZXMucHVzaCgnMWZyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50U2l6ZXMuc3BsaWNlKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0gPSBgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHggJHtjdXJyZW50U2l6ZXMuam9pbihgICR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4IGApfSAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICB9XHJcblxyXG4gICAgX2dlbmVyYXRlU2VwYXJhdG9yICgpIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtLnN0eWxlW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSA9IGAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgZWxlbS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IGlubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlubmVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEnKTtcclxuICAgICAgICBlbGVtLmFwcGVuZChpbm5lcik7XHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldi5zY3JlZW5ZID09PSAwIHx8IHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKGV2LnRhcmdldCwgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gZXYucGFnZVkgOiBldi5wYWdlWCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXYudG91Y2hlc1swXT8uc2NyZWVuWSA9PT0gMCB8fCB0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZShldi50YXJnZXQsIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IGV2LnRvdWNoZXNbMF0ucGFnZVkgOiBldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pO1xyXG4gICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0Lm5vcm1hbCgoZXZ0LmRldGFpbC5ldi5wYWdlWCA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVgpKTtcclxuICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgPSB0aGlzLnJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHJvb3QgKCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudD8ucGFyZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc3Qgc3R5bGUgPSBgXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlciB7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYmFzZSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBtaW4td2lkdGg6IDEwMCU7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93IHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXRpdGxlYmFyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGhlaWdodDogMS41cmVtO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxuICAgIG1hcmdpbi1yaWdodDogY2FsYygyLjVyZW0gKiAzKTtcclxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB+IC5tYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC10aXRsZWJhciA+ICoge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgcGFkZGluZzogMXB4O1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UubGVmdCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UucmlnaHQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5sZWZ0OmFjdGl2ZSxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnJpZ2h0OmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tIHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3A6YWN0aXZlLFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tOmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5sZWZ0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLnJpZ2h0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLmxlZnQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ucmlnaHQge1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgdG9wOiB1bnNldDtcclxuICAgIGxlZnQ6IHVuc2V0O1xyXG4gICAgcmlnaHQ6IHVuc2V0O1xyXG4gICAgYm90dG9tOiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5sZWZ0IHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBjdXJzb2w6IG53c2UtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLnJpZ2h0IHtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgY3Vyc29sOiBuZXN3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5sZWZ0IHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBjdXJzb2w6IG5lc3ctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLnJpZ2h0IHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgY3Vyc29sOiBud3NlLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSB7XHJcbiAgICBwYWRkaW5nOiAwcHg7XHJcbiAgICB0b3A6IDAgIWltcG9ydGFudDtcclxuICAgIGxlZnQ6IDAgIWltcG9ydGFudDtcclxuICAgIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSAubWFnaWNhLXBhbmVsLWVkZ2Uge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSAubWFnaWNhLXBhbmVsLXRpdGxlYmFyIHtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICB3aWR0aDogY2FsYygxMDAlIC0gMnB4KSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAxLjVyZW0gLSA2cHgpICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB+IC5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAycHgpICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1pbmltdW0ge1xyXG4gICAgd2lkdGg6IDE4NnB4O1xyXG4gICAgYm90dG9tOiAwICFpbXBvcnRhbnQ7XHJcbiAgICB0b3A6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93LnRvcG1vc3Qge1xyXG4gICAgei1pbmRleDogNjU1MzUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1tb2RhbC1ibG9ja2VyIHtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsLjUpO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgei1pbmRleDogNjU1MzUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSA+IC5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSA+IC5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi1hcmVhIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbiB7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgd2lkdGg6IDIuNXJlbTtcclxuICAgIGZvbnQtc2l6ZTogMXJlbTtcclxuICAgIGJhY2tncm91bmQ6IG1pZG5pZ2h0Ymx1ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uZGVueSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5jbG9zZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjNzAxOTE5O1xyXG59XHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmNsb3NlLm9uYWN0aXZlIHtcclxuICAgIGJhY2tncm91bmQ6ICNlNjMyMzI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlciB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHotaW5kZXg6IDA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBtaWRuaWdodGJsdWU7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHotaW5kZXg6IDEwMDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5lbXB0eSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgZm9udC1zaXplOiAzcmVtO1xyXG4gICAgd2lkdGg6IDVyZW07XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1LDI1LDExMiwgMC4zKTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwcmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBsZWZ0OiAtNXJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Zmlyc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBsZWZ0OiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpsYXN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMHJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHRvcDogLTVyZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpmaXJzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHRvcDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmxhc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICB0b3A6IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5ob3Zlcik6Tk9UKC5kaXNhYmxlKTpOT1QoOmZpcnN0LW9mLXR5cGUpOk5PVCg6bGFzdC1vZi10eXBlKTpob3ZlciB7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5ob3Zlcik6Tk9UKC5kaXNhYmxlKTpOT1QoOmZpcnN0LW9mLXR5cGUpOk5PVCg6bGFzdC1vZi10eXBlKTpob3ZlciB7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguZW1wdHkpIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIuZW1wdHkgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuZW1wdHkge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3ZlciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuaG92ZXIge1xyXG4gICAgb3BhY2l0eTogMTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsIC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsIC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0b3A6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICBsZWZ0IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICB6LWluZGV4OiB1bnNldCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtYnV0dG9uLm1heGltdW0ge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLWJ1dHRvbi5taW5pbXVtIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuYDtcclxuXHJcbmNvbnN0IFZhbHVlID0ge1xyXG4gICAgc3R5bGUsXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKFZhbHVlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZhbHVlO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBiYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5pbXBvcnQgcGFuZWwgZnJvbSAnLi9wYW5lbC5qcyc7XHJcbmltcG9ydCBzdGFja0NvbnRhaW5lciBmcm9tICcuL3N0YWNrLWNvbnRhaW5lci5qcyc7XHJcblxyXG5leHBvcnQgY29uc3QgQmFzZUNvbnRhaW5lciA9IGJhc2VDb250YWluZXI7XHJcbmV4cG9ydCBjb25zdCBQYW5lbCA9IHBhbmVsO1xyXG5leHBvcnQgY29uc3QgU3RhY2tDb250YWluZXIgPSBzdGFja0NvbnRhaW5lcjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgQmFzZUNvbnRhaW5lcixcclxuICAgIFBhbmVsLFxyXG4gICAgU3RhY2tDb250YWluZXIsXHJcbn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==