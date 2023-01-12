import Value from './values.js';

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

export default class PanelBase extends EventTarget
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
        style.textContent = Value.style;
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
}
catch {
    PanelBase.window = undefined;
    PanelBase.document = undefined;
    PanelBase.CustomEvent = undefined;
}
