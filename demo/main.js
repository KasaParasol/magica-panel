var MagicaPanel;
/******/ (() => { // webpackBootstrap
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
 * @typedef  TabOptions
 *
 * @property { '' }
 */

/**
 * @typedef  StackContainerOptions
 *
 * @property { 'stack' }                                type                パネル種別
 * @property { 'vertical' | 'horizontal' | TabOptions } direction           分割方向
 * @property { string[] }                               template            コレクション各要素の初期サイズ
 * @property { boolean }                                reproportionable    コレクションの比率を操作できるか
 * @property { boolean }                                dockable            コレクションの脱着操作ができるか(ユーザ操作から)
 * @property { number }                                 separatorWidth      分割境界線の幅(1～)
 * @property { string }                                 additionalClassName パネルに追加で付けるクラス名
 * @property { string | HTMLElement }                   panelAddArea        スタック内が空のときに表示されるパネル追加アイコン
 * @property { any[] }                                  attributes          任意に指定できる属性
 */

/**
 * @typedef BaseContainerOptions
 *
 * @property { 'base' }              type                パネル種別
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
        PanelBase.document.head.append(style);
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
            edge.addEventListener('drag', ev => this._resizeAreaHandler(ev));
            edge.addEventListener('dragstart', ev => ev.dataTransfer.setDragImage(new Image(), 0, 0), false);
            this.edges[target] = edge;
        }
    }

    /***
     * @param { MouseEvent } ev
     */
    _resizeAreaHandler (ev) {
        if (ev.type === 'mousedown') {
            this._clickstart = {x: ev.pageX, y: ev.pageY};
            this._startrect = this.element.getClientRects()[0];
        }
        else if (ev.type === 'drag') {
            if (ev.screenY === 0) return;

            if (ev.target.classList.contains('top')) {
                let height = this._startrect.height + this._clickstart.y - ev.pageY - 10;
                height = height <= this.opts.minSize.y? this.opts.minSize.y: height >= (this.opts.maxSize?.y || Infinity)? this.opts.maxSize.y: height;
                this.element.style.top = `${this.parent.element.scrollTop + this._startrect.bottom - height - this.titlebar.clientHeight}px`;
                this.inner.style.height = `${height}px`;
            }

            if (ev.target.classList.contains('bottom')) {
                const height = this._startrect.height + ev.pageY - this._clickstart.y - 10;
                this.inner.style.height = `${height <= this.opts.minSize.y? this.opts.minSize.y: height >= (this.opts.maxSize?.y || Infinity)? this.opts.maxSize.y: height}px`;
            }

            if (ev.target.classList.contains('left')) {
                let width = this._startrect.width + this._clickstart.x - ev.pageX - 10;
                width = width <= this.opts.minSize.x? this.opts.minSize.x: width >= (this.opts.maxSize?.x || Infinity)? this.opts.maxSize.x: width;
                this.element.style.left = `${this.parent.element.scrollLeft + this._startrect.right - width}px`;
                this.inner.style.width = `${width}px`;
            }

            if (ev.target.classList.contains('right')) {
                const width = this._startrect.width + ev.pageX - this._clickstart.x - 10;
                this.inner.style.width = `${width <= this.opts.minSize.x? this.opts.minSize.x: width >= (this.opts.maxSize?.x || Infinity)? this.opts.maxSize.x: width}px`;
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
            case 'mousedown': {
                this._clickstart = {x: ev.offsetX, y: ev.offsetY};
                break;
            }

            case 'drag': {
                if (ev.screenY === 0) return;

                this.element.style.left = `${(this.parent.element.scrollLeft + ev.pageX) - this._clickstart.x}px`;
                this.element.style.top = `${(this.parent.element.scrollTop + ev.pageY) - this._clickstart.y}px`;
                this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('move', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
                break;
            }

            case 'dragend': {
                this.adjustWindowPosition();
                this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('moved', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
                break;
            }
        }
    }

    adjustWindowPosition () {
        const currentRect = this.element.getClientRects()[0];
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
        this._left = this.element.getClientRects()[0]?.left || 0;
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
        this._left = this.element.getClientRects()[0]?.left || 0;
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

            const mouseY = this.root.element.scrollTop + evt.detail.ev.pageY;
            const mouseX = this.root.element.scrollLeft + evt.detail.ev.pageX;
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
                if (rect && rect.top < evt.detail.ev.clientY && evt.detail.ev.clientY < rect.bottom
                && rect.left < evt.detail.ev.clientX && evt.detail.ev.clientX < rect.right) {
                    addarea.classList.add('hover');
                }
                else {
                    addarea.classList.remove('hover');
                }
            }
        };

        this._movedhandler = evt => {
            if (evt.detail.target.opts.modal !== 'modaless') return;

            const mouseY = this.root.element.scrollTop + evt.detail.ev.pageY;
            const mouseX = this.root.element.scrollLeft + evt.detail.ev.pageX;
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
                    if (rect && rect.top < evt.detail.ev.clientY && evt.detail.ev.clientY < rect.bottom
                    && rect.left < evt.detail.ev.clientX && evt.detail.ev.clientX < rect.right) {
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
            ranges = this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width'] || e.opts?.defaultSize[this.opts.direction === 'vertical'? 'y': 'x'] || 100);

            if (this._lastref) {
                const idx = this.children.map(e => e.element).indexOf(this._lastref.previousElementSibling);
                const insertTargetRange = ((ranges[idx] || 0) + (ranges[idx + 1] || 0)) / 2;
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
        const currentSizes = template || this.inner.style[target].split(' ').filter(e => e !== '').filter((_e, i) => i % 2 !== 0);
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

        return elem;
    }

    /**
     * 子要素の移動に追従します。
     */
    childMoveHandler (evt) {
        this._lastTargetRange = this.children.map(e => e.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width']);
        evt.detail.target.normal(evt.detail.ev.pageX);
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-container.js */ "./src/base-container.js");
/* harmony import */ var _panel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./panel.js */ "./src/panel.js");
/* harmony import */ var _stack_container_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stack-container.js */ "./src/stack-container.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({BaseContainer: _base_container_js__WEBPACK_IMPORTED_MODULE_0__["default"], Panel: _panel_js__WEBPACK_IMPORTED_MODULE_1__["default"], StackContainer: _stack_container_js__WEBPACK_IMPORTED_MODULE_2__["default"]});

})();

MagicaPanel = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsRUFBRTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixrRUFBcUIsWUFBWSxTQUFTLGNBQWM7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLEVBQUU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsdUJBQXVCO0FBQ2xFLDJDQUEyQywwQkFBMEI7QUFDckU7QUFDQTtBQUNBLDJDQUEyQyx3QkFBd0I7QUFDbkUsMkNBQTJDLHlCQUF5QjtBQUNwRTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNEJBQTRCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHlCQUF5QixLQUFLLHNCQUFzQix5QkFBeUIsT0FBTyxFQUFFLHlCQUF5QjtBQUNySjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkVBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UseUJBQXlCO0FBQ3hHO0FBQ0Esc0JBQXNCLDZFQUFnQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUM1VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxLQUFLLEVBQUM7Ozs7Ozs7VUN2WXJCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNqQjtBQUNtQjtBQUNsRDtBQUNBLGlFQUFlLENBQUMsYUFBYSxtRUFBTyxtRUFBZ0IsOERBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2Jhc2UtY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3BhbmVsLWJhc2UuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvcGFuZWwuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvc3RhY2stY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3ZhbHVlcy5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDjgZnjgbnjgabjga7opqrjgajjgarjgovopoHntKDjgILjg4Tjg6rjg7zkuIrjgasx44Gk5LiA55Wq6Kaq44Gr44Gu44G/5Yip55So44Gn44GN44KL44CCXHJcbiAqIOOCpuOCo+ODs+ODieOCpuOBr+OBk+OBruS4reOBl+OBi+enu+WLleOBp+OBjeOBquOBhOOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUNvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgQmFzZUNvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdiYXNlJyxcclxuICAgICAgICBvdmVyZmxvd1g6ICdzY3JvbGwnLFxyXG4gICAgICAgIG92ZXJmbG93WTogJ3Njcm9sbCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44GZ44G544Gm44Gu6Kaq44Go44Gq44KL6KaB57Sg44CCXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgICAgIGVsZW1lbnQgICDoh6rouqvjgpLooajnpLrjgZnjgotIVE1M6KaB57SgXHJcbiAgICAgKiBAcGFyYW0geyBCYXNlQ29udGFpbmVyT3B0aW9ucyB9ICAgICAgIG9wdHMgICAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW4gIOWtkOimgee0oCjjgrnjgr/jg4Pjgq/jga/lhYjpoK0x44Gu44G/44O75Yid5Zue6LW35YuV5pmC44Gu6L+95Yqg44Gu44G/6Kix5Y+vKVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cyA9IEJhc2VDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIE9iamVjdC5hc3NpZ24ob3B0cywgQmFzZUNvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIC4uLkJhc2VDb250YWluZXIuc2FuaXRpemVDaGlsZHJlbihjaGlsZHJlbikpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXdyYXBwZXInKTtcclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnKSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3gtcycpO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdveS1zJyk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5uZXIuY2xhc3NOYW1lID0gJ21hZ2ljYS1wYW5lbC1iYXNlJztcclxuICAgICAgICBpZiAob3B0cy5hZGRpdGlvbmFsQ2xhc3NOYW1lcykgdGhpcy5pbm5lci5jbGFzc0xpc3QuYWRkKC4uLm9wdHMuYWRkaXRpb25hbENsYXNzTmFtZXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9zZXRSZXNpemVFdmVtdChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODquOCteOCpOOCuuOCpOODmeODs+ODiOOCkuioreWumuOBl+OBvuOBmeOAglxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbSDjgqTjg5njg7Pjg4jjgr/jg7zjgrLjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgX3NldFJlc2l6ZUV2ZW10IChlbGVtKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbXJlY3QgPSB7eDogZWxlbS5jbGllbnRXaWR0aCwgeTogZWxlbS5jbGllbnRIZWlnaHR9O1xyXG4gICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtLmNsaWVudFdpZHRoICE9PSB0aGlzLl9lbGVtcmVjdC54XHJcbiAgICAgICAgICAgIHx8IGVsZW0uY2xpZW50SGVpZ2h0ICE9PSB0aGlzLl9lbGVtcmVjdC55KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtcmVjdCA9IHt4OiBlbGVtLmNsaWVudFdpZHRoLCB5OiBlbGVtLmNsaWVudEhlaWdodH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDogdGhpcy5fZWxlbXJlY3R9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoUGFuZWxCYXNlLndpbmRvdy5SZXNpemVPYnNlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBybyA9IG5ldyBQYW5lbEJhc2Uud2luZG93LlJlc2l6ZU9ic2VydmVyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJvLm9ic2VydmUoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGFuZWxCYXNlLndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBmKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7phY3liJfjgYzmraPjgZfjgYTmp4vmiJDjgavjgarjgovjgojjgYbjgavmpJzoqLzjg7vjg5XjgqPjg6vjgr/jgZfjgb7jgZnjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUNoaWxkcmVuIChjaGlsZHJlbikge1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gY2hpbGRyZW4uZmluZChlID0+IGUub3B0cy50eXBlID09PSAnc3RhY2snKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoc3RhY2spIHJlc3VsdC5wdXNoKHN0YWNrKTtcclxuICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJykpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3RzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcChlID0+IGUucmlnaHQgKyB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0IDwgbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHttYXhYIC0gdGhpcy5pbm5lci5jbGllbnRMZWZ0fXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKGUgPT4gZS5ib3R0b20gKyB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlY3QuYm90dG9tIDwgbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7bWF4WSAtIHRoaXMuaW5uZXIuY2xpZW50VG9wfXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LmJvdHRvbSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hpbGRyZW5tb3ZlJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNb3ZlZEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGlsZHJlbm1vdmVkJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgVmFsdWUgZnJvbSAnLi92YWx1ZXMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIENvb3JkaW5hdGlvbk9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geCBY5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geSBZ5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUmVzaXplYWJsZU9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IGVuYWJsZSAgICAgICDjg6bjg7zjgrbmk43kvZzjga7mnInlirnjg7vnhKHlirlcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IHNob3dUaXRsZWJhciDpgannlKjmmYLjgavjgr/jgqTjg4jjg6vjg5Djg7zjgpLooajnpLrjgZnjgovjgYtcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUGFuZWxPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdwYW5lbCcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBtaW5TaXplICAgICAgICAgICAgIOacgOWwj+OCpuOCo+ODs+ODieOCpuWGheOCs+ODs+ODhuODs+ODhOOCteOCpOOCuijmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgbWF4U2l6ZSAgICAgICAgICAgICDmnIDlpKfjgqbjgqPjg7Pjg4njgqblhoXjgrPjg7Pjg4bjg7Pjg4TjgrXjgqTjgroo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIHBvc2l0aW9uICAgICAgICAgICAg5Yid5pyf5L2N572uKOW3puS4iilcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBkZWZhdWx0U2l6ZSAgICAgICAgIOWIneacn+OCteOCpOOCuigzMjB4MjQwLCDjgr/jgqTjg4jjg6vjg5Djg7zjgIHjgqbjgqPjg7Pjg4njgqbmnqDnt5rlkKvjgb7jgZopXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB8IEhUTUxFbGVtZW50IH0gICAgICAgICAgICAgdGl0bGUgICAgICAgICAgICAgICDjgr/jgqTjg4jjg6tcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWFibGUgICAgICAgICAgIOODkOODhOODnOOCv+ODs+OCkuWHuuePvuOBleOBm+OCi1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYWJsZSAgICAgICAgICAg5pyA5bCP5YyW44Oc44K/44Oz44KS5Ye654++44GV44Gb44KLXHJcbiAqIEBwcm9wZXJ0eSB7IFJlc2l6ZWFibGVPcHRpb25zIH0gICAgICAgICAgICAgICAgbWF4aW11bSAgICAgICAgICAgICDmnIDlpKfljJbjga7mjJnli5VcclxuICogQHByb3BlcnR5IHsgJ21vZGFsJyB8ICdtb2RhbGVzcycgfCAndG9wTW9zdCcgfSBtb2RhbCAgICAgICAgICAgICAgIOODouODvOODgOODq+ihqOekuueKtuaFi1xyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WCAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WSAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWUg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgIFRhYk9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJycgfVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiAgU3RhY2tDb250YWluZXJPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdzdGFjaycgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyB8IFRhYk9wdGlvbnMgfSBkaXJlY3Rpb24gICAgICAgICAgIOWIhuWJsuaWueWQkVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlICAgICAgICAgICAg44Kz44Os44Kv44K344On44Oz5ZCE6KaB57Sg44Gu5Yid5pyf44K144Kk44K6XHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwcm9wb3J0aW9uYWJsZSAgICDjgrPjg6zjgq/jgrfjg6fjg7Pjga7mr5TnjofjgpLmk43kvZzjgafjgY3jgovjgYtcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NrYWJsZSAgICAgICAgICAgIOOCs+ODrOOCr+OCt+ODp+ODs+OBruiEseedgOaTjeS9nOOBjOOBp+OBjeOCi+OBiyjjg6bjg7zjgrbmk43kvZzjgYvjgokpXHJcbiAqIEBwcm9wZXJ0eSB7IG51bWJlciB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yV2lkdGggICAgICDliIblibLlooPnlYznt5rjga7luYUoMe+9nilcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lIOODkeODjeODq+OBq+i/veWKoOOBp+S7mOOBkeOCi+OCr+ODqeOCueWQjVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfCBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgICAgICAgIHBhbmVsQWRkQXJlYSAgICAgICAg44K544K/44OD44Kv5YaF44GM56m644Gu44Go44GN44Gr6KGo56S644GV44KM44KL44OR44ON44Or6L+95Yqg44Ki44Kk44Kz44OzXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQmFzZUNvbnRhaW5lck9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ2Jhc2UnIH0gICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1ggICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxY6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1kgICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxZ6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZ1tdIH0gICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lcyDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbEJhc2UgZXh0ZW5kcyBFdmVudFRhcmdldFxyXG57XHJcbiAgICBzdGF0aWMgX2luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgc3RhdGljIHdpbmRvdztcclxuICAgIHN0YXRpYyBkb2N1bWVudDtcclxuICAgIHN0YXRpYyBDdXN0b21FdmVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB8IFN0YWNrUGFuZWxPcHRpb25zIHwgQmFzZUNvbnRhaW5lck9wdGlvbnMgfSBvcHRzXHJcbiAgICAgKiBAcGFyYW0geyAoUGFuZWxCYXNlIHwgSFRNTEVsZW1lbnQpW10gfSBjaGlsZHJlblxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm91dGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZVBhcmVudEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTWluaW1pemVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9yZXNpemVQYXJlbnRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVBhcmVudEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIC8vIOiHqui6q+imgee0oOOCkuWIneacn+WMluOBmeOCi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kKHRoaXMuX2lubmVyKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUgeyBQYW5lbEJhc2UgfCB1bmRlZmluZWQgfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoIVBhbmVsQmFzZS5faW5pdGlhbGl6ZWQpIFBhbmVsQmFzZS5pbml0KCk7XHJcbiAgICAgICAgUGFuZWxCYXNlLl9pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHsgUGFuZWxPcHRpb25zIHwgU3RhY2tQYW5lbE9wdGlvbnMgfCBCYXNlQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIGdldCBvcHRzICgpIHtcclxuICAgICAgICBjb25zdCB7dGl0bGUsIC4uLm90aGVyfSA9IHRoaXMuX29wdHM7XHJcbiAgICAgICAgY29uc3Qgb3B0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3RoZXIpKTtcclxuICAgICAgICBpZiAodGl0bGUpIG9wdHMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gb3B0cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZWxlbWVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlubmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qeL56+J44GZ44KL44Gf44KB44Gu5Yid5pyf5YyW44Oh44K944OD44OJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0ICgpIHtcclxuICAgICAgICBQYW5lbEJhc2UuYXBwZW5kU3R5bGVFbGVtZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K544K/44Kk44Or44KS44OY44OD44OA44Gr6L+95Yqg44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhcHBlbmRTdHlsZUVsZW1lbnRzICgpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gVmFsdWUuc3R5bGU7XHJcbiAgICAgICAgUGFuZWxCYXNlLmRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsO1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFwcGVuZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hhbmdlcGFyZW50Jywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVBhcmVudEhhbmRsZXIodW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVkSGFuZGxlciAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hhbmdlcGFyZW50Jywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICh2YWwpIHtcclxuICAgICAgICAodmFsLm91dGVyID8/IHZhbC5lbGVtZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUgIT09IHZhbCk7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdmUnLCB0aGlzLl9jaGlsZE1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZWQnLCB0aGlzLl9jaGlsZE1vdmVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21pbmltaXplZCcsIHRoaXMuX2NoaWxkTWluaW1pemVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ25vcm1hbGl6ZWQnLCB0aGlzLl9jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZXBhcmVudCcsIHZhbC5fY2hhbmdlUGFyZW50SGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kICh2YWwsIHJlZikge1xyXG4gICAgICAgIGNvbnN0IG5leHQgPSByZWY/Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5pbnNlcnRCZWZvcmUodmFsLm91dGVyID8/IHZhbC5lbGVtZW50LCBuZXh0KTtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmZpbmRJbmRleChlID0+IGUubmV4dEVsZW1lbnRTaWJsaW5nID09PSByZWYpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoaWR4ICsgMSwgMCwgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmFwcGVuZCh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSAoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQYW5lbEJhc2UpIHtcclxuICAgICAgICAgICAgY2hpbGQuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjbG9zZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkgdGhpcy5fcGFyZW50Lm1vZGlmeVpJbmRleCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RpZnlaSW5kZXggKGFjdGl2ZSkge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLl9jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJyk7XHJcbiAgICAgICAgaWYgKHdpbmRvd3MuaW5jbHVkZXMoYWN0aXZlKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRzID0gd2luZG93cy5maWx0ZXIoZSA9PiBlICE9PSBhY3RpdmUpLnNvcnQoKGEsIGIpID0+IE51bWJlcihhLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykgLSBOdW1iZXIoYi5lbGVtZW50LnN0eWxlLnpJbmRleCA/PyAnMCcpKTtcclxuICAgICAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoOyBpZHggPCB0YXJnZXRzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldHNbaWR4XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhY3RpdmUuZWxlbWVudC5zdHlsZS56SW5kZXggPSBgJHtpZHh9YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbnRyeSB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gd2luZG93O1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gZG9jdW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50O1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gSW1hZ2U7XHJcbn1cclxuY2F0Y2gge1xyXG4gICAgUGFuZWxCYXNlLndpbmRvdyA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5kb2N1bWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5JbWFnZSA9IHVuZGVmaW5lZDtcclxufVxyXG4iLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcbmltcG9ydCBCYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5cclxuLyoqXHJcbiAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km6KGo56S644O744G744GL44OR44ON44Or44G444Gu5qC857SN44GM5Y+v6IO9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgUGFuZWxPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAncGFuZWwnLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7eDogMCwgeTogMH0sXHJcbiAgICAgICAgbWluU2l6ZToge3g6IDEyMCwgeTogMH0sXHJcbiAgICAgICAgZGVmYXVsdFNpemU6IHt4OiAzMjAsIHk6IDI0MH0sXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIGNsb3NlYWJsZTogdHJ1ZSxcclxuICAgICAgICBhdXRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgbWluaW1hYmxlOiB0cnVlLFxyXG4gICAgICAgIG1heGltdW06IHtlbmFibGU6IHRydWUsIHNob3dUaXRsZWJhcjogdHJ1ZX0sXHJcbiAgICAgICAgZGVmYXVsdE1vZGU6ICdub3JtYWwnLFxyXG4gICAgICAgIG1vZGFsOiAnbW9kYWxlc3MnLFxyXG4gICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXHJcbiAgICAgICAgb3ZlcmZsb3dZOiAnc2Nyb2xsJyxcclxuICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lOiAnJyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuagvOe0jeOBmeOCi+ODkeODjeODq+OCqOODquOCouOAguOCpuOCo+ODs+ODieOCpuODu+ODmuOCpOODs+ihqOekuuOBjOWPr+iDvVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB9ICAgICAgICAgICAgb3B0cyAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IEhUTUxFbGVtZW50IHwgUGFuZWxCYXNlIH0gY29udGVudCDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9wdHMgPSBQYW5lbC5ERUZBVUxUX09QVElPTlMsIGNvbnRlbnQpIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgUGFuZWwuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC13aW5kb3cnKTtcclxuICAgICAgICB0aGlzLmlubmVyLmNsYXNzTmFtZSA9ICdtYWdpY2EtcGFuZWwtaW5uZXInO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuY2xhc3NMaXN0LmFkZCgnb3gtcycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveS1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5kZWZhdWx0TW9kZSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuc3R5bGUud2lkdGggPSBgJHtvcHRzLmRlZmF1bHRTaXplLnh9cHhgO1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtvcHRzLmRlZmF1bHRTaXplLnl9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgr/jgqTjg4jjg6vjg5Djg7zjgpLov73liqBcclxuICAgICAgICBjb25zdCB0aXRsZWJhciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IG9wdHMudGl0bGU7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChzcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnb2JqZWN0JyAmJiBvcHRzLnRpdGxlIGluc3RhbmNlb2YgUGFuZWxCYXNlLkhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChvcHRzLnRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGViYXIgPSB0aXRsZWJhcjtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZSh0aXRsZWJhciwgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtdGl0bGViYXInKTtcclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLnNob3dUaXRsZWJhcikge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21heGltdW0tZGlzYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGV2ID0+IHtcclxuICAgICAgICAgICAgZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgUGFuZWxCYXNlLkltYWdlKCksIDAsIDApO1xyXG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dC9wbGFpbicsICdwYW5lbCcpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYWRkUmVzaXplQXJlYSgpO1xyXG5cclxuICAgICAgICAvLyDjg5zjgr/jg7Pjgqjjg6rjgqLjgpLov73liqBcclxuICAgICAgICBjb25zdCBidXR0b25hcmVhID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGJ1dHRvbmFyZWEuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbi1hcmVhJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChidXR0b25hcmVhKTtcclxuXHJcbiAgICAgICAgLy8g6ZaJ44GY44KL44Oc44K/44Oz44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgY2xvc2VidXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgY2xvc2VidXR0b24udGV4dENvbnRlbnQgPSAnw5cnO1xyXG4gICAgICAgIGNsb3NlYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnY2xvc2UnKTtcclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5jbG9zZWFibGUpIHtcclxuICAgICAgICAgICAgY2xvc2VidXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xvc2VidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYnV0dG9uYXJlYS5hcHBlbmQoY2xvc2VidXR0b24pO1xyXG5cclxuICAgICAgICAvLyDmnIDlpKfljJYv5b6p5YWD44Oc44K/44Oz44KS6L+95YqgXHJcbiAgICAgICAgY29uc3QgbWF4aW11bWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBtYXhpbXVtYnV0dG9uLnRleHRDb250ZW50ID0gJ+KdkCc7XHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uJywgJ21heGltdW0nKTtcclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF4aW11bScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vcm1hbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXhpbXVtKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdHMubWF4aW11bS5lbmFibGUpIHtcclxuICAgICAgICAgICAgbWF4aW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZWJ1dHRvbi5iZWZvcmUobWF4aW11bWJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vIOacgOWwj+WMli/lvqnlhYPjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBtaW5pbXVtYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24udGV4dENvbnRlbnQgPSAnLSc7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uJywgJ21pbmltdW0nKTtcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vcm1hbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbXVtKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdHMubWluaW1hYmxlKSB7XHJcbiAgICAgICAgICAgIG1pbmltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF4aW11bWJ1dHRvbi5iZWZvcmUobWluaW11bWJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vIOODouODvOODgOODq1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMubW9kYWwgIT09ICdtb2RhbGVzcycpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3RvcG1vc3QnKTtcclxuICAgICAgICAgICAgbWluaW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgICAgIG1heGltdW1idXR0b24uY2xhc3NMaXN0LmFkZCgnZGVueScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfYWRkUmVzaXplQXJlYSAoKSB7XHJcbiAgICAgICAgLy8g44Oq44K144Kk44K66aCY5Z+f44KS6L+95YqgXHJcbiAgICAgICAgdGhpcy5lZGdlcyA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIFtbJ3RvcCddLCBbJ2JvdHRvbSddLCBbJ2xlZnQnXSwgWydyaWdodCddLCBbJ3RvcCcsICdsZWZ0J10sIFsndG9wJywgJ3JpZ2h0J10sIFsnYm90dG9tJywgJ2xlZnQnXSwgWydib3R0b20nLCAncmlnaHQnXV0pIHtcclxuICAgICAgICAgICAgY29uc3QgZWRnZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgZWRnZS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtZWRnZScsIC4uLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoZWRnZSk7XHJcbiAgICAgICAgICAgIGVkZ2UuZHJhZ2dhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgICAgICBlZGdlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4gZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgSW1hZ2UoKSwgMCwgMCksIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5lZGdlc1t0YXJnZXRdID0gZWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9yZXNpemVBcmVhSGFuZGxlciAoZXYpIHtcclxuICAgICAgICBpZiAoZXYudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xpY2tzdGFydCA9IHt4OiBldi5wYWdlWCwgeTogZXYucGFnZVl9O1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXYudHlwZSA9PT0gJ2RyYWcnKSB7XHJcbiAgICAgICAgICAgIGlmIChldi5zY3JlZW5ZID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9wJykpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9zdGFydHJlY3QuaGVpZ2h0ICsgdGhpcy5fY2xpY2tzdGFydC55IC0gZXYucGFnZVkgLSAxMDtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCA8PSB0aGlzLm9wdHMubWluU2l6ZS55PyB0aGlzLm9wdHMubWluU2l6ZS55OiBoZWlnaHQgPj0gKHRoaXMub3B0cy5tYXhTaXplPy55IHx8IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueTogaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsVG9wICsgdGhpcy5fc3RhcnRyZWN0LmJvdHRvbSAtIGhlaWdodCAtIHRoaXMudGl0bGViYXIuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2JvdHRvbScpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9zdGFydHJlY3QuaGVpZ2h0ICsgZXYucGFnZVkgLSB0aGlzLl9jbGlja3N0YXJ0LnkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgfHwgSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyB0aGlzLl9jbGlja3N0YXJ0LnggLSBldi5wYWdlWCAtIDEwO1xyXG4gICAgICAgICAgICAgICAgd2lkdGggPSB3aWR0aCA8PSB0aGlzLm9wdHMubWluU2l6ZS54PyB0aGlzLm9wdHMubWluU2l6ZS54OiB3aWR0aCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnggfHwgSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS54OiB3aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxMZWZ0ICsgdGhpcy5fc3RhcnRyZWN0LnJpZ2h0IC0gd2lkdGh9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fc3RhcnRyZWN0LndpZHRoICsgZXYucGFnZVggLSB0aGlzLl9jbGlja3N0YXJ0LnggLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aCA8PSB0aGlzLm9wdHMubWluU2l6ZS54PyB0aGlzLm9wdHMubWluU2l6ZS54OiB3aWR0aCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnggfHwgSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS54OiB3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9tb3ZlVGl0bGViYXJIYW5kbGVyIChldikge1xyXG4gICAgICAgIGlmICgodGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF4aW11bScpICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgQmFzZUNvbnRhaW5lcilcclxuICAgICAgICB8fCB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChldi50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYub2Zmc2V0WCwgeTogZXYub2Zmc2V0WX07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSAnZHJhZyc6IHtcclxuICAgICAgICAgICAgICAgIGlmIChldi5zY3JlZW5ZID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxMZWZ0ICsgZXYucGFnZVgpIC0gdGhpcy5fY2xpY2tzdGFydC54fXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHsodGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxUb3AgKyBldi5wYWdlWSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnl9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21vdmUnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdlbmQnOiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbW92ZWQnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRqdXN0V2luZG93UG9zaXRpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50LmlubmVyLmNsaWVudEhlaWdodCA+IHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHRcclxuICAgICAgICAmJiAodGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50SGVpZ2h0KSA8IGN1cnJlbnRSZWN0LmJvdHRvbSkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50SGVpZ2h0IC0gdGhpcy5lbGVtZW50LmNsaWVudEhlaWdodH1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50V2lkdGggPiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhcclxuICAgICAgICAmJiAodGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50V2lkdGgpIDwgY3VycmVudFJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCAtIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aH1weGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFJlY3QubGVmdCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UmVjdC50b3AgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbWF4aW11bSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdPy5sZWZ0IHx8IDA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21pbmltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF4aW11bScpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBub3JtYWwgKHgpIHtcclxuICAgICAgICBsZXQgcmF0aW8gPSAwO1xyXG4gICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICByYXRpbyA9ICh4IC0gcmVjdC5sZWZ0KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtYXhpbXVtJyk7XHJcblxyXG4gICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgdyA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdLndpZHRoO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2xpY2tzdGFydCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpY2tzdGFydC54ID0gdyAqIHJhdGlvO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke01hdGgucm91bmQoeCAtICh3ICogcmF0aW8pKX1weGA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2xlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt0aGlzLl9sZWZ0fXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdub3JtYWxpemVkJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG1pbmltdW0gKCkge1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXT8ubGVmdCB8fCAwO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtYXhpbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21pbmltdW0nKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnbWluaW1pemVkJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplUGFyZW50SGFuZGxlciAoX2V2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF4aW11bScpICYmICF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGp1c3RXaW5kb3dQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhcmVudEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHN1cGVyLmNoYW5nZVBhcmVudEhhbmRsZXIoZXZ0KTtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLm1vZGFsID09PSAnbW9kYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3V0ZXIgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHRoaXMub3V0ZXIuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLW1vZGFsLWJsb2NrZXInKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMub3V0ZXIsIHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMub3V0ZXIuYXBwZW5kKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgaWYgKHJlY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYGNhbGMoNTAlIC0gJHtyZWN0LndpZHRoIC8gMn1weClgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGBjYWxjKDUwJSAtICR7cmVjdC5oZWlnaHQgLyAyfXB4KWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcblxyXG4vKipcclxuICog5Z6C55u044G+44Gf44Gv5rC05bmz5pa55ZCR44G444Gu5pW05YiX44KE44K/44OW5YiH44KK5pu/44GI44Gr44KI44KL44OR44ON44Or44Gu44K544Kk44OD44OBKDPlgIvjga7jgYbjgaHjgYTjgZrjgozjgYsx44GkKeOCkuaPkOS+m+OBl+OBvuOBmeOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhY2tDb250YWluZXIgZXh0ZW5kcyBQYW5lbEJhc2Vcclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IFN0YWNrQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBERUZBVUxUX09QVElPTlMgPSB7XHJcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcclxuICAgICAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgcmVwcm9wb3J0aW9uYWJsZTogdHJ1ZSxcclxuICAgICAgICBkb2NrYWJsZTogdHJ1ZSxcclxuICAgICAgICBzZXBhcmF0b3JXaWR0aDogMixcclxuICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lOiAnJyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgICAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHBhbmVsQWRkQXJlYTogdW5kZWZpbmVkLFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km44O744Oa44Kk44Oz6KGo56S644GM5Y+v6IO9XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsgU3RhY2tDb250YWluZXJPcHRpb25zIH0gICAgICBvcHRzICAgIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHsgKFN0YWNrQ29udGFpbmVyIHwgUGFuZWwpW10gfSBjaGlsZHJlbiDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9wdHMgPSBTdGFja0NvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3VwZXIoUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBPYmplY3QuYXNzaWduKG9wdHMsIFN0YWNrQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgey4uLm9wdHN9KSwgLi4uY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMub3B0cy50ZW1wbGF0ZSk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyJyk7XHJcbiAgICAgICAgdGhpcy5pbm5lci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2staW5uZXInKTtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvcml6b250YWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3RhYicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZGFyZWFzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYWRkQXJlYSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgYWRkQXJlYS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yJywgJ2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzLnBhbmVsQWRkQXJlYSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGFkZEFyZWEuYXBwZW5kKHRoaXMub3B0cy5wYW5lbEFkZEFyZWEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRkQXJlYS50ZXh0Q29udGVudCA9IHRoaXMub3B0cy5wYW5lbEFkZEFyZWEgPz8gdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ+KWpCcgOiAn4palJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRhcmVhcy5wdXNoKGFkZEFyZWEpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGFkZEFyZWEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbW92ZWhhbmRsZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW91c2VZID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsVG9wICsgZXZ0LmRldGFpbC5ldi5wYWdlWTtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VYID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsTGVmdCArIGV2dC5kZXRhaWwuZXYucGFnZVg7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1SZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChlbGVtUmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgZWxlbVJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICYmIGVsZW1SZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgZWxlbVJlY3QucmlnaHRcclxuICAgICAgICAgICAgJiYgZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tYXhpbXVtLmVuYWJsZSA9PT0gdHJ1ZSAmJiB0aGlzLm9wdHMuZG9ja2FibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWRkYXJlYSBvZiB0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gYWRkYXJlYS5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlY3QgJiYgcmVjdC50b3AgPCBldnQuZGV0YWlsLmV2LmNsaWVudFkgJiYgZXZ0LmRldGFpbC5ldi5jbGllbnRZIDwgcmVjdC5ib3R0b21cclxuICAgICAgICAgICAgICAgICYmIHJlY3QubGVmdCA8IGV2dC5kZXRhaWwuZXYuY2xpZW50WCAmJiBldnQuZGV0YWlsLmV2LmNsaWVudFggPCByZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fbW92ZWRoYW5kbGVyID0gZXZ0ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubW9kYWwgIT09ICdtb2RhbGVzcycpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWSA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbFRvcCArIGV2dC5kZXRhaWwuZXYucGFnZVk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdXNlWCA9IHRoaXMucm9vdC5lbGVtZW50LnNjcm9sbExlZnQgKyBldnQuZGV0YWlsLmV2LnBhZ2VYO1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAoZWxlbVJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IGVsZW1SZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAmJiBlbGVtUmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IGVsZW1SZWN0LnJpZ2h0XHJcbiAgICAgICAgICAgICYmIGV2dC5kZXRhaWwudGFyZ2V0Lm9wdHMubWF4aW11bS5lbmFibGUgPT09IHRydWUgJiYgdGhpcy5vcHRzLmRvY2thYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFkZGFyZWEgb2YgdGhpcy5hZGRhcmVhcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPT09IGFkZGFyZWEucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nID09PSBhZGRhcmVhLnBhcmVudEVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB8fCBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgIT09IHRoaXMucm9vdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGFkZGFyZWEuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVjdCAmJiByZWN0LnRvcCA8IGV2dC5kZXRhaWwuZXYuY2xpZW50WSAmJiBldnQuZGV0YWlsLmV2LmNsaWVudFkgPCByZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgICYmIHJlY3QubGVmdCA8IGV2dC5kZXRhaWwuZXYuY2xpZW50WCAmJiBldnQuZGV0YWlsLmV2LmNsaWVudFggPCByZWN0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RyZWYgPSB0aGlzLmVsZW1lbnQuY29udGFpbnMoYWRkYXJlYS5jbG9zZXN0KCcubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyJykpPyBhZGRhcmVhLnBhcmVudEVsZW1lbnQ6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LmRldGFpbC50YXJnZXQucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnBhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcGFyZW50ICh2YWwpIHtcclxuICAgICAgICBzdXBlci5wYXJlbnQgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFyZW50SGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgc3VwZXIuY2hhbmdlUGFyZW50SGFuZGxlcihldnQpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlJywgdGhpcy5fbW92ZWhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmVkJywgdGhpcy5fbW92ZWRoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yb290LmFkZEV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZScsIHRoaXMuX21vdmVoYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5yb290LmFkZEV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZWQnLCB0aGlzLl9tb3ZlZGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gdGhpcy5yb290O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQgKHZhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5hZGRhcmVhcykgdGhpcy5hZGRhcmVhcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmlubmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZXAgPSB0aGlzLl9nZW5lcmF0ZVNlcGFyYXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goc2VwLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoc2VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYW5nZXMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSkge1xyXG4gICAgICAgICAgICBjb25zdCB3aW5kb3dSYW5nZSA9IHRoaXMuX2xhc3RUYXJnZXRSYW5nZTtcclxuICAgICAgICAgICAgcmFuZ2VzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKT8uWzBdPy5bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddIHx8IGUub3B0cz8uZGVmYXVsdFNpemVbdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ3knOiAneCddIHx8IDEwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGFzdHJlZikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmluZGV4T2YodGhpcy5fbGFzdHJlZi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydFRhcmdldFJhbmdlID0gKChyYW5nZXNbaWR4XSB8fCAwKSArIChyYW5nZXNbaWR4ICsgMV0gfHwgMCkpIC8gMjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydFJhbmdlID0gTWF0aC5taW4oaW5zZXJ0VGFyZ2V0UmFuZ2UsIHdpbmRvd1JhbmdlKSAtIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICh+aWR4ICYmIHJhbmdlc1tpZHggKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzbWFsbElkeCwgbGFyZ2VJZHhdID0gcmFuZ2VzW2lkeF0gPiByYW5nZXNbaWR4ICsgMV0/IFtpZHggKyAxLCBpZHhdOiBbaWR4LCBpZHggKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IHJhbmdlc1tzbWFsbElkeF0gLyByYW5nZXNbbGFyZ2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNtYWxsU2l6ZSA9IE1hdGgucm91bmQoaW5zZXJ0UmFuZ2UgLyAyICogcmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tzbWFsbElkeF0gLT0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tsYXJnZUlkeF0gLT0gKGluc2VydFJhbmdlIC0gc21hbGxTaXplKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKH5pZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5nZXNbaWR4XSAtPSBpbnNlcnRSYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggKyAxXSAtPSBpbnNlcnRSYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByYW5nZXMuc3BsaWNlKGlkeCArIDEsIDAsIGluc2VydFJhbmdlIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmFwcGVuZCh2YWwsIHRoaXMuX2xhc3RyZWYpO1xyXG4gICAgICAgIGlmICh2YWwubWF4aW11bSkgdmFsLm1heGltdW0oKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VwID0gdGhpcy5fZ2VuZXJhdGVTZXBhcmF0b3IoKTtcclxuICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goc2VwLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICBpZiAodmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuaW5zZXJ0QmVmb3JlKHNlcCwgdmFsLmVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuYXBwZW5kKHNlcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2JvZHknKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjR3JpZFNpemUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHJhbmdlcy5sZW5ndGggPT09IDA/IHVuZGVmaW5lZDogcmFuZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplUGFyZW50SGFuZGxlciAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCByYW5nZXMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pLmZpbHRlcihlID0+IGUgIT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSByYW5nZXMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCk7XHJcbiAgICAgICAgY29uc3QgcmF0aW9zID0gcmFuZ2VzLm1hcChlID0+IGUgLyB0b3RhbCk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFdpZHRoID0gdGhpcy5pbm5lci5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSAtICh0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGggKiAodGhpcy5jaGlsZHJlbi5sZW5ndGggKyAxKSk7XHJcbiAgICAgICAgcmFuZ2VzID0gcmF0aW9zLm1hcChlID0+IE1hdGgucm91bmQoZSAqIGN1cnJlbnRXaWR0aCkpO1xyXG4gICAgICAgIHJhbmdlcy5wb3AoKTtcclxuICAgICAgICByYW5nZXMucHVzaChjdXJyZW50V2lkdGggLSByYW5nZXMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCkpO1xyXG4gICAgICAgIHJhbmdlcyA9IHJhbmdlcy5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgaWYgKHJhbmdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdyZXNpemUnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUgKHZhbCkge1xyXG4gICAgICAgIGxldCByYW5nZXMgPSB0eXBlb2YgdGhpcy5fbGFzdFRhcmdldFJhbmdlID09PSAnb2JqZWN0Jz8gdGhpcy5fbGFzdFRhcmdldFJhbmdlOiB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10pO1xyXG4gICAgICAgIGlmIChyYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFRhcmdldFJhbmdlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YodmFsKTtcclxuICAgICAgICAgICAgaWYgKCFyYW5nZXNbaWR4IC0gMV0gJiYgcmFuZ2VzW2lkeCArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbaWR4ICsgMV0gKz0gcmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIXJhbmdlc1tpZHggKyAxXSAmJiByYW5nZXNbaWR4IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggLSAxXSArPSByYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyYW5nZXNbaWR4ICsgMV0gJiYgcmFuZ2VzW2lkeCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbc21hbGxJZHgsIGxhcmdlSWR4XSA9IHJhbmdlc1tpZHggLSAxXSA+IHJhbmdlc1tpZHggKyAxXT8gW2lkeCArIDEsIGlkeCAtIDFdOiBbaWR4IC0gMSwgaWR4ICsgMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXRpbyA9IHJhbmdlc1tzbWFsbElkeF0gLyByYW5nZXNbbGFyZ2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc21hbGxTaXplID0gTWF0aC5yb3VuZCgocmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC8gMiAqIHJhdGlvKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tzbWFsbElkeF0gKz0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2xhcmdlSWR4XSArPSAocmFuZ2VzW2lkeF0gKyB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpIC0gc21hbGxTaXplO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByYW5nZXMgPSByYW5nZXMuZmlsdGVyKChfZSwgaSkgPT4gaSAhPT0gaWR4KS5tYXAoZSA9PiBgJHtlfXB4YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbW92ZSh2YWwpO1xyXG4gICAgICAgIGlmICh0aGlzLmlubmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLmZpbHRlcihlID0+IGUgIT09IHRoaXMuaW5uZXIuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmNoaWxkcmVuWzBdLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzPy5sZW5ndGggPT09IDA/IHVuZGVmaW5lZDogcmFuZ2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBfY2FsY0dyaWRTaXplIChzZXAsIHBvcywgdGVtcGxhdGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnZ3JpZFRlbXBsYXRlUm93cyc6ICdncmlkVGVtcGxhdGVDb2x1bW5zJztcclxuICAgICAgICBjb25zdCBjdXJyZW50U2l6ZXMgPSB0ZW1wbGF0ZSB8fCB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0uc3BsaXQoJyAnKS5maWx0ZXIoZSA9PiBlICE9PSAnJykuZmlsdGVyKChfZSwgaSkgPT4gaSAlIDIgIT09IDApO1xyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0gPSAnJztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTaXplc1swXSA9ICcxZnInO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNlcCAmJiBzZXAucHJldmlvdXNFbGVtZW50U2libGluZyAmJiBzZXAubmV4dEVsZW1lbnRTaWJsaW5nICYmIHBvcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3MgPSBBcnJheS5mcm9tKHRoaXMuaW5uZXIuY2hpbGRyZW4pLmZpbHRlcihlID0+ICFlLmNsYXNzTGlzdC5jb250YWlucygnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicpKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldklkeCA9IGJyb3MuaW5kZXhPZihzZXAucHJldmlvdXNFbGVtZW50U2libGluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRJZHggPSBicm9zLmluZGV4T2Yoc2VwLm5leHRFbGVtZW50U2libGluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZSZWN0ID0gc2VwLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dFJlY3QgPSBzZXAubmV4dEVsZW1lbnRTaWJsaW5nLmdldENsaWVudFJlY3RzKClbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cG9zIC0gcHJldlJlY3QudG9wIC0gMX1weGA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbbmV4dElkeF0gPSBgJHtuZXh0UmVjdC5ib3R0b20gLSBwb3MgLSAxfXB4YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1twcmV2SWR4XSA9IGAke3BvcyAtIHByZXZSZWN0LmxlZnQgLSAxfXB4YDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9IGAke25leHRSZWN0LnJpZ2h0IC0gcG9zIC0gMX1weGA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpZHgrKykgaWYgKGN1cnJlbnRTaXplc1tpZHhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY3VycmVudFNpemVzLnB1c2goJzFmcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VycmVudFNpemVzLnNwbGljZSh0aGlzLmNoaWxkcmVuLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5pbm5lci5zdHlsZVt0YXJnZXRdID0gYCR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4ICR7Y3VycmVudFNpemVzLmpvaW4oYCAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weCBgKX0gJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgfVxyXG5cclxuICAgIF9nZW5lcmF0ZVNlcGFyYXRvciAoKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InKTtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLnJlcHJvcG9ydGlvbmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbS5zdHlsZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gPSBgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHhgO1xyXG4gICAgICAgIGVsZW0uZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBpbm5lciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpbm5lci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhJyk7XHJcbiAgICAgICAgZWxlbS5hcHBlbmQoaW5uZXIpO1xyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4ge1xyXG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5ldyBJbWFnZSgpLCAwLCAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdkcmFnJywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXYuc2NyZWVuWSA9PT0gMCB8fCB0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZShldi50YXJnZXQsIHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/IGV2LnBhZ2VZIDogZXYucGFnZVgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZWxlbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOBruenu+WLleOBq+i/veW+k+OBl+OBvuOBmeOAglxyXG4gICAgICovXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyIChldnQpIHtcclxuICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSk7XHJcbiAgICAgICAgZXZ0LmRldGFpbC50YXJnZXQubm9ybWFsKGV2dC5kZXRhaWwuZXYucGFnZVgpO1xyXG4gICAgICAgIGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCA9IHRoaXMucm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcm9vdCAoKSB7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcclxuICAgICAgICB3aGlsZSAocGFyZW50Py5wYXJlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgIH1cclxufVxyXG4iLCJjb25zdCBzdHlsZSA9IGBcclxuLm1hZ2ljYS1wYW5lbC13cmFwcGVyIHtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13cmFwcGVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13cmFwcGVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1iYXNlIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIG1pbi13aWR0aDogMTAwJTtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHBhZGRpbmc6IDRweDtcclxuICAgIGJhY2tncm91bmQ6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtdGl0bGViYXIge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgaGVpZ2h0OiAxLjVyZW07XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB1c2VyLXNlbGVjdDpub25lO1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBjYWxjKDIuNXJlbSAqIDMpO1xyXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC10aXRsZWJhci5tYXhpbXVtLWRpc2FibGUge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIH4gLm1hZ2ljYS1wYW5lbC1idXR0b24tYXJlYSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXRpdGxlYmFyID4gKiB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICBwYWRkaW5nOiAxcHg7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtaW5uZXIub3gtcyB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWlubmVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5sZWZ0IHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogNHB4O1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5yaWdodCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiA0cHg7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmxlZnQ6YWN0aXZlLFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UucmlnaHQ6YWN0aXZlIHtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wIHtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGhlaWdodDogNHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcDphY3RpdmUsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b206YWN0aXZlIHtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLmxlZnQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AucmlnaHQsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ubGVmdCxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5yaWdodCB7XHJcbiAgICBoZWlnaHQ6IDRweDtcclxuICAgIHdpZHRoOiA0cHg7XHJcbiAgICB0b3A6IHVuc2V0O1xyXG4gICAgbGVmdDogdW5zZXQ7XHJcbiAgICByaWdodDogdW5zZXQ7XHJcbiAgICBib3R0b206IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wLmxlZnQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGN1cnNvbDogbndzZS1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AucmlnaHQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBjdXJzb2w6IG5lc3ctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLmxlZnQge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGN1cnNvbDogbmVzdy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ucmlnaHQge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBjdXJzb2w6IG53c2UtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIHtcclxuICAgIHBhZGRpbmc6IDBweDtcclxuICAgIHRvcDogMCAhaW1wb3J0YW50O1xyXG4gICAgbGVmdDogMCAhaW1wb3J0YW50O1xyXG4gICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIC5tYWdpY2EtcGFuZWwtZWRnZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIC5tYWdpY2EtcGFuZWwtdGl0bGViYXIge1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAycHgpICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDEuNXJlbSAtIDZweCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtdGl0bGViYXIubWF4aW11bS1kaXNhYmxlIH4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJweCkgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWluaW11bSB7XHJcbiAgICB3aWR0aDogMTg2cHg7XHJcbiAgICBib3R0b206IDAgIWltcG9ydGFudDtcclxuICAgIHRvcDogdW5zZXQgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cudG9wbW9zdCB7XHJcbiAgICB6LWluZGV4OiA2NTUzNSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLW1vZGFsLWJsb2NrZXIge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwuNSk7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB6LWluZGV4OiA2NTUzNSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtID4gLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtID4gLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uIHtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB3aWR0aDogMi41cmVtO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5kZW55IHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmNsb3NlIHtcclxuICAgIGJhY2tncm91bmQ6ICM3MDE5MTk7XHJcbn1cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uY2xvc2Uub25hY3RpdmUge1xyXG4gICAgYmFja2dyb3VuZDogI2U2MzIzMjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgei1pbmRleDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLm94LXMge1xyXG4gICAgb3ZlcmZsb3cteDogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLm95LXMge1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IG1pZG5pZ2h0Ymx1ZTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbWlkbmlnaHRibHVlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgei1pbmRleDogMTAwO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLmVtcHR5IHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIG1hcmdpbjogYXV0bztcclxuICAgIHRvcDogNTAlO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICBmb250LXNpemU6IDNyZW07XHJcbiAgICB3aWR0aDogNXJlbTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIG9wYWNpdHk6IDAuNTtcclxuICAgIHVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjUsMjUsMTEyLCAwLjMpO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMTByZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGxlZnQ6IC01cmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpmaXJzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGxlZnQ6IDA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmxhc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICByaWdodDogMDtcclxuICAgIGxlZnQ6IHVuc2V0O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwcmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgdG9wOiAtNXJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmZpcnN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgdG9wOiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6bGFzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHRvcDogdW5zZXQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpOT1QoLmhvdmVyKTpOT1QoLmRpc2FibGUpOk5PVCg6Zmlyc3Qtb2YtdHlwZSk6Tk9UKDpsYXN0LW9mLXR5cGUpOmhvdmVyIHtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpOT1QoLmhvdmVyKTpOT1QoLmRpc2FibGUpOk5PVCg6Zmlyc3Qtb2YtdHlwZSk6Tk9UKDpsYXN0LW9mLXR5cGUpOmhvdmVyIHtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Tk9UKC5lbXB0eSkge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Zlci5lbXB0eSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5lbXB0eSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci5ob3ZlciB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciB7XHJcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRvcDogdW5zZXQgIWltcG9ydGFudDtcclxuICAgIGxlZnQgdW5zZXQgIWltcG9ydGFudDtcclxuICAgIHotaW5kZXg6IHVuc2V0ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC1idXR0b24ubWF4aW11bSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtYnV0dG9uLm1pbmltdW0ge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5gO1xyXG5cclxuY29uc3QgVmFsdWUgPSB7XHJcbiAgICBzdHlsZSxcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoVmFsdWUpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVmFsdWU7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEJhc2VDb250YWluZXIgZnJvbSAnLi9iYXNlLWNvbnRhaW5lci5qcyc7XHJcbmltcG9ydCBQYW5lbCBmcm9tICcuL3BhbmVsLmpzJztcclxuaW1wb3J0IFN0YWNrQ29udGFpbmVyIGZyb20gJy4vc3RhY2stY29udGFpbmVyLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtCYXNlQ29udGFpbmVyLCBQYW5lbCwgU3RhY2tDb250YWluZXJ9O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=