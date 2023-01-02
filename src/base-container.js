import PanelBase from "./panel-base";
import StackContainer from "./stack-container";
import Panel from "./panel";

/**
 * すべての親となる要素。ツリー上に1つ一番親にのみ利用できる。
 * ウィンドウはこの中しか移動できない。
 */
export default class BaseContainer extends PanelBase
{
    /**
     * @type { BaseContainerOptions }
     */
    static DEFAULT_OPTIONS = {
        type: 'base',
        overflowX: 'scroll',
        overflowY: 'scroll'
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
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                if (elem.clientWidth !== this._elemrect.x
                || elem.clientHeight !== this._element.y) {
                    this._elemrect = {x: elem.clientWidth, y: elem.clientHeight};
                    this.dispatchEvent(new CustomEvent('resize', {detail: this._elemrect}));
                }
            });
            ro.observe(elem);
        }
        else {
            const f = () => {
                window.requestAnimationFrame(() => {
                    if (elem.clientWidth !== this._elemrect.x
                    || elem.clientHeight !== this._element.y) {
                        this._elemrect = {x: elem.clientWidth, y: elem.clientHeight};
                        this.dispatchEvent(new CustomEvent('resize', {detail: this._elemrect}));
                    }
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
                if (currentRect.right < maxX) this.inner.style.width = `${maxX - this.inner.clientLeft}px`;
                else if (currentRect.right > maxX) this.inner.style.width = '';

            }
            if (this.opts.overflowY === 'scroll') {
                const maxY = Math.max(...rects.map(e => e.bottom + this.element.scrollTop));
                if (currentRect.bottom < maxY) this.inner.style.height = `${maxY - this.inner.clientTop}px`;
                else if (currentRect.bottom > maxY) this.inner.style.height = '';
            }
        }
        this.dispatchEvent(new CustomEvent('childrenmove', {detail: {...evt.detail, target: evt.target}}));
    }

    childMovedHandler (evt) {
        this.dispatchEvent(new CustomEvent('childrenmoved', {detail: {...evt.detail, target: evt.target}}));
    }
}
