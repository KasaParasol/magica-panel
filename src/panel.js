import PanelBase from "./panel-base";

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
        minSize: {x: 112, y: 0},
        defaultSize: {x: 320, y: 240},
        title: '',
        closeable: true,
        autoClose: true,
        minimum: {enable: true, showTitlebar: true},
        maximum: {enable: true, showTitlebar: true},
        defaultMode: 'normal',
        modal: 'modaless',
        overflowX: 'scroll',
        overflowY: 'scroll',
        additionalClassName: '',
        attributes: []
    }

    /**
     * UIを格納するパネルエリア。ウィンドウ・ペイン表示が可能
     *
     * @param { HTMLElement }             element 自身のパネルにするHTML要素
     * @param { PanelOptions }            opts    オプション
     * @param { HTMLElement | PanelBase } content 内容コンテンツ
     */
    constructor (element, opts = Panel.DEFAULT_OPTIONS, content) {
        super(element, Object.assign(opts, Panel.DEFAULT_OPTIONS, {...opts}), content);

        this.element.classList.add('magica-panel-window');
        this.inner.className = 'magica-panel-inner';
        if (opts.overflowX === 'scroll') this._inner.classList.add('ox-s');
        if (opts.overflowY === 'scroll') this._inner.classList.add('oy-s');
        if (opts.defaultMode === 'normal') {
            this._inner.style.width = `${opts.defaultSize.x}px`;
            this._inner.style.height = `${opts.defaultSize.y}px`;
        }

        if (content instanceof HTMLElement) this.inner.appendChild(content);

        // タイトルバーを追加
        const titlebar = (typeof opts?.title === 'object' && opts.title instanceof HTMLElement)?
                            opts.title:
                            document.createElement('div');
        if (typeof opts?.title === 'string') titlebar.innerText = opts.title;
        this.titlebar = titlebar;
        this.titlebar.draggable = true;
        this.element.insertBefore(titlebar, this.element.children[0]);
        this.titlebar.classList.add('magica-panel-titlebar');
        this.titlebar.addEventListener('mousedown', (ev) => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('drag', (ev) => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('dragend', (ev) => this._moveTitlebarHandler(ev));
        this.titlebar.addEventListener('dragstart', (ev) => {
            ev.dataTransfer.setDragImage( new Image(), 0, 0 );
            ev.dataTransfer.setData("text", 'panel');}, false);

        this._addResizeArea();

        // ボタンエリアを追加
        const buttonarea = document.createElement('div');
        buttonarea.classList.add('magica-panel-button-area');
        this.element.appendChild(buttonarea);

        // 閉じるボタンを追加
        const closebutton = document.createElement('button');
        closebutton.innerText = '×';
        closebutton.classList.add('magica-panel-button', 'close');
        buttonarea.appendChild(closebutton);

        // 最大化/復元ボタンを追加
        const maximumbutton = document.createElement('button');
        maximumbutton.innerText = '❐';
        maximumbutton.classList.add('magica-panel-button', 'maximum');
        maximumbutton.addEventListener('click', () => {
            if (this.element.classList.contains('maximum')) {
                this.normal();
            }
            else {
                this.maximum();
            }
        })
        buttonarea.insertBefore(maximumbutton, closebutton);


        // 最小化/復元ボタンを追加
        const minimumbutton = document.createElement('button');
        minimumbutton.innerText = '-';
        minimumbutton.classList.add('magica-panel-button');
        buttonarea.insertBefore(minimumbutton, maximumbutton);
    }

    _addResizeArea () {
        // リサイズ領域を追加
        this.edges = {};
        for (const target of [['top'], ['bottom'], ['left'], ['right'], ['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']]) {
            const edge = document.createElement('div');
            edge.classList.add('magica-panel-edge', ...target);
            this.element.appendChild(edge);
            edge.draggable = 'true';
            edge.addEventListener('mousedown', (ev) => this._resizeAreaHandler(ev));
            edge.addEventListener('drag', (ev) => this._resizeAreaHandler(ev));
            edge.addEventListener('dragstart', (ev) => ev.dataTransfer.setDragImage( new Image(), 0, 0 ), false);
            this.edges[target] = edge;
        }
    }

    /***
     * @param { MouseEvent } ev
     */
    _resizeAreaHandler (ev) {
        if (ev.type === 'mousedown') {
            this._clickstart = {x: ev.pageX, y: ev.pageY};
            this._startrect = {x: this.element.clientWidth, y: this.element.clientHeight};
        }
        else if (ev.type === 'drag' ) {
            if (ev.screenY === 0) {
                return;
            }
            if (ev.target.classList.contains('top')) {
                this.element.style.top = `${this.parent.element.scrollTop + ev.pageY}px`;
                this.inner.style.height = `${this._startrect.y + this._clickstart.y - ev.pageY - 4}px`;
            }
            if (ev.target.classList.contains('bottom')) {
                this.inner.style.height = `calc(${this._startrect.y + ev.pageY - this._clickstart.y - 8}px - 1.5rem)`;
            }
            if (ev.target.classList.contains('left')) {
                this.element.style.left = `${this.parent.element.scrollLeft + ev.pageX}px`;
                const width = this._startrect.x + this._clickstart.x - ev.pageX - 4;
                this.inner.style.width = `${width > this.opts.minSize.x? width: this.opts.minSize.x}px`;
            }
            if (ev.target.classList.contains('right')) {
                const width = this._startrect.x + ev.pageX - this._clickstart.x - 8;
                this.inner.style.width = `${width > this.opts.minSize.x? width: this.opts.minSize.x}px`;
            }
        }
    }

    /***
     * @param { MouseEvent } ev
     */
    _moveTitlebarHandler (ev) {
        if (ev.type === 'mousedown') {
            this._clickstart = {x: ev.offsetX, y: ev.offsetY};
        }
        else if (ev.type === 'drag') {
            if (ev.screenY === 0) {
                return;
            }
            this.element.style.left = `${(this.parent.element.scrollLeft + ev.pageX) - this._clickstart.x}px`;
            this.element.style.top = `${(this.parent.element.scrollTop + ev.pageY) - this._clickstart.y}px`;

            this.dispatchEvent(new CustomEvent('move', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
        }
        else if (ev.type === 'dragend') {
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
                this.element.style.left = `0px`;
            }
            if (currentRect.top < 0) {
                this.element.style.top = `0px`;
            }
            this.dispatchEvent(new CustomEvent('moved', {detail: {rect: this.element.getClientRects()[0], ev, target: this}}));
        }
    }

    maximum () {
        this.element.classList.add('maximum');
    }

    normal () {
        this.element.classList.remove('maximum');
    }


}
