import PanelBase from "./panel-base";

/**
 * 垂直または水平方向への整列やタブ切り替えによるパネルのスイッチ(3個のうちいずれか1つ)を提供します。
 */
export default class StackContainer extends PanelBase
{
    /**
     * @type { StackContainerOptions }
     */
    static DEFAULT_OPTIONS = {
        type: 'stack',
        direction: 'vertical',
        overflow: 'scroll',
        reproportionable: true,
        dockable: 'full',
        separatorWidth: 2,
        additionalClassName: '',
        attributes: [],
        template: undefined,
        panelAddArea: undefined
    }

    /**
     * UIを格納するパネルエリア。ウィンドウ・ペイン表示が可能
     *
     * @param { HTMLElement }                element 自身のパネルにするHTML要素
     * @param { StackContainerOptions }      opts    オプション
     * @param { (StackContainer | Panel)[] } children 内容コンテンツ
     */
    constructor (element, opts = StackContainer.DEFAULT_OPTIONS, ...children) {
        super(element, Object.assign(opts, StackContainer.DEFAULT_OPTIONS, {...opts}), ...children);

        this._calcGridSize(undefined, undefined, this.opts.template);
        this.element.classList.add('magica-panel-stack-wrapper');
        this.inner.classList.add('magica-panel-stack-inner');
        if (this.opts.direction === 'vertical') this.element.classList.add('vertical');
        if (this.opts.direction === 'horizontal') this.element.classList.add('horizontal');
        if (typeof this.opts.direction === 'object') {
            this.element.classList.add('tab');
        }
        else {
            if (!this.addareas) {
                this.addareas = [];
                this.element.classList.add('empty');
            }

            const addArea = document.createElement('div');
            addArea.classList.add('magica-panel-stack-add', 'empty');
            if (typeof this.opts.panelAddArea === 'object') {
                addArea.appendChild(this.opts.panelAddArea);
            }
            else {
                addArea.innerText = this.opts.panelAddArea? this.opts.panelAddArea: this.opts.direction === 'vertical'? '▤': '▥';
            }
            this.addareas.push(addArea);
            this.element.appendChild(addArea);
        }
        this._movehandler = (evt) => {
            const mouseY = this.root.element.scrollTop + evt.detail.ev.pageY;
            const mouseX = this.root.element.scrollLeft + evt.detail.ev.pageX;
            const elemRect = this.element.getClientRects()[0];
            if (elemRect.top < mouseY && mouseY < elemRect.bottom
            && elemRect.left < mouseX && mouseX < elemRect.right
            && evt.detail.target.opts.maximum.enable === true && this.opts.dockable == 'full') {
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

        this._movedhandler = (evt) => {
            const mouseY = this.root.element.scrollTop + evt.detail.ev.pageY;
            const mouseX = this.root.element.scrollLeft + evt.detail.ev.pageX;
            const elemRect = this.element.getClientRects()[0];
            if (elemRect.top < mouseY && mouseY < elemRect.bottom
            && elemRect.left < mouseX && mouseX < elemRect.right
            && evt.detail.target.opts.maximum.enable === true && this.opts.dockable == 'full') {
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
        return super.parent
    }

    set parent (val) {
        super.parent = val;
        this.changeParentHandler(undefined);
    }

    changeParentHandler (evt) {
        super.changeParentHandler(evt);
        if (this.root) {
            if (this._root) {
                this._root.removeEventListener('childrenmove', this._movehandler);
                this._root.removeEventListener('childrenmove', this._movedhandler);
            }
            this.root.addEventListener('childrenmove', this._movehandler);
            this.root.addEventListener('childrenmoved', this._movedhandler);
            this._root = this.root;
        }
    }

    appendChild (val) {
        if (!this.addareas) this.addareas = [];
        if (this.inner.children.length === 0) {
            const sep = this._generateSeparator();
            this.addareas.push(sep.children[0]);
            this.inner.appendChild(sep);
        }

        const windowRange = this._lastTargetRange;

        let ranges = this.children.map(e => e.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width']);

        if (this._lastref) {
            const idx = this.children.map(e => e.element).indexOf(this._lastref.previousElementSibling);
            const insertTargetRange = (ranges[idx] || 0) + (ranges[idx + 1] || 0) / 2;
            const insertRange = Math.min(insertTargetRange, windowRange) - this.opts.separatorWidth;
            if (~idx && ranges[idx + 1]) {
                const [smallIdx, largeIdx] = ranges[idx] > ranges[idx + 1]? [idx + 1, idx]: [idx, idx + 1];
                const ratio = ranges[smallIdx] / ranges[largeIdx];
                const smallSize = Math.round(insertRange / 2 * ratio);
                ranges[smallIdx] -= smallSize;
                ranges[largeIdx] -= (insertRange - smallSize);
            }
            else if (!~idx) {
                ranges[idx + 1] -= insertRange;
            }
            else {
                ranges[idx] -= insertRange;
            }
            ranges.splice(idx + 1, 0, insertRange - this.opts.separatorWidth);
        }
        ranges = ranges.map(e => `${e}px`);

        super.appendChild(val, this._lastref);
        if (val.maximum) val.maximum();

        const sep = this._generateSeparator();
        this.addareas.push(sep.children[0]);
        if (val.element.nextElementSibling) {
            this.inner.insertBefore(sep, val.element.nextElementSibling);
        }
        else {
            this.inner.appendChild(sep);
        }
        this.element.classList.remove('empty');
        this._calcGridSize(undefined, undefined, ranges.length === 0? undefined: ranges);
    }

    removeChild (val) {
        let ranges = typeof this._lastTargetRange === 'object'? this._lastTargetRange: this.children.map(e => e.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width']);
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
        val.element.nextElementSibling.remove();

        super.removeChild(val);
        if (this.inner.children.length === 1) {
            this.addareas.filter(e => e !== this.inner.children[0].children[0]);
            this.inner.children[0].remove();
            this.element.classList.add('empty');
        }
        this._calcGridSize(undefined, undefined, ranges.length === 0? undefined: ranges);
    }

    _calcGridSize (sep, pos, template) {
        const target = this.opts.direction === 'vertical'? 'gridTemplateRows': 'gridTemplateColumns';
        const currentSizes = template || this.inner.style[target].split(' ').filter(e => e !== '').filter((_e, i ) => i % 2 !== 0);
        if (this.children.length === 0) {
            this.inner.style[target] = '';
            return;
        }
        if (this.children.length === 1) {
            currentSizes[0] = '1fr';
        }
        if (sep && sep.previousElementSibling && sep.nextElementSibling && pos !== undefined) {
            const bros = Array.from(this.inner.children).filter(e => !e.classList.contains('magica-panel-stack-add'));
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
        for (let idx = 0; idx < this.children.length; idx++) {
            if (currentSizes[idx] === undefined) currentSizes.push('1fr');
        }
        currentSizes.splice(this.children.length);
        this.inner.style[target] = `${this.opts.separatorWidth}px ${currentSizes.join(` ${this.opts.separatorWidth}px `)} ${this.opts.separatorWidth}px`;
    }

    _generateSeparator () {
        const elem = document.createElement ('div');
        elem.classList.add('magica-panel-stack-add');
        elem.style[this.opts.direction === 'vertical'? 'height': 'width'] = `${this.opts.separatorWidth}px`;
        elem.draggable = true;
        const inner = document.createElement ('div');
        inner.classList.add('magica-panel-stack-add-droparea');
        elem.appendChild(inner);
        elem.addEventListener('drag', (ev) => {
            if (ev.screenY === 0) {
                return;
            }
            this._calcGridSize(ev.target, this.opts.direction === 'vertical'? ev.pageY : ev.pageX);
        });
        return elem
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
