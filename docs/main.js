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
    constructor (element, opts, elementClasses, innerClasses, ...children) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGtFQUFxQixZQUFZLFNBQVMsY0FBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUpBQXlKO0FBQ3BNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUpBQXlKO0FBQ3BNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pELCtDQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQSwrQ0FBK0MsVUFBVTtBQUN6RCwrQ0FBK0MsVUFBVTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0QkFBNEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLEtBQUssc0JBQXNCLHlCQUF5QixPQUFPLEVBQUUseUJBQXlCO0FBQ3JKO0FBQ0EsK0JBQStCLGtFQUFxQixZQUFZLFNBQVMsY0FBYztBQUN2RjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkVBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UseUJBQXlCO0FBQ3hHO0FBQ0Esc0JBQXNCLDZFQUFnQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3hYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLEtBQUssRUFBQzs7Ozs7OztVQzNYckI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTmdEO0FBQ2pCO0FBQ21CO0FBQ2xEO0FBQ08sc0JBQXNCLDBEQUFhO0FBQ25DLGNBQWMsaURBQUs7QUFDbkIsdUJBQXVCLDJEQUFjO0FBQzVDLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2Jhc2UtY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3BhbmVsLWJhc2UuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvcGFuZWwuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvc3RhY2stY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3ZhbHVlcy5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1hZ2ljYVBhbmVsXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1hZ2ljYVBhbmVsXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDjgZnjgbnjgabjga7opqrjgajjgarjgovopoHntKDjgILjg4Tjg6rjg7zkuIrjgasx44Gk5LiA55Wq6Kaq44Gr44Gu44G/5Yip55So44Gn44GN44KL44CCXHJcbiAqIOOCpuOCo+ODs+ODieOCpuOBr+OBk+OBruS4reOBl+OBi+enu+WLleOBp+OBjeOBquOBhOOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUNvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgQmFzZUNvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdiYXNlJyxcclxuICAgICAgICBvdmVyZmxvd1g6ICdzY3JvbGwnLFxyXG4gICAgICAgIG92ZXJmbG93WTogJ3Njcm9sbCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44GZ44G544Gm44Gu6Kaq44Go44Gq44KL6KaB57Sg44CCXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgICAgIGVsZW1lbnQgICDoh6rouqvjgpLooajnpLrjgZnjgotIVE1M6KaB57SgXHJcbiAgICAgKiBAcGFyYW0geyBCYXNlQ29udGFpbmVyT3B0aW9ucyB9ICAgICAgIG9wdHMgICAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW4gIOWtkOimgee0oCjjgrnjgr/jg4Pjgq/jga/lhYjpoK0x44Gu44G/44O75Yid5Zue6LW35YuV5pmC44Gu6L+95Yqg44Gu44G/6Kix5Y+vKVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cyA9IEJhc2VDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIE9iamVjdC5hc3NpZ24ob3B0cywgQmFzZUNvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIFsnbWFnaWNhLXBhbmVsLXdyYXBwZXInXSwgWydtYWdpY2EtcGFuZWwtYmFzZSddLCAuLi5CYXNlQ29udGFpbmVyLnNhbml0aXplQ2hpbGRyZW4oY2hpbGRyZW4pKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ294LXMnKTtcclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3ktcycpO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5hZGRpdGlvbmFsQ2xhc3NOYW1lcykgdGhpcy5pbm5lci5jbGFzc0xpc3QuYWRkKC4uLm9wdHMuYWRkaXRpb25hbENsYXNzTmFtZXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9zZXRSZXNpemVFdmVtdChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODquOCteOCpOOCuuOCpOODmeODs+ODiOOCkuioreWumuOBl+OBvuOBmeOAglxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbSDjgqTjg5njg7Pjg4jjgr/jg7zjgrLjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgX3NldFJlc2l6ZUV2ZW10IChlbGVtKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbXJlY3QgPSB7eDogZWxlbS5jbGllbnRXaWR0aCwgeTogZWxlbS5jbGllbnRIZWlnaHR9O1xyXG4gICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtLmNsaWVudFdpZHRoICE9PSB0aGlzLl9lbGVtcmVjdC54XHJcbiAgICAgICAgICAgIHx8IGVsZW0uY2xpZW50SGVpZ2h0ICE9PSB0aGlzLl9lbGVtcmVjdC55KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtcmVjdCA9IHt4OiBlbGVtLmNsaWVudFdpZHRoLCB5OiBlbGVtLmNsaWVudEhlaWdodH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDogdGhpcy5fZWxlbXJlY3R9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoUGFuZWxCYXNlLndpbmRvdy5SZXNpemVPYnNlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBybyA9IG5ldyBQYW5lbEJhc2Uud2luZG93LlJlc2l6ZU9ic2VydmVyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJvLm9ic2VydmUoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGFuZWxCYXNlLndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBmKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7phY3liJfjgYzmraPjgZfjgYTmp4vmiJDjgavjgarjgovjgojjgYbjgavmpJzoqLzjg7vjg5XjgqPjg6vjgr/jgZfjgb7jgZnjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUNoaWxkcmVuIChjaGlsZHJlbikge1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gY2hpbGRyZW4uZmluZChlID0+IGUub3B0cy50eXBlID09PSAnc3RhY2snKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoc3RhY2spIHJlc3VsdC5wdXNoKHN0YWNrKTtcclxuICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJykpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3RzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcChlID0+IGUucmlnaHQgKyB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0IDwgbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHttYXhYIC0gdGhpcy5pbm5lci5jbGllbnRMZWZ0fXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKGUgPT4gZS5ib3R0b20gKyB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlY3QuYm90dG9tIDwgbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7bWF4WSAtIHRoaXMuaW5uZXIuY2xpZW50VG9wfXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LmJvdHRvbSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hpbGRyZW5tb3ZlJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNb3ZlZEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGlsZHJlbm1vdmVkJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgVmFsdWUgZnJvbSAnLi92YWx1ZXMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIENvb3JkaW5hdGlvbk9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geCBY5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geSBZ5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUmVzaXplYWJsZU9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IGVuYWJsZSAgICAgICDjg6bjg7zjgrbmk43kvZzjga7mnInlirnjg7vnhKHlirlcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IHNob3dUaXRsZWJhciDpgannlKjmmYLjgavjgr/jgqTjg4jjg6vjg5Djg7zjgpLooajnpLrjgZnjgovjgYtcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUGFuZWxPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdwYW5lbCcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBtaW5TaXplICAgICAgICAgICAgIOacgOWwj+OCpuOCo+ODs+ODieOCpuWGheOCs+ODs+ODhuODs+ODhOOCteOCpOOCuijmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgbWF4U2l6ZSAgICAgICAgICAgICDmnIDlpKfjgqbjgqPjg7Pjg4njgqblhoXjgrPjg7Pjg4bjg7Pjg4TjgrXjgqTjgroo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIHBvc2l0aW9uICAgICAgICAgICAg5Yid5pyf5L2N572uKOW3puS4iilcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBkZWZhdWx0U2l6ZSAgICAgICAgIOWIneacn+OCteOCpOOCuigzMjB4MjQwLCDjgr/jgqTjg4jjg6vjg5Djg7zjgIHjgqbjgqPjg7Pjg4njgqbmnqDnt5rlkKvjgb7jgZopXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB8IEhUTUxFbGVtZW50IH0gICAgICAgICAgICAgdGl0bGUgICAgICAgICAgICAgICDjgr/jgqTjg4jjg6tcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWFibGUgICAgICAgICAgIOODkOODhOODnOOCv+ODs+OCkuWHuuePvuOBleOBm+OCi1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYWJsZSAgICAgICAgICAg5pyA5bCP5YyW44Oc44K/44Oz44KS5Ye654++44GV44Gb44KLXHJcbiAqIEBwcm9wZXJ0eSB7IFJlc2l6ZWFibGVPcHRpb25zIH0gICAgICAgICAgICAgICAgbWF4aW11bSAgICAgICAgICAgICDmnIDlpKfljJbjga7mjJnli5VcclxuICogQHByb3BlcnR5IHsgJ21vZGFsJyB8ICdtb2RhbGVzcycgfCAndG9wTW9zdCcgfSBtb2RhbCAgICAgICAgICAgICAgIOODouODvOODgOODq+ihqOekuueKtuaFi1xyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WCAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WSAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWUg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgIFN0YWNrQ29udGFpbmVyT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcGVydHkgeyAnc3RhY2snIH0gICAgICAgICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7ICd2ZXJ0aWNhbCcgfCAnaG9yaXpvbnRhbCcgIH0gZGlyZWN0aW9uICAgICAgICAgICDliIblibLmlrnlkJFcclxuICogQHByb3BlcnR5IHsgc3RyaW5nW10gfSAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSAgICAgICAgICAgIOOCs+ODrOOCr+OCt+ODp+ODs+WQhOimgee0oOOBruWIneacn+OCteOCpOOCulxyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgIHJlcHJvcG9ydGlvbmFibGUgICAg44Kz44Os44Kv44K344On44Oz44Gu5q+U546H44KS5pON5L2c44Gn44GN44KL44GLXHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgZG9ja2FibGUgICAgICAgICAgICDjgrPjg6zjgq/jgrfjg6fjg7Pjga7ohLHnnYDmk43kvZzjgYzjgafjgY3jgovjgYso44Om44O844K25pON5L2c44GL44KJKVxyXG4gKiBAcHJvcGVydHkgeyBudW1iZXIgfSAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcldpZHRoICAgICAg5YiG5Ymy5aKD55WM57ea44Gu5bmFKDHvvZ4pXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB9ICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZSDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICogQHByb3BlcnR5IHsgc3RyaW5nIHwgSFRNTEVsZW1lbnQgfSAgICAgICBwYW5lbEFkZEFyZWEgICAgICAgIOOCueOCv+ODg+OCr+WGheOBjOepuuOBruOBqOOBjeOBq+ihqOekuuOBleOCjOOCi+ODkeODjeODq+i/veWKoOOCouOCpOOCs+ODs1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgIGFkanVzdFNpemUgICAgICAgICAg6Kaq6KaB57Sg44Oq44K144Kk44K65pmC44KE44Kz44Os44Kv44K344On44Oz44Gu5aKX5rib5pmC44Gr6Ieq5YuV55qE44Gr5ZCE44Kz44Os44Kv44K344On44Oz44KS44Oq44K144Kk44K644GZ44KL44GLXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQmFzZUNvbnRhaW5lck9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ2Jhc2UnIH0gICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAgIOODkeODjeODq+eoruWIpVxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdoaWRkZW4nIH0gb3ZlcmZsb3dYICAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdoaWRkZW4nIH0gb3ZlcmZsb3dZICAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgYWRkaXRpb25hbENsYXNzTmFtZXMg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxCYXNlIGV4dGVuZHMgRXZlbnRUYXJnZXRcclxue1xyXG4gICAgc3RhdGljIF9pbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICAgIHN0YXRpYyB3aW5kb3c7XHJcbiAgICBzdGF0aWMgZG9jdW1lbnQ7XHJcbiAgICBzdGF0aWMgQ3VzdG9tRXZlbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0geyBQYW5lbE9wdGlvbnMgfCBTdGFja1BhbmVsT3B0aW9ucyB8IEJhc2VDb250YWluZXJPcHRpb25zIH0gb3B0c1xyXG4gICAgICogQHBhcmFtIHsgKFBhbmVsQmFzZSB8IEhUTUxFbGVtZW50KVtdIH0gY2hpbGRyZW5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGVsZW1lbnQsIG9wdHMsIGVsZW1lbnRDbGFzc2VzLCBpbm5lckNsYXNzZXMsIC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9jaGFuZ2VQYXJlbnRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBhcmVudEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTW92ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZE1vdmVIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTW92ZUhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTWluaW1pemVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE1pbmltaXplZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGROb3JtYWxpemVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVzaXplUGFyZW50SGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVQYXJlbnRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9vcHRzID0gb3B0cztcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uZWxlbWVudENsYXNzZXMpO1xyXG4gICAgICAgIC8vIOiHqui6q+imgee0oOOCkuWIneacn+WMluOBmeOCi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2lubmVyLmNsYXNzTGlzdC5hZGQoLi4uaW5uZXJDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZCh0aGlzLl9pbm5lcik7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB0aGlzLmFjdGl2ZSgpKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB0aGlzLmFjdGl2ZSgpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQYW5lbEJhc2UpIHtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEB0eXBlIHsgUGFuZWxCYXNlIHwgdW5kZWZpbmVkIH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5maXhlZHNpemUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCFQYW5lbEJhc2UuX2luaXRpYWxpemVkKSBQYW5lbEJhc2UuaW5pdCgpO1xyXG4gICAgICAgIFBhbmVsQmFzZS5faW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybiB7IFBhbmVsT3B0aW9ucyB8IFN0YWNrUGFuZWxPcHRpb25zIHwgQmFzZUNvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3B0cyAoKSB7XHJcbiAgICAgICAgY29uc3Qge3RpdGxlLCAuLi5vdGhlcn0gPSB0aGlzLl9vcHRzO1xyXG4gICAgICAgIGNvbnN0IG9wdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG90aGVyKSk7XHJcbiAgICAgICAgaWYgKHRpdGxlKSBvcHRzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgcmV0dXJuIG9wdHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVsZW1lbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbm5lciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjaGlsZHJlbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLl9jaGlsZHJlbl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuani+evieOBmeOCi+OBn+OCgeOBruWIneacn+WMluODoeOCveODg+ODiVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdCAoKSB7XHJcbiAgICAgICAgUGFuZWxCYXNlLmFwcGVuZFN0eWxlRWxlbWVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCueOCv+OCpOODq+OCkuODmOODg+ODgOOBq+i/veWKoOOBl+OBvuOBmeOAglxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXBwZW5kU3R5bGVFbGVtZW50cyAoKSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IFZhbHVlLnN0eWxlO1xyXG4gICAgICAgIGNvbnN0IHJlZiA9IFBhbmVsQmFzZS5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZSwgbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJyk7XHJcbiAgICAgICAgaWYgKHJlZikge1xyXG4gICAgICAgICAgICBQYW5lbEJhc2UuZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIHJlZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBQYW5lbEJhc2UuZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsO1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFwcGVuZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VQYXJlbnRIYW5kbGVyKHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbG9zZXN0KCdib2R5JykgJiYgKHRoaXMucGFyZW50Lm9wdHMudHlwZSA9PT0gJ2Jhc2UnIHx8IHRoaXMucGFyZW50LmZpeGVkc2l6ZSkpIHRoaXMuZml4ZWRzaXplID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNb3ZlZEhhbmRsZXIgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTWluaW1pemVkSGFuZGxlciAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGROb3JtYWxpemVkSGFuZGxlciAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2NoYW5nZXBhcmVudCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUgKHZhbCkge1xyXG4gICAgICAgICh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKGUgPT4gZSAhPT0gdmFsKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQgKHZhbCwgcmVmKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IHJlZj8ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmluc2VydEJlZm9yZSh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQsIG5leHQpO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudCkuZmluZEluZGV4KGUgPT4gZS5uZXh0RWxlbWVudFNpYmxpbmcgPT09IHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnNwbGljZShpZHggKyAxLCAwLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuYXBwZW5kKHZhbC5vdXRlciA/PyB2YWwuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlJywgdGhpcy5fY2hpbGRNb3ZlSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdmVkJywgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtaW5pbWl6ZWQnLCB0aGlzLl9jaGlsZE1pbmltaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdub3JtYWxpemVkJywgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VwYXJlbnQnLCB2YWwuX2NoYW5nZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlICgpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ2Nsb3NlJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB0aGlzLl9wYXJlbnQubW9kaWZ5WkluZGV4KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGlmeVpJbmRleCAoYWN0aXZlKSB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93cyA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUub3B0cy50eXBlID09PSAncGFuZWwnKTtcclxuICAgICAgICBpZiAod2luZG93cy5pbmNsdWRlcyhhY3RpdmUpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSB3aW5kb3dzLmZpbHRlcihlID0+IGUgIT09IGFjdGl2ZSkuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEuZWxlbWVudC5zdHlsZS56SW5kZXggPz8gJzAnKSAtIE51bWJlcihiLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykpO1xyXG4gICAgICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICAgICAgZm9yICg7IGlkeCA8IHRhcmdldHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGFyZ2V0c1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gYCR7aWR4fWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZS5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxudHJ5IHtcclxuICAgIFBhbmVsQmFzZS53aW5kb3cgPSB3aW5kb3c7XHJcbiAgICBQYW5lbEJhc2UuZG9jdW1lbnQgPSBkb2N1bWVudDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG4gICAgUGFuZWxCYXNlLkhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuSW1hZ2UgPSBJbWFnZTtcclxufVxyXG5jYXRjaCB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkN1c3RvbUV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkhUTUxFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gdW5kZWZpbmVkO1xyXG59XHJcbiIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuaW1wb3J0IEJhc2VDb250YWluZXIgZnJvbSAnLi9iYXNlLWNvbnRhaW5lci5qcyc7XHJcblxyXG4vKipcclxuICogVUnjgpLmoLzntI3jgZnjgovjg5Hjg43jg6vjgqjjg6rjgqLjgILjgqbjgqPjg7Pjg4njgqbooajnpLrjg7vjgbvjgYvjg5Hjg43jg6vjgbjjga7moLzntI3jgYzlj6/og71cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsIGV4dGVuZHMgUGFuZWxCYXNlXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyBQYW5lbE9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdwYW5lbCcsXHJcbiAgICAgICAgcG9zaXRpb246IHt4OiAwLCB5OiAwfSxcclxuICAgICAgICBtaW5TaXplOiB7eDogMTIwLCB5OiAwfSxcclxuICAgICAgICBkZWZhdWx0U2l6ZToge3g6IDMyMCwgeTogMjQwfSxcclxuICAgICAgICB0aXRsZTogJycsXHJcbiAgICAgICAgY2xvc2VhYmxlOiB0cnVlLFxyXG4gICAgICAgIGF1dG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICBtaW5pbWFibGU6IHRydWUsXHJcbiAgICAgICAgbWF4aW11bToge2VuYWJsZTogdHJ1ZSwgc2hvd1RpdGxlYmFyOiB0cnVlfSxcclxuICAgICAgICBkZWZhdWx0TW9kZTogJ25vcm1hbCcsXHJcbiAgICAgICAgbW9kYWw6ICdtb2RhbGVzcycsXHJcbiAgICAgICAgb3ZlcmZsb3dYOiAnc2Nyb2xsJyxcclxuICAgICAgICBvdmVyZmxvd1k6ICdzY3JvbGwnLFxyXG4gICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWU6ICcnLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km44O744Oa44Kk44Oz6KGo56S644GM5Y+v6IO9XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgUGFuZWxPcHRpb25zIH0gICAgICAgICAgICBvcHRzICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfCBQYW5lbEJhc2UgfSBjb250ZW50IOWGheWuueOCs+ODs+ODhuODs+ODhFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3B0cyA9IFBhbmVsLkRFRkFVTFRfT1BUSU9OUywgY29udGVudCkge1xyXG4gICAgICAgIHN1cGVyKFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgT2JqZWN0LmFzc2lnbihvcHRzLCBQYW5lbC5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIFsnbWFnaWNhLXBhbmVsLXdpbmRvdyddLCBbJ21hZ2ljYS1wYW5lbC1pbm5lciddLCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveC1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmNsYXNzTGlzdC5hZGQoJ295LXMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmRlZmF1bHRNb2RlID09PSAnbm9ybWFsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS53aWR0aCA9IGAke29wdHMuZGVmYXVsdFNpemUueH1weGA7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLnN0eWxlLmhlaWdodCA9IGAke29wdHMuZGVmYXVsdFNpemUueX1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFBhbmVsQmFzZS5IVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCv+OCpOODiOODq+ODkOODvOOCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IHRpdGxlYmFyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cz8udGl0bGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gb3B0cy50aXRsZTtcclxuICAgICAgICAgICAgdGl0bGViYXIuYXBwZW5kKHNwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3B0cz8udGl0bGUgPT09ICdvYmplY3QnICYmIG9wdHMudGl0bGUgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGl0bGViYXIuYXBwZW5kKG9wdHMudGl0bGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhciA9IHRpdGxlYmFyO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRpdGxlYmFyLCB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC10aXRsZWJhcicpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1heGltdW0uc2hvd1RpdGxlYmFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGViYXIuY2xhc3NMaXN0LmFkZCgnbWF4aW11bS1kaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpO1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IFBhbmVsQmFzZS5JbWFnZSgpLCAwLCAwKTtcclxuICAgICAgICAgICAgZXYuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCAncGFuZWwnKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2FkZFJlc2l6ZUFyZWEoKTtcclxuXHJcbiAgICAgICAgLy8g44Oc44K/44Oz44Ko44Oq44Ki44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgYnV0dG9uYXJlYSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBidXR0b25hcmVhLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24tYXJlYScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoYnV0dG9uYXJlYSk7XHJcblxyXG4gICAgICAgIC8vIOmWieOBmOOCi+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IGNsb3NlYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNsb3NlYnV0dG9uLnRleHRDb250ZW50ID0gJ8OXJztcclxuICAgICAgICBjbG9zZWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uJywgJ2Nsb3NlJyk7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdHMuY2xvc2VhYmxlKSB7XHJcbiAgICAgICAgICAgIGNsb3NlYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJ1dHRvbmFyZWEuYXBwZW5kKGNsb3NlYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5aSn5YyWL+W+qeWFg+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IG1heGltdW1idXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi50ZXh0Q29udGVudCA9ICfinZAnO1xyXG4gICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdtYXhpbXVtJyk7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21heGltdW0nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF4aW11bSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1heGltdW0uZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xvc2VidXR0b24uYmVmb3JlKG1heGltdW1idXR0b24pO1xyXG5cclxuICAgICAgICAvLyDmnIDlsI/ljJYv5b6p5YWD44Oc44K/44Oz44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgbWluaW11bWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLnRleHRDb250ZW50ID0gJy0nO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdtaW5pbXVtJyk7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWluaW11bSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLm1pbmltYWJsZSkge1xyXG4gICAgICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1heGltdW1idXR0b24uYmVmb3JlKG1pbmltdW1idXR0b24pO1xyXG5cclxuICAgICAgICAvLyDjg6Ljg7zjg4Djg6tcclxuICAgICAgICBpZiAodGhpcy5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b3Btb3N0Jyk7XHJcbiAgICAgICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5vcHRzLnBvc2l0aW9uLnh9cHhgO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLm9wdHMucG9zaXRpb24ueX1weGA7XHJcbiAgICAgICAgdGhpcy5hZGp1c3RXaW5kb3dQb3NpdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9hZGRSZXNpemVBcmVhICgpIHtcclxuICAgICAgICAvLyDjg6rjgrXjgqTjgrrpoJjln5/jgpLov73liqBcclxuICAgICAgICB0aGlzLmVkZ2VzID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgW1sndG9wJ10sIFsnYm90dG9tJ10sIFsnbGVmdCddLCBbJ3JpZ2h0J10sIFsndG9wJywgJ2xlZnQnXSwgWyd0b3AnLCAncmlnaHQnXSwgWydib3R0b20nLCAnbGVmdCddLCBbJ2JvdHRvbScsICdyaWdodCddXSkge1xyXG4gICAgICAgICAgICBjb25zdCBlZGdlID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBlZGdlLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1lZGdlJywgLi4udGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChlZGdlKTtcclxuICAgICAgICAgICAgZWRnZS5kcmFnZ2FibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVBcmVhSGFuZGxlcihldik7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4gZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgSW1hZ2UoKSwgMCwgMCksIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5lZGdlc1t0YXJnZXRdID0gZWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9yZXNpemVBcmVhSGFuZGxlciAoZXYpIHtcclxuICAgICAgICBpZiAoZXYudHlwZSA9PT0gJ21vdXNlZG93bicgfHwgZXYudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCwgeTogZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWX07XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0cmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldi50eXBlID09PSAnZHJhZydcclxuICAgICAgICB8fCBldi50eXBlID09PSAndG91Y2htb3ZlJykge1xyXG4gICAgICAgICAgICBpZiAoKGV2LnNjcmVlblkgPz8gZXYudG91Y2hlcz8uWzBdPy5zY3JlZW5ZKSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvcCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fc3RhcnRyZWN0LmhlaWdodCArIHRoaXMuX2NsaWNrc3RhcnQueSAtIChldi5wYWdlWSA/PyBldi50b3VjaGVzWzBdLnBhZ2VZKSAtIDEwO1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxUb3AgKyB0aGlzLl9zdGFydHJlY3QuYm90dG9tIC0gaGVpZ2h0IC0gdGhpcy50aXRsZWJhci5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3N0YXJ0cmVjdC5oZWlnaHQgKyAoZXYucGFnZVkgPz8gZXYudG91Y2hlc1swXS5wYWdlWSkgLSB0aGlzLl9jbGlja3N0YXJ0LnkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgPz8gSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyB0aGlzLl9jbGlja3N0YXJ0LnggLSAoZXYucGFnZVggPz8gZXYudG91Y2hlc1swXS5wYWdlWCkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggPD0gdGhpcy5vcHRzLm1pblNpemUueD8gdGhpcy5vcHRzLm1pblNpemUueDogd2lkdGggPj0gKHRoaXMub3B0cy5tYXhTaXplPy54ID8/IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueDogd2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIHRoaXMuX3N0YXJ0cmVjdC5yaWdodCAtIHdpZHRofXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3N0YXJ0cmVjdC53aWR0aCArIChldi5wYWdlWCA/PyBldi50b3VjaGVzWzBdLnBhZ2VYKSAtIHRoaXMuX2NsaWNrc3RhcnQueCAtIDEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRoIDw9IHRoaXMub3B0cy5taW5TaXplLng/IHRoaXMub3B0cy5taW5TaXplLng6IHdpZHRoID49ICh0aGlzLm9wdHMubWF4U2l6ZT8ueCA/PyBJbmZpbml0eSk/IHRoaXMub3B0cy5tYXhTaXplLng6IHdpZHRofXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKioqXHJcbiAgICAgKiBAcGFyYW0geyBNb3VzZUV2ZW50IH0gZXZcclxuICAgICAqL1xyXG4gICAgX21vdmVUaXRsZWJhckhhbmRsZXIgKGV2KSB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBCYXNlQ29udGFpbmVyKVxyXG4gICAgICAgIHx8IHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAndG91Y2hzdGFydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBldi50YXJnZXQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYub2Zmc2V0WCA/PyAoZXYudG91Y2hlc1swXS5wYWdlWCAtIHJlY3QubGVmdCksIHk6IGV2Lm9mZnNldFkgPz8gKGV2LnRvdWNoZXNbMF0ucGFnZVkgLSByZWN0LnRvcCl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNobW92ZSc6IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhdGVzdFRvdWNoRXYgPSBldjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAnZHJhZyc6IHtcclxuICAgICAgICAgICAgICAgIGlmICgoZXYuc2NyZWVuWSA/PyBldi50b3VjaGVzPy5bMF0/LnNjcmVlblkpID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2LnBhZ2VYID8/IGV2LnRvdWNoZXNbMF0ucGFnZVgpKSAtIHRoaXMuX2NsaWNrc3RhcnQueH1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7KHRoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2LnBhZ2VZID8/IGV2LnRvdWNoZXNbMF0ucGFnZVkpKSAtIHRoaXMuX2NsaWNrc3RhcnQueX1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZScsIHtkZXRhaWw6IHtyZWN0OiB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSwgZXYsIHRhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAndG91Y2hlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICBldiA9IHRoaXMuX2xhdGVzdFRvdWNoRXY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZWQnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0V2luZG93UG9zaXRpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXTtcclxuICAgICAgICBpZiAoIWN1cnJlbnRSZWN0IHx8ICF0aGlzLnBhcmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQgPiB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgJiYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCkgPCBjdXJyZW50UmVjdC5ib3R0b20pIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCAtIHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoID4gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgICAgICAgJiYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoKSA8IGN1cnJlbnRSZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50V2lkdGggLSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGh9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRSZWN0LmxlZnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFJlY3QudG9wIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1heGltdW0gKCkge1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXT8ubGVmdCA/PyAwO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21heGltdW0nKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsICh4KSB7XHJcbiAgICAgICAgbGV0IHJhdGlvID0gMDtcclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgcmF0aW8gPSAoeCAtIHJlY3QubGVmdCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21pbmltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF4aW11bScpO1xyXG5cclxuICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHcgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXS53aWR0aDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NsaWNrc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQueCA9IHcgKiByYXRpbztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtNYXRoLnJvdW5kKHggLSAodyAqIHJhdGlvKSl9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9sZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5fbGVmdH1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbm9ybWFsaXplZCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBtaW5pbXVtICgpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0/LmxlZnQgPz8gMDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF4aW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21pbmltaXplZCcsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZVBhcmVudEhhbmRsZXIgKF9ldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21heGltdW0nKSAmJiAhdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0V2luZG93UG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLnJlc2l6ZVBhcmVudEhhbmRsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBzdXBlci5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2dCk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5tb2RhbCA9PT0gJ21vZGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1tb2RhbC1ibG9ja2VyJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLm91dGVyLCB0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLm91dGVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChyZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGBjYWxjKDUwJSAtICR7cmVjdC53aWR0aCAvIDJ9cHgpYDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgY2FsYyg1MCUgLSAke3JlY3QuaGVpZ2h0IC8gMn1weClgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLnJlc2l6ZVBhcmVudEhhbmRsZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcblxyXG4vKipcclxuICog5Z6C55u044G+44Gf44Gv5rC05bmz5pa55ZCR44G444Gu5pW05YiX44KE44K/44OW5YiH44KK5pu/44GI44Gr44KI44KL44OR44ON44Or44Gu44K544Kk44OD44OBKDPlgIvjga7jgYbjgaHjgYTjgZrjgozjgYsx44GkKeOCkuaPkOS+m+OBl+OBvuOBmeOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhY2tDb250YWluZXIgZXh0ZW5kcyBQYW5lbEJhc2Vcclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IFN0YWNrQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcclxuICAgICAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgcmVwcm9wb3J0aW9uYWJsZTogdHJ1ZSxcclxuICAgICAgICBkb2NrYWJsZTogdHJ1ZSxcclxuICAgICAgICBzZXBhcmF0b3JXaWR0aDogMixcclxuICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lOiAnJyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgICAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHBhbmVsQWRkQXJlYTogdW5kZWZpbmVkLFxyXG4gICAgICAgIGFkanVzdFNpemU6IHRydWUsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVUnjgpLmoLzntI3jgZnjgovjg5Hjg43jg6vjgqjjg6rjgqLjgILjgqbjgqPjg7Pjg4njgqbjg7vjg5rjgqTjg7PooajnpLrjgYzlj6/og71cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBTdGFja0NvbnRhaW5lck9wdGlvbnMgfSAgICAgIG9wdHMgICAg44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuIOWGheWuueOCs+ODs+ODhuODs+ODhFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3B0cyA9IFN0YWNrQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgU3RhY2tDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCBbJ21hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyJ10sIFsnbWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyJ10sIC4uLmNoaWxkcmVuKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5hZGp1c3RTaXplID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzLm9wdHMudGVtcGxhdGUpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaG9yaXpvbnRhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndGFiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhZGRBcmVhID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBhZGRBcmVhLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InLCAnZW1wdHknKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMucGFuZWxBZGRBcmVhID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgYWRkQXJlYS5hcHBlbmQodGhpcy5vcHRzLnBhbmVsQWRkQXJlYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBcmVhLnRleHRDb250ZW50ID0gdGhpcy5vcHRzLnBhbmVsQWRkQXJlYSA/PyB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAn4pakJyA6ICfilqUnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goYWRkQXJlYSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoYWRkQXJlYSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tb3ZlaGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVkgPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxUb3AgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWSA/PyBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVkpO1xyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVggPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2dC5kZXRhaWwuZXYucGFnZVggPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbVJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1SZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCBlbGVtUmVjdC5ib3R0b21cclxuICAgICAgICAgICAgJiYgZWxlbVJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCBlbGVtUmVjdC5yaWdodFxyXG4gICAgICAgICAgICAmJiBldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1heGltdW0uZW5hYmxlID09PSB0cnVlICYmIHRoaXMub3B0cy5kb2NrYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBhZGRhcmVhIG9mIHRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBhZGRhcmVhLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocmVjdCAmJiByZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCByZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAgICAgJiYgcmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IHJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9tb3ZlZGhhbmRsZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW91c2VZID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2dC5kZXRhaWwuZXYucGFnZVkgPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VYID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldnQuZGV0YWlsLmV2LnBhZ2VYID8/IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1SZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChlbGVtUmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgZWxlbVJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICYmIGVsZW1SZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgZWxlbVJlY3QucmlnaHRcclxuICAgICAgICAgICAgJiYgZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tYXhpbXVtLmVuYWJsZSA9PT0gdHJ1ZSAmJiB0aGlzLm9wdHMuZG9ja2FibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYWRkYXJlYSBvZiB0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZyA9PT0gYWRkYXJlYS5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcgPT09IGFkZGFyZWEucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCAhPT0gdGhpcy5yb290KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gYWRkYXJlYS5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWN0ICYmIHJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IHJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IHJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdHJlZiA9IHRoaXMuZWxlbWVudC5jb250YWlucyhhZGRhcmVhLmNsb3Nlc3QoJy5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXInKSk/IGFkZGFyZWEucGFyZW50RWxlbWVudDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSBldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIucGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIHN1cGVyLnBhcmVudCA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBzdXBlci5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2dCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmUnLCB0aGlzLl9tb3ZlaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZWQnLCB0aGlzLl9tb3ZlZGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlJywgdGhpcy5fbW92ZWhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlZCcsIHRoaXMuX21vdmVkaGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQgKHZhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5hZGRhcmVhcykgdGhpcy5hZGRhcmVhcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmlubmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZXAgPSB0aGlzLl9nZW5lcmF0ZVNlcGFyYXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goc2VwLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoc2VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5nZXMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSkge1xyXG4gICAgICAgICAgICBjb25zdCB3aW5kb3dSYW5nZSA9IHRoaXMuX2xhc3RUYXJnZXRSYW5nZTtcclxuICAgICAgICAgICAgcmFuZ2VzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddID8/IGUub3B0cz8uZGVmYXVsdFNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddID8/IDEwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGFzdHJlZikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmluZGV4T2YodGhpcy5fbGFzdHJlZi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydFRhcmdldFJhbmdlID0gKChyYW5nZXNbaWR4XSA/PyAwKSArIChyYW5nZXNbaWR4ICsgMV0gPz8gMCkpIC8gMjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydFJhbmdlID0gTWF0aC5taW4oaW5zZXJ0VGFyZ2V0UmFuZ2UsIHdpbmRvd1JhbmdlKSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICh+aWR4ICYmIHJhbmdlc1tpZHggKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzbWFsbElkeCwgbGFyZ2VJZHhdID0gcmFuZ2VzW2lkeF0gPiByYW5nZXNbaWR4ICsgMV0/IFtpZHggKyAxLCBpZHhdOiBbaWR4LCBpZHggKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IHJhbmdlc1tzbWFsbElkeF0gLyByYW5nZXNbbGFyZ2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNtYWxsU2l6ZSA9IE1hdGgucm91bmQoaW5zZXJ0UmFuZ2UgLyAyICogcmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tzbWFsbElkeF0gLT0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tsYXJnZUlkeF0gLT0gKGluc2VydFJhbmdlIC0gc21hbGxTaXplKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKH5pZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZXNbaWR4XSAtPSBpbnNlcnRSYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggKyAxXSAtPSBpbnNlcnRSYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByYW5nZXMuc3BsaWNlKGlkeCArIDEsIDAsIGluc2VydFJhbmdlIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmFwcGVuZCh2YWwsIHRoaXMuX2xhc3RyZWYpO1xyXG4gICAgICAgIGlmICh2YWwubWF4aW11bSkgdmFsLm1heGltdW0oKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VwID0gdGhpcy5fZ2VuZXJhdGVTZXBhcmF0b3IoKTtcclxuICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goc2VwLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICBpZiAodmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuaW5zZXJ0QmVmb3JlKHNlcCwgdmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuYXBwZW5kKHNlcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSAmJiB0aGlzLm9wdHMuYWRqdXN0U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcy5sZW5ndGggPT09IDA/IHVuZGVmaW5lZDogcmFuZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50Lm9wdHMudHlwZSA9PT0gJ2Jhc2UnIHx8IHRoaXMucGFyZW50LmZpeGVkc2l6ZSkgdGhpcy5maXhlZHNpemUgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgcmFuZ2VzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddKS5maWx0ZXIoZSA9PiBlICE9PSB1bmRlZmluZWQpO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gcmFuZ2VzLnJlZHVjZSgoYSwgYykgPT4gYSArIGMsIDApO1xyXG4gICAgICAgIGNvbnN0IHJhdGlvcyA9IHJhbmdlcy5tYXAoZSA9PiBlIC8gdG90YWwpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9IHRoaXMuaW5uZXIuZ2V0Q2xpZW50UmVjdHMoKVswXVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gLSAodGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoICogKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICsgMSkpO1xyXG4gICAgICAgIHJhbmdlcyA9IHJhdGlvcy5tYXAoZSA9PiBNYXRoLnJvdW5kKGUgKiBjdXJyZW50V2lkdGgpKTtcclxuICAgICAgICByYW5nZXMucG9wKCk7XHJcbiAgICAgICAgcmFuZ2VzLnB1c2goY3VycmVudFdpZHRoIC0gcmFuZ2VzLnJlZHVjZSgoYSwgYykgPT4gYSArIGMsIDApKTtcclxuICAgICAgICByYW5nZXMgPSByYW5nZXMubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIGlmIChyYW5nZXMubGVuZ3RoID4gMCAmJiB0aGlzLm9wdHMuYWRqdXN0U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICh2YWwpIHtcclxuICAgICAgICBsZXQgcmFuZ2VzID0gdHlwZW9mIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9PT0gJ29iamVjdCc/IHRoaXMuX2xhc3RUYXJnZXRSYW5nZTogdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddKTtcclxuICAgICAgICBpZiAocmFuZ2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKHZhbCk7XHJcbiAgICAgICAgICAgIGlmICghcmFuZ2VzW2lkeCAtIDFdICYmIHJhbmdlc1tpZHggKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCArIDFdICs9IHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFyYW5nZXNbaWR4ICsgMV0gJiYgcmFuZ2VzW2lkeCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbaWR4IC0gMV0gKz0gcmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocmFuZ2VzW2lkeCArIDFdICYmIHJhbmdlc1tpZHggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW3NtYWxsSWR4LCBsYXJnZUlkeF0gPSByYW5nZXNbaWR4IC0gMV0gPiByYW5nZXNbaWR4ICsgMV0/IFtpZHggKyAxLCBpZHggLSAxXTogW2lkeCAtIDEsIGlkeCArIDFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmF0aW8gPSByYW5nZXNbc21hbGxJZHhdIC8gcmFuZ2VzW2xhcmdlSWR4XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNtYWxsU2l6ZSA9IE1hdGgucm91bmQoKHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKSAvIDIgKiByYXRpbyk7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbc21hbGxJZHhdICs9IHNtYWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tsYXJnZUlkeF0gKz0gKHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKSAtIHNtYWxsU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLmZpbHRlcigoX2UsIGkpID0+IGkgIT09IGlkeCkubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBzdXBlci5yZW1vdmUodmFsKTtcclxuICAgICAgICBpZiAodGhpcy5pbm5lci5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRhcmVhcy5maWx0ZXIoZSA9PiBlICE9PSB0aGlzLmlubmVyLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5jaGlsZHJlblswXS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRzLmFkanVzdFNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCByYW5nZXM/Lmxlbmd0aCA9PT0gMD8gdW5kZWZpbmVkOiByYW5nZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfY2FsY0dyaWRTaXplIChzZXAsIHBvcywgdGVtcGxhdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMucGFyZW50Py5maXhlZHNpemUgJiYgdGhpcy5wYXJlbnQ/Lm9wdHM/LnR5cGUgIT09ICdiYXNlJykgcmV0dXJuO1xyXG4gICAgICAgIGlmICgoIXRoaXMub3B0cy50ZW1wbGF0ZSB8fCB0aGlzLm9wdHMudGVtcGxhdGU/Lmxlbmd0aCA9PT0gdGhpcy5jaGlsZHJlbi5sZW5ndGgpICYmICF0aGlzLl9ncmlkSW5pdCkgdGVtcGxhdGUgPSB0aGlzLm9wdHMudGVtcGxhdGU7XHJcblxyXG4gICAgICAgIHRoaXMuX2dyaWRJbml0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2dyaWRUZW1wbGF0ZVJvd3MnOiAnZ3JpZFRlbXBsYXRlQ29sdW1ucyc7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFNpemVzID0gdGVtcGxhdGUgPz8gdGhpcy5pbm5lci5zdHlsZVt0YXJnZXRdLnNwbGl0KCcgJykuZmlsdGVyKGUgPT4gZSAhPT0gJycpLmZpbHRlcigoX2UsIGkpID0+IGkgJSAyICE9PSAwKTtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZVt0YXJnZXRdID0gJyc7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjdXJyZW50U2l6ZXNbMF0gPSAnMWZyJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZXAgJiYgc2VwLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgc2VwLm5leHRFbGVtZW50U2libGluZyAmJiBwb3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCBicm9zID0gQXJyYXkuZnJvbSh0aGlzLmlubmVyLmNoaWxkcmVuKS5maWx0ZXIoZSA9PiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZJZHggPSBicm9zLmluZGV4T2Yoc2VwLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0SWR4ID0gYnJvcy5pbmRleE9mKHNlcC5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2UmVjdCA9IHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRSZWN0ID0gc2VwLm5leHRFbGVtZW50U2libGluZy5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByZXZSYW5nZSA9IHBvcyAtICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBwcmV2UmVjdC50b3A6IHByZXZSZWN0LmxlZnQgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpO1xyXG4gICAgICAgICAgICBsZXQgZnJGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChwcmV2UmFuZ2UgPD0gMCAmJiB0aGlzLmNoaWxkcmVuW3ByZXZJZHhdLm9wdHMubWluaW1hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBmckZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gJzBweCc7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnYm90dG9tJzogJ3JpZ2h0J10gLSBwcmV2UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAndG9wJzogJ2xlZnQnXSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2UmFuZ2UgPSB0aGlzLmNoaWxkcmVuW3ByZXZJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gPiBwcmV2UmFuZ2UgPyB0aGlzLmNoaWxkcmVuW3ByZXZJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gOiBwcmV2UmFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBuZXh0UmFuZ2UgPSAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gbmV4dFJlY3QuYm90dG9tOiBuZXh0UmVjdC5yaWdodCkgLSAoKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IHByZXZSZWN0LnRvcDogcHJldlJlY3QubGVmdCkgKyBwcmV2UmFuZ2UgKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICBpZiAobmV4dFJhbmdlIDw9IDAgJiYgdGhpcy5jaGlsZHJlbltuZXh0SWR4XS5vcHRzLm1pbmltYWJsZSAmJiAhZnJGbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBmckZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7bmV4dFJlY3RbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2JvdHRvbSc6ICdyaWdodCddIC0gcHJldlJlY3RbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3RvcCc6ICdsZWZ0J10gLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gJzBweCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0UmFuZ2UgPSB0aGlzLmNoaWxkcmVuW25leHRJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gPiBuZXh0UmFuZ2UgPyB0aGlzLmNoaWxkcmVuW25leHRJZHhdLm9wdHMubWluU2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gOiBuZXh0UmFuZ2U7XHJcbiAgICAgICAgICAgICAgICBwcmV2UmFuZ2UgPSBuZXh0UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnYm90dG9tJzogJ3JpZ2h0J10gLSBwcmV2UmVjdFt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAndG9wJzogJ2xlZnQnXSAtIG5leHRSYW5nZSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFmckZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cHJldlJhbmdlfXB4YDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmFuZ2V9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cHJldlJhbmdlfXB4YDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmFuZ2V9cHhgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaWR4KyspIGlmIChjdXJyZW50U2l6ZXNbaWR4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTaXplcy5wdXNoKCcxZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnRTaXplcy5zcGxpY2UodGhpcy5jaGlsZHJlbi5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XSA9IGAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weCAke2N1cnJlbnRTaXplcy5qb2luKGAgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHggYCl9ICR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4YDtcclxuICAgICAgICB0aGlzLmZpeGVkc2l6ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIF9nZW5lcmF0ZVNlcGFyYXRvciAoKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InKTtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLnJlcHJvcG9ydGlvbmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbS5zdHlsZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gPSBgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgICAgIGVsZW0uZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBpbm5lciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpbm5lci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhJyk7XHJcbiAgICAgICAgZWxlbS5hcHBlbmQoaW5uZXIpO1xyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4ge1xyXG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5ldyBJbWFnZSgpLCAwLCAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdkcmFnJywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXYuc2NyZWVuWSA9PT0gMCB8fCB0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZShldi50YXJnZXQsIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IGV2LnBhZ2VZIDogZXYucGFnZVgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2LnRvdWNoZXNbMF0/LnNjcmVlblkgPT09IDAgfHwgdGhpcy5vcHRzLnJlcHJvcG9ydGlvbmFibGUgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUoZXYudGFyZ2V0LCB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyBldi50b3VjaGVzWzBdLnBhZ2VZIDogZXYudG91Y2hlc1swXS5wYWdlWCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBlbGVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a2Q6KaB57Sg44Gu56e75YuV44Gr6L+95b6T44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIGNoaWxkTW92ZUhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddKTtcclxuICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5ub3JtYWwoKGV2dC5kZXRhaWwuZXYucGFnZVggPz8gZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKSk7XHJcbiAgICAgICAgZXZ0LmRldGFpbC50YXJnZXQucGFyZW50ID0gdGhpcy5yb290O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByb290ICgpIHtcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChwYXJlbnQ/LnBhcmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfVxyXG59XHJcbiIsImNvbnN0IHN0eWxlID0gYFxyXG4ubWFnaWNhLXBhbmVsLXdyYXBwZXIge1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdyYXBwZXIub3gtcyB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdyYXBwZXIub3ktcyB7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJhc2Uge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgbWluLXdpZHRoOiAxMDAlO1xyXG4gICAgbWluLWhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdyB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcGFkZGluZzogNHB4O1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC10aXRsZWJhciB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBoZWlnaHQ6IDEuNXJlbTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IGNhbGMoMi41cmVtICogMyk7XHJcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC10aXRsZWJhci5tYXhpbXVtLWRpc2FibGUgfiAubWFnaWNhLXBhbmVsLWJ1dHRvbi1hcmVhIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtdGl0bGViYXIgPiAqIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgIHBhZGRpbmc6IDFweDtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtaW5uZXIub3ktcyB7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2Uge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmxlZnQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiA0cHg7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnJpZ2h0IHtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UubGVmdDphY3RpdmUsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5yaWdodDphY3RpdmUge1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3Age1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGhlaWdodDogNHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbSB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wOmFjdGl2ZSxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbTphY3RpdmUge1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AubGVmdCxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5yaWdodCxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5sZWZ0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLnJpZ2h0IHtcclxuICAgIGhlaWdodDogNHB4O1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIHRvcDogdW5zZXQ7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxuICAgIHJpZ2h0OiB1bnNldDtcclxuICAgIGJvdHRvbTogdW5zZXQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AubGVmdCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgY3Vyc29sOiBud3NlLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5yaWdodCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGN1cnNvbDogbmVzdy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ubGVmdCB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgY3Vyc29sOiBuZXN3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5yaWdodCB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGN1cnNvbDogbndzZS1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0ge1xyXG4gICAgcGFkZGluZzogMHB4O1xyXG4gICAgdG9wOiAwICFpbXBvcnRhbnQ7XHJcbiAgICBsZWZ0OiAwICFpbXBvcnRhbnQ7XHJcbiAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIC5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIC5tYWdpY2EtcGFuZWwtdGl0bGViYXIge1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAycHgpICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDEuNXJlbSAtIDZweCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIH4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJweCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSB7XHJcbiAgICB3aWR0aDogMTg2cHg7XHJcbiAgICBib3R0b206IDAgIWltcG9ydGFudDtcclxuICAgIHRvcDogdW5zZXQgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cudG9wbW9zdCB7XHJcbiAgICB6LWluZGV4OiA2NTUzNSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLW1vZGFsLWJsb2NrZXIge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwuNSk7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB6LWluZGV4OiA2NTUzNSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtID4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtID4gLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uIHtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB3aWR0aDogMi41cmVtO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5kZW55IHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmNsb3NlIHtcclxuICAgIGJhY2tncm91bmQ6ICM3MDE5MTk7XHJcbn1cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uY2xvc2Uub25hY3RpdmUge1xyXG4gICAgYmFja2dyb3VuZDogI2U2MzIzMjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgei1pbmRleDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHotaW5kZXg6IDEwMDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuZW1wdHkge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIGZvbnQtc2l6ZTogM3JlbTtcclxuICAgIHdpZHRoOiA1cmVtO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgb3BhY2l0eTogMC41O1xyXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNSwyNSwxMTIsIDAuMyk7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAxMHJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgbGVmdDogLTVyZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmZpcnN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgbGVmdDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6bGFzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgbGVmdDogdW5zZXQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTByZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICB0b3A6IC01cmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Zmlyc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICB0b3A6IDA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpsYXN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgdG9wOiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguaG92ZXIpOk5PVCguZGlzYWJsZSk6Tk9UKDpmaXJzdC1vZi10eXBlKTpOT1QoOmxhc3Qtb2YtdHlwZSk6aG92ZXIge1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguaG92ZXIpOk5PVCguZGlzYWJsZSk6Tk9UKDpmaXJzdC1vZi10eXBlKTpOT1QoOmxhc3Qtb2YtdHlwZSk6aG92ZXIge1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3ZlciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpOT1QoLmVtcHR5KSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyLmVtcHR5IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLmVtcHR5IHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLmhvdmVyIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogMWZyO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0ge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdG9wOiB1bnNldCAhaW1wb3J0YW50O1xyXG4gICAgbGVmdCB1bnNldCAhaW1wb3J0YW50O1xyXG4gICAgei1pbmRleDogdW5zZXQgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLWJ1dHRvbi5tYXhpbXVtIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC1idXR0b24ubWluaW11bSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcbmA7XHJcblxyXG5jb25zdCBWYWx1ZSA9IHtcclxuICAgIHN0eWxlLFxyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShWYWx1ZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWYWx1ZTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgYmFzZUNvbnRhaW5lciBmcm9tICcuL2Jhc2UtY29udGFpbmVyLmpzJztcclxuaW1wb3J0IHBhbmVsIGZyb20gJy4vcGFuZWwuanMnO1xyXG5pbXBvcnQgc3RhY2tDb250YWluZXIgZnJvbSAnLi9zdGFjay1jb250YWluZXIuanMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJhc2VDb250YWluZXIgPSBiYXNlQ29udGFpbmVyO1xyXG5leHBvcnQgY29uc3QgUGFuZWwgPSBwYW5lbDtcclxuZXhwb3J0IGNvbnN0IFN0YWNrQ29udGFpbmVyID0gc3RhY2tDb250YWluZXI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIEJhc2VDb250YWluZXIsXHJcbiAgICBQYW5lbCxcclxuICAgIFN0YWNrQ29udGFpbmVyLFxyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=