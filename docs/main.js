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
        super(element, Object.assign(opts, BaseContainer.DEFAULT_OPTIONS, {...opts}), ['magica-panel-wrapper'], ['magica-panel-base'], ...BaseContainer.sanitizeChildren(children));

        if (opts.overflowX === 'scroll') this.element.classList.add('ox-s');
        if (opts.overflowY === 'scroll') this.element.classList.add('oy-s');

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
    constructor (element, opts, elementClasses = [], innerClasses = [], ...children) {
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
        this._element.classList.add(...elementClasses);
        // 自身要素を初期化する
        for (const child of Array.from(element.children)) {
            child.remove();
        }

        this._inner = PanelBase.document.createElement('div');
        this._inner.classList.add(...innerClasses);
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
        this.fixedsize = false;

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
        }

        this.changeParentHandler(undefined);
    }

    resizeParentHandler () {
        if (this.element.closest('body') && (this.parent.opts.type === 'base' || this.parent.fixedsize)) this.fixedsize = true;
        this.dispatchEvent(new PanelBase.CustomEvent('resize', {detail: {target: this}}));
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
        this.dispatchEvent(new PanelBase.CustomEvent('resize', {detail: {target: this}}));
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
        super(_panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div'), Object.assign(opts, Panel.DEFAULT_OPTIONS, {...opts}), ['magica-panel-window'], ['magica-panel-inner'], content);

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

        super.resizeParentHandler();
    }

    changeParentHandler (evt) {
        super.changeParentHandler(evt);
        if (this.opts.modal === 'modal') {
            if (!this.outer) {
                this.outer = _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div');
                this.outer.classList.add('magica-panel-modal-blocker');
                this.element.parentElement.insertBefore(this.outer, this.element);
            }
            this.outer.append(this.element);
            const rect = this.element.getClientRects()[0];
            if (rect) {
                this.element.style.left = `calc(50% - ${rect.width / 2}px)`;
                this.element.style.top = `calc(50% - ${rect.height / 2}px)`;
            }
        }

        super.resizeParentHandler();
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
        super(_panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement('div'), Object.assign(opts, StackContainer.DEFAULT_OPTIONS, {...opts}), ['magica-panel-stack-wrapper'], ['magica-panel-stack-inner'], ...children);

        if (this.opts.adjustSize === false) {
            this.opts.reproportionable = false;
        }

        this._calcGridSize(undefined, undefined, this.opts.template);
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
            this._calcGridSize();
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
        if (this.parent.opts.type === 'base' || this.parent.fixedsize) this.fixedsize = true;

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
        if (!this.parent?.fixedsize && this.parent?.opts?.type !== 'base') return;
        if ((!this.opts.template || this.opts.template?.length === this.children.length) && !this._gridInit) template = this.opts.template;

        this._gridInit = true;

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
        this.fixedsize = true;
        this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('resize', {detail: {target: this}}));
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
    overflow: hidden;
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
    z-index: 100;
    position: relative;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGtFQUFxQixZQUFZLFNBQVMsY0FBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUpBQXlKO0FBQ3BNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUpBQXlKO0FBQ3BNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pELCtDQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQSwrQ0FBK0MsVUFBVTtBQUN6RCwrQ0FBK0MsVUFBVTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0QkFBNEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLEtBQUssc0JBQXNCLHlCQUF5QixPQUFPLEVBQUUseUJBQXlCO0FBQ3JKO0FBQ0EsK0JBQStCLGtFQUFxQixZQUFZLFNBQVMsY0FBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkVBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UseUJBQXlCO0FBQ3hHO0FBQ0Esc0JBQXNCLDZFQUFnQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3hYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLEtBQUssRUFBQzs7Ozs7OztVQzNYckI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTmdEO0FBQ2pCO0FBQ21CO0FBQ2xEO0FBQ08sc0JBQXNCLDBEQUFhO0FBQ25DLGNBQWMsaURBQUs7QUFDbkIsdUJBQXVCLDJEQUFjO0FBQzVDLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2Jhc2UtY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3BhbmVsLWJhc2UuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvcGFuZWwuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvc3RhY2stY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3ZhbHVlcy5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1hZ2ljYVBhbmVsXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1hZ2ljYVBhbmVsXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDjgZnjgbnjgabjga7opqrjgajjgarjgovopoHntKDjgILjg4Tjg6rjg7zkuIrjgasx44Gk5LiA55Wq6Kaq44Gr44Gu44G/5Yip55So44Gn44GN44KL44CCXHJcbiAqIOOCpuOCo+ODs+ODieOCpuOBr+OBk+OBruS4reOBl+OBi+enu+WLleOBp+OBjeOBquOBhOOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUNvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgQmFzZUNvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdiYXNlJyxcclxuICAgICAgICBvdmVyZmxvd1g6ICdzY3JvbGwnLFxyXG4gICAgICAgIG92ZXJmbG93WTogJ3Njcm9sbCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44GZ44G544Gm44Gu6Kaq44Go44Gq44KL6KaB57Sg44CCXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgICAgIGVsZW1lbnQgICDoh6rouqvjgpLooajnpLrjgZnjgotIVE1M6KaB57SgXHJcbiAgICAgKiBAcGFyYW0geyBCYXNlQ29udGFpbmVyT3B0aW9ucyB9ICAgICAgIG9wdHMgICAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW4gIOWtkOimgee0oCjjgrnjgr/jg4Pjgq/jga/lhYjpoK0x44Gu44G/44O75Yid5Zue6LW35YuV5pmC44Gu6L+95Yqg44Gu44G/6Kix5Y+vKVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cyA9IEJhc2VDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIE9iamVjdC5hc3NpZ24ob3B0cywgQmFzZUNvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIFsnbWFnaWNhLXBhbmVsLXdyYXBwZXInXSwgWydtYWdpY2EtcGFuZWwtYmFzZSddLCAuLi5CYXNlQ29udGFpbmVyLnNhbml0aXplQ2hpbGRyZW4oY2hpbGRyZW4pKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ294LXMnKTtcclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3ktcycpO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5hZGRpdGlvbmFsQ2xhc3NOYW1lcykgdGhpcy5pbm5lci5jbGFzc0xpc3QuYWRkKC4uLm9wdHMuYWRkaXRpb25hbENsYXNzTmFtZXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9zZXRSZXNpemVFdmVtdChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODquOCteOCpOOCuuOCpOODmeODs+ODiOOCkuioreWumuOBl+OBvuOBmeOAglxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbSDjgqTjg5njg7Pjg4jjgr/jg7zjgrLjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgX3NldFJlc2l6ZUV2ZW10IChlbGVtKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbXJlY3QgPSB7eDogZWxlbS5jbGllbnRXaWR0aCwgeTogZWxlbS5jbGllbnRIZWlnaHR9O1xyXG4gICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtLmNsaWVudFdpZHRoICE9PSB0aGlzLl9lbGVtcmVjdC54XHJcbiAgICAgICAgICAgIHx8IGVsZW0uY2xpZW50SGVpZ2h0ICE9PSB0aGlzLl9lbGVtcmVjdC55KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtcmVjdCA9IHt4OiBlbGVtLmNsaWVudFdpZHRoLCB5OiBlbGVtLmNsaWVudEhlaWdodH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDogdGhpcy5fZWxlbXJlY3R9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoUGFuZWxCYXNlLndpbmRvdy5SZXNpemVPYnNlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBybyA9IG5ldyBQYW5lbEJhc2Uud2luZG93LlJlc2l6ZU9ic2VydmVyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJvLm9ic2VydmUoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGFuZWxCYXNlLndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBmKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7phY3liJfjgYzmraPjgZfjgYTmp4vmiJDjgavjgarjgovjgojjgYbjgavmpJzoqLzjg7vjg5XjgqPjg6vjgr/jgZfjgb7jgZnjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUNoaWxkcmVuIChjaGlsZHJlbikge1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gY2hpbGRyZW4uZmluZChlID0+IGUub3B0cy50eXBlID09PSAnc3RhY2snKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoc3RhY2spIHJlc3VsdC5wdXNoKHN0YWNrKTtcclxuICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJykpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3RzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcChlID0+IGUucmlnaHQgKyB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0IDwgbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHttYXhYIC0gdGhpcy5pbm5lci5jbGllbnRMZWZ0fXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKGUgPT4gZS5ib3R0b20gKyB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlY3QuYm90dG9tIDwgbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7bWF4WSAtIHRoaXMuaW5uZXIuY2xpZW50VG9wfXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LmJvdHRvbSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hpbGRyZW5tb3ZlJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNb3ZlZEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGlsZHJlbm1vdmVkJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgVmFsdWUgZnJvbSAnLi92YWx1ZXMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIENvb3JkaW5hdGlvbk9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geCBY5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geSBZ5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUmVzaXplYWJsZU9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IGVuYWJsZSAgICAgICDjg6bjg7zjgrbmk43kvZzjga7mnInlirnjg7vnhKHlirlcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IHNob3dUaXRsZWJhciDpgannlKjmmYLjgavjgr/jgqTjg4jjg6vjg5Djg7zjgpLooajnpLrjgZnjgovjgYtcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUGFuZWxPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdwYW5lbCcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBtaW5TaXplICAgICAgICAgICAgIOacgOWwj+OCpuOCo+ODs+ODieOCpuWGheOCs+ODs+ODhuODs+ODhOOCteOCpOOCuijmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgbWF4U2l6ZSAgICAgICAgICAgICDmnIDlpKfjgqbjgqPjg7Pjg4njgqblhoXjgrPjg7Pjg4bjg7Pjg4TjgrXjgqTjgroo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIHBvc2l0aW9uICAgICAgICAgICAg5Yid5pyf5L2N572uKOW3puS4iilcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBkZWZhdWx0U2l6ZSAgICAgICAgIOWIneacn+OCteOCpOOCuigzMjB4MjQwLCDjgr/jgqTjg4jjg6vjg5Djg7zjgIHjgqbjgqPjg7Pjg4njgqbmnqDnt5rlkKvjgb7jgZopXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB8IEhUTUxFbGVtZW50IH0gICAgICAgICAgICAgdGl0bGUgICAgICAgICAgICAgICDjgr/jgqTjg4jjg6tcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWFibGUgICAgICAgICAgIOODkOODhOODnOOCv+ODs+OCkuWHuuePvuOBleOBm+OCi1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYWJsZSAgICAgICAgICAg5pyA5bCP5YyW44Oc44K/44Oz44KS5Ye654++44GV44Gb44KLXHJcbiAqIEBwcm9wZXJ0eSB7IFJlc2l6ZWFibGVPcHRpb25zIH0gICAgICAgICAgICAgICAgbWF4aW11bSAgICAgICAgICAgICDmnIDlpKfljJbjga7mjJnli5VcclxuICogQHByb3BlcnR5IHsgJ21vZGFsJyB8ICdtb2RhbGVzcycgfCAndG9wTW9zdCcgfSBtb2RhbCAgICAgICAgICAgICAgIOODouODvOODgOODq+ihqOekuueKtuaFi1xyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WCAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WSAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWUg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgIFN0YWNrQ29udGFpbmVyT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyAnc3RhY2snIH0gICAgICAgICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7ICd2ZXJ0aWNhbCcgfCAnaG9yaXpvbnRhbCcgIH0gZGlyZWN0aW9uICAgICAgICAgICDliIblibLmlrnlkJFcclxuICogQHByb3BlcnR5IHsgc3RyaW5nW10gfSAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSAgICAgICAgICAgIOOCs+ODrOOCr+OCt+ODp+ODs+WQhOimgee0oOOBruWIneacn+OCteOCpOOCulxyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgIHJlcHJvcG9ydGlvbmFibGUgICAg44Kz44Os44Kv44K344On44Oz44Gu5q+U546H44KS5pON5L2c44Gn44GN44KL44GLXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgZG9ja2FibGUgICAgICAgICAgICDjgrPjg6zjgq/jgrfjg6fjg7Pjga7ohLHnnYDmk43kvZzjgYzjgafjgY3jgovjgYso44Om44O844K25pON5L2c44GL44KJKVxyXG4gKiBAcHJvcGVydHkgeyBudW1iZXIgfSAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcldpZHRoICAgICAg5YiG5Ymy5aKD55WM57ea44Gu5bmFKDHvvZ4pXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB9ICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZSDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICogQHByb3BlcnR5IHsgc3RyaW5nIHwgSFRNTEVsZW1lbnQgfSAgICAgICBwYW5lbEFkZEFyZWEgICAgICAgIOOCueOCv+ODg+OCr+WGheOBjOepuuOBruOBqOOBjeOBq+ihqOekuuOBleOCjOOCi+ODkeODjeODq+i/veWKoOOCouOCpOOCs+ODs1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgIGFkanVzdFNpemUgICAgICAgICAg6Kaq6KaB57Sg44Oq44K144Kk44K65pmC44KE44Kz44Os44Kv44K344On44Oz44Gu5aKX5rib5pmC44Gr6Ieq5YuV55qE44Gr5ZCE44Kz44Os44Kv44K344On44Oz44KS44Oq44K144Kk44K644GZ44KL44GLXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQmFzZUNvbnRhaW5lck9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ2Jhc2UnIH0gICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAgIOODkeODjeODq+eoruWIpVxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdoaWRkZW4nIH0gb3ZlcmZsb3dYICAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdoaWRkZW4nIH0gb3ZlcmZsb3dZICAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZXMg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxCYXNlIGV4dGVuZHMgRXZlbnRUYXJnZXRcclxue1xyXG4gICAgc3RhdGljIF9pbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICAgIHN0YXRpYyB3aW5kb3c7XHJcbiAgICBzdGF0aWMgZG9jdW1lbnQ7XHJcbiAgICBzdGF0aWMgQ3VzdG9tRXZlbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0geyBQYW5lbE9wdGlvbnMgfCBTdGFja1BhbmVsT3B0aW9ucyB8IEJhc2VDb250YWluZXJPcHRpb25zIH0gb3B0c1xyXG4gICAgICogQHBhcmFtIHsgKFBhbmVsQmFzZSB8IEhUTUxFbGVtZW50KVtdIH0gY2hpbGRyZW5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGVsZW1lbnQsIG9wdHMsIGVsZW1lbnRDbGFzc2VzID0gW10sIGlubmVyQ2xhc3NlcyA9IFtdLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMub3V0ZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlUGFyZW50SGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZE1vdmVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE1vdmVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNb3ZlSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE1vdmVIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZE1pbmltaXplZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTm9ybWFsaXplZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplUGFyZW50SGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fb3B0cyA9IG9wdHM7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKC4uLmVsZW1lbnRDbGFzc2VzKTtcclxuICAgICAgICAvLyDoh6rouqvopoHntKDjgpLliJ3mnJ/ljJbjgZnjgotcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgY2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pbm5lciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKC4uLmlubmVyQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmQodGhpcy5faW5uZXIpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4gdGhpcy5hY3RpdmUoKSk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKCkgPT4gdGhpcy5hY3RpdmUoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikgaWYgKGNoaWxkIGluc3RhbmNlb2YgUGFuZWxCYXNlKSB7XHJcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAdHlwZSB7IFBhbmVsQmFzZSB8IHVuZGVmaW5lZCB9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZml4ZWRzaXplID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghUGFuZWxCYXNlLl9pbml0aWFsaXplZCkgUGFuZWxCYXNlLmluaXQoKTtcclxuICAgICAgICBQYW5lbEJhc2UuX2luaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4geyBQYW5lbE9wdGlvbnMgfCBTdGFja1BhbmVsT3B0aW9ucyB8IEJhc2VDb250YWluZXJPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgZ2V0IG9wdHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHt0aXRsZSwgLi4ub3RoZXJ9ID0gdGhpcy5fb3B0cztcclxuICAgICAgICBjb25zdCBvcHRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvdGhlcikpO1xyXG4gICAgICAgIGlmICh0aXRsZSkgb3B0cy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHJldHVybiBvcHRzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBlbGVtZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5uZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2hpbGRyZW4gKCkge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5fY2hpbGRyZW5dO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVUnjgpLmp4vnr4njgZnjgovjgZ/jgoHjga7liJ3mnJ/ljJbjg6Hjgr3jg4Pjg4lcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXQgKCkge1xyXG4gICAgICAgIFBhbmVsQmFzZS5hcHBlbmRTdHlsZUVsZW1lbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjgr/jgqTjg6vjgpLjg5jjg4Pjg4Djgavov73liqDjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFwcGVuZFN0eWxlRWxlbWVudHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBWYWx1ZS5zdHlsZTtcclxuICAgICAgICBjb25zdCByZWYgPSBQYW5lbEJhc2UuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3R5bGUsIGxpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpO1xyXG4gICAgICAgIGlmIChyZWYpIHtcclxuICAgICAgICAgICAgUGFuZWxCYXNlLmRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCByZWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgUGFuZWxCYXNlLmRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcGFyZW50ICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmUodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVQYXJlbnRIYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgdGhpcy5fY2xvc2VQYXJlbnRIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbDtcclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5hcHBlbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVQYXJlbnRIYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgdGhpcy5fY2xvc2VQYXJlbnRIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcih1bmRlZmluZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpICYmICh0aGlzLnBhcmVudC5vcHRzLnR5cGUgPT09ICdiYXNlJyB8fCB0aGlzLnBhcmVudC5maXhlZHNpemUpKSB0aGlzLmZpeGVkc2l6ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZUhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTW92ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1pbmltaXplZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTm9ybWFsaXplZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGFuZ2VwYXJlbnQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICh2YWwpIHtcclxuICAgICAgICAodmFsLm91dGVyID8/IHZhbC5lbGVtZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUgIT09IHZhbCk7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdmUnLCB0aGlzLl9jaGlsZE1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZWQnLCB0aGlzLl9jaGlsZE1vdmVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21pbmltaXplZCcsIHRoaXMuX2NoaWxkTWluaW1pemVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ25vcm1hbGl6ZWQnLCB0aGlzLl9jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZXBhcmVudCcsIHZhbC5fY2hhbmdlUGFyZW50SGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kICh2YWwsIHJlZikge1xyXG4gICAgICAgIGNvbnN0IG5leHQgPSByZWY/Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5pbnNlcnRCZWZvcmUodmFsLm91dGVyID8/IHZhbC5lbGVtZW50LCBuZXh0KTtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmZpbmRJbmRleChlID0+IGUubmV4dEVsZW1lbnRTaWJsaW5nID09PSByZWYpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoaWR4ICsgMSwgMCwgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmFwcGVuZCh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSAoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQYW5lbEJhc2UpIHtcclxuICAgICAgICAgICAgY2hpbGQuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjbG9zZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkgdGhpcy5fcGFyZW50Lm1vZGlmeVpJbmRleCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RpZnlaSW5kZXggKGFjdGl2ZSkge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLl9jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJyk7XHJcbiAgICAgICAgaWYgKHdpbmRvd3MuaW5jbHVkZXMoYWN0aXZlKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRzID0gd2luZG93cy5maWx0ZXIoZSA9PiBlICE9PSBhY3RpdmUpLnNvcnQoKGEsIGIpID0+IE51bWJlcihhLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykgLSBOdW1iZXIoYi5lbGVtZW50LnN0eWxlLnpJbmRleCA/PyAnMCcpKTtcclxuICAgICAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoOyBpZHggPCB0YXJnZXRzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldHNbaWR4XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhY3RpdmUuZWxlbWVudC5zdHlsZS56SW5kZXggPSBgJHtpZHh9YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbnRyeSB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gd2luZG93O1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gZG9jdW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50O1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gSW1hZ2U7XHJcbn1cclxuY2F0Y2gge1xyXG4gICAgUGFuZWxCYXNlLndpbmRvdyA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5kb2N1bWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5JbWFnZSA9IHVuZGVmaW5lZDtcclxufVxyXG4iLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcbmltcG9ydCBCYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5cclxuLyoqXHJcbiAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km6KGo56S644O744G744GL44OR44ON44Or44G444Gu5qC857SN44GM5Y+v6IO9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgUGFuZWxPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAncGFuZWwnLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7eDogMCwgeTogMH0sXHJcbiAgICAgICAgbWluU2l6ZToge3g6IDEyMCwgeTogMH0sXHJcbiAgICAgICAgZGVmYXVsdFNpemU6IHt4OiAzMjAsIHk6IDI0MH0sXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIGNsb3NlYWJsZTogdHJ1ZSxcclxuICAgICAgICBhdXRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgbWluaW1hYmxlOiB0cnVlLFxyXG4gICAgICAgIG1heGltdW06IHtlbmFibGU6IHRydWUsIHNob3dUaXRsZWJhcjogdHJ1ZX0sXHJcbiAgICAgICAgZGVmYXVsdE1vZGU6ICdub3JtYWwnLFxyXG4gICAgICAgIG1vZGFsOiAnbW9kYWxlc3MnLFxyXG4gICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXHJcbiAgICAgICAgb3ZlcmZsb3dZOiAnc2Nyb2xsJyxcclxuICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lOiAnJyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuagvOe0jeOBmeOCi+ODkeODjeODq+OCqOODquOCouOAguOCpuOCo+ODs+ODieOCpuODu+ODmuOCpOODs+ihqOekuuOBjOWPr+iDvVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB9ICAgICAgICAgICAgb3B0cyAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IEhUTUxFbGVtZW50IHwgUGFuZWxCYXNlIH0gY29udGVudCDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9wdHMgPSBQYW5lbC5ERUZBVUxUX09QVElPTlMsIGNvbnRlbnQpIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgUGFuZWwuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCBbJ21hZ2ljYS1wYW5lbC13aW5kb3cnXSwgWydtYWdpY2EtcGFuZWwtaW5uZXInXSwgY29udGVudCk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuY2xhc3NMaXN0LmFkZCgnb3gtcycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveS1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5kZWZhdWx0TW9kZSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuc3R5bGUud2lkdGggPSBgJHtvcHRzLmRlZmF1bHRTaXplLnh9cHhgO1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtvcHRzLmRlZmF1bHRTaXplLnl9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgr/jgqTjg4jjg6vjg5Djg7zjgpLov73liqBcclxuICAgICAgICBjb25zdCB0aXRsZWJhciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IG9wdHMudGl0bGU7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChzcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnb2JqZWN0JyAmJiBvcHRzLnRpdGxlIGluc3RhbmNlb2YgUGFuZWxCYXNlLkhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChvcHRzLnRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGViYXIgPSB0aXRsZWJhcjtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZSh0aXRsZWJhciwgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtdGl0bGViYXInKTtcclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLnNob3dUaXRsZWJhcikge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21heGltdW0tZGlzYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4ge1xyXG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5ldyBQYW5lbEJhc2UuSW1hZ2UoKSwgMCwgMCk7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgJ3BhbmVsJyk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9hZGRSZXNpemVBcmVhKCk7XHJcblxyXG4gICAgICAgIC8vIOODnOOCv+ODs+OCqOODquOCouOCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbmFyZWEgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgYnV0dG9uYXJlYS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGJ1dHRvbmFyZWEpO1xyXG5cclxuICAgICAgICAvLyDplonjgZjjgovjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBjbG9zZWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjbG9zZWJ1dHRvbi50ZXh0Q29udGVudCA9ICfDlyc7XHJcbiAgICAgICAgY2xvc2VidXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdjbG9zZScpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLmNsb3NlYWJsZSkge1xyXG4gICAgICAgICAgICBjbG9zZWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBidXR0b25hcmVhLmFwcGVuZChjbG9zZWJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vIOacgOWkp+WMli/lvqnlhYPjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBtYXhpbXVtYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIG1heGltdW1idXR0b24udGV4dENvbnRlbnQgPSAn4p2QJztcclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnbWF4aW11bScpO1xyXG4gICAgICAgIG1heGltdW1idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1heGltdW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLmVuYWJsZSkge1xyXG4gICAgICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlYnV0dG9uLmJlZm9yZShtYXhpbXVtYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5bCP5YyWL+W+qeWFg+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IG1pbmltdW1idXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi50ZXh0Q29udGVudCA9ICctJztcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnbWluaW11bScpO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmltdW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5taW5pbWFibGUpIHtcclxuICAgICAgICAgICAgbWluaW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmJlZm9yZShtaW5pbXVtYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g44Oi44O844OA44OrXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndG9wbW9zdCcpO1xyXG4gICAgICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICAgICAgbWF4aW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMub3B0cy5wb3NpdGlvbi54fXB4YDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5vcHRzLnBvc2l0aW9uLnl9cHhgO1xyXG4gICAgICAgIHRoaXMuYWRqdXN0V2luZG93UG9zaXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBfYWRkUmVzaXplQXJlYSAoKSB7XHJcbiAgICAgICAgLy8g44Oq44K144Kk44K66aCY5Z+f44KS6L+95YqgXHJcbiAgICAgICAgdGhpcy5lZGdlcyA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIFtbJ3RvcCddLCBbJ2JvdHRvbSddLCBbJ2xlZnQnXSwgWydyaWdodCddLCBbJ3RvcCcsICdsZWZ0J10sIFsndG9wJywgJ3JpZ2h0J10sIFsnYm90dG9tJywgJ2xlZnQnXSwgWydib3R0b20nLCAncmlnaHQnXV0pIHtcclxuICAgICAgICAgICAgY29uc3QgZWRnZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgZWRnZS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtZWRnZScsIC4uLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoZWRnZSk7XHJcbiAgICAgICAgICAgIGVkZ2UuZHJhZ2dhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpO1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB0aGlzLl9yZXNpemVBcmVhSGFuZGxlcihldikpO1xyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGV2ID0+IGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRnZXNbdGFyZ2V0XSA9IGVkZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKipcclxuICAgICAqIEBwYXJhbSB7IE1vdXNlRXZlbnQgfSBldlxyXG4gICAgICovXHJcbiAgICBfcmVzaXplQXJlYUhhbmRsZXIgKGV2KSB7XHJcbiAgICAgICAgaWYgKGV2LnR5cGUgPT09ICdtb3VzZWRvd24nIHx8IGV2LnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xyXG4gICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0ID0ge3g6IGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgsIHk6IGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVl9O1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXYudHlwZSA9PT0gJ2RyYWcnXHJcbiAgICAgICAgfHwgZXYudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcclxuICAgICAgICAgICAgaWYgKChldi5zY3JlZW5ZID8/IGV2LnRvdWNoZXM/LlswXT8uc2NyZWVuWSkgPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b3AnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX3N0YXJ0cmVjdC5oZWlnaHQgKyB0aGlzLl9jbGlja3N0YXJ0LnkgLSAoZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWSkgLSAxMDtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCA8PSB0aGlzLm9wdHMubWluU2l6ZS55PyB0aGlzLm9wdHMubWluU2l6ZS55OiBoZWlnaHQgPj0gKHRoaXMub3B0cy5tYXhTaXplPy55ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueTogaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsVG9wICsgdGhpcy5fc3RhcnRyZWN0LmJvdHRvbSAtIGhlaWdodCAtIHRoaXMudGl0bGViYXIuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2JvdHRvbScpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9zdGFydHJlY3QuaGVpZ2h0ICsgKGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVkpIC0gdGhpcy5fY2xpY2tzdGFydC55IC0gMTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodCA8PSB0aGlzLm9wdHMubWluU2l6ZS55PyB0aGlzLm9wdHMubWluU2l6ZS55OiBoZWlnaHQgPj0gKHRoaXMub3B0cy5tYXhTaXplPy55ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueTogaGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fc3RhcnRyZWN0LndpZHRoICsgdGhpcy5fY2xpY2tzdGFydC54IC0gKGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgpIC0gMTA7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHdpZHRoIDw9IHRoaXMub3B0cy5taW5TaXplLng/IHRoaXMub3B0cy5taW5TaXplLng6IHdpZHRoID49ICh0aGlzLm9wdHMubWF4U2l6ZT8ueCA/PyBJbmZpbml0eSk/IHRoaXMub3B0cy5tYXhTaXplLng6IHdpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt0aGlzLnBhcmVudC5lbGVtZW50LnNjcm9sbExlZnQgKyB0aGlzLl9zdGFydHJlY3QucmlnaHQgLSB3aWR0aH1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyAoZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCkgLSB0aGlzLl9jbGlja3N0YXJ0LnggLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aCA8PSB0aGlzLm9wdHMubWluU2l6ZS54PyB0aGlzLm9wdHMubWluU2l6ZS54OiB3aWR0aCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnggPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS54OiB3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9tb3ZlVGl0bGViYXJIYW5kbGVyIChldikge1xyXG4gICAgICAgIGlmICgodGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF4aW11bScpICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgQmFzZUNvbnRhaW5lcilcclxuICAgICAgICB8fCB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChldi50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gZXYudGFyZ2V0LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0ID0ge3g6IGV2Lm9mZnNldFggPz8gKGV2LnRvdWNoZXNbMF0ucGFnZVggLSByZWN0LmxlZnQpLCB5OiBldi5vZmZzZXRZID8/IChldi50b3VjaGVzWzBdLnBhZ2VZIC0gcmVjdC50b3ApfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICd0b3VjaG1vdmUnOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXRlc3RUb3VjaEV2ID0gZXY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWcnOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGV2LnNjcmVlblkgPz8gZXYudG91Y2hlcz8uWzBdPy5zY3JlZW5ZKSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7KHRoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldi5wYWdlWCA/PyBldi50b3VjaGVzWzBdLnBhZ2VYKSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnh9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAkeyh0aGlzLnBhcmVudC5lbGVtZW50LnNjcm9sbFRvcCArIChldi5wYWdlWSA/PyBldi50b3VjaGVzWzBdLnBhZ2VZKSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnl9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21vdmUnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoZW5kJzoge1xyXG4gICAgICAgICAgICAgICAgZXYgPSB0aGlzLl9sYXRlc3RUb3VjaEV2O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYXNlICdkcmFnZW5kJzoge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGp1c3RXaW5kb3dQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21vdmVkJywge2RldGFpbDoge3JlY3Q6IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdLCBldiwgdGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdFdpbmRvd1Bvc2l0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF07XHJcbiAgICAgICAgaWYgKCFjdXJyZW50UmVjdCB8fCAhdGhpcy5wYXJlbnQpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50SGVpZ2h0ID4gdGhpcy5lbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgICAgICYmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQpIDwgY3VycmVudFJlY3QuYm90dG9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQgLSB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCA+IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aFxyXG4gICAgICAgICYmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCkgPCBjdXJyZW50UmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoIC0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRofXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UmVjdC5sZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnRvcCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtYXhpbXVtICgpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0/LmxlZnQgPz8gMDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXhpbXVtJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vcm1hbCAoeCkge1xyXG4gICAgICAgIGxldCByYXRpbyA9IDA7XHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIHJhdGlvID0gKHggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21heGltdW0nKTtcclxuXHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCB3ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jbGlja3N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0LnggPSB3ICogcmF0aW87XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5yb3VuZCh4IC0gKHcgKiByYXRpbykpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMuX2xlZnR9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ25vcm1hbGl6ZWQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWluaW11bSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdPy5sZWZ0ID8/IDA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21heGltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdtaW5pbWl6ZWQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyIChfZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5yZXNpemVQYXJlbnRIYW5kbGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFyZW50SGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgc3VwZXIuY2hhbmdlUGFyZW50SGFuZGxlcihldnQpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMubW9kYWwgPT09ICdtb2RhbCcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm91dGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm91dGVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXRlci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtbW9kYWwtYmxvY2tlcicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMub3V0ZXIsIHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vdXRlci5hcHBlbmQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAocmVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgY2FsYyg1MCUgLSAke3JlY3Qud2lkdGggLyAyfXB4KWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYGNhbGMoNTAlIC0gJHtyZWN0LmhlaWdodCAvIDJ9cHgpYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIucmVzaXplUGFyZW50SGFuZGxlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDlnoLnm7Tjgb7jgZ/jga/msLTlubPmlrnlkJHjgbjjga7mlbTliJfjgoTjgr/jg5bliIfjgormm7/jgYjjgavjgojjgovjg5Hjg43jg6vjga7jgrnjgqTjg4Pjg4EoM+WAi+OBruOBhuOBoeOBhOOBmuOCjOOBizHjgaQp44KS5o+Q5L6b44GX44G+44GZ44CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFja0NvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgU3RhY2tDb250YWluZXJPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAnc3RhY2snLFxyXG4gICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICByZXByb3BvcnRpb25hYmxlOiB0cnVlLFxyXG4gICAgICAgIGRvY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIHNlcGFyYXRvcldpZHRoOiAyLFxyXG4gICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWU6ICcnLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxyXG4gICAgICAgIHRlbXBsYXRlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcGFuZWxBZGRBcmVhOiB1bmRlZmluZWQsXHJcbiAgICAgICAgYWRqdXN0U2l6ZTogdHJ1ZSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuagvOe0jeOBmeOCi+ODkeODjeODq+OCqOODquOCouOAguOCpuOCo+ODs+ODieOCpuODu+ODmuOCpOODs+ihqOekuuOBjOWPr+iDvVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IFN0YWNrQ29udGFpbmVyT3B0aW9ucyB9ICAgICAgb3B0cyAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW4g5YaF5a6544Kz44Oz44OG44Oz44OEXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChvcHRzID0gU3RhY2tDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgT2JqZWN0LmFzc2lnbihvcHRzLCBTdGFja0NvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIFsnbWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXInXSwgWydtYWdpY2EtcGFuZWwtc3RhY2staW5uZXInXSwgLi4uY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRzLmFkanVzdFNpemUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMub3B0cy50ZW1wbGF0ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdob3Jpem9udGFsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0YWInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5hZGRhcmVhcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRhcmVhcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFkZEFyZWEgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGFkZEFyZWEuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicsICdlbXB0eScpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5wYW5lbEFkZEFyZWEgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBcmVhLmFwcGVuZCh0aGlzLm9wdHMucGFuZWxBZGRBcmVhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZEFyZWEudGV4dENvbnRlbnQgPSB0aGlzLm9wdHMucGFuZWxBZGRBcmVhID8/IHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICfilqQnIDogJ+KWpSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChhZGRBcmVhKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChhZGRBcmVhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21vdmVoYW5kbGVyID0gZXZ0ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubW9kYWwgIT09ICdtb2RhbGVzcycpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWSA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbFRvcCArIChldnQuZGV0YWlsLmV2LnBhZ2VZID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWCA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbExlZnQgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWCA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVgpO1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAoZWxlbVJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IGVsZW1SZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAmJiBlbGVtUmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IGVsZW1SZWN0LnJpZ2h0XHJcbiAgICAgICAgICAgICYmIGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubWF4aW11bS5lbmFibGUgPT09IHRydWUgJiYgdGhpcy5vcHRzLmRvY2thYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGFyZWEgb2YgdGhpcy5hZGRhcmVhcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGFkZGFyZWEuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWN0ICYmIHJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IHJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICAgICAmJiByZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgcmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX21vdmVkaGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVkgPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxUb3AgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWSA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVkpO1xyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVggPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2dC5kZXRhaWwuZXYucGFnZVggPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbVJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1SZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCBlbGVtUmVjdC5ib3R0b21cclxuICAgICAgICAgICAgJiYgZWxlbVJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCBlbGVtUmVjdC5yaWdodFxyXG4gICAgICAgICAgICAmJiBldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1heGltdW0uZW5hYmxlID09PSB0cnVlICYmIHRoaXMub3B0cy5kb2NrYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhZGRhcmVhIG9mIHRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09PSBhZGRhcmVhLnBhcmVudEVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB8fCBldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50Lm5leHRFbGVtZW50U2libGluZyA9PT0gYWRkYXJlYS5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmRldGFpbC50YXJnZXQucGFyZW50ICE9PSB0aGlzLnJvb3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBhZGRhcmVhLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QgJiYgcmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgcmVjdC5ib3R0b21cclxuICAgICAgICAgICAgICAgICAgICAmJiByZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgcmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0cmVmID0gdGhpcy5lbGVtZW50LmNvbnRhaW5zKGFkZGFyZWEuY2xvc2VzdCgnLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lcicpKT8gYWRkYXJlYS5wYXJlbnRFbGVtZW50OiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9IGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhcmVudCAodmFsKSB7XHJcbiAgICAgICAgc3VwZXIucGFyZW50ID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhcmVudEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHN1cGVyLmNoYW5nZVBhcmVudEhhbmRsZXIoZXZ0KTtcclxuICAgICAgICBpZiAodGhpcy5yb290KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZScsIHRoaXMuX21vdmVoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlZCcsIHRoaXMuX21vdmVkaGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5hZGRFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmUnLCB0aGlzLl9tb3ZlaGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5hZGRFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmVkJywgdGhpcy5fbW92ZWRoYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZCAodmFsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFkZGFyZWFzKSB0aGlzLmFkZGFyZWFzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuaW5uZXIuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlcCA9IHRoaXMuX2dlbmVyYXRlU2VwYXJhdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChzZXAuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChzZXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvd1JhbmdlID0gdGhpcy5fbGFzdFRhcmdldFJhbmdlO1xyXG4gICAgICAgICAgICByYW5nZXMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gPz8gZS5vcHRzPy5kZWZhdWx0U2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gPz8gMTAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0cmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudCkuaW5kZXhPZih0aGlzLl9sYXN0cmVmLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0VGFyZ2V0UmFuZ2UgPSAoKHJhbmdlc1tpZHhdID8/IDApICsgKHJhbmdlc1tpZHggKyAxXSA/PyAwKSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0UmFuZ2UgPSBNYXRoLm1pbihpbnNlcnRUYXJnZXRSYW5nZSwgd2luZG93UmFuZ2UpIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKH5pZHggJiYgcmFuZ2VzW2lkeCArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW3NtYWxsSWR4LCBsYXJnZUlkeF0gPSByYW5nZXNbaWR4XSA+IHJhbmdlc1tpZHggKyAxXT8gW2lkeCArIDEsIGlkeF06IFtpZHgsIGlkeCArIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gcmFuZ2VzW3NtYWxsSWR4XSAvIHJhbmdlc1tsYXJnZUlkeF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc21hbGxTaXplID0gTWF0aC5yb3VuZChpbnNlcnRSYW5nZSAvIDIgKiByYXRpbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW3NtYWxsSWR4XSAtPSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2xhcmdlSWR4XSAtPSAoaW5zZXJ0UmFuZ2UgLSBzbWFsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAofmlkeCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tpZHhdIC09IGluc2VydFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCArIDFdIC09IGluc2VydFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJhbmdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgaW5zZXJ0UmFuZ2UgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByYW5nZXMgPSByYW5nZXMubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuYXBwZW5kKHZhbCwgdGhpcy5fbGFzdHJlZik7XHJcbiAgICAgICAgaWYgKHZhbC5tYXhpbXVtKSB2YWwubWF4aW11bSgpO1xyXG5cclxuICAgICAgICBjb25zdCBzZXAgPSB0aGlzLl9nZW5lcmF0ZVNlcGFyYXRvcigpO1xyXG4gICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChzZXAuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIGlmICh2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5pbnNlcnRCZWZvcmUoc2VwLCB2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoc2VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpICYmIHRoaXMub3B0cy5hZGp1c3RTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzLmxlbmd0aCA9PT0gMD8gdW5kZWZpbmVkOiByYW5nZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbG9zZXN0KCdib2R5JykpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQub3B0cy50eXBlID09PSAnYmFzZScgfHwgdGhpcy5wYXJlbnQuZml4ZWRzaXplKSB0aGlzLmZpeGVkc2l6ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCByYW5nZXMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pLmZpbHRlcihlID0+IGUgIT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSByYW5nZXMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCk7XHJcbiAgICAgICAgY29uc3QgcmF0aW9zID0gcmFuZ2VzLm1hcChlID0+IGUgLyB0b3RhbCk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFdpZHRoID0gdGhpcy5pbm5lci5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSAtICh0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGggKiAodGhpcy5jaGlsZHJlbi5sZW5ndGggKyAxKSk7XHJcbiAgICAgICAgcmFuZ2VzID0gcmF0aW9zLm1hcChlID0+IE1hdGgucm91bmQoZSAqIGN1cnJlbnRXaWR0aCkpO1xyXG4gICAgICAgIHJhbmdlcy5wb3AoKTtcclxuICAgICAgICByYW5nZXMucHVzaChjdXJyZW50V2lkdGggLSByYW5nZXMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCkpO1xyXG4gICAgICAgIHJhbmdlcyA9IHJhbmdlcy5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgaWYgKHJhbmdlcy5sZW5ndGggPiAwICYmIHRoaXMub3B0cy5hZGp1c3RTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUgKHZhbCkge1xyXG4gICAgICAgIGxldCByYW5nZXMgPSB0eXBlb2YgdGhpcy5fbGFzdFRhcmdldFJhbmdlID09PSAnb2JqZWN0Jz8gdGhpcy5fbGFzdFRhcmdldFJhbmdlOiB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pO1xyXG4gICAgICAgIGlmIChyYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YodmFsKTtcclxuICAgICAgICAgICAgaWYgKCFyYW5nZXNbaWR4IC0gMV0gJiYgcmFuZ2VzW2lkeCArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbaWR4ICsgMV0gKz0gcmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIXJhbmdlc1tpZHggKyAxXSAmJiByYW5nZXNbaWR4IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggLSAxXSArPSByYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyYW5nZXNbaWR4ICsgMV0gJiYgcmFuZ2VzW2lkeCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbc21hbGxJZHgsIGxhcmdlSWR4XSA9IHJhbmdlc1tpZHggLSAxXSA+IHJhbmdlc1tpZHggKyAxXT8gW2lkeCArIDEsIGlkeCAtIDFdOiBbaWR4IC0gMSwgaWR4ICsgMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IHJhbmdlc1tzbWFsbElkeF0gLyByYW5nZXNbbGFyZ2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc21hbGxTaXplID0gTWF0aC5yb3VuZCgocmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC8gMiAqIHJhdGlvKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tzbWFsbElkeF0gKz0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2xhcmdlSWR4XSArPSAocmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByYW5nZXMgPSByYW5nZXMuZmlsdGVyKChfZSwgaSkgPT4gaSAhPT0gaWR4KS5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbW92ZSh2YWwpO1xyXG4gICAgICAgIGlmICh0aGlzLmlubmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLmZpbHRlcihlID0+IGUgIT09IHRoaXMuaW5uZXIuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmNoaWxkcmVuWzBdLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuYWRqdXN0U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcz8ubGVuZ3RoID09PSAwPyB1bmRlZmluZWQ6IHJhbmdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9jYWxjR3JpZFNpemUgKHNlcCwgcG9zLCB0ZW1wbGF0ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQ/LmZpeGVkc2l6ZSAmJiB0aGlzLnBhcmVudD8ub3B0cz8udHlwZSAhPT0gJ2Jhc2UnKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCghdGhpcy5vcHRzLnRlbXBsYXRlIHx8IHRoaXMub3B0cy50ZW1wbGF0ZT8ubGVuZ3RoID09PSB0aGlzLmNoaWxkcmVuLmxlbmd0aCkgJiYgIXRoaXMuX2dyaWRJbml0KSB0ZW1wbGF0ZSA9IHRoaXMub3B0cy50ZW1wbGF0ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fZ3JpZEluaXQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnZ3JpZFRlbXBsYXRlUm93cyc6ICdncmlkVGVtcGxhdGVDb2x1bW5zJztcclxuICAgICAgICBjb25zdCBjdXJyZW50U2l6ZXMgPSB0ZW1wbGF0ZSA/PyB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0uc3BsaXQoJyAnKS5maWx0ZXIoZSA9PiBlICE9PSAnJykuZmlsdGVyKChfZSwgaSkgPT4gaSAlIDIgIT09IDApO1xyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0gPSAnJztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTaXplc1swXSA9ICcxZnInO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNlcCAmJiBzZXAucHJldmlvdXNFbGVtZW50U2libGluZyAmJiBzZXAubmV4dEVsZW1lbnRTaWJsaW5nICYmIHBvcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3MgPSBBcnJheS5mcm9tKHRoaXMuaW5uZXIuY2hpbGRyZW4pLmZpbHRlcihlID0+ICFlLmNsYXNzTGlzdC5jb250YWlucygnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicpKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldklkeCA9IGJyb3MuaW5kZXhPZihzZXAucHJldmlvdXNFbGVtZW50U2libGluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRJZHggPSBicm9zLmluZGV4T2Yoc2VwLm5leHRFbGVtZW50U2libGluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZSZWN0ID0gc2VwLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dFJlY3QgPSBzZXAubmV4dEVsZW1lbnRTaWJsaW5nLmdldENsaWVudFJlY3RzKClbMF07XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJldlJhbmdlID0gcG9zIC0gKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IHByZXZSZWN0LnRvcDogcHJldlJlY3QubGVmdCAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCk7XHJcbiAgICAgICAgICAgIGxldCBmckZsYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHByZXZSYW5nZSA8PSAwICYmIHRoaXMuY2hpbGRyZW5bcHJldklkeF0ub3B0cy5taW5pbWFibGUpIHtcclxuICAgICAgICAgICAgICAgIGZyRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSAnMHB4JztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9IGAke25leHRSZWN0W3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdib3R0b20nOiAncmlnaHQnXSAtIHByZXZSZWN0W3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd0b3AnOiAnbGVmdCddIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByZXZSYW5nZSA9IHRoaXMuY2hpbGRyZW5bcHJldklkeF0ub3B0cy5taW5TaXplW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd5JzogJ3gnXSA+IHByZXZSYW5nZSA/IHRoaXMuY2hpbGRyZW5bcHJldklkeF0ub3B0cy5taW5TaXplW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd5JzogJ3gnXSA6IHByZXZSYW5nZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5leHRSYW5nZSA9ICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBuZXh0UmVjdC5ib3R0b206IG5leHRSZWN0LnJpZ2h0KSAtICgodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gcHJldlJlY3QudG9wOiBwcmV2UmVjdC5sZWZ0KSArIHByZXZSYW5nZSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCkgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIGlmIChuZXh0UmFuZ2UgPD0gMCAmJiB0aGlzLmNoaWxkcmVuW25leHRJZHhdLm9wdHMubWluaW1hYmxlICYmICFmckZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGZyRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSBgJHtuZXh0UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnYm90dG9tJzogJ3JpZ2h0J10gLSBwcmV2UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAndG9wJzogJ2xlZnQnXSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSAnMHB4JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5leHRSYW5nZSA9IHRoaXMuY2hpbGRyZW5bbmV4dElkeF0ub3B0cy5taW5TaXplW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd5JzogJ3gnXSA+IG5leHRSYW5nZSA/IHRoaXMuY2hpbGRyZW5bbmV4dElkeF0ub3B0cy5taW5TaXplW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd5JzogJ3gnXSA6IG5leHRSYW5nZTtcclxuICAgICAgICAgICAgICAgIHByZXZSYW5nZSA9IG5leHRSZWN0W3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdib3R0b20nOiAncmlnaHQnXSAtIHByZXZSZWN0W3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICd0b3AnOiAnbGVmdCddIC0gbmV4dFJhbmdlIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZyRmxhZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSBgJHtwcmV2UmFuZ2V9cHhgO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9IGAke25leHRSYW5nZX1weGA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSBgJHtwcmV2UmFuZ2V9cHhgO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9IGAke25leHRSYW5nZX1weGA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpZHgrKykgaWYgKGN1cnJlbnRTaXplc1tpZHhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY3VycmVudFNpemVzLnB1c2goJzFmcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VycmVudFNpemVzLnNwbGljZSh0aGlzLmNoaWxkcmVuLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5pbm5lci5zdHlsZVt0YXJnZXRdID0gYCR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4ICR7Y3VycmVudFNpemVzLmpvaW4oYCAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weCBgKX0gJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgICAgIHRoaXMuZml4ZWRzaXplID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2dlbmVyYXRlU2VwYXJhdG9yICgpIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtLnN0eWxlW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSA9IGAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgZWxlbS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IGlubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlubmVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEnKTtcclxuICAgICAgICBlbGVtLmFwcGVuZChpbm5lcik7XHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldi5zY3JlZW5ZID09PSAwIHx8IHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKGV2LnRhcmdldCwgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gZXYucGFnZVkgOiBldi5wYWdlWCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXYudG91Y2hlc1swXT8uc2NyZWVuWSA9PT0gMCB8fCB0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZShldi50YXJnZXQsIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IGV2LnRvdWNoZXNbMF0ucGFnZVkgOiBldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pO1xyXG4gICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0Lm5vcm1hbCgoZXZ0LmRldGFpbC5ldi5wYWdlWCA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVgpKTtcclxuICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgPSB0aGlzLnJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHJvb3QgKCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudD8ucGFyZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc3Qgc3R5bGUgPSBgXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlciB7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd3JhcHBlci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYmFzZSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBtaW4td2lkdGg6IDEwMCU7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93IHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXRpdGxlYmFyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGhlaWdodDogMS41cmVtO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxuICAgIG1hcmdpbi1yaWdodDogY2FsYygyLjVyZW0gKiAzKTtcclxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB+IC5tYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC10aXRsZWJhciA+ICoge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgcGFkZGluZzogMXB4O1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lci5veS1zIHtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UubGVmdCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UucmlnaHQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5sZWZ0OmFjdGl2ZSxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnJpZ2h0OmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tIHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3A6YWN0aXZlLFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tOmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5sZWZ0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLnJpZ2h0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLmxlZnQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ucmlnaHQge1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgdG9wOiB1bnNldDtcclxuICAgIGxlZnQ6IHVuc2V0O1xyXG4gICAgcmlnaHQ6IHVuc2V0O1xyXG4gICAgYm90dG9tOiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5sZWZ0IHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBjdXJzb2w6IG53c2UtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLnJpZ2h0IHtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgY3Vyc29sOiBuZXN3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5sZWZ0IHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBjdXJzb2w6IG5lc3ctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLnJpZ2h0IHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgY3Vyc29sOiBud3NlLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSB7XHJcbiAgICBwYWRkaW5nOiAwcHg7XHJcbiAgICB0b3A6IDAgIWltcG9ydGFudDtcclxuICAgIGxlZnQ6IDAgIWltcG9ydGFudDtcclxuICAgIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gLm1hZ2ljYS1wYW5lbC10aXRsZWJhciB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgd2lkdGg6IGNhbGMoMTAwJSAtIDJweCkgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogY2FsYygxMDAlIC0gMS41cmVtIC0gNnB4KSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC10aXRsZWJhci5tYXhpbXVtLWRpc2FibGUgfiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIGhlaWdodDogY2FsYygxMDAlIC0gMnB4KSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtIHtcclxuICAgIHdpZHRoOiAxODZweDtcclxuICAgIGJvdHRvbTogMCAhaW1wb3J0YW50O1xyXG4gICAgdG9wOiB1bnNldCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy50b3Btb3N0IHtcclxuICAgIHotaW5kZXg6IDY1NTM1ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtbW9kYWwtYmxvY2tlciB7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLC41KTtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHotaW5kZXg6IDY1NTM1ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1pbmltdW0gPiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1pbmltdW0gPiAubWFnaWNhLXBhbmVsLWVkZ2Uge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24tYXJlYSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24ge1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbiAgICBib3JkZXI6IG5vbmU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIHdpZHRoOiAyLjVyZW07XHJcbiAgICBmb250LXNpemU6IDFyZW07XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmRlbnkge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uY2xvc2Uge1xyXG4gICAgYmFja2dyb3VuZDogIzcwMTkxOTtcclxufVxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5jbG9zZS5vbmFjdGl2ZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZTYzMjMyO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB6LWluZGV4OiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIub3gtcyB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIub3ktcyB7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbWlkbmlnaHRibHVlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgei1pbmRleDogMTAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5lbXB0eSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgZm9udC1zaXplOiAzcmVtO1xyXG4gICAgd2lkdGg6IDVyZW07XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1LDI1LDExMiwgMC4zKTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDEwcmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBsZWZ0OiAtNXJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Zmlyc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBsZWZ0OiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpsYXN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMHJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHRvcDogLTVyZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpmaXJzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHRvcDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmxhc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICB0b3A6IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5ob3Zlcik6Tk9UKC5kaXNhYmxlKTpOT1QoOmZpcnN0LW9mLXR5cGUpOk5PVCg6bGFzdC1vZi10eXBlKTpob3ZlciB7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5ob3Zlcik6Tk9UKC5kaXNhYmxlKTpOT1QoOmZpcnN0LW9mLXR5cGUpOk5PVCg6bGFzdC1vZi10eXBlKTpob3ZlciB7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguZW1wdHkpIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIuZW1wdHkgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuZW1wdHkge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3ZlciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuaG92ZXIge1xyXG4gICAgb3BhY2l0eTogMTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsIC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsIC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0b3A6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICBsZWZ0IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICB6LWluZGV4OiB1bnNldCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtYnV0dG9uLm1heGltdW0ge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLWJ1dHRvbi5taW5pbXVtIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuYDtcclxuXHJcbmNvbnN0IFZhbHVlID0ge1xyXG4gICAgc3R5bGUsXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKFZhbHVlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZhbHVlO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBiYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5pbXBvcnQgcGFuZWwgZnJvbSAnLi9wYW5lbC5qcyc7XHJcbmltcG9ydCBzdGFja0NvbnRhaW5lciBmcm9tICcuL3N0YWNrLWNvbnRhaW5lci5qcyc7XHJcblxyXG5leHBvcnQgY29uc3QgQmFzZUNvbnRhaW5lciA9IGJhc2VDb250YWluZXI7XHJcbmV4cG9ydCBjb25zdCBQYW5lbCA9IHBhbmVsO1xyXG5leHBvcnQgY29uc3QgU3RhY2tDb250YWluZXIgPSBzdGFja0NvbnRhaW5lcjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgQmFzZUNvbnRhaW5lcixcclxuICAgIFBhbmVsLFxyXG4gICAgU3RhY2tDb250YWluZXIsXHJcbn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==