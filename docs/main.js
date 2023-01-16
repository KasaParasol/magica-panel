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

            let prevRange = pos - (this.opts.direction === 'vertical'? prevRect.top: prevRect.left - this.opts.separatorWidth);
            let frFlag = false;
            if (prevRange <= 0 && this.children[prevIdx].opts.minimable) {
                frFlag = true;
                currentSizes[prevIdx] = `0px`;
                currentSizes[nextIdx] = `${nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - this.opts.separatorWidth}px`;
            }
            else {
                prevRange = this.children[prevIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] > prevRange ? this.children[prevIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] : prevRange;
            }
            let nextRange = (this.opts.direction === 'vertical'? nextRect.bottom: nextRect.right) - ((this.opts.direction === 'vertical'? prevRect.top: prevRect.left) + prevRange + this.opts.separatorWidth) - this.opts.separatorWidth;
            if (nextRange <= 0 && this.children[nextIdx].opts.minimable && !frFlag) {
                frFlag = true;
                currentSizes[prevIdx] = `${nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left']  - this.opts.separatorWidth}px`;
                currentSizes[nextIdx] = `0px`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxFQUFFO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGtFQUFxQixZQUFZLFNBQVMsY0FBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHlKQUF5SjtBQUNwTTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQywwSkFBMEo7QUFDck07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFVBQVU7QUFDekQsK0NBQStDLFVBQVU7QUFDekQ7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pELCtDQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDRCQUE0QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyx5QkFBeUIsS0FBSyxzQkFBc0IseUJBQXlCLE9BQU8sRUFBRSx5QkFBeUI7QUFDcko7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDZFQUFnQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQStFLHlCQUF5QjtBQUN4RztBQUNBLHNCQUFzQiw2RUFBZ0M7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxLQUFLLEVBQUM7Ozs7Ozs7VUN2WXJCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNqQjtBQUNtQjtBQUNsRDtBQUNPLHNCQUFzQiwwREFBYTtBQUNuQyxjQUFjLGlEQUFLO0FBQ25CLHVCQUF1QiwyREFBYztBQUM1QyxpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9iYXNlLWNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9wYW5lbC1iYXNlLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3BhbmVsLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3N0YWNrLWNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy92YWx1ZXMuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL01hZ2ljYVBhbmVsL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJNYWdpY2FQYW5lbFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJNYWdpY2FQYW5lbFwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcblxyXG4vKipcclxuICog44GZ44G544Gm44Gu6Kaq44Go44Gq44KL6KaB57Sg44CC44OE44Oq44O85LiK44GrMeOBpOS4gOeVquimquOBq+OBruOBv+WIqeeUqOOBp+OBjeOCi+OAglxyXG4gKiDjgqbjgqPjg7Pjg4njgqbjga/jgZPjga7kuK3jgZfjgYvnp7vli5XjgafjgY3jgarjgYTjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VDb250YWluZXIgZXh0ZW5kcyBQYW5lbEJhc2Vcclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IEJhc2VDb250YWluZXJPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAnYmFzZScsXHJcbiAgICAgICAgb3ZlcmZsb3dYOiAnc2Nyb2xsJyxcclxuICAgICAgICBvdmVyZmxvd1k6ICdzY3JvbGwnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOBmeOBueOBpuOBruimquOBqOOBquOCi+imgee0oOOAglxyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSAgICAgICAgICAgICAgICBlbGVtZW50ICAg6Ieq6Lqr44KS6KGo56S644GZ44KLSFRNTOimgee0oFxyXG4gICAgICogQHBhcmFtIHsgQmFzZUNvbnRhaW5lck9wdGlvbnMgfSAgICAgICBvcHRzICAgICAg44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuICDlrZDopoHntKAo44K544K/44OD44Kv44Gv5YWI6aCtMeOBruOBv+ODu+WIneWbnui1t+WLleaZguOBrui/veWKoOOBruOBv+ioseWPrylcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGVsZW1lbnQsIG9wdHMgPSBCYXNlQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcihlbGVtZW50LCBPYmplY3QuYXNzaWduKG9wdHMsIEJhc2VDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCAuLi5CYXNlQ29udGFpbmVyLnNhbml0aXplQ2hpbGRyZW4oY2hpbGRyZW4pKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC13cmFwcGVyJyk7XHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ294LXMnKTtcclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3ktcycpO1xyXG5cclxuICAgICAgICB0aGlzLmlubmVyLmNsYXNzTmFtZSA9ICdtYWdpY2EtcGFuZWwtYmFzZSc7XHJcbiAgICAgICAgaWYgKG9wdHMuYWRkaXRpb25hbENsYXNzTmFtZXMpIHRoaXMuaW5uZXIuY2xhc3NMaXN0LmFkZCguLi5vcHRzLmFkZGl0aW9uYWxDbGFzc05hbWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2V0UmVzaXplRXZlbXQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6rjgrXjgqTjgrrjgqTjg5njg7Pjg4jjgpLoqK3lrprjgZfjgb7jgZnjgIJcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW0g44Kk44OZ44Oz44OI44K/44O844Ky44OD44OIXHJcbiAgICAgKi9cclxuICAgIF9zZXRSZXNpemVFdmVtdCAoZWxlbSkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1yZWN0ID0ge3g6IGVsZW0uY2xpZW50V2lkdGgsIHk6IGVsZW0uY2xpZW50SGVpZ2h0fTtcclxuICAgICAgICBjb25zdCBkaXNwYXRjaGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZWxlbS5jbGllbnRXaWR0aCAhPT0gdGhpcy5fZWxlbXJlY3QueFxyXG4gICAgICAgICAgICB8fCBlbGVtLmNsaWVudEhlaWdodCAhPT0gdGhpcy5fZWxlbXJlY3QueSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbXJlY3QgPSB7eDogZWxlbS5jbGllbnRXaWR0aCwgeTogZWxlbS5jbGllbnRIZWlnaHR9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHRoaXMuX2VsZW1yZWN0fSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKFBhbmVsQmFzZS53aW5kb3cuUmVzaXplT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm8gPSBuZXcgUGFuZWxCYXNlLndpbmRvdy5SZXNpemVPYnNlcnZlcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByby5vYnNlcnZlKGVsZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIFBhbmVsQmFzZS53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZigpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a2Q6KaB57Sg44Gu6YWN5YiX44GM5q2j44GX44GE5qeL5oiQ44Gr44Gq44KL44KI44GG44Gr5qSc6Ki844O744OV44Kj44Or44K/44GX44G+44GZ44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgKFN0YWNrQ29udGFpbmVyIHwgUGFuZWwpW10gfSBjaGlsZHJlblxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2FuaXRpemVDaGlsZHJlbiAoY2hpbGRyZW4pIHtcclxuICAgICAgICBjb25zdCBzdGFjayA9IGNoaWxkcmVuLmZpbmQoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3N0YWNrJyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICAgICAgaWYgKHN0YWNrKSByZXN1bHQucHVzaChzdGFjayk7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goLi4uY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5vcHRzLnR5cGUgPT09ICdwYW5lbCcpKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a2Q6KaB57Sg44Gu56e75YuV44Gr6L+95b6T44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIGNoaWxkTW92ZUhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyB8fCB0aGlzLm9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBjb25zdCByZWN0cyA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoZSA9PiBlLnJpZ2h0ICsgdGhpcy5lbGVtZW50LnNjcm9sbExlZnQpKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVjdC5yaWdodCA8IG1heFgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLndpZHRoID0gYCR7bWF4WCAtIHRoaXMuaW5uZXIuY2xpZW50TGVmdH1weGA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50UmVjdC5yaWdodCA+IG1heFgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLndpZHRoID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcChlID0+IGUuYm90dG9tICsgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWN0LmJvdHRvbSA8IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9IGAke21heFkgLSB0aGlzLmlubmVyLmNsaWVudFRvcH1weGA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50UmVjdC5ib3R0b20gPiBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2NoaWxkcmVubW92ZScsIHtkZXRhaWw6IHsuLi5ldnQuZGV0YWlsLCB0YXJnZXQ6IGV2dC50YXJnZXR9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZWRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hpbGRyZW5tb3ZlZCcsIHtkZXRhaWw6IHsuLi5ldnQuZGV0YWlsLCB0YXJnZXQ6IGV2dC50YXJnZXR9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTWluaW1pemVkSGFuZGxlciAoKSB7XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVuaWNvcm4vbm8tYXJyYXktZm9yLWVhY2hcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZpbHRlcihlID0+IGUuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkuZm9yRWFjaCgodmFsdWUsIGNvdW50ZXIpID0+IHtcclxuICAgICAgICAgICAgdmFsdWUuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dmFsdWUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdLndpZHRoICogY291bnRlcn1weGA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGROb3JtYWxpemVkSGFuZGxlciAoKSB7XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVuaWNvcm4vbm8tYXJyYXktZm9yLWVhY2hcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZpbHRlcihlID0+IGUuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkuZm9yRWFjaCgodmFsdWUsIGNvdW50ZXIpID0+IHtcclxuICAgICAgICAgICAgdmFsdWUuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dmFsdWUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdLndpZHRoICogY291bnRlcn1weGA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFZhbHVlIGZyb20gJy4vdmFsdWVzLmpzJztcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBDb29yZGluYXRpb25PcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7IG51bWJlciB9IHggWOaWueWQkSjmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IG51bWJlciB9IHkgWeaWueWQkSjmjIflrprjgYzjgYLjgozjgbApXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIFJlc2l6ZWFibGVPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSBlbmFibGUgICAgICAg44Om44O844K25pON5L2c44Gu5pyJ5Yq544O754Sh5Yq5XHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSBzaG93VGl0bGViYXIg6YGp55So5pmC44Gr44K/44Kk44OI44Or44OQ44O844KS6KGo56S644GZ44KL44GLXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIFBhbmVsT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyAncGFuZWwnIH0gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgbWluU2l6ZSAgICAgICAgICAgICDmnIDlsI/jgqbjgqPjg7Pjg4njgqblhoXjgrPjg7Pjg4bjg7Pjg4TjgrXjgqTjgroo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIG1heFNpemUgICAgICAgICAgICAg5pyA5aSn44Km44Kj44Oz44OJ44Km5YaF44Kz44Oz44OG44Oz44OE44K144Kk44K6KOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBwb3NpdGlvbiAgICAgICAgICAgIOWIneacn+S9jee9rijlt6bkuIopXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgZGVmYXVsdFNpemUgICAgICAgICDliJ3mnJ/jgrXjgqTjgrooMzIweDI0MCwg44K/44Kk44OI44Or44OQ44O844CB44Km44Kj44Oz44OJ44Km5p6g57ea5ZCr44G+44GaKVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfCBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgIHRpdGxlICAgICAgICAgICAgICAg44K/44Kk44OI44OrXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VhYmxlICAgICAgICAgICDjg5Djg4Tjg5zjgr/jg7PjgpLlh7rnj77jgZXjgZvjgotcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pbWFibGUgICAgICAgICAgIOacgOWwj+WMluODnOOCv+ODs+OCkuWHuuePvuOBleOBm+OCi1xyXG4gKiBAcHJvcGVydHkgeyBSZXNpemVhYmxlT3B0aW9ucyB9ICAgICAgICAgICAgICAgIG1heGltdW0gICAgICAgICAgICAg5pyA5aSn5YyW44Gu5oyZ5YuVXHJcbiAqIEBwcm9wZXJ0eSB7ICdtb2RhbCcgfCAnbW9kYWxlc3MnIHwgJ3RvcE1vc3QnIH0gbW9kYWwgICAgICAgICAgICAgICDjg6Ljg7zjg4Djg6vooajnpLrnirbmhYtcclxuICogQHByb3BlcnR5IHsgJ3Njcm9sbCcgfCAncmVzaXplJyB8ICdoaWRkZW4nIH0gICBvdmVyZmxvd1ggICAgICAgICAgIOWGheWuueOCs+ODs+ODhuODs+ODhOOBjFjou7jjgavmuqLjgozjgZ/loLTlkIhcclxuICogQHByb3BlcnR5IHsgJ3Njcm9sbCcgfCAncmVzaXplJyB8ICdoaWRkZW4nIH0gICBvdmVyZmxvd1kgICAgICAgICAgIOWGheWuueOCs+ODs+ODhuODs+ODhOOBjFnou7jjgavmuqLjgozjgZ/loLTlkIhcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIH0gICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lIOODkeODjeODq+OBq+i/veWKoOOBp+S7mOOBkeOCi+OCr+ODqeOCueWQjVxyXG4gKiBAcHJvcGVydHkgeyBhbnlbXSB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgICAgICAgICAg5Lu75oSP44Gr5oyH5a6a44Gn44GN44KL5bGe5oCnXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmICBTdGFja0NvbnRhaW5lck9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ3N0YWNrJyB9ICAgICAgICAgICAgICAgICAgICB0eXBlICAgICAgICAgICAgICAgIOODkeODjeODq+eoruWIpVxyXG4gKiBAcHJvcGVydHkgeyAndmVydGljYWwnIHwgJ2hvcml6b250YWwnICB9IGRpcmVjdGlvbiAgICAgICAgICAg5YiG5Ymy5pa55ZCRXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZ1tdIH0gICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgICAgICAgICAgICDjgrPjg6zjgq/jgrfjg6fjg7PlkITopoHntKDjga7liJ3mnJ/jgrXjgqTjgrpcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICByZXByb3BvcnRpb25hYmxlICAgIOOCs+ODrOOCr+OCt+ODp+ODs+OBruavlOeOh+OCkuaTjeS9nOOBp+OBjeOCi+OBi1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgIGRvY2thYmxlICAgICAgICAgICAg44Kz44Os44Kv44K344On44Oz44Gu6ISx552A5pON5L2c44GM44Gn44GN44KL44GLKOODpuODvOOCtuaTjeS9nOOBi+OCiSlcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0gICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3JXaWR0aCAgICAgIOWIhuWJsuWig+eVjOe3muOBruW5hSgx772eKVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfSAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWUg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB8IEhUTUxFbGVtZW50IH0gICAgICAgcGFuZWxBZGRBcmVhICAgICAgICDjgrnjgr/jg4Pjgq/lhoXjgYznqbrjga7jgajjgY3jgavooajnpLrjgZXjgozjgovjg5Hjg43jg6vov73liqDjgqLjgqTjgrPjg7NcclxuICogQHByb3BlcnR5IHsgYW55W10gfSAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzICAgICAgICAgIOS7u+aEj+OBq+aMh+WumuOBp+OBjeOCi+WxnuaAp1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBCYXNlQ29udGFpbmVyT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyAnYmFzZScgfSAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1ggICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxY6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1kgICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxZ6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZ1tdIH0gICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lcyDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbEJhc2UgZXh0ZW5kcyBFdmVudFRhcmdldFxyXG57XHJcbiAgICBzdGF0aWMgX2luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgc3RhdGljIHdpbmRvdztcclxuICAgIHN0YXRpYyBkb2N1bWVudDtcclxuICAgIHN0YXRpYyBDdXN0b21FdmVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB8IFN0YWNrUGFuZWxPcHRpb25zIHwgQmFzZUNvbnRhaW5lck9wdGlvbnMgfSBvcHRzXHJcbiAgICAgKiBAcGFyYW0geyAoUGFuZWxCYXNlIHwgSFRNTEVsZW1lbnQpW10gfSBjaGlsZHJlblxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm91dGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZVBhcmVudEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTWluaW1pemVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9yZXNpemVQYXJlbnRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVBhcmVudEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIC8vIOiHqui6q+imgee0oOOCkuWIneacn+WMluOBmeOCi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kKHRoaXMuX2lubmVyKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUgeyBQYW5lbEJhc2UgfCB1bmRlZmluZWQgfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoIVBhbmVsQmFzZS5faW5pdGlhbGl6ZWQpIFBhbmVsQmFzZS5pbml0KCk7XHJcbiAgICAgICAgUGFuZWxCYXNlLl9pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHsgUGFuZWxPcHRpb25zIHwgU3RhY2tQYW5lbE9wdGlvbnMgfCBCYXNlQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIGdldCBvcHRzICgpIHtcclxuICAgICAgICBjb25zdCB7dGl0bGUsIC4uLm90aGVyfSA9IHRoaXMuX29wdHM7XHJcbiAgICAgICAgY29uc3Qgb3B0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3RoZXIpKTtcclxuICAgICAgICBpZiAodGl0bGUpIG9wdHMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gb3B0cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZWxlbWVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlubmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qeL56+J44GZ44KL44Gf44KB44Gu5Yid5pyf5YyW44Oh44K944OD44OJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0ICgpIHtcclxuICAgICAgICBQYW5lbEJhc2UuYXBwZW5kU3R5bGVFbGVtZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K544K/44Kk44Or44KS44OY44OD44OA44Gr6L+95Yqg44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhcHBlbmRTdHlsZUVsZW1lbnRzICgpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gVmFsdWUuc3R5bGU7XHJcbiAgICAgICAgY29uc3QgcmVmID0gUGFuZWxCYXNlLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlLCBsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKTtcclxuICAgICAgICBpZiAocmVmKSB7XHJcbiAgICAgICAgICAgIFBhbmVsQmFzZS5kb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShzdHlsZSwgcmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFBhbmVsQmFzZS5kb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhcmVudCAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbG9zZScsIHRoaXMuX2Nsb3NlUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWw7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYXBwZW5kKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIHRoaXMuX2Nsb3NlUGFyZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGFuZ2VwYXJlbnQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcih1bmRlZmluZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZUhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1pbmltaXplZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTm9ybWFsaXplZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGFuZ2VwYXJlbnQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUgKHZhbCkge1xyXG4gICAgICAgICh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKGUgPT4gZSAhPT0gdmFsKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQgKHZhbCwgcmVmKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IHJlZj8ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmluc2VydEJlZm9yZSh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQsIG5leHQpO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudCkuZmluZEluZGV4KGUgPT4gZS5uZXh0RWxlbWVudFNpYmxpbmcgPT09IHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnNwbGljZShpZHggKyAxLCAwLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuYXBwZW5kKHZhbC5vdXRlciA/PyB2YWwuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlJywgdGhpcy5fY2hpbGRNb3ZlSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdmVkJywgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtaW5pbWl6ZWQnLCB0aGlzLl9jaGlsZE1pbmltaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdub3JtYWxpemVkJywgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VwYXJlbnQnLCB2YWwuX2NoYW5nZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlICgpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2Nsb3NlJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB0aGlzLl9wYXJlbnQubW9kaWZ5WkluZGV4KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGlmeVpJbmRleCAoYWN0aXZlKSB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93cyA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUub3B0cy50eXBlID09PSAncGFuZWwnKTtcclxuICAgICAgICBpZiAod2luZG93cy5pbmNsdWRlcyhhY3RpdmUpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSB3aW5kb3dzLmZpbHRlcihlID0+IGUgIT09IGFjdGl2ZSkuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEuZWxlbWVudC5zdHlsZS56SW5kZXggPz8gJzAnKSAtIE51bWJlcihiLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykpO1xyXG4gICAgICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICAgICAgZm9yICg7IGlkeCA8IHRhcmdldHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGFyZ2V0c1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gYCR7aWR4fWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZS5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxudHJ5IHtcclxuICAgIFBhbmVsQmFzZS53aW5kb3cgPSB3aW5kb3c7XHJcbiAgICBQYW5lbEJhc2UuZG9jdW1lbnQgPSBkb2N1bWVudDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG4gICAgUGFuZWxCYXNlLkhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuSW1hZ2UgPSBJbWFnZTtcclxufVxyXG5jYXRjaCB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkN1c3RvbUV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkhUTUxFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gdW5kZWZpbmVkO1xyXG59XHJcbiIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuaW1wb3J0IEJhc2VDb250YWluZXIgZnJvbSAnLi9iYXNlLWNvbnRhaW5lci5qcyc7XHJcblxyXG4vKipcclxuICogVUnjgpLmoLzntI3jgZnjgovjg5Hjg43jg6vjgqjjg6rjgqLjgILjgqbjgqPjg7Pjg4njgqbooajnpLrjg7vjgbvjgYvjg5Hjg43jg6vjgbjjga7moLzntI3jgYzlj6/og71cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBQYW5lbE9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdwYW5lbCcsXHJcbiAgICAgICAgcG9zaXRpb246IHt4OiAwLCB5OiAwfSxcclxuICAgICAgICBtaW5TaXplOiB7eDogMTIwLCB5OiAwfSxcclxuICAgICAgICBkZWZhdWx0U2l6ZToge3g6IDMyMCwgeTogMjQwfSxcclxuICAgICAgICB0aXRsZTogJycsXHJcbiAgICAgICAgY2xvc2VhYmxlOiB0cnVlLFxyXG4gICAgICAgIGF1dG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICBtaW5pbWFibGU6IHRydWUsXHJcbiAgICAgICAgbWF4aW11bToge2VuYWJsZTogdHJ1ZSwgc2hvd1RpdGxlYmFyOiB0cnVlfSxcclxuICAgICAgICBkZWZhdWx0TW9kZTogJ25vcm1hbCcsXHJcbiAgICAgICAgbW9kYWw6ICdtb2RhbGVzcycsXHJcbiAgICAgICAgb3ZlcmZsb3dYOiAnc2Nyb2xsJyxcclxuICAgICAgICBvdmVyZmxvd1k6ICdzY3JvbGwnLFxyXG4gICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWU6ICcnLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km44O744Oa44Kk44Oz6KGo56S644GM5Y+v6IO9XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgUGFuZWxPcHRpb25zIH0gICAgICAgICAgICBvcHRzICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfCBQYW5lbEJhc2UgfSBjb250ZW50IOWGheWuueOCs+ODs+ODhuODs+ODhFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3B0cyA9IFBhbmVsLkRFRkFVTFRfT1BUSU9OUywgY29udGVudCkge1xyXG4gICAgICAgIHN1cGVyKFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgT2JqZWN0LmFzc2lnbihvcHRzLCBQYW5lbC5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIGNvbnRlbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXdpbmRvdycpO1xyXG4gICAgICAgIHRoaXMuaW5uZXIuY2xhc3NOYW1lID0gJ21hZ2ljYS1wYW5lbC1pbm5lcic7XHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveC1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmNsYXNzTGlzdC5hZGQoJ295LXMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmRlZmF1bHRNb2RlID09PSAnbm9ybWFsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS53aWR0aCA9IGAke29wdHMuZGVmYXVsdFNpemUueH1weGA7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLnN0eWxlLmhlaWdodCA9IGAke29wdHMuZGVmYXVsdFNpemUueX1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFBhbmVsQmFzZS5IVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCv+OCpOODiOODq+ODkOODvOOCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IHRpdGxlYmFyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cz8udGl0bGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gb3B0cy50aXRsZTtcclxuICAgICAgICAgICAgdGl0bGViYXIuYXBwZW5kKHNwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3B0cz8udGl0bGUgPT09ICdvYmplY3QnICYmIG9wdHMudGl0bGUgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGl0bGViYXIuYXBwZW5kKG9wdHMudGl0bGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhciA9IHRpdGxlYmFyO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRpdGxlYmFyLCB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC10aXRsZWJhcicpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1heGltdW0uc2hvd1RpdGxlYmFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGViYXIuY2xhc3NMaXN0LmFkZCgnbWF4aW11bS1kaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpO1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IFBhbmVsQmFzZS5JbWFnZSgpLCAwLCAwKTtcclxuICAgICAgICAgICAgZXYuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCAncGFuZWwnKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2FkZFJlc2l6ZUFyZWEoKTtcclxuXHJcbiAgICAgICAgLy8g44Oc44K/44Oz44Ko44Oq44Ki44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgYnV0dG9uYXJlYSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBidXR0b25hcmVhLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24tYXJlYScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoYnV0dG9uYXJlYSk7XHJcblxyXG4gICAgICAgIC8vIOmWieOBmOOCi+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IGNsb3NlYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNsb3NlYnV0dG9uLnRleHRDb250ZW50ID0gJ8OXJztcclxuICAgICAgICBjbG9zZWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uJywgJ2Nsb3NlJyk7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdHMuY2xvc2VhYmxlKSB7XHJcbiAgICAgICAgICAgIGNsb3NlYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJ1dHRvbmFyZWEuYXBwZW5kKGNsb3NlYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5aSn5YyWL+W+qeWFg+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IG1heGltdW1idXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi50ZXh0Q29udGVudCA9ICfinZAnO1xyXG4gICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdtYXhpbXVtJyk7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21heGltdW0nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF4aW11bSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1heGltdW0uZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xvc2VidXR0b24uYmVmb3JlKG1heGltdW1idXR0b24pO1xyXG5cclxuICAgICAgICAvLyDmnIDlsI/ljJYv5b6p5YWD44Oc44K/44Oz44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgbWluaW11bWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLnRleHRDb250ZW50ID0gJy0nO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdtaW5pbXVtJyk7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWluaW11bSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1pbmltYWJsZSkge1xyXG4gICAgICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1heGltdW1idXR0b24uYmVmb3JlKG1pbmltdW1idXR0b24pO1xyXG5cclxuICAgICAgICAvLyDjg6Ljg7zjg4Djg6tcclxuICAgICAgICBpZiAodGhpcy5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b3Btb3N0Jyk7XHJcbiAgICAgICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5vcHRzLnBvc2l0aW9uLnh9cHhgO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLm9wdHMucG9zaXRpb24ueX1weGA7XHJcbiAgICAgICAgdGhpcy5hZGp1c3RXaW5kb3dQb3NpdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9hZGRSZXNpemVBcmVhICgpIHtcclxuICAgICAgICAvLyDjg6rjgrXjgqTjgrrpoJjln5/jgpLov73liqBcclxuICAgICAgICB0aGlzLmVkZ2VzID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgW1sndG9wJ10sIFsnYm90dG9tJ10sIFsnbGVmdCddLCBbJ3JpZ2h0J10sIFsndG9wJywgJ2xlZnQnXSwgWyd0b3AnLCAncmlnaHQnXSwgWydib3R0b20nLCAnbGVmdCddLCBbJ2JvdHRvbScsICdyaWdodCddXSkge1xyXG4gICAgICAgICAgICBjb25zdCBlZGdlID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBlZGdlLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1lZGdlJywgLi4udGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChlZGdlKTtcclxuICAgICAgICAgICAgZWRnZS5kcmFnZ2FibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVBcmVhSGFuZGxlcihldik7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4gZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgSW1hZ2UoKSwgMCwgMCksIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5lZGdlc1t0YXJnZXRdID0gZWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9yZXNpemVBcmVhSGFuZGxlciAoZXYpIHtcclxuICAgICAgICBpZiAoZXYudHlwZSA9PT0gJ21vdXNlZG93bicgfHwgZXYudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCwgeTogZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWX07XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0cmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldi50eXBlID09PSAnZHJhZydcclxuICAgICAgICB8fCBldi50eXBlID09PSAndG91Y2htb3ZlJykge1xyXG4gICAgICAgICAgICBpZiAoKGV2LnNjcmVlblkgPz8gZXYudG91Y2hlcz8uWzBdPy5zY3JlZW5ZKSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvcCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fc3RhcnRyZWN0LmhlaWdodCArIHRoaXMuX2NsaWNrc3RhcnQueSAtIChldi5wYWdlWSA/PyBldi50b3VjaGVzWzBdLnBhZ2VZKSAtIDEwO1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxUb3AgKyB0aGlzLl9zdGFydHJlY3QuYm90dG9tIC0gaGVpZ2h0IC0gdGhpcy50aXRsZWJhci5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3N0YXJ0cmVjdC5oZWlnaHQgKyAoZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWSkgLSB0aGlzLl9jbGlja3N0YXJ0LnkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyB0aGlzLl9jbGlja3N0YXJ0LnggLSAoZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggPD0gdGhpcy5vcHRzLm1pblNpemUueD8gdGhpcy5vcHRzLm1pblNpemUueDogd2lkdGggPj0gKHRoaXMub3B0cy5tYXhTaXplPy54ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueDogd2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIHRoaXMuX3N0YXJ0cmVjdC5yaWdodCAtIHdpZHRofXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3N0YXJ0cmVjdC53aWR0aCArIChldi5wYWdlWCA/PyBldi50b3VjaGVzWzBdLnBhZ2VYKSAtIHRoaXMuX2NsaWNrc3RhcnQueCAtIDEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRoIDw9IHRoaXMub3B0cy5taW5TaXplLng/IHRoaXMub3B0cy5taW5TaXplLng6IHdpZHRoID49ICh0aGlzLm9wdHMubWF4U2l6ZT8ueCA/PyBJbmZpbml0eSk/IHRoaXMub3B0cy5tYXhTaXplLng6IHdpZHRofXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKioqXHJcbiAgICAgKiBAcGFyYW0geyBNb3VzZUV2ZW50IH0gZXZcclxuICAgICAqL1xyXG4gICAgX21vdmVUaXRsZWJhckhhbmRsZXIgKGV2KSB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBCYXNlQ29udGFpbmVyKVxyXG4gICAgICAgIHx8IHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAndG91Y2hzdGFydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBldi50YXJnZXQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYub2Zmc2V0WCA/PyAoZXYudG91Y2hlc1swXS5wYWdlWCAtIHJlY3QubGVmdCksIHk6IGV2Lm9mZnNldFkgPz8gKGV2LnRvdWNoZXNbMF0ucGFnZVkgLSByZWN0LnRvcCl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNobW92ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhdGVzdFRvdWNoRXYgPSBldjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAnZHJhZyc6IHtcclxuICAgICAgICAgICAgICAgIGlmICgoZXYuc2NyZWVuWSA/PyBldi50b3VjaGVzPy5bMF0/LnNjcmVlblkpID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgpKSAtIHRoaXMuX2NsaWNrc3RhcnQueH1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7KHRoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVkpKSAtIHRoaXMuX2NsaWNrc3RhcnQueX1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZScsIHtkZXRhaWw6IHtyZWN0OiB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSwgZXYsIHRhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAndG91Y2hlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICBldiA9IHRoaXMuX2xhdGVzdFRvdWNoRXY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZWQnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0V2luZG93UG9zaXRpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXTtcclxuICAgICAgICBpZiAoIWN1cnJlbnRSZWN0IHx8ICF0aGlzLnBhcmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQgPiB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgJiYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCkgPCBjdXJyZW50UmVjdC5ib3R0b20pIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCAtIHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoID4gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgICAgICAgJiYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoKSA8IGN1cnJlbnRSZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50V2lkdGggLSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGh9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRSZWN0LmxlZnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFJlY3QudG9wIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1heGltdW0gKCkge1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXT8ubGVmdCA/PyAwO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21heGltdW0nKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsICh4KSB7XHJcbiAgICAgICAgbGV0IHJhdGlvID0gMDtcclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgcmF0aW8gPSAoeCAtIHJlY3QubGVmdCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21pbmltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF4aW11bScpO1xyXG5cclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHcgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NsaWNrc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQueCA9IHcgKiByYXRpbztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtNYXRoLnJvdW5kKHggLSAodyAqIHJhdGlvKSl9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9sZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5fbGVmdH1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbm9ybWFsaXplZCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBtaW5pbXVtICgpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0/LmxlZnQgPz8gMDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF4aW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21pbmltaXplZCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKF9ldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21heGltdW0nKSAmJiAhdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0V2luZG93UG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBzdXBlci5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2dCk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5tb2RhbCA9PT0gJ21vZGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1tb2RhbC1ibG9ja2VyJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLm91dGVyLCB0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChyZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGBjYWxjKDUwJSAtICR7cmVjdC53aWR0aCAvIDJ9cHgpYDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgY2FsYyg1MCUgLSAke3JlY3QuaGVpZ2h0IC8gMn1weClgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFBhbmVsQmFzZSBmcm9tICcuL3BhbmVsLWJhc2UuanMnO1xyXG5cclxuLyoqXHJcbiAqIOWeguebtOOBvuOBn+OBr+awtOW5s+aWueWQkeOBuOOBruaVtOWIl+OChOOCv+ODluWIh+OCiuabv+OBiOOBq+OCiOOCi+ODkeODjeODq+OBruOCueOCpOODg+ODgSgz5YCL44Gu44GG44Gh44GE44Ga44KM44GLMeOBpCnjgpLmj5DkvpvjgZfjgb7jgZnjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWNrQ29udGFpbmVyIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBTdGFja0NvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdzdGFjaycsXHJcbiAgICAgICAgZGlyZWN0aW9uOiAndmVydGljYWwnLFxyXG4gICAgICAgIHJlcHJvcG9ydGlvbmFibGU6IHRydWUsXHJcbiAgICAgICAgZG9ja2FibGU6IHRydWUsXHJcbiAgICAgICAgc2VwYXJhdG9yV2lkdGg6IDIsXHJcbiAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZTogJycsXHJcbiAgICAgICAgYXR0cmlidXRlczogW10sXHJcbiAgICAgICAgdGVtcGxhdGU6IHVuZGVmaW5lZCxcclxuICAgICAgICBwYW5lbEFkZEFyZWE6IHVuZGVmaW5lZCxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuagvOe0jeOBmeOCi+ODkeODjeODq+OCqOODquOCouOAguOCpuOCo+ODs+ODieOCpuODu+ODmuOCpOODs+ihqOekuuOBjOWPr+iDvVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IFN0YWNrQ29udGFpbmVyT3B0aW9ucyB9ICAgICAgb3B0cyAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW4g5YaF5a6544Kz44Oz44OG44Oz44OEXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChvcHRzID0gU3RhY2tDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgT2JqZWN0LmFzc2lnbihvcHRzLCBTdGFja0NvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIC4uLmNoaWxkcmVuKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzLm9wdHMudGVtcGxhdGUpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlcicpO1xyXG4gICAgICAgIHRoaXMuaW5uZXIuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyJyk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdob3Jpem9udGFsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0YWInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5hZGRhcmVhcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRhcmVhcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFkZEFyZWEgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGFkZEFyZWEuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicsICdlbXB0eScpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5wYW5lbEFkZEFyZWEgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBcmVhLmFwcGVuZCh0aGlzLm9wdHMucGFuZWxBZGRBcmVhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZEFyZWEudGV4dENvbnRlbnQgPSB0aGlzLm9wdHMucGFuZWxBZGRBcmVhID8/IHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICfilqQnIDogJ+KWpSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChhZGRBcmVhKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChhZGRBcmVhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21vdmVoYW5kbGVyID0gZXZ0ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubW9kYWwgIT09ICdtb2RhbGVzcycpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWSA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbFRvcCArIChldnQuZGV0YWlsLmV2LnBhZ2VZID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWCA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbExlZnQgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWCA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVgpO1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAoZWxlbVJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IGVsZW1SZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAmJiBlbGVtUmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IGVsZW1SZWN0LnJpZ2h0XHJcbiAgICAgICAgICAgICYmIGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubWF4aW11bS5lbmFibGUgPT09IHRydWUgJiYgdGhpcy5vcHRzLmRvY2thYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGFyZWEgb2YgdGhpcy5hZGRhcmVhcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGFkZGFyZWEuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWN0ICYmIHJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IHJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICAgICAmJiByZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgcmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX21vdmVkaGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVkgPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxUb3AgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWSA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVkpO1xyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVggPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2dC5kZXRhaWwuZXYucGFnZVggPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbVJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1SZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCBlbGVtUmVjdC5ib3R0b21cclxuICAgICAgICAgICAgJiYgZWxlbVJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCBlbGVtUmVjdC5yaWdodFxyXG4gICAgICAgICAgICAmJiBldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1heGltdW0uZW5hYmxlID09PSB0cnVlICYmIHRoaXMub3B0cy5kb2NrYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhZGRhcmVhIG9mIHRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09PSBhZGRhcmVhLnBhcmVudEVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB8fCBldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50Lm5leHRFbGVtZW50U2libGluZyA9PT0gYWRkYXJlYS5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmRldGFpbC50YXJnZXQucGFyZW50ICE9PSB0aGlzLnJvb3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBhZGRhcmVhLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QgJiYgcmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgcmVjdC5ib3R0b21cclxuICAgICAgICAgICAgICAgICAgICAmJiByZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgcmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0cmVmID0gdGhpcy5lbGVtZW50LmNvbnRhaW5zKGFkZGFyZWEuY2xvc2VzdCgnLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lcicpKT8gYWRkYXJlYS5wYXJlbnRFbGVtZW50OiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9IGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhcmVudCAodmFsKSB7XHJcbiAgICAgICAgc3VwZXIucGFyZW50ID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhcmVudEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHN1cGVyLmNoYW5nZVBhcmVudEhhbmRsZXIoZXZ0KTtcclxuICAgICAgICBpZiAodGhpcy5yb290KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZScsIHRoaXMuX21vdmVoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlZCcsIHRoaXMuX21vdmVkaGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5hZGRFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmUnLCB0aGlzLl9tb3ZlaGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5hZGRFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmVkJywgdGhpcy5fbW92ZWRoYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHRoaXMucm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kICh2YWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWRkYXJlYXMpIHRoaXMuYWRkYXJlYXMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5pbm5lci5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VwID0gdGhpcy5fZ2VuZXJhdGVTZXBhcmF0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRhcmVhcy5wdXNoKHNlcC5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuYXBwZW5kKHNlcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmFuZ2VzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbG9zZXN0KCdib2R5JykpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2luZG93UmFuZ2UgPSB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2U7XHJcbiAgICAgICAgICAgIHJhbmdlcyA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXT8uW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSA/PyBlLm9wdHM/LmRlZmF1bHRTaXplW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd5JzogJ3gnXSA/PyAxMDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3RyZWYpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50KS5pbmRleE9mKHRoaXMuX2xhc3RyZWYucHJldmlvdXNFbGVtZW50U2libGluZyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnNlcnRUYXJnZXRSYW5nZSA9ICgocmFuZ2VzW2lkeF0gPz8gMCkgKyAocmFuZ2VzW2lkeCArIDFdID8/IDApKSAvIDI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnNlcnRSYW5nZSA9IE1hdGgubWluKGluc2VydFRhcmdldFJhbmdlLCB3aW5kb3dSYW5nZSkgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAofmlkeCAmJiByYW5nZXNbaWR4ICsgMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbc21hbGxJZHgsIGxhcmdlSWR4XSA9IHJhbmdlc1tpZHhdID4gcmFuZ2VzW2lkeCArIDFdPyBbaWR4ICsgMSwgaWR4XTogW2lkeCwgaWR4ICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSByYW5nZXNbc21hbGxJZHhdIC8gcmFuZ2VzW2xhcmdlSWR4XTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbWFsbFNpemUgPSBNYXRoLnJvdW5kKGluc2VydFJhbmdlIC8gMiAqIHJhdGlvKTtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZXNbc21hbGxJZHhdIC09IHNtYWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZXNbbGFyZ2VJZHhdIC09IChpbnNlcnRSYW5nZSAtIHNtYWxsU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh+aWR4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2lkeF0gLT0gaW5zZXJ0UmFuZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZXNbaWR4ICsgMV0gLT0gaW5zZXJ0UmFuZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmFuZ2VzLnNwbGljZShpZHggKyAxLCAwLCBpbnNlcnRSYW5nZSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJhbmdlcyA9IHJhbmdlcy5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5hcHBlbmQodmFsLCB0aGlzLl9sYXN0cmVmKTtcclxuICAgICAgICBpZiAodmFsLm1heGltdW0pIHZhbC5tYXhpbXVtKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcCA9IHRoaXMuX2dlbmVyYXRlU2VwYXJhdG9yKCk7XHJcbiAgICAgICAgdGhpcy5hZGRhcmVhcy5wdXNoKHNlcC5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgaWYgKHZhbC5lbGVtZW50Lm5leHRFbGVtZW50U2libGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmluc2VydEJlZm9yZShzZXAsIHZhbC5lbGVtZW50Lm5leHRFbGVtZW50U2libGluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChzZXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VtcHR5Jyk7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbG9zZXN0KCdib2R5JykpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCByYW5nZXMubGVuZ3RoID09PSAwPyB1bmRlZmluZWQ6IHJhbmdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcmFuZ2VzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddKS5maWx0ZXIoZSA9PiBlICE9PSB1bmRlZmluZWQpO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gcmFuZ2VzLnJlZHVjZSgoYSwgYykgPT4gYSArIGMsIDApO1xyXG4gICAgICAgIGNvbnN0IHJhdGlvcyA9IHJhbmdlcy5tYXAoZSA9PiBlIC8gdG90YWwpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9IHRoaXMuaW5uZXIuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gLSAodGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoICogKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICsgMSkpO1xyXG4gICAgICAgIHJhbmdlcyA9IHJhdGlvcy5tYXAoZSA9PiBNYXRoLnJvdW5kKGUgKiBjdXJyZW50V2lkdGgpKTtcclxuICAgICAgICByYW5nZXMucG9wKCk7XHJcbiAgICAgICAgcmFuZ2VzLnB1c2goY3VycmVudFdpZHRoIC0gcmFuZ2VzLnJlZHVjZSgoYSwgYykgPT4gYSArIGMsIDApKTtcclxuICAgICAgICByYW5nZXMgPSByYW5nZXMubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIGlmIChyYW5nZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICh2YWwpIHtcclxuICAgICAgICBsZXQgcmFuZ2VzID0gdHlwZW9mIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9PT0gJ29iamVjdCc/IHRoaXMuX2xhc3RUYXJnZXRSYW5nZTogdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddKTtcclxuICAgICAgICBpZiAocmFuZ2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKHZhbCk7XHJcbiAgICAgICAgICAgIGlmICghcmFuZ2VzW2lkeCAtIDFdICYmIHJhbmdlc1tpZHggKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCArIDFdICs9IHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFyYW5nZXNbaWR4ICsgMV0gJiYgcmFuZ2VzW2lkeCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbaWR4IC0gMV0gKz0gcmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocmFuZ2VzW2lkeCArIDFdICYmIHJhbmdlc1tpZHggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW3NtYWxsSWR4LCBsYXJnZUlkeF0gPSByYW5nZXNbaWR4IC0gMV0gPiByYW5nZXNbaWR4ICsgMV0/IFtpZHggKyAxLCBpZHggLSAxXTogW2lkeCAtIDEsIGlkeCArIDFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSByYW5nZXNbc21hbGxJZHhdIC8gcmFuZ2VzW2xhcmdlSWR4XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNtYWxsU2l6ZSA9IE1hdGgucm91bmQoKHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKSAvIDIgKiByYXRpbyk7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbc21hbGxJZHhdICs9IHNtYWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tsYXJnZUlkeF0gKz0gKHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKSAtIHNtYWxsU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLmZpbHRlcigoX2UsIGkpID0+IGkgIT09IGlkeCkubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBzdXBlci5yZW1vdmUodmFsKTtcclxuICAgICAgICBpZiAodGhpcy5pbm5lci5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRhcmVhcy5maWx0ZXIoZSA9PiBlICE9PSB0aGlzLmlubmVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5jaGlsZHJlblswXS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcz8ubGVuZ3RoID09PSAwPyB1bmRlZmluZWQ6IHJhbmdlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgX2NhbGNHcmlkU2l6ZSAoc2VwLCBwb3MsIHRlbXBsYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2dyaWRUZW1wbGF0ZVJvd3MnOiAnZ3JpZFRlbXBsYXRlQ29sdW1ucyc7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFNpemVzID0gdGVtcGxhdGUgPz8gdGhpcy5pbm5lci5zdHlsZVt0YXJnZXRdLnNwbGl0KCcgJykuZmlsdGVyKGUgPT4gZSAhPT0gJycpLmZpbHRlcigoX2UsIGkpID0+IGkgJSAyICE9PSAwKTtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZVt0YXJnZXRdID0gJyc7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjdXJyZW50U2l6ZXNbMF0gPSAnMWZyJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZXAgJiYgc2VwLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgc2VwLm5leHRFbGVtZW50U2libGluZyAmJiBwb3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCBicm9zID0gQXJyYXkuZnJvbSh0aGlzLmlubmVyLmNoaWxkcmVuKS5maWx0ZXIoZSA9PiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZJZHggPSBicm9zLmluZGV4T2Yoc2VwLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0SWR4ID0gYnJvcy5pbmRleE9mKHNlcC5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2UmVjdCA9IHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRSZWN0ID0gc2VwLm5leHRFbGVtZW50U2libGluZy5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByZXZSYW5nZSA9IHBvcyAtICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBwcmV2UmVjdC50b3A6IHByZXZSZWN0LmxlZnQgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpO1xyXG4gICAgICAgICAgICBsZXQgZnJGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChwcmV2UmFuZ2UgPD0gMCAmJiB0aGlzLmNoaWxkcmVuW3ByZXZJZHhdLm9wdHMubWluaW1hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBmckZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYDBweGA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnYm90dG9tJzogJ3JpZ2h0J10gLSBwcmV2UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAndG9wJzogJ2xlZnQnXSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2UmFuZ2UgPSB0aGlzLmNoaWxkcmVuW3ByZXZJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gPiBwcmV2UmFuZ2UgPyB0aGlzLmNoaWxkcmVuW3ByZXZJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gOiBwcmV2UmFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG5leHRSYW5nZSA9ICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBuZXh0UmVjdC5ib3R0b206IG5leHRSZWN0LnJpZ2h0KSAtICgodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gcHJldlJlY3QudG9wOiBwcmV2UmVjdC5sZWZ0KSArIHByZXZSYW5nZSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCkgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIGlmIChuZXh0UmFuZ2UgPD0gMCAmJiB0aGlzLmNoaWxkcmVuW25leHRJZHhdLm9wdHMubWluaW1hYmxlICYmICFmckZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGZyRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSBgJHtuZXh0UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnYm90dG9tJzogJ3JpZ2h0J10gLSBwcmV2UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAndG9wJzogJ2xlZnQnXSAgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gYDBweGA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0UmFuZ2UgPSB0aGlzLmNoaWxkcmVuW25leHRJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gPiBuZXh0UmFuZ2UgPyB0aGlzLmNoaWxkcmVuW25leHRJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gOiBuZXh0UmFuZ2U7XHJcbiAgICAgICAgICAgICAgICBwcmV2UmFuZ2UgPSBuZXh0UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnYm90dG9tJzogJ3JpZ2h0J10gLSBwcmV2UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAndG9wJzogJ2xlZnQnXSAtIG5leHRSYW5nZSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFmckZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cHJldlJhbmdlfXB4YDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmFuZ2V9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cHJldlJhbmdlfXB4YDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmFuZ2V9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaWR4KyspIGlmIChjdXJyZW50U2l6ZXNbaWR4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTaXplcy5wdXNoKCcxZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnRTaXplcy5zcGxpY2UodGhpcy5jaGlsZHJlbi5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XSA9IGAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weCAke2N1cnJlbnRTaXplcy5qb2luKGAgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHggYCl9ICR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4YDtcclxuICAgIH1cclxuXHJcbiAgICBfZ2VuZXJhdGVTZXBhcmF0b3IgKCkge1xyXG4gICAgICAgIGNvbnN0IGVsZW0gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yJyk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsZW0uc3R5bGVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddID0gYCR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4YDtcclxuICAgICAgICBlbGVtLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgaW5uZXIgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgaW5uZXIuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYScpO1xyXG4gICAgICAgIGVsZW0uYXBwZW5kKGlubmVyKTtcclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGV2ID0+IHtcclxuICAgICAgICAgICAgZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgSW1hZ2UoKSwgMCwgMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2LnNjcmVlblkgPT09IDAgfHwgdGhpcy5vcHRzLnJlcHJvcG9ydGlvbmFibGUgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUoZXYudGFyZ2V0LCB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBldi5wYWdlWSA6IGV2LnBhZ2VYKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldi50b3VjaGVzWzBdPy5zY3JlZW5ZID09PSAwIHx8IHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKGV2LnRhcmdldCwgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gZXYudG91Y2hlc1swXS5wYWdlWSA6IGV2LnRvdWNoZXNbMF0ucGFnZVgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZWxlbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOBruenu+WLleOBq+i/veW+k+OBl+OBvuOBmeOAglxyXG4gICAgICovXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyIChldnQpIHtcclxuICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSk7XHJcbiAgICAgICAgZXZ0LmRldGFpbC50YXJnZXQubm9ybWFsKChldnQuZGV0YWlsLmV2LnBhZ2VYID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWCkpO1xyXG4gICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCA9IHRoaXMucm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcm9vdCAoKSB7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcclxuICAgICAgICB3aGlsZSAocGFyZW50Py5wYXJlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgIH1cclxufVxyXG4iLCJjb25zdCBzdHlsZSA9IGBcclxuLm1hZ2ljYS1wYW5lbC13cmFwcGVyIHtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13cmFwcGVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13cmFwcGVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1iYXNlIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIG1pbi13aWR0aDogMTAwJTtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHBhZGRpbmc6IDRweDtcclxuICAgIGJhY2tncm91bmQ6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtdGl0bGViYXIge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgaGVpZ2h0OiAxLjVyZW07XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBjYWxjKDIuNXJlbSAqIDMpO1xyXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC10aXRsZWJhci5tYXhpbXVtLWRpc2FibGUge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIH4gLm1hZ2ljYS1wYW5lbC1idXR0b24tYXJlYSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXRpdGxlYmFyID4gKiB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICBwYWRkaW5nOiAxcHg7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtaW5uZXIub3gtcyB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5sZWZ0IHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5yaWdodCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiA0cHg7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmxlZnQ6YWN0aXZlLFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UucmlnaHQ6YWN0aXZlIHtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wIHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGhlaWdodDogNHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcDphY3RpdmUsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b206YWN0aXZlIHtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLmxlZnQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AucmlnaHQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ubGVmdCxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5yaWdodCB7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiA0cHg7XHJcbiAgICB0b3A6IHVuc2V0O1xyXG4gICAgbGVmdDogdW5zZXQ7XHJcbiAgICByaWdodDogdW5zZXQ7XHJcbiAgICBib3R0b206IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLmxlZnQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGN1cnNvbDogbndzZS1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AucmlnaHQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBjdXJzb2w6IG5lc3ctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLmxlZnQge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGN1cnNvbDogbmVzdy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ucmlnaHQge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBjdXJzb2w6IG53c2UtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIHtcclxuICAgIHBhZGRpbmc6IDBweDtcclxuICAgIHRvcDogMCAhaW1wb3J0YW50O1xyXG4gICAgbGVmdDogMCAhaW1wb3J0YW50O1xyXG4gICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIC5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIC5tYWdpY2EtcGFuZWwtdGl0bGViYXIge1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAycHgpICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDEuNXJlbSAtIDZweCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIH4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJweCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSB7XHJcbiAgICB3aWR0aDogMTg2cHg7XHJcbiAgICBib3R0b206IDAgIWltcG9ydGFudDtcclxuICAgIHRvcDogdW5zZXQgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cudG9wbW9zdCB7XHJcbiAgICB6LWluZGV4OiA2NTUzNSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLW1vZGFsLWJsb2NrZXIge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwuNSk7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB6LWluZGV4OiA2NTUzNSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtID4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtID4gLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uIHtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB3aWR0aDogMi41cmVtO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5kZW55IHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmNsb3NlIHtcclxuICAgIGJhY2tncm91bmQ6ICM3MDE5MTk7XHJcbn1cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uY2xvc2Uub25hY3RpdmUge1xyXG4gICAgYmFja2dyb3VuZDogI2U2MzIzMjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgei1pbmRleDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbWlkbmlnaHRibHVlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgei1pbmRleDogMTAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLmVtcHR5IHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIG1hcmdpbjogYXV0bztcclxuICAgIHRvcDogNTAlO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICBmb250LXNpemU6IDNyZW07XHJcbiAgICB3aWR0aDogNXJlbTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIG9wYWNpdHk6IDAuNTtcclxuICAgIHVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjUsMjUsMTEyLCAwLjMpO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMTByZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGxlZnQ6IC01cmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpmaXJzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGxlZnQ6IDA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmxhc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICByaWdodDogMDtcclxuICAgIGxlZnQ6IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwcmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgdG9wOiAtNXJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmZpcnN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgdG9wOiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6bGFzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHRvcDogdW5zZXQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpOT1QoLmhvdmVyKTpOT1QoLmRpc2FibGUpOk5PVCg6Zmlyc3Qtb2YtdHlwZSk6Tk9UKDpsYXN0LW9mLXR5cGUpOmhvdmVyIHtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpOT1QoLmhvdmVyKTpOT1QoLmRpc2FibGUpOk5PVCg6Zmlyc3Qtb2YtdHlwZSk6Tk9UKDpsYXN0LW9mLXR5cGUpOmhvdmVyIHtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5lbXB0eSkge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Zlci5lbXB0eSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5lbXB0eSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5ob3ZlciB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRvcDogdW5zZXQgIWltcG9ydGFudDtcclxuICAgIGxlZnQgdW5zZXQgIWltcG9ydGFudDtcclxuICAgIHotaW5kZXg6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC1idXR0b24ubWF4aW11bSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtYnV0dG9uLm1pbmltdW0ge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5gO1xyXG5cclxuY29uc3QgVmFsdWUgPSB7XHJcbiAgICBzdHlsZSxcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoVmFsdWUpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVmFsdWU7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGJhc2VDb250YWluZXIgZnJvbSAnLi9iYXNlLWNvbnRhaW5lci5qcyc7XHJcbmltcG9ydCBwYW5lbCBmcm9tICcuL3BhbmVsLmpzJztcclxuaW1wb3J0IHN0YWNrQ29udGFpbmVyIGZyb20gJy4vc3RhY2stY29udGFpbmVyLmpzJztcclxuXHJcbmV4cG9ydCBjb25zdCBCYXNlQ29udGFpbmVyID0gYmFzZUNvbnRhaW5lcjtcclxuZXhwb3J0IGNvbnN0IFBhbmVsID0gcGFuZWw7XHJcbmV4cG9ydCBjb25zdCBTdGFja0NvbnRhaW5lciA9IHN0YWNrQ29udGFpbmVyO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBCYXNlQ29udGFpbmVyLFxyXG4gICAgUGFuZWwsXHJcbiAgICBTdGFja0NvbnRhaW5lcixcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9