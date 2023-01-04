/**
 * @typedef CoordinationOptions
 *
 * @property { number } x X方向(指定があれば)
 * @property { number } y Y方向(指定があれば)
 */

import Value from "./values";

/**
 * @typedef ResizeableOptions
 *
 * @property { boolean } enable       有効・無効
 * @property { boolean } showTitlebar 適用時にタイトルバーを表示するか
 */

/**
 * @typedef PanelOptions
 *
 * @property { 'panel' }                          type                パネル種別
 * @property { CoordinationOptions }              minSize             最小ウィンドウサイズ(指定があれば)
 * @property { CoordinationOptions }              maxSize             最大ウィンドウサイズ(指定があれば)
 * @property { CoordinationOptions }              position            初期位置(左上)
 * @property { CoordinationOptions }              defaultSize         初期サイズ(320x240, タイトルバー、ウィンドウ枠線含まず)
 * @property { string | HTMLElement }             title               タイトル
 * @property { boolean }                          closeable           バツボタンを出現させる
 * @property { boolean }                          autoClose           子パネルがなくなれば自動的に閉じる
 * @property { ResizeableOptions }                minimum             最小化の挙動
 * @property { ResizeableOptions }                maximum             最大化の挙動
 * @property { 'maximum' | 'minimum' | 'normal' } defaultMode         初期表示状態
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
 * @property { 'scroll' | 'hidden' }                    overflow            内容コンテンツのコレクションが溢れた場合
 * @property { boolean }                                reproportionable    コレクションの比率を操作できるか
 * @property { 'disable' | 'swaponly' | 'full' }        dockable            コレクションの脱着操作ができるか
 * @property { number }                                 separatorWidth      分割境界線の幅(1～)
 * @property { string }                                 additionalClassName パネルに追加で付けるクラス名
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

export default class PanelBase extends EventTarget
{
    static _initialized = false;

    /**
     * 
     * @param { HTMLElement } element 
     * @param { PanelOptions | StackPanelOptions | BaseContainerOptions } opts
     * @param { (PanelBase | HTMLElement)[] } children
     */
    constructor (element, opts, ...children) {
        super();

        this._changeParentHandler = (ev) => {
            this.changeParentHandler(ev);
        };
        this._childMovedHandler = (ev) => {
            this.childMovedHandler(ev);
        };
        this._childMoveHandler = (ev) => {
            this.childMoveHandler(ev);
        };

        this._opts = opts;
        this._element = element;
        // 自身要素を初期化する
        Array.from(element.children).forEach(e => e.remove());

        this._inner = document.createElement('div');
        this._element.appendChild(this._inner);
        this._element.addEventListener('mousedown', () => this.active());

        this._children = [];
        children.forEach(e => {
            if (e instanceof PanelBase) e.parent = this;
        });

        /**
         * @type { PanelBase | undefined }
         */
        this._parent = undefined;
        PanelBase.init();
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
        if (!PanelBase._initialized) {
            PanelBase.appendStyleElements();
            // TODO: 
        }
        PanelBase._initialized = true;
    }

    /**
     * スタイルをヘッダに追加します。
     */
    static appendStyleElements () {
        const style = document.createElement('style');
        style.textContent = Value.style;
        document.head.appendChild(style);
    }

    get parent () {
        return this._parent;
    }

    set parent (val) {
        if (this._parent) {
            this._parent.removeChild(this);
            this._parent.removeEventListener('resize', this.resizeParentHandler);
        }
        this._parent = val;
        this._parent.appendChild(this);
        this._parent.addEventListener('resize', this.resizeParentHandler);
        this.dispatchEvent(new CustomEvent('changeparent', {detail: {target: this}}));
    }

    resizeParentHandler () {
        throw new Error('impl');
    }

    /**
     * 
     * @param {{rect: DOMRect, ev: DragEvent}} rect
     */
    childMoveHandler (evt) {
        throw new Error('impl');
    }

    /**
     * 
     * @param {{rect: DOMRect, ev: DragEvent}} rect
     */
    childMovedHandler (evt) {
        throw new Error('impl');
    }

    changeParentHandler (evt) {
        this.dispatchEvent(new CustomEvent('changeparent', {detail: {target: this}}));
    }

    removeChild (val) {
        this._inner.removeChild(val.element);
        this._children = this._children.filter(e => e !== val);
        val.removeEventListener('move', this._childMoveHandler);
        val.removeEventListener('remove', this._childMovedHandler);
        this.removeEventListener('changeparent', val._changeParentHandler);
    }

    appendChild (val, ref) {
        const next = ref?.nextElementSibling;
        if (next) {
            this._inner.insertBefore(val.element, next);
        }
        else {
            this._inner.appendChild(val.element);
        }
        if (next) {
            const idx = Array.from(this._inner.children).filter(e => e.classList.contains('magica-panel-window')).findIndex(e => e.nextElementSibling === ref);
            this._children.splice(idx + 1, 0, val);
        }
        else {
            this._children.push(val);
        }
        val.addEventListener('move', this._childMoveHandler);
        val.addEventListener('moved', this._childMovedHandler);
        this.addEventListener('changeparent', val._changeParentHandler);
    }

    active () {
        if (this._parent) this._parent.modifyZIndex(this);
    }

    modifyZIndex (active) {
        const windows = this._children.filter(e => e.opts.type === 'panel');
        if (windows.find(e => e === active)) {
            const targets = windows.filter(e => e !== active);
            let idx = 0;
            for (; idx < targets.length; idx++) {
                const target = targets[idx];
                target.element.style.zIndex = `${idx}`;
            }
            active.element.style.zIndex = `${idx}`;
        }
    }
}
