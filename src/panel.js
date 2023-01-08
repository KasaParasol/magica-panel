import PanelBase from './panel-base';
import BaseContainer from './base-container';

/**
 * UIを格納するパネルエリア。ウィンドウ表示・ほかパネルへの格納が可能
 */
export default class Panel extends PanelBase
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
        super(document.createElement('div'), Object.assign(opts, Panel.DEFAULT_OPTIONS, {...opts}), content);

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

        if (content instanceof HTMLElement) {
            this.inner.append(content);
        }

        // タイトルバーを追加
        const titlebar = document.createElement('div');
        if (typeof opts?.title === 'string') {
            const span = document.createElement('span');
            span.textContent = opts.title;
            titlebar.append(span);
        }
        else if (typeof opts?.title === 'object' && opts.title instanceof HTMLElement) {
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
            ev.dataTransfer.setDragImage(new Image(), 0, 0);
            ev.dataTransfer.setData('text/plain', 'panel');
        }, false);

        this._addResizeArea();

        // ボタンエリアを追加
        const buttonarea = document.createElement('div');
        buttonarea.classList.add('magica-panel-button-area');
        this.element.append(buttonarea);

        // 閉じるボタンを追加
        const closebutton = document.createElement('button');
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
        const maximumbutton = document.createElement('button');
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
        const minimumbutton = document.createElement('button');
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
            const edge = document.createElement('div');
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

            this.dispatchEvent(new CustomEvent('resize', {detail: {target: this}}));
        }
    }

    /***
     * @param { MouseEvent } ev
     */
    _moveTitlebarHandler (ev) {
        if ((this.element.classList.contains('maximum') && this.parent instanceof BaseContainer)
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
                this.dispatchEvent(new CustomEvent('move', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
                break;
            }

            case 'dragend': {
                this.adjustWindowPosition();
                this.dispatchEvent(new CustomEvent('moved', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
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
        this.dispatchEvent(new CustomEvent('resize', {detail: {target: this}}));
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

        this.dispatchEvent(new CustomEvent('normalized', {detail: {target: this}}));
        this.dispatchEvent(new CustomEvent('resize', {detail: {target: this}}));
    }

    minimum () {
        this._left = this.element.getClientRects()[0]?.left || 0;
        this.element.classList.remove('maximum');
        this.element.classList.add('minimum');
        this.dispatchEvent(new CustomEvent('minimized', {detail: {target: this}}));
    }

    resizeParentHandler (_evt) {
        if (!this.element.classList.contains('maximum') && !this.element.classList.contains('minimum')) {
            this.adjustWindowPosition();
        }

        this.dispatchEvent(new CustomEvent('resize', {detail: {target: this}}));
    }

    changeParentHandler (evt) {
        super.changeParentHandler(evt);
        if (this.opts.modal === 'modal') {
            this.outer = document.createElement('div');
            this.outer.classList.add('magica-panel-modal-blocker');
            this.element.parentElement.insertBefore(this.outer, this.element);
            this.outer.append(this.element);
            const rect = this.element.getClientRects()[0];
            if (rect) {
                this.element.style.left = `calc(50% - ${rect.width / 2}px)`;
                this.element.style.top = `calc(50% - ${rect.height / 2}px)`;
            }
        }

        this.dispatchEvent(new CustomEvent('resize', {detail: {target: this}}));
    }
}
