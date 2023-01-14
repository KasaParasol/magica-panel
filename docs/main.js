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
            this._clickstart = {x: ev.pageX || ev.touches[0].pageX, y: ev.pageY || ev.touches[0].pageY};
            this._startrect = this.element.getClientRects()[0];
        }
        else if (ev.type === 'drag'
        || ev.type === 'touchmove') {
            if (ev.screenY === 0) return;

            if (ev.target.classList.contains('top')) {
                let height = this._startrect.height + this._clickstart.y - (ev.pageY || ev.touches[0].pageY) - 10;
                height = height <= this.opts.minSize.y? this.opts.minSize.y: height >= (this.opts.maxSize?.y || Infinity)? this.opts.maxSize.y: height;
                this.element.style.top = `${this.parent.element.scrollTop + this._startrect.bottom - height - this.titlebar.clientHeight}px`;
                this.inner.style.height = `${height}px`;
            }

            if (ev.target.classList.contains('bottom')) {
                const height = this._startrect.height + (ev.pageY || ev.touches[0].pageY) - this._clickstart.y - 10;
                this.inner.style.height = `${height <= this.opts.minSize.y? this.opts.minSize.y: height >= (this.opts.maxSize?.y || Infinity)? this.opts.maxSize.y: height}px`;
            }

            if (ev.target.classList.contains('left')) {
                let width = this._startrect.width + this._clickstart.x - (ev.pageX || ev.touches[0].pageX) - 10;
                width = width <= this.opts.minSize.x? this.opts.minSize.x: width >= (this.opts.maxSize?.x || Infinity)? this.opts.maxSize.x: width;
                this.element.style.left = `${this.parent.element.scrollLeft + this._startrect.right - width}px`;
                this.inner.style.width = `${width}px`;
            }

            if (ev.target.classList.contains('right')) {
                const width = this._startrect.width + (ev.pageX || ev.touches[0].pageX) - this._clickstart.x - 10;
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
            case 'touchstart':
            case 'mousedown': {
                const rect = ev.target.getClientRects()[0];
                this._clickstart = {x: ev.offsetX || (ev.touches[0].pageX - rect.left), y: ev.offsetY || (ev.touches[0].pageY - rect.top)};
                break;
            }

            case 'drag':
            case 'touchmove': {
                if ((ev.screenY || ev.touches[0].screenY) === 0) return;

                this.element.style.left = `${(this.parent.element.scrollLeft + (ev.pageX || ev.touches[0].pageX)) - this._clickstart.x}px`;
                this.element.style.top = `${(this.parent.element.scrollTop + (ev.pageY || ev.touches[0].pageY)) - this._clickstart.y}px`;
                this.dispatchEvent(new _panel_base_js__WEBPACK_IMPORTED_MODULE_0__["default"].CustomEvent('move', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
                break;
            }

            case 'dragend':
            case 'touchend': {
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

            const mouseY = this.root.element.scrollTop + (evt.detail.ev.pageY || evt.detail.ev.touches[0].pageY);
            const mouseX = this.root.element.scrollLeft + (evt.detail.ev.pageX || evt.detail.ev.touches[0].pageX);
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

            const mouseY = this.root.element.scrollTop + (evt.detail.ev.pageY || evt.detail.ev.touches[0].pageY);
            const mouseX = this.root.element.scrollLeft + (evt.detail.ev.pageX || evt.detail.ev.touches[0].pageX);
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
        evt.detail.target.normal((evt.detail.ev.pageX || evt.detail.ev.touches[0].pageX));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsRUFBRTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixrRUFBcUIsWUFBWSxTQUFTLGNBQWM7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLEVBQUU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsdUJBQXVCO0FBQ2xFLDJDQUEyQywwQkFBMEI7QUFDckU7QUFDQTtBQUNBLDJDQUEyQyx3QkFBd0I7QUFDbkUsMkNBQTJDLHlCQUF5QjtBQUNwRTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNEJBQTRCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHlCQUF5QixLQUFLLHNCQUFzQix5QkFBeUIsT0FBTyxFQUFFLHlCQUF5QjtBQUNySjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkVBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UseUJBQXlCO0FBQ3hHO0FBQ0Esc0JBQXNCLDZFQUFnQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUM1VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxLQUFLLEVBQUM7Ozs7Ozs7VUN2WXJCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNqQjtBQUNtQjtBQUNsRDtBQUNBLGlFQUFlLENBQUMsYUFBYSxtRUFBTyxtRUFBZ0IsOERBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2Jhc2UtY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3BhbmVsLWJhc2UuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvcGFuZWwuanMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvLi9zcmMvc3RhY2stY29udGFpbmVyLmpzIiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL3ZhbHVlcy5qcyIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTWFnaWNhUGFuZWwvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9NYWdpY2FQYW5lbC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL01hZ2ljYVBhbmVsLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDjgZnjgbnjgabjga7opqrjgajjgarjgovopoHntKDjgILjg4Tjg6rjg7zkuIrjgasx44Gk5LiA55Wq6Kaq44Gr44Gu44G/5Yip55So44Gn44GN44KL44CCXHJcbiAqIOOCpuOCo+ODs+ODieOCpuOBr+OBk+OBruS4reOBl+OBi+enu+WLleOBp+OBjeOBquOBhOOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUNvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgQmFzZUNvbnRhaW5lck9wdGlvbnMgfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgREVGQVVMVF9PUFRJT05TID0ge1xyXG4gICAgICAgIHR5cGU6ICdiYXNlJyxcclxuICAgICAgICBvdmVyZmxvd1g6ICdzY3JvbGwnLFxyXG4gICAgICAgIG92ZXJmbG93WTogJ3Njcm9sbCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44GZ44G544Gm44Gu6Kaq44Go44Gq44KL6KaB57Sg44CCXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgICAgIGVsZW1lbnQgICDoh6rouqvjgpLooajnpLrjgZnjgotIVE1M6KaB57SgXHJcbiAgICAgKiBAcGFyYW0geyBCYXNlQ29udGFpbmVyT3B0aW9ucyB9ICAgICAgIG9wdHMgICAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IChTdGFja0NvbnRhaW5lciB8IFBhbmVsKVtdIH0gY2hpbGRyZW4gIOWtkOimgee0oCjjgrnjgr/jg4Pjgq/jga/lhYjpoK0x44Gu44G/44O75Yid5Zue6LW35YuV5pmC44Gu6L+95Yqg44Gu44G/6Kix5Y+vKVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cyA9IEJhc2VDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCAuLi5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIE9iamVjdC5hc3NpZ24ob3B0cywgQmFzZUNvbnRhaW5lci5ERUZBVUxUX09QVElPTlMsIHsuLi5vcHRzfSksIC4uLkJhc2VDb250YWluZXIuc2FuaXRpemVDaGlsZHJlbihjaGlsZHJlbikpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXdyYXBwZXInKTtcclxuICAgICAgICBpZiAob3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnKSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3gtcycpO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdveS1zJyk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5uZXIuY2xhc3NOYW1lID0gJ21hZ2ljYS1wYW5lbC1iYXNlJztcclxuICAgICAgICBpZiAob3B0cy5hZGRpdGlvbmFsQ2xhc3NOYW1lcykgdGhpcy5pbm5lci5jbGFzc0xpc3QuYWRkKC4uLm9wdHMuYWRkaXRpb25hbENsYXNzTmFtZXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9zZXRSZXNpemVFdmVtdChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODquOCteOCpOOCuuOCpOODmeODs+ODiOOCkuioreWumuOBl+OBvuOBmeOAglxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbSDjgqTjg5njg7Pjg4jjgr/jg7zjgrLjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgX3NldFJlc2l6ZUV2ZW10IChlbGVtKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbXJlY3QgPSB7eDogZWxlbS5jbGllbnRXaWR0aCwgeTogZWxlbS5jbGllbnRIZWlnaHR9O1xyXG4gICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtLmNsaWVudFdpZHRoICE9PSB0aGlzLl9lbGVtcmVjdC54XHJcbiAgICAgICAgICAgIHx8IGVsZW0uY2xpZW50SGVpZ2h0ICE9PSB0aGlzLl9lbGVtcmVjdC55KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtcmVjdCA9IHt4OiBlbGVtLmNsaWVudFdpZHRoLCB5OiBlbGVtLmNsaWVudEhlaWdodH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDogdGhpcy5fZWxlbXJlY3R9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoUGFuZWxCYXNlLndpbmRvdy5SZXNpemVPYnNlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBybyA9IG5ldyBQYW5lbEJhc2Uud2luZG93LlJlc2l6ZU9ic2VydmVyKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJvLm9ic2VydmUoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGFuZWxCYXNlLndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBmKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7phY3liJfjgYzmraPjgZfjgYTmp4vmiJDjgavjgarjgovjgojjgYbjgavmpJzoqLzjg7vjg5XjgqPjg6vjgr/jgZfjgb7jgZnjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUNoaWxkcmVuIChjaGlsZHJlbikge1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gY2hpbGRyZW4uZmluZChlID0+IGUub3B0cy50eXBlID09PSAnc3RhY2snKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoc3RhY2spIHJlc3VsdC5wdXNoKHN0YWNrKTtcclxuICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJykpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjga7np7vli5Xjgavov73lvpPjgZfjgb7jgZnjgIJcclxuICAgICAqL1xyXG4gICAgY2hpbGRNb3ZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3RzID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcChlID0+IGUucmlnaHQgKyB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0IDwgbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHttYXhYIC0gdGhpcy5pbm5lci5jbGllbnRMZWZ0fXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LnJpZ2h0ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKGUgPT4gZS5ib3R0b20gKyB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlY3QuYm90dG9tIDwgbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7bWF4WSAtIHRoaXMuaW5uZXIuY2xpZW50VG9wfXB4YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRSZWN0LmJvdHRvbSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVyLnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hpbGRyZW5tb3ZlJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNb3ZlZEhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjaGlsZHJlbm1vdmVkJywge2RldGFpbDogey4uLmV2dC5kZXRhaWwsIHRhcmdldDogZXZ0LnRhcmdldH19KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1mb3ItZWFjaFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZmlsdGVyKGUgPT4gZS5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWluaW11bScpKS5mb3JFYWNoKCh2YWx1ZSwgY291bnRlcikgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZS5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt2YWx1ZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGggKiBjb3VudGVyfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgVmFsdWUgZnJvbSAnLi92YWx1ZXMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIENvb3JkaW5hdGlvbk9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geCBY5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICogQHByb3BlcnR5IHsgbnVtYmVyIH0geSBZ5pa55ZCRKOaMh+WumuOBjOOBguOCjOOBsClcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUmVzaXplYWJsZU9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IGVuYWJsZSAgICAgICDjg6bjg7zjgrbmk43kvZzjga7mnInlirnjg7vnhKHlirlcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9IHNob3dUaXRsZWJhciDpgannlKjmmYLjgavjgr/jgqTjg4jjg6vjg5Djg7zjgpLooajnpLrjgZnjgovjgYtcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgUGFuZWxPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdwYW5lbCcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBtaW5TaXplICAgICAgICAgICAgIOacgOWwj+OCpuOCo+ODs+ODieOCpuWGheOCs+ODs+ODhuODs+ODhOOCteOCpOOCuijmjIflrprjgYzjgYLjgozjgbApXHJcbiAqIEBwcm9wZXJ0eSB7IENvb3JkaW5hdGlvbk9wdGlvbnMgfSAgICAgICAgICAgICAgbWF4U2l6ZSAgICAgICAgICAgICDmnIDlpKfjgqbjgqPjg7Pjg4njgqblhoXjgrPjg7Pjg4bjg7Pjg4TjgrXjgqTjgroo5oyH5a6a44GM44GC44KM44GwKVxyXG4gKiBAcHJvcGVydHkgeyBDb29yZGluYXRpb25PcHRpb25zIH0gICAgICAgICAgICAgIHBvc2l0aW9uICAgICAgICAgICAg5Yid5pyf5L2N572uKOW3puS4iilcclxuICogQHByb3BlcnR5IHsgQ29vcmRpbmF0aW9uT3B0aW9ucyB9ICAgICAgICAgICAgICBkZWZhdWx0U2l6ZSAgICAgICAgIOWIneacn+OCteOCpOOCuigzMjB4MjQwLCDjgr/jgqTjg4jjg6vjg5Djg7zjgIHjgqbjgqPjg7Pjg4njgqbmnqDnt5rlkKvjgb7jgZopXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZyB8IEhUTUxFbGVtZW50IH0gICAgICAgICAgICAgdGl0bGUgICAgICAgICAgICAgICDjgr/jgqTjg4jjg6tcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWFibGUgICAgICAgICAgIOODkOODhOODnOOCv+ODs+OCkuWHuuePvuOBleOBm+OCi1xyXG4gKiBAcHJvcGVydHkgeyBib29sZWFuIH0gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYWJsZSAgICAgICAgICAg5pyA5bCP5YyW44Oc44K/44Oz44KS5Ye654++44GV44Gb44KLXHJcbiAqIEBwcm9wZXJ0eSB7IFJlc2l6ZWFibGVPcHRpb25zIH0gICAgICAgICAgICAgICAgbWF4aW11bSAgICAgICAgICAgICDmnIDlpKfljJbjga7mjJnli5VcclxuICogQHByb3BlcnR5IHsgJ21vZGFsJyB8ICdtb2RhbGVzcycgfCAndG9wTW9zdCcgfSBtb2RhbCAgICAgICAgICAgICAgIOODouODvOODgOODq+ihqOekuueKtuaFi1xyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WCAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWOi7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyAnc2Nyb2xsJyB8ICdyZXNpemUnIHwgJ2hpZGRlbicgfSAgIG92ZXJmbG93WSAgICAgICAgICAg5YaF5a6544Kz44Oz44OG44Oz44OE44GMWei7uOOBq+a6ouOCjOOBn+WgtOWQiFxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfSAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWUg44OR44ON44Or44Gr6L+95Yqg44Gn5LuY44GR44KL44Kv44Op44K55ZCNXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgIFRhYk9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJycgfVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiAgU3RhY2tDb250YWluZXJPcHRpb25zXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7ICdzdGFjaycgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgICAgICAgICDjg5Hjg43jg6vnqK7liKVcclxuICogQHByb3BlcnR5IHsgJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyB8IFRhYk9wdGlvbnMgfSBkaXJlY3Rpb24gICAgICAgICAgIOWIhuWJsuaWueWQkVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmdbXSB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlICAgICAgICAgICAg44Kz44Os44Kv44K344On44Oz5ZCE6KaB57Sg44Gu5Yid5pyf44K144Kk44K6XHJcbiAqIEBwcm9wZXJ0eSB7IGJvb2xlYW4gfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwcm9wb3J0aW9uYWJsZSAgICDjgrPjg6zjgq/jgrfjg6fjg7Pjga7mr5TnjofjgpLmk43kvZzjgafjgY3jgovjgYtcclxuICogQHByb3BlcnR5IHsgYm9vbGVhbiB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NrYWJsZSAgICAgICAgICAgIOOCs+ODrOOCr+OCt+ODp+ODs+OBruiEseedgOaTjeS9nOOBjOOBp+OBjeOCi+OBiyjjg6bjg7zjgrbmk43kvZzjgYvjgokpXHJcbiAqIEBwcm9wZXJ0eSB7IG51bWJlciB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yV2lkdGggICAgICDliIblibLlooPnlYznt5rjga7luYUoMe+9nilcclxuICogQHByb3BlcnR5IHsgc3RyaW5nIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lIOODkeODjeODq+OBq+i/veWKoOOBp+S7mOOBkeOCi+OCr+ODqeOCueWQjVxyXG4gKiBAcHJvcGVydHkgeyBzdHJpbmcgfCBIVE1MRWxlbWVudCB9ICAgICAgICAgICAgICAgICAgIHBhbmVsQWRkQXJlYSAgICAgICAg44K544K/44OD44Kv5YaF44GM56m644Gu44Go44GN44Gr6KGo56S644GV44KM44KL44OR44ON44Or6L+95Yqg44Ki44Kk44Kz44OzXHJcbiAqIEBwcm9wZXJ0eSB7IGFueVtdIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICDku7vmhI/jgavmjIflrprjgafjgY3jgovlsZ7mgKdcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgQmFzZUNvbnRhaW5lck9wdGlvbnNcclxuICpcclxuICogQHByb3BlcnR5IHsgJ2Jhc2UnIH0gICAgICAgICAgICAgIHR5cGUgICAgICAgICAgICAgICAg44OR44ON44Or56iu5YilXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1ggICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxY6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7ICdzY3JvbGwnIHwgJ2hpZGRlbicgfSBvdmVyZmxvd1kgICAgICAgICAgICDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4TjgYxZ6Lu444Gr5rqi44KM44Gf5aC05ZCIXHJcbiAqIEBwcm9wZXJ0eSB7IHN0cmluZ1tdIH0gICAgICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lcyDjg5Hjg43jg6vjgavov73liqDjgafku5jjgZHjgovjgq/jg6njgrnlkI1cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbEJhc2UgZXh0ZW5kcyBFdmVudFRhcmdldFxyXG57XHJcbiAgICBzdGF0aWMgX2luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgc3RhdGljIHdpbmRvdztcclxuICAgIHN0YXRpYyBkb2N1bWVudDtcclxuICAgIHN0YXRpYyBDdXN0b21FdmVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBIVE1MRWxlbWVudCB9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB8IFN0YWNrUGFuZWxPcHRpb25zIHwgQmFzZUNvbnRhaW5lck9wdGlvbnMgfSBvcHRzXHJcbiAgICAgKiBAcGFyYW0geyAoUGFuZWxCYXNlIHwgSFRNTEVsZW1lbnQpW10gfSBjaGlsZHJlblxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgb3B0cywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm91dGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZVBhcmVudEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFyZW50SGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNb3ZlZEhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlZEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRNb3ZlSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkTWluaW1pemVkSGFuZGxlcihldik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2hpbGROb3JtYWxpemVkSGFuZGxlciA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKGV2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9yZXNpemVQYXJlbnRIYW5kbGVyID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVBhcmVudEhhbmRsZXIoZXYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIC8vIOiHqui6q+imgee0oOOCkuWIneacn+WMluOBmeOCi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kKHRoaXMuX2lubmVyKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHRoaXMuYWN0aXZlKCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIGlmIChjaGlsZCBpbnN0YW5jZW9mIFBhbmVsQmFzZSkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUgeyBQYW5lbEJhc2UgfCB1bmRlZmluZWQgfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoIVBhbmVsQmFzZS5faW5pdGlhbGl6ZWQpIFBhbmVsQmFzZS5pbml0KCk7XHJcbiAgICAgICAgUGFuZWxCYXNlLl9pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHsgUGFuZWxPcHRpb25zIHwgU3RhY2tQYW5lbE9wdGlvbnMgfCBCYXNlQ29udGFpbmVyT3B0aW9ucyB9XHJcbiAgICAgKi9cclxuICAgIGdldCBvcHRzICgpIHtcclxuICAgICAgICBjb25zdCB7dGl0bGUsIC4uLm90aGVyfSA9IHRoaXMuX29wdHM7XHJcbiAgICAgICAgY29uc3Qgb3B0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3RoZXIpKTtcclxuICAgICAgICBpZiAodGl0bGUpIG9wdHMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICByZXR1cm4gb3B0cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZWxlbWVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlubmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVJ44KS5qeL56+J44GZ44KL44Gf44KB44Gu5Yid5pyf5YyW44Oh44K944OD44OJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0ICgpIHtcclxuICAgICAgICBQYW5lbEJhc2UuYXBwZW5kU3R5bGVFbGVtZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K544K/44Kk44Or44KS44OY44OD44OA44Gr6L+95Yqg44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhcHBlbmRTdHlsZUVsZW1lbnRzICgpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gVmFsdWUuc3R5bGU7XHJcbiAgICAgICAgUGFuZWxCYXNlLmRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsO1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFwcGVuZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9jbG9zZVBhcmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hhbmdlcGFyZW50Jywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVBhcmVudEhhbmRsZXIodW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZVBhcmVudEhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE1vdmVkSGFuZGxlciAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRNaW5pbWl6ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGlsZE5vcm1hbGl6ZWRIYW5kbGVyICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgnY2hhbmdlcGFyZW50Jywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICh2YWwpIHtcclxuICAgICAgICAodmFsLm91dGVyID8/IHZhbC5lbGVtZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLmZpbHRlcihlID0+IGUgIT09IHZhbCk7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdmUnLCB0aGlzLl9jaGlsZE1vdmVIYW5kbGVyKTtcclxuICAgICAgICB2YWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW92ZWQnLCB0aGlzLl9jaGlsZE1vdmVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21pbmltaXplZCcsIHRoaXMuX2NoaWxkTWluaW1pemVkSGFuZGxlcik7XHJcbiAgICAgICAgdmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ25vcm1hbGl6ZWQnLCB0aGlzLl9jaGlsZE5vcm1hbGl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZXBhcmVudCcsIHZhbC5fY2hhbmdlUGFyZW50SGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kICh2YWwsIHJlZikge1xyXG4gICAgICAgIGNvbnN0IG5leHQgPSByZWY/Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5pbnNlcnRCZWZvcmUodmFsLm91dGVyID8/IHZhbC5lbGVtZW50LCBuZXh0KTtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGlsZHJlbi5tYXAoZSA9PiBlLmVsZW1lbnQpLmZpbmRJbmRleChlID0+IGUubmV4dEVsZW1lbnRTaWJsaW5nID09PSByZWYpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoaWR4ICsgMSwgMCwgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyLmFwcGVuZCh2YWwub3V0ZXIgPz8gdmFsLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbW92ZScsIHRoaXMuX2NoaWxkTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHZhbC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlZCcsIHRoaXMuX2NoaWxkTW92ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbWluaW1pemVkJywgdGhpcy5fY2hpbGRNaW5pbWl6ZWRIYW5kbGVyKTtcclxuICAgICAgICB2YWwuYWRkRXZlbnRMaXN0ZW5lcignbm9ybWFsaXplZCcsIHRoaXMuX2NoaWxkTm9ybWFsaXplZEhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlcGFyZW50JywgdmFsLl9jaGFuZ2VQYXJlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSAoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQYW5lbEJhc2UpIHtcclxuICAgICAgICAgICAgY2hpbGQuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdjbG9zZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkgdGhpcy5fcGFyZW50Lm1vZGlmeVpJbmRleCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RpZnlaSW5kZXggKGFjdGl2ZSkge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLl9jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLm9wdHMudHlwZSA9PT0gJ3BhbmVsJyk7XHJcbiAgICAgICAgaWYgKHdpbmRvd3MuaW5jbHVkZXMoYWN0aXZlKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRzID0gd2luZG93cy5maWx0ZXIoZSA9PiBlICE9PSBhY3RpdmUpLnNvcnQoKGEsIGIpID0+IE51bWJlcihhLmVsZW1lbnQuc3R5bGUuekluZGV4ID8/ICcwJykgLSBOdW1iZXIoYi5lbGVtZW50LnN0eWxlLnpJbmRleCA/PyAnMCcpKTtcclxuICAgICAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoOyBpZHggPCB0YXJnZXRzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldHNbaWR4XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IGAke2lkeH1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhY3RpdmUuZWxlbWVudC5zdHlsZS56SW5kZXggPSBgJHtpZHh9YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbnRyeSB7XHJcbiAgICBQYW5lbEJhc2Uud2luZG93ID0gd2luZG93O1xyXG4gICAgUGFuZWxCYXNlLmRvY3VtZW50ID0gZG9jdW1lbnQ7XHJcbiAgICBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50O1xyXG4gICAgUGFuZWxCYXNlLkltYWdlID0gSW1hZ2U7XHJcbn1cclxuY2F0Y2gge1xyXG4gICAgUGFuZWxCYXNlLndpbmRvdyA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5kb2N1bWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5DdXN0b21FdmVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5IVE1MRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgIFBhbmVsQmFzZS5JbWFnZSA9IHVuZGVmaW5lZDtcclxufVxyXG4iLCJpbXBvcnQgUGFuZWxCYXNlIGZyb20gJy4vcGFuZWwtYmFzZS5qcyc7XHJcbmltcG9ydCBCYXNlQ29udGFpbmVyIGZyb20gJy4vYmFzZS1jb250YWluZXIuanMnO1xyXG5cclxuLyoqXHJcbiAqIFVJ44KS5qC857SN44GZ44KL44OR44ON44Or44Ko44Oq44Ki44CC44Km44Kj44Oz44OJ44Km6KGo56S644O744G744GL44OR44ON44Or44G444Gu5qC857SN44GM5Y+v6IO9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgUGFuZWxPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAncGFuZWwnLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7eDogMCwgeTogMH0sXHJcbiAgICAgICAgbWluU2l6ZToge3g6IDEyMCwgeTogMH0sXHJcbiAgICAgICAgZGVmYXVsdFNpemU6IHt4OiAzMjAsIHk6IDI0MH0sXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIGNsb3NlYWJsZTogdHJ1ZSxcclxuICAgICAgICBhdXRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgbWluaW1hYmxlOiB0cnVlLFxyXG4gICAgICAgIG1heGltdW06IHtlbmFibGU6IHRydWUsIHNob3dUaXRsZWJhcjogdHJ1ZX0sXHJcbiAgICAgICAgZGVmYXVsdE1vZGU6ICdub3JtYWwnLFxyXG4gICAgICAgIG1vZGFsOiAnbW9kYWxlc3MnLFxyXG4gICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXHJcbiAgICAgICAgb3ZlcmZsb3dZOiAnc2Nyb2xsJyxcclxuICAgICAgICBhZGRpdGlvbmFsQ2xhc3NOYW1lOiAnJyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeOCkuagvOe0jeOBmeOCi+ODkeODjeODq+OCqOODquOCouOAguOCpuOCo+ODs+ODieOCpuODu+ODmuOCpOODs+ihqOekuuOBjOWPr+iDvVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7IFBhbmVsT3B0aW9ucyB9ICAgICAgICAgICAgb3B0cyAgICDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7IEhUTUxFbGVtZW50IHwgUGFuZWxCYXNlIH0gY29udGVudCDlhoXlrrnjgrPjg7Pjg4bjg7Pjg4RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9wdHMgPSBQYW5lbC5ERUZBVUxUX09QVElPTlMsIGNvbnRlbnQpIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgUGFuZWwuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC13aW5kb3cnKTtcclxuICAgICAgICB0aGlzLmlubmVyLmNsYXNzTmFtZSA9ICdtYWdpY2EtcGFuZWwtaW5uZXInO1xyXG4gICAgICAgIGlmIChvcHRzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuY2xhc3NMaXN0LmFkZCgnb3gtcycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdHMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5jbGFzc0xpc3QuYWRkKCdveS1zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0cy5kZWZhdWx0TW9kZSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5uZXIuc3R5bGUud2lkdGggPSBgJHtvcHRzLmRlZmF1bHRTaXplLnh9cHhgO1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtvcHRzLmRlZmF1bHRTaXplLnl9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBQYW5lbEJhc2UuSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgr/jgqTjg4jjg6vjg5Djg7zjgpLov73liqBcclxuICAgICAgICBjb25zdCB0aXRsZWJhciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IG9wdHMudGl0bGU7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChzcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wdHM/LnRpdGxlID09PSAnb2JqZWN0JyAmJiBvcHRzLnRpdGxlIGluc3RhbmNlb2YgUGFuZWxCYXNlLkhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRpdGxlYmFyLmFwcGVuZChvcHRzLnRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGViYXIgPSB0aXRsZWJhcjtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZSh0aXRsZWJhciwgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtdGl0bGViYXInKTtcclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLnNob3dUaXRsZWJhcikge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlYmFyLmNsYXNzTGlzdC5hZGQoJ21heGltdW0tZGlzYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGV2ID0+IHRoaXMuX21vdmVUaXRsZWJhckhhbmRsZXIoZXYpKTtcclxuICAgICAgICB0aGlzLnRpdGxlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB0aGlzLl9tb3ZlVGl0bGViYXJIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgdGhpcy50aXRsZWJhci5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZXYgPT4gdGhpcy5fbW92ZVRpdGxlYmFySGFuZGxlcihldikpO1xyXG4gICAgICAgIHRoaXMudGl0bGViYXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4ge1xyXG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5ldyBQYW5lbEJhc2UuSW1hZ2UoKSwgMCwgMCk7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgJ3BhbmVsJyk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9hZGRSZXNpemVBcmVhKCk7XHJcblxyXG4gICAgICAgIC8vIOODnOOCv+ODs+OCqOODquOCouOCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbmFyZWEgPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgYnV0dG9uYXJlYS5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtYnV0dG9uLWFyZWEnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGJ1dHRvbmFyZWEpO1xyXG5cclxuICAgICAgICAvLyDplonjgZjjgovjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBjbG9zZWJ1dHRvbiA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjbG9zZWJ1dHRvbi50ZXh0Q29udGVudCA9ICfDlyc7XHJcbiAgICAgICAgY2xvc2VidXR0b24uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLWJ1dHRvbicsICdjbG9zZScpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRzLmNsb3NlYWJsZSkge1xyXG4gICAgICAgICAgICBjbG9zZWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBidXR0b25hcmVhLmFwcGVuZChjbG9zZWJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vIOacgOWkp+WMli/lvqnlhYPjg5zjgr/jg7PjgpLov73liqBcclxuICAgICAgICBjb25zdCBtYXhpbXVtYnV0dG9uID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIG1heGltdW1idXR0b24udGV4dENvbnRlbnQgPSAn4p2QJztcclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnbWF4aW11bScpO1xyXG4gICAgICAgIG1heGltdW1idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1heGltdW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5tYXhpbXVtLmVuYWJsZSkge1xyXG4gICAgICAgICAgICBtYXhpbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlYnV0dG9uLmJlZm9yZShtYXhpbXVtYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g5pyA5bCP5YyWL+W+qeWFg+ODnOOCv+ODs+OCkui/veWKoFxyXG4gICAgICAgIGNvbnN0IG1pbmltdW1idXR0b24gPSBQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbWluaW11bWJ1dHRvbi50ZXh0Q29udGVudCA9ICctJztcclxuICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1idXR0b24nLCAnbWluaW11bScpO1xyXG4gICAgICAgIG1pbmltdW1idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW5pbXVtJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmltdW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0cy5taW5pbWFibGUpIHtcclxuICAgICAgICAgICAgbWluaW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXhpbXVtYnV0dG9uLmJlZm9yZShtaW5pbXVtYnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy8g44Oi44O844OA44OrXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndG9wbW9zdCcpO1xyXG4gICAgICAgICAgICBtaW5pbXVtYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2RlbnknKTtcclxuICAgICAgICAgICAgbWF4aW11bWJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkZW55Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9hZGRSZXNpemVBcmVhICgpIHtcclxuICAgICAgICAvLyDjg6rjgrXjgqTjgrrpoJjln5/jgpLov73liqBcclxuICAgICAgICB0aGlzLmVkZ2VzID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgW1sndG9wJ10sIFsnYm90dG9tJ10sIFsnbGVmdCddLCBbJ3JpZ2h0J10sIFsndG9wJywgJ2xlZnQnXSwgWyd0b3AnLCAncmlnaHQnXSwgWydib3R0b20nLCAnbGVmdCddLCBbJ2JvdHRvbScsICdyaWdodCddXSkge1xyXG4gICAgICAgICAgICBjb25zdCBlZGdlID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBlZGdlLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1lZGdlJywgLi4udGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChlZGdlKTtcclxuICAgICAgICAgICAgZWRnZS5kcmFnZ2FibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXYgPT4gdGhpcy5fcmVzaXplQXJlYUhhbmRsZXIoZXYpKTtcclxuICAgICAgICAgICAgZWRnZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVBcmVhSGFuZGxlcihldik7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIGV2ID0+IHRoaXMuX3Jlc2l6ZUFyZWFIYW5kbGVyKGV2KSk7XHJcbiAgICAgICAgICAgIGVkZ2UuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZXYgPT4gZXYuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShuZXcgSW1hZ2UoKSwgMCwgMCksIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5lZGdlc1t0YXJnZXRdID0gZWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKlxyXG4gICAgICogQHBhcmFtIHsgTW91c2VFdmVudCB9IGV2XHJcbiAgICAgKi9cclxuICAgIF9yZXNpemVBcmVhSGFuZGxlciAoZXYpIHtcclxuICAgICAgICBpZiAoZXYudHlwZSA9PT0gJ21vdXNlZG93bicgfHwgZXYudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYucGFnZVggfHwgZXYudG91Y2hlc1swXS5wYWdlWCwgeTogZXYucGFnZVkgfHwgZXYudG91Y2hlc1swXS5wYWdlWX07XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0cmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldi50eXBlID09PSAnZHJhZydcclxuICAgICAgICB8fCBldi50eXBlID09PSAndG91Y2htb3ZlJykge1xyXG4gICAgICAgICAgICBpZiAoZXYuc2NyZWVuWSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvcCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fc3RhcnRyZWN0LmhlaWdodCArIHRoaXMuX2NsaWNrc3RhcnQueSAtIChldi5wYWdlWSB8fCBldi50b3VjaGVzWzBdLnBhZ2VZKSAtIDEwO1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgfHwgSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5wYXJlbnQuZWxlbWVudC5zY3JvbGxUb3AgKyB0aGlzLl9zdGFydHJlY3QuYm90dG9tIC0gaGVpZ2h0IC0gdGhpcy50aXRsZWJhci5jbGllbnRIZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3N0YXJ0cmVjdC5oZWlnaHQgKyAoZXYucGFnZVkgfHwgZXYudG91Y2hlc1swXS5wYWdlWSkgLSB0aGlzLl9jbGlja3N0YXJ0LnkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0IDw9IHRoaXMub3B0cy5taW5TaXplLnk/IHRoaXMub3B0cy5taW5TaXplLnk6IGhlaWdodCA+PSAodGhpcy5vcHRzLm1heFNpemU/LnkgfHwgSW5maW5pdHkpPyB0aGlzLm9wdHMubWF4U2l6ZS55OiBoZWlnaHR9cHhgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9zdGFydHJlY3Qud2lkdGggKyB0aGlzLl9jbGlja3N0YXJ0LnggLSAoZXYucGFnZVggfHwgZXYudG91Y2hlc1swXS5wYWdlWCkgLSAxMDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggPD0gdGhpcy5vcHRzLm1pblNpemUueD8gdGhpcy5vcHRzLm1pblNpemUueDogd2lkdGggPj0gKHRoaXMub3B0cy5tYXhTaXplPy54IHx8IEluZmluaXR5KT8gdGhpcy5vcHRzLm1heFNpemUueDogd2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIHRoaXMuX3N0YXJ0cmVjdC5yaWdodCAtIHdpZHRofXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3N0YXJ0cmVjdC53aWR0aCArIChldi5wYWdlWCB8fCBldi50b3VjaGVzWzBdLnBhZ2VYKSAtIHRoaXMuX2NsaWNrc3RhcnQueCAtIDEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRoIDw9IHRoaXMub3B0cy5taW5TaXplLng/IHRoaXMub3B0cy5taW5TaXplLng6IHdpZHRoID49ICh0aGlzLm9wdHMubWF4U2l6ZT8ueCB8fCBJbmZpbml0eSk/IHRoaXMub3B0cy5tYXhTaXplLng6IHdpZHRofXB4YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKioqXHJcbiAgICAgKiBAcGFyYW0geyBNb3VzZUV2ZW50IH0gZXZcclxuICAgICAqL1xyXG4gICAgX21vdmVUaXRsZWJhckhhbmRsZXIgKGV2KSB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBCYXNlQ29udGFpbmVyKVxyXG4gICAgICAgIHx8IHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAndG91Y2hzdGFydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBldi50YXJnZXQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrc3RhcnQgPSB7eDogZXYub2Zmc2V0WCB8fCAoZXYudG91Y2hlc1swXS5wYWdlWCAtIHJlY3QubGVmdCksIHk6IGV2Lm9mZnNldFkgfHwgKGV2LnRvdWNoZXNbMF0ucGFnZVkgLSByZWN0LnRvcCl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWcnOlxyXG4gICAgICAgICAgICBjYXNlICd0b3VjaG1vdmUnOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGV2LnNjcmVlblkgfHwgZXYudG91Y2hlc1swXS5zY3JlZW5ZKSA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7KHRoaXMucGFyZW50LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldi5wYWdlWCB8fCBldi50b3VjaGVzWzBdLnBhZ2VYKSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnh9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAkeyh0aGlzLnBhcmVudC5lbGVtZW50LnNjcm9sbFRvcCArIChldi5wYWdlWSB8fCBldi50b3VjaGVzWzBdLnBhZ2VZKSkgLSB0aGlzLl9jbGlja3N0YXJ0Lnl9cHhgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ21vdmUnLCB7ZGV0YWlsOiB7cmVjdDogdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0sIGV2LCB0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdlbmQnOlxyXG4gICAgICAgICAgICBjYXNlICd0b3VjaGVuZCc6IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRqdXN0V2luZG93UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdtb3ZlZCcsIHtkZXRhaWw6IHtyZWN0OiB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXSwgZXYsIHRhcmdldDogdGhpc319KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGp1c3RXaW5kb3dQb3NpdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQuaW5uZXIuY2xpZW50SGVpZ2h0ID4gdGhpcy5lbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgICAgICYmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQpIDwgY3VycmVudFJlY3QuYm90dG9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLnBhcmVudC5pbm5lci5jbGllbnRIZWlnaHQgLSB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0fXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCA+IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aFxyXG4gICAgICAgICYmICh0aGlzLnBhcmVudC5pbm5lci5jbGllbnRXaWR0aCkgPCBjdXJyZW50UmVjdC5yaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMucGFyZW50LmlubmVyLmNsaWVudFdpZHRoIC0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRofXB4YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50UmVjdC5sZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRSZWN0LnRvcCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtYXhpbXVtICgpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0/LmxlZnQgfHwgMDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXhpbXVtJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vcm1hbCAoeCkge1xyXG4gICAgICAgIGxldCByYXRpbyA9IDA7XHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIHJhdGlvID0gKHggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtaW5pbXVtJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21heGltdW0nKTtcclxuXHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCB3ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF0ud2lkdGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jbGlja3N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGlja3N0YXJ0LnggPSB3ICogcmF0aW87XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5yb3VuZCh4IC0gKHcgKiByYXRpbykpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fbGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMuX2xlZnR9cHhgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ25vcm1hbGl6ZWQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWluaW11bSAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdPy5sZWZ0IHx8IDA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21heGltdW0nKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWluaW11bScpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUGFuZWxCYXNlLkN1c3RvbUV2ZW50KCdtaW5pbWl6ZWQnLCB7ZGV0YWlsOiB7dGFyZ2V0OiB0aGlzfX0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyIChfZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXhpbXVtJykgJiYgIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbmltdW0nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkanVzdFdpbmRvd1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFBhbmVsQmFzZS5DdXN0b21FdmVudCgncmVzaXplJywge2RldGFpbDoge3RhcmdldDogdGhpc319KSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFyZW50SGFuZGxlciAoZXZ0KSB7XHJcbiAgICAgICAgc3VwZXIuY2hhbmdlUGFyZW50SGFuZGxlcihldnQpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMubW9kYWwgPT09ICdtb2RhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5vdXRlciA9IFBhbmVsQmFzZS5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdGhpcy5vdXRlci5jbGFzc0xpc3QuYWRkKCdtYWdpY2EtcGFuZWwtbW9kYWwtYmxvY2tlcicpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5vdXRlciwgdGhpcy5lbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5vdXRlci5hcHBlbmQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBpZiAocmVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgY2FsYyg1MCUgLSAke3JlY3Qud2lkdGggLyAyfXB4KWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYGNhbGMoNTAlIC0gJHtyZWN0LmhlaWdodCAvIDJ9cHgpYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBQYW5lbEJhc2UgZnJvbSAnLi9wYW5lbC1iYXNlLmpzJztcclxuXHJcbi8qKlxyXG4gKiDlnoLnm7Tjgb7jgZ/jga/msLTlubPmlrnlkJHjgbjjga7mlbTliJfjgoTjgr/jg5bliIfjgormm7/jgYjjgavjgojjgovjg5Hjg43jg6vjga7jgrnjgqTjg4Pjg4EoM+WAi+OBruOBhuOBoeOBhOOBmuOCjOOBizHjgaQp44KS5o+Q5L6b44GX44G+44GZ44CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFja0NvbnRhaW5lciBleHRlbmRzIFBhbmVsQmFzZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHsgU3RhY2tDb250YWluZXJPcHRpb25zIH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIERFRkFVTFRfT1BUSU9OUyA9IHtcclxuICAgICAgICB0eXBlOiAnc3RhY2snLFxyXG4gICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICByZXByb3BvcnRpb25hYmxlOiB0cnVlLFxyXG4gICAgICAgIGRvY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIHNlcGFyYXRvcldpZHRoOiAyLFxyXG4gICAgICAgIGFkZGl0aW9uYWxDbGFzc05hbWU6ICcnLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdLFxyXG4gICAgICAgIHRlbXBsYXRlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcGFuZWxBZGRBcmVhOiB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVUnjgpLmoLzntI3jgZnjgovjg5Hjg43jg6vjgqjjg6rjgqLjgILjgqbjgqPjg7Pjg4njgqbjg7vjg5rjgqTjg7PooajnpLrjgYzlj6/og71cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyBTdGFja0NvbnRhaW5lck9wdGlvbnMgfSAgICAgIG9wdHMgICAg44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcGFyYW0geyAoU3RhY2tDb250YWluZXIgfCBQYW5lbClbXSB9IGNoaWxkcmVuIOWGheWuueOCs+ODs+ODhuODs+ODhFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3B0cyA9IFN0YWNrQ29udGFpbmVyLkRFRkFVTFRfT1BUSU9OUywgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdXBlcihQYW5lbEJhc2UuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIE9iamVjdC5hc3NpZ24ob3B0cywgU3RhY2tDb250YWluZXIuREVGQVVMVF9PUFRJT05TLCB7Li4ub3B0c30pLCAuLi5jaGlsZHJlbik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcy5vcHRzLnRlbXBsYXRlKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXInKTtcclxuICAgICAgICB0aGlzLmlubmVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1pbm5lcicpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaG9yaXpvbnRhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndGFiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhZGRBcmVhID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBhZGRBcmVhLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3InLCAnZW1wdHknKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMucGFuZWxBZGRBcmVhID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgYWRkQXJlYS5hcHBlbmQodGhpcy5vcHRzLnBhbmVsQWRkQXJlYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBcmVhLnRleHRDb250ZW50ID0gdGhpcy5vcHRzLnBhbmVsQWRkQXJlYSA/PyB0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAn4pakJyA6ICfilqUnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZGFyZWFzLnB1c2goYWRkQXJlYSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoYWRkQXJlYSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tb3ZlaGFuZGxlciA9IGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1vZGFsICE9PSAnbW9kYWxlc3MnKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVkgPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxUb3AgKyAoZXZ0LmRldGFpbC5ldi5wYWdlWSB8fCBldnQuZGV0YWlsLmV2LnRvdWNoZXNbMF0ucGFnZVkpO1xyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVggPSB0aGlzLnJvb3QuZWxlbWVudC5zY3JvbGxMZWZ0ICsgKGV2dC5kZXRhaWwuZXYucGFnZVggfHwgZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbVJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1SZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCBlbGVtUmVjdC5ib3R0b21cclxuICAgICAgICAgICAgJiYgZWxlbVJlY3QubGVmdCA8IG1vdXNlWCAmJiBtb3VzZVggPCBlbGVtUmVjdC5yaWdodFxyXG4gICAgICAgICAgICAmJiBldnQuZGV0YWlsLnRhcmdldC5vcHRzLm1heGltdW0uZW5hYmxlID09PSB0cnVlICYmIHRoaXMub3B0cy5kb2NrYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBhZGRhcmVhIG9mIHRoaXMuYWRkYXJlYXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBhZGRhcmVhLmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocmVjdCAmJiByZWN0LnRvcCA8IG1vdXNlWSAmJiBtb3VzZVkgPCByZWN0LmJvdHRvbVxyXG4gICAgICAgICAgICAgICAgJiYgcmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IHJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9tb3ZlZGhhbmRsZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tb2RhbCAhPT0gJ21vZGFsZXNzJykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW91c2VZID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsVG9wICsgKGV2dC5kZXRhaWwuZXYucGFnZVkgfHwgZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VYID0gdGhpcy5yb290LmVsZW1lbnQuc2Nyb2xsTGVmdCArIChldnQuZGV0YWlsLmV2LnBhZ2VYIHx8IGV2dC5kZXRhaWwuZXYudG91Y2hlc1swXS5wYWdlWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1SZWN0ID0gdGhpcy5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XHJcbiAgICAgICAgICAgIGlmIChlbGVtUmVjdC50b3AgPCBtb3VzZVkgJiYgbW91c2VZIDwgZWxlbVJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICYmIGVsZW1SZWN0LmxlZnQgPCBtb3VzZVggJiYgbW91c2VYIDwgZWxlbVJlY3QucmlnaHRcclxuICAgICAgICAgICAgJiYgZXZ0LmRldGFpbC50YXJnZXQub3B0cy5tYXhpbXVtLmVuYWJsZSA9PT0gdHJ1ZSAmJiB0aGlzLm9wdHMuZG9ja2FibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYWRkYXJlYSBvZiB0aGlzLmFkZGFyZWFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5kZXRhaWwudGFyZ2V0LmVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZyA9PT0gYWRkYXJlYS5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZ0LmRldGFpbC50YXJnZXQuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcgPT09IGFkZGFyZWEucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGV2dC5kZXRhaWwudGFyZ2V0LnBhcmVudCAhPT0gdGhpcy5yb290KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gYWRkYXJlYS5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWN0ICYmIHJlY3QudG9wIDwgbW91c2VZICYmIG1vdXNlWSA8IHJlY3QuYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcmVjdC5sZWZ0IDwgbW91c2VYICYmIG1vdXNlWCA8IHJlY3QucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdHJlZiA9IHRoaXMuZWxlbWVudC5jb250YWlucyhhZGRhcmVhLmNsb3Nlc3QoJy5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXInKSk/IGFkZGFyZWEucGFyZW50RWxlbWVudDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSBldnQuZGV0YWlsLnRhcmdldC5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIucGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJlbnQgKHZhbCkge1xyXG4gICAgICAgIHN1cGVyLnBhcmVudCA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXJlbnRIYW5kbGVyIChldnQpIHtcclxuICAgICAgICBzdXBlci5jaGFuZ2VQYXJlbnRIYW5kbGVyKGV2dCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGlsZHJlbm1vdmUnLCB0aGlzLl9tb3ZlaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoaWxkcmVubW92ZWQnLCB0aGlzLl9tb3ZlZGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlJywgdGhpcy5fbW92ZWhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2hpbGRyZW5tb3ZlZCcsIHRoaXMuX21vdmVkaGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZCAodmFsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFkZGFyZWFzKSB0aGlzLmFkZGFyZWFzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuaW5uZXIuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlcCA9IHRoaXMuX2dlbmVyYXRlU2VwYXJhdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChzZXAuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyLmFwcGVuZChzZXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvd1JhbmdlID0gdGhpcy5fbGFzdFRhcmdldFJhbmdlO1xyXG4gICAgICAgICAgICByYW5nZXMgPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudC5nZXRDbGllbnRSZWN0cygpPy5bMF0/Llt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAnaGVpZ2h0JzogJ3dpZHRoJ10gfHwgZS5vcHRzPy5kZWZhdWx0U2l6ZVt0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnPyAneSc6ICd4J10gfHwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0cmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoaWxkcmVuLm1hcChlID0+IGUuZWxlbWVudCkuaW5kZXhPZih0aGlzLl9sYXN0cmVmLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0VGFyZ2V0UmFuZ2UgPSAoKHJhbmdlc1tpZHhdIHx8IDApICsgKHJhbmdlc1tpZHggKyAxXSB8fCAwKSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0UmFuZ2UgPSBNYXRoLm1pbihpbnNlcnRUYXJnZXRSYW5nZSwgd2luZG93UmFuZ2UpIC0gdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKH5pZHggJiYgcmFuZ2VzW2lkeCArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW3NtYWxsSWR4LCBsYXJnZUlkeF0gPSByYW5nZXNbaWR4XSA+IHJhbmdlc1tpZHggKyAxXT8gW2lkeCArIDEsIGlkeF06IFtpZHgsIGlkeCArIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gcmFuZ2VzW3NtYWxsSWR4XSAvIHJhbmdlc1tsYXJnZUlkeF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc21hbGxTaXplID0gTWF0aC5yb3VuZChpbnNlcnRSYW5nZSAvIDIgKiByYXRpbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW3NtYWxsSWR4XSAtPSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2xhcmdlSWR4XSAtPSAoaW5zZXJ0UmFuZ2UgLSBzbWFsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAofmlkeCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlc1tpZHhdIC09IGluc2VydFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCArIDFdIC09IGluc2VydFJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJhbmdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgaW5zZXJ0UmFuZ2UgLSB0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByYW5nZXMgPSByYW5nZXMubWFwKGUgPT4gYCR7ZX1weGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuYXBwZW5kKHZhbCwgdGhpcy5fbGFzdHJlZik7XHJcbiAgICAgICAgaWYgKHZhbC5tYXhpbXVtKSB2YWwubWF4aW11bSgpO1xyXG5cclxuICAgICAgICBjb25zdCBzZXAgPSB0aGlzLl9nZW5lcmF0ZVNlcGFyYXRvcigpO1xyXG4gICAgICAgIHRoaXMuYWRkYXJlYXMucHVzaChzZXAuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIGlmICh2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5pbnNlcnRCZWZvcmUoc2VwLCB2YWwuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lci5hcHBlbmQoc2VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xvc2VzdCgnYm9keScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGNHcmlkU2l6ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmFuZ2VzLmxlbmd0aCA9PT0gMD8gdW5kZWZpbmVkOiByYW5nZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNpemVQYXJlbnRIYW5kbGVyICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5jbG9zZXN0KCdib2R5JykpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXT8uW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSkuZmlsdGVyKGUgPT4gZSAhPT0gdW5kZWZpbmVkKTtcclxuICAgICAgICBjb25zdCB0b3RhbCA9IHJhbmdlcy5yZWR1Y2UoKGEsIGMpID0+IGEgKyBjLCAwKTtcclxuICAgICAgICBjb25zdCByYXRpb3MgPSByYW5nZXMubWFwKGUgPT4gZSAvIHRvdGFsKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50V2lkdGggPSB0aGlzLmlubmVyLmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddIC0gKHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCAqICh0aGlzLmNoaWxkcmVuLmxlbmd0aCArIDEpKTtcclxuICAgICAgICByYW5nZXMgPSByYXRpb3MubWFwKGUgPT4gTWF0aC5yb3VuZChlICogY3VycmVudFdpZHRoKSk7XHJcbiAgICAgICAgcmFuZ2VzLnBvcCgpO1xyXG4gICAgICAgIHJhbmdlcy5wdXNoKGN1cnJlbnRXaWR0aCAtIHJhbmdlcy5yZWR1Y2UoKGEsIGMpID0+IGEgKyBjLCAwKSk7XHJcbiAgICAgICAgcmFuZ2VzID0gcmFuZ2VzLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICBpZiAocmFuZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCByYW5nZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBQYW5lbEJhc2UuQ3VzdG9tRXZlbnQoJ3Jlc2l6ZScsIHtkZXRhaWw6IHt0YXJnZXQ6IHRoaXN9fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZSAodmFsKSB7XHJcbiAgICAgICAgbGV0IHJhbmdlcyA9IHR5cGVvZiB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPT09ICdvYmplY3QnPyB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2U6IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKCk/LlswXT8uW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSk7XHJcbiAgICAgICAgaWYgKHJhbmdlcykge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0UmFuZ2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZih2YWwpO1xyXG4gICAgICAgICAgICBpZiAoIXJhbmdlc1tpZHggLSAxXSAmJiByYW5nZXNbaWR4ICsgMV0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlc1tpZHggKyAxXSArPSByYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghcmFuZ2VzW2lkeCArIDFdICYmIHJhbmdlc1tpZHggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW2lkeCAtIDFdICs9IHJhbmdlc1tpZHhdICsgdGhpcy5vcHRzLnNlcGFyYXRvcldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJhbmdlc1tpZHggKyAxXSAmJiByYW5nZXNbaWR4IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtzbWFsbElkeCwgbGFyZ2VJZHhdID0gcmFuZ2VzW2lkeCAtIDFdID4gcmFuZ2VzW2lkeCArIDFdPyBbaWR4ICsgMSwgaWR4IC0gMV06IFtpZHggLSAxLCBpZHggKyAxXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gcmFuZ2VzW3NtYWxsSWR4XSAvIHJhbmdlc1tsYXJnZUlkeF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzbWFsbFNpemUgPSBNYXRoLnJvdW5kKChyYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCkgLyAyICogcmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VzW3NtYWxsSWR4XSArPSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgICAgICByYW5nZXNbbGFyZ2VJZHhdICs9IChyYW5nZXNbaWR4XSArIHRoaXMub3B0cy5zZXBhcmF0b3JXaWR0aCkgLSBzbWFsbFNpemU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJhbmdlcyA9IHJhbmdlcy5maWx0ZXIoKF9lLCBpKSA9PiBpICE9PSBpZHgpLm1hcChlID0+IGAke2V9cHhgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbC5lbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVtb3ZlKHZhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5uZXIuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkYXJlYXMuZmlsdGVyKGUgPT4gZSAhPT0gdGhpcy5pbm5lci5jaGlsZHJlblswXS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuY2hpbGRyZW5bMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCByYW5nZXM/Lmxlbmd0aCA9PT0gMD8gdW5kZWZpbmVkOiByYW5nZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIF9jYWxjR3JpZFNpemUgKHNlcCwgcG9zLCB0ZW1wbGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdncmlkVGVtcGxhdGVSb3dzJzogJ2dyaWRUZW1wbGF0ZUNvbHVtbnMnO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTaXplcyA9IHRlbXBsYXRlIHx8IHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XS5zcGxpdCgnICcpLmZpbHRlcihlID0+IGUgIT09ICcnKS5maWx0ZXIoKF9lLCBpKSA9PiBpICUgMiAhPT0gMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXIuc3R5bGVbdGFyZ2V0XSA9ICcnO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY3VycmVudFNpemVzWzBdID0gJzFmcic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VwICYmIHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHNlcC5uZXh0RWxlbWVudFNpYmxpbmcgJiYgcG9zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgYnJvcyA9IEFycmF5LmZyb20odGhpcy5pbm5lci5jaGlsZHJlbikuZmlsdGVyKGUgPT4gIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yJykpO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2SWR4ID0gYnJvcy5pbmRleE9mKHNlcC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dElkeCA9IGJyb3MuaW5kZXhPZihzZXAubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldlJlY3QgPSBzZXAucHJldmlvdXNFbGVtZW50U2libGluZy5nZXRDbGllbnRSZWN0cygpWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0UmVjdCA9IHNlcC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0Q2xpZW50UmVjdHMoKVswXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2l6ZXNbcHJldklkeF0gPSBgJHtwb3MgLSBwcmV2UmVjdC50b3AgLSAxfXB4YDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplc1tuZXh0SWR4XSA9IGAke25leHRSZWN0LmJvdHRvbSAtIHBvcyAtIDF9cHhgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW3ByZXZJZHhdID0gYCR7cG9zIC0gcHJldlJlY3QubGVmdCAtIDF9cHhgO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFNpemVzW25leHRJZHhdID0gYCR7bmV4dFJlY3QucmlnaHQgLSBwb3MgLSAxfXB4YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGlkeCsrKSBpZiAoY3VycmVudFNpemVzW2lkeF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjdXJyZW50U2l6ZXMucHVzaCgnMWZyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50U2l6ZXMuc3BsaWNlKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLmlubmVyLnN0eWxlW3RhcmdldF0gPSBgJHt0aGlzLm9wdHMuc2VwYXJhdG9yV2lkdGh9cHggJHtjdXJyZW50U2l6ZXMuam9pbihgICR7dGhpcy5vcHRzLnNlcGFyYXRvcldpZHRofXB4IGApfSAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICB9XHJcblxyXG4gICAgX2dlbmVyYXRlU2VwYXJhdG9yICgpIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnbWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcicpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdHMucmVwcm9wb3J0aW9uYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtLnN0eWxlW3RoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc/ICdoZWlnaHQnOiAnd2lkdGgnXSA9IGAke3RoaXMub3B0cy5zZXBhcmF0b3JXaWR0aH1weGA7XHJcbiAgICAgICAgZWxlbS5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IGlubmVyID0gUGFuZWxCYXNlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGlubmVyLmNsYXNzTGlzdC5hZGQoJ21hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEnKTtcclxuICAgICAgICBlbGVtLmFwcGVuZChpbm5lcik7XHJcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldi5zY3JlZW5ZID09PSAwIHx8IHRoaXMub3B0cy5yZXByb3BvcnRpb25hYmxlID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsY0dyaWRTaXplKGV2LnRhcmdldCwgdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gZXYucGFnZVkgOiBldi5wYWdlWCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBlbGVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a2Q6KaB57Sg44Gu56e75YuV44Gr6L+95b6T44GX44G+44GZ44CCXHJcbiAgICAgKi9cclxuICAgIGNoaWxkTW92ZUhhbmRsZXIgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuX2xhc3RUYXJnZXRSYW5nZSA9IHRoaXMuY2hpbGRyZW4ubWFwKGUgPT4gZS5lbGVtZW50LmdldENsaWVudFJlY3RzKClbMF1bdGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJz8gJ2hlaWdodCc6ICd3aWR0aCddKTtcclxuICAgICAgICBldnQuZGV0YWlsLnRhcmdldC5ub3JtYWwoKGV2dC5kZXRhaWwuZXYucGFnZVggfHwgZXZ0LmRldGFpbC5ldi50b3VjaGVzWzBdLnBhZ2VYKSk7XHJcbiAgICAgICAgZXZ0LmRldGFpbC50YXJnZXQucGFyZW50ID0gdGhpcy5yb290O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByb290ICgpIHtcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChwYXJlbnQ/LnBhcmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfVxyXG59XHJcbiIsImNvbnN0IHN0eWxlID0gYFxyXG4ubWFnaWNhLXBhbmVsLXdyYXBwZXIge1xyXG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdyYXBwZXIub3gtcyB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdyYXBwZXIub3ktcyB7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWJhc2Uge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgbWluLXdpZHRoOiAxMDAlO1xyXG4gICAgbWluLWhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdyB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcGFkZGluZzogNHB4O1xyXG4gICAgYmFja2dyb3VuZDogbWlkbmlnaHRibHVlO1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC10aXRsZWJhciB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBoZWlnaHQ6IDEuNXJlbTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHVzZXItc2VsZWN0Om5vbmU7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IGNhbGMoMi41cmVtICogMyk7XHJcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gPiAubWFnaWNhLXBhbmVsLXRpdGxlYmFyLm1heGltdW0tZGlzYWJsZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC10aXRsZWJhci5tYXhpbXVtLWRpc2FibGUgfiAubWFnaWNhLXBhbmVsLWJ1dHRvbi1hcmVhIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtdGl0bGViYXIgPiAqIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lciB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgIHBhZGRpbmc6IDFweDtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1pbm5lci5veC1zIHtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtaW5uZXIub3ktcyB7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2Uge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmxlZnQge1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiA0cHg7XHJcbiAgICBjdXJzb3I6IGV3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnJpZ2h0IHtcclxuICAgIHRvcDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIGN1cnNvcjogZXctcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UubGVmdDphY3RpdmUsXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5yaWdodDphY3RpdmUge1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3Age1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIGhlaWdodDogNHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBjdXJzb3I6IG5zLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbSB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgaGVpZ2h0OiA0cHg7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGN1cnNvcjogbnMtcmVzaXplO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UudG9wOmFjdGl2ZSxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbTphY3RpdmUge1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AubGVmdCxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5yaWdodCxcclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5sZWZ0LFxyXG4ubWFnaWNhLXBhbmVsLWVkZ2UuYm90dG9tLnJpZ2h0IHtcclxuICAgIGhlaWdodDogNHB4O1xyXG4gICAgd2lkdGg6IDRweDtcclxuICAgIHRvcDogdW5zZXQ7XHJcbiAgICBsZWZ0OiB1bnNldDtcclxuICAgIHJpZ2h0OiB1bnNldDtcclxuICAgIGJvdHRvbTogdW5zZXQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS50b3AubGVmdCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgY3Vyc29sOiBud3NlLXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLnRvcC5yaWdodCB7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGN1cnNvbDogbmVzdy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtZWRnZS5ib3R0b20ubGVmdCB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgY3Vyc29sOiBuZXN3LXJlc2l6ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1lZGdlLmJvdHRvbS5yaWdodCB7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGN1cnNvbDogbndzZS1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0ge1xyXG4gICAgcGFkZGluZzogMHB4O1xyXG4gICAgdG9wOiAwICFpbXBvcnRhbnQ7XHJcbiAgICBsZWZ0OiAwICFpbXBvcnRhbnQ7XHJcbiAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gLm1hZ2ljYS1wYW5lbC1lZGdlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0gLm1hZ2ljYS1wYW5lbC10aXRsZWJhciB7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMS41cmVtICsgNHB4KTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC13aW5kb3cubWF4aW11bSA+IC5tYWdpY2EtcGFuZWwtaW5uZXIge1xyXG4gICAgd2lkdGg6IGNhbGMoMTAwJSAtIDJweCkgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogY2FsYygxMDAlIC0gMS41cmVtIC0gNnB4KSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5tYXhpbXVtID4gLm1hZ2ljYS1wYW5lbC10aXRsZWJhci5tYXhpbXVtLWRpc2FibGUgfiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIGhlaWdodDogY2FsYygxMDAlIC0gMnB4KSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy5taW5pbXVtIHtcclxuICAgIHdpZHRoOiAxODZweDtcclxuICAgIGJvdHRvbTogMCAhaW1wb3J0YW50O1xyXG4gICAgdG9wOiB1bnNldCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXdpbmRvdy50b3Btb3N0IHtcclxuICAgIHotaW5kZXg6IDY1NTM1ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtbW9kYWwtYmxvY2tlciB7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLC41KTtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHotaW5kZXg6IDY1NTM1ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1pbmltdW0gPiAubWFnaWNhLXBhbmVsLWlubmVyIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtd2luZG93Lm1pbmltdW0gPiAubWFnaWNhLXBhbmVsLWVkZ2Uge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24tYXJlYSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIGhlaWdodDogY2FsYygxLjVyZW0gKyA0cHgpO1xyXG4gICAgdXNlci1zZWxlY3Q6bm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24ge1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEuNXJlbSArIDRweCk7XHJcbiAgICBib3JkZXI6IG5vbmU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIHdpZHRoOiAyLjVyZW07XHJcbiAgICBmb250LXNpemU6IDFyZW07XHJcbiAgICBiYWNrZ3JvdW5kOiBtaWRuaWdodGJsdWU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtYnV0dG9uLmRlbnkge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1idXR0b24uY2xvc2Uge1xyXG4gICAgYmFja2dyb3VuZDogIzcwMTkxOTtcclxufVxyXG4ubWFnaWNhLXBhbmVsLWJ1dHRvbi5jbG9zZS5vbmFjdGl2ZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZTYzMjMyO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB6LWluZGV4OiAwO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIub3gtcyB7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIub3ktcyB7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogbWlkbmlnaHRibHVlO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBtaWRuaWdodGJsdWU7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB6LWluZGV4OiAxMDA7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQ6IG1pZG5pZ2h0Ymx1ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIHtcclxuICAgIGJhY2tncm91bmQ6IG1pZG5pZ2h0Ymx1ZTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IuZW1wdHkge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIGZvbnQtc2l6ZTogM3JlbTtcclxuICAgIHdpZHRoOiA1cmVtO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgb3BhY2l0eTogMC41O1xyXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNSwyNSwxMTIsIDAuMyk7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIHdpZHRoOiAxMHJlbTtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3IgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgbGVmdDogLTVyZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOmZpcnN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgbGVmdDogMDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvcml6b250YWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6bGFzdC1vZi10eXBlIC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLWRyb3BhcmVhIHtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgbGVmdDogdW5zZXQ7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTByZW07XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICB0b3A6IC01cmVtO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIudmVydGljYWwgPiAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3I6Zmlyc3Qtb2YtdHlwZSAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvci1kcm9wYXJlYSB7XHJcbiAgICB0b3A6IDA7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCA+IC5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgPiAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpsYXN0LW9mLXR5cGUgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgdG9wOiB1bnNldDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLnZlcnRpY2FsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguaG92ZXIpOk5PVCguZGlzYWJsZSk6Tk9UKDpmaXJzdC1vZi10eXBlKTpOT1QoOmxhc3Qtb2YtdHlwZSk6aG92ZXIge1xyXG4gICAgY3Vyc29yOiBucy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3Jpem9udGFsID4gLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciA+IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yOk5PVCguaG92ZXIpOk5PVCguZGlzYWJsZSk6Tk9UKDpmaXJzdC1vZi10eXBlKTpOT1QoOmxhc3Qtb2YtdHlwZSk6aG92ZXIge1xyXG4gICAgY3Vyc29yOiBldy1yZXNpemU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci5ob3ZlciAubWFnaWNhLXBhbmVsLXN0YWNrLXNlcGFyYXRvcjpOT1QoLmVtcHR5KSB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay13cmFwcGVyLmhvdmVyLmVtcHR5IC5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLmVtcHR5IHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG92ZXIgLm1hZ2ljYS1wYW5lbC1zdGFjay1zZXBhcmF0b3ItZHJvcGFyZWEge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2stc2VwYXJhdG9yLmhvdmVyIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2std3JhcHBlci52ZXJ0aWNhbCAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLXdyYXBwZXIuaG9yaXpvbnRhbCAubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogMWZyO1xyXG59XHJcblxyXG4ubWFnaWNhLXBhbmVsLXN0YWNrLWlubmVyIC5tYWdpY2EtcGFuZWwtd2luZG93Lm1heGltdW0ge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdG9wOiB1bnNldCAhaW1wb3J0YW50O1xyXG4gICAgbGVmdCB1bnNldCAhaW1wb3J0YW50O1xyXG4gICAgei1pbmRleDogdW5zZXQgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hZ2ljYS1wYW5lbC1zdGFjay1pbm5lciAubWFnaWNhLXBhbmVsLWJ1dHRvbi5tYXhpbXVtIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5tYWdpY2EtcGFuZWwtc3RhY2staW5uZXIgLm1hZ2ljYS1wYW5lbC1idXR0b24ubWluaW11bSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcbmA7XHJcblxyXG5jb25zdCBWYWx1ZSA9IHtcclxuICAgIHN0eWxlLFxyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShWYWx1ZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWYWx1ZTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQmFzZUNvbnRhaW5lciBmcm9tICcuL2Jhc2UtY29udGFpbmVyLmpzJztcclxuaW1wb3J0IFBhbmVsIGZyb20gJy4vcGFuZWwuanMnO1xyXG5pbXBvcnQgU3RhY2tDb250YWluZXIgZnJvbSAnLi9zdGFjay1jb250YWluZXIuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge0Jhc2VDb250YWluZXIsIFBhbmVsLCBTdGFja0NvbnRhaW5lcn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==